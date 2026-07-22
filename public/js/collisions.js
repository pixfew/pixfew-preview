const roomBounds = {
    left: 0,
    top: 0,
    right: gameWidth,
    bottom: gameHeight
};

//geometria logica das salas: essas caixas sao usadas para colisao, nao para desenhar
const walls = [
    {
        x: 0,
        y: 0,
        width: 40,
        height: gameHeight
    },
    {
        x: gameWidth - 40,
        y: 0,
        width: 40,
        height: 250
    },
    {
        x: gameWidth - 40,
        y: gameHeight - 250,
        width: 40,
        height: 250
    }
];

//hitbox das paredes da área 2
const area2Walls = [
    {
        x: 0,
        y: 0,
        width: 40,
        height: 250
    },
    {
        x: 0,
        y: gameHeight - 250,
        width: 40,
        height: 250
    }
];

//hitbox das paredes da área 3
const area3Walls = [
    {
        x: 0,
        y: 0,
        width: 40,
        height: 250
    },
    {
        x: 0,
        y: gameHeight - 250,
        width: 40,
        height: 250
    }
];

//PAREDES DIREITAS DA SALA 3
const area3RightWallConfig = {
    width: 40,

    topOpeningStart: 0.32,
    topOpeningHeight: 0.15,

    bottomOpeningStart: 0.58,
    bottomOpeningHeight: 0.15
};

//hitbox das paredes da direita da área 3
let area3RightWalls = [];

function updateArea3RightWalls(){

    const width = area3RightWallConfig.width;

    const topWall = {
        x: gameWidth - width,
        y: 0,
        width: width,
        height: gameHeight * area3RightWallConfig.topOpeningStart
    };

    const middleWall = {
        x: gameWidth - width,
        y: gameHeight * (
            area3RightWallConfig.topOpeningStart +
            area3RightWallConfig.topOpeningHeight
        ),
        width: width,
        height: gameHeight * (
            area3RightWallConfig.bottomOpeningStart -
            area3RightWallConfig.topOpeningStart -
            area3RightWallConfig.topOpeningHeight
        )
    };

    const bottomWall = {
        x: gameWidth - width,
        y: gameHeight * (
            area3RightWallConfig.bottomOpeningStart +
            area3RightWallConfig.bottomOpeningHeight
        ),
        width: width,
        height: gameHeight * (
            1 -
            area3RightWallConfig.bottomOpeningStart -
            area3RightWallConfig.bottomOpeningHeight
        )
    };

    area3RightWalls = [topWall, middleWall, bottomWall];

    const topElement = document.getElementById("area3-wall-right-top");
    const middleElement = document.getElementById("area3-wall-right-middle");
    const bottomElement = document.getElementById("area3-wall-right-bottom");

    topElement.style.height = (topWall.height) + "px";

    middleElement.style.top = (middleWall.y) + "px";
    middleElement.style.height = (middleWall.height) + "px";

    bottomElement.style.top = (bottomWall.y) + "px";
    bottomElement.style.bottom = "auto";
    bottomElement.style.height = (bottomWall.height) + "px";
}
updateArea3RightWalls();

const area4Walls = [
    {
        x: 0,
        y: 0,
        width: 40,
        height: 250
    },
    {
        x: 0,
        y: gameHeight - 250,
        width: 40,
        height: 250
    }
];

const area4RightWallClosed = {
    x: gameWidth - 40,
    y: 0,
    width: 40,
    height: gameHeight
};

const area4RightOpenWalls = [
    {
        x: gameWidth - 40,
        y: 0,
        width: 40,
        height: 250
    },
    {
        x: gameWidth - 40,
        y: gameHeight - 250,
        width: 40,
        height: 250
    }
];

const area5Walls = [
    {
        x: 0,
        y: 0,
        width: 40,
        height: 250
    },
    {
        x: 0,
        y: gameHeight - 250,
        width: 40,
        height: 250
    }
];

const area6Walls = [
    {
        x: 0,
        y: 0,
        width: 40,
        height: gameHeight
    },
    {
        x: gameWidth - 40,
        y: 0,
        width: 40,
        height: gameHeight
    }
];

//areas de saida definem onde o player precisa tocar para trocar de sala
const area4LeftExitArea = {
    x: 0,
    y: 250,
    width: 40,
    height: gameHeight - 500
};

const area4RightExitArea = {
    x: gameWidth - 40,
    y: 250,
    width: 40,
    height: gameHeight - 500
};

const area7LeftExitArea = {
    x: 0,
    y: 250,
    width: 40,
    height: gameHeight - 500
};

const area5RightWall = {
    x: gameWidth - 40,
    y: 0,
    width: 40,
    height: gameHeight
};

const area7Walls = [
    {
        x: 0,
        y: 0,
        width: 40,
        height: 250
    },
    {
        x: 0,
        y: gameHeight - 250,
        width: 40,
        height: 250
    }
];

const area7RightWallClosed = {
    x: gameWidth - 40,
    y: 0,
    width: 40,
    height: gameHeight
};

const area7BreakableWallCrack = {
    x: gameWidth - 40,
    y: gameHeight - 135,
    width: 40,
    height: 95
};

const area7RightOpenWalls = [
    {
        x: gameWidth - 40,
        y: 0,
        width: 40,
        height: area7BreakableWallCrack.y
    },
    {
        x: gameWidth - 40,
        y: area7BreakableWallCrack.y + area7BreakableWallCrack.height,
        width: 40,
        height: gameHeight - area7BreakableWallCrack.y - area7BreakableWallCrack.height
    }
];

let area7BreakableWallHits = 0;
const area7BreakableWallMaxHits = 4;
let area7BreakableWallOpen = false;
let area7BreakableWallTouching = false;

const area7Ceiling = {
    x: 0,
    y: 0,
    width: gameWidth,
    height: 40
};

const area8Ceiling = [
    {
        x: 0,
        y: 0,
        width: gameWidth * 0.42,
        height: 40
    },
    {
        x: gameWidth * 0.58,
        y: 0,
        width: gameWidth * 0.42,
        height: 40
    }
];

const area8Walls = [
    {
        x: 0,
        y: 0,
        width: 40,
        height: 620
    },
    {
        x: 0,
        y: 760,
        width: 120,
        height: gameHeight - 760
    },
    {
        x: gameWidth - 40,
        y: 0,
        width: 40,
        height: 260
    },
    {
        x: gameWidth - 40,
        y: gameHeight - 300,
        width: 40,
        height: 300
    }
];

const area8DamageFloor = {
    x: 0,
    y: gameHeight - 120,
    width: gameWidth,
    height: 120
};

const area8LeftExitArea = {
    x: 0,
    y: 620,
    width: 40,
    height: 140
};

const area8Platforms = [
    {
        element: area8Platform1Element,
        x: 260,
        y: 650,
        width: 150,
        height: 24
    },
    {
        element: area8Platform2Element,
        x: 650,
        y: 520,
        width: 140,
        height: 24
    },
    {
        element: area8Platform3Element,
        x: 260,
        y: 370,
        width: 150,
        height: 24
    },
    {
        element: area8Platform4Element,
        x: 740,
        y: 235,
        width: 140,
        height: 24
    },
    {
        element: area8Platform5Element,
        x: 1190,
        y: 390,
        width: 170,
        height: 24
    }
];

const area8TopExitArea = {
    x: gameWidth * 0.42,
    y: 0,
    width: gameWidth * 0.16,
    height: 40
};

const area8RightExitArea = {
    x: gameWidth - 40,
    y: 260,
    width: 40,
    height: 340
};

const area9Walls = [
    { x: 0, y: 0, width: 40, height: gameHeight },
    { x: gameWidth - 40, y: 0, width: 40, height: gameHeight },
    { x: 0, y: 0, width: gameWidth, height: 40 }
];

const area9Floor = [
    { x: 0, y: gameHeight - 40, width: gameWidth * 0.42, height: 40 },
    { x: gameWidth * 0.58, y: gameHeight - 40, width: gameWidth * 0.42, height: 40 }
];

const area9BottomExitArea = {
    x: gameWidth * 0.42,
    y: gameHeight - 40,
    width: gameWidth * 0.16,
    height: 40
};

const area10Walls = [
    { x: 0, y: 0, width: 40, height: 260 },
    { x: 0, y: 600, width: 40, height: gameHeight - 600 },
    { x: gameWidth - 40, y: 0, width: 40, height: gameHeight },
    { x: 0, y: 0, width: gameWidth, height: 40 }
];

const area10LeftExitArea = {
    x: 0,
    y: 260,
    width: 40,
    height: 340
};

//estado e visual da parede quebravel da sala 7, acionada por dash
function updateArea7BreakableWallVisual(){
    if(area7SecretMarkElement){
        area7SecretMarkElement.dataset.damage = area7BreakableWallHits;
    }

    if(area7WallRightElement){
        area7WallRightElement.dataset.open = area7BreakableWallOpen ? "true" : "false";
    }
}

function checkArea7BreakableWallHit(playerBox){
    if(currentRoom !== 7 || area7BreakableWallOpen){
        return;
    }

    const touchingCrack = checkColision(playerBox, area7BreakableWallCrack);

    if(!touchingCrack){
        area7BreakableWallTouching = false;
        return;
    }

    if(!isDashing || area7BreakableWallTouching){
        return;
    }

    area7BreakableWallTouching = true;
    area7BreakableWallHits++;

    if(area7BreakableWallHits >= area7BreakableWallMaxHits){
        area7BreakableWallHits = area7BreakableWallMaxHits;
        area7BreakableWallOpen = true;
    }

    updateArea7BreakableWallVisual();
}

//plataformas area 6
const area6Platforms = [
    {
        element: area6Platform1Element,
        x: gameWidth * 0.15,
        y: gameHeight * 0.75,
        width: gameWidth * 0.12,
        height: gameHeight * 0.025
    },
    {
        element: area6Platform2Element,
        x: gameWidth * 0.35,
        y: gameHeight * 0.60,
        width: gameWidth * 0.12,
        height: gameHeight * 0.025
    },
    {
        element: area6Platform3Element,
        x: gameWidth * 0.55,
        y: gameHeight * 0.45,
        width: gameWidth * 0.12,
        height: gameHeight * 0.025
    },
    {
        element: area6Platform4Element,
        x: gameWidth * 0.43,
        y: gameHeight * 0.25,
        width: gameWidth * 0.12,
        height: gameHeight * 0.025
    }
];

//teto sala 6
const area6Ceiling = [
    {
        x: 0,
        y: 0,
        width: gameWidth * 0.45,
        height: 40
    },
    {
        x: gameWidth * 0.55,
        y: 0,
        width: gameWidth * 0.45,
        height: 40
    }
];

const area6TopExitArea = {
    x: gameWidth * 0.45,
    y: 0,
    width: gameWidth * 0.10,
    height: 40
};

//hitbox plataformas suspensas
const platforms = [
    {
        element: platform1Element,
        x: 280,
        y: 650,
        width: 170,
        height: 24
    },
    {
        element: platform2Element,
        x: 580,
        y: 510,
        width: 150,
        height: 24
    },
    {
        element: platform3Element,
        x: 850,
        y: 375,
        width: 140,
        height: 24
    },
    {
        element: platform4Element,
        x: 1260,
        y: 520,
        width: 170,
        height: 24
    },
    {
        element: platform5Element,
        x: 1260,
        y: 295,
        width: 170,
        height: 24
    }
];

const fallingPlatform = {
    x: 350,
    y: fallingPlatformY,
    width: 160,
    height: 25
};

//hitbox da porta
const door = {
    width: 60,
    height: 90,
    x: (gameWidth / 2) - 30,
    y: gameHeight - 40 - 90
};

//saída lateral direita da primeira área
const exitArea = {
    x: gameWidth - 40,
    y: 250,
    width: 40,
    height: gameHeight - 500
};

//saída lateral esquerda da área 2
const leftExitArea = {
    x: 0,
    y: 250,
    width: 40,
    height: gameHeight - 500
};

//saída lateral esquerda da área 3
const area3LeftExitArea = {
    x: 0,
    y: 250,
    width: 40,
    height: gameHeight - 500
};

//saída direita superior da área 3
const area3RightTopExitArea = {
    x: gameWidth - 40,
    y: 160,
    width: 40,
    height: 140
};

//saída direita inferior da área 3
const area3RightBottomExitArea = {
    x: gameWidth - 40,
    y: 480,
    width: 40,
    height: gameHeight - 600
};

const area5LeftExitArea = {
    x: 0,
    y: 250,
    width: 40,
    height: gameHeight - 500
};

//saída para baixo da área 5
const downExitArea = {
    x: gameWidth * 0.45,
    y: gameHeight,
    width: gameWidth * 0.10,
    height: 80
};

//hitbox do chão
const floor = {
    x: 0,
    y: gameHeight - 40,
    width: gameWidth,
    height: 40
};

const floorLeft = {
    x: 0,
    y: gameHeight - 40,
    width: gameWidth * 0.45,
    height: 40
};

const floorRight = {
    x: gameWidth * 0.55,
    y: gameHeight - 40,
    width: gameWidth * 0.45,
    height: 40
};

const memoryFragment = {
    x: 600,
    y: 500,
    width: 25,
    height: 25
};

const windZone = {
    x: gameWidth - 270,
    y: gameHeight - 300,
    width: 90,
    height: 260
};

//mapa central de colisao: cada sala declara quais caixas estao ativas naquele momento
const collisionConfig = {
    1: [
        { boxes: walls, requiredElement: wallLeftElement },
        { boxes: [floor], requiredElement: floorElement, active: () => currentRoom !== 5 },
        { boxes: [floorLeft], requiredElement: floorLeftElement },
        { boxes: [floorRight], requiredElement: floorRightElement }
    ],
    2: [
        { boxes: area2Walls },
        { boxes: [floor], requiredElement: floorElement },
        { custom: playerBox => playerBox.x + playerBox.width > gameWidth - 40 }
    ],
    3: [
        { boxes: area3Walls, requiredElement: area3LeftElement },
        { boxes: area3RightWalls, requiredElement: area3RightElement },
        { boxes: [floor], requiredElement: floorElement, active: () => currentRoom !== 5 },
        { boxes: [floorLeft], requiredElement: floorLeftElement },
        { boxes: [floorRight], requiredElement: floorRightElement },
        { boxes: platforms, requiredElement: platform1Element }
    ],
    4: [
        { boxes: area4Walls, requiredElement: area4LeftElement },
        { boxes: [area4RightWallClosed], requiredElement: area4RightWallClosedElement, active: () => !memoryFragmentDelivered },
        { boxes: area4RightOpenWalls, requiredElement: area4RightWallTopElement, active: () => memoryFragmentDelivered },
        { boxes: [floor], requiredElement: floorElement, active: () => currentRoom !== 5 },
        { boxes: [floorLeft], requiredElement: floorLeftElement },
        { boxes: [floorRight], requiredElement: floorRightElement },
        { boxes: [fallingPlatform], requiredElement: fallingPlatformElement }
    ],
    5: [
        { boxes: area5Walls, requiredElement: area5LeftElement },
        { boxes: [area5RightWall], requiredElement: area5RightElement },
        { boxes: [floorLeft], requiredElement: floorLeftElement },
        { boxes: [floorRight], requiredElement: floorRightElement }
    ],
    6: [
        { boxes: area6Walls },
        { boxes: area6Ceiling, requiredElement: area6CeilingLeftElement },
        { boxes: [floor], requiredElement: floorElement, active: () => currentRoom !== 5 },
        { boxes: area6Platforms, requiredElement: area6Platform1Element }
    ],
    7: [
        { boxes: area7Walls, requiredElement: area7WallLeftTopElement },
        { boxes: [area7RightWallClosed], requiredElement: area7WallRightElement, active: () => !area7BreakableWallOpen },
        { boxes: area7RightOpenWalls, requiredElement: area7WallRightElement, active: () => area7BreakableWallOpen },
        { boxes: [area7Ceiling], requiredElement: area7CeilingElement },
        { boxes: [floor], requiredElement: floorElement, active: () => currentRoom !== 5 }
    ],
    8: [
        { boxes: area8Walls, requiredElement: area8WallLeftElement },
        { boxes: area8Ceiling, requiredElement: area8CeilingLeftElement },
        { boxes: [area8DamageFloor], requiredElement: area8DamageFloorElement },
        { boxes: area8Platforms, requiredElement: area8Platform1Element }
    ],
    9: [
        { boxes: area9Walls, requiredElement: area9WallLeftElement },
        { boxes: area9Floor, requiredElement: area9FloorLeftElement }
    ],
    10: [
        { boxes: area10Walls, requiredElement: area10WallRightElement },
        { boxes: [floor], requiredElement: floorElement }
    ]
};

function createPlayerBox(){
    return {
        x: x,
        y: y,
        width: hitbox.width,
        height: hitbox.height
    };
}

//função de colisão
function checkColision(playerBox, wallBox){
    return playerBox.x < wallBox.x + wallBox.width &&
           playerBox.x + playerBox.width > wallBox.x &&
           playerBox.y < wallBox.y + wallBox.height &&
           playerBox.y + playerBox.height > wallBox.y;
}


function getElementBox(element){
    const rect = element.getBoundingClientRect();

    return {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
    };
}

//checa colisao horizontal e obstaculos especiais antes de permitir movimento
function checkWallCollision(playerBox){

    checkArea7BreakableWallHit(playerBox);

    const configs = collisionConfig[currentRoom] || [];

    for(const config of configs){
        if(config.requiredElement === undefined || config.requiredElement){
            if(config.active && !config.active()){
                continue;
            }

            if(config.custom){
                if(config.custom(playerBox)){
                    return true;
                }
            } else if(config.boxes && config.boxes.some(box => checkColision(playerBox, box))){
                return true;
            }
        }
    }

    return false;
}

//retorna a caixa tocada no movimento vertical para encaixar o player em cima/embaixo dela
function getCollidingBox(playerBox){
    const configs = collisionConfig[currentRoom] || [];

    for(const config of configs){
        if(config.requiredElement === undefined || config.requiredElement){
            if(config.active && !config.active()){
                continue;
            }

            if(config.boxes){
                const box = config.boxes.find(box => checkColision(playerBox, box));

                if(box){
                    return box;
                }
            }
        }
    }

    return null;
}
