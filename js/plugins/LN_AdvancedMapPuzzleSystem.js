//=============================================================================
// LN_AdvancedMapPuzzleSystem.js
// ----------------------------------------------------------------------------
// Copyright (c) 2020 lriki
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// [GitHub] : https://github.com/lriki/LN_AdvancedMapPuzzleSystem
// [Twitter]: https://twitter.com/lriki8
//=============================================================================

/*:ja
 * @plugindesc 謎解きマップシステムプラグイン v0.4.0
 * @author lriki
 * @param MapSkillEffectsMapId
 * @desc TODO
 * @type number
 * @default 1
 * 
 * @param GuideLineTerrainTag
 * @desc 箱オブジェクトの移動ガイドラインとなる地形タグです。
 * @type number
 * @default 7
 *
 * @help マップ上のキャラクター移動やイベントシステムを拡張し、
 * 謎解きの幅を広げるための様々な機能を追加します。
 * 
 * MIT License
 */


!function(r){var i={};function n(e){if(i[e])return i[e].exports;var t=i[e]={i:e,l:!1,exports:{}};return r[e].call(t.exports,t,t.exports,n),t.l=!0,t.exports}n.m=r,n.c=i,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(r,i,function(e){return t[e]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=6)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i="LN_AdvancedMapPuzzleSystem";t.paramMapSkillEffectsMapId=Number(PluginManager.parameters(i).MapSkillEffectsMapId),t.paramGuideLineTerrainTag=Number(PluginManager.parameters(i).GuideLineTerrainTag),t.paramFallingSpeed=5},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(0),a=DataManager.onLoad;DataManager.onLoad=function(e){if(a.call(this,e),0<n.paramMapSkillEffectsMapId&&e===$dataMapSkillEffectsMap){this.extractMetadata(e);for(var t=e.events,r=0;r<t.length;r++){var i=t[r];i&&void 0!==i.note&&this.extractMetadata(i)}}};var i=(o.dataMapSkillEffectsMap=function(){return $dataMapSkillEffectsMap},o.padZero=function(e,t){for(var r=e;r.length<t;)r="0"+r;return r},o.init=function(){0<n.paramMapSkillEffectsMapId&&DataManager.loadDataFile("$dataMapSkillEffectsMap","Map001.json")},o.tempMapSkillEffectDataId=-1,o.tempMapSkillEffectInvokerId=-1,o.pluginCommand=function(e,t){switch(e){case"AMPS-MapSkill":switch(t[0]){case"call":$gameMap.spawnMapSkillEffectEvent(t[1])}}},o);function o(){}t.AMPSManager=i},function(e,t,r){"use strict";var i,n;Object.defineProperty(t,"__esModule",{value:!0}),t.assert=function(e,t){if(!e)throw new Error(t)},(n=i=t.EventTrigger||(t.EventTrigger={}))[n.None=0]="None",n[n.OnRideOnEvent=1]="OnRideOnEvent",n[n.OnStartFalling=2]="OnStartFalling",n[n.OnSpawnedAsEffect=3]="OnSpawnedAsEffect",n[n.OnCollidedAsEffect=4]="OnCollidedAsEffect",t.strToEventTrigger=function(e){var t=e.toLocaleLowerCase();return"onrideonevent"===t?i.OnRideOnEvent:"onstartfalling"===t?i.OnStartFalling:"onspawnedaseffect"===t?i.OnSpawnedAsEffect:"oncollidedaseffect"===t?i.OnCollidedAsEffect:i.None}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var c=r(0),i=(f.isHalfStepX=function(e){return Math.floor(e.x)!==e.x},f.isHalfStepY=function(e){return Math.floor(e.y)!==e.y},f.frontX=function(e,t){return e+(6===t?1:4===t?-1:0)},f.frontY=function(e,t){return e+(2===t?1:8===t?-1:0)},f.frontXAligned=function(e,t){return Math.round(e)+(6===t?1:4===t?-1:0)},f.frontYAligned=function(e,t){return Math.round(e)+(2===t?1:8===t?-1:0)},f.roundXWithDirection=function(e,t){return $gameMap.roundX(e+(6===t?1:4===t?-1:0))},f.roundYWithDirection=function(e,t){return $gameMap.roundY(e+(2===t?1:8===t?-1:0))},f.roundXWithDirectionLong=function(e,t,r){for(var i=f.roundXWithDirection(e,t),n=Math.floor(r),a=0;a<n-1;a++)i=f.roundXWithDirection(i,t);var o=r-Math.floor(r);return 0<o&&(i+=f.roundXWithDirection(0,t)*o),i},f.roundYWithDirectionLong=function(e,t,r){for(var i=f.roundYWithDirection(e,t),n=Math.floor(r),a=0;a<n-1;a++)i=f.roundYWithDirection(i,t);var o=r-Math.floor(r);return 0<o&&(i+=f.roundYWithDirection(0,t)*o),i},f.checkFacingOutsideOnEdgeTile=function(e,t,r){var i=Math.round(e),n=Math.round(t);return!$gameMap.checkPassage(i,n,1<<r/2-1&15)},f.checkFacingOtherEdgeTile=function(e,t,r,i){var n=Math.round(f.roundXWithDirectionLong(e,r,i)),a=Math.round(f.roundYWithDirectionLong(t,r,i));return!$gameMap.isPassable(n,a,f.reverseDir(r))},f.canPassJumpGroove=function(e,t,r,i){if(2!=i&&8!=i||!f.isHalfStepX(e))return f.canPassJumpGrooveInternal(e,t,r,i);var n=f.canPassJumpGrooveInternal(e,t-1,r,i),a=f.canPassJumpGrooveInternal(e,t,r,i);return!(!n||!a)&&a},f.canPassJumpGrooveInternal=function(e,t,r,i){var n=Math.round(t),a=Math.round(r),o=Math.round(f.roundXWithDirectionLong(t,i,2)),s=Math.round(f.roundYWithDirectionLong(r,i,2)),c=Math.round(f.roundXWithDirectionLong(t,i,1)),h=Math.round(f.roundYWithDirectionLong(r,i,1)),p=f.roundXWithDirectionLong(t,i,2),u=f.roundYWithDirectionLong(r,i,2);if(!$gameMap.isValid(o,s))return!1;if(!$gameMap.isPassable(n,a,i))return!1;var l=e.reverseDir(i);return!!$gameMap.isPassable(o,s,l)&&!e.isCollidedWithCharacters(p,u)&&!!$gameMap.checkGroove(c,h)},f.checkJumpGroundToGroundInternal=function(e,t,r,i,n){var a=Math.round(t),o=Math.round(r),s=f.roundXWithDirectionLong(t,i,n),c=f.roundYWithDirectionLong(r,i,n),h=Math.round(s),p=Math.round(c);if(!$gameMap.isValid(h,p))return{pass:!1,x:0,y:0};var u=e.reverseDir(i);if($gameMap.isPassable(a,o,i)||$gameMap.isPassable(h,p,u))return{pass:!1,x:0,y:0};if($gameMap.checkNotPassageAll(h,p))return{pass:!1,x:0,y:0};if(e.isCollidedWithCharacters(s,c))return{pass:!1,x:0,y:0};var l=f.roundXWithDirectionLong(t,i,1),d=f.roundYWithDirectionLong(r,i,1);return f.isCollidedWithRiddingEvents(l,d)?{pass:!1,x:0,y:0}:{pass:!0,x:s,y:c}},f.checkMoveOrJumpGroundToObject=function(e,t,r,i,n){var a=Math.round(e),o=Math.round(t),s=Math.round(f.roundXWithDirectionLong(e,r,i)),c=Math.round(f.roundYWithDirectionLong(t,r,i));if(n||!$gameMap.isPassable(a,o,r)){var h=f.findPassableRideObject(s,c);return h||void 0}},f.checkMoveOrJumpObjectToGround=function(e,t,r,i,n){var a=Math.round(f.roundXWithDirectionLong(t,i,n)),o=Math.round(f.roundYWithDirectionLong(r,i,n));if(e.isBoxType()&&!e.isFalling()&&$gameMap.terrainTag(a,o)!=c.paramGuideLineTerrainTag)return!1;var s=e.reverseDir(i);return!$gameMap.isPassable(a,o,s)&&!$gameMap.checkNotPassageAll(a,o)&&!e.isCollidedWithCharacters(a,o)},f.checkMoveOrJumpObjectToObject=function(e,t,r,i){var n=Math.round(f.roundXWithDirectionLong(e,r,i)),a=Math.round(f.roundYWithDirectionLong(t,r,i)),o=f.findPassableRideObject(n,a);if(o)return o},f.isCollidedWithRiddingEvents=function(e,t){return $gameMap.eventsXyNt(e,t).some(function(e){return e.isRidding()})},f.findPassableRideObject=function(e,t){for(var r=$gameMap.events(),i=0;i<r.length;i++)if(r[i].checkPassRide(e,t))return r[i]},f.getCharacterById=function(e){return 0==e?$gamePlayer:$gameMap.events()[e-1]},f.findReactorMapObjectInLineRange=function(e,t,r,i,n){var a=n.toLocaleLowerCase(),o=0;$gameMap.isPassable(e,t,r)||o--;for(var s=0;s<i;s++){var c=Math.round(f.roundXWithDirectionLong(e,r,s+1)),h=Math.round(f.roundYWithDirectionLong(t,r,s+1)),p=this.reverseDir(r);if($gameMap.isPassable(c,h,p)||o++,0===o)for(var u=$gameMap.eventsXyNt(c,h),l=0;l<u.length;l++){var d=u[l];if(d.isMapObject()&&d.reactionMapSkill()==a)return d}if($gameMap.isValid(c,h-1)&&f.checkLayeredTilesFlags($gameMap,c,h-1,16))return;if($gameMap.eventsXyNt(c,h).some(function(e){return 1<=e.objectHeight()}))return;$gameMap.isPassable(c,h,r)||o--}},f.canPassJumpGroundToGround=function(e,t,r,i){if(Math.round(t),Math.round(r),Math.round(f.roundXWithDirectionLong(t,i,2)),Math.round(f.roundYWithDirectionLong(r,i,2)),2==i||8==i){var n=2-(r-Math.floor(r));if(f.isHalfStepX(e)){var a=f.checkJumpGroundToGroundInternal(e,t-1,r,i,n),o=f.checkJumpGroundToGroundInternal(e,t,r,i,n);return!(!a.pass||!o.pass)&&o.pass}return f.checkJumpGroundToGroundInternal(e,t,r,i,n).pass}if(!f.isHalfStepY(e)||4!=i&&6!=i)return f.checkJumpGroundToGroundInternal(e,t,r,i,2).pass;if(!(a=f.checkJumpGroundToGroundInternal(e,t,r,i,2)).pass)return!1;var s=a.x,c=Math.ceil(a.y);return!(e.isCollidedWithCharacters(s,c)&&!(o=f.checkJumpGroundToGroundInternal(e,Math.round(t),c-1,i,2)).pass)&&a.pass},f.findObject=function(e,t){for(var r=$gameMap.eventsXyNt(e,t),i=0;i<r.length;i++)if(r[i].isMapObject())return r[i]},f.checkLayeredTilesFlags=function(e,t,r,i){var n=e.tilesetFlags();return e.layeredTiles(t,r).some(function(e){return 0!==e&&0!=(n[e]&i)})},f.reverseDir=function(e){return 10-e},f.linear=function(e,t,r,i){return r*(e/i)+t},f.easeInExpo=function(e,t,r,i){return r*Math.pow(2,10*(e/i-1))+t},f.distance2D=function(e,t,r,i){var n=r-e,a=i-t;return Math.sqrt(n*n+a*a)},f);function f(){}t.MovingHelper=i},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i={name:"Evasion1",volume:80,pitch:110,pan:0},n={name:"Earth3",volume:80,pitch:100,pan:0},a=SoundManager.preloadImportantSounds;SoundManager.preloadImportantSounds=function(){a.call(SoundManager),$dataSystem&&AudioManager.loadStaticSe(i)};var o=(s.playGSJump=function(){$dataSystem&&AudioManager.playStaticSe(i)},s.playGSFalled=function(){AudioManager.playSe(n)},s);function s(){}t.AMPS_SoundManager=o},function(e,t,r){"use strict";var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=r(3),a=(s.prototype.attachMovingSequel=function(e,t){this._ownerCharacterId=e.objectId(),this._targetCharacterId=t.objectId(),e._movingSequel=this,t._movingSequelOwnerCharacterId=this._ownerCharacterId},s.prototype.detach=function(){this.ownerCharacter()._movingSequel=void 0,this.targetCharacter()._movingSequelOwnerCharacterId=-1,this._ownerCharacterId=-1,this._targetCharacterId=-1},s.prototype.ownerCharacter=function(){return o.MovingHelper.getCharacterById(this._ownerCharacterId)},s.prototype.targetCharacter=function(){return o.MovingHelper.getCharacterById(this._targetCharacterId)},s.prototype.onOwnerUpdate=function(e){return!1},s.prototype.onOwnerStepEnding=function(e){},s.prototype.onTargetUpdate=function(e){return!1},s.prototype.onTargetStepEnding=function(e){},s);function s(){this._ownerCharacterId=-1,this._targetCharacterId=-1}t.MovingSequel=a;var c,h=(n(p,c=a),p.checkPushable=function(e){return e.isBoxType()&&!e.rider()},p.tryStartPushObjectAndMove=function(e,t){if(!e.isMover())return!1;var r=o.MovingHelper.roundXWithDirectionLong(e._x,t,1),i=o.MovingHelper.roundYWithDirectionLong(e._y,t,1),n=o.MovingHelper.findObject(r,i);if(!n)return!1;if(!this.checkPushable(n))return!1;if(n.isRidding()){if(!e.isRidding()&&!o.MovingHelper.checkFacingOutsideOnEdgeTile(e._x,e._y,t))return!1}else if(e.isRidding()&&!o.MovingHelper.checkFacingOutsideOnEdgeTile(n._x,n._y,e.reverseDir(t)))return!1;if(this.tryMoveAsPushableObject(n,t)){var a=new p;if(a._ownerOrignalMovingSpeed=e.moveSpeed(),e.setMoveSpeed(n.moveSpeed()),e._forcePositionAdjustment=!0,e.moveStraightMain(t),e._forcePositionAdjustment=!1,e.isMovementSucceeded(e.x,e.y))return a.attachMovingSequel(e,n),!0}return!1},p.tryMoveAsPushableObject=function(e,t){if(e.isRidding()){if(e.attemptMoveObjectToObject(t))return!0;if(e.attemptMoveObjectToGround(t))return!0}else{if(e.attemptMoveGroundToGround(t))return!0;if(e.attemptMoveGroundToObject(t,!1))return!0}return!1},p.prototype.onOwnerUpdate=function(e){return!1},p.prototype.onOwnerStepEnding=function(e){e.setMoveSpeed(this._ownerOrignalMovingSpeed)},p.prototype.onTargetStepEnding=function(e){e.isFalling()||this.detach()},p);function p(){var e=c.call(this)||this;return e._ownerOrignalMovingSpeed=0,e}t.MovingSequel_PushMoving=h},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),r(0),r(1),r(4),r(5),r(7),r(8),r(9),r(10),r(11),r(12),r(13)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,i,n,a,s=r(2),c=r(3),h=r(4),p=r(5),u=r(0);(i=o=o||{})[i.Stopping=0]="Stopping",i[i.GroundToGround=1]="GroundToGround",i[i.GroundToObject=2]="GroundToObject",i[i.ObjectToObject=3]="ObjectToObject",i[i.ObjectToGround=4]="ObjectToGround",(a=n=n||{})[a.None=0]="None",a[a.Failling=1]="Failling",a[a.EpilogueToRide=2]="EpilogueToRide";var l=Game_CharacterBase.prototype.initMembers;Game_CharacterBase.prototype.initMembers=function(){l.call(this),this._objectTypeBox=!1,this._objectTypeEffect=!1,this._objectTypeReactor=!1,this._ridderCharacterId=-1,this._riddeeCharacterId=-1,this._waitAfterJump=0,this._extraJumping=!1,this._ridingScreenZPriority=-1,this._movingMode=o.Stopping,this._forcePositionAdjustment=!1,this._moveToFalling=!1,this._fallingState=n.None,this._fallingOriginalSpeed=0,this._fallingOriginalThrough=!1,this._movingSequel=void 0,this._movingSequelOwnerCharacterId=-1,this._getonoffFrameCount=0,this._getonoffFrameMax=0,this._getonoffStartX=0,this._getonoffStartY=0};var d=Game_CharacterBase.prototype.moveStraight;Game_CharacterBase.prototype.moveStraight=function(e){s.assert(2==e||4==e||6==e||8==e),0<this._waitAfterJump?this._waitAfterJump--:p.MovingSequel_PushMoving.tryStartPushObjectAndMove(this,e)||this.moveStraightMain(e)};var f=Game_CharacterBase.prototype.moveDiagonally;Game_CharacterBase.prototype.moveDiagonally=function(e,t){this.isRidding()||f.call(this,e,t)},Game_CharacterBase.prototype.isRidding=function(){return 0<=this._riddeeCharacterId},Game_CharacterBase.prototype.isMapObject=function(){return this.isBoxType()||this.isEffectType()||this.isReactorType()},Game_CharacterBase.prototype.isBoxType=function(){return this._objectTypeBox},Game_CharacterBase.prototype.isEffectType=function(){return this._objectTypeEffect},Game_CharacterBase.prototype.isReactorType=function(){return this._objectTypeReactor},Game_CharacterBase.prototype.objectId=function(){return-1},Game_CharacterBase.prototype.objectHeight=function(){return-1},Game_CharacterBase.prototype.isMover=function(){return!this._objectTypeBox},Game_CharacterBase.prototype.canRide=function(){return 0<=this.objectHeight()},Game_CharacterBase.prototype.checkPassRide=function(e,t){if(this.canRide()&&!this.rider()){var r=Math.round(this._x),i=Math.round(this._y)-this.objectHeight();if(e==r&&t==i)return!0}return!1},Game_CharacterBase.prototype.rider=function(){return this._ridderCharacterId<0?void 0:0==this._ridderCharacterId?$gamePlayer:$gameMap.event(this._ridderCharacterId)},Game_CharacterBase.prototype.riddingObject=function(){return this._riddeeCharacterId<0?void 0:0==this._riddeeCharacterId?$gamePlayer:$gameMap.event(this._riddeeCharacterId)},Game_CharacterBase.prototype.isFalling=function(){return this._fallingState!=n.None};var g=Game_CharacterBase.prototype.screenZ;Game_CharacterBase.prototype.screenZ=function(){var e=g.call(this),t=this.riddingObject();return this.isRidding()&&t&&(e+=t.screenZ()),0<=this._ridingScreenZPriority&&(e=this._ridingScreenZPriority),e+(this._extraJumping?6:0)},Game_CharacterBase.prototype.moveStraightMain=function(e){this.setMovementSuccess(!1),this.isRidding()?(this.attemptMoveObjectToGround(e)||this.attemptMoveObjectToObject(e)||this.attemptJumpObjectToGround(e)||this.attemptJumpObjectToObject(e),this.setDirection(e)):this.attemptMoveGroundToGround(e)||this.attemptMoveGroundToObject(e,!1)||this.attemptJumpGroundToGround(e)||this.attemptJumpGroove(e)||this.attemptJumpGroundToObject(e)},Game_CharacterBase.prototype.attemptMoveGroundToGround=function(e){if(this.isBoxType()&&!this.isThrough()){var t=Math.round(c.MovingHelper.roundXWithDirectionLong(this._x,e,1)),r=Math.round(c.MovingHelper.roundYWithDirectionLong(this._y,e,1));if($gameMap.terrainTag(t,r)==u.paramGuideLineTerrainTag&&this.isMapPassable(this._x,this._y,e)&&(d.call(this,e),this.isMovementSucceeded(this.x,this.y)))return!0;if(this.isFallable()&&$gameMap.terrainTag(this._x,this._y)==u.paramGuideLineTerrainTag&&c.MovingHelper.checkFacingOutsideOnEdgeTile(this._x,this._y,e)&&!c.MovingHelper.checkMoveOrJumpObjectToObject(this._x,this._y,e,1))return this.moveToDir(e,!1),this.setMovementSuccess(!0),this._moveToFalling=!0}else{var i=this._x,n=this._y;if(d.call(this,e),this._movementSuccess)return this._forcePositionAdjustment&&(this._x=Math.round(c.MovingHelper.roundXWithDirection(i,e)),this._y=Math.round(c.MovingHelper.roundYWithDirection(n,e))),this._movingMode=o.GroundToGround,!0}return!1},Game_CharacterBase.prototype.attemptJumpGroundToGround=function(e){return!!c.MovingHelper.canPassJumpGroundToGround(this,this._x,this._y,e)&&(this.setMovementSuccess(!0),this.jumpToDir(e,2,!1,!0),this._movingMode=o.GroundToGround,!0)},Game_CharacterBase.prototype.attemptJumpGroove=function(e){return!!c.MovingHelper.canPassJumpGroove(this,this._x,this._y,e)&&(this.setMovementSuccess(!0),this.jumpToDir(e,2,!1,!1),this._movingMode=o.GroundToGround,!0)},Game_CharacterBase.prototype.attemptMoveGroundToObject=function(e,t){var r=c.MovingHelper.checkMoveOrJumpGroundToObject(this._x,this._y,e,1,t);return!(!r||r==this)&&(this.setMovementSuccess(!0),this.resetGetOnOffParams(),this.moveToDir(e,!0),this.rideToObject(r),this._movingMode=o.GroundToObject,!0)},Game_CharacterBase.prototype.attemptJumpGroundToObject=function(e){var t=c.MovingHelper.checkMoveOrJumpGroundToObject(this._x,this._y,e,2,!1);return!(!t||t==this)&&(this.setMovementSuccess(!0),this.resetGetOnOffParams(),this.jumpToDir(e,2,!0,!0),this.rideToObject(t),this._movingMode=o.GroundToObject,!0)},Game_CharacterBase.prototype.attemptMoveObjectToGround=function(e){return s.assert(this.isRidding()),c.MovingHelper.checkMoveOrJumpObjectToGround(this,this._x,this._y,e,1)?(this.setMovementSuccess(!0),this.resetGetOnOffParams(),this.moveToDir(e,!1),this.unrideFromObject(),this._movingMode=o.ObjectToGround,!0):!(!this.isBoxType()||!this.isFallable()||c.MovingHelper.checkFacingOtherEdgeTile(this._x,this._y,e,1))&&(this.setMovementSuccess(!0),this.resetGetOnOffParams(),this.moveToDir(e,!1),this.unrideFromObject(),this._moveToFalling=!0)},Game_CharacterBase.prototype.attemptMoveObjectToObject=function(e){s.assert(this.isRidding());var t=c.MovingHelper.checkMoveOrJumpObjectToObject(this._x,this._y,e,1);return!(!t||t==this)&&(this.setMovementSuccess(!0),this.resetGetOnOffParams(),this.moveToDir(e,!1),this.unrideFromObject(),this.rideToObject(t),this._movingMode=o.ObjectToObject,!0)},Game_CharacterBase.prototype.attemptJumpObjectToGround=function(e){return!!c.MovingHelper.checkMoveOrJumpObjectToGround(this,this._x,this._y,e,2)&&(this.setMovementSuccess(!0),this.jumpToDir(e,2,!1,!0),this._movingMode=o.ObjectToGround,!0)},Game_CharacterBase.prototype.attemptJumpObjectToObject=function(e){var t=c.MovingHelper.checkMoveOrJumpObjectToObject(this._x,this._y,e,2);return!!t&&(this.setMovementSuccess(!0),this.resetGetOnOffParams(),this.jumpToDir(e,2,!0,!0),this.rideToObject(t),this._movingMode=o.ObjectToObject,!0)};var v=Game_CharacterBase.prototype.jump;Game_CharacterBase.prototype.jump=function(e,t){v.call(this,e,t),this.isRidding()&&this.unrideFromObject()},Game_CharacterBase.prototype.rideToObject=function(e){s.assert(!this.isRidding()),s.assert(0<=this.objectId()),s.assert(0<=e.objectId()),this._riddeeCharacterId=e.objectId(),e._ridderCharacterId=this.objectId(),s.assert(this._riddeeCharacterId!=e._ridderCharacterId);var t=this._ridingScreenZPriority;this._ridingScreenZPriority=-1,this._ridingScreenZPriority=this.screenZ(),this._ridingScreenZPriority=Math.max(this._ridingScreenZPriority,t)},Game_CharacterBase.prototype.unrideFromObject=function(){s.assert(this.isRidding());var e=this.riddingObject();e&&(e._ridderCharacterId=-1),this._riddeeCharacterId=-1},Game_CharacterBase.prototype.moveToDir=function(e,t){this._x=$gameMap.roundXWithDirection(this._x,e),this._y=$gameMap.roundYWithDirection(this._y,e),this._realX=$gameMap.xWithDirection(this._x,this.reverseDir(e)),this._realY=$gameMap.yWithDirection(this._y,this.reverseDir(e)),(t||this._forcePositionAdjustment)&&(this._y=Math.round(this._y)),this._forcePositionAdjustment&&(this._x=Math.round(this._x))},Game_CharacterBase.prototype.jumpToDir=function(e,t,r,i){var n=this._x,a=this._y;r||(n=Math.round(this._x),2==e||8==e||(a=Math.round(this._y)));var o=Math.round(c.MovingHelper.roundXWithDirectionLong(this._x,e,t)),s=Math.round(c.MovingHelper.roundYWithDirectionLong(this._y,e,t));this.jump(o-n,s-a),this._waitAfterJump=10,this._extraJumping=i,h.AMPS_SoundManager.playGSJump()},Game_CharacterBase.prototype.startFall=function(){this._fallingState=n.Failling,this._fallingOriginalThrough=this.isThrough(),this._fallingOriginalSpeed=this.moveSpeed(),this.setThrough(!0),this.setMoveSpeed(u.paramFallingSpeed),this.onStartFalling()};var m=Game_CharacterBase.prototype.isMoving;Game_CharacterBase.prototype.isMoving=function(){return(!this.isRidding()||this._movingMode!=o.Stopping)&&m.call(this)};var _=Game_CharacterBase.prototype.update;Game_CharacterBase.prototype.update=function(){if(!this._movingSequel||!this._movingSequel.onOwnerUpdate(this)){if(0<=this._movingSequelOwnerCharacterId){var e=c.MovingHelper.getCharacterById(this._movingSequelOwnerCharacterId);if(e._movingSequel&&e._movingSequel.onTargetUpdate(this))return}var t;_.call(this),this.isFalling()&&this.updateFall(),!this.isRidding()||this._movingMode!=o.Stopping||(t=this.riddingObject())&&(this._x=t._x,this._y=t._y-t.objectHeight(),this._realX=t._realX,this._realY=t._realY-t.objectHeight())}};var M=Game_CharacterBase.prototype.updateStop;Game_CharacterBase.prototype.updateStop=function(){M.call(this),this.isRidding()||(this._ridingScreenZPriority=-1),this._movingMode=o.Stopping};var y=Game_CharacterBase.prototype.updateMove;Game_CharacterBase.prototype.updateMove=function(){var e,t,r,i,n=this.isMoving();this.isMoving()&&this._movingMode!=o.Stopping&&this._movingMode!=o.GroundToGround?(this._getonoffFrameCount++,t=e=0,this._movingMode==o.GroundToObject||this._movingMode==o.ObjectToObject?(r=this.riddingObject())&&(e=r._realX,t=r._realY-r.objectHeight()):this._movingMode==o.ObjectToGround&&(e=this._x,t=this._y),i=Math.min(this._getonoffFrameCount/this._getonoffFrameMax,1),this._realX=c.MovingHelper.linear(i,this._getonoffStartX,e-this._getonoffStartX,1),this._realY=c.MovingHelper.linear(i,this._getonoffStartY,t-this._getonoffStartY,1),this._getonoffFrameCount>=this._getonoffFrameMax&&(this._movingMode=o.Stopping)):y.call(this),n==this.isMoving()||this.isMoving()||(this._moveToFalling?(this._moveToFalling=!1,this.startFall()):this.onStepEnd())};var S=Game_CharacterBase.prototype.updateJump;Game_CharacterBase.prototype.updateJump=function(){var e,t,r,i,n,a=this.isJumping();S.call(this),this.isRidding()&&a&&(this._movingMode!=o.GroundToObject&&this._movingMode!=o.ObjectToObject||(e=this.riddingObject())&&(t=e._realX,r=e._realY-e.objectHeight(),i=2*this._jumpPeak,n=Math.min((i-this._jumpCount+1)/i,1),this._realX=c.MovingHelper.linear(n,this._getonoffStartX,t-this._getonoffStartX,1),this._realY=c.MovingHelper.linear(n,this._getonoffStartY,r-this._getonoffStartY,1),this._x=e._x,this._y=e._y-e.objectHeight())),this.isJumping()||(this._extraJumping=!1,this._movingMode=o.Stopping,a!=this.isJumping()&&this.onJumpEnd())},Game_CharacterBase.prototype.updateFall=function(){this.isMoving()||(this._fallingState==n.Failling&&($gameMap.terrainTag(this._x,this._y)==u.paramGuideLineTerrainTag||this.attemptMoveGroundToObject(2,!0)?this._fallingState=n.EpilogueToRide:this.moveStraightMain(2)),this._fallingState==n.EpilogueToRide&&(this._fallingState=n.None,this.setThrough(this._fallingOriginalThrough),this.setMoveSpeed(this._fallingOriginalSpeed),this.onStepEnd(),h.AMPS_SoundManager.playGSFalled()))},Game_CharacterBase.prototype.resetGetOnOffParams=function(){this._getonoffFrameMax=1/this.distancePerFrame(),this._getonoffFrameCount=0,this._getonoffStartX=this._realX,this._getonoffStartY=this._realY},Game_CharacterBase.prototype.onStepEnd=function(){var e;this._movingSequel&&this._movingSequel.onOwnerStepEnding(this),0<=this._movingSequelOwnerCharacterId&&((e=c.MovingHelper.getCharacterById(this._movingSequelOwnerCharacterId))._movingSequel&&e._movingSequel.onTargetStepEnding(this));var t=this.riddingObject();t&&t.onRideOnEvent()},Game_CharacterBase.prototype.onJumpEnd=function(){var e=this.riddingObject();e&&e.onRideOnEvent()},Game_CharacterBase.prototype.onRideOnEvent=function(){},Game_CharacterBase.prototype.onStartFalling=function(){};var b=Game_CharacterBase.prototype.isHalfMove;Game_CharacterBase.prototype.isHalfMove=function(){return!!this.isMover()&&(!this._forcePositionAdjustment&&(!!b&&b.call(this)))}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Game_Player.prototype.objectId=function(){return 0};var i=Game_Player.prototype.isCollided;Game_Player.prototype.isCollided=function(e,t){return!this.isRidding()&&i.call(this,e,t)};var n=Game_Player.prototype.canMove;Game_Player.prototype.canMove=function(){return!this._movingSequel&&n.call(this)};var a=Game_Player.prototype.isDashing;Game_Player.prototype.isDashing=function(){return!this._movingSequel&&a.call(this)}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s,i,n=r(0),c=r(2),a=r(1),o=r(3);(i=s=s||{})[i.Default=0]="Default",i[i.Front=1]="Front",Game_Event.prototype.clearMapObjectSettings=function(){this._objectTypeBox=!1,this._objectTypeEffect=!1,this._objectTypeReactor=!1,this._objectHeight=-1,this._fallable=!1,this._mapObjectEventTrigger=c.EventTrigger.None,this._mapSkillRange=-1,this._reactionMapSkill="",this._mapSkillEffectInitialPosition=s.Default};var h=Game_Event.prototype.initMembers;Game_Event.prototype.initMembers=function(){h.call(this),this._objectHeight=-1,this._fallable=!1,this._mapObjectEventTrigger=c.EventTrigger.None,this._mapSkillEffectDataId=a.AMPSManager.tempMapSkillEffectDataId,this._mapSkillEffectInvokerId=a.AMPSManager.tempMapSkillEffectInvokerId,this._mapSkillEffectInitialPosition=s.Default};var p=Game_Event.prototype.event;Game_Event.prototype.event=function(){if(0<n.paramMapSkillEffectsMapId){var e=a.AMPSManager.dataMapSkillEffectsMap();if(e&&e.events&&this.isDynamicMapEffectEvent())return e.events[this._mapSkillEffectDataId]}return p.call(this)};var u=Game_Event.prototype.isTriggerIn;Game_Event.prototype.isTriggerIn=function(e){return this._mapObjectEventTrigger===c.EventTrigger.None&&u.call(this,e)};var l=Game_Event.prototype.checkEventTriggerTouch;Game_Event.prototype.checkEventTriggerTouch=function(e,t){this._mapObjectEventTrigger!==c.EventTrigger.None||l.call(this,e,t)};var d=Game_Event.prototype.checkEventTriggerAuto;Game_Event.prototype.checkEventTriggerAuto=function(){this._mapObjectEventTrigger!==c.EventTrigger.None||d.call(this)},Game_Event.prototype.objectId=function(){return this.eventId()},Game_Event.prototype.objectHeight=function(){return this._objectHeight},Game_Event.prototype.isFallable=function(){return this._fallable},Game_Event.prototype.isDynamicMapEffectEvent=function(){return this._mapId===n.paramMapSkillEffectsMapId&&0<=this._mapSkillEffectDataId},Game_Event.prototype.reactionMapSkill=function(){return this._reactionMapSkill},Game_Event.prototype.mapSkillEffectInvoker=function(){return this._mapSkillEffectInvokerId<0?void 0:0==this._mapSkillEffectInvokerId?$gamePlayer:$gameMap.event(this._mapSkillEffectInvokerId)},Game_Event.prototype.directionAsMapSkillEffect=function(){var e=this.mapSkillEffectInvoker();return e?e.direction():this.direction()};var f=Game_Event.prototype.refresh;Game_Event.prototype.refresh=function(){f.call(this);var e=this.mapSkillEffectInvoker();e&&((this._mapSkillEffectInitialPosition=s.Front)?this.locate(o.MovingHelper.frontX(e.x,e.direction()),o.MovingHelper.frontY(e.y,e.direction())):this.locate(e.x,e.y))};var g=Game_Event.prototype.setupPage;Game_Event.prototype.setupPage=function(){var e,t,r,i=this.objectHeight(),n=this.rider();g.call(this),!this.isMapObject()&&n&&n.jump(0,i),this.isEffectType()&&this._mapObjectEventTrigger==c.EventTrigger.OnSpawnedAsEffect&&(!(t=this.mapSkillEffectInvoker())||(r=o.MovingHelper.findReactorMapObjectInLineRange(t.x,t.y,this.directionAsMapSkillEffect(),this._mapSkillRange,null!==(e=this.event().name)&&void 0!==e?e:""))&&r.startAsReactor())};var v=Game_Event.prototype.clearPageSettings;Game_Event.prototype.clearPageSettings=function(){v.call(this),this.clearMapObjectSettings()};var m=Game_Event.prototype.setupPageSettings;Game_Event.prototype.setupPageSettings=function(){m.call(this),this.parseListCommentForAMPSObject(),this._mapObjectEventTrigger!=c.EventTrigger.None&&(this._interpreter=null)},Game_Event.prototype.parseListCommentForAMPSObject=function(){if(this.clearMapObjectSettings(),0<=this._pageIndex){var e=this.list();if(e){for(var t="",r=0;r<e.length;r++)108!=e[r].code&&408!=e[r].code||e[r].parameters&&(t+=e[r].parameters);var i=t.indexOf("@MapObject");if(0<=i){for(var n=t.substring(i+6),a=(n=n.substring(n.indexOf("{")+1,n.indexOf("}"))).split(","),r=0;r<a.length;r++){var o=a[r].split(":");switch(o[0].trim().toLocaleLowerCase()){case"type":switch(console.error("@MapObject.type is deprecated. use 'box:true'"),o[1].trim().toLocaleLowerCase()){case"box":this._objectTypeBox=!0;break;case"effect":this._objectTypeEffect=!0;break;case"reactor":this._objectTypeReactor=!0}break;case"box":this._objectTypeBox=!(2<=o.length)||Boolean(o[1].trim());break;case"effect":this._objectTypeEffect=!(2<=o.length)||Boolean(o[1].trim());break;case"reactor":this._objectTypeReactor=!(2<=o.length)||Boolean(o[1].trim());break;case"h":case"height":this._objectHeight=Number(o[1].trim());break;case"fallable":this._fallable="true"==o[1].trim();break;case"trigger":this._mapObjectEventTrigger=c.strToEventTrigger(o[1].trim());break;case"range":this._mapSkillRange=Number(o[1].trim());break;case"reaction":this._reactionMapSkill=o[1].trim().toLocaleLowerCase();break;case"pos":switch(o[1].trim().toLocaleLowerCase()){case"front":this._mapSkillEffectInitialPosition=s.Front}}}return!0}}}return!1};var _=Game_Event.prototype.start;Game_Event.prototype.start=function(){this.isReactorType()||_.call(this)},Game_Event.prototype.startAsReactor=function(){_.call(this)};var M=Game_Event.prototype.updateParallel;Game_Event.prototype.updateParallel=function(){var e;this._interpreter?(e=this._interpreter.isRunning(),M.call(this),e&&!this._interpreter.isRunning()&&this.onTerminateParallelEvent()):M.call(this)},Game_Event.prototype.onTerminateParallelEvent=function(){this.isDynamicMapEffectEvent()&&$gameMap.despawnMapSkillEffectEvent(this)},Game_Event.prototype.onRideOnEvent=function(){this._mapObjectEventTrigger===c.EventTrigger.OnRideOnEvent&&this.start()},Game_Event.prototype.onStartFalling=function(){this._mapObjectEventTrigger===c.EventTrigger.OnStartFalling&&this.start()}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=r(0),o=r(1),c=r(2);Game_Map.prototype.checkPassage=function(e,t,r){for(var i=this.tilesetFlags(),n=this.allTiles(e,t),a=0;a<n.length;a++){var o=i[n[a]];if(i[n[a]]>>12!=s.paramGuideLineTerrainTag&&0==(16&o)){if(0==(o&r))return!0;if((o&r)===r)return!1}}return!1},Game_Map.prototype.checkNotPassageAll=function(e,t){for(var r=this.tilesetFlags(),i=this.allTiles(e,t),n=0,a=0;a<i.length;a++){n|=r[i[a]]}return 15==(15&n)},Game_Map.prototype.checkGroove=function(e,t){for(var r=this.allTiles(e,t),i=0;i<r.length;i++)if(Tilemap.isTileA1(r[i]))return!0;return!1},Game_Map.prototype.spawnMapSkillEffectEvent=function(e){c.assert(0<s.paramMapSkillEffectsMapId);var t=o.AMPSManager.dataMapSkillEffectsMap();if(t&&t.events){for(var r=-1,i=0;i<t.events.length;i++)if(t.events[i]&&t.events[i].name==e){r=i;break}if(0<=r){o.AMPSManager.tempMapSkillEffectDataId=r,o.AMPSManager.tempMapSkillEffectInvokerId=0;var n=this._events.length,a=new Game_Event(s.paramMapSkillEffectsMapId,n);return o.AMPSManager.tempMapSkillEffectDataId=-1,o.AMPSManager.tempMapSkillEffectInvokerId=-1,a._eventIndex=n,this._events[n]=a,this._spawnMapSkillEffectEventcallback&&this._spawnMapSkillEffectEventcallback(a),a}}},Game_Map.prototype.despawnMapSkillEffectEvent=function(e){c.assert(0<=e._eventIndex),this._events.splice(e._eventIndex,1),this._despawnMapSkillEffectEventcallback&&this._despawnMapSkillEffectEventcallback(e)},Game_Map.prototype.setSpawnMapSkillEffectEventHandler=function(e){this._spawnMapSkillEffectEventcallback=e},Game_Map.prototype.setDespawnMapSkillEffectEventHandler=function(e){this._despawnMapSkillEffectEventcallback=e}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=r(1),n=Game_Interpreter.prototype.pluginCommand;Game_Interpreter.prototype.pluginCommand=function(e,t){n.call(this,e,t),i.AMPSManager.pluginCommand(e,t)}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=r(2),n=Spriteset_Map.prototype.createCharacters;Spriteset_Map.prototype.createCharacters=function(){n.call(this),$gameMap.setSpawnMapSkillEffectEventHandler(this.onSpawnMapSkillEffectEvent.bind(this)),$gameMap.setDespawnMapSkillEffectEventHandler(this.onDespawnMapSkillEffectEvent.bind(this))},Spriteset_Map.prototype.onSpawnMapSkillEffectEvent=function(e){i.assert(null!=e._eventIndex);var t=new Sprite_Character(e);this._characterSprites.push(t),this._tilemap.addChild(t)},Spriteset_Map.prototype.onDespawnMapSkillEffectEvent=function(e){i.assert(null!=e._eventIndex);for(var t=0;t<this._characterSprites.length;t++){var r=this._characterSprites[t]._character;if(r&&null!=r._eventIndex&&r._eventIndex==e._eventIndex){this._tilemap.removeChild(this._characterSprites[t]),this._characterSprites.splice(t,1);break}}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=r(1),n=Scene_Boot.prototype.create;Scene_Boot.prototype.create=function(){n.call(this),i.AMPSManager.init()}}]);