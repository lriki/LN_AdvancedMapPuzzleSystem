

//-----------------------------------------------------------------------------
// MovingHelper
// 　

import { ObjectType } from "./Common";
import { paramGuideLineTerrainTag } from './PluginParameters'

export interface MovingResult {
    pass: boolean;
    x: number;
    y: number;
}

export class MovingHelper {
    
    /** 半歩状態かどうか */
    static isHalfStepX(character: Game_CharacterBase): boolean {
        return Math.floor(character.x) !== character.x;
    };

    /** 半歩状態かどうか */
    static isHalfStepY(character: Game_CharacterBase): boolean {
        return Math.floor(character.y) !== character.y;
    };

    static frontX(x: number, d: number) : number {
        return x + (d === 6 ? 1 : d === 4 ? -1 : 0);
    }
    
    static frontY(y: number, d: number) : number {
        return y + (d === 2 ? 1 : d === 8 ? -1 : 0);
    }

    static frontXAligned(x: number, d: number) : number {
        return Math.round(x) + (d === 6 ? 1 : d === 4 ? -1 : 0);
    }

    static frontYAligned(y: number, d: number) : number {
        return Math.round(y) + (d === 2 ? 1 : d === 8 ? -1 : 0);
    }

    /**
     * オリジナルの Game_Map.prototype.roundXWithDirection の処理。
     * 本モジュールとしては必ず整数として扱う。
     * ※HalfMove.js などで再定義がかかると 0.5 単位で返ってくることがあり都合が悪い。
     */
    static roundXWithDirection(x: number, d: number) {
        return $gameMap.roundX(x + (d === 6 ? 1 : d === 4 ? -1 : 0));
    };
    
    /**
     * see: roundXWithDirection
     */
    static roundYWithDirection(y: number, d: number) {
        return $gameMap.roundY(y + (d === 2 ? 1 : d === 8 ? -1 : 0));
    };

    /**
     * Game_Map.roundXWithDirection に対して、len マス分移動した先の論理 X 座標を返す。（len=1 だと元の処理と同じ）
     * ちなみにこれ系の "round" は マップのループ対応のための繰り返しを意味する
     */
    static roundXWithDirectionLong(x: number, d: number, len: number) {
        
        /*
        // まずは 1 マス先を取得
        var dx = $gameMap.roundXWithDirection(x, d);

        // len 分だけ処理を繰り返して先に進める
        var ic = Math.floor(len);
        for (var i = 0; i < ic - 1; i++) {
            dx = $gameMap.roundXWithDirection(dx, d);
        }

        // 端数分の処理
        var f = len - Math.floor(len);
        if (f > 0) {
            dx += $gameMap.roundXWithDirection(0, d) * f;
        }

        return dx;
        */

        // まずは 1 マス先を取得
        var dx = MovingHelper.roundXWithDirection(x, d);

        // len 分だけ処理を繰り返して先に進める
        var ic = Math.floor(len);
        for (var i = 0; i < ic - 1; i++) {
            dx = MovingHelper.roundXWithDirection(dx, d);
        }

        // 端数分の処理
        var f = len - Math.floor(len);
        if (f > 0) {
            dx += MovingHelper.roundXWithDirection(0, d) * f;
        }

        return dx;
    };
    
    /**
     * see: roundXWithDirectionLong
     */
    static roundYWithDirectionLong(y: number, d: number, len: number) {
        /*
        // まずは 1 マス先を取得
        var dy = $gameMap.roundYWithDirection(y, d);

        // len 分だけ処理を繰り返して先に進める
        var ic = Math.floor(len);
        for (var i = 0; i < ic - 1; i++) {
            dy = $gameMap.roundYWithDirection(dy, d);
        }

        // 端数分の処理
        var f = len - Math.floor(len);
        if (f > 0) {
            dy += $gameMap.roundYWithDirection(0, d) * f;
        }
        
        return dy;
        */

        // まずは 1 マス先を取得
        var dy = MovingHelper.roundYWithDirection(y, d);

        // len 分だけ処理を繰り返して先に進める
        var ic = Math.floor(len);
        for (var i = 0; i < ic - 1; i++) {
            dy = MovingHelper.roundYWithDirection(dy, d);
        }

        // 端数分の処理
        var f = len - Math.floor(len);
        if (f > 0) {
            dy += MovingHelper.roundYWithDirection(0, d) * f;
        }

        return dy;
    };

    /**
     * エッジタイル上にいて、外側を向いているか
     * @param x 
     * @param y 
     * @param d 
     */
    static checkFacingOutsideOnEdgeTile(x: number, y: number, d: number) {
        var x1 = Math.round(x);
        var y1 = Math.round(y);
        // 指定方向に出られなければ、エッジタイル上にいることにする
        return !$gameMap.isPassable(x1, y1, d);
    }

    /**
     * d 方向に対面するエッジタイルがあるか
     * @param x 
     * @param y 
     * @param d 
     * @param length : 1 にすると目の前のタイルを確認する。
     */
    static checkFacingOtherEdgeTile(x: number, y: number, d: number, length: number) {
        var x1 = Math.round(MovingHelper.roundXWithDirectionLong(x, d, length));
        var y1 = Math.round(MovingHelper.roundYWithDirectionLong(y, d, length));
        if ($gameMap.isPassable(x1, y1, MovingHelper.reverseDir(d))) {
            return false;
        }
        return true;
    }

    /**
     * 向かいの2マス先のタイルへジャンプできるか（エッジタイル同士）
     */
    static canPassJumpGroundToGround = function(character: Game_CharacterBase, x: number, y: number, d: number): boolean {
        var x1 = Math.round(x);
        var y1 = Math.round(y);
        var x2 = Math.round(MovingHelper.roundXWithDirectionLong(x, d, 2));
        var y2 = Math.round(MovingHelper.roundYWithDirectionLong(y, d, 2));

        if (d == 2 || d == 8) {
            var nearYOffset = y - Math.floor(y);
            var jumpLen = 2 - nearYOffset;

            if (MovingHelper.isHalfStepX(character)) {
                // HalfMove.js の対策。
                // X半歩状態での上下移動は、移動先隣接2タイルをチェックする。
                // 両方移動可能ならOK
    
                var r1 = MovingHelper.checkJumpGroundToGroundInternal(character, x - 1.0, y, d, jumpLen);
                var r2 = MovingHelper.checkJumpGroundToGroundInternal(character, x, y, d, jumpLen);
                if (!r1.pass || !r2.pass) {
                    return false;
                }
    
                return r2.pass;
            }

            return MovingHelper.checkJumpGroundToGroundInternal(character, x, y, d, jumpLen).pass;
        }
        else if (MovingHelper.isHalfStepY(character) && (d == 4 || d == 6)) {
            // HalfMove.js の対策。
            // Y半歩状態での左右移動。
            // シナリオ上とおせんぼに使いたいイベントの後ろへジャンプ移動できてしまう問題の対策。
            
            var r1 = MovingHelper.checkJumpGroundToGroundInternal(character, x, y, d, 2);
            if (!r1.pass) {
                // 普通に移動できなかった
                return false;
            }

            var iToX = r1.x;
            var iToY = Math.ceil(r1.y);
            if (character.isCollidedWithCharacters(iToX, iToY)) {
                // ceil した移動先（+0.5）にキャラクターがいる

                var r2 = MovingHelper.checkJumpGroundToGroundInternal(character, Math.round(x), iToY - 1, d, 2);
                if (!r2.pass) {
                    // 移動できなかった
                return false;
                }
            }

            return r1.pass;
        }

        return MovingHelper.checkJumpGroundToGroundInternal(character, x, y, d, 2).pass;
    }

    /**
     * 1マス前のタイルは溝であり、向かいの2マス先のタイルへジャンプできるか
     */
    static canPassJumpGroove(character: Game_CharacterBase, x: number, y: number, d: number): boolean {
                    
        if (d == 2 || d == 8) {
            if (MovingHelper.isHalfStepX(character)) {
                // 上下移動については HalfMove.js の対策をつける。
                // X半歩状態での上下移動は、移動先隣接2タイルをチェックする。
                // 両方移動可能ならOK。
    
                var r1 = MovingHelper.canPassJumpGrooveInternal(character, x - 1.0, y, d);
                var r2 = MovingHelper.canPassJumpGrooveInternal(character, x, y, d);
                if (!r1 || !r2) {
                    return false;
                }
    
                return r2;
            }
        }

        return MovingHelper.canPassJumpGrooveInternal(character, x, y, d);
    }

    static canPassJumpGrooveInternal(character: Game_CharacterBase, x: number, y: number, d: number): boolean {
        var x1 = Math.round(x);
        var y1 = Math.round(y);
        var x2 = Math.round(MovingHelper.roundXWithDirectionLong(x, d, 2));
        var y2 = Math.round(MovingHelper.roundYWithDirectionLong(y, d, 2));
        var x3 = Math.round(MovingHelper.roundXWithDirectionLong(x, d, 1));
        var y3 = Math.round(MovingHelper.roundYWithDirectionLong(y, d, 1));
        var toX = MovingHelper.roundXWithDirectionLong(x, d, 2);
        var toY = MovingHelper.roundYWithDirectionLong(y, d, 2);
        if (!$gameMap.isValid(x2, y2)) {
            // マップ外
            return false;
        }
        if (!$gameMap.isPassable(x1, y1, d)) {
            // 現在位置から移動できない
            return false;
        }
        var d2 = character.reverseDir(d);
        if (!$gameMap.isPassable(x2, y2, d2)) {
            // 移動先から手前に移動できない
            return false;
        }
        if (character.isCollidedWithCharacters(toX, toY)) {
            // 移動先にキャラクターがいる
            return false;
        }
        if (!$gameMap.checkGroove(x3, y3)) {
            // 目の前のタイルが溝ではない
            return false;
        }
        return true;
    }

    /**
     * 向かい合ったエッジタイル間をジャンプできるか
     * @param {*} x 現在位置X(丸めない)
     * @param {*} y 現在位置Y(丸めない)
     * @param {*} d 現在の向き
     * @param {*} len 移動量
     */
    static checkJumpGroundToGroundInternal(character: Game_CharacterBase, x: number, y: number, d: number, len: number): MovingResult {
        var iFromX = Math.round(x);
        var iFromY = Math.round(y);
        var toX = MovingHelper.roundXWithDirectionLong(x, d, len);
        var toY = MovingHelper.roundYWithDirectionLong(y, d, len);
        var iToX = Math.round(toX);
        var iToY = Math.round(toY);
        if (!$gameMap.isValid(iToX, iToY)) {
            // マップ外
            return { pass: false, x: 0, y: 0 };
        }
        var d2 = character.reverseDir(d);
        if ($gameMap.isPassable(iFromX, iFromY, d) || $gameMap.isPassable(iToX, iToY, d2))
        {
            // 現在位置から移動できるなら崖ではない。
            // 移動先から手前に移動できるなら崖ではない。
            return { pass: false, x: 0, y: 0 };
        } 
        if ($gameMap.checkNotPassageAll(iToX, iToY))
        {
            // 移動先が全方位進入禁止。壁とか。
            return { pass: false, x: 0, y: 0 };
        }
        if (character.isCollidedWithCharacters(toX, toY)) {
            // 移動先にキャラクターがいる
            return { pass: false, x: 0, y: 0 };
        }

        var toX1 = MovingHelper.roundXWithDirectionLong(x, d, 1);
        var toY1 = MovingHelper.roundYWithDirectionLong(y, d, 1);
        if (MovingHelper.isCollidedWithRiddingEvents(toX1, toY1)) {
            // 崖と崖の間に、別のオブジェクトに乗ったオブジェクトがある場合は移動禁止。
            return { pass: false, x: 0, y: 0 };
        }
        return { pass: true, x: toX, y: toY };
    }

    /**
     * 地面から、別のオブジェクトに 歩行 または ジャンプ で乗ることかできるか確認する。
     * 移動かジャンプかは length で指定(1=移動 2=ジャンプ)
     * @param ignoreMapPassable: 基本は false。true は崖から落下したオブジェクトを別のオブジェクトに乗せるときの確認に使う。
     */
    static checkMoveOrJumpGroundToObject(x: number, y: number, d: number, length: number, ignoreMapPassable: boolean): Game_CharacterBase | undefined {
        var x1 = Math.round(x);
        var y1 = Math.round(y);
        // 移動先座標を求める
        var new_x = Math.round(MovingHelper.roundXWithDirectionLong(x, d, length));
        var new_y = Math.round(MovingHelper.roundYWithDirectionLong(y, d, length));
        
        if (!ignoreMapPassable) {
            if ($gameMap.isPassable(x1, y1, d)) {
                // 現在位置から移動できるなら崖ではない
                return undefined;
            }
        }

        // 乗れそうなオブジェクトを探す
        var obj = MovingHelper.findPassableRideObject(new_x, new_y);
        if (obj) {
            return obj;
        }

        return undefined;
    };

    /**
     * オブジェクト上から、地面へ 歩行 または ジャンプ で乗ることかできるか確認する。
     * 移動かジャンプかは length で指定(1=移動 2=ジャンプ)
     */
    static checkMoveOrJumpObjectToGround(character: Game_CharacterBase, x: number, y: number, d: number, length: number) {
        // ジャンプ先座標を求める
        var new_x = Math.round(MovingHelper.roundXWithDirectionLong(x, d, length));
        var new_y = Math.round(MovingHelper.roundYWithDirectionLong(y, d, length));

        // 箱オブジェクトは特定の地形タグ上へのみ移動できる
        if (character.objectType() == ObjectType.Box && !character.falling()) {
            if ($gameMap.terrainTag(new_x, new_y) != paramGuideLineTerrainTag) {
                return false;
            }
        }

        var d2 = character.reverseDir(d);
        if ($gameMap.isPassable(new_x, new_y, d2)) {
            // 移動先から手前に移動できるなら崖ではない
            return false;
        }
        if ($gameMap.checkNotPassageAll(new_x, new_y)) {
            // 移動先が全方位進入禁止。壁とか。
            return false;
        }
        if (character.isCollidedWithCharacters(new_x, new_y)) {
            // 移動先にキャラクターがいる
            return false;
        }
        return true;
    }

    /**
     * オブジェクト上から別のオブジェクト上へ、 歩行 または ジャンプ で乗ることかできるか確認する。
     * 移動かジャンプかは length で指定(1=移動 2=ジャンプ)
     */
    static checkMoveOrJumpObjectToObject(x: number, y: number, d: number, length: number): Game_CharacterBase | undefined {
        // ジャンプ先座標を求める
        var new_x = Math.round(MovingHelper.roundXWithDirectionLong(x, d, length));
        var new_y = Math.round(MovingHelper.roundYWithDirectionLong(y, d, length));

        // 乗れそうなオブジェクトを探す
        var obj = MovingHelper.findPassableRideObject(new_x, new_y);
        if (obj) {
            return obj;
        }

        return undefined;
    }

    /**
     * 指定座標に、オブジェクトに乗った別のキャラクターが存在するかを確認する。
     */
    static isCollidedWithRiddingEvents(x: number, y: number) {
        var events = $gameMap.eventsXyNt(x, y);
        return events.some(function(event) {
            return event.isRidding();
        });
    };

    /**
     * グローバル座標 x, yから見た時、そこが乗れる位置であるマップオブジェクトを探す
     */
    static findPassableRideObject(x: number, y: number): Game_CharacterBase | undefined {
        var events = $gameMap.events();
        for (var i = 0; i < events.length; i++) {
            if (events[i].checkPassRide(x, y)) {
                return events[i];
            };
        };
        return undefined;
    }

    // id: 0=Player, 1~=Event
    static findCharacterById(id: number): Game_CharacterBase {
        if (id == 0) {
            return $gamePlayer;
        }
        var events = $gameMap.events();
        return events[id - 1];
    }

    /**
     * 指定座標にいるマップオブジェクトを取得する。存在しない場合は null
     */
    static findObject = function(x: number, y: number): Game_CharacterBase | undefined {
        var events = $gameMap.eventsXyNt(x, y);
        for(var i = 0; i < events.length; i++) {
            if(events[i].isMapObject()) {
                return events[i];
            }
        }
        return undefined;
    }

    /**
     * 位置・向き・射程距離・反応してほしいマップスキル名を指定して、一番近い位置にあるオブジェクトを検索する。
     * @param character 
     * @param d 
     * @param ranegLength 
     */
    static findReactorMapObjectInLineRange(x: number, y: number, d: number, ranegLength: number, mapSkillName: string): Game_Event | undefined {
        let localName = mapSkillName.toLocaleLowerCase();
        for (let iLen = 0; iLen < ranegLength; iLen++) {
            let dx = Math.round(MovingHelper.roundXWithDirectionLong(x, d, iLen + 1));
            let dy = Math.round(MovingHelper.roundYWithDirectionLong(y, d, iLen + 1));
            let events = $gameMap.eventsXyNt(dx, dy);
            for (let iEvent = 0; iEvent < events.length; iEvent++) {
                let event = events[iEvent];
                if (event.isMapObject() && event.reactionMapSkill() == localName) {
                    return event;
                }
            }
            
            // 次へ進むとき、見かけ上高い障害物が間にある場合は中断する。
            // 高さとして、ひとつ上のタイルが☆であれば障害物とする。
            if ($gameMap.isValid(dx, dy - 1) && MovingHelper.checkLayeredTilesFlags($gameMap, dx, dy - 1, 0x10)) {
                return undefined;
            }

        }

        return undefined;
    }

    /**
     * Game_Map.checkLayeredTilesFlags の、tileId 0 を無視する版。
     * tileId=0 の flags は 16 固定となっているため、☆の有無を知りたいときに邪魔になる。
     * 
     * × 1551: 110 0000 1111‬
     * 〇 1536: 110 0000 0000
     * ☆ 1552: 110 0001 0000
     */
    static checkLayeredTilesFlags = function(map: Game_Map, x: number, y: number, bit: number): boolean {
        var flags = map.tilesetFlags();
        return map.layeredTiles(x, y).some(function(tileId) {
            return tileId !== 0 && (flags[tileId] & bit) !== 0;
        });
    };

    static reverseDir = function(d: number) {
        return 10 - d;
    };

    // t:現在時間(0.0～d) b:開始値 c:値の変化量 (目標値-開始値) d:変化にかける時間
    static linear = function(t: number, b: number, c: number, d: number): number {
		return c * (t / d) + b;
    };
    
    static easeInExpo = function(t: number, b: number, c: number, d: number): number {
		return c * Math.pow(2.0, 10.0 * (t / d - 1.0)) + b;
    };

    static distance2D = function(x0: number, y0: number, x1: number, y1: number): number {
        var x = x1 - x0;
        var y = y1 - y0;
        return Math.sqrt( x * x + y * y );
    }

}
