(function(global){
    "use strict";

    const modeSelectionStorageKey = "pixfew.selectedMode";
    const validSaveModes = Object.freeze(["account", "guest"]);
    const environments = Object.freeze({
        staging: Object.freeze({
            apiBaseUrl: "https://api-staging.pixfew.example.invalid/api"
        })
    });

    function detectEnvironment(hostname){
        const normalizedHostname = String(hostname || "").toLowerCase();

        if(
            normalizedHostname === "" ||
            normalizedHostname === "localhost" ||
            normalizedHostname === "127.0.0.1" ||
            normalizedHostname === "[::1]"
        ){
            return "local";
        }

        if(normalizedHostname.endsWith(".github.io")){
            return "staging";
        }

        return "production";
    }

    function localApiBaseUrl(){
        const publicDirectoryMarker = "/public/";
        const markerIndex = global.location.pathname.indexOf(publicDirectoryMarker);
        const projectPath = markerIndex >= 0
            ? global.location.pathname.slice(0, markerIndex)
            : "";

        return global.location.origin + projectPath + "/backend/api";
    }

    function readSelectedMode(){
        const selectedMode = global.sessionStorage.getItem(modeSelectionStorageKey);

        return validSaveModes.includes(selectedMode) ? selectedMode : null;
    }

    function selectMode(mode){
        if(!validSaveModes.includes(mode)){
            throw new TypeError("O modo selecionado é inválido.");
        }

        global.sessionStorage.setItem(modeSelectionStorageKey, mode);
    }

    function clearSelectedMode(){
        global.sessionStorage.removeItem(modeSelectionStorageKey);
    }

    const environment = detectEnvironment(global.location.hostname);
    const apiBaseUrl = environment === "local"
        ? localApiBaseUrl()
        : environment === "production"
            ? global.location.origin + "/backend/api"
            : environments[environment].apiBaseUrl;

    global.PIXFEW_CONFIG = Object.freeze({
        environment,
        apiBaseUrl,
        save: Object.freeze({
            // Capturado antes do bootstrap e imutável durante esta execução.
            mode: readSelectedMode()
        })
    });

    global.PIXFEW_MODE_SELECTION = Object.freeze({
        select: selectMode,
        clear: clearSelectedMode
    });
})(window);
