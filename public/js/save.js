(function(global){
    "use strict";

    const saveModes = Object.freeze({
        account: "account",
        guest: "guest"
    });
    const saveLoadTimeout = 3000;

    let loadedSaveData = null;
    let authenticatedIdentity = null;

    function validatePositiveInteger(value, fieldName){
        if(!Number.isInteger(value) || value <= 0){
            throw new TypeError(fieldName + " deve ser um inteiro positivo.");
        }
    }

    function getMode(){
        const mode = global.PIXFEW_CONFIG.save.mode;

        if(mode !== saveModes.account && mode !== saveModes.guest){
            throw new Error("O modo de save configurado é inválido.");
        }

        return mode;
    }

    function provideAuthenticatedIdentity(reference){
        validatePositiveInteger(reference && reference.playerId, "playerId");
        validatePositiveInteger(reference && reference.slot, "slot");

        /*
         * PONTO DE INTEGRAÇÃO DO LOGIN FUTURO:
         * o bootstrap de uma sessão autenticada deverá chamar esta função antes
         * de initializeGame(). A identidade recebida aqui organiza o frontend;
         * a API real deverá autorizar o jogador pela sessão do servidor, nunca
         * confiar no playerId enviado pelo navegador.
         */
        authenticatedIdentity = Object.freeze({
            playerId: reference.playerId,
            slot: reference.slot
        });
    }

    function getSaveReference(){
        if(getMode() === saveModes.guest){
            return null;
        }

        const reference = authenticatedIdentity ||
            global.PIXFEW_CONFIG.save.developmentAccount;

        validatePositiveInteger(reference.playerId, "playerId");
        validatePositiveInteger(reference.slot, "slot");

        return reference;
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

    function createEndpoint(reference){
        validatePositiveInteger(reference.playerId, "playerId");
        validatePositiveInteger(reference.slot, "slot");

        const endpoint = new URL(
            global.PIXFEW_CONFIG.apiBaseUrl.replace(/\/$/, "") + "/save.php"
        );

        return endpoint;
    }

    async function parseSaveResponse(response){
        if(!response.ok){
            throw new Error("Não foi possível processar o save (HTTP " + response.status + ").");
        }

        const saveData = validateSaveResponse(await response.json());
        loadedSaveData = saveData;

        return saveData;
    }

    async function loadSave(reference = getSaveReference(), { signal } = {}){
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

        const endpoint = createEndpoint(reference);
        endpoint.searchParams.set("player_id", String(reference.playerId));
        endpoint.searchParams.set("slot", String(reference.slot));

        try{
            const response = await global.fetch(endpoint, {
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

    async function saveCheckpoint(checkpointData, reference = getSaveReference(), { signal } = {}){
        if(getMode() === saveModes.guest){
            return saveGuestCheckpoint(checkpointData);
        }

        const endpoint = createEndpoint(reference);
        const payload = {
            player_id: reference.playerId,
            slot: reference.slot,
            current_act: checkpointData.currentAct,
            current_room: checkpointData.currentRoom,
            checkpoint: checkpointData.checkpoint,
            position: checkpointData.position,
            extra_data: checkpointData.extraData
        };

        const response = await global.fetch(endpoint, {
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

    global.PIXFEW_SAVE = Object.freeze({
        getMode,
        getSaveReference,
        provideAuthenticatedIdentity,
        loadSave,
        saveCheckpoint,
        getLoadedSave
    });
})(window);
