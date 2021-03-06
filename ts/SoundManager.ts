
var _gsJumpSe = {name: "Evasion1", volume: 80, pitch: 110, pan: 0};
var _falledSe = {name: "Earth3", volume: 80, pitch: 100, pan: 0};

var _SoundManager_preloadImportantSounds = SoundManager.preloadImportantSounds;
SoundManager.preloadImportantSounds = function() {
    _SoundManager_preloadImportantSounds.call(SoundManager);
    if ($dataSystem) {
        // ジャンプ音をシステムサウンドとしてロード
        AudioManager.loadStaticSe(_gsJumpSe);
    }
};

export class AMPS_SoundManager
{
    static playGSJump(): void
    {
        if ($dataSystem) {
            AudioManager.playStaticSe(_gsJumpSe);
        }
    }

    static playGSFalled(): void {
        AudioManager.playSe(_falledSe);
    }
};
