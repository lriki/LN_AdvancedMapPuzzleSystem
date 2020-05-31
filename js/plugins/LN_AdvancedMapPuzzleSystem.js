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
 * @plugindesc 謎解きマップシステムプラグイン v0.4.4
 * @author lriki
 *
 * @help マップ上のキャラクター移動やイベントシステムを拡張し、謎解きの幅を広げるための様々な機能を追加します。
 *
 * # 他プラグインとの競合情報
 * - triacontane 様の HalfMove.js と併用する場合は、本プラグインをリストの下に追加してください。
 * - サンシロ 様の SAN_AnalogMove.js と併用する場合は、本プラグインをリストの下に追加してください。
 *
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
 * @param AllowAllMapPuzzles
 * @desc エリアタイプのすべてのマップで、謎解きシステムを有効にするかどうかを設定します。 false にした場合、規定ではすべてのマップで無効となり、マップのメモ欄に <LNPuzzleEnable> と記入したマップだけ有効になります。
 * @default true
 * @type boolean
 * 
 * MIT License
 */


!function(i){var r={};function a(e){if(r[e])return r[e].exports;var t=r[e]={i:e,l:!1,exports:{}};return i[e].call(t.exports,t,t.exports,a),t.l=!0,t.exports}a.m=i,a.c=r,a.d=function(e,t,i){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(a.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)a.d(i,r,function(e){return t[e]}.bind(null,r));return i},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="",a(a.s=6)}([function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r="LN_AdvancedMapPuzzleSystem";t.paramMapSkillEffectsMapId=Number(PluginManager.parameters(r).MapSkillEffectsMapId),t.paramGuideLineTerrainTag=Number(PluginManager.parameters(r).GuideLineTerrainTag),t.paramFallingSpeed=5,t.paramAllowAllMapPuzzles=!0;var a=PluginManager.parameters(r).AllowAllMapPuzzles;null!=a&&(t.paramAllowAllMapPuzzles="true"===a.toLowerCase())},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=i(0),n=DataManager.onLoad;DataManager.onLoad=function(e){if(n.call(this,e),0<a.paramMapSkillEffectsMapId&&e===$dataMapSkillEffectsMap){this.extractMetadata(e);for(var t=e.events,i=0;i<t.length;i++){var r=t[i];r&&void 0!==r.note&&this.extractMetadata(r)}}};var r=(o.dataMapSkillEffectsMap=function(){return $dataMapSkillEffectsMap},o.padZero=function(e,t){for(var i=e;i.length<t;)i="0"+i;return i},o.init=function(){0<a.paramMapSkillEffectsMapId&&DataManager.loadDataFile("$dataMapSkillEffectsMap","Map001.json")},o.tempMapSkillEffectDataId=-1,o.tempMapSkillEffectInvokerId=-1,o.pluginCommand=function(e,t){switch(e){case"AMPS-MapSkill":switch(t[0]){case"call":$gameMap.spawnMapSkillEffectEvent(t[1])}}},o);function o(){}t.AMPSManager=r},function(e,t,i){"use strict";var r,a,n;Object.defineProperty(t,"__esModule",{value:!0}),t.assert=function(e,t){if(!e)throw new Error(t)},(a=r=t.EventTrigger||(t.EventTrigger={}))[a.None=0]="None",a[a.OnRideOnEvent=1]="OnRideOnEvent",a[a.OnStartFalling=2]="OnStartFalling",a[a.OnSpawnedAsEffect=3]="OnSpawnedAsEffect",a[a.OnCollidedAsEffect=4]="OnCollidedAsEffect",t.strToEventTrigger=function(e){var t=e.toLocaleLowerCase();return"onrideonevent"===t?r.OnRideOnEvent:"onstartfalling"===t?r.OnStartFalling:"onspawnedaseffect"===t?r.OnSpawnedAsEffect:"oncollidedaseffect"===t?r.OnCollidedAsEffect:r.None},(n=t.MovingMode||(t.MovingMode={}))[n.Stopping=0]="Stopping",n[n.GroundToGround=1]="GroundToGround",n[n.GroundToObject=2]="GroundToObject",n[n.ObjectToObject=3]="ObjectToObject",n[n.ObjectToGround=4]="ObjectToGround"},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var c=i(0),r=(f.isHalfStepX=function(e){return Math.floor(e.x)!==e.x},f.isHalfStepY=function(e){return Math.floor(e.y)!==e.y},f.frontX=function(e,t){return e+(6===t?1:4===t?-1:0)},f.frontY=function(e,t){return e+(2===t?1:8===t?-1:0)},f.frontXAligned=function(e,t){return Math.round(e)+(6===t?1:4===t?-1:0)},f.frontYAligned=function(e,t){return Math.round(e)+(2===t?1:8===t?-1:0)},f.roundXWithDirection=function(e,t){return $gameMap.roundX(e+(6===t?1:4===t?-1:0))},f.roundYWithDirection=function(e,t){return $gameMap.roundY(e+(2===t?1:8===t?-1:0))},f.roundXWithDirectionLong=function(e,t,i){for(var r=f.roundXWithDirection(e,t),a=Math.floor(i),n=0;n<a-1;n++)r=f.roundXWithDirection(r,t);var o=i-Math.floor(i);return 0<o&&(r+=f.roundXWithDirection(0,t)*o),r},f.roundYWithDirectionLong=function(e,t,i){for(var r=f.roundYWithDirection(e,t),a=Math.floor(i),n=0;n<a-1;n++)r=f.roundYWithDirection(r,t);var o=i-Math.floor(i);return 0<o&&(r+=f.roundYWithDirection(0,t)*o),r},f.checkFacingOutsideOnEdgeTile=function(e,t,i){var r=Math.round(e),a=Math.round(t);return!$gameMap.checkPassage(r,a,1<<i/2-1&15)},f.checkFacingOtherEdgeTile=function(e,t,i,r){var a=Math.round(f.roundXWithDirectionLong(e,i,r)),n=Math.round(f.roundYWithDirectionLong(t,i,r));return!$gameMap.isPassable(a,n,f.reverseDir(i))},f.canPassJumpGroove=function(e,t,i,r){if(2!=r&&8!=r||!f.isHalfStepX(e))return f.canPassJumpGrooveInternal(e,t,i,r);var a=f.canPassJumpGrooveInternal(e,t-1,i,r),n=f.canPassJumpGrooveInternal(e,t,i,r);return!(!a||!n)&&n},f.canPassJumpGrooveInternal=function(e,t,i,r){var a=Math.round(t),n=Math.round(i),o=Math.round(f.roundXWithDirectionLong(t,r,2)),s=Math.round(f.roundYWithDirectionLong(i,r,2)),c=Math.round(f.roundXWithDirectionLong(t,r,1)),h=Math.round(f.roundYWithDirectionLong(i,r,1)),p=f.roundXWithDirectionLong(t,r,2),u=f.roundYWithDirectionLong(i,r,2);if(!$gameMap.isValid(o,s))return!1;if(!$gameMap.isPassable(a,n,r))return!1;var l=e.reverseDir(r);return!!$gameMap.isPassable(o,s,l)&&!e.isCollidedWithCharacters(p,u)&&!!$gameMap.checkGroove(c,h)},f.checkJumpGroundToGroundInternal=function(e,t,i,r,a){var n=Math.round(t),o=Math.round(i),s=f.roundXWithDirectionLong(t,r,a),c=f.roundYWithDirectionLong(i,r,a),h=Math.round(s),p=Math.round(c);if(!$gameMap.isValid(h,p))return{pass:!1,x:0,y:0};var u=e.reverseDir(r);if($gameMap.isPassable(n,o,r)||$gameMap.isPassable(h,p,u))return{pass:!1,x:0,y:0};if($gameMap.checkNotPassageAll(h,p))return{pass:!1,x:0,y:0};if(e.isCollidedWithCharacters(s,c))return{pass:!1,x:0,y:0};var l=f.roundXWithDirectionLong(t,r,1),d=f.roundYWithDirectionLong(i,r,1);return f.isCollidedWithRiddingEvents(l,d)?{pass:!1,x:0,y:0}:{pass:!0,x:s,y:c}},f.checkMoveOrJumpGroundToObject=function(e,t,i,r,a){var n=Math.round(e),o=Math.round(t),s=Math.round(f.roundXWithDirectionLong(e,i,r)),c=Math.round(f.roundYWithDirectionLong(t,i,r));if(a||!$gameMap.isPassable(n,o,i)){var h=f.findPassableRideObject(s,c);return h||void 0}},f.checkMoveOrJumpObjectToGround=function(e,t,i,r,a){var n=Math.round(f.roundXWithDirectionLong(t,r,a)),o=Math.round(f.roundYWithDirectionLong(i,r,a));if(e.isBoxType()&&!e.isFalling()&&$gameMap.terrainTag(n,o)!=c.paramGuideLineTerrainTag)return!1;var s=e.reverseDir(r);return!$gameMap.isPassable(n,o,s)&&!$gameMap.checkNotPassageAll(n,o)&&!e.isCollidedWithCharacters(n,o)},f.checkMoveOrJumpObjectToObject=function(e,t,i,r){var a=Math.round(f.roundXWithDirectionLong(e,i,r)),n=Math.round(f.roundYWithDirectionLong(t,i,r)),o=f.findPassableRideObject(a,n);if(o)return o},f.isCollidedWithRiddingEvents=function(e,t){return $gameMap.eventsXyNt(e,t).some(function(e){return e.isRidding()})},f.findPassableRideObject=function(e,t){for(var i=$gameMap.events(),r=0;r<i.length;r++)if(i[r].checkPassRide(e,t))return i[r]},f.getCharacterById=function(e){return 0==e?$gamePlayer:$gameMap.events()[e-1]},f.findReactorMapObjectInLineRange=function(e,t,i,r,a){var n=a.toLocaleLowerCase(),o=0;$gameMap.isPassable(e,t,i)||o--;for(var s=0;s<r;s++){var c=Math.round(f.roundXWithDirectionLong(e,i,s+1)),h=Math.round(f.roundYWithDirectionLong(t,i,s+1)),p=this.reverseDir(i);if($gameMap.isPassable(c,h,p)||o++,0===o)for(var u=$gameMap.eventsXyNt(c,h),l=0;l<u.length;l++){var d=u[l];if(d.isMapObject()&&d.reactionMapSkill()==n)return d}if($gameMap.isValid(c,h-1)&&f.checkLayeredTilesFlags($gameMap,c,h-1,16))return;if($gameMap.eventsXyNt(c,h).some(function(e){return 1<=e.objectHeight()}))return;$gameMap.isPassable(c,h,i)||o--}},f.canPassJumpGroundToGround=function(e,t,i,r){if(Math.round(t),Math.round(i),Math.round(f.roundXWithDirectionLong(t,r,2)),Math.round(f.roundYWithDirectionLong(i,r,2)),2==r||8==r){var a=2-(i-Math.floor(i));if(f.isHalfStepX(e)){var n=f.checkJumpGroundToGroundInternal(e,t-1,i,r,a),o=f.checkJumpGroundToGroundInternal(e,t,i,r,a);return!(!n.pass||!o.pass)&&o.pass}return f.checkJumpGroundToGroundInternal(e,t,i,r,a).pass}if(!f.isHalfStepY(e)||4!=r&&6!=r)return f.checkJumpGroundToGroundInternal(e,t,i,r,2).pass;if(!(n=f.checkJumpGroundToGroundInternal(e,t,i,r,2)).pass)return!1;var s=n.x,c=Math.ceil(n.y);return!(e.isCollidedWithCharacters(s,c)&&!(o=f.checkJumpGroundToGroundInternal(e,Math.round(t),c-1,r,2)).pass)&&n.pass},f.findObject=function(e,t){for(var i=$gameMap.eventsXyNt(e,t),r=0;r<i.length;r++)if(i[r].isMapObject())return i[r]},f.checkLayeredTilesFlags=function(e,t,i,r){var a=e.tilesetFlags();return e.layeredTiles(t,i).some(function(e){return 0!==e&&0!=(a[e]&r)})},f.reverseDir=function(e){return 10-e},f.linear=function(e,t,i,r){return i*(e/r)+t},f.easeInExpo=function(e,t,i,r){return i*Math.pow(2,10*(e/r-1))+t},f.distance2D=function(e,t,i,r){var a=i-e,n=r-t;return Math.sqrt(a*a+n*n)},f);function f(){}t.MovingHelper=r},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r={name:"Evasion1",volume:80,pitch:110,pan:0},a={name:"Earth3",volume:80,pitch:100,pan:0},n=SoundManager.preloadImportantSounds;SoundManager.preloadImportantSounds=function(){n.call(SoundManager),$dataSystem&&AudioManager.loadStaticSe(r)};var o=(s.playGSJump=function(){$dataSystem&&AudioManager.playStaticSe(r)},s.playGSFalled=function(){AudioManager.playSe(a)},s);function s(){}t.AMPS_SoundManager=o},function(e,t,i){"use strict";var r,a=this&&this.__extends||(r=function(e,t){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var i in t)t.hasOwnProperty(i)&&(e[i]=t[i])})(e,t)},function(e,t){function i(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(i.prototype=t.prototype,new i)});Object.defineProperty(t,"__esModule",{value:!0});var c=i(3),n=(o.prototype.attachMovingSequel=function(e,t){this._ownerCharacterId=e.objectId(),this._targetCharacterId=t.objectId(),e._movingSequel=this,t._movingSequelOwnerCharacterId=this._ownerCharacterId},o.prototype.detach=function(){this.ownerCharacter()._movingSequel=void 0,this.targetCharacter()._movingSequelOwnerCharacterId=-1,this._ownerCharacterId=-1,this._targetCharacterId=-1},o.prototype.ownerCharacter=function(){return c.MovingHelper.getCharacterById(this._ownerCharacterId)},o.prototype.targetCharacter=function(){return c.MovingHelper.getCharacterById(this._targetCharacterId)},o.prototype.onOwnerUpdate=function(e){return!1},o.prototype.onOwnerStepEnding=function(e){},o.prototype.onTargetUpdate=function(e){return!1},o.prototype.onTargetStepEnding=function(e){},o);function o(){this._ownerCharacterId=-1,this._targetCharacterId=-1}t.MovingSequel=n;var s,h=(a(p,s=n),p.checkPushable=function(e){return e.isBoxType()&&!e.rider()},p.tryStartPushObjectAndMove=function(e,t){if(!e.isMover())return!1;var i=c.MovingHelper.roundXWithDirectionLong(e._x,t,1),r=c.MovingHelper.roundYWithDirectionLong(e._y,t,1),a=c.MovingHelper.findObject(i,r);if(!a)return!1;if(!this.checkPushable(a))return!1;if(a.isRidding()){if(!e.isRidding()&&!c.MovingHelper.checkFacingOutsideOnEdgeTile(e._x,e._y,t))return!1}else{var n=c.MovingHelper.checkFacingOutsideOnEdgeTile(e._x,e._y,t),o=c.MovingHelper.checkFacingOutsideOnEdgeTile(a._x,a._y,e.reverseDir(t));if(e.isRidding()){if(!o)return!1}else if(n||o)return!1}if(this.tryMoveAsPushableObject(a,t)){var s=new p;if(s._ownerOrignalMovingSpeed=e.moveSpeed(),e.setMoveSpeed(a.moveSpeed()),e._forcePositionAdjustment=!0,e.moveStraightMain(t),e._forcePositionAdjustment=!1,e.isMovementSucceeded(e.x,e.y))return s.attachMovingSequel(e,a),!0}return!1},p.tryMoveAsPushableObject=function(e,t){if(e.isRidding()){if(e.attemptMoveObjectToObject(t))return!0;if(e.attemptMoveObjectToGround(t))return!0}else{if(e.attemptMoveGroundToGround(t))return!0;if(e.attemptMoveGroundToObject(t,!1))return!0}return!1},p.prototype.onOwnerUpdate=function(e){return!1},p.prototype.onOwnerStepEnding=function(e){e.setMoveSpeed(this._ownerOrignalMovingSpeed),this._ownerStepEnded=!0,this.tryDetach()},p.prototype.onTargetStepEnding=function(e){this._targetStepEnded=!0,e.isFalling()||this.tryDetach()},p.prototype.tryDetach=function(){this._ownerStepEnded&&this._targetStepEnded&&this.detach()},p);function p(){var e=s.call(this)||this;return e._ownerOrignalMovingSpeed=0,e._ownerStepEnded=!1,e._targetStepEnded=!1,e}t.MovingSequel_PushMoving=h},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),i(0),i(1),i(4),i(5),i(7),i(8),i(9),i(10),i(11),i(12),i(13),i(14)},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,a,o=i(2),c=i(3),h=i(4),n=i(5),s=i(0);(a=r=r||{})[a.None=0]="None",a[a.Failling=1]="Failling",a[a.EpilogueToRide=2]="EpilogueToRide";var p=Game_CharacterBase.prototype.initMembers;Game_CharacterBase.prototype.initMembers=function(){p.call(this),this._objectTypeBox=!1,this._objectTypeEffect=!1,this._objectTypeReactor=!1,this._ridderCharacterId=-1,this._riddeeCharacterId=-1,this._waitAfterJump=0,this._extraJumping=!1,this._ridingScreenZPriority=-1,this._movingMode=o.MovingMode.Stopping,this._forcePositionAdjustment=!1,this._moveToFalling=!1,this._fallingState=r.None,this._fallingOriginalSpeed=0,this._fallingOriginalThrough=!1,this._movingSequel=void 0,this._movingSequelOwnerCharacterId=-1,this._getonoffFrameCount=0,this._getonoffFrameMax=0,this._getonoffStartX=0,this._getonoffStartY=0};var u=Game_CharacterBase.prototype.moveStraight;Game_CharacterBase.prototype.moveStraight=function(e){if($gameMap.isPuzzleEnabled()){if(o.assert(2==e||4==e||6==e||8==e),0<this._waitAfterJump)return void this._waitAfterJump--;if(n.MovingSequel_PushMoving.tryStartPushObjectAndMove(this,e))return;this.moveStraightMain(e)}else u.call(this,e)};var l=Game_CharacterBase.prototype.moveDiagonally;Game_CharacterBase.prototype.moveDiagonally=function(e,t){this.isRidding()||l.call(this,e,t)},Game_CharacterBase.prototype.isRidding=function(){return 0<=this._riddeeCharacterId},Game_CharacterBase.prototype.isMapObject=function(){return this.isBoxType()||this.isEffectType()||this.isReactorType()},Game_CharacterBase.prototype.isBoxType=function(){return this._objectTypeBox},Game_CharacterBase.prototype.isEffectType=function(){return this._objectTypeEffect},Game_CharacterBase.prototype.isReactorType=function(){return this._objectTypeReactor},Game_CharacterBase.prototype.objectId=function(){return-1},Game_CharacterBase.prototype.objectHeight=function(){return-1},Game_CharacterBase.prototype.isMover=function(){return!this._objectTypeBox},Game_CharacterBase.prototype.canRide=function(){return 0<=this.objectHeight()},Game_CharacterBase.prototype.checkPassRide=function(e,t){if(this.canRide()&&!this.rider()){var i=Math.round(this._x),r=Math.round(this._y)-this.objectHeight();if(e==i&&t==r)return!0}return!1},Game_CharacterBase.prototype.rider=function(){return this._ridderCharacterId<0?void 0:0==this._ridderCharacterId?$gamePlayer:$gameMap.event(this._ridderCharacterId)},Game_CharacterBase.prototype.riddingObject=function(){return this._riddeeCharacterId<0?void 0:0==this._riddeeCharacterId?$gamePlayer:$gameMap.event(this._riddeeCharacterId)},Game_CharacterBase.prototype.isFalling=function(){return this._fallingState!=r.None};var d=Game_CharacterBase.prototype.screenZ;Game_CharacterBase.prototype.screenZ=function(){var e=d.call(this),t=this.riddingObject();return this.isRidding()&&t&&(e+=t.screenZ()),0<=this._ridingScreenZPriority&&(e=this._ridingScreenZPriority),e+(this._extraJumping?6:0)},Game_CharacterBase.prototype.moveStraightMain=function(e){this.setMovementSuccess(!1),this.isRidding()?(this.attemptMoveObjectToGround(e)||this.attemptMoveObjectToObject(e)||this.attemptJumpObjectToGround(e)||this.attemptJumpObjectToObject(e),this.setDirection(e)):this.attemptMoveGroundToGround(e)||this.attemptMoveGroundToObject(e,!1)||this.attemptJumpGroundToGround(e)||this.attemptJumpGroove(e)||this.attemptJumpGroundToObject(e)},Game_CharacterBase.prototype.attemptMoveGroundToGround=function(e){if(this.isBoxType()&&!this.isThrough()){var t=Math.round(c.MovingHelper.roundXWithDirectionLong(this._x,e,1)),i=Math.round(c.MovingHelper.roundYWithDirectionLong(this._y,e,1));if($gameMap.terrainTag(t,i)==s.paramGuideLineTerrainTag&&this.isMapPassable(this._x,this._y,e)&&(u.call(this,e),this.isMovementSucceeded(this.x,this.y)))return!0;if(this.isFallable()&&$gameMap.terrainTag(this._x,this._y)==s.paramGuideLineTerrainTag&&c.MovingHelper.checkFacingOutsideOnEdgeTile(this._x,this._y,e)&&!c.MovingHelper.checkMoveOrJumpObjectToObject(this._x,this._y,e,1))return this.moveToDir(e,!1),this.setMovementSuccess(!0),this._moveToFalling=!0}else{var r=this._x,a=this._y;if(u.call(this,e),this._movementSuccess)return this._forcePositionAdjustment&&(this._x=Math.round(c.MovingHelper.roundXWithDirection(r,e)),this._y=Math.round(c.MovingHelper.roundYWithDirection(a,e))),this._movingMode=o.MovingMode.GroundToGround,!0}return!1},Game_CharacterBase.prototype.attemptJumpGroundToGround=function(e){return!!c.MovingHelper.canPassJumpGroundToGround(this,this._x,this._y,e)&&(this.setMovementSuccess(!0),this.jumpToDir(e,2,!1,!0),this._movingMode=o.MovingMode.GroundToGround,!0)},Game_CharacterBase.prototype.attemptJumpGroove=function(e){return!!c.MovingHelper.canPassJumpGroove(this,this._x,this._y,e)&&(this.setMovementSuccess(!0),this.jumpToDir(e,2,!1,!1),this._movingMode=o.MovingMode.GroundToGround,!0)},Game_CharacterBase.prototype.attemptMoveGroundToObject=function(e,t){var i=c.MovingHelper.checkMoveOrJumpGroundToObject(this._x,this._y,e,1,t);return!(!i||i==this)&&(this.setMovementSuccess(!0),this.resetGetOnOffParams(),this.moveToDir(e,!0),this.rideToObject(i),this._movingMode=o.MovingMode.GroundToObject,!0)},Game_CharacterBase.prototype.attemptJumpGroundToObject=function(e){var t=c.MovingHelper.checkMoveOrJumpGroundToObject(this._x,this._y,e,2,!1);return!(!t||t==this)&&(this.setMovementSuccess(!0),this.resetGetOnOffParams(),this.jumpToDir(e,2,!0,!0),this.rideToObject(t),this._movingMode=o.MovingMode.GroundToObject,!0)},Game_CharacterBase.prototype.attemptMoveObjectToGround=function(e){return o.assert(this.isRidding()),c.MovingHelper.checkMoveOrJumpObjectToGround(this,this._x,this._y,e,1)?(this.setMovementSuccess(!0),this.resetGetOnOffParams(),this.moveToDir(e,!1),this.unrideFromObject(),this._movingMode=o.MovingMode.ObjectToGround,!0):!(!this.isBoxType()||!this.isFallable()||c.MovingHelper.checkFacingOtherEdgeTile(this._x,this._y,e,1))&&(this.setMovementSuccess(!0),this.resetGetOnOffParams(),this.moveToDir(e,!1),this.unrideFromObject(),this._moveToFalling=!0)},Game_CharacterBase.prototype.attemptMoveObjectToObject=function(e){o.assert(this.isRidding());var t=c.MovingHelper.checkMoveOrJumpObjectToObject(this._x,this._y,e,1);return!(!t||t==this)&&(this.setMovementSuccess(!0),this.resetGetOnOffParams(),this.moveToDir(e,!1),this.unrideFromObject(),this.rideToObject(t),this._movingMode=o.MovingMode.ObjectToObject,!0)},Game_CharacterBase.prototype.attemptJumpObjectToGround=function(e){return!!c.MovingHelper.checkMoveOrJumpObjectToGround(this,this._x,this._y,e,2)&&(this.setMovementSuccess(!0),this.jumpToDir(e,2,!1,!0),this._movingMode=o.MovingMode.ObjectToGround,!0)},Game_CharacterBase.prototype.attemptJumpObjectToObject=function(e){var t=c.MovingHelper.checkMoveOrJumpObjectToObject(this._x,this._y,e,2);return!!t&&(this.setMovementSuccess(!0),this.resetGetOnOffParams(),this.jumpToDir(e,2,!0,!0),this.rideToObject(t),this._movingMode=o.MovingMode.ObjectToObject,!0)};var f=Game_CharacterBase.prototype.jump;Game_CharacterBase.prototype.jump=function(e,t){f.call(this,e,t),this.isRidding()&&this.unrideFromObject()},Game_CharacterBase.prototype.rideToObject=function(e){o.assert(!this.isRidding()),o.assert(0<=this.objectId()),o.assert(0<=e.objectId()),this._riddeeCharacterId=e.objectId(),e._ridderCharacterId=this.objectId(),o.assert(this._riddeeCharacterId!=e._ridderCharacterId);var t=this._ridingScreenZPriority;this._ridingScreenZPriority=-1,this._ridingScreenZPriority=this.screenZ(),this._ridingScreenZPriority=Math.max(this._ridingScreenZPriority,t)},Game_CharacterBase.prototype.unrideFromObject=function(){o.assert(this.isRidding());var e=this.riddingObject();e&&(e._ridderCharacterId=-1),this._riddeeCharacterId=-1},Game_CharacterBase.prototype.moveToDir=function(e,t){this._x=$gameMap.roundXWithDirection(this._x,e),this._y=$gameMap.roundYWithDirection(this._y,e),(t||this._forcePositionAdjustment)&&(this._y=Math.round(this._y)),this._forcePositionAdjustment&&(this._x=Math.round(this._x))},Game_CharacterBase.prototype.jumpToDir=function(e,t,i,r){var a=this._x,n=this._y;i||(a=Math.round(this._x),2==e||8==e||(n=Math.round(this._y)));var o=Math.round(c.MovingHelper.roundXWithDirectionLong(this._x,e,t)),s=Math.round(c.MovingHelper.roundYWithDirectionLong(this._y,e,t));this.jump(o-a,s-n),this._waitAfterJump=10,this._extraJumping=r,h.AMPS_SoundManager.playGSJump()},Game_CharacterBase.prototype.startFall=function(){this._fallingState=r.Failling,this._fallingOriginalThrough=this.isThrough(),this._fallingOriginalSpeed=this.moveSpeed(),this.setThrough(!0),this.setMoveSpeed(s.paramFallingSpeed),this.onStartFalling()};var g=Game_CharacterBase.prototype.isMoving;Game_CharacterBase.prototype.isMoving=function(){return(!this.isRidding()||this._movingMode!=o.MovingMode.Stopping)&&g.call(this)};var v=Game_CharacterBase.prototype.update;Game_CharacterBase.prototype.update=function(){if(!this._movingSequel||!this._movingSequel.onOwnerUpdate(this)){if(0<=this._movingSequelOwnerCharacterId){var e=c.MovingHelper.getCharacterById(this._movingSequelOwnerCharacterId);if(e._movingSequel&&e._movingSequel.onTargetUpdate(this))return}var t;v.call(this),this.isFalling()&&this.updateFall(),!this.isRidding()||this._movingMode!=o.MovingMode.Stopping||(t=this.riddingObject())&&(this._x=t._x,this._y=t._y-t.objectHeight(),this._realX=t._realX,this._realY=t._realY-t.objectHeight())}};var _=Game_CharacterBase.prototype.updateStop;Game_CharacterBase.prototype.updateStop=function(){_.call(this),this.isRidding()||(this._ridingScreenZPriority=-1),this._movingMode=o.MovingMode.Stopping};var m=Game_CharacterBase.prototype.updateMove;Game_CharacterBase.prototype.updateMove=function(){var e,t,i,r,a=this.isMoving();this.isMoving()&&this._movingMode!=o.MovingMode.Stopping&&this._movingMode!=o.MovingMode.GroundToGround?(this._getonoffFrameCount++,t=e=0,this._movingMode==o.MovingMode.GroundToObject||this._movingMode==o.MovingMode.ObjectToObject?(i=this.riddingObject())&&(e=i._realX,t=i._realY-i.objectHeight()):this._movingMode==o.MovingMode.ObjectToGround&&(e=this._x,t=this._y),r=Math.min(this._getonoffFrameCount/this._getonoffFrameMax,1),this._realX=c.MovingHelper.linear(r,this._getonoffStartX,e-this._getonoffStartX,1),this._realY=c.MovingHelper.linear(r,this._getonoffStartY,t-this._getonoffStartY,1),this._getonoffFrameCount>=this._getonoffFrameMax&&(this._movingMode=o.MovingMode.Stopping)):m.call(this),a==this.isMoving()||this.isMoving()||(this._moveToFalling?(this._moveToFalling=!1,this.startFall()):this.onStepEnd())};var M=Game_CharacterBase.prototype.updateJump;Game_CharacterBase.prototype.updateJump=function(){var e,t,i,r,a,n=this.isJumping();M.call(this),this.isRidding()&&n&&(this._movingMode!=o.MovingMode.GroundToObject&&this._movingMode!=o.MovingMode.ObjectToObject||(e=this.riddingObject())&&(t=e._realX,i=e._realY-e.objectHeight(),r=2*this._jumpPeak,a=Math.min((r-this._jumpCount+1)/r,1),this._realX=c.MovingHelper.linear(a,this._getonoffStartX,t-this._getonoffStartX,1),this._realY=c.MovingHelper.linear(a,this._getonoffStartY,i-this._getonoffStartY,1),this._x=e._x,this._y=e._y-e.objectHeight())),this.isJumping()||(this._extraJumping=!1,this._movingMode=o.MovingMode.Stopping,n!=this.isJumping()&&this.onJumpEnd())},Game_CharacterBase.prototype.updateFall=function(){this.isMoving()||(this._fallingState==r.Failling&&($gameMap.terrainTag(this._x,this._y)==s.paramGuideLineTerrainTag||this.attemptMoveGroundToObject(2,!0)?this._fallingState=r.EpilogueToRide:this.moveStraightMain(2)),this._fallingState==r.EpilogueToRide&&(this._fallingState=r.None,this.setThrough(this._fallingOriginalThrough),this.setMoveSpeed(this._fallingOriginalSpeed),this.onStepEnd(),h.AMPS_SoundManager.playGSFalled()))},Game_CharacterBase.prototype.resetGetOnOffParams=function(){this._getonoffFrameMax=1/this.distancePerFrame(),this._getonoffFrameCount=0,this._getonoffStartX=this._realX,this._getonoffStartY=this._realY},Game_CharacterBase.prototype.onStepEnd=function(){var e;this._movingSequel&&this._movingSequel.onOwnerStepEnding(this),0<=this._movingSequelOwnerCharacterId&&((e=c.MovingHelper.getCharacterById(this._movingSequelOwnerCharacterId))._movingSequel&&e._movingSequel.onTargetStepEnding(this)),this.isRidding()||(this._ridingScreenZPriority=-1);var t=this.riddingObject();t&&t.onRideOnEvent()},Game_CharacterBase.prototype.onJumpEnd=function(){var e=this.riddingObject();e&&e.onRideOnEvent()},Game_CharacterBase.prototype.onRideOnEvent=function(){},Game_CharacterBase.prototype.onStartFalling=function(){};var y=Game_CharacterBase.prototype.isHalfMove;Game_CharacterBase.prototype.isHalfMove=function(){return!!this.isMover()&&(!this._forcePositionAdjustment&&(!!y&&y.call(this)))}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Game_Player.prototype.objectId=function(){return 0};var r=Game_Player.prototype.isCollided;Game_Player.prototype.isCollided=function(e,t){return!this.isRidding()&&r.call(this,e,t)};var a=Game_Player.prototype.canMove;Game_Player.prototype.canMove=function(){return!this._movingSequel&&a.call(this)};var n=Game_Player.prototype.isDashing;Game_Player.prototype.isDashing=function(){return!this._movingSequel&&n.call(this)}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s,r,a=i(0),c=i(2),n=i(1),o=i(3);(r=s=s||{})[r.Default=0]="Default",r[r.Front=1]="Front",Game_Event.prototype.clearMapObjectSettings=function(){this._objectTypeBox=!1,this._objectTypeEffect=!1,this._objectTypeReactor=!1,this._objectHeight=-1,this._fallable=!1,this._mapObjectEventTrigger=c.EventTrigger.None,this._mapSkillRange=-1,this._reactionMapSkill="",this._mapSkillEffectInitialPosition=s.Default};var h=Game_Event.prototype.initMembers;Game_Event.prototype.initMembers=function(){h.call(this),this._objectHeight=-1,this._fallable=!1,this._mapObjectEventTrigger=c.EventTrigger.None,this._mapSkillEffectDataId=n.AMPSManager.tempMapSkillEffectDataId,this._mapSkillEffectInvokerId=n.AMPSManager.tempMapSkillEffectInvokerId,this._mapSkillEffectInitialPosition=s.Default};var p=Game_Event.prototype.event;Game_Event.prototype.event=function(){if(0<a.paramMapSkillEffectsMapId){var e=n.AMPSManager.dataMapSkillEffectsMap();if(e&&e.events&&this.isDynamicMapEffectEvent())return e.events[this._mapSkillEffectDataId]}return p.call(this)};var u=Game_Event.prototype.isTriggerIn;Game_Event.prototype.isTriggerIn=function(e){return this._mapObjectEventTrigger===c.EventTrigger.None&&u.call(this,e)};var l=Game_Event.prototype.checkEventTriggerTouch;Game_Event.prototype.checkEventTriggerTouch=function(e,t){this._mapObjectEventTrigger!==c.EventTrigger.None||l.call(this,e,t)};var d=Game_Event.prototype.checkEventTriggerAuto;Game_Event.prototype.checkEventTriggerAuto=function(){this._mapObjectEventTrigger!==c.EventTrigger.None||d.call(this)},Game_Event.prototype.objectId=function(){return this.eventId()},Game_Event.prototype.objectHeight=function(){return this._objectHeight},Game_Event.prototype.isFallable=function(){return this._fallable},Game_Event.prototype.isDynamicMapEffectEvent=function(){return this._mapId===a.paramMapSkillEffectsMapId&&0<=this._mapSkillEffectDataId},Game_Event.prototype.reactionMapSkill=function(){return this._reactionMapSkill},Game_Event.prototype.mapSkillEffectInvoker=function(){return this._mapSkillEffectInvokerId<0?void 0:0==this._mapSkillEffectInvokerId?$gamePlayer:$gameMap.event(this._mapSkillEffectInvokerId)},Game_Event.prototype.directionAsMapSkillEffect=function(){var e=this.mapSkillEffectInvoker();return e?e.direction():this.direction()};var f=Game_Event.prototype.refresh;Game_Event.prototype.refresh=function(){f.call(this);var e=this.mapSkillEffectInvoker();e&&((this._mapSkillEffectInitialPosition=s.Front)?this.locate(o.MovingHelper.frontX(e.x,e.direction()),o.MovingHelper.frontY(e.y,e.direction())):this.locate(e.x,e.y))};var g=Game_Event.prototype.setupPage;Game_Event.prototype.setupPage=function(){var e,t,i,r=this.objectHeight(),a=this.rider();g.call(this),!this.isMapObject()&&a&&a.jump(0,r),this.isEffectType()&&this._mapObjectEventTrigger==c.EventTrigger.OnSpawnedAsEffect&&(!(t=this.mapSkillEffectInvoker())||(i=o.MovingHelper.findReactorMapObjectInLineRange(t.x,t.y,this.directionAsMapSkillEffect(),this._mapSkillRange,null!==(e=this.event().name)&&void 0!==e?e:""))&&i.startAsReactor())};var v=Game_Event.prototype.clearPageSettings;Game_Event.prototype.clearPageSettings=function(){v.call(this),this.clearMapObjectSettings()};var _=Game_Event.prototype.setupPageSettings;Game_Event.prototype.setupPageSettings=function(){_.call(this),this.parseListCommentForAMPSObject(),this._mapObjectEventTrigger!=c.EventTrigger.None&&(this._interpreter=null)},Game_Event.prototype.parseListCommentForAMPSObject=function(){if(this.clearMapObjectSettings(),0<=this._pageIndex){var e=this.list();if(e){for(var t="",i=0;i<e.length;i++)108!=e[i].code&&408!=e[i].code||e[i].parameters&&(t+=e[i].parameters);var r=t.indexOf("@MapObject");if(0<=r){for(var a=t.substring(r+6),n=(a=a.substring(a.indexOf("{")+1,a.indexOf("}"))).split(","),i=0;i<n.length;i++){var o=n[i].split(":");switch(o[0].trim().toLocaleLowerCase()){case"type":switch(console.error("@MapObject.type is deprecated. use 'box:true'"),o[1].trim().toLocaleLowerCase()){case"box":this._objectTypeBox=!0;break;case"effect":this._objectTypeEffect=!0;break;case"reactor":this._objectTypeReactor=!0}break;case"box":this._objectTypeBox=!(2<=o.length)||Boolean(o[1].trim());break;case"effect":this._objectTypeEffect=!(2<=o.length)||Boolean(o[1].trim());break;case"reactor":this._objectTypeReactor=!(2<=o.length)||Boolean(o[1].trim());break;case"h":case"height":this._objectHeight=Number(o[1].trim());break;case"fallable":this._fallable="true"==o[1].trim();break;case"trigger":this._mapObjectEventTrigger=c.strToEventTrigger(o[1].trim());break;case"range":this._mapSkillRange=Number(o[1].trim());break;case"reaction":this._reactionMapSkill=o[1].trim().toLocaleLowerCase();break;case"pos":switch(o[1].trim().toLocaleLowerCase()){case"front":this._mapSkillEffectInitialPosition=s.Front}}}return!0}}}return!1};var m=Game_Event.prototype.start;Game_Event.prototype.start=function(){this.isReactorType()||m.call(this)},Game_Event.prototype.startAsReactor=function(){m.call(this)};var M=Game_Event.prototype.updateParallel;Game_Event.prototype.updateParallel=function(){var e;this._interpreter?(e=this._interpreter.isRunning(),M.call(this),e&&!this._interpreter.isRunning()&&this.onTerminateParallelEvent()):M.call(this)},Game_Event.prototype.onTerminateParallelEvent=function(){this.isDynamicMapEffectEvent()&&$gameMap.despawnMapSkillEffectEvent(this)},Game_Event.prototype.onRideOnEvent=function(){this._mapObjectEventTrigger===c.EventTrigger.OnRideOnEvent&&this.start()},Game_Event.prototype.onStartFalling=function(){this._mapObjectEventTrigger===c.EventTrigger.OnStartFalling&&this.start()}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=i(0),o=i(1),c=i(2),r=Game_Map.prototype.setup;Game_Map.prototype.setup=function(e){r.call(this,e),$dataMap.meta.LNPuzzleEnable||!this.isOverworld()&&s.paramAllowAllMapPuzzles?this._puzzleEnabled=!0:this._puzzleEnabled=!1},Game_Map.prototype.isPuzzleEnabled=function(){return this._puzzleEnabled},Game_Map.prototype.checkPassage=function(e,t,i){for(var r=this.tilesetFlags(),a=this.allTiles(e,t),n=0;n<a.length;n++){var o=r[a[n]];if(r[a[n]]>>12!=s.paramGuideLineTerrainTag&&0==(16&o)){if(0==(o&i))return!0;if((o&i)===i)return!1}}return!1},Game_Map.prototype.checkNotPassageAll=function(e,t){for(var i=this.tilesetFlags(),r=this.allTiles(e,t),a=0,n=0;n<r.length;n++){a|=i[r[n]]}return 15==(15&a)},Game_Map.prototype.checkGroove=function(e,t){for(var i=this.allTiles(e,t),r=0;r<i.length;r++)if(Tilemap.isTileA1(i[r]))return!0;return!1},Game_Map.prototype.spawnMapSkillEffectEvent=function(e){c.assert(0<s.paramMapSkillEffectsMapId);var t=o.AMPSManager.dataMapSkillEffectsMap();if(t&&t.events){for(var i=-1,r=0;r<t.events.length;r++)if(t.events[r]&&t.events[r].name==e){i=r;break}if(0<=i){o.AMPSManager.tempMapSkillEffectDataId=i,o.AMPSManager.tempMapSkillEffectInvokerId=0;var a=this._events.length,n=new Game_Event(s.paramMapSkillEffectsMapId,a);return o.AMPSManager.tempMapSkillEffectDataId=-1,o.AMPSManager.tempMapSkillEffectInvokerId=-1,n._eventIndex=a,this._events[a]=n,this._spawnMapSkillEffectEventcallback&&this._spawnMapSkillEffectEventcallback(n),n}}},Game_Map.prototype.despawnMapSkillEffectEvent=function(e){c.assert(0<=e._eventIndex),this._events.splice(e._eventIndex,1),this._despawnMapSkillEffectEventcallback&&this._despawnMapSkillEffectEventcallback(e)},Game_Map.prototype.setSpawnMapSkillEffectEventHandler=function(e){this._spawnMapSkillEffectEventcallback=e},Game_Map.prototype.setDespawnMapSkillEffectEventHandler=function(e){this._despawnMapSkillEffectEventcallback=e}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=i(1),a=Game_Interpreter.prototype.pluginCommand;Game_Interpreter.prototype.pluginCommand=function(e,t){a.call(this,e,t),r.AMPSManager.pluginCommand(e,t)}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=i(2),a=Spriteset_Map.prototype.createCharacters;Spriteset_Map.prototype.createCharacters=function(){a.call(this),$gameMap.setSpawnMapSkillEffectEventHandler(this.onSpawnMapSkillEffectEvent.bind(this)),$gameMap.setDespawnMapSkillEffectEventHandler(this.onDespawnMapSkillEffectEvent.bind(this))},Spriteset_Map.prototype.onSpawnMapSkillEffectEvent=function(e){r.assert(null!=e._eventIndex);var t=new Sprite_Character(e);this._characterSprites.push(t),this._tilemap.addChild(t)},Spriteset_Map.prototype.onDespawnMapSkillEffectEvent=function(e){r.assert(null!=e._eventIndex);for(var t=0;t<this._characterSprites.length;t++){var i=this._characterSprites[t]._character;if(i&&null!=i._eventIndex&&i._eventIndex==e._eventIndex){this._tilemap.removeChild(this._characterSprites[t]),this._characterSprites.splice(t,1);break}}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=i(1),a=Scene_Boot.prototype.create;Scene_Boot.prototype.create=function(){a.call(this),r.AMPSManager.init()}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,a,n,o,s,c=i(2);"undefined"!=typeof Sanshiro&&null!=Sanshiro.AnalogMove&&(r=Game_CharacterBase.prototype.initMembers,Game_CharacterBase.prototype.initMembers=function(){r.call(this)},a=Game_CharacterBase.prototype.updateMover,Game_CharacterBase.prototype.updateMover=function(){a.call(this),$gameMap.isPuzzleEnabled()&&this._mover.isInputed&&this._mover.isInputed()&&this.canAnalogMove()&&(6==Input.dir8&&Math.abs(this._mover._lasPosVec.x()-this._mover._posVec.x())<.005&&this.moveStraight(6),4==Input.dir8&&Math.abs(this._mover._lasPosVec.x()-this._mover._posVec.x())<.005&&this.moveStraight(4),8==Input.dir8&&Math.abs(this._mover._lasPosVec.y()-this._mover._posVec.y())<.005&&this.moveStraight(8),2==Input.dir8&&Math.abs(this._mover._lasPosVec.y()-this._mover._posVec.y())<.005&&this.moveStraight(2))},n=Game_CharacterBase.prototype.updateJump,Game_CharacterBase.prototype.updateJump=function(){n.call(this),$gameMap.isPuzzleEnabled()&&!this.isJumping()&&this.hasMover()&&this.refreshMover()},o=Game_Player.prototype.isMoving,Game_Player.prototype.isMoving=function(){return!!Game_Character.prototype.isMoving.call(this)&&(o.call(this)||this.isJumping())},s=Game_Player.prototype.shouleMoveDefault,Game_Player.prototype.shouleMoveDefault=function(){return!!this.isRidding()||(null!=this._movingSequel||(this._movingMode!=c.MovingMode.Stopping||s.call(this)))},Game_Player.prototype.updateMove=function(){this.shouleMoveDefault()&&(Game_Character.prototype.updateMove.call(this),this._moveDefault=this.isMoving())})}]);