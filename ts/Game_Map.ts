/// <reference types="rpgmakermv_typescript_dts"/>
import { paramGuideLineTerrainTag } from './PluginParameters'

declare global {
    interface Game_Map {
        checkNotPassageAll(x: number, y: number): boolean;
        checkGroove(x: number, y: number): boolean;
    }
}

// fully override
Game_Map.prototype.checkPassage = function(x: number, y: number, bit: number): boolean {
    var flags = this.tilesetFlags();
    var tiles = this.allTiles(x, y);
    for (var i = 0; i < tiles.length; i++) {
        var flag = flags[tiles[i]];

        ////////// ガイドラインタグを通行判定から無視する
        var tag = flags[tiles[i]] >> 12;
        if (tag == paramGuideLineTerrainTag)
            continue;
        //////////

        if ((flag & 0x10) !== 0)  // [*] No effect on passage
            continue;
        if ((flag & bit) === 0)   // [o] Passable
            return true;
        if ((flag & bit) === bit) // [x] Impassable
            return false;
    }
    return false;
};

/**
 * 指定した位置のタイルの、全方位進入禁止確認
 */
Game_Map.prototype.checkNotPassageAll = function(x: number, y: number) {
    var flags = this.tilesetFlags();
    var tiles = this.allTiles(x, y);
    var bits = 0;
    for (var i = 0; i < tiles.length; i++) {
        var flag = flags[tiles[i]];
        bits |= flag;
    }
    return (bits & 0x0f) == 0x0f;
};


// 溝チェック
Game_Map.prototype.checkGroove = function(x: number, y: number) {
    var tiles = this.allTiles(x, y);
    for (var i = 0; i < tiles.length; i++) {
        if (Tilemap.isTileA1(tiles[i])) {
            return true;
        }
    }
    return false;
}
