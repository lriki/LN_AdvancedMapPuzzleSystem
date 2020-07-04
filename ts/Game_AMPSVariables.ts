/// <reference types="rpgmakermv_typescript_dts"/>
import { paramGuideLineTerrainTag } from './PluginParameters'


export interface ObjectPosition {
    x: number;
    y: number;
}

/**
 * 
 */
export class Game_AMPSVariables {
    //_savedPositions: Map<string, ObjectPosition>;
    _savedPositions: { [key: string]: ObjectPosition };

    constructor() {
        //this._savedPositions = new Map<string, ObjectPosition>();
        this._savedPositions = {};
    }

    clear() {
        //this._savedPositions.clear();
        this._savedPositions = {};
    };

    makeKey(mapId: number, eventId: number) {
        return `${mapId}:${eventId}`;
    }
    
    setSavedPosition(mapId: number, eventId: number, value: ObjectPosition) {
        const key = this.makeKey(mapId, eventId);
        this._savedPositions[key] = value;
    };
    
    savedPosition(mapId: number, eventId: number): ObjectPosition | undefined {
        const key = this.makeKey(mapId, eventId);
        return this._savedPositions[key];
    };
}

declare global {
export var g_gameAMPSVariables: Game_AMPSVariables;
}

g_gameAMPSVariables = new Game_AMPSVariables();
