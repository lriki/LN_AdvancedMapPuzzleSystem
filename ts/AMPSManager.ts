/// <reference types="rpgmakermv_typescript_dts"/>

import { paramMapSkillEffectsMapId } from "./PluginParameters";
import { Game_AMPSVariables } from "./Game_AMPSVariables";
import { PlateMovingBehavior, MovingBehavior } from "./MovingBehavior";
import { BehaviorType } from "./Common";

//var $effectsMapData: IDataMap;
//var $dataMap          = null;

declare global {
    //var window: Window
    var $dataMapSkillEffectsMap: IDataMap | undefined;


}

//export var $dataMapSkillEffectsMap: IDataMap | undefined = undefined;

/**
 * エフェクト定義用マップデータを読んだ後、Metadata を展開する
 */
var _DataManager_onLoad = DataManager.onLoad;
DataManager.onLoad = function(object: any) {
    _DataManager_onLoad.call(this, object);

    if (paramMapSkillEffectsMapId > 0) {
        if (object === $dataMapSkillEffectsMap) {
            this.extractMetadata(object);
            var array = object.events;
            for (var i = 0; i < array.length; i++) {
                var data = array[i];
                if (data && data.note !== undefined) {
                    this.extractMetadata(data);
                }
            }
        }
    }
}


export class AMPSManager
{
    static gameAMPSVariables: Game_AMPSVariables = new Game_AMPSVariables();
    static _movingBehaviors: (MovingBehavior | undefined)[] = [undefined, new PlateMovingBehavior()];

    
    static tempMapSkillEffectDataId: number = -1;
    static tempMapSkillEffectInvokerId: number = -1;

    static dataMapSkillEffectsMap(): IDataMap | undefined {
        return $dataMapSkillEffectsMap;
    }

    static padZero(str: string, length: number): string {
        var s = str;
        while (s.length < length) {
            s = '0' + s;
        }
        return s;
    };

    static init() {
        if (paramMapSkillEffectsMapId > 0) {
            // エフェクト用のイベントが定義されている MapData を保持しておく
            //DataManager.loadMapData(10);
            //DataManager.loadDataFile('AMPSManager.effectsMapData', 'Map010.json');
            DataManager.loadDataFile('$dataMapSkillEffectsMap', 'Map001.json');
            //AMPSManager.effectsMapData = $dataMap;
    
            //var ary = [1, 2, 3];
            //ary[10] = 100;
            //console.log(ary);
    
            //let mapId = 10;
            //let id = AMPSManager.padZero(String(mapId), 3);
            //let filename = `Map${id}.json`;
            //let mapLoader = ResourceHandler.createLoader('data/' + filename, this.loadDataFile.bind(this, '$dataMap', filename));
            //DataManager.loadDataFile('$dataMap', filename);
        }
    }

    static behavior(type: BehaviorType): MovingBehavior | undefined {
        return this._movingBehaviors[type];
    }

    static pluginCommand = function(command: string, args: string[]) {
        switch (command) {
            case 'AMPS-MapSkill':
                switch (args[0]) {
                    case 'call':
                        $gameMap.spawnMapSkillEffectEvent(args[1]);
                        break;
                }
        }
        /*
        */
    }
};

/*
    [ムーブ][キャリー][フォース] 実装メモ
    ----------
    ### カスタマイズしたいポイントは？
    - 発動者のアニメーション (魔法陣とか)
    - 背景エフェクト (半暗転とか)
    - 発動中の発動者のアニメーション (明滅とか)
    - 発動中の対象のアニメーション (明滅とか)
    - 発動中の第3エフェクト (手の画像とか)
    - 発動中のカーソル (原作にはないが、移動方向を示すカーソルを表示してみたい)
    - 終了の対象アニメーション (キャリー)
    - 終了の第3エフェクト (手の消滅)

    ### Dialog とイベントからの発動
    ユーザー入力を伴うものは Dialog の考え方を使う。
    同時発動は1つだけ。

    イベント(NPC)がムーブを使うときは、スキル発動と方向指定は分けた方がいいだろう。
    - AMPS mapskill イベントID 1    # この中で Adhoc なイベントを作って動かす。Dialog が開くまで制御を返さない。
    - AMPS mapskill-reply left      # 左入力

    ### エフェクト用イベント
    ↑の第3エフェクトを表現するためのイベント。カーソルの表現にも使えるかな。
    イベント定義用の Map を作っておいて、スキル発動時にそこからコピーして Adhoc なイベントを作る。

    ### どのプラグインコマンドをどこに書きたい？
    登場人物がかなり多くなるのであんまり複雑にはしたくないところだが…。
    - スキルを指定して発動するコマンド
        - ストーリーイベントの実行リスト
        - メニューからの発動用コモンイベント
    - ダイアログを開くコマンド
        - エフェクト用イベント (エフェクトのタイミングに依存して開きたいため)
    - ダイアログに入力するコマンド
        - ストーリーイベントの実行リスト
    
    ### Dialog の実装
    - キー入力を受け取れるのは、AMPS mapskill で実行したもの。
    - AMPS mapskill-event で実行したものはキー入力を受け取れない。AMPS mapskill-reply で動かす必要がある。

    [ムーブ] 実装メモ
    ----------
    - マップ上で発動可能なスキル "ムーブ" を作る。
        - コモンイベント "マップスキル-ムーブ" を起動するようにしておく。
    - コモンイベント "マップスキル-ムーブ"
        - [プレイヤー] に対して発動アニメーションを表示する
        - Wait 10 くらい
        - AMPS mapskill 1   # プレイヤーに対して "ムーブ" を発動する。終了まで待つ。
    - ストーリーイベントから起動する場合
        - AMPS mapskill-event 2 1       # イベント2 が 1 のマップスキルを発動する。待たずにすぐ制御を変える。0 はプレイヤーが対象。
        - AMPS mapskill-reply left      # Dialog 入力可能まで待ち、left を入力する。もし発動失敗したり、Dialog 開かず終了したら制御を返す
        - AMPS mapskill-event-wait 2    # または、終了まで待つ
    - マップイベント定義 Map に、"ムーブエフェクト用イベント" を作る。
        - Page1: SelfSW-X: 発動時
            - 変数で [向き] [距離] を受け取り、現在位置 (発動者の位置) からそこへ向かう表現をする。失敗も変数で受け取っていいかな。
            - 移動 wait.
            - AMPS effect-dialog dir4-ground`  # 入力ダイアログを開く → 普通の選択肢と同じくここでウェイト。変数で方向やキャンセルを返す。
            - AMPS effect-attach-target        # 以降、移動操作をターゲットへ同期するようにする
            - 返ってきた方向に応じて、エフェクト用イベントを移動ルート指定で移動させる
                - 同期設定になっているので移動できる。
            - AMPS effect-detach-target        # 同期終了
            - 終了動作
        - これら一連の処理は、可能なのであれば1つのページで完結したほうが混乱少ないのでいいだろう。
    - マップイベント定義 Map に、"カーソル用イベント" を作る。
        - AMPS effect-dialog dir4-ground とかしたときに、そのイベントと同じ座標に表示されるもの。

*/

