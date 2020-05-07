import { AMPSManager } from './AMPSManager'

var _Scene_Boot_prototype_create = Scene_Boot.prototype.create;
Scene_Boot.prototype.create = function() {
    _Scene_Boot_prototype_create.call(this);
    AMPSManager.init();
};
