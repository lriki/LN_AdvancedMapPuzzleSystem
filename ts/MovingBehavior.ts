/// <reference types="rpgmakermv_typescript_dts"/>

import { MovingHelper } from "./MovingHelper";
import { EventTrigger } from "./Common";


/**
 * 
 */
export class MovingBehavior {

    /**
     * ObjectType が変わった時や、マップ移動時のイベント構築時に呼ばれる。
     * セーブデータのロードでは呼ばれない。
     */
    onAttach(self: Game_CharacterBase) {

    }

    onUpdate(self: Game_CharacterBase) {

    }

    /**
     * 新しく別 Character が上に乗るとき、その移動が終了し、入力を受け付ける状態となった時。
     * 主に Plate で使用する。
     */
    onRidderEnterd(self: Game_CharacterBase, ridder: Game_CharacterBase) {
    }
    
    /**
     * 別 Character が上から降りた時、その移動が終了し、入力を受け付ける状態となった時。
     * 主に Plate で使用する。
     */
    onRidderLeaved(self: Game_CharacterBase, ridder: Game_CharacterBase) {
    }

    /**
     * 乗っている別 Character の移動が終了し、入力を受け付ける状態となった時
     */
    //onRidderStepEnd(ridder: Game_CharacterBase)
    //{
    //}
}

export interface PlateMovingBehaviorData {
    riddingObjects: number[];
    isModified: boolean;
    isPushing: boolean;
}

export class PlateMovingBehavior extends MovingBehavior {
    

    onAttach(self: Game_CharacterBase) {
        self._movingBehaviorData = {riddingObjects: [], isModified: false, isPushing: false};
    }
    
    onUpdate(self: Game_CharacterBase) {
        let data = self._movingBehaviorData as PlateMovingBehaviorData;
        if (data.isModified) {
            console.log("isModified", data);
            if (!data.isPushing) {
                if (data.riddingObjects.length > 0) {
                    // 押されていないが、乗っているオブジェクトがあるので押されている状態にする。
                    data.isPushing = true;
                    
                    const event = self as Game_Event;
                    if (event.mapObjectEventTrigger() == EventTrigger.OnRideOnEvent) {
                        event.start();
                    }
                }
            }
            else {
                if (data.riddingObjects.length == 0) {
                    // 押されているが、乗っているオブジェクトはひとつもなくなった。
                    data.isPushing = false;

                    const event = self as Game_Event;
                    if (event.mapObjectEventTrigger() == EventTrigger.OnRideOffEvent) {
                        event.start();
                    }
                }
            }

            data.isModified = false;
        }
    }

    onRidderEnterd(self: Game_CharacterBase, ridder: Game_CharacterBase) {
        //console.log("PlateMovingBehavior.onRidderEnterd");
        console.log("Enter", ridder);

        let data = self._movingBehaviorData as PlateMovingBehaviorData;
        data.riddingObjects.push(ridder.objectId());
        data.isModified = true;

        console.log("onRidderEnterd", this, data);
        /*
        const event = this.object() as Game_Event;
        console.log(event.mapObjectEventTrigger());
        if (event.mapObjectEventTrigger() == EventTrigger.OnRideOnEvent) {
            event.start();
        }
        */
    }
    onRidderLeaved(self: Game_CharacterBase, ridder: Game_CharacterBase) {
        let data = self._movingBehaviorData as PlateMovingBehaviorData;
        console.log("onRidderLeaved", this, data);
        const index = data.riddingObjects.findIndex(x => x == ridder.objectId());
        if (index >= 0) {
            data.riddingObjects.splice(index, 1);
            data.isModified = true;
            console.log("removed");
        }
        //console.log("Leaved", data);

/*
        //console.log("PlateMovingBehavior.onRidderLeaved");
        const event = this.object() as Game_Event;
        if (event.mapObjectEventTrigger() == EventTrigger.OnRideOffEvent) {
            event.start();
        }
*/
    }
}


