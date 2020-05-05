/// <reference types="rpgmakermv_typescript_dts"/>

import { B } from "./b";

//export * from "./b";

(function() {
    B();
    var onLoad = DataManager.onLoad;
    DataManager.onLoad = function(object) {
        onload.apply(DataManager, arguments);
    }
})

