/// <reference types="rpgmakermv_typescript_dts"/>

import { MovingHelper } from "./MovingHelper";
import { EventTrigger } from "./Common";

export interface PlateMovingBehaviorData {
    
}

/**
 * 
 */
export class MovingBehavior {

    _objectId: number;

    constructor(objectId: number) {
        this._objectId = objectId;
    }

    object() : Game_CharacterBase {
        return MovingHelper.getCharacterById(this._objectId);
    }

    /**
     * 新しく別 Character が上に乗るとき、その移動が終了し、入力を受け付ける状態となった時。
     * 主に Plate で使用する。
     */
    onRidderEnterd(ridder: Game_CharacterBase) {
    }
    
    /**
     * 別 Character が上から降りた時、その移動が終了し、入力を受け付ける状態となった時。
     * 主に Plate で使用する。
     */
    onRidderLeaved(ridder: Game_CharacterBase) {
    }

    /**
     * 乗っている別 Character の移動が終了し、入力を受け付ける状態となった時
     */
    //onRidderStepEnd(ridder: Game_CharacterBase)
    //{
    //}
}

export class PlateMovingBehavior extends MovingBehavior {
    onRidderEnterd(ridder: Game_CharacterBase) {
        //console.log("PlateMovingBehavior.onRidderEnterd");
        const event = this.object() as Game_Event;
        console.log(event.mapObjectEventTrigger());
        if (event.mapObjectEventTrigger() == EventTrigger.OnRideOnEvent) {
            event.start();
        }
    }
    onRidderLeaved(ridder: Game_CharacterBase) {
        //console.log("PlateMovingBehavior.onRidderLeaved");
        const event = this.object() as Game_Event;
        if (event.mapObjectEventTrigger() == EventTrigger.OnRideOffEvent) {
            event.start();
        }

    }
}


