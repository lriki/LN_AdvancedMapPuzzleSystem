
export function assert(condition: any, msg?: string): asserts condition {
    if (!condition) {
        throw new Error(msg);
    }
};

export enum ObjectType
{
    Character,
    Box,
}

export enum EventTrigger
{
    None,
    OnCharacterRideOn,
    OnStartedFalling,
}

export function strToObjectType(str: string): ObjectType {
    let t = str.toLocaleLowerCase();
    if (t === 'box')
        return ObjectType.Box;
    else
        return ObjectType.Character;
}

export function strToEventTrigger(str: string): EventTrigger {
    let t = str.toLocaleLowerCase();
    if (t === 'oncharacterrideon')
        return EventTrigger.OnCharacterRideOn;
    else if (t === 'onstartedfalling')
        return EventTrigger.OnStartedFalling;
    else
        return EventTrigger.None;
}
