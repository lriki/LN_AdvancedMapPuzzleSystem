/// <reference types="rpgmakermv_typescript_dts"/>
import { assert, ObjectType } from './Common'
import { MovingHelper } from './MovingHelper'
import { AMPS_SoundManager } from "./SoundManager";

const JUMP_WAIT_COUNT   = 10;

enum MovingMode
{
    GroundToGround,
    GroundToObject,
    ObjectToObject,
    ObjectToGround,
}

declare global {
    interface Game_CharacterBase {
        objectType: ObjectType;
        _ridingCharacterId: number;
        _ridderCharacterId: number;
        _waitAfterJump: number;
        _extraJumping: boolean;     // AMPS によるジャンプかどうか。見た目上の問題を修正するため微調整を入れたりする。
        _ridingScreenZPriority: number;
        _movingMode: MovingMode;
        _forcePositionAdjustment: boolean;  // moveToDir 移動時、移動先位置を強制的に round するかどうか（半歩移動の封印）
        
        _getonoffFrameMax: number;      // オブジェクト乗降時の移動モーションが不自然に見えないように補間したりするパラメータ
        _getonoffFrameCount: number;    // オブジェクト乗降時の移動モーションが不自然に見えないように補間したりするパラメータ
        _getonoffStartX: number;        // オブジェクト乗降時の移動モーションが不自然に見えないように補間したりするパラメータ
        _getonoffStartY: number;        // オブジェクト乗降時の移動モーションが不自然に見えないように補間したりするパラメータ

        isRidding(): boolean;
        falling(): boolean;
        isMapObject(): boolean;
        objectId(): number;
        objectHeight(): number;
        canRide(): boolean;
        riddingObject(): Game_CharacterBase | undefined;
        rider(): Game_CharacterBase | undefined;
        checkPassRide(x: number, y: number): boolean;

        moveStraightMain(d: number): void;
        attemptMoveGroundToGround(d: number): boolean;
        attemptJumpGroundToGround(d: number): boolean;
        attemptJumpGroove(d: number): boolean;
        attemptMoveGroundToObject(d: number, ignoreMapPassable: boolean): boolean;

        rideToObject(riddenObject: Game_CharacterBase): void;
        moveToDir(d: number, withAjust: boolean): void;
        jumpToDir(d: number, len: number, toObj: boolean): void;
        resetGetOnOffParams(): void;

        onJumpEnd(): void;
        onCharacterRideOn(): void;
    }
}

/*
 * HalfMove.js 解析メモ
 * ==========
 * まず、基本スクリプトは Game_Player.prototype.getInputDirection が
 * Input.dir4 を返しているのに対して、Input.dir8 を返すようにしている。
 * これによって 8 方向入力を受け取っている。
 * 
 * 移動処理は Game_Character.prototype.executeDiagonalMove() がエントリーポイントとなる。
 * 移動は、平行移動の場合は moveStraight、斜め移動の場合は moveDiagonally により行われる。
 * 壁ずりが発生した場合は、moveStraight を 2 回連続で呼び出して、移動できる方向に移動している。
 * そのため、壁ずり時は 1 どの移動中に moveDiagonally > moveStraight > moveStraight と3連続で呼び出されることがある。
 * 移動に成功すれば最初の moveDiagonally だけで終わる。
 * 
 */

var _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
    _Game_CharacterBase_initMembers.call(this);
    this.objectType = ObjectType.Character;
    this._ridingCharacterId = -1;
    this._ridderCharacterId = -1;
    this._waitAfterJump = 0;
    this._extraJumping = false;
    this._ridingScreenZPriority = -1;
    this._movingMode = MovingMode.GroundToGround;
    this._forcePositionAdjustment = false;
    this._getonoffFrameCount = 0;
    this._getonoffFrameMax = 0;
    this._getonoffStartX = 0;
    this._getonoffStartY = 0;
}

/**
 * 左右移動の処理
 */
// Note: どういうわけか Follower は非表示でも moveStraight が呼ばれてくる。
var _Game_CharacterBase_moveStraight = Game_CharacterBase.prototype.moveStraight;
Game_CharacterBase.prototype.moveStraight = function (d: number) {
    assert(d == 2 || d == 4 || d == 6 || d == 8);
    this.moveStraightMain(d);
};

/**
 * 斜め移動をするときに呼ばれる処理。ここではジャンプしたりオブジェクトを押したりといった AMPS 関係の処理は行わない。
 */
var _Game_CharacterBase_moveDiagonally = Game_CharacterBase.prototype.moveDiagonally;
Game_CharacterBase.prototype.moveDiagonally = function (horz: number, vert: number): void {
    if (this.isRidding()) {
        // 何かのオブジェクトに乗っている。
        // オリジナルの処理を含め、移動処理は行わない。
        // （もしここで無視しないと、HalfMove.js などで、オブジェクトに乗っているときに斜め移動を入力すると、通常の移動扱いになって見かけ上オブジェクトから降りてしまう）
    }
    else {
        _Game_CharacterBase_moveDiagonally.call(this, horz, vert);
    }
};

/**
 * 別のオブジェクトに乗っているか？
 * 
 * 半歩移動中の場合、
 * - Ground -> Object への移動は、乗っているものとする。
 * - Ground -> Object への移動は、乗っていない。
 */
Game_CharacterBase.prototype.isRidding = function(): boolean {
    return this._ridingCharacterId >= 0;
}

/**
 * 落下中であるか？
 */
Game_CharacterBase.prototype.falling = function(): boolean {
    return false;
}

Game_CharacterBase.prototype.isMapObject = function() {
    return false;
};

/**
 * Player は 0. イベントは EventId
 */
Game_CharacterBase.prototype.objectId = function(): number {
    return -1;
};

// マップオブジェクトとしての高さ。
// 高さを持たないのは -1。
Game_CharacterBase.prototype.objectHeight = function() {
    return -1;
};

Game_CharacterBase.prototype.canRide = function() {
    return this.objectHeight() >= 0;
};

/**
 * グローバル座標 x, y が、ちょうどこのオブジェクトの天板の位置であり、乗れる状態にあるか
 */
Game_CharacterBase.prototype.checkPassRide = function(x: number, y: number) {
    if (this.canRide() && !this.rider()) {
        var px = Math.round(this._x);
        var py = Math.round(this._y) - this.objectHeight();
        if (x == px && y == py) {
            return true;
        }
    }
    return false;
};

/**
 * このオブジェクトに乗っている人
 */
Game_CharacterBase.prototype.rider = function(): Game_CharacterBase | undefined {
    if (this._ridderCharacterId < 0) {
        return undefined;
    }
    else if (this._ridderCharacterId == 0) {
        return $gamePlayer;
    }
    else {
        return $gameMap.event(this._ridderCharacterId);
    }
};

/**
 * this が乗っている別のオブジェクト
 */
Game_CharacterBase.prototype.riddingObject = function(): Game_CharacterBase | undefined
{
    if (this._ridingCharacterId < 0) {
        return undefined;
    }
    else if (this._ridingCharacterId == 0) {
        return $gamePlayer;
    }
    else {
        return $gameMap.event(this._ridingCharacterId);
    }
}

var _Game_CharacterBase_screenZ = Game_CharacterBase.prototype.screenZ;
Game_CharacterBase.prototype.screenZ = function() {
    var base = _Game_CharacterBase_screenZ.call(this);
    var riddingObject = this.riddingObject();
    if (this.isRidding() && riddingObject) {
        base += riddingObject.screenZ();
    }

    if (this._ridingScreenZPriority >= 0) {
        base = this._ridingScreenZPriority;
    }

    var jumpZ = (this._extraJumping) ? 6 : 0;
    return base + jumpZ;
};

//------------------------------------------------------------------------------
// 移動メイン & 試行

/**
 * ジャンプやオブジェクトへの乗降を伴う移動のメイン処理。
 * オブジェクトを押すなど、他イベントへ影響するような処理は行わない。あくまで自分自身の移動に関係する処理を行う。
 * （他オブジェクトと関係して動くものは MovingBehavior で定義する）
 */
Game_CharacterBase.prototype.moveStraightMain = function(d: number) {
    if (this._waitAfterJump > 0) {
        this._waitAfterJump--;
        return;
    }

    this.setMovementSuccess(false);

    if (this.isRidding()) {
        // 何かのオブジェクトに乗っている。
        // オリジナルの処理を含め、移動処理は行わない。
        /*
        if (this.tryMoveObjectToGround(d)) {
        }
        else if (this.tryMoveObjectToObject(d)) {
        }
        else if (this.tryJumpObjectToGround(d)) {
        }
        else if (this.tryJumpObjectToObject(d)) {
        }
        
        this.setDirection(d);
        */
    }
    else {
        if (this.attemptMoveGroundToGround(d)) {
        }
        else if (this.attemptJumpGroundToGround(d)) {
        }
        else if (this.attemptJumpGroove(d)) {
        }
        else if (this.attemptMoveGroundToObject(d, false)) {
        }
        /*
        else if (this.tryJumpGroundToObject(d)) {
        }
        */
    }
};

/**
 * Ground > Ground (普通の移動)
 */
Game_CharacterBase.prototype.attemptMoveGroundToGround = function(d: number): boolean {

    var oldX = this._x;
    var oldY = this._y;

    _Game_CharacterBase_moveStraight.call(this, d);
    
    if (this._movementSuccess) {
        if (this._forcePositionAdjustment) {
            // Ground to Ground 移動で、オブジェクトを押すときなどの位置合わせ
            this._x = Math.round(MovingHelper.roundXWithDirection(oldX, d));
            this._y = Math.round(MovingHelper.roundYWithDirection(oldY, d));
        }

        this._movingMode = MovingMode.GroundToGround;
        return true;
    }

    return false;
}

/**
 * Jump: Ground > Ground (エッジ)
 */
Game_CharacterBase.prototype.attemptJumpGroundToGround = function(d): boolean {
    if (MovingHelper.canPassJumpGroundToGround(this, this._x, this._y, d)) {
        this.setMovementSuccess(true);
        this.jumpToDir(d, 2, false);
        this._movingMode = MovingMode.GroundToGround;
        return true;
    }
    return false;
}

/**
 * Jump: Ground > Ground (溝)
 */
Game_CharacterBase.prototype.attemptJumpGroove = function(d: number): boolean {
    if (MovingHelper.canPassJumpGroove(this, this._x, this._y, d)) {
        this.setMovementSuccess(true);
        this.jumpToDir(d, 2, false);
        this._movingMode = MovingMode.GroundToGround;
        return true;
    }
    return false;
}

/**
 * Move: Ground > Object
 * @param ignoreMapPassable: 基本は false。true は崖から落下したオブジェクトを別のオブジェクトに乗せるときの確認に使う。
 */
Game_CharacterBase.prototype.attemptMoveGroundToObject = function(d: number, ignoreMapPassable: boolean): boolean {
    var obj = MovingHelper.checkMoveOrJumpGroundToObject(this._x, this._y, d, 1, ignoreMapPassable);
    if (obj) {
        this.setMovementSuccess(true);
        // 乗る
        this.resetGetOnOffParams();
        this.moveToDir(d, true);
        this.rideToObject(obj);
        this._movingMode = MovingMode.GroundToObject;
        return true;
    }
    return false;
}

//------------------------------------------------------------------------------
// 実際に移動を行う系

/**
 * この Character を、指定したオブジェクトへ乗せる
 */
Game_CharacterBase.prototype.rideToObject = function(riddenObject: Game_CharacterBase) {
    assert(this.objectId() >= 0);
    assert(riddenObject.objectId() >= 0);

    this._ridingCharacterId = riddenObject.objectId();
    riddenObject._ridderCharacterId = this.objectId();

    var oldZ = this._ridingScreenZPriority;
    this._ridingScreenZPriority = -1;
    this._ridingScreenZPriority = this.screenZ();

    // high obj -> low obj のとき、移動始めに隠れてしまう対策
    this._ridingScreenZPriority = Math.max(this._ridingScreenZPriority, oldZ);
};

/**
 * 方向を指定して移動開始
 */
Game_CharacterBase.prototype.moveToDir = function(d: number, withAjust: boolean) {
    this._x = $gameMap.roundXWithDirection(this._x, d);
    this._y = $gameMap.roundYWithDirection(this._y, d);
    this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(d));
    this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(d));

    //var y = this._y;
    if (withAjust || this._forcePositionAdjustment) {
        this._y = Math.round(this._y);
    }
    if (this._forcePositionAdjustment) {
        this._x = Math.round(this._x);
    }
}

/**
 * 方向と距離を指定してジャンプ開始
 * @param toObj: オブジェクトへ乗ろうとするときのジャンプ。座標の位置合わせを行う。
 */
Game_CharacterBase.prototype.jumpToDir = function(d: number, len: number, toObj: boolean) {
    // x1, y1 は小数点以下を調整しない。ジャンプ後に 0.5 オフセット無くなるようにしたい
    var x1 = this._x;
    var y1 = this._y;

    if (!toObj)
    {
        // 地面への移動は端数でも普通に平行移動でよい
        x1 = Math.round(this._x);

        if (d == 2 || d == 8) {
            // 上下移動の時は端数を捨てて自然な動きに見えるようにする
        }
        else {
            y1 = Math.round(this._y);
        }
    }

    var x2 = Math.round(MovingHelper.roundXWithDirectionLong(this._x, d, len));
    var y2 = Math.round(MovingHelper.roundYWithDirectionLong(this._y, d, len));
    this.jump(x2 - x1, y2 - y1);
    this._waitAfterJump = JUMP_WAIT_COUNT;
    this._extraJumping = true;
    AMPS_SoundManager.playGSJump();
}

/**
 * ジャンプ中更新。
 * 各種ジャンプ中の見た目上の問題を修正する。
 */
var _Game_CharacterBase_updateJump = Game_CharacterBase.prototype.updateJump;
Game_CharacterBase.prototype.updateJump = function() {
    var oldJumping = this.isJumping();

    _Game_CharacterBase_updateJump.call(this);

    if (this.isRidding() && oldJumping) {
        if (this._movingMode == MovingMode.GroundToObject || this._movingMode == MovingMode.ObjectToObject) {
            // オブジェクトへ乗ろうとしているときは補完を実施して自然に移動しているように見せる
            var obj = this.riddingObject();
            if (obj) {
                var tx = obj._realX;
                var ty = obj._realY - (obj.objectHeight());
    
                var countMax = this._jumpPeak * 2;
                var t = Math.min((countMax - this._jumpCount + 1) / countMax, 1.0);
    
                this._realX = MovingHelper.linear(t, this._getonoffStartX, tx - this._getonoffStartX, 1.0);
                this._realY = MovingHelper.linear(t, this._getonoffStartY, ty - this._getonoffStartY, 1.0);

                // ここで論理座標も同期しておかないと、ジャンプ完了時の一瞬だけ画面が揺れる
                this._x = obj._x;
                this._y = obj._y - obj.objectHeight();
            }
        }
    }

    if (!this.isJumping()) {
        this._extraJumping = false;

        if (oldJumping != this.isJumping()) {
            // ジャンプ終了
            this.onJumpEnd();
        }
    }
}

Game_CharacterBase.prototype.resetGetOnOffParams = function() {
    this._getonoffFrameMax = (1.0 / this.distancePerFrame());
    this._getonoffFrameCount = 0;
    this._getonoffStartX = this._realX;
    this._getonoffStartY = this._realY;
}

//------------------------------------------------------------------------------
// タイミング通知

/**
 * ジャンプが終わり、次の移動ができる状態になった
 */
Game_CharacterBase.prototype.onJumpEnd = function() {
    var obj = this.riddingObject();
    if (obj) {
        // 何かに乗っていたら通知
        obj.onCharacterRideOn();
    }
}

/**
 * 他のキャラクターが上に乗った
 */
Game_CharacterBase.prototype.onCharacterRideOn = function() {
}
