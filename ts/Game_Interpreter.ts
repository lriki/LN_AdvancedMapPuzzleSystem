
/// <reference types="rpgmakermv_typescript_dts"/>
import { paramGuideLineTerrainTag } from './PluginParameters'
import { AMPSManager } from './AMPSManager';

var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command: string, args: string[]) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    AMPSManager.pluginCommand(command, args);
};

/**
 * イベント実行終了時に エフェクト用イベントを削除したいのでフックして通知する。
 * （トリガーが "自動実行" でも呼ばれる）
 */
/*
var _Game_Interpreter_terminate = Game_Interpreter.prototype.terminate;
Game_Interpreter.prototype.terminate = function() {
    _Game_Interpreter_terminate.call(this);

};
*/
