
var pluginName = 'LN_AdvancedMapPuzzleSystem';

// 
export var paramMapSkillEffectsMapId = Number(PluginManager.parameters(pluginName)['MapSkillEffectsMapId']);

// ガイドラインの地形タグ
export var paramGuideLineTerrainTag = Number(PluginManager.parameters(pluginName)['GuideLineTerrainTag']);

// オブジェクトの落下速度
export var paramFallingSpeed = 5;

export var paramAllowAllMapPuzzles: boolean = true;

var localAllowAllMapPuzzles = PluginManager.parameters(pluginName)['AllowAllMapPuzzles'];
if (localAllowAllMapPuzzles != undefined) {
    paramAllowAllMapPuzzles = (localAllowAllMapPuzzles.toLowerCase() === 'true');
}

// 滑る床リージョン ID
export var paramSlipperyTileRegionId = Number(PluginManager.parameters(pluginName)['SlipperyTileRegionId']);
// = 1;

// 滑り中のアニメーションパターン
export var paramSlippingAnimationPattern = Number(PluginManager.parameters(pluginName)['SlippingAnimationPattern']);
// = 2;
