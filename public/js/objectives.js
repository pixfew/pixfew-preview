var playerHasMemoryFragment = false;
var memoryFragmentDelivered = false;
var memoryFragmentFollowX = memoryFragment.x;
var memoryFragmentFollowY = memoryFragment.y;
var memoryFragmentOrbitAngle = 0;

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
        memoryFragmentElement.style.display = "none";
        return;
    }

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

//entrega o fragmento no pedestal e libera a passagem que depende da memoria
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

    if(!checkColision(playerBox, memoryPedestal)){
        return;
    }

    playerHasMemoryFragment = false;
    memoryFragmentDelivered = true;

    if(memoryFragmentElement){
        memoryFragmentElement.classList.remove("following");
        memoryFragmentElement.style.display = "none";
    }

    if(memoryUnlockedPopupElement){
        memoryUnlockedPopupElement.style.display = "block";

        setTimeout(function(){
            memoryUnlockedPopupElement.style.display = "none";
        }, 2000);
    }
}

//faz o fragmento orbitar o player enquanto ele esta sendo carregado
function updateMemoryFragmentFollower(deltaTime){
    if(!memoryFragmentElement){
        return;
    }

    if(memoryFragmentDelivered){
        memoryFragmentElement.classList.remove("following");
        memoryFragmentElement.style.display = "none";
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
