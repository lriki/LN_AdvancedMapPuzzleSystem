
/// <reference types="rpgmakermv_typescript_dts"/>
/// <reference path="./Game_AMPSVariables.ts" />
import { paramGuideLineTerrainTag } from './PluginParameters'
import { Game_AMPSVariables } from './Game_AMPSVariables';

export var g_gameAMPSVariables: Game_AMPSVariables;

//var _SoundManager_preloadImportantSounds = SoundManager.preloadImportantSounds;
//S/oundManager.preloadImportantSounds = function() {
//    _SoundManager_preloadImportantSounds.call(SoundManager);

declare global {
    interface ISaveContents
    {
        ampsVariables?  : Game_AMPSVariables;
    }
}

const DataManager_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    var contents = DataManager_makeSaveContents.call(DataManager);
    contents.ampsVariables = g_gameAMPSVariables;
    console.log("save", contents.ampsVariables);
    return contents;
};

const DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    DataManager_extractSaveContents.call(DataManager, contents);
    let anyContents = (contents as any);
    console.log("load", anyContents.ampsVariables);
    if (anyContents.ampsVariables) {
        g_gameAMPSVariables = anyContents.ampsVariables;// as Game_AMPSVariables;
    }
};
