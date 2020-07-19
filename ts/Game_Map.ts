/// <reference types="rpgmakermv_typescript_dts"/>
import { paramMapSkillEffectsMapId, paramGuideLineTerrainTag, paramAllowAllMapPuzzles, paramSlipRegion } from './PluginParameters'
import { AMPSManager } from './AMPSManager'
import { assert } from './Common';
import { Game_AMPSVariables, ObjectPosition } from './Game_AMPSVariables';

//export var g_gameAMPSVariables: Game_AMPSVariables;

declare global {
    interface Game_Map {
        //ampsVariables: Game_AMPSVariables;

        _puzzleEnabled: boolean;
        _spawnMapSkillEffectEventcallback: (event: Game_Event) => void;
        _despawnMapSkillEffectEventcallback: (event: Game_Event) => void;

        isPuzzleEnabled(): boolean;
        checkNotPassageAll(x: number, y: number): boolean;
        checkGroove(x: number, y: number): boolean;
        spawnMapSkillEffectEvent(name: string): Game_Event | undefined;
        despawnMapSkillEffectEvent(event: Game_Event): void;
        setSpawnMapSkillEffectEventHandler(callback: (event: Game_Event) => void): void;
        setDespawnMapSkillEffectEventHandler(callback: (event: Game_Event) => void): void;
        isSlipperyTile(x: number, y: number): boolean;

        savePositionalObjects(): void;
        loadPositionalObjects(): void;
    }
}

var _Game_Map_initialize = Game_Map.prototype.initialize;
Game_Map.prototype.initialize = function() {
    _Game_Map_initialize.call(this);
    //this.ampsVariables = new Game_AMPSVariables();
}

var _Game_Map_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
    // 実際に切り替えが起こるまでに、移動前マップの状態を保存する
    this.savePositionalObjects();

    _Game_Map_setup.call(this, mapId);

    if ($dataMap.meta.LNPuzzleEnable) {
        this._puzzleEnabled = true;
    }
    else if (this.isOverworld()) {
        this._puzzleEnabled = false;
    }
    else if (paramAllowAllMapPuzzles) {
        this._puzzleEnabled = true;
    }
    else {
        this._puzzleEnabled = false;
    }

    this.loadPositionalObjects();
}

Game_Map.prototype.isPuzzleEnabled = function(): boolean {
    return this._puzzleEnabled;
}

// fully override
Game_Map.prototype.checkPassage = function(x: number, y: number, bit: number): boolean {
    var flags = this.tilesetFlags();
    var tiles = this.allTiles(x, y);
    for (var i = 0; i < tiles.length; i++) {
        var flag = flags[tiles[i]];

        ////////// ガイドラインタグを通行判定から無視する
        if (i < tiles.length - 1) { // 一番下のタイルに直接ガイドラインタグがつけられている場合は無視しない
            var tag = flags[tiles[i]] >> 12;
            if (tag == paramGuideLineTerrainTag)
                continue;
        }
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

/**
 * 
 */
Game_Map.prototype.spawnMapSkillEffectEvent = function(name: string): Game_Event | undefined {
    assert(paramMapSkillEffectsMapId > 0);

    let dataEffectsMap = AMPSManager.dataMapSkillEffectsMap();
    if (dataEffectsMap && dataEffectsMap.events) {
        let eventDataId = -1;
        for (let i = 0; i < dataEffectsMap.events.length; i++) {
            if (dataEffectsMap.events[i] && dataEffectsMap.events[i].name == name) {
                eventDataId = i;
                break;
            }
        }

        if (eventDataId >= 0) {
            AMPSManager.tempMapSkillEffectDataId = eventDataId;
            AMPSManager.tempMapSkillEffectInvokerId = 0;    // TODO:
            let newIndex = this._events.length;
            let newEvent = new Game_Event(paramMapSkillEffectsMapId, newIndex);
            AMPSManager.tempMapSkillEffectDataId = -1;
            AMPSManager.tempMapSkillEffectInvokerId = -1;
            newEvent._eventIndex = newIndex;
            this._events[newIndex] = newEvent;

            if (this._spawnMapSkillEffectEventcallback) {
                this._spawnMapSkillEffectEventcallback(newEvent);
            }
            return newEvent;
        }
    }

    return undefined;
}

Game_Map.prototype.despawnMapSkillEffectEvent = function(event: Game_Event): void {
    assert(event._eventIndex >= 0);
    //this._events[event._eventIndex] = new Game_Event(); // empty event
    this._events.splice(event._eventIndex, 1);

    if (this._despawnMapSkillEffectEventcallback) {
        this._despawnMapSkillEffectEventcallback(event);
    }
}

Game_Map.prototype.setSpawnMapSkillEffectEventHandler = function(callback: (event: Game_Event) => void): void {
    this._spawnMapSkillEffectEventcallback = callback;
}

Game_Map.prototype.setDespawnMapSkillEffectEventHandler = function(callback: (event: Game_Event) => void): void {
    this._despawnMapSkillEffectEventcallback = callback;
}

/**
 * 滑りタイルかどうか
 */
Game_Map.prototype.isSlipperyTile = function(x: number, y: number): boolean {
    return (paramSlipRegion !== 0 && this.regionId(x, y) === paramSlipRegion);
}

Game_Map.prototype.savePositionalObjects = function() {
    //console.log("savePositionalObjects", AMPSManager.gameAMPSVariables);
    this.events().forEach((event) => {
        if (event.isPositionalObject()) {
            let pos: ObjectPosition = { x: event.x, y: event.y };
            AMPSManager.gameAMPSVariables.setSavedPosition(this.mapId(), event.eventId(), pos);
            //console.log("saved", event.eventId(), pos);
        }
    });
}

Game_Map.prototype.loadPositionalObjects = function() {
    //console.log("loadPositionalObjects", AMPSManager.gameAMPSVariables);
    this.events().forEach((event) => {
        if (event.isPositionalObject()) {
            const pos = AMPSManager.gameAMPSVariables.savedPosition(this.mapId(), event.eventId());
            if (pos) {
                event.locate(pos.x, pos.y);
                //console.log("loaded", event.eventId(), pos);
            }
        }
    });
}
