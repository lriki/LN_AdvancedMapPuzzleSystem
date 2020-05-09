/// <reference types="rpgmakermv_typescript_dts"/>
import { paramGuideLineTerrainTag } from './PluginParameters'

Game_Player.prototype.objectId = function(): number {
    return 0;
};

var _Game_Player_isCollided = Game_Player.prototype.isCollided;
Game_Player.prototype.isCollided = function(x: number, y: number): boolean {
    if (this.isRidding()) {
        // オブジェクトに乗っているプレイヤーとは衝突判定しない
        return false;
    } else {
        return _Game_Player_isCollided.call(this, x, y);
    }
};

var _Game_Player_canMove = Game_Player.prototype.canMove;
Game_Player.prototype.canMove = function(): boolean {
    if (this._movingSequel) {
        // 移動制御中のタッチ移動や接触イベント起動を禁止
        return false;
    }
    return _Game_Player_canMove.call(this);
}

var _Game_Player_isDashing = Game_Player.prototype.isDashing;
Game_Player.prototype.isDashing = function(): boolean {
    if (this._movingSequel) {
        // 移動制御中のタッチ移動や接触イベント起動を禁止
        return false;
    }
    return _Game_Player_isDashing.call(this);
};
