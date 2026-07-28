var playerHasMemoryFragment = false;
var memoryFragmentDelivered = false;
var memoryFragmentFollowX = memoryFragment.x;
var memoryFragmentFollowY = memoryFragment.y;
var memoryFragmentOrbitAngle = 0;
var memoryCheckpointSavePending = false;
var memoryPedestalContactLocked = false;

const memoryPedestalCheckpoint = Object.freeze({
    name: "pedestal_fragmento",
    respawn: Object.freeze({
        x: 700,
        y: 830
    })
});

//objetivo principal atual: coletar o fragmento na sala 6 e entregar no pedestal da sala 2
const memoryPedestal = {
    x: (gameWidth / 2) - 40,
    y: gameHeight - 120,
    width: 80,
    height: 80
};

//controla se o fragmento deve aparecer no mapa, seguir o player ou sumir apos entrega
function updateMemoryFragmentVisibility(){
    if(!memoryFragmentElement){
        return;
    }

    if(memoryFragmentDelivered){
        memoryFragmentElement.classList.remove("following");
        memoryFragmentElement.classList.add("on-pedestal");
        memoryFragmentElement.style.left =
            memoryPedestal.x + ((memoryPedestal.width - memoryFragment.width) / 2) + "px";
        memoryFragmentElement.style.top = memoryPedestal.y + 8 + "px";
        memoryFragmentElement.style.display = currentRoom === 2 ? "block" : "none";
        return;
    }

    memoryFragmentElement.classList.remove("on-pedestal");

    if(playerHasMemoryFragment){
        memoryFragmentElement.classList.add("following");
        memoryFragmentElement.style.display = "block";
    }
}

//coleta o fragmento e dispara o popup de feedback
function collectMemoryFragment(){
    if(playerHasMemoryFragment || memoryFragmentDelivered){
        return;
    }

    playerHasMemoryFragment = true;
    memoryFragmentFollowX = memoryFragment.x;
    memoryFragmentFollowY = memoryFragment.y;
    memoryFragmentOrbitAngle = 0;

    if(memoryFragmentElement){
        memoryFragmentElement.classList.remove("on-pedestal");
        memoryFragmentElement.classList.add("following");
        memoryFragmentElement.style.display = "block";
    }

    if(memoryPopupElement){
        memoryPopupElement.style.display = "block";
        memoryPopupElement.style.animation = "none";

        setTimeout(function(){

            memoryPopupElement.style.animation =
                "popupMemory 2s forwards";

        }, 10);

        setTimeout(function(){

            memoryPopupElement.style.display = "none";

        }, 2000);
    }
}

function confirmMemoryPedestalDelivery(){
    playerHasMemoryFragment = false;
    memoryFragmentDelivered = true;
    memoryCheckpointSavePending = false;

    updateMemoryFragmentVisibility();

    if(currentRoom === 4){
        loadRoom();
    }

    if(memoryUnlockedPopupElement){
        memoryUnlockedPopupElement.style.display = "block";

        setTimeout(function(){
            memoryUnlockedPopupElement.style.display = "none";
        }, 2000);
    }
}

function restoreMemoryCheckpoint(saveData){
    if(!saveData || !saveData.save || saveData.save.checkpoint !== memoryPedestalCheckpoint.name){
        return;
    }

    playerHasMemoryFragment = false;
    memoryFragmentDelivered = true;
    memoryCheckpointSavePending = false;
    memoryPedestalContactLocked = true;
}

//entrega o fragmento apenas depois que a API confirma o checkpoint
function checkMemoryPedestalDelivery(playerBox){
    if(memoryFragmentDelivered){
        return;
    }

    if(!playerHasMemoryFragment){
        return;
    }

    if(currentRoom !== 2){
        return;
    }

    if(!memoryPedestalElement){
        return;
    }

    const touchingPedestal = checkColision(playerBox, memoryPedestal);

    if(!touchingPedestal){
        memoryPedestalContactLocked = false;
        return;
    }

    if(memoryCheckpointSavePending || memoryPedestalContactLocked){
        return;
    }

    memoryCheckpointSavePending = true;
    memoryPedestalContactLocked = true;

    const loadedSave = PIXFEW_SAVE.getLoadedSave();
    const currentAct = loadedSave && loadedSave.save
        ? loadedSave.save.current_act
        : 1;

    PIXFEW_SAVE.saveCheckpoint({
        currentAct,
        currentRoom: String(currentRoom),
        checkpoint: memoryPedestalCheckpoint.name,
        position: memoryPedestalCheckpoint.respawn,
        extraData: {
            fragment_placed: true
        }
    }).then(function(){
        confirmMemoryPedestalDelivery();
    }).catch(function(error){
        memoryCheckpointSavePending = false;
        console.error("Não foi possível confirmar o checkpoint do pedestal.", error);
    });
}

//faz o fragmento orbitar o player enquanto ele esta sendo carregado
function updateMemoryFragmentFollower(deltaTime){
    if(!memoryFragmentElement){
        return;
    }

    if(memoryFragmentDelivered){
        memoryFragmentElement.classList.remove("following");
        updateMemoryFragmentVisibility();
        return;
    }

    if(!playerHasMemoryFragment){
        return;
    }

    memoryFragmentOrbitAngle += 0.04 * deltaTime;

    const orbitRadius = 34;
    const targetX = x + (hitbox.width / 2) - 12.5 + Math.cos(memoryFragmentOrbitAngle) * orbitRadius;
    const targetY = y + (hitbox.height / 2) - 12.5 + Math.sin(memoryFragmentOrbitAngle) * orbitRadius;
    const followSpeed = Math.min(0.12 * deltaTime, 1);

    memoryFragmentFollowX += (targetX - memoryFragmentFollowX) * followSpeed;
    memoryFragmentFollowY += (targetY - memoryFragmentFollowY) * followSpeed;

    memoryFragmentElement.classList.add("following");
    memoryFragmentElement.style.display = "block";
    memoryFragmentElement.style.left = memoryFragmentFollowX + "px";
    memoryFragmentElement.style.top = memoryFragmentFollowY + "px";
}
