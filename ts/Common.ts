
export function assert(condition: any, msg?: string): asserts condition {
    if (!condition) {
        throw new Error(msg);
    }
};

export enum EventTrigger
{
    None,
    OnCharacterRideOn,
    OnStartedFalling,
    OnSpawnedAsEffect,      // Effcet 生成と同時に射程内を判定 & 起動する
    OnCollidedAsEffect,     // 別の反応するイベントと衝突したら
}

export function strToEventTrigger(str: string): EventTrigger {
    let t = str.toLocaleLowerCase();
    if (t === 'oncharacterrideon')
        return EventTrigger.OnCharacterRideOn;
    else if (t === 'onstartedfalling')
        return EventTrigger.OnStartedFalling;
    else if (t === 'onspawnedaseffect')
        return EventTrigger.OnSpawnedAsEffect;
    else if (t === 'oncollidedaseffect')
        return EventTrigger.OnCollidedAsEffect;
    else
        return EventTrigger.None;
}
