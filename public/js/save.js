(function(global){
    "use strict";

    const saveModes = Object.freeze({
        account: "account",
        guest: "guest"
    });
    const saveLoadTimeout = 3000;

    let loadedSaveData = null;

    function getMode(){
        const mode = global.PIXFEW_CONFIG.save.mode;

        if(mode === null){
            const error = new Error("Nenhum modo de jogo foi selecionado.");
            error.code = "MODE_REQUIRED";
            throw error;
        }

        if(mode !== saveModes.account && mode !== saveModes.guest){
            throw new Error("O modo de save configurado é inválido.");
        }

        return mode;
    }

    function getSaveReference(){
        return getMode() === saveModes.guest ? null : Object.freeze({
            mode: saveModes.account
        });
    }

    function validateSaveResponse(payload){
        const position = payload &&
            payload.status === "ok" &&
            payload.data &&
            payload.data.save &&
            payload.data.save.position;

        if(
            !position ||
            !Number.isFinite(Number(position.x)) ||
            !Number.isFinite(Number(position.y))
        ){
            throw new Error("A API retornou um save inválido.");
        }

        return payload.data;
    }

    function createEndpoint(){
        return new URL(
            global.PIXFEW_CONFIG.apiBaseUrl.replace(/\/$/, "") + "/save.php"
        );
    }

    async function parseSaveResponse(response){
        if(response.status === 401){
            const error = new Error("A sessão do administrador expirou ou não é válida.");
            error.code = "ADMIN_AUTH_REQUIRED";
            throw error;
        }

        if(!response.ok){
            throw new Error("Não foi possível processar o save (HTTP " + response.status + ").");
        }

        const saveData = validateSaveResponse(await response.json());
        loadedSaveData = saveData;

        return saveData;
    }

    async function loadSave({ signal } = {}){
        if(getMode() === saveModes.guest){
            loadedSaveData = null;
            return null;
        }

        const requestController = new AbortController();
        let forwardAbort = null;
        let timeoutId = null;

        if(signal){
            if(signal.aborted){
                requestController.abort();
            }else{
                forwardAbort = function(){
                    requestController.abort();
                };

                signal.addEventListener("abort", forwardAbort, { once: true });
            }
        }

        timeoutId = setTimeout(function(){
            requestController.abort();
        }, saveLoadTimeout);

        try{
            const response = await global.fetch(createEndpoint(), {
                method: "GET",
                headers: {
                    Accept: "application/json"
                },
                signal: requestController.signal
            });

            return await parseSaveResponse(response);
        }finally{
            clearTimeout(timeoutId);

            if(signal && forwardAbort){
                signal.removeEventListener("abort", forwardAbort);
            }
        }
    }

    function saveGuestCheckpoint(checkpointData){
        const previousExtraData = loadedSaveData &&
            loadedSaveData.save &&
            loadedSaveData.save.extra_data
            ? loadedSaveData.save.extra_data
            : {};

        loadedSaveData = {
            player: {
                id: null,
                name: "Convidado"
            },
            save: {
                id: null,
                slot: null,
                schema_version: 1,
                current_act: checkpointData.currentAct,
                current_room: checkpointData.currentRoom,
                checkpoint: checkpointData.checkpoint,
                position: {
                    x: checkpointData.position.x,
                    y: checkpointData.position.y
                },
                extra_data: Object.assign({}, previousExtraData, checkpointData.extraData),
                updated_at: null
            }
        };

        return loadedSaveData;
    }

    async function saveCheckpoint(checkpointData, { signal } = {}){
        if(getMode() === saveModes.guest){
            return saveGuestCheckpoint(checkpointData);
        }

        const payload = {
            current_act: checkpointData.currentAct,
            current_room: checkpointData.currentRoom,
            checkpoint: checkpointData.checkpoint,
            position: checkpointData.position,
            extra_data: checkpointData.extraData
        };

        const response = await global.fetch(createEndpoint(), {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
            signal
        });

        return parseSaveResponse(response);
    }

    function getLoadedSave(){
        return loadedSaveData;
    }

    function returnToModeSelection(){
        global.PIXFEW_MODE_SELECTION.clear();
        global.location.replace("menu.html");
    }

    global.PIXFEW_SAVE = Object.freeze({
        getMode,
        getSaveReference,
        loadSave,
        saveCheckpoint,
        getLoadedSave,
        returnToModeSelection
    });
})(window);
