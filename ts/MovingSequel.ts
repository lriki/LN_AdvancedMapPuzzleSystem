import { MovingHelper } from "./MovingHelper";


/**
 * 複数のキャラクターが絡む一連の移動シーケンスを表現するためのクラス。
 * 
 * いろいろ Game_Character に書きすぎると結合度上がって大変なことになるので、
 * 特に移動に関係する部分を分離するのが主な目的。
 */
export class MovingSequel {
    _ownerCharacterId: number;
    _targetCharacterId: number;

    constructor() {
        this._ownerCharacterId = -1;
        this._targetCharacterId = -1;
    }

    attachMovingSequel(ownerCharacter: Game_CharacterBase, targetCharacter: Game_CharacterBase) {
        this._ownerCharacterId = ownerCharacter.objectId();
        this._targetCharacterId = targetCharacter.objectId();
        ownerCharacter._movingSequel = this;
        targetCharacter._movingSequelOwnerCharacterId = this._ownerCharacterId;
    };

    detach() {
        this.ownerCharacter()._movingSequel = undefined;
        this.targetCharacter()._movingSequelOwnerCharacterId = -1;
        this._ownerCharacterId = -1;
        this._targetCharacterId = -1;
    }
    
    ownerCharacter(): Game_Character {
        return MovingHelper.getCharacterById(this._ownerCharacterId);
    }

    targetCharacter(): Game_Character {
        return MovingHelper.getCharacterById(this._targetCharacterId);
    }

    // true を返すと処理済み。元の更新処理を行わない
    onOwnerUpdate(ownerCharacter: Game_CharacterBase) {
        return false;
    };
    
    // 1歩の更新が終わり、stop 状態に以降した瞬間。ここでまた移動すると、移動ルートなどが割り込まずに移動を継続できる。
    onOwnerStepEnding(ownerCharacter: Game_CharacterBase) {
    };
    
    onTargetUpdate(targetCharacter: Game_CharacterBase) {
        return false;
    };
    
    onTargetStepEnding(targetCharacter: Game_CharacterBase) {
    };
}

/**
 * 押して移動
 */
export class MovingSequel_PushMoving extends MovingSequel {
    _ownerOrignalMovingSpeed: number;   // 押し移動前の移動速度を保存して、終わったら復元するのに使う

    constructor() {
        super();
        this._ownerOrignalMovingSpeed = 0;
    }

    static checkPushable(obj: Game_CharacterBase) {
        return obj.isBoxType() && !obj.rider();
    };

    static tryStartPushObjectAndMove(character: Game_CharacterBase, d: number): boolean {
        if (!character.isMover()) {
            return false;
        }

        var dx = MovingHelper.roundXWithDirectionLong(character._x, d, 1);
        var dy = MovingHelper.roundYWithDirectionLong(character._y, d, 1);

        var target = MovingHelper.findObject(dx, dy);
        if (!target) {
            // 押せそうなオブジェクトは見つからなかった
            return false;
        }
        if (!this.checkPushable(target)) {
            return false;
        }

        if (target.isRidding()) {
            // オブジェクトが何か別のオブジェクトに乗っている

            if (character.isRidding()) {
                // 自分も何かのオブジェクトに乗っていれば押せる。すぐ隣とか。
            }
            else if (MovingHelper.checkFacingOutsideOnEdgeTile(character._x, character._y, d)) {
                // 自分が崖を臨んでいるなら押せる。
            }
            else {
                // ダメ
                return false;
            }
        }
        else {
            // オブジェクトは別のオブジェクトに乗っていない

            let selfOnEdge = MovingHelper.checkFacingOutsideOnEdgeTile(character._x, character._y, d);
            let targetOnEdge = MovingHelper.checkFacingOutsideOnEdgeTile(target._x, target._y, character.reverseDir(d));

            if (!character.isRidding()) {
                // 自分も乗っていない

                if (selfOnEdge || targetOnEdge) {
                    // どちらかが、Push 方向に対して侵入不可能な Edge 上にいる場合は押せない
                    // (崖上、または崖下から押せないようにする)
                    return false;
                }
                else {
                    // 押せる
                }
            }
            else if (targetOnEdge) {
                // 自分は別のオブジェクトに乗っているが、押せそうなオブジェクトが崖際にいる場合は押せる
            }
            else {
                // ダメ
                return false;
            }
        }


        if (this.tryMoveAsPushableObject(target, d)) {
            var behavior = new MovingSequel_PushMoving();
            
            behavior._ownerOrignalMovingSpeed = character.moveSpeed();
            character.setMoveSpeed(target.moveSpeed());
            
            character._forcePositionAdjustment = true;
            character.moveStraightMain(d);  // TODO: _forcePositionAdjustment 引数で渡していい気がする
            character._forcePositionAdjustment = false;
            if (character.isMovementSucceeded(character.x, character.y)) {
                behavior.attachMovingSequel(character, target);
                return true;
            }
        }

        
        return false;
    }

    static tryMoveAsPushableObject(obj: Game_CharacterBase, d: number) {

        if (!obj.isRidding()) {
            // 地面上にいる場合
            if (obj.attemptMoveGroundToGround(d)) {
                return true;
            }
            if (obj.attemptMoveGroundToObject(d, false)) {
                return true;
            }
        }
        else {
            // オブジェクトに乗っている場合
            if (obj.attemptMoveObjectToObject(d)) {
                return true;
            }
            if (obj.attemptMoveObjectToGround(d)) {
                return true;
            }
        }

        return false;
    }

    onOwnerUpdate(ownerCharacter: Game_CharacterBase) {
        return false;
    };

    onOwnerStepEnding(ownerCharacter: Game_CharacterBase) {
        ownerCharacter.setMoveSpeed(this._ownerOrignalMovingSpeed);
    };

    onTargetStepEnding(targetCharacter: Game_CharacterBase) {
        if (!targetCharacter.isFalling()) {
            //this.ownerCharacter()._forcePositionAdjustment = false;
            this.detach();
        }
        
    };
}













