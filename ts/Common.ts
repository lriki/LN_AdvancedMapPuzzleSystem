
export function assert(condition: any, msg?: string): asserts condition {
    if (!condition) {
        throw new Error(msg);
    }
};

export enum EventTrigger
{
    None,
    OnRideOnEvent,
    OnRideOffEvent,
    OnStartFalling,
    OnSpawnedAsEffect,      // Effcet 生成と同時に射程内を判定 & 起動する
    OnCollidedAsEffect,     // 別の反応するイベントと衝突したら
}

export function strToEventTrigger(str: string): EventTrigger {
    let t = str.toLocaleLowerCase();
    if (t === 'onrideonevent')
        return EventTrigger.OnRideOnEvent;
    else if (t === 'onrideoffevent')
        return EventTrigger.OnRideOffEvent;
    else if (t === 'onstartfalling')
        return EventTrigger.OnStartFalling;
    else if (t === 'onspawnedaseffect')
        return EventTrigger.OnSpawnedAsEffect;
    else if (t === 'oncollidedaseffect')
        return EventTrigger.OnCollidedAsEffect;
    else
        return EventTrigger.None;
}


export enum MovingMode {
    Stopping,
    GroundToGround,
    GroundToObject,
    ObjectToObject,
    ObjectToGround,
}
