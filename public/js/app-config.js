(function(global){
    "use strict";

    const environments = Object.freeze({
        local: Object.freeze({
            apiBaseUrl: "http://localhost/pixfew/backend/api"
        }),
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

    const environment = detectEnvironment(global.location.hostname);
    const apiBaseUrl = environment === "production"
        ? global.location.origin + "/backend/api"
        : environments[environment].apiBaseUrl;

    global.PIXFEW_CONFIG = Object.freeze({
        environment,
        apiBaseUrl,
        save: Object.freeze({
            // Modos oficiais: "account" usa persistência online; "guest" é temporário.
            mode: "account",
            developmentAccount: Object.freeze({
                playerId: 1,
                slot: 1
            })
        })
    });
})(window);
