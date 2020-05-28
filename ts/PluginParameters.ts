
var pluginName = 'LN_AdvancedMapPuzzleSystem';

// 
export var paramMapSkillEffectsMapId = Number(PluginManager.parameters(pluginName)["MapSkillEffectsMapId"]);

// ガイドラインの地形タグ
export var paramGuideLineTerrainTag = Number(PluginManager.parameters(pluginName)["GuideLineTerrainTag"]);

// オブジェクトの落下速度
export var paramFallingSpeed = 5;

export var paramAllowAllMapPuzzles: boolean = true;

var localAllowAllMapPuzzles = PluginManager.parameters(pluginName)["AllowAllMapPuzzles"];
if (localAllowAllMapPuzzles) {
    paramAllowAllMapPuzzles = Boolean(localAllowAllMapPuzzles);
}
