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
 * @plugindesc 謎解きマップシステムプラグイン v0.2.0
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


!function(r){var i={};function a(t){if(i[t])return i[t].exports;var e=i[t]={i:t,l:!1,exports:{}};return r[t].call(e.exports,e,e.exports,a),e.l=!0,e.exports}a.m=r,a.c=i,a.d=function(t,e,r){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},a.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(a.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)a.d(r,i,function(t){return e[t]}.bind(null,i));return r},a.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="",a(a.s=4)}([function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i="LN_AdvancedMapPuzzleSystem";e.paramMapSkillEffectsMapId=Number(PluginManager.parameters(i).MapSkillEffectsMapId),e.paramGuideLineTerrainTag=Number(PluginManager.parameters(i).GuideLineTerrainTag)},function(t,e,r){"use strict";var i,a,n,o;Object.defineProperty(e,"__esModule",{value:!0}),e.assert=function(t,e){if(!t)throw new Error(e)},(a=i=e.ObjectType||(e.ObjectType={}))[a.Character=0]="Character",a[a.Box=1]="Box",(o=n=e.EventTrigger||(e.EventTrigger={}))[o.None=0]="None",o[o.OnCharacterRideOn=1]="OnCharacterRideOn",o[o.OnStartedFalling=2]="OnStartedFalling",e.strToObjectType=function(t){return"box"===t.toLocaleLowerCase()?i.Box:i.Character},e.strToEventTrigger=function(t){var e=t.toLocaleLowerCase();return"oncharacterrideon"===e?n.OnCharacterRideOn:"onstartedfalling"===e?n.OnStartedFalling:n.None}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=DataManager.onLoad;DataManager.onLoad=function(t){if(a.call(this,t),t===$dataMapSkillEffectsMap){this.extractMetadata(t);for(var e=t.events,r=0;r<e.length;r++){var i=e[r];i&&void 0!==i.note&&this.extractMetadata(i)}}};var i=(n.padZero=function(t,e){for(var r=t;r.length<e;)r="0"+r;return r},n.init=function(){DataManager.loadDataFile("$dataMapSkillEffectsMap","Map001.json")},n.pluginCommand=function(t,e){switch(t){case"AMPS-MapSkill":switch(e[0]){case"call":$gameMap.spawnMapSkillEffectEvent(e[1])}}},n);function n(){}e.AMPSManager=i},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i={name:"Evasion1",volume:80,pitch:110,pan:0},a={name:"Earth3",volume:80,pitch:100,pan:0},n=SoundManager.preloadImportantSounds;SoundManager.preloadImportantSounds=function(){n.call(SoundManager),$dataSystem&&AudioManager.loadStaticSe(i)};var o=(s.playGSJump=function(){$dataSystem&&AudioManager.playStaticSe(i)},s.playGSFalled=function(){AudioManager.playSe(a)},s);function s(){}e.AMPS_SoundManager=o},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),r(0),r(2),r(3),r(5),r(7),r(8),r(9),r(10),r(11),r(12)},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o,i,a=r(1),s=r(6),c=r(3);(i=o=o||{})[i.Stopping=0]="Stopping",i[i.GroundToGround=1]="GroundToGround",i[i.GroundToObject=2]="GroundToObject",i[i.ObjectToObject=3]="ObjectToObject",i[i.ObjectToGround=4]="ObjectToGround";var n=Game_CharacterBase.prototype.initMembers;Game_CharacterBase.prototype.initMembers=function(){n.call(this),this.objectType=a.ObjectType.Character,this._ridderCharacterId=-1,this._riddeeCharacterId=-1,this._waitAfterJump=0,this._extraJumping=!1,this._ridingScreenZPriority=-1,this._movingMode=o.Stopping,this._forcePositionAdjustment=!1,this._moveToFalling=!1,this._getonoffFrameCount=0,this._getonoffFrameMax=0,this._getonoffStartX=0,this._getonoffStartY=0};var h=Game_CharacterBase.prototype.moveStraight;Game_CharacterBase.prototype.moveStraight=function(t){a.assert(2==t||4==t||6==t||8==t),0<this._waitAfterJump?this._waitAfterJump--:this.moveStraightMain(t)};var u=Game_CharacterBase.prototype.moveDiagonally;Game_CharacterBase.prototype.moveDiagonally=function(t,e){this.isRidding()||u.call(this,t,e)},Game_CharacterBase.prototype.isRidding=function(){return 0<=this._riddeeCharacterId},Game_CharacterBase.prototype.falling=function(){return!1},Game_CharacterBase.prototype.isMapObject=function(){return!1},Game_CharacterBase.prototype.objectId=function(){return-1},Game_CharacterBase.prototype.objectHeight=function(){return-1},Game_CharacterBase.prototype.canRide=function(){return 0<=this.objectHeight()},Game_CharacterBase.prototype.checkPassRide=function(t,e){if(this.canRide()&&!this.rider()){var r=Math.round(this._x),i=Math.round(this._y)-this.objectHeight();if(t==r&&e==i)return!0}return!1},Game_CharacterBase.prototype.rider=function(){return this._ridderCharacterId<0?void 0:0==this._ridderCharacterId?$gamePlayer:$gameMap.event(this._ridderCharacterId)},Game_CharacterBase.prototype.riddingObject=function(){return this._riddeeCharacterId<0?void 0:0==this._riddeeCharacterId?$gamePlayer:$gameMap.event(this._riddeeCharacterId)};var p=Game_CharacterBase.prototype.screenZ;Game_CharacterBase.prototype.screenZ=function(){var t=p.call(this),e=this.riddingObject();return this.isRidding()&&e&&(t+=e.screenZ()),0<=this._ridingScreenZPriority&&(t=this._ridingScreenZPriority),t+(this._extraJumping?6:0)},Game_CharacterBase.prototype.moveStraightMain=function(t){this.setMovementSuccess(!1),this.isRidding()?(this.attemptMoveObjectToGround(t)||this.attemptMoveObjectToObject(t)||this.attemptJumpObjectToGround(t)||this.attemptJumpObjectToObject(t),this.setDirection(t)):this.attemptMoveGroundToGround(t)||this.attemptJumpGroundToGround(t)||this.attemptJumpGroove(t)||this.attemptMoveGroundToObject(t,!1)||this.attemptJumpGroundToObject(t)},Game_CharacterBase.prototype.attemptMoveGroundToGround=function(t){var e=this._x,r=this._y;return h.call(this,t),!!this._movementSuccess&&(this._forcePositionAdjustment&&(this._x=Math.round(s.MovingHelper.roundXWithDirection(e,t)),this._y=Math.round(s.MovingHelper.roundYWithDirection(r,t))),this._movingMode=o.GroundToGround,!0)},Game_CharacterBase.prototype.attemptJumpGroundToGround=function(t){return!!s.MovingHelper.canPassJumpGroundToGround(this,this._x,this._y,t)&&(this.setMovementSuccess(!0),this.jumpToDir(t,2,!1),this._movingMode=o.GroundToGround,!0)},Game_CharacterBase.prototype.attemptJumpGroove=function(t){return!!s.MovingHelper.canPassJumpGroove(this,this._x,this._y,t)&&(this.setMovementSuccess(!0),this.jumpToDir(t,2,!1),this._movingMode=o.GroundToGround,!0)},Game_CharacterBase.prototype.attemptMoveGroundToObject=function(t,e){var r=s.MovingHelper.checkMoveOrJumpGroundToObject(this._x,this._y,t,1,e);return!!r&&(this.setMovementSuccess(!0),this.resetGetOnOffParams(),this.moveToDir(t,!0),this.rideToObject(r),this._movingMode=o.GroundToObject,!0)},Game_CharacterBase.prototype.attemptJumpGroundToObject=function(t){var e=s.MovingHelper.checkMoveOrJumpGroundToObject(this._x,this._y,t,2,!1);return!!e&&(this.setMovementSuccess(!0),this.resetGetOnOffParams(),this.jumpToDir(t,2,!0),this.rideToObject(e),this._movingMode=o.GroundToObject,!0)},Game_CharacterBase.prototype.attemptMoveObjectToGround=function(t){return a.assert(this.isRidding()),!!s.MovingHelper.checkMoveOrJumpObjectToGround(this,this._x,this._y,t,1)&&(this.setMovementSuccess(!0),this.resetGetOnOffParams(),this.moveToDir(t,!1),this.unrideFromObject(),this._movingMode=o.ObjectToGround,!0)},Game_CharacterBase.prototype.attemptMoveObjectToObject=function(t){a.assert(this.isRidding());var e=s.MovingHelper.checkMoveOrJumpObjectToObject(this._x,this._y,t,1);return!(!e||e==this)&&(this.setMovementSuccess(!0),this.resetGetOnOffParams(),this.moveToDir(t,!1),this.unrideFromObject(),this.rideToObject(e),this._movingMode=o.ObjectToObject,!0)},Game_CharacterBase.prototype.attemptJumpObjectToGround=function(t){return!!s.MovingHelper.checkMoveOrJumpObjectToGround(this,this._x,this._y,t,2)&&(this.setMovementSuccess(!0),this.jumpToDir(t,2,!1),this.unrideFromObject(),this._movingMode=o.ObjectToGround,!0)},Game_CharacterBase.prototype.attemptJumpObjectToObject=function(t){var e=s.MovingHelper.checkMoveOrJumpObjectToObject(this._x,this._y,t,2);return!!e&&(this.setMovementSuccess(!0),this.resetGetOnOffParams(),this.jumpToDir(t,2,!0),this.unrideFromObject(),this.rideToObject(e),this._movingMode=o.ObjectToObject,!0)},Game_CharacterBase.prototype.rideToObject=function(t){a.assert(!this.isRidding()),a.assert(0<=this.objectId()),a.assert(0<=t.objectId()),this._riddeeCharacterId=t.objectId(),t._ridderCharacterId=this.objectId();var e=this._ridingScreenZPriority;this._ridingScreenZPriority=-1,this._ridingScreenZPriority=this.screenZ(),this._ridingScreenZPriority=Math.max(this._ridingScreenZPriority,e)},Game_CharacterBase.prototype.unrideFromObject=function(){a.assert(this.isRidding());var t=this.riddingObject();t&&(t._ridderCharacterId=-1),this._riddeeCharacterId=-1},Game_CharacterBase.prototype.moveToDir=function(t,e){this._x=$gameMap.roundXWithDirection(this._x,t),this._y=$gameMap.roundYWithDirection(this._y,t),this._realX=$gameMap.xWithDirection(this._x,this.reverseDir(t)),this._realY=$gameMap.yWithDirection(this._y,this.reverseDir(t)),(e||this._forcePositionAdjustment)&&(this._y=Math.round(this._y)),this._forcePositionAdjustment&&(this._x=Math.round(this._x))},Game_CharacterBase.prototype.jumpToDir=function(t,e,r){var i=this._x,a=this._y;r||(i=Math.round(this._x),2==t||8==t||(a=Math.round(this._y)));var n=Math.round(s.MovingHelper.roundXWithDirectionLong(this._x,t,e)),o=Math.round(s.MovingHelper.roundYWithDirectionLong(this._y,t,e));this.jump(n-i,o-a),this._waitAfterJump=10,this._extraJumping=!0,c.AMPS_SoundManager.playGSJump()},Game_CharacterBase.prototype.startFall=function(){console.log("not implemented.")};var d=Game_CharacterBase.prototype.isMoving;Game_CharacterBase.prototype.isMoving=function(){return(!this.isRidding()||this._movingMode!=o.Stopping)&&d.call(this)};var l=Game_CharacterBase.prototype.update;Game_CharacterBase.prototype.update=function(){var t;l.call(this),this.falling()&&console.log("not implemented."),!this.isRidding()||this._movingMode!=o.Stopping||(t=this.riddingObject())&&(this._x=t._x,this._y=t._y-t.objectHeight(),this._realX=t._realX,this._realY=t._realY-t.objectHeight())};var f=Game_CharacterBase.prototype.updateStop;Game_CharacterBase.prototype.updateStop=function(){f.call(this),this.isRidding()||(this._ridingScreenZPriority=-1),this._movingMode=o.Stopping};var m=Game_CharacterBase.prototype.updateMove;Game_CharacterBase.prototype.updateMove=function(){var t,e,r,i,a=this.isMoving();this.isMoving()&&this._movingMode!=o.Stopping&&this._movingMode!=o.GroundToGround?(this._getonoffFrameCount++,e=t=0,this._movingMode==o.GroundToObject||this._movingMode==o.ObjectToObject?(r=this.riddingObject())&&(t=r._realX,e=r._realY-r.objectHeight()):this._movingMode==o.ObjectToGround&&(t=this._x,e=this._y),console.log(this._movingMode),console.log(t,this._realX),i=Math.min(this._getonoffFrameCount/this._getonoffFrameMax,1),this._realX=s.MovingHelper.linear(i,this._getonoffStartX,t-this._getonoffStartX,1),this._realY=s.MovingHelper.linear(i,this._getonoffStartY,e-this._getonoffStartY,1),this._getonoffFrameCount>=this._getonoffFrameMax&&(this._movingMode=o.Stopping)):m.call(this),a==this.isMoving()||this.isMoving()||(this._moveToFalling?(this._moveToFalling=!1,this.startFall()):this.onStepEnd())};var _=Game_CharacterBase.prototype.updateJump;Game_CharacterBase.prototype.updateJump=function(){var t,e,r,i,a,n=this.isJumping();_.call(this),this.isRidding()&&n&&(this._movingMode!=o.GroundToObject&&this._movingMode!=o.ObjectToObject||(t=this.riddingObject())&&(e=t._realX,r=t._realY-t.objectHeight(),i=2*this._jumpPeak,a=Math.min((i-this._jumpCount+1)/i,1),this._realX=s.MovingHelper.linear(a,this._getonoffStartX,e-this._getonoffStartX,1),this._realY=s.MovingHelper.linear(a,this._getonoffStartY,r-this._getonoffStartY,1),this._x=t._x,this._y=t._y-t.objectHeight())),this.isJumping()||(this._extraJumping=!1,this._movingMode=o.Stopping,n!=this.isJumping()&&this.onJumpEnd())},Game_CharacterBase.prototype.resetGetOnOffParams=function(){this._getonoffFrameMax=1/this.distancePerFrame(),this._getonoffFrameCount=0,this._getonoffStartX=this._realX,this._getonoffStartY=this._realY},Game_CharacterBase.prototype.onStepEnd=function(){var t=this.riddingObject();t&&t.onCharacterRideOn()},Game_CharacterBase.prototype.onJumpEnd=function(){var t=this.riddingObject();t&&t.onCharacterRideOn()},Game_CharacterBase.prototype.onCharacterRideOn=function(){}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var c=r(1),h=r(0),i=(f.isHalfStepX=function(t){return Math.floor(t.x)!==t.x},f.isHalfStepY=function(t){return Math.floor(t.y)!==t.y},f.roundXWithDirection=function(t,e){return $gameMap.roundX(t+(6===e?1:4===e?-1:0))},f.roundYWithDirection=function(t,e){return $gameMap.roundY(t+(2===e?1:8===e?-1:0))},f.roundXWithDirectionLong=function(t,e,r){for(var i=f.roundXWithDirection(t,e),a=Math.floor(r),n=0;n<a-1;n++)i=f.roundXWithDirection(i,e);var o=r-Math.floor(r);return 0<o&&(i+=f.roundXWithDirection(0,e)*o),i},f.roundYWithDirectionLong=function(t,e,r){for(var i=f.roundYWithDirection(t,e),a=Math.floor(r),n=0;n<a-1;n++)i=f.roundYWithDirection(i,e);var o=r-Math.floor(r);return 0<o&&(i+=f.roundYWithDirection(0,e)*o),i},f.checkFacingOutsideOnEdgeTile=function(t,e,r){var i=Math.round(t),a=Math.round(e);return!$gameMap.isPassable(i,a,r)},f.checkFacingOtherEdgeTile=function(t,e,r,i){var a=Math.round(f.roundXWithDirectionLong(t,r,i)),n=Math.round(f.roundYWithDirectionLong(e,r,i));return!$gameMap.isPassable(a,n,f.reverseDir(r))},f.canPassJumpGroove=function(t,e,r,i){if(2!=i&&8!=i||!f.isHalfStepX(t))return f.canPassJumpGrooveInternal(t,e,r,i);var a=f.canPassJumpGrooveInternal(t,e-1,r,i),n=f.canPassJumpGrooveInternal(t,e,r,i);return!(!a||!n)&&n},f.canPassJumpGrooveInternal=function(t,e,r,i){var a=Math.round(e),n=Math.round(r),o=Math.round(f.roundXWithDirectionLong(e,i,2)),s=Math.round(f.roundYWithDirectionLong(r,i,2)),c=Math.round(f.roundXWithDirectionLong(e,i,1)),h=Math.round(f.roundYWithDirectionLong(r,i,1)),u=f.roundXWithDirectionLong(e,i,2),p=f.roundYWithDirectionLong(r,i,2);if(!$gameMap.isValid(o,s))return!1;if(!$gameMap.isPassable(a,n,i))return!1;var d=t.reverseDir(i);return!!$gameMap.isPassable(o,s,d)&&!t.isCollidedWithCharacters(u,p)&&!!$gameMap.checkGroove(c,h)},f.checkJumpGroundToGroundInternal=function(t,e,r,i,a){var n=Math.round(e),o=Math.round(r),s=f.roundXWithDirectionLong(e,i,a),c=f.roundYWithDirectionLong(r,i,a),h=Math.round(s),u=Math.round(c);if(!$gameMap.isValid(h,u))return{pass:!1,x:0,y:0};var p=t.reverseDir(i);if($gameMap.isPassable(n,o,i)||$gameMap.isPassable(h,u,p))return{pass:!1,x:0,y:0};if($gameMap.checkNotPassageAll(h,u))return{pass:!1,x:0,y:0};if(t.isCollidedWithCharacters(s,c))return{pass:!1,x:0,y:0};var d=f.roundXWithDirectionLong(e,i,1),l=f.roundYWithDirectionLong(r,i,1);return f.isCollidedWithRiddingEvents(d,l)?{pass:!1,x:0,y:0}:{pass:!0,x:s,y:c}},f.checkMoveOrJumpGroundToObject=function(t,e,r,i,a){var n=Math.round(t),o=Math.round(e),s=Math.round(f.roundXWithDirectionLong(t,r,i)),c=Math.round(f.roundYWithDirectionLong(e,r,i));if(a||!$gameMap.isPassable(n,o,r)){var h=f.findPassableRideObject(s,c);return h||void 0}},f.checkMoveOrJumpObjectToGround=function(t,e,r,i,a){var n=Math.round(f.roundXWithDirectionLong(e,i,a)),o=Math.round(f.roundYWithDirectionLong(r,i,a));if(t.objectType==c.ObjectType.Box&&!t.falling()&&$gameMap.terrainTag(n,o)!=h.paramGuideLineTerrainTag)return!1;var s=t.reverseDir(i);return!$gameMap.isPassable(n,o,s)&&!$gameMap.checkNotPassageAll(n,o)&&!t.isCollidedWithCharacters(n,o)},f.checkMoveOrJumpObjectToObject=function(t,e,r,i){var a=Math.round(f.roundXWithDirectionLong(t,r,i)),n=Math.round(f.roundYWithDirectionLong(e,r,i)),o=f.findPassableRideObject(a,n);if(o)return o},f.isCollidedWithRiddingEvents=function(t,e){return $gameMap.eventsXyNt(t,e).some(function(t){return t.isRidding()})},f.findPassableRideObject=function(t,e){for(var r=$gameMap.events(),i=0;i<r.length;i++)if(r[i].checkPassRide(t,e))return r[i]},f.findCharacterById=function(t){return 0==t?$gamePlayer:$gameMap.events()[t-1]},f.canPassJumpGroundToGround=function(t,e,r,i){if(Math.round(e),Math.round(r),Math.round(f.roundXWithDirectionLong(e,i,2)),Math.round(f.roundYWithDirectionLong(r,i,2)),2==i||8==i){var a=2-(r-Math.floor(r));if(f.isHalfStepX(t)){var n=f.checkJumpGroundToGroundInternal(t,e-1,r,i,a),o=f.checkJumpGroundToGroundInternal(t,e,r,i,a);return!(!n.pass||!o.pass)&&o.pass}return f.checkJumpGroundToGroundInternal(t,e,r,i,a).pass}if(!f.isHalfStepY(t)||4!=i&&6!=i)return f.checkJumpGroundToGroundInternal(t,e,r,i,2).pass;if(!(n=f.checkJumpGroundToGroundInternal(t,e,r,i,2)).pass)return!1;var s=n.x,c=Math.ceil(n.y);return!(t.isCollidedWithCharacters(s,c)&&!(o=f.checkJumpGroundToGroundInternal(t,Math.round(e),c-1,i,2)).pass)&&n.pass},f.findObject=function(t,e){for(var r=$gameMap.eventsXyNt(t,e),i=0;i<r.length;i++)if(r[i].isMapObject())return r[i]},f.reverseDir=function(t){return 10-t},f.linear=function(t,e,r,i){return r*(t/i)+e},f.easeInExpo=function(t,e,r,i){return r*Math.pow(2,10*(t/i-1))+e},f.distance2D=function(t,e,r,i){var a=r-t,n=i-e;return Math.sqrt(a*a+n*n)},f);function f(){}e.MovingHelper=i},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),Game_Player.prototype.objectId=function(){return 0};var i=Game_Player.prototype.isCollided;Game_Player.prototype.isCollided=function(t,e){return!this.isRidding()&&i.call(this,t,e)}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=r(0),s=r(1),a=Game_Event.prototype.initMembers;Game_Event.prototype.initMembers=function(){a.call(this),this._objectType=s.ObjectType.Character,this._objectHeight=-1,this._fallable=!1,this._eventTrigger=s.EventTrigger.None};var n=Game_Event.prototype.event;Game_Event.prototype.event=function(){return $dataMapSkillEffectsMap.events&&this._mapId===i.paramMapSkillEffectsMapId?$dataMapSkillEffectsMap.events[this._eventId]:n.call(this)},Game_Event.prototype.isMapObject=function(){return this._objectType!=s.ObjectType.Character},Game_Event.prototype.objectId=function(){return this.eventId()},Game_Event.prototype.objectHeight=function(){return this._objectHeight};var o=Game_Event.prototype.setupPage;Game_Event.prototype.setupPage=function(){var t=this.objectHeight(),e=this.rider();o.call(this),this.parseListCommentForAMPSObject(),0==this.objectHeight()&&e&&e.jump(0,t)},Game_Event.prototype.parseListCommentForAMPSObject=function(){this._objectType=s.ObjectType.Character,this._objectHeight=-1,this._fallable=!1,this._eventTrigger=s.EventTrigger.None;var t=this.list();if(t){for(var e="",r=0;r<t.length;r++)108!=t[r].code&&408!=t[r].code||t[r].parameters&&(e+=t[r].parameters);var i=e.indexOf("@MapObject");if(0<=i){for(var a=e.substring(i+6),n=(a=a.substring(a.indexOf("{")+1,a.indexOf("}"))).split(","),r=0;r<n.length;r++){var o=n[r].split(":");switch(o[0].trim()){case"type":this._objectType=s.strToObjectType(o[1].trim());break;case"h":case"height":this._objectHeight=Number(o[1].trim());break;case"fallable":this._fallable="true"==o[1].trim();break;case"trigger":this._eventTrigger=s.strToEventTrigger(o[1].trim())}}return!0}}return!1};var c=Game_Event.prototype.updateParallel;Game_Event.prototype.updateParallel=function(){var t;this._interpreter?(t=this._interpreter.isRunning(),c.call(this),t&&!this._interpreter.isRunning()&&this.onTerminateParallelEvent()):c.call(this)},Game_Event.prototype.onTerminateParallelEvent=function(){this._mapId===i.paramMapSkillEffectsMapId&&$gameMap.despawnMapSkillEffectEvent(this)}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=r(0),i=r(1);Game_Map.prototype.checkPassage=function(t,e,r){for(var i=this.tilesetFlags(),a=this.allTiles(t,e),n=0;n<a.length;n++){var o=i[a[n]];if(i[a[n]]>>12!=s.paramGuideLineTerrainTag&&0==(16&o)){if(0==(o&r))return!0;if((o&r)===r)return!1}}return!1},Game_Map.prototype.checkNotPassageAll=function(t,e){for(var r=this.tilesetFlags(),i=this.allTiles(t,e),a=0,n=0;n<i.length;n++){a|=r[i[n]]}return 15==(15&a)},Game_Map.prototype.checkGroove=function(t,e){for(var r=this.allTiles(t,e),i=0;i<r.length;i++)if(Tilemap.isTileA1(r[i]))return!0;return!1},Game_Map.prototype.spawnMapSkillEffectEvent=function(t){if(console.log($dataMapSkillEffectsMap),$dataMapSkillEffectsMap.events){for(var e=-1,r=0;r<$dataMapSkillEffectsMap.events.length;r++)if($dataMapSkillEffectsMap.events[r]&&$dataMapSkillEffectsMap.events[r].name==t){e=r;break}if(0<=e){var i=this._events.length,a=new Game_Event(s.paramMapSkillEffectsMapId,e);return(this._events[i]=a)._eventIndex=i,console.log(this._events),this._spawnMapSkillEffectEventcallback&&this._spawnMapSkillEffectEventcallback(a),a}}},Game_Map.prototype.despawnMapSkillEffectEvent=function(t){i.assert(0<=t._eventIndex),this._events.splice(t._eventIndex,1),this._despawnMapSkillEffectEventcallback&&this._despawnMapSkillEffectEventcallback(t)},Game_Map.prototype.setSpawnMapSkillEffectEventHandler=function(t){this._spawnMapSkillEffectEventcallback=t},Game_Map.prototype.setDespawnMapSkillEffectEventHandler=function(t){this._despawnMapSkillEffectEventcallback=t}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=r(2),a=Game_Interpreter.prototype.pluginCommand;Game_Interpreter.prototype.pluginCommand=function(t,e){a.call(this,t,e),i.AMPSManager.pluginCommand(t,e)}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=Spriteset_Map.prototype.createCharacters;Spriteset_Map.prototype.createCharacters=function(){i.call(this),$gameMap.setSpawnMapSkillEffectEventHandler(this.onSpawnMapSkillEffectEvent.bind(this)),$gameMap.setDespawnMapSkillEffectEventHandler(this.onDespawnMapSkillEffectEvent.bind(this))},Spriteset_Map.prototype.onSpawnMapSkillEffectEvent=function(t){var e=new Sprite_Character(t);this._characterSprites.push(e),this._tilemap.addChild(e)},Spriteset_Map.prototype.onDespawnMapSkillEffectEvent=function(t){console.log(t),console.log("onDespawnMapSkillEffectEvent:");for(var e=0;e<this._characterSprites.length;e++){var r=this._characterSprites[e]._character;if(console.log(r),r&&(console.log(1),null!=r._eventIndex&&(console.log(2),r._eventIndex==t._eventIndex))){this._tilemap.removeChild(this._characterSprites[e]),this._characterSprites.splice(e,1),console.log("removed");break}}}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=r(2),a=Scene_Boot.prototype.create;Scene_Boot.prototype.create=function(){a.call(this),i.AMPSManager.init()}}]);