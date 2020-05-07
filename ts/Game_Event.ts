/// <reference types="rpgmakermv_typescript_dts"/>
import { paramMapSkillEffectsMapId } from './PluginParameters'
import { ObjectType, strToObjectType, EventTrigger, strToEventTrigger, assert } from './Common'
import { AMPSManager } from './AMPSManager';

declare global {
    /**
     * Game_Event
     * 
     * MapSkillEffectEvent の Id について
     * ----------
     * _eventId は、$gameMap.event に動的に追加されたインデックスを示す。
     * これは、Interpreter から「自分自身」を対象とした移動ルートなどの設定をできるようにするため。
     * 一方 Data クラスを読み取るために _eventId が使えなくなるので、MapSkillEffectEvent 専用に _mapSkillEffectId を用意している。
     */
    interface Game_Event {
        _objectType: ObjectType;
        _objectHeight: number;
        _fallable: boolean;
        _eventIndex: number;    // [obsolete] < _eventId と同じにした  this が割り当てられている $gameMap.events のインデックス
        _mapSkillEffectDataId: number;
        _eventTrigger: EventTrigger;
        parseListCommentForAMPSObject(): boolean;
        onTerminateParallelEvent(): void;
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
    this._mapSkillEffectDataId = AMPSManager.tempMapSkillEffectDataId;
}

var _Game_Event_prototype_event = Game_Event.prototype.event;
Game_Event.prototype.event = function(): IDataMapEvent {
    if ($dataMapSkillEffectsMap.events && this._mapId === paramMapSkillEffectsMapId) {
        console.log(this);
        assert(this._mapSkillEffectDataId >= 0);
        // エフェクト定義Map から複製された DynamicEvent はそちらからデータをとる
        return $dataMapSkillEffectsMap.events[this._mapSkillEffectDataId];
    }
    else
        return _Game_Event_prototype_event.call(this);
};

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

    let list = this.list();
    if (list) {
        // collect comments
        let comments = "";
        for (let i = 0; i < list.length; i++) {
            if (list[i].code == 108 || list[i].code == 408) {
                if (list[i].parameters) {
                    comments += list[i].parameters;
                }
            }
        }

        let index = comments.indexOf("@MapObject");
        if (index >= 0) {
            let block = comments.substring(index + 6);
            block = block.substring(
            block.indexOf("{") + 1,
            block.indexOf("}"));

            let nvps = block.split(",");
            for (let i = 0; i < nvps.length; i++) {
                let tokens = nvps[i].split(":");
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

var _Game_Event_updateParallel = Game_Event.prototype.updateParallel;
Game_Event.prototype.updateParallel = function() {
    if (this._interpreter) {
        let oldRunning = this._interpreter.isRunning();
        _Game_Event_updateParallel.call(this);
        if (oldRunning && !this._interpreter.isRunning()) {
            this.onTerminateParallelEvent();
        }
    }
    else {
        _Game_Event_updateParallel.call(this);
    }
}

Game_Event.prototype.onTerminateParallelEvent = function() {
    if (this._mapId === paramMapSkillEffectsMapId) {
        $gameMap.despawnMapSkillEffectEvent(this);
    }
}
