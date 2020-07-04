/// <reference types="rpgmakermv_typescript_dts"/>
import { paramMapSkillEffectsMapId } from './PluginParameters'
import { EventTrigger, strToEventTrigger, assert } from './Common'
import { AMPSManager } from './AMPSManager';
import { MovingHelper } from './MovingHelper';

enum MapSkillEffectInitialPosition {
    // 発動者と同じ位置
    Default,
    // 発動者の目の前のタイル
    Front,
    // 
    //Target,
}

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
        //_objectType: ObjectType;
        _objectHeight: number;
        _fallable: boolean;
        _eventIndex: number;    // [obsolete] < _eventId と同じにした  this が割り当てられている $gameMap.events のインデックス
        _mapSkillEffectDataId: number;
        _mapSkillEffectInvokerId: number;   // MapSkill を発動した Character の ID (0=Player, 1~=Event)
        _mapSkillEffectInitialPosition: MapSkillEffectInitialPosition;
        _mapObjectEventTrigger: EventTrigger;
        _mapSkillRange: number;
        _reactionMapSkill: string;  // "reaction:" の値を toLocaleLowerCase したもの。

        clearMapObjectSettings(): void;
        //objectType(): ObjectType;
        isDynamicMapEffectEvent(): boolean;
        reactionMapSkill(): string;
        mapSkillEffectInvoker(): Game_Character | undefined;
        directionAsMapSkillEffect(): number;
        parseListCommentForAMPSObject(): boolean;
        startAsReactor(): void;
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

Game_Event.prototype.clearMapObjectSettings = function(): void {
    this._objectTypeBox = false;
    this._objectTypeEffect = false;
    this._objectTypeReactor = false;
    this._objectHeight = -1;
    this._fallable = false;
    this._mapObjectEventTrigger = EventTrigger.None;
    this._mapSkillRange = -1;
    this._reactionMapSkill = '';
    this._positionalObject = false;
    this._mapSkillEffectInitialPosition = MapSkillEffectInitialPosition.Default;
}

var _Game_Event_initMembers = Game_Event.prototype.initMembers;
Game_Event.prototype.initMembers = function() {
    _Game_Event_initMembers.call(this);
    this._objectHeight = -1;
    this._fallable = false;
    this._mapObjectEventTrigger = EventTrigger.None;
    this._mapSkillEffectDataId = AMPSManager.tempMapSkillEffectDataId;
    this._mapSkillEffectInvokerId = AMPSManager.tempMapSkillEffectInvokerId;
    this._mapSkillEffectInitialPosition = MapSkillEffectInitialPosition.Default;
}

var _Game_Event_prototype_event = Game_Event.prototype.event;
Game_Event.prototype.event = function(): IDataMapEvent {
    
    if (paramMapSkillEffectsMapId > 0) {
        let dataEffectsMap = AMPSManager.dataMapSkillEffectsMap();
        if (dataEffectsMap && dataEffectsMap.events && this.isDynamicMapEffectEvent()) {
            // エフェクト定義Map から複製された DynamicEvent はそちらからデータをとる
            return dataEffectsMap.events[this._mapSkillEffectDataId];
        }
    }

    return _Game_Event_prototype_event.call(this);
};

/**
 * 決定ボタンやプレイヤーとの接触で起動するときの可否チェック
 */
var _Game_Event_isTriggerIn = Game_Event.prototype.isTriggerIn;
Game_Event.prototype.isTriggerIn = function(triggers: number[]): boolean {
    if (this._mapObjectEventTrigger !== EventTrigger.None) {
        // trigger が指定されている場合、通常のイベント起動は行わない
        return false;
    }
    else {
        return _Game_Event_isTriggerIn.call(this, triggers);
    }
};

/**
 * [イベントから接触] 起動チェック
 */
var _Game_Event_checkEventTriggerTouch = Game_Event.prototype.checkEventTriggerTouch;
Game_Event.prototype.checkEventTriggerTouch = function(x: number, y: number): any {
    if (this._mapObjectEventTrigger !== EventTrigger.None) {
        // trigger が指定されている場合、通常のイベント起動は行わない
    }
    else {
        _Game_Event_checkEventTriggerTouch.call(this, x, y);
    }
};

/**
 * [自動実行] 起動チェック
 */
var _Game_Event_checkEventTriggerAuto = Game_Event.prototype.checkEventTriggerAuto;
Game_Event.prototype.checkEventTriggerAuto = function() {
    if (this._mapObjectEventTrigger !== EventTrigger.None) {
        // trigger が指定されている場合、通常のイベント起動は行わない
    }
    else {
        _Game_Event_checkEventTriggerAuto.call(this);
    }
};

Game_Event.prototype.objectId = function(): number {
    return this.eventId();
};

Game_Event.prototype.objectHeight = function(): number {
    return this._objectHeight;
};

Game_Event.prototype.isFallable = function(): boolean {
    return this._fallable;
};

Game_Event.prototype.isDynamicMapEffectEvent = function(): boolean {
    return this._mapId === paramMapSkillEffectsMapId && this._mapSkillEffectDataId >= 0;
};

Game_Event.prototype.reactionMapSkill = function(): string {
    return this._reactionMapSkill;
};

Game_Event.prototype.mapSkillEffectInvoker = function(): Game_Character | undefined {
    if (this._mapSkillEffectInvokerId < 0) {
        return undefined;
    }
    else if (this._mapSkillEffectInvokerId == 0) {
        return $gamePlayer;
    }
    else {
        return $gameMap.event(this._mapSkillEffectInvokerId);
    }
};

/**
 * マップスキルエフェクトとしての向き (進行方向) を取得する。
 * 
 * ほとんどの場合マップスキルは向き固定のグラフィックで使いたい。
 * また向きは this に依存するというよりは呼び出し元キャラクターに同期するように動くべき。
 */
Game_Event.prototype.directionAsMapSkillEffect = function(): number {
    let invoker = this.mapSkillEffectInvoker();
    if (invoker)
        return invoker.direction();
    else
        return this.direction();
}

var _Game_Event_refresh = Game_Event.prototype.refresh;
Game_Event.prototype.refresh = function() {
    _Game_Event_refresh.call(this);

    // マップスキルエフェクトの場合、初期座標を呼び出し元キャラクターに合わせておく。
    // (本当は init 辺りでやったほうがいいと思うけど、initialize の上書きが難しいのでひとまずここで)
    let involer = this.mapSkillEffectInvoker();
    if (involer) {
        if (this._mapSkillEffectInitialPosition = MapSkillEffectInitialPosition.Front) {
            this.locate(MovingHelper.frontX(involer.x, involer.direction()), MovingHelper.frontY(involer.y, involer.direction()));
        }
        else {
            this.locate(involer.x, involer.y);
        }
    }
}

var _Game_Event_setupPage = Game_Event.prototype.setupPage;
Game_Event.prototype.setupPage = function() {
    let oldHeight = this.objectHeight();
    let oldRider = this.rider();

    _Game_Event_setupPage.call(this);
    
    // setupPage によって MapObject ではなった時、上に乗っているオブジェクトがいれば強制的に落下させる
    if (!this.isMapObject() && oldRider) {
        oldRider.jump(0, oldHeight);
    }

    if (this.isEffectType() && this._mapObjectEventTrigger == EventTrigger.OnSpawnedAsEffect) {
        let involer = this.mapSkillEffectInvoker();
        if (involer) {
            let target = MovingHelper.findReactorMapObjectInLineRange(involer.x, involer.y, this.directionAsMapSkillEffect(), this._mapSkillRange, this.event().name ?? "");
            if (target) {
                target.startAsReactor();
            }
        }
    }
}

var _Game_Event_clearPageSettings = Game_Event.prototype.clearPageSettings;
Game_Event.prototype.clearPageSettings = function() {
    _Game_Event_clearPageSettings.call(this);
    this.clearMapObjectSettings();
}

/**
 * parse は setupPage() から呼ばれる setupPageSettings() の中で行う。
 * setupPage() は setupPageSettings() が返ってくると自動実行イベントの起動を行おうとするが、
 * trigger が指定されている場合はそれをキャンセルしたいので、先に MapObject の設定を読み取る必要がある。
 */
var _Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
Game_Event.prototype.setupPageSettings = function() {
    _Game_Event_setupPageSettings.call(this);
    this.parseListCommentForAMPSObject();

    // MapObject として trigger が設定されている場合は、並列実行用されないようにする
    if (this._mapObjectEventTrigger != EventTrigger.None) {
        this._interpreter = null;
    }
}

Game_Event.prototype.parseListCommentForAMPSObject = function(): boolean {
    this.clearMapObjectSettings();

    if (this._pageIndex >= 0) {
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
                    switch (tokens[0].trim().toLocaleLowerCase())
                    {
                        case "type":
                            console.error("@MapObject.type is deprecated. use 'box:true'");
                            switch (tokens[1].trim().toLocaleLowerCase()) {
                                case 'box':
                                    this._objectTypeBox = true;
                                    break;
                                case 'effect':
                                    this._objectTypeEffect = true;
                                    break;
                                case 'reactor':
                                    this._objectTypeReactor = true;
                                    break;
                            }
                            break;
                        case "box":
                            this._objectTypeBox = (tokens.length >= 2) ? Boolean(tokens[1].trim()) : true;
                            break;
                        case "effect":
                            this._objectTypeEffect = (tokens.length >= 2) ? Boolean(tokens[1].trim()) : true;
                            break;
                        case "reactor":
                            this._objectTypeReactor = (tokens.length >= 2) ? Boolean(tokens[1].trim()) : true;
                            break;
                        case "h":
                        case "height":
                            this._objectHeight = Number(tokens[1].trim()); 
                            break;
                        case "fallable":
                            this._fallable = (tokens[1].trim() == 'true') ? true : false;
                            break;
                        case "trigger":
                            this._mapObjectEventTrigger = strToEventTrigger(tokens[1].trim()); 
                            break;
                        case "range":
                            this._mapSkillRange = Number(tokens[1].trim()); 
                            break;
                        case "reaction":
                            this._reactionMapSkill = tokens[1].trim().toLocaleLowerCase(); 
                            break;
                        case "pos":
                            switch (tokens[1].trim().toLocaleLowerCase()) {
                                case "front":
                                    this._mapSkillEffectInitialPosition = MapSkillEffectInitialPosition.Front; 
                            }
                            break;
                        case "positional":
                            this._positionalObject = true;
                            break;
                    }
                }
    
                return true;
            }
        }
    }
    return false;
}

/**
 * Reactor の場合は通常のイベント起動をすべて禁止する。
 */
var _Game_Event_start = Game_Event.prototype.start;
Game_Event.prototype.start = function() {
    if (this.isReactorType()) {
    }
    else {
        _Game_Event_start.call(this);
    }
};

/**
 * Reactor としてイベントを開始する。
 */
Game_Event.prototype.startAsReactor = function() {
    _Game_Event_start.call(this);
};

var _Game_Event_updateParallel = Game_Event.prototype.updateParallel;
Game_Event.prototype.updateParallel = function() {
    if (this._interpreter) {
        let oldRunning = this._interpreter.isRunning();
        _Game_Event_updateParallel.call(this);
        if (oldRunning && !this._interpreter.isRunning()) {
            // "並列実行" の終了を検知。FIXME: Game_Interpreter.terminate でやってもいいかも？
            this.onTerminateParallelEvent();
        }
    }
    else {
        _Game_Event_updateParallel.call(this);
    }
}

Game_Event.prototype.onTerminateParallelEvent = function() {
    if (this.isDynamicMapEffectEvent()) {
        $gameMap.despawnMapSkillEffectEvent(this);
    }
}

Game_Event.prototype.onRideOnEvent = function() {
    if (this._mapObjectEventTrigger === EventTrigger.OnRideOnEvent) {
        this.start();
    }
}

Game_Event.prototype.onStartFalling = function() {
    if (this._mapObjectEventTrigger === EventTrigger.OnStartFalling) {
        this.start();
    }
}
