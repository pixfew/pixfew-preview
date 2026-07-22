//dados basicos de cada sala: ponto padrao de spawn e quais elementos pertencem a ela
const rooms = {
    1: {
        spawnX: 80,
        spawnY: gameHeight - 100,
        showDoor: true,
        showBlock: false
    },

    2: {
        spawnX: 80,
        spawnY: gameHeight - 100,
        showDoor: false,
        elements: [
            memoryPedestalElement,
            room2WallTopElement,
            room2WallBottomElement,
            room2WallRightElement
        ]
    },

    3: {
        spawnX: 80,
        spawnY: gameHeight - 100,
        showDoor: false,
        showBlock: false,
        elements: [
            platform1Element,
            platform2Element,
            platform3Element,
            platform4Element,
            platform5Element,
            area3LeftElement,
            document.getElementById("area3-wall-left-bottom"),
            area3RightElement,
            document.getElementById("area3-wall-right-middle"),
            document.getElementById("area3-wall-right-bottom")
        ]
    },

    4: {
        spawnX: 80,
        spawnY: gameHeight - 100,
        showDoor: false,
        showBlock: false,
        elements: [
            windZoneElement,
            fallingPlatformElement,
            area4LeftElement,
            area4RightElement,
            area4RightWallClosedElement,
            area4RightWallTopElement,
            area4RightWallBottomElement
        ]
    },

    5: {
        spawnX: 80,
        spawnY: gameHeight - 100,
        showDoor: false,
        showBlock: false,
            elements: [
            floorLeftElement,
            floorRightElement,
            area5LeftElement,
            area5LeftBottomElement,
            area5RightElement
        ]
    },

    6: {
        spawnX: (gameWidth / 2) - 10,
        spawnY: 120,
        showDoor: false,
        showBlock: false,
        elements: [
            memoryFragmentElement,
            area6WallLeftElement,
            area6WallRightElement,
            area6CeilingLeftElement,
            area6CeilingRightElement,
            area6Platform1Element,
            area6Platform2Element,
            area6Platform3Element,
            area6Platform4Element
        ]
    },

    7: {
        spawnX: 80,
        spawnY: gameHeight - 100,
        showDoor: false,
        showBlock: false,
        elements: [
            area7CeilingElement,
            area7WallLeftTopElement,
            area7WallLeftBottomElement,
            area7WallRightElement,
            area7SecretMarkElement
        ]
    },

    8: {
        spawnX: 50,
        spawnY: gameHeight - 240,
        showDoor: false,
        showBlock: false,
        elements: [
            area8CeilingLeftElement,
            area8CeilingRightElement,
            area8WallLeftElement,
            area8WallRightTopElement,
            area8WallRightBottomElement,
            area8DamageFloorElement,
            area8Platform1Element,
            area8Platform2Element,
            area8Platform3Element,
            area8Platform4Element,
            area8Platform5Element
        ]
    },

    9: {
        spawnX: (gameWidth / 2) - 10,
        spawnY: gameHeight - 100,
        showDoor: false,
        showBlock: false,
        elements: [
            area9CeilingElement,
            area9WallLeftElement,
            area9WallRightElement,
            area9FloorLeftElement,
            area9FloorRightElement
        ]
    },

    10: {
        spawnX: 80,
        spawnY: gameHeight - 100,
        showDoor: false,
        showBlock: false,
        elements: [
            area10CeilingElement,
            area10WallLeftTopElement,
            area10WallLeftBottomElement,
            area10WallRightElement
        ]
    }
};

//spawns laterais padronizados: o player aparece dentro da abertura pela qual entrou
function spawnFromLeftOpening(opening){
    x = 10;
    y = opening.y + opening.height - hitbox.height;
    velocityY = 0;
    isGrounded = true;
}

function spawnFromRightOpening(opening){
    x = gameWidth - hitbox.width - 10;
    y = opening.y + opening.height - hitbox.height;
    velocityY = 0;
    isGrounded = true;
}

function createArea3RightOpening(start, height){
    return {
        y: gameHeight * start,
        height: gameHeight * height
    };
}

//carrega a sala atual, resolve spawns especiais e troca os elementos visiveis do mapa
function loadRoom(){

    showRoomTransition();

    const room = rooms[currentRoom];

    if(currentRoom === 3){
        updateArea3RightWalls();
    }

    //spawns especiais sobrescrevem o spawn padrao para dar continuidade entre salas
    if(currentRoom === 1 && nextSpawn === "door"){

        x = (gameWidth / 2) - 10;
        y = gameHeight - 40 - hitbox.height;

        nextSpawn = "default";

    }else if(currentRoom === 1 && nextSpawn === "fromRight"){

        spawnFromRightOpening(exitArea);

        nextSpawn = "default";

    }else if(currentRoom === 2 && nextSpawn === "fromLeft"){

        spawnFromLeftOpening(leftExitArea);

        nextSpawn = "default";

    }else if(currentRoom === 3 && nextSpawn === "fromLeft"){

        spawnFromLeftOpening(area3LeftExitArea);

        nextSpawn = "default";

    }else if(currentRoom === 3 && nextSpawn === "fromRightTop"){

        spawnFromRightOpening(createArea3RightOpening(
            area3RightWallConfig.topOpeningStart,
            area3RightWallConfig.topOpeningHeight
        ));

        nextSpawn = "default";

    }else if(currentRoom === 3 && nextSpawn === "fromRightBottom"){

        spawnFromRightOpening(createArea3RightOpening(
            area3RightWallConfig.bottomOpeningStart,
            area3RightWallConfig.bottomOpeningHeight
        ));

        nextSpawn = "default";

    }else if(currentRoom === 3 && spawnFromRight){

        spawnFromRightOpening(area3RightTopExitArea);

        spawnFromRight = false;

    }else if(currentRoom === 4 && nextSpawn === "fromLeft"){

        spawnFromLeftOpening(area4LeftExitArea);

        nextSpawn = "default";

    }else if(currentRoom === 4 && nextSpawn === "fromRight"){

        spawnFromRightOpening(area4RightExitArea);

        nextSpawn = "default";

    }else if(currentRoom === 4 && spawnFromRight){

        spawnFromRightOpening(area4RightExitArea);

        spawnFromRight = false;

    }else if(currentRoom === 5 && nextSpawn === "fromLeft"){

        spawnFromLeftOpening(area5LeftExitArea);

        nextSpawn = "default";

    }else if(currentRoom === 6 && nextSpawn === "fromTop"){

        x = area6TopExitArea.x + (area6TopExitArea.width - hitbox.width) / 2;
        y = area6TopExitArea.y + area6TopExitArea.height - hitbox.height;
        velocityY = 0;
        isGrounded = true;

        nextSpawn = "default";

    }else if(currentRoom === 7 && nextSpawn === "fromLeft"){

        spawnFromLeftOpening(area7LeftExitArea);

        nextSpawn = "default";

    }else if(currentRoom === 7 && nextSpawn === "fromArea8"){

        spawnFromRightOpening(area7BreakableWallCrack);

        nextSpawn = "default";

    }
    else if(currentRoom === 5 && nextSpawn === "fromHole"){

        x = downExitArea.x + (downExitArea.width - hitbox.width) / 2;
        emergeSafeX = downExitArea.x - hitbox.width + 4;
        emergeTargetY = floor.y - hitbox.height;
        y = emergeTargetY + 96;
        emergeStartX = x;
        emergeStartY = y;
        emergePeakY = emergeTargetY - 72;
        emergeProgress = 0;

        velocityY = 0;
        isGrounded = false;
        isEmergingFromHole = true;

        nextSpawn = "default";
    }else if(currentRoom === 8 && nextSpawn === "fromLeft"){

        spawnFromLeftOpening(area8LeftExitArea);

        nextSpawn = "default";
    }else if(currentRoom === 8 && nextSpawn === "fromTop"){

        x = area8TopExitArea.x + (area8TopExitArea.width - hitbox.width) / 2;
        y = area8TopExitArea.height;
        velocityY = 0;
        isGrounded = false;

        nextSpawn = "default";
    }else if(currentRoom === 8 && nextSpawn === "fromRight"){

        spawnFromRightOpening(area8RightExitArea);

        nextSpawn = "default";
    }else if(currentRoom === 9 && nextSpawn === "fromBottom"){

        x = area9BottomExitArea.x + (area9BottomExitArea.width - hitbox.width) / 2;
        emergeSafeX = area9BottomExitArea.x - hitbox.width + 4;
        emergeTargetY = area9Floor[0].y - hitbox.height;
        y = emergeTargetY + 96;
        emergeStartX = x;
        emergeStartY = y;
        emergePeakY = emergeTargetY - 72;
        emergeProgress = 0;

        velocityY = 0;
        isGrounded = false;
        isEmergingFromHole = true;

        nextSpawn = "default";
    }else if(currentRoom === 10 && nextSpawn === "fromLeft"){

        spawnFromLeftOpening(area10LeftExitArea);

        nextSpawn = "default";
    }else{

        x = room.spawnX;
        y = room.spawnY;
    }

    if(currentRoom === 8 && typeof setSafeCheckpoint === "function"){
        setSafeCheckpoint(x, y);
    }

    //elementos comuns que dependem da sala atual
    if(doorElement){
        doorElement.style.display =
            room.showDoor ? "block" : "none";
    }

    if(floorElement){
        floorElement.style.display =
            currentRoom === 5 || currentRoom === 8 || currentRoom === 9 ? "none" : "block";
    }

    if(area2BlockElement){
        area2BlockElement.style.display =
            room.showBlock ? "block" : "none";
    }

    if(!room.showDoor && popup){
        popup.style.display = "none";
    }

    if(room2WallTopElement){
        room2WallTopElement.style.display =
            currentRoom === 2 ? "block" : "none";
    }

    if(room2WallBottomElement){
        room2WallBottomElement.style.display =
            currentRoom === 2 ? "block" : "none";
    }

    if(room2WallRightElement){
        room2WallRightElement.style.display =
            currentRoom === 2 ? "block" : "none";
    }

    if(wallLeftElement){
        wallLeftElement.style.display =
            currentRoom === 1 ? "block" : "none";
    }

    //desliga tudo antes de ligar apenas os elementos da sala carregada
    Object.values(rooms).forEach(function(roomData){
        if(roomData.elements){
            roomData.elements.forEach(function(element){
                if(element){
                    element.style.display = "none";
                }
            });
        }
    });

    if(room.elements){
        room.elements.forEach(function(element){
            if(element){
                element.style.display = "block";
            }
        });
    }

    //a parede direita da sala 4 abre quando o fragmento de memoria e entregue
    if(currentRoom === 4){
        if(area4RightWallClosedElement){
            area4RightWallClosedElement.style.display =
                memoryFragmentDelivered ? "none" : "block";
        }

        if(area4RightWallTopElement){
            area4RightWallTopElement.style.display =
                memoryFragmentDelivered ? "block" : "none";
        }

        if(area4RightWallBottomElement){
            area4RightWallBottomElement.style.display =
                memoryFragmentDelivered ? "block" : "none";
        }
    }

    if(memoryPopupElement){
        memoryPopupElement.style.display = "none";
    }

    //reinicia a plataforma que cai sempre que a sala 4 e recarregada
    if(currentRoom === 4 && fallingPlatformElement){
        fallingPlatformY = 420;
        fallingPlatform.y = fallingPlatformY;
        fallingPlatformFalling = false;
        fallingPlatformTimerStarted = false;

        fallingPlatformElement.style.top = fallingPlatformY + "px";
        fallingPlatformElement.style.display = "block";
    }

    updateMemoryFragmentVisibility();
}
