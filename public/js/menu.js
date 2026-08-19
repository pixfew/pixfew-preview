(function(global){
    "use strict";

    const entryOptions = document.getElementById("entry-options");
    const adminLogin = document.getElementById("admin-login");
    const adminLoginForm = document.getElementById("admin-login-form");
    const adminPassword = document.getElementById("admin-password");
    const adminLoginMessage = document.getElementById("admin-login-message");
    const mainMenu = document.getElementById("main-menu");
    const selectedMode = global.PIXFEW_CONFIG.save.mode;
    const adminEndpoint = new URL(
        global.PIXFEW_CONFIG.apiBaseUrl.replace(/\/$/, "") + "/development-admin.php"
    );

    function selectModeAndOpenMenu(mode){
        global.PIXFEW_MODE_SELECTION.select(mode);
        global.location.assign("menu.html");
    }

    function openEntry(){
        global.PIXFEW_MODE_SELECTION.clear();
        global.location.replace("index.html");
    }

    async function requestAdminSession(method, password){
        const options = {
            method,
            headers: {
                Accept: "application/json"
            }
        };

        if(password !== undefined){
            options.headers["Content-Type"] = "application/json";
            options.body = JSON.stringify({ password });
        }

        const response = await global.fetch(adminEndpoint, options);
        const payload = await response.json().catch(function(){
            return null;
        });

        return { response, payload };
    }

    function initializeEntry(){
        global.PIXFEW_MODE_SELECTION.clear();

        document.getElementById("play-guest").addEventListener("click", function(){
            selectModeAndOpenMenu("guest");
        });

        document.getElementById("create-account").addEventListener("click", function(){
            document.getElementById("entry-message").textContent = "Em breve";
        });

        document.getElementById("show-admin-login").addEventListener("click", async function(){
            document.getElementById("entry-message").textContent = "";
            adminLoginMessage.textContent = "";

            try{
                const result = await requestAdminSession("GET");

                if(result.response.ok && result.payload && result.payload.authorized === true){
                    selectModeAndOpenMenu("account");
                    return;
                }
            }catch(error){
                console.error("Não foi possível verificar a sessão administrativa.", error);
            }

            entryOptions.hidden = true;
            adminLogin.hidden = false;
            adminPassword.focus();
        });

        document.getElementById("cancel-admin-login").addEventListener("click", function(){
            adminLoginForm.reset();
            adminLoginMessage.textContent = "";
            adminLogin.hidden = true;
            entryOptions.hidden = false;
        });

        adminLoginForm.addEventListener("submit", async function(event){
            event.preventDefault();
            adminLoginMessage.textContent = "";

            try{
                const result = await requestAdminSession("POST", adminPassword.value);

                adminPassword.value = "";

                if(result.response.ok && result.payload && result.payload.authorized === true){
                    selectModeAndOpenMenu("account");
                    return;
                }

                if(result.response.status === 401){
                    adminLoginMessage.textContent = "Senha incorreta.";
                    adminPassword.focus();
                    return;
                }

                adminLoginMessage.textContent = "Não foi possível entrar agora.";
            }catch(error){
                adminPassword.value = "";
                adminLoginMessage.textContent = "Não foi possível entrar agora.";
                console.error("Falha ao autenticar o administrador.", error);
            }
        });
    }

    async function initializeMainMenu(){
        if(selectedMode !== "account" && selectedMode !== "guest"){
            openEntry();
            return;
        }

        if(selectedMode === "account"){
            try{
                const result = await requestAdminSession("GET");

                if(!result.response.ok || !result.payload || result.payload.authorized !== true){
                    openEntry();
                    return;
                }
            }catch(error){
                console.error("Não foi possível verificar a sessão administrativa.", error);
                openEntry();
                return;
            }

            document.getElementById("account-details").hidden = false;
        }

        mainMenu.hidden = false;

        document.getElementById("start-game").addEventListener("click", function(){
            global.location.assign("game.html");
        });

        document.getElementById("exit-game").addEventListener("click", async function(){
            if(selectedMode === "account"){
                try{
                    await requestAdminSession("DELETE");
                }catch(error){
                    console.error("Não foi possível encerrar a sessão administrativa.", error);
                }
            }

            openEntry();
        });
    }

    if(entryOptions){
        initializeEntry();
    }else if(mainMenu){
        initializeMainMenu();
    }
})(window);
