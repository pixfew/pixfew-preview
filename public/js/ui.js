//pega o player do HTML pra conseguir controlar ele no JS
const player = document.getElementById("player");
const popup = document.getElementById("interaction-popup");

const gameArea = document.getElementById("game-area");
const healthDisplayElement = document.getElementById("health-display");
const damageFlashElement = document.getElementById("damage-flash");
const roomTransitionElement = document.getElementById("room-transition");

const gameWidth = gameArea.offsetWidth;
const gameHeight = gameArea.offsetHeight;
let roomTransitionMovementLocked = false;
let roomTransitionUnlockTimer = null;

function showRoomTransition(){
    roomTransitionMovementLocked = true;

    if(roomTransitionUnlockTimer){
        clearTimeout(roomTransitionUnlockTimer);
    }

    roomTransitionUnlockTimer = setTimeout(function(){
        roomTransitionMovementLocked = false;
        roomTransitionUnlockTimer = null;
    }, 800);

    if(!roomTransitionElement){
        return;
    }

    roomTransitionElement.classList.remove("active");
    void roomTransitionElement.offsetWidth;
    roomTransitionElement.classList.add("active");
}

//mantem o jogo em 1600x900 por dentro e escala a tela inteira por fora
function resizeGame(){
    const availableWidth = document.documentElement.clientWidth;
    const availableHeight = document.documentElement.clientHeight;

    const scaleX = availableWidth / gameWidth;
    const scaleY = availableHeight / gameHeight;

    gameArea.style.transform =
        `translate(-50%, -50%) scale(${scaleX}, ${scaleY})`;
}

const doorElement = document.getElementById("door");
const wallLeftElement = document.getElementById("wall-left");
const exitAreaElement = document.getElementById("wall-right-top");
const leftExitElement = document.getElementById("area2-wall-left-top");

//elementos visuais das salas; o rooms.js liga e desliga esses blocos conforme a sala atual
const area3LeftElement = document.getElementById("area3-wall-left-top");
const area3RightElement = document.getElementById("area3-wall-right-top");

const area4LeftElement = document.getElementById("area4-wall-left-top");
const area4RightElement = document.getElementById("area4-wall-left-bottom");
const area4RightWallClosedElement = document.getElementById("area4-wall-right-closed");
const area4RightWallTopElement = document.getElementById("area4-wall-right-top");
const area4RightWallBottomElement = document.getElementById("area4-wall-right-bottom");

const area5LeftElement = document.getElementById("area5-wall-left-top");
const area5LeftBottomElement = document.getElementById("area5-wall-left-bottom");
const area5RightElement = document.getElementById("area5-wall-right");

const area6WallLeftElement = document.getElementById("area6-wall-left");
const area6WallRightElement = document.getElementById("area6-wall-right");
const area6CeilingLeftElement = document.getElementById("area6-ceiling-left");
const area6CeilingRightElement = document.getElementById("area6-ceiling-right");
const area6Platform1Element = document.getElementById("area6-platform-1");
const area6Platform2Element = document.getElementById("area6-platform-2");
const area6Platform3Element = document.getElementById("area6-platform-3");
const area6Platform4Element = document.getElementById("area6-platform-4");

const area7CeilingElement = document.getElementById("area7-ceiling");
const area7WallLeftTopElement = document.getElementById("area7-wall-left-top");
const area7WallLeftBottomElement = document.getElementById("area7-wall-left-bottom");
const area7WallRightElement = document.getElementById("area7-wall-right");
const area7SecretMarkElement = document.getElementById("area7-secret-mark");

const area8CeilingLeftElement = document.getElementById("area8-ceiling-left");
const area8CeilingRightElement = document.getElementById("area8-ceiling-right");
const area8WallLeftElement = document.getElementById("area8-wall-left");
const area8WallRightTopElement = document.getElementById("area8-wall-right-top");
const area8WallRightBottomElement = document.getElementById("area8-wall-right-bottom");
const area8DamageFloorElement = document.getElementById("area8-damage-floor");
const area8Platform1Element = document.getElementById("area8-platform-1");
const area8Platform2Element = document.getElementById("area8-platform-2");
const area8Platform3Element = document.getElementById("area8-platform-3");
const area8Platform4Element = document.getElementById("area8-platform-4");
const area8Platform5Element = document.getElementById("area8-platform-5");

const area9CeilingElement = document.getElementById("area9-ceiling");
const area9WallLeftElement = document.getElementById("area9-wall-left");
const area9WallRightElement = document.getElementById("area9-wall-right");
const area9FloorLeftElement = document.getElementById("area9-floor-left");
const area9FloorRightElement = document.getElementById("area9-floor-right");

const area10CeilingElement = document.getElementById("area10-ceiling");
const area10WallLeftTopElement = document.getElementById("area10-wall-left-top");
const area10WallLeftBottomElement = document.getElementById("area10-wall-left-bottom");
const area10WallRightElement = document.getElementById("area10-wall-right");

//novo sistema de salas
const room2WallTopElement = document.getElementById("room2-wall-left-top");
const room2WallBottomElement = document.getElementById("room2-wall-left-bottom");
const room2WallRightElement = document.getElementById("room2-wall-right");
const area2BlockElement = document.getElementById("area2-block");
const memoryPedestalElement = document.getElementById("memory-pedestal");
const memoryUnlockedPopupElement = document.getElementById("memory-unlocked-popup");

const floorElement = document.getElementById("floor");
const floorLeftElement = document.getElementById("floor-left");
const floorRightElement = document.getElementById("floor-right");

//plataformas
const platform1Element = document.getElementById("platform-1");
const platform2Element = document.getElementById("platform-2");
const platform3Element = document.getElementById("platform-3");
const platform4Element = document.getElementById("platform-4");
const platform5Element = document.getElementById("platform-5");

//plataforma que cai
const fallingPlatformElement = document.getElementById("falling-platform");

//fragmento de memória
const memoryFragmentElement = document.getElementById("memory-fragment");
const memoryPopupElement = document.getElementById("memory-popup");

//corrente de vento
const windZoneElement = document.getElementById("wind-zone");
