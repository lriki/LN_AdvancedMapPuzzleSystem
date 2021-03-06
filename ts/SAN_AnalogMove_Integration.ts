/**
 * 大方針として、オブジェクトに乗っているときなどは AnalogMove を禁止する。
 * Game_Player.prototype.shouleMoveDefault() 参照。
 *
 * AnalogMove 中は moveStraight (AMPS の基本移動処理) を一切行わない。というか行えない。
 */

import { assert, MovingMode } from './Common'

declare global {
    class Sanshiro {
        static AnalogMove: any;
    }

    interface Game_CharacterBase {
        _mover: any;
        _moveDefault: boolean;

        canAnalogMove(): boolean;
        hasMover(): boolean;
        refreshMover(): void;
        shouleMoveDefault(): boolean;
        updateMover(): void;

    }
}

if (typeof Sanshiro !== 'undefined' && Sanshiro.AnalogMove != undefined) {


var _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
    _Game_CharacterBase_initMembers.call(this);
}

/*
// @ts-ignore
var _CharacterMover_updatePosition = CharacterMover.prototype.updatePosition;
// @ts-ignore
CharacterMover.prototype.updatePosition = function() {
    _CharacterMover_updatePosition.call(this);
    this._tmpVecLN = this._velVec;
};

var _PlayerMover_update = PlayerMover.prototype.update;
PlayerMover.prototype.update = function() {
    _PlayerMover_update.call(this);
}
*/

/**
 * SAN_AnalogMove.js の移動処理の後、移動できなかった場合は AMPS の移動処理を実施してみる。
 * 移動できなかったことの検出には、isInputed(キーが押されているか) と「速度ベクトルが十分に小さい場合」を判定基準とする。
 * 
 * 壁に接触するときは速度ベクトルが 0 になるが、イベントに対しては SAN_AnalogMove.js は円柱のようなヒットボックスを用意しているため、
 * イベントとプレイヤーの座標が完全一致していない場合わずかに速度ベクトルが発生する。
 * そのため完全に 0 を基準としてしまうと、イベントを押すためにピクセル単位でプレイヤーの位置を移動させなければならなくなる。
 * 
 */
var _Game_CharacterBase_updateMover = Game_CharacterBase.prototype.updateMover;
Game_CharacterBase.prototype.updateMover = function() {
    var thr = 0.005;

    _Game_CharacterBase_updateMover.call(this);

    if ($gameMap.isPuzzleEnabled()) {
        if (this._mover.isInputed && this._mover.isInputed() && this.canAnalogMove()) {
            const dx = this._mover._posVec.x() - this._mover._lasPosVec.x();
            const dy = this._mover._posVec.y() - this._mover._lasPosVec.y();

            // SAN_AanalogMove は _movementSuccess フラグを一切操作しない。
            // そのため AMPS 側で一度 false にすると、以降通常移動時は false のままとなり、
            // 感圧板の乗降処理などが行われなくなる。 (見た目は移動できているのに、フラグは常に false)
            // 対策として、座標さ分が少しでもあれば移動が行われたとみなしてフラグを復帰させる。
            if (dx !== 0 || dy !== 0) {
                this.setMovementSuccess(true);
            }
            
            if (Input.dir8 == 6 && Math.abs(dx) < thr) {
                this.moveStraight(6);
            }
            else if (Input.dir8 == 4 && Math.abs(dx) < thr) {
                this.moveStraight(4);
            }
            else if (Input.dir8 == 8 && Math.abs(dy) < thr) {
                this.moveStraight(8);
            }
            else if (Input.dir8 == 2 && Math.abs(dy) < thr) {
                this.moveStraight(2);
            }
            else {
                // SlipperyTile の処理で、常に最後の移動方向を覚えておく必要がある。
                // 単に Input.dir8 だと斜めで氷上に侵入したときに assert に引っかかるので、4 方向に調整する。
                if (Math.abs(dx) > Math.abs(dy)) {
                    if (dx > 0) {
                        this._movingDirection = 6;
                    }
                    else {
                        this._movingDirection = 4;
                    }
                }
                else {
                    if (dy > 0) {
                        this._movingDirection = 2;
                    }
                    else {
                        this._movingDirection = 8;
                    }
                }

                this.raiseStepEnd();
            }
        }
    }

};

var _Game_CharacterBase_updateJump = Game_CharacterBase.prototype.updateJump;
Game_CharacterBase.prototype.updateJump = function() {
    _Game_CharacterBase_updateJump.call(this);

    if ($gameMap.isPuzzleEnabled()) {
        if (!this.isJumping() && this.hasMover()) {
            this.refreshMover();
        }
    }
}

// SAN_AnalogMove.js の isMoving はジャンプ中を考慮していないため、そのままだと キー押し中に moveStraight を毎フレーム呼んでしまう。
var _Game_Player_isMoving = Game_Player.prototype.isMoving;
Game_Player.prototype.isMoving = function() {
    if (!Game_Character.prototype.isMoving.call(this)) return false;

    var r = _Game_Player_isMoving.call(this);
    return r || this.isJumping();
}

/**
 * SAN_AnalogMove.js でデフォルト移動をするか (アナログ移動をしないか)
 * 
 * 元の条件に対して、AMPS 用の移動制限を追加する。
 */
var _Game_Player_shouleMoveDefault = Game_Player.prototype.shouleMoveDefault;
Game_Player.prototype.shouleMoveDefault = function() {
    // 何かに乗っているときは AMPS の移動処理を行う
    if (this.isRidding()) return true;

    // オブジェクトを押しているときは AMPS の移動処理を行う
    if (this._movingSequel != undefined) return true;

    // Object -> Ground 移動時に、必ず1タイル分移動が終わってから、analogMoving できるようにする
    if (this._movingMode != MovingMode.Stopping) return true;

    return _Game_Player_shouleMoveDefault.call(this);
};

/**
 * SAN_AnalogMove.js で定義されている Game_Player.updateMove の BaseCall を変更する。
 * 
 * SAN_AnalogMove.js がキャプチャしている _Game_Player_updateMove はツクールオリジナルのものであり、
 * それを呼んでも、APMS がオーバーライドした Game_CharacterBase.updateMove は呼ばれない。
 */
Game_Player.prototype.updateMove = function() {
    if (this.shouleMoveDefault()) {
        Game_Character.prototype.updateMove.call(this);
        this._moveDefault = this.isMoving();
    }
};

}
