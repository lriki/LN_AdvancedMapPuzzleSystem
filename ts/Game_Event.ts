/// <reference types="rpgmakermv_typescript_dts"/>
import { paramGuideLineTerrainTag } from './PluginParameters'
import { ObjectType, strToObjectType, EventTrigger, strToEventTrigger } from './Common'

declare global {
    interface Game_Event {
        _objectType: ObjectType;
        _objectHeight: number;
        _fallable: boolean;
        _eventTrigger: EventTrigger;
        parseListCommentForAMPSObject(): boolean;
    }
}

//class Game_Event_overload {
//    public initialize(): void;
//    public initialize(mapId?: number, eventId?: number): void
//    {
//        this._isMapObject
//    }
//};
//var _Game_Event_initialize = Game_Event.prototype.initialize;
//Game_Event.prototype.initialize = new Game_Event_overload().initialize;

var _Game_Event_initMembers = Game_Event.prototype.initMembers;
Game_Event.prototype.initMembers = function() {
    _Game_Event_initMembers.call(this);
    this._objectType = ObjectType.Character;
    this._objectHeight = -1;
    this._fallable = false;
    this._eventTrigger = EventTrigger.None;
}

Game_Event.prototype.isMapObject = function() {
    return this._objectType != ObjectType.Character;
};

Game_Event.prototype.objectId = function(): number {
    return this.eventId();
};

Game_Event.prototype.objectHeight = function() {
    return this._objectHeight;
};

var _Game_Event_setupPage = Game_Event.prototype.setupPage;
Game_Event.prototype.setupPage = function() {
    let oldHeight = this.objectHeight();
    let oldRider = this.rider();

    _Game_Event_setupPage.call(this);

    this.parseListCommentForAMPSObject();
    
    if (this.objectHeight() == 0 && oldRider) {
        oldRider.jump(0, oldHeight);
    }
}

Game_Event.prototype.parseListCommentForAMPSObject = function(): boolean {
    // reset object status
    this._objectType = ObjectType.Character;
    this._objectHeight = -1;
    this._fallable = false;
    this._eventTrigger = EventTrigger.None;

    var list = this.list().parameters;
    if (list && list.length > 1) {

        // collect comments
        var comments = "";
        for (var i = 0; i < list.length; i++) {
            if (list[i].code == 108 || list[i].code == 408) {
                comments += list[i].parameters[0];
            }
        }

        var index = comments.indexOf("@MapObject");
        if (index >= 0) {
            var block = comments.substring(index + 6);
            block = block.substring(
                block.indexOf("{") + 1,
                block.indexOf("}"));

            var nvps = block.split(",");
            for (var i = 0; i < nvps.length; i++) {
                var tokens = nvps[i].split(":");
                switch (tokens[0].trim())
                {
                    case "type":
                        this._objectType = strToObjectType(tokens[1].trim()); 
                        break;
                    case "h":
                    case "height":
                        this._objectHeight = Number(tokens[1].trim()); 
                        break;
                    case "fallable":
                        this._fallable = (tokens[1].trim() == 'true') ? true : false;
                        break;
                    case "trigger":
                        this._eventTrigger = strToEventTrigger(tokens[1].trim()); 
                        break;
                }
            }

            return true;
        }
    }
    return false;
}
