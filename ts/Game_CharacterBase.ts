/// <reference types="rpgmakermv_typescript_dts"/>

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

import { assert, MovingMode, BehaviorType } from './Common'
import { MovingHelper } from './MovingHelper'
import { AMPS_SoundManager } from "./SoundManager";
import { MovingSequel, MovingSequel_PushMoving } from "./MovingSequel";
import { paramGuideLineTerrainTag, paramFallingSpeed, paramSlippingAnimationPattern } from './PluginParameters';
import { MovingBehavior } from './MovingBehavior';
import { AMPSManager } from './AMPSManager';

const JUMP_WAIT_COUNT   = 10;

enum FallingState {
    None,
    Failling,
    EpilogueToRide,
}

declare global {
    interface Game_CharacterBase {
        // ObjectType
        _objectTypeBox: boolean;
        _objectTypePlate: boolean;
        _objectTypeEffect: boolean;
        _objectTypeReactor: boolean;
        //_movingBehavior: MovingBehavior | undefined;
        _movingBehaviorType: BehaviorType;
        _movingBehaviorData: any;   // FIXME: _movingBehavior に含めるとシリアライズするときに都合が悪い。TypeScript から class シリアライズの上手い方法見つかればいいけど…。

        _ridderCharacterId: number; // this に乗っているオブジェクト (this の上にあるオブジェクト)
        _riddeeCharacterId: number; // this が乗っているオブジェクと (this の下にあるオブジェクト)
        _riddeePlateCharacterId: number; // this が乗っている Plate (this の下にあるオブジェクト)
        _waitAfterJump: number;
        _extraJumping: boolean;     // AMPS によるジャンプかどうか。見た目上の問題を修正するため微調整を入れたりする。
        _ridingScreenZPriority: number;
        _movingMode: MovingMode;
        _movingDirection: number;   // 自動移動の際の移動方向。滑りタイル状で向き固定のまま移動したりする。
        _forcePositionAdjustment: boolean;  // moveToDir 移動時、移動先位置を強制的に round するかどうか（半歩移動の封印）

        _moveToPlateEnter: boolean;    // 現在の移動ステップが終わったら MovingBehavior に通知する
        _moveToPlateLeave: number;    // 現在の移動ステップが終わったら MovingBehavior に通知する
        _moveToFalling: boolean;    // 現在の移動ステップが終わったら落下する
        _fallingState: FallingState;
        _fallingOriginalSpeed: number;
        _fallingOriginalThrough: boolean;
        
        _movingSequel: MovingSequel | undefined;    // source 側が持つ
        _movingSequelOwnerCharacterId: number;
        
        _getonoffFrameMax: number;      // オブジェクト乗降時の移動モーションが不自然に見えないように補間したりするパラメータ
        _getonoffFrameCount: number;    // オブジェクト乗降時の移動モーションが不自然に見えないように補間したりするパラメータ
        _getonoffStartX: number;        // オブジェクト乗降時の移動モーションが不自然に見えないように補間したりするパラメータ
        _getonoffStartY: number;        // オブジェクト乗降時の移動モーションが不自然に見えないように補間したりするパラメータ

        _positionalObject: boolean; // 位置記憶オブジェクトかどうか

        isRidding(): boolean;
        isMapObject(): boolean;
        isBoxType(): boolean;
        isPlateType(): boolean;
        isEffectType(): boolean;
        isReactorType(): boolean;
        objectId(): number;
        objectHeight(): number;
        isMover(): boolean;
        canRide(): boolean;
        riddingObject(): Game_CharacterBase | undefined;
        rider(): Game_CharacterBase | undefined;
        isFallable(): boolean;
        isFalling(): boolean;
        checkPassRide(x: number, y: number): boolean;
        isOnSlipperyTile(): boolean;
        isPositionalObject(): boolean;

        moveStraightMain(d: number): void;
        attemptMoveGroundToGround(d: number): boolean;
        attemptJumpGroundToGround(d: number): boolean;
        attemptJumpGroove(d: number): boolean;
        attemptMoveGroundToObject(d: number, ignoreMapPassable: boolean): boolean;
        attemptJumpGroundToObject(d: number): boolean;
        attemptMoveObjectToGround(d: number): boolean;
        attemptMoveObjectToObject(d: number): boolean;
        attemptJumpObjectToGround(d: number): boolean;
        attemptJumpObjectToObject(d: number): boolean;

        rideToObject(riddenObject: Game_CharacterBase): void;
        unrideFromObject(): void;
        moveToDir(d: number, withAjust: boolean): void;
        jumpToDir(d: number, len: number, toObj: boolean, extraJumping: boolean): void;
        startFall(): void;
        updateFall(): void;
        updateSlippery(): void;
        resetGetOnOffParams(): void;
        updatePlateNotification(): void;

        raiseStepEnd(): void;
        raiseStop(): void;

        onStepEnd(): void;
        onStop(): void;
        onJumpEnd(): void;
        onRideOnEvent(): void;
        onStartFalling(): void;

        isHalfMove(): boolean;
    }
}

//------------------------------------------------------------------------------
// Overrides

var _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
    _Game_CharacterBase_initMembers.call(this);
    this._objectTypeBox = false;
    this._objectTypePlate = false;
    this._objectTypeEffect = false;
    this._objectTypeReactor = false;
    this._movingBehaviorType = BehaviorType.None;
    this._ridderCharacterId = -1;
    this._riddeeCharacterId = -1;
    this._riddeePlateCharacterId = -1;
    this._waitAfterJump = 0;
    this._extraJumping = false;
    this._ridingScreenZPriority = -1;
    this._movingMode = MovingMode.Stopping;
    this._movingDirection = 0;
    this._forcePositionAdjustment = false;

    this._moveToPlateEnter = false;
    this._moveToPlateLeave = -1;
    this._moveToFalling = false;
    this._fallingState = FallingState.None;
    this._fallingOriginalSpeed = 0;
    this._fallingOriginalThrough = false;

    this._movingSequel = undefined;
    this._movingSequelOwnerCharacterId = -1;
    
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
    if ($gameMap.isPuzzleEnabled()) {
        assert(d == 2 || d == 4 || d == 6 || d == 8);
        
        if (MovingSequel_PushMoving.tryStartPushObjectAndMove(this, d)) {
            return;
        }
    
        this.moveStraightMain(d);
    }
    else {
        _Game_CharacterBase_moveStraight.call(this, d);
    }
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

var _Game_CharacterBase_isThrough = Game_CharacterBase.prototype.isThrough;
Game_CharacterBase.prototype.isThrough = function() {
    if (this.isPlateType()) {
        return true;    // Plate は常に通行可能
    }
    return _Game_CharacterBase_isThrough.call(this);
};

//------------------------------------------------------------------------------
// 

/**
 * 別のオブジェクトに乗っているか？
 * 
 * 半歩移動中の場合、
 * - Ground -> Object への移動は、乗っているものとする。
 * - Ground -> Object への移動は、乗っていない。
 */
Game_CharacterBase.prototype.isRidding = function(): boolean {
    return this._riddeeCharacterId >= 0;
}

Game_CharacterBase.prototype.isMapObject = function() {
    return this.isBoxType() || this.isEffectType() || this.isReactorType();
};
Game_CharacterBase.prototype.isBoxType = function(): boolean {
    return this._objectTypeBox;
};
Game_CharacterBase.prototype.isPlateType = function(): boolean {
    return this._objectTypePlate;
};
Game_CharacterBase.prototype.isEffectType = function(): boolean {
    return this._objectTypeEffect;
};
Game_CharacterBase.prototype.isReactorType = function(): boolean {
    return this._objectTypeReactor;
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

/**
 * 自分から移動する人。箱オブジェクトを動かせるかどうか。マップオブジェクトは基本的に false。自分から移動はしない。
 */
Game_CharacterBase.prototype.isMover = function() {
    return !this._objectTypeBox;
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
    if (this._riddeeCharacterId < 0) {
        return undefined;
    }
    else if (this._riddeeCharacterId == 0) {
        return $gamePlayer;
    }
    else {
        return $gameMap.event(this._riddeeCharacterId);
    }
}

/**
 * 落下中であるか？
 */
Game_CharacterBase.prototype.isFalling = function(): boolean {
    return this._fallingState != FallingState.None;
}

/**
 * 滑る床の上にいるか？
 */
Game_CharacterBase.prototype.isOnSlipperyTile = function(): boolean {
    return $gameMap.isSlipperyTile(this._x, this._y);
};

/**
 * 位置記憶オブジェクトか？
 */
Game_CharacterBase.prototype.isPositionalObject = function(): boolean {
    return this._positionalObject;
}

/**
 * 滑っているときのアニメーションパターン
 */
var _Game_CharacterBase_pattern = Game_CharacterBase.prototype.pattern;
Game_CharacterBase.prototype.pattern = function() {
    if (this.isOnSlipperyTile()) {
        return paramSlippingAnimationPattern;
    }
    return _Game_CharacterBase_pattern.call(this);
};

var _Game_CharacterBase_screenZ = Game_CharacterBase.prototype.screenZ;
Game_CharacterBase.prototype.screenZ = function() {

    var base = _Game_CharacterBase_screenZ.call(this);
    if (this.isPlateType()) {
        base -= (this._priorityType) * 2;
    }


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
 * （他オブジェクトと関係して動くものは MovingSequel で定義する）
 */
Game_CharacterBase.prototype.moveStraightMain = function(d: number) {
    this.setMovementSuccess(false);

    if (!this.isRidding()) {
        if (this.attemptMoveGroundToGround(d)) {
        }
        else if (this.attemptMoveGroundToObject(d, false)) {    // ジャンプより先にオブジェクトへの歩行移動を優先したい
        }
        else if (this.attemptJumpGroundToGround(d)) {
        }
        else if (this.attemptJumpGroove(d)) {
        }
        else if (this.attemptJumpGroundToObject(d)) {
        }
    }
    else {
        // 何かのオブジェクトに乗っている。
        // オリジナルの処理を含め、移動処理は行わない。
        if (this.attemptMoveObjectToGround(d)) {
        }
        else if (this.attemptMoveObjectToObject(d)) {
        }
        else if (this.attemptJumpObjectToGround(d)) {
        }
        else if (this.attemptJumpObjectToObject(d)) {
        }
        
        this.setDirection(d);
    }
};

/**
 * Ground > Ground (普通の移動)
 */
Game_CharacterBase.prototype.attemptMoveGroundToGround = function(d: number): boolean {
    // TODO: これ以上 type が増えそうなら Behavior に独立を考える
    if (this.isBoxType() && !this.isThrough()) {// && !this.isFalling()) {
        var dx = Math.round(MovingHelper.roundXWithDirectionLong(this._x, d, 1));
        var dy = Math.round(MovingHelper.roundYWithDirectionLong(this._y, d, 1));
        if ($gameMap.terrainTag(dx, dy) == paramGuideLineTerrainTag && this.isMapPassable(this._x, this._y, d)) {
            _Game_CharacterBase_moveStraight.call(this, d);
            if (this.isMovementSucceeded(this.x, this.y)) {
                this._movingDirection = d;
                return true;
            }
        }

        // 移動先、崖落ちの落下移動できる？
        if (this.isFallable()) {
            if ($gameMap.terrainTag(this._x, this._y) == paramGuideLineTerrainTag &&
                MovingHelper.checkFacingOutsideOnEdgeTile(this._x, this._y, d) &&
                !MovingHelper.checkMoveOrJumpObjectToObject(this._x, this._y, d, 1)) // 乗れそうなオブジェクトがないこと
            {
                this.moveToDir(d, false);
                this.setMovementSuccess(true);
                this._movingDirection = d;
                this._moveToFalling = true; // 1歩移動後、落下
                return true;
            }
        }
            
    }
    else {
        var oldX = this._x;
        var oldY = this._y;

        _Game_CharacterBase_moveStraight.call(this, d);
        
        if (this._movementSuccess) {
            this._movingDirection = d;
            if (this._forcePositionAdjustment) {
                // Ground to Ground 移動で、オブジェクトを押すときなどの位置合わせ
                this._x = Math.round(MovingHelper.roundXWithDirection(oldX, d));
                this._y = Math.round(MovingHelper.roundYWithDirection(oldY, d));
            }

            this._movingMode = MovingMode.GroundToGround;
            return true;
        }
    }

    return false;
}

/**
 * Jump: Ground > Ground (エッジ)
 */
Game_CharacterBase.prototype.attemptJumpGroundToGround = function(d): boolean {
    if (MovingHelper.canPassJumpGroundToGround(this, this._x, this._y, d)) {
        this.setMovementSuccess(true);
        this._movingDirection = d;
        this.jumpToDir(d, 2, false, true);
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
        this._movingDirection = d;
        this.jumpToDir(d, 2, false, false);
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
    if (obj && obj != this) {   // 高さ1のオブジェクトを上に移動しようとしたときにできない場合は this を返すので、ここではじく
        this.setMovementSuccess(true);
        this._movingDirection = d;
        this.resetGetOnOffParams();
        this.moveToDir(d, true);
        this.rideToObject(obj);
        this._movingMode = MovingMode.GroundToObject;
        return true;
    }
    return false;
}

/**
 * Jump: Ground > Object
 */
Game_CharacterBase.prototype.attemptJumpGroundToObject = function(d: number): boolean {
    var obj = MovingHelper.checkMoveOrJumpGroundToObject(this._x, this._y, d, 2, false);
    if (obj && obj != this) {   // 高さ1のオブジェクトを上に移動しようとしたときにできない場合は this を返すので、ここではじく
        this.setMovementSuccess(true);
        this._movingDirection = d;
        // 乗る
        this.resetGetOnOffParams();
        this.jumpToDir(d, 2, true, true);
        this.rideToObject(obj);
        this._movingMode = MovingMode.GroundToObject;
        return true;
    }
    return false;
};

/**
 * Object > Ground (普通の移動)
 */
Game_CharacterBase.prototype.attemptMoveObjectToGround = function(d: number): boolean {
    assert(this.isRidding());
    if (MovingHelper.checkMoveOrJumpObjectToGround(this, this._x, this._y, d, 1)) {
        this.setMovementSuccess(true);
        this._movingDirection = d;
        this.resetGetOnOffParams();
        this.moveToDir(d, false);
        this.unrideFromObject();
        this._movingMode = MovingMode.ObjectToGround;
        return true;
    }
    else {
        // FIXME: これ以上 type が増えそうなら Behavior に独立を考える
        if (this.isBoxType() && this.isFallable()) {
            if (!MovingHelper.checkFacingOtherEdgeTile(this._x, this._y, d, 1)) {
                this.setMovementSuccess(true);
                this._movingDirection = d;
                this.resetGetOnOffParams();
                this.moveToDir(d, false);
                this.unrideFromObject();
                this._moveToFalling = true; // 1歩移動後、落下
                return true;
            }
        }
    }
    return false;
}

/**
 * Object > Object (普通の移動)
 */
Game_CharacterBase.prototype.attemptMoveObjectToObject = function(d: number): boolean {
    assert(this.isRidding());
    var obj = MovingHelper.checkMoveOrJumpObjectToObject(this._x, this._y, d, 1);
    if (obj && obj != this) {
        this.setMovementSuccess(true);
        this._movingDirection = d;
        this.resetGetOnOffParams();
        this.moveToDir(d, false);
        this.unrideFromObject();
        this.rideToObject(obj);
        this._movingMode = MovingMode.ObjectToObject;
        return true;
    }
    return false;
}

/**
 * Jump: Object > Ground
 */
Game_CharacterBase.prototype.attemptJumpObjectToGround = function(d: number): boolean {
    if (MovingHelper.checkMoveOrJumpObjectToGround(this, this._x, this._y, d, 2)) {
        this.setMovementSuccess(true);
        this._movingDirection = d;
        this.jumpToDir(d, 2, false, true);
        //this.unrideFromObject();
        this._movingMode = MovingMode.ObjectToGround;
        return true;
    }
    return false;
}

/**
 * Jump: Object > Object
 */
Game_CharacterBase.prototype.attemptJumpObjectToObject = function(d: number): boolean {
    var obj = MovingHelper.checkMoveOrJumpObjectToObject(this._x, this._y, d, 2);
    if (obj) {
        this.setMovementSuccess(true);
        this._movingDirection = d;
        this.resetGetOnOffParams();
        this.jumpToDir(d, 2, true, true);
        //this.unrideFromObject();
        this.rideToObject(obj);
        this._movingMode = MovingMode.ObjectToObject;
        return true;
    }
    return false;
}

//------------------------------------------------------------------------------
// 実際に移動を行う系

/**
 * この Character を、指定したオブジェクトへ乗せる
 */
var _Game_CharacterBase_jump = Game_CharacterBase.prototype.jump;
Game_CharacterBase.prototype.jump = function(xPlus, yPlus) {
    _Game_CharacterBase_jump.call(this, xPlus, yPlus);

    if (this.isRidding()) {
        this.unrideFromObject();
    }
}

/**
 * この Character を、指定したオブジェクトへ乗せる
 */
Game_CharacterBase.prototype.rideToObject = function(riddenObject: Game_CharacterBase) {
    assert(!this.isRidding());
    assert(this.objectId() >= 0);
    assert(riddenObject.objectId() >= 0);

    this._riddeeCharacterId = riddenObject.objectId();
    riddenObject._ridderCharacterId = this.objectId();
    assert(this._riddeeCharacterId != riddenObject._ridderCharacterId);

    var oldZ = this._ridingScreenZPriority;
    this._ridingScreenZPriority = -1;
    this._ridingScreenZPriority = this.screenZ();

    // high obj -> low obj のとき、移動始めに隠れてしまう対策
    this._ridingScreenZPriority = Math.max(this._ridingScreenZPriority, oldZ);
};

/**
 * この Character を、乗っているオブジェクトから降ろす
 * 
 * Note: un-ride っていう単語は無いけど、ride の対義が get-off なのですごく紛らわしいので、mount/unmount のようにしている。
 */
Game_CharacterBase.prototype.unrideFromObject = function() {
    assert(this.isRidding());
    var obj = this.riddingObject();
    if (obj) {
        obj._ridderCharacterId = -1;
    }
    this._riddeeCharacterId = -1;
};

/**
 * 方向を指定して移動開始
 */
Game_CharacterBase.prototype.moveToDir = function(d: number, withAjust: boolean) {
    this._x = $gameMap.roundXWithDirection(this._x, d);
    this._y = $gameMap.roundYWithDirection(this._y, d);

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
 * @param extraJumping: プライオリティを最前面にするか。ホールタイルジャンプでは false にしておかないと、木の背面にジャンプした時に表示がおかしくなる。
 */
Game_CharacterBase.prototype.jumpToDir = function(d: number, len: number, toObj: boolean, extraJumping: boolean) {
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
    this._extraJumping = extraJumping;
    AMPS_SoundManager.playGSJump();
}

// 現在位置から落下開始
Game_CharacterBase.prototype.startFall = function() {
    this._fallingState = FallingState.Failling;
    this._fallingOriginalThrough = this.isThrough();
    this._fallingOriginalSpeed = this.moveSpeed();
    this.setThrough(true);
    this.setMoveSpeed(paramFallingSpeed);
    this.onStartFalling();
    // 地面へ落ちるか、オブジェクトに乗るかは次の update で決める
}

var _Game_CharacterBase_isMoving = Game_CharacterBase.prototype.isMoving;
Game_CharacterBase.prototype.isMoving = function() {
    if (this.isRidding() && this._movingMode == MovingMode.Stopping) {
        // オブジェクトの上で静止している場合は停止状態とする。
        // ridding 時は下のオブジェクトと座標を同期するようになるため、
        // オリジナルの isMoving だは常に移動状態になってしまう。
        // こうしておくと、移動するオブジェクトから降りるときにスムーズに移動できる。
        return false;
    }
    else {
        return _Game_CharacterBase_isMoving.call(this);
    }
}


var _Game_CharacterBase_update = Game_CharacterBase.prototype.update;
Game_CharacterBase.prototype.update = function() {

    // MovingSequel への通知
    if (this._movingSequel) {
        if (this._movingSequel.onOwnerUpdate(this)) {
            return;
        }
    }

    //if (this.)

    if (this._movingSequelOwnerCharacterId >= 0) {
        let character = MovingHelper.getCharacterById(this._movingSequelOwnerCharacterId);
        if (character._movingSequel) {
            if (character._movingSequel.onTargetUpdate(this)) {
                return;
            }
        }
    }

    if (this._waitAfterJump > 0) {
        // ジャンプ後にわずかな待ち時間を取ることで、着地した "手ごたえ" を演出するためのウェイト。
        // このウェイト中は stop と似た扱いなのだが、updateStop() に処理を回してしまうと、
        // 移動ルート強制されているキャラクターが次のインデックスに進んでしまう。
        // 丁寧にやるなら updateWait() みたいなのを用意したいところだが、ひとまずは待つだけなので、単純な if で対策する。
        this._waitAfterJump--;
    }
    else {
        _Game_CharacterBase_update.call(this);
    }

    if (this.isFalling()) {
        this.updateFall();
    }

    // 停止中の場合は乗っているオブジェクトの座標に同期する (乗ったまま移動)
    if (this.isRidding() && this._movingMode == MovingMode.Stopping) {
        var obj = this.riddingObject();
        if (obj) {
            this._x = obj._x;
            this._y = obj._y - obj.objectHeight();
            this._realX = obj._realX;
            this._realY = obj._realY - (obj.objectHeight());
        }
    }

    const behavior = AMPSManager.behavior(this._movingBehaviorType);
    if (behavior) {
        behavior.onUpdate(this);
    }
}

var _Game_CharacterBase_updateStop = Game_CharacterBase.prototype.updateStop;
Game_CharacterBase.prototype.updateStop = function() {
    _Game_CharacterBase_updateStop.call(this);

    if (!this.isRidding()) {
        // 乗降時の微調整パラメータをリセット
        this._ridingScreenZPriority = -1;
    }

    this._movingMode = MovingMode.Stopping;
};

var _Game_CharacterBase_updateMove = Game_CharacterBase.prototype.updateMove;
Game_CharacterBase.prototype.updateMove = function() {
    var oldMoving = this.isMoving();

    if (this.isMoving() &&
        this._movingMode != MovingMode.Stopping &&
        (this._movingMode != MovingMode.GroundToGround)) {
        this._getonoffFrameCount++;
        var tx = 0;
        var ty = 0;

        if (this._movingMode == MovingMode.GroundToObject || this._movingMode == MovingMode.ObjectToObject) {
            // オブジェクトへ乗ろうとしているときは補完を実施して自然に移動しているように見せる
            var obj = this.riddingObject();
            if (obj) {
                tx = obj._realX;
                ty = obj._realY - (obj.objectHeight());
            }
        }
        else if (this._movingMode == MovingMode.ObjectToGround) {
            tx = this._x;
            ty = this._y;
        }

        var t = Math.min(this._getonoffFrameCount / this._getonoffFrameMax, 1.0);
        this._realX = MovingHelper.linear(t, this._getonoffStartX, tx - this._getonoffStartX, 1.0);
        this._realY = MovingHelper.linear(t, this._getonoffStartY, ty - this._getonoffStartY, 1.0);


        // ここで論理座標も同期しておかないと、完了時の一瞬だけ画面が揺れる
        // this._x = obj._x;
        // this._y = obj._y - obj.objectHeight();

        if (this._getonoffFrameCount >= this._getonoffFrameMax) {
            // 移動完了
            this._movingMode = MovingMode.Stopping;
        }
    }
    else {
        
        _Game_CharacterBase_updateMove.call(this);
    }

    // 上記更新によって停止したかどうか。停止する瞬間の検出に使いたい。
    if (oldMoving != this.isMoving() && !this.isMoving()) {
        if (this._moveToFalling) {
            this._moveToFalling = false;
            this.startFall();
        }
        else {
            this.raiseStepEnd();
        }
    }
};

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
        this._movingMode = MovingMode.Stopping;

        if (oldJumping != this.isJumping()) {
            // ジャンプ終了
            this.onJumpEnd();
        }
    }
}

/**
 * 落下中更新
 */
Game_CharacterBase.prototype.updateFall = function() {
        
    //_Game_CharacterBase_updateMove.apply(this, arguments);
    
    if (!this.isMoving()) {
        if (this._fallingState == FallingState.Failling) {

            if ($gameMap.terrainTag(this._x, this._y) == paramGuideLineTerrainTag) {
                // ガイドラインのタイルまで進んだら落下終了
                this._fallingState = FallingState.EpilogueToRide;
            }
            // 乗れそうなオブジェクトへ地形判定無視で移動してみる
            else if (this.attemptMoveGroundToObject(2, true)) {
                this._fallingState = FallingState.EpilogueToRide;
            }
            else {
                this.moveStraightMain(2);
            }
        }
        
        if (this._fallingState == FallingState.EpilogueToRide) {
            // 落下終了
            this._fallingState = FallingState.None;
            this.setThrough(this._fallingOriginalThrough);
            this.setMoveSpeed(this._fallingOriginalSpeed);
            this.raiseStepEnd();
            AMPS_SoundManager.playGSFalled();
        }
    }
}

Game_CharacterBase.prototype.resetGetOnOffParams = function() {
    this._getonoffFrameMax = (1.0 / this.distancePerFrame());
    this._getonoffFrameCount = 0;
    this._getonoffStartX = this._realX;
    this._getonoffStartY = this._realY;
}


Game_CharacterBase.prototype.updatePlateNotification = function() {
    
    // 感圧板チェック
    if (this.isMovementSucceeded(this.x, this.y)) {
        const plate = $gameMap.eventsXy(this.x, this.y).find(event => { return event.isPlateType(); });
        if (plate) {
            if (plate.objectId() != this.objectId() &&              // 自分自身に乗らないようにする
                this._riddeePlateCharacterId != plate.objectId() && // 別の Plate へ乗るときだけ
                !this.isThrough()) {                                // すり抜け確認 (Follower 非表示の対策)
                this._riddeePlateCharacterId = plate.objectId();
                this._moveToPlateEnter = true;
            }
        }
        else if (this._riddeePlateCharacterId != -1) {
            // 降りるとき
            this._moveToPlateLeave = this._riddeePlateCharacterId;
            this._riddeePlateCharacterId = -1;
        }
    }

    if (this._moveToPlateLeave >= 0) {
        const plate = MovingHelper.getCharacterById(this._moveToPlateLeave);
        const behavior = AMPSManager.behavior(plate._movingBehaviorType);
        if (behavior) {
            behavior.onRidderLeaved(plate, this);
        }
        this._moveToPlateLeave = -1;
    }
    if (this._moveToPlateEnter) {
        const plate = MovingHelper.getCharacterById(this._riddeePlateCharacterId);
        const behavior = AMPSManager.behavior(plate._movingBehaviorType);
        if (behavior) {
            behavior.onRidderEnterd(plate, this);
        }
        this._moveToPlateEnter = false;
    }
}

//------------------------------------------------------------------------------
// タイミング発火

Game_CharacterBase.prototype.raiseStepEnd = function() {
    this.onStepEnd();

    this.updatePlateNotification();


    if (this.isOnSlipperyTile()) {
        $gameTemp.clearDestination();
        this.moveStraight(this._movingDirection);
        if (!this.isMovementSucceeded(this.x, this.y)) {
            // moveStraight の結果、移動できなかったら一連の移動を終了する
            this.raiseStop();
        }
    }
    else {
        this.raiseStop();
    }
}

Game_CharacterBase.prototype.raiseStop = function() {
    this.onStop();
}

//------------------------------------------------------------------------------
// タイミング通知

/**
 * 1歩歩き終わり、次の移動ができる状態になった
 */
Game_CharacterBase.prototype.onStepEnd = function() {
}

/**
 * 次の移動操作ができる状態になった。
 * 滑る床は、障害物にぶつかるなどで止まった時に呼ばれる。
 */
Game_CharacterBase.prototype.onStop = function() {
    if (this._movingSequel) {
        this._movingSequel.onOwnerStepEnding(this);
    }
    if (this._movingSequelOwnerCharacterId >= 0) {
        let character = MovingHelper.getCharacterById(this._movingSequelOwnerCharacterId);
        if (character._movingSequel) {
            character._movingSequel.onTargetStepEnding(this);
        }
    }

    if (!this.isRidding()) {
        // 乗降時の微調整パラメータをリセット
        this._ridingScreenZPriority = -1;
    }

    // 何かに乗っていたら通知
    var riddingObject = this.riddingObject();
    if (riddingObject) {
        riddingObject.onRideOnEvent();
    }
}

/**
 * ジャンプが終わり、次の移動ができる状態になった
 */
Game_CharacterBase.prototype.onJumpEnd = function() {
    var obj = this.riddingObject();
    if (obj) {
        // 何かに乗っていたら通知
        obj.onRideOnEvent();
    }
}

/**
 * 他のキャラクターが上に乗った
 */
Game_CharacterBase.prototype.onRideOnEvent = function() {
}

/**
 * 落下を開始した
 */
Game_CharacterBase.prototype.onStartFalling = function() {
}

//------------------------------------------------------------------------------
// HalfMove.js 対策

var _Game_CharacterBase_isHalfMove = Game_CharacterBase.prototype.isHalfMove;
Game_CharacterBase.prototype.isHalfMove = function() {
    if (!this.isMover()) {
        // Box とかは基本的に <HMHalfDisable> が必要になるが、忘れやすいので封印しておく
        return false;
    }
    else if (this._forcePositionAdjustment) {
        return false;
    }
    else if (_Game_CharacterBase_isHalfMove) {
        return _Game_CharacterBase_isHalfMove.call(this);
    }
    else {
        return false;
    }
}

