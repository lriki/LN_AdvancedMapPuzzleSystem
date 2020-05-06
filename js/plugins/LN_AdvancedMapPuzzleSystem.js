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
 * @plugindesc 謎解きマップシステムプラグイン v0.1.0
 * @author lriki
 * 
 * @param GuideLineTerrainTag
 * @desc 箱オブジェクトの移動ガイドラインとなる地形タグです。
 * @default 7
 * @type number
 *
 * @help マップ上のキャラクター移動やイベントシステムを拡張し、
 * 謎解きの幅を広げるための様々な機能を追加します。
 * 
 * MIT License
 */


!function(r){var i={};function o(t){if(i[t])return i[t].exports;var e=i[t]={i:t,l:!1,exports:{}};return r[t].call(e.exports,e,e.exports,o),e.l=!0,e.exports}o.m=r,o.c=i,o.d=function(t,e,r){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(o.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)o.d(r,i,function(t){return e[t]}.bind(null,i));return r},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=3)}([function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.paramGuideLineTerrainTag=Number(PluginManager.parameters("LN_AdvancedMapPuzzleSystem").GuideLineTerrainTag)},function(t,e,r){"use strict";var i,o,n,a;Object.defineProperty(e,"__esModule",{value:!0}),e.assert=function(t,e){if(!t)throw new Error(e)},(o=i=e.ObjectType||(e.ObjectType={}))[o.Character=0]="Character",o[o.Box=1]="Box",(a=n=e.EventTrigger||(e.EventTrigger={}))[a.None=0]="None",a[a.OnCharacterRideOn=1]="OnCharacterRideOn",a[a.OnStartedFalling=2]="OnStartedFalling",e.strToObjectType=function(t){return"box"===t.toLocaleLowerCase()?i.Box:i.Character},e.strToEventTrigger=function(t){var e=t.toLocaleLowerCase();return"oncharacterrideon"===e?n.OnCharacterRideOn:"onstartedfalling"===e?n.OnStartedFalling:n.None}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i={name:"Evasion1",volume:80,pitch:110,pan:0},o={name:"Earth3",volume:80,pitch:100,pan:0},n=SoundManager.preloadImportantSounds;SoundManager.preloadImportantSounds=function(){n.call(SoundManager),$dataSystem&&AudioManager.loadStaticSe(i)};var a=(s.playGSJump=function(){$dataSystem&&AudioManager.playStaticSe(i)},s.playGSFalled=function(){AudioManager.playSe(o)},s);function s(){}e.AMPS_SoundManager=a},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),r(0),r(2),r(4),r(6),r(7),r(8)},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a,i,o=r(1),s=r(5),h=r(2);(i=a=a||{})[i.Stopping=0]="Stopping",i[i.GroundToGround=1]="GroundToGround",i[i.GroundToObject=2]="GroundToObject",i[i.ObjectToObject=3]="ObjectToObject",i[i.ObjectToGround=4]="ObjectToGround";var n=Game_CharacterBase.prototype.initMembers;Game_CharacterBase.prototype.initMembers=function(){n.call(this),this.objectType=o.ObjectType.Character,this._ridingCharacterId=-1,this._ridderCharacterId=-1,this._waitAfterJump=0,this._extraJumping=!1,this._ridingScreenZPriority=-1,this._movingMode=a.Stopping,this._forcePositionAdjustment=!1,this._moveToFalling=!1,this._getonoffFrameCount=0,this._getonoffFrameMax=0,this._getonoffStartX=0,this._getonoffStartY=0};var c=Game_CharacterBase.prototype.moveStraight;Game_CharacterBase.prototype.moveStraight=function(t){o.assert(2==t||4==t||6==t||8==t),0<this._waitAfterJump?this._waitAfterJump--:this.moveStraightMain(t)};var u=Game_CharacterBase.prototype.moveDiagonally;Game_CharacterBase.prototype.moveDiagonally=function(t,e){this.isRidding()||u.call(this,t,e)},Game_CharacterBase.prototype.isRidding=function(){return 0<=this._ridingCharacterId},Game_CharacterBase.prototype.falling=function(){return!1},Game_CharacterBase.prototype.isMapObject=function(){return!1},Game_CharacterBase.prototype.objectId=function(){return-1},Game_CharacterBase.prototype.objectHeight=function(){return-1},Game_CharacterBase.prototype.canRide=function(){return 0<=this.objectHeight()},Game_CharacterBase.prototype.checkPassRide=function(t,e){if(this.canRide()&&!this.rider()){var r=Math.round(this._x),i=Math.round(this._y)-this.objectHeight();if(t==r&&e==i)return!0}return!1},Game_CharacterBase.prototype.rider=function(){return this._ridderCharacterId<0?void 0:0==this._ridderCharacterId?$gamePlayer:$gameMap.event(this._ridderCharacterId)},Game_CharacterBase.prototype.riddingObject=function(){return this._ridingCharacterId<0?void 0:0==this._ridingCharacterId?$gamePlayer:$gameMap.event(this._ridingCharacterId)};var d=Game_CharacterBase.prototype.screenZ;Game_CharacterBase.prototype.screenZ=function(){var t=d.call(this),e=this.riddingObject();return this.isRidding()&&e&&(t+=e.screenZ()),0<=this._ridingScreenZPriority&&(t=this._ridingScreenZPriority),t+(this._extraJumping?6:0)},Game_CharacterBase.prototype.moveStraightMain=function(t){this.isRidding()?(this.attemptMoveObjectToGround(t)||this.attemptMoveObjectToObject(t),this.setDirection(t)):this.attemptMoveGroundToGround(t)||this.attemptJumpGroundToGround(t)||this.attemptJumpGroove(t)||this.attemptMoveGroundToObject(t,!1)},Game_CharacterBase.prototype.attemptMoveGroundToGround=function(t){var e=this._x,r=this._y;return c.call(this,t),!!this._movementSuccess&&(this._forcePositionAdjustment&&(this._x=Math.round(s.MovingHelper.roundXWithDirection(e,t)),this._y=Math.round(s.MovingHelper.roundYWithDirection(r,t))),this._movingMode=a.GroundToGround,!0)},Game_CharacterBase.prototype.attemptJumpGroundToGround=function(t){return!!s.MovingHelper.canPassJumpGroundToGround(this,this._x,this._y,t)&&(this.setMovementSuccess(!0),this.jumpToDir(t,2,!1),this._movingMode=a.GroundToGround,!0)},Game_CharacterBase.prototype.attemptJumpGroove=function(t){return!!s.MovingHelper.canPassJumpGroove(this,this._x,this._y,t)&&(this.setMovementSuccess(!0),this.jumpToDir(t,2,!1),this._movingMode=a.GroundToGround,!0)},Game_CharacterBase.prototype.attemptMoveGroundToObject=function(t,e){var r=s.MovingHelper.checkMoveOrJumpGroundToObject(this._x,this._y,t,1,e);return!!r&&(this.setMovementSuccess(!0),this.resetGetOnOffParams(),this.moveToDir(t,!0),this.rideToObject(r),this._movingMode=a.GroundToObject,!0)},Game_CharacterBase.prototype.attemptMoveObjectToGround=function(t){return o.assert(this.isRidding()),!!s.MovingHelper.checkMoveOrJumpObjectToGround(this,this._x,this._y,t,1)&&(this.setMovementSuccess(!0),this.resetGetOnOffParams(),this.moveToDir(t,!1),this.unrideFromObject(),this._movingMode=a.ObjectToGround,!0)},Game_CharacterBase.prototype.attemptMoveObjectToObject=function(t){o.assert(this.isRidding());var e=s.MovingHelper.checkMoveOrJumpObjectToObject(this._x,this._y,t,1);return!(!e||e==this)&&(this.setMovementSuccess(!0),this.resetGetOnOffParams(),this.moveToDir(t,!1),this.unrideFromObject(),this.rideToObject(e),this._movingMode=a.ObjectToObject,!0)},Game_CharacterBase.prototype.rideToObject=function(t){o.assert(!this.isRidding()),o.assert(0<=this.objectId()),o.assert(0<=t.objectId()),this._ridingCharacterId=t.objectId(),t._ridderCharacterId=this.objectId();var e=this._ridingScreenZPriority;this._ridingScreenZPriority=-1,this._ridingScreenZPriority=this.screenZ(),this._ridingScreenZPriority=Math.max(this._ridingScreenZPriority,e)},Game_CharacterBase.prototype.unrideFromObject=function(){o.assert(this.isRidding());var t=this.riddingObject();t&&(t._ridderCharacterId=-1),this._ridingCharacterId=-1},Game_CharacterBase.prototype.moveToDir=function(t,e){console.log("moveToDir s"),this._x=$gameMap.roundXWithDirection(this._x,t),this._y=$gameMap.roundYWithDirection(this._y,t),this._realX=$gameMap.xWithDirection(this._x,this.reverseDir(t)),this._realY=$gameMap.yWithDirection(this._y,this.reverseDir(t)),(e||this._forcePositionAdjustment)&&(this._y=Math.round(this._y)),this._forcePositionAdjustment&&(this._x=Math.round(this._x)),console.log("moveToDir e")},Game_CharacterBase.prototype.jumpToDir=function(t,e,r){var i=this._x,o=this._y;r||(i=Math.round(this._x),2==t||8==t||(o=Math.round(this._y)));var n=Math.round(s.MovingHelper.roundXWithDirectionLong(this._x,t,e)),a=Math.round(s.MovingHelper.roundYWithDirectionLong(this._y,t,e));this.jump(n-i,a-o),this._waitAfterJump=10,this._extraJumping=!0,h.AMPS_SoundManager.playGSJump()},Game_CharacterBase.prototype.startFall=function(){console.log("not implemented.")};var p=Game_CharacterBase.prototype.isMoving;Game_CharacterBase.prototype.isMoving=function(){return(!this.isRidding()||0!=this._movingMode)&&p.call(this)};var g=Game_CharacterBase.prototype.update;Game_CharacterBase.prototype.update=function(){var t;g.call(this),this.falling()&&console.log("not implemented."),!this.isRidding()||this._movingMode!=a.Stopping||(t=this.riddingObject())&&(this._x=t._x,this._y=t._y-t.objectHeight(),this._realX=t._realX,this._realY=t._realY-t.objectHeight())};var l=Game_CharacterBase.prototype.updateStop;Game_CharacterBase.prototype.updateStop=function(){l.call(this),this.isRidding()||(this._ridingScreenZPriority=-1),this._movingMode=a.Stopping};var m=Game_CharacterBase.prototype.updateMove;Game_CharacterBase.prototype.updateMove=function(){var t,e,r,i,o=this.isMoving();this.isMoving()&&this._movingMode!=a.Stopping&&this._movingMode!=a.GroundToGround?(this._getonoffFrameCount++,e=t=0,this._movingMode==a.GroundToObject||this._movingMode==a.ObjectToObject?(r=this.riddingObject())&&(t=r._realX,e=r._realY-r.objectHeight()):this._movingMode==a.ObjectToGround&&(t=this._x,e=this._y),console.log(this._movingMode),console.log(t,this._realX),i=Math.min(this._getonoffFrameCount/this._getonoffFrameMax,1),this._realX=s.MovingHelper.linear(i,this._getonoffStartX,t-this._getonoffStartX,1),this._realY=s.MovingHelper.linear(i,this._getonoffStartY,e-this._getonoffStartY,1),this._getonoffFrameCount>=this._getonoffFrameMax&&(this._movingMode=a.Stopping)):m.call(this),o==this.isMoving()||this.isMoving()||(this._moveToFalling?(this._moveToFalling=!1,this.startFall()):this.onStepEnd())};var f=Game_CharacterBase.prototype.updateJump;Game_CharacterBase.prototype.updateJump=function(){var t,e,r,i,o,n=this.isJumping();f.call(this),this.isRidding()&&n&&(this._movingMode!=a.GroundToObject&&this._movingMode!=a.ObjectToObject||(t=this.riddingObject())&&(e=t._realX,r=t._realY-t.objectHeight(),i=2*this._jumpPeak,o=Math.min((i-this._jumpCount+1)/i,1),this._realX=s.MovingHelper.linear(o,this._getonoffStartX,e-this._getonoffStartX,1),this._realY=s.MovingHelper.linear(o,this._getonoffStartY,r-this._getonoffStartY,1),this._x=t._x,this._y=t._y-t.objectHeight())),this.isJumping()||(this._extraJumping=!1,n!=this.isJumping()&&this.onJumpEnd())},Game_CharacterBase.prototype.resetGetOnOffParams=function(){this._getonoffFrameMax=1/this.distancePerFrame(),this._getonoffFrameCount=0,this._getonoffStartX=this._realX,this._getonoffStartY=this._realY},Game_CharacterBase.prototype.onStepEnd=function(){var t=this.riddingObject();t&&t.onCharacterRideOn()},Game_CharacterBase.prototype.onJumpEnd=function(){var t=this.riddingObject();t&&t.onCharacterRideOn()},Game_CharacterBase.prototype.onCharacterRideOn=function(){}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var h=r(1),c=r(0),i=(l.isHalfStepX=function(t){return Math.floor(t.x)!==t.x},l.isHalfStepY=function(t){return Math.floor(t.y)!==t.y},l.roundXWithDirection=function(t,e){return $gameMap.roundX(t+(6===e?1:4===e?-1:0))},l.roundYWithDirection=function(t,e){return $gameMap.roundY(t+(2===e?1:8===e?-1:0))},l.roundXWithDirectionLong=function(t,e,r){for(var i=l.roundXWithDirection(t,e),o=Math.floor(r),n=0;n<o-1;n++)i=l.roundXWithDirection(i,e);var a=r-Math.floor(r);return 0<a&&(i+=l.roundXWithDirection(0,e)*a),i},l.roundYWithDirectionLong=function(t,e,r){for(var i=l.roundYWithDirection(t,e),o=Math.floor(r),n=0;n<o-1;n++)i=l.roundYWithDirection(i,e);var a=r-Math.floor(r);return 0<a&&(i+=l.roundYWithDirection(0,e)*a),i},l.checkFacingOutsideOnEdgeTile=function(t,e,r){var i=Math.round(t),o=Math.round(e);return!$gameMap.isPassable(i,o,r)},l.checkFacingOtherEdgeTile=function(t,e,r,i){var o=Math.round(l.roundXWithDirectionLong(t,r,i)),n=Math.round(l.roundYWithDirectionLong(e,r,i));return!$gameMap.isPassable(o,n,l.reverseDir(r))},l.canPassJumpGroove=function(t,e,r,i){if(2!=i&&8!=i||!l.isHalfStepX(t))return l.canPassJumpGrooveInternal(t,e,r,i);var o=l.canPassJumpGrooveInternal(t,e-1,r,i),n=l.canPassJumpGrooveInternal(t,e,r,i);return!(!o||!n)&&n},l.canPassJumpGrooveInternal=function(t,e,r,i){var o=Math.round(e),n=Math.round(r),a=Math.round(l.roundXWithDirectionLong(e,i,2)),s=Math.round(l.roundYWithDirectionLong(r,i,2)),h=Math.round(l.roundXWithDirectionLong(e,i,1)),c=Math.round(l.roundYWithDirectionLong(r,i,1)),u=l.roundXWithDirectionLong(e,i,2),d=l.roundYWithDirectionLong(r,i,2);if(!$gameMap.isValid(a,s))return!1;if(!$gameMap.isPassable(o,n,i))return!1;var p=t.reverseDir(i);return!!$gameMap.isPassable(a,s,p)&&!t.isCollidedWithCharacters(u,d)&&!!$gameMap.checkGroove(h,c)},l.checkJumpGroundToGroundInternal=function(t,e,r,i,o){var n=Math.round(e),a=Math.round(r),s=l.roundXWithDirectionLong(e,i,o),h=l.roundYWithDirectionLong(r,i,o),c=Math.round(s),u=Math.round(h);if(!$gameMap.isValid(c,u))return{pass:!1,x:0,y:0};var d=t.reverseDir(i);if($gameMap.isPassable(n,a,i)||$gameMap.isPassable(c,u,d))return{pass:!1,x:0,y:0};if($gameMap.checkNotPassageAll(c,u))return{pass:!1,x:0,y:0};if(t.isCollidedWithCharacters(s,h))return{pass:!1,x:0,y:0};var p=l.roundXWithDirectionLong(e,i,1),g=l.roundYWithDirectionLong(r,i,1);return l.isCollidedWithRiddingEvents(p,g)?{pass:!1,x:0,y:0}:{pass:!0,x:s,y:h}},l.checkMoveOrJumpGroundToObject=function(t,e,r,i,o){var n=Math.round(t),a=Math.round(e),s=Math.round(l.roundXWithDirectionLong(t,r,i)),h=Math.round(l.roundYWithDirectionLong(e,r,i));if(o||!$gameMap.isPassable(n,a,r)){var c=l.findPassableRideObject(s,h);return c||void 0}},l.checkMoveOrJumpObjectToGround=function(t,e,r,i,o){var n=Math.round(l.roundXWithDirectionLong(e,i,o)),a=Math.round(l.roundYWithDirectionLong(r,i,o));if(t.objectType==h.ObjectType.Box&&!t.falling()&&$gameMap.terrainTag(n,a)!=c.paramGuideLineTerrainTag)return!1;var s=t.reverseDir(i);return!$gameMap.isPassable(n,a,s)&&!$gameMap.checkNotPassageAll(n,a)&&!t.isCollidedWithCharacters(n,a)},l.checkMoveOrJumpObjectToObject=function(t,e,r,i){var o=Math.round(l.roundXWithDirectionLong(t,r,i)),n=Math.round(l.roundYWithDirectionLong(e,r,i)),a=l.findPassableRideObject(o,n);if(a)return a},l.isCollidedWithRiddingEvents=function(t,e){return $gameMap.eventsXyNt(t,e).some(function(t){return t.isRidding()})},l.findPassableRideObject=function(t,e){for(var r=$gameMap.events(),i=0;i<r.length;i++)if(r[i].checkPassRide(t,e))return r[i]},l.findCharacterById=function(t){return 0==t?$gamePlayer:$gameMap.events()[t-1]},l.canPassJumpGroundToGround=function(t,e,r,i){if(Math.round(e),Math.round(r),Math.round(l.roundXWithDirectionLong(e,i,2)),Math.round(l.roundYWithDirectionLong(r,i,2)),2==i||8==i){var o=2-(r-Math.floor(r));if(l.isHalfStepX(t)){var n=l.checkJumpGroundToGroundInternal(t,e-1,r,i,o),a=l.checkJumpGroundToGroundInternal(t,e,r,i,o);return!(!n.pass||!a.pass)&&a.pass}return l.checkJumpGroundToGroundInternal(t,e,r,i,o).pass}if(!l.isHalfStepY(t)||4!=i&&6!=i)return l.checkJumpGroundToGroundInternal(t,e,r,i,2).pass;if(!(n=l.checkJumpGroundToGroundInternal(t,e,r,i,2)).pass)return!1;var s=n.x,h=Math.ceil(n.y);return!(t.isCollidedWithCharacters(s,h)&&!(a=l.checkJumpGroundToGroundInternal(t,Math.round(e),h-1,i,2)).pass)&&n.pass},l.findObject=function(t,e){for(var r=$gameMap.eventsXyNt(t,e),i=0;i<r.length;i++)if(r[i].isMapObject())return r[i]},l.reverseDir=function(t){return 10-t},l.linear=function(t,e,r,i){return r*(t/i)+e},l.easeInExpo=function(t,e,r,i){return r*Math.pow(2,10*(t/i-1))+e},l.distance2D=function(t,e,r,i){var o=r-t,n=i-e;return Math.sqrt(o*o+n*n)},l);function l(){}e.MovingHelper=i},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),Game_Player.prototype.objectId=function(){return 0}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=r(1),i=Game_Event.prototype.initMembers;Game_Event.prototype.initMembers=function(){i.call(this),this._objectType=s.ObjectType.Character,this._objectHeight=-1,this._fallable=!1,this._eventTrigger=s.EventTrigger.None},Game_Event.prototype.isMapObject=function(){return this._objectType!=s.ObjectType.Character},Game_Event.prototype.objectId=function(){return this.eventId()},Game_Event.prototype.objectHeight=function(){return this._objectHeight};var o=Game_Event.prototype.setupPage;Game_Event.prototype.setupPage=function(){var t=this.objectHeight(),e=this.rider();o.call(this),this.parseListCommentForAMPSObject(),0==this.objectHeight()&&e&&e.jump(0,t)},Game_Event.prototype.parseListCommentForAMPSObject=function(){this._objectType=s.ObjectType.Character,this._objectHeight=-1,this._fallable=!1,this._eventTrigger=s.EventTrigger.None;var t=this.list();if(t){for(var e="",r=0;r<t.length;r++)108!=t[r].code&&408!=t[r].code||t[r].parameters&&(e+=t[r].parameters);var i=e.indexOf("@MapObject");if(0<=i){for(var o=e.substring(i+6),n=(o=o.substring(o.indexOf("{")+1,o.indexOf("}"))).split(","),r=0;r<n.length;r++){var a=n[r].split(":");switch(a[0].trim()){case"type":this._objectType=s.strToObjectType(a[1].trim());break;case"h":case"height":this._objectHeight=Number(a[1].trim());break;case"fallable":this._fallable="true"==a[1].trim();break;case"trigger":this._eventTrigger=s.strToEventTrigger(a[1].trim())}}return!0}}return!1}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=r(0);Game_Map.prototype.checkPassage=function(t,e,r){for(var i=this.tilesetFlags(),o=this.allTiles(t,e),n=0;n<o.length;n++){var a=i[o[n]];if(i[o[n]]>>12!=s.paramGuideLineTerrainTag&&0==(16&a)){if(0==(a&r))return!0;if((a&r)===r)return!1}}return!1},Game_Map.prototype.checkNotPassageAll=function(t,e){for(var r=this.tilesetFlags(),i=this.allTiles(t,e),o=0,n=0;n<i.length;n++){o|=r[i[n]]}return 15==(15&o)},Game_Map.prototype.checkGroove=function(t,e){for(var r=this.allTiles(t,e),i=0;i<r.length;i++)if(Tilemap.isTileA1(r[i]))return!0;return!1}}]);