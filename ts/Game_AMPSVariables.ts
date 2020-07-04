
export interface ObjectPosition {
    x: number;
    y: number;
}

export interface Game_AMPSVariablesData {
    savedPositions: { [key: string]: ObjectPosition };
}

/**
 * 
 */
//declare global {
    export class Game_AMPSVariables {
        //_savedPositions: Map<string, ObjectPosition>;
        _data: Game_AMPSVariablesData;

        constructor() {
            this._data = {savedPositions: {}};
        }

        clear(): void {
            this._data = {savedPositions: {}};
        }

        //constructor() {
            //this._savedPositions = new Map<string, ObjectPosition>();
        //    this._savedPositions = {};
        //}

        makeKey(mapId: number, eventId: number): string {
            return `${mapId}:${eventId}`;
        }

        setSavedPosition(mapId: number, eventId: number, value: ObjectPosition): void{
            const key = this.makeKey(mapId, eventId);
            this._data.savedPositions[key] = value;
        }

        savedPosition(mapId: number, eventId: number): ObjectPosition | undefined {
            const key = this.makeKey(mapId, eventId);
            return this._data.savedPositions[key];
        };
    }
//}

/*
Game_AMPSVariables.prototype.constructor = function() {
    //this._savedPositions.clear();
    this._savedPositions = {};
};

Game_AMPSVariables.prototype.clear = function() {
    //this._savedPositions.clear();
    this._savedPositions = {};
};

Game_AMPSVariables.prototype.makeKey = function(mapId: number, eventId: number) {
    return `${mapId}:${eventId}`;
}

Game_AMPSVariables.prototype.setSavedPosition = function(mapId: number, eventId: number, value: ObjectPosition) {
    const key = this.makeKey(mapId, eventId);
    this._savedPositions[key] = value;
};

Game_AMPSVariables.prototype.savedPosition = function(mapId: number, eventId: number): ObjectPosition | undefined {
    const key = this.makeKey(mapId, eventId);
    return this._savedPositions[key];
};


*/

//declare global {
//    var g_gameAMPSVariables: Game_AMPSVariables;
//}
//console.log("aaaa");
//g_gameAMPSVariables = new Game_AMPSVariables();
//console.log("g_gameAMPSVariables", g_gameAMPSVariables);

//export var g_gameAMPSVariables = new Game_AMPSVariables();
