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
