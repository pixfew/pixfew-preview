let x = (gameWidth / 2) - 10;
let y = (gameHeight / 2) - 15;

//velocidade do player
let speed = 3;

//velocidade, gravidade, tamanho do pulo(quanto menor mais alto)
let velocityY = 0;
let gravity = 0.5;
let jumpForce = -18;

//dash
let facingDirection = 1;
let isDashing = false;
let dashTime = 0;
let dashDuration = 15;
let dashSpeed = 15;
let dashCooldown = false;

//desbugar pulo
let isGrounded = false;
let jumpPressed = false;
let coyoteTime = 0;
let coyoteTimeMax = 8;
let lastTime = 0;

//estado de navegacao entre salas e animacoes especiais de entrada
let currentRoom = 1;
let nextSpawn = "default";
let spawnFromRight = false;
let isEmergingFromHole = false;
let emergeTargetY = 0;
let emergeSafeX = 0;
let emergeStartX = 0;
let emergeStartY = 0;
let emergePeakY = 0;
let emergeProgress = 0;
let emergeSpeed = 18;

//spawn vindo de outras paginas do menu/pausa, usado antes do sistema de salas atual carregar
const spawnPoint = localStorage.getItem("spawnPoint");

if(spawnPoint === "fromLeft"){
    x = 80;
    y = gameHeight - 100;
    localStorage.removeItem("spawnPoint");
}

if(spawnPoint === "fromRight"){
    x = gameWidth - 120;
    y = gameHeight - 100;
    localStorage.removeItem("spawnPoint");
}

if(spawnPoint === "fromTop"){
    x = (gameWidth / 2) - 10;
    y = 120;
    velocityY = 0;
    isGrounded = false;
    localStorage.removeItem("spawnPoint");
}

//variável para entrar na porta
let canEnterDoor = false;

//detecta se as teclas estão pressionadas
const controls = {
    moveLeft: false,
    moveRight: false,
    moveDown: false,
    jump: false,
    dash: false
};

const keyboardControlState = {
    moveLeft: false,
    moveRight: false,
    moveDown: false,
    jump: false,
    dash: false
};

const mobileControlState = {
    moveLeft: false,
    moveRight: false,
    jump: false,
    dash: false
};

function getControlActions(event){
    const key = event.key.toLowerCase();

    return {
        moveLeft: key === "a" || key === "arrowleft",
        moveRight: key === "d" || key === "arrowright",
        moveDown: key === "s" || key === "arrowdown",
        jump: key === "w" || key === "arrowup",
        dash: event.code === "ShiftLeft" || event.code === "ShiftRight" || event.key === "Shift",
        interact: event.key === "Enter" || key === "w"
    };
}

function syncControlState(controlName){
    controls[controlName] = Boolean(keyboardControlState[controlName] || mobileControlState[controlName]);
}

function setControlState(actions, isPressed, source = keyboardControlState){
    if(actions.moveLeft){
        source.moveLeft = isPressed;
        syncControlState("moveLeft");
    }

    if(actions.moveRight){
        source.moveRight = isPressed;
        syncControlState("moveRight");
    }

    if(actions.moveDown){
        source.moveDown = isPressed;
        syncControlState("moveDown");
    }

    if(actions.jump){
        source.jump = isPressed;
        syncControlState("jump");
    }

    if(actions.dash){
        source.dash = isPressed;
        syncControlState("dash");
    }
}

function tryDash(){
    if(!isDashing && !dashCooldown){
        isDashing = true;
        dashTime = dashDuration;
        dashCooldown = true;
    }
}

function tryJump(){
    if(isGrounded && !jumpPressed){
        velocityY = jumpForce;
        isGrounded = false;
        jumpPressed = true;
        coyoteTime = 0;
    }
}

function enterDoor(){
    canEnterDoor = false;
    updateMobileInteractionButton();
    currentRoom = 2;
    nextSpawn = "fromLeft";

    loadRoom();
}

//hitbox do player (tamanho lógico pra colisão)
const hitbox = {
    width: 20,
    height: 30
};

//hitbox das paredes da primeira área

//entrada de comandos: movimento, pulo, dash, pausa e interacao com porta
document.addEventListener("keydown", function(event){

    const actions = getControlActions(event);

    if(roomTransitionMovementLocked){
        return;
    }

    if(actions.dash){
        tryDash();
    }

    setControlState(actions, true);

    if(canEnterDoor && actions.interact){
        if(event.key === "Enter" || !event.repeat){
            enterDoor();
        }

        if(actions.jump){
            jumpPressed = true;
        }

        return;
    }

    if(actions.jump){
        tryJump();
    }

    //abre o menu de pausa ao apertar ESC
    if(event.key === "Escape"){
        localStorage.setItem("lastArea", window.location.pathname);
        window.location.href = "pause.html";
    }

});

//quando a tecla é solta
document.addEventListener("keyup", function(event){

    const actions = getControlActions(event);

    setControlState(actions, false);

    //libera o pulo de novo quando solta uma tecla de pulo
    if(actions.jump && !controls.jump){
        jumpPressed = false;
    }
});

//controles de toque reutilizam o mesmo estado consumido pelo loop do jogo
const mobileControlsElement = document.getElementById("mobile-controls");
const mobileInteractionButton = document.querySelector('[data-control="interact"]');
const activeMobilePointers = new Map();

function updateMobileInteractionButton(){
    if(mobileInteractionButton){
        mobileInteractionButton.hidden = !canEnterDoor;
    }
}

function getMobileActions(controlName){
    return {
        moveLeft: controlName === "moveLeft",
        moveRight: controlName === "moveRight",
        moveDown: false,
        jump: controlName === "jump",
        dash: controlName === "dash",
        interact: controlName === "interact"
    };
}

function releaseMobilePointer(pointerId){
    const activeControl = activeMobilePointers.get(pointerId);

    if(!activeControl){
        return;
    }

    activeMobilePointers.delete(pointerId);
    mobileControlState[activeControl.controlName] = Array.from(activeMobilePointers.values()).some(function(pointer){
        return pointer.controlName === activeControl.controlName;
    });
    syncControlState(activeControl.controlName);

    const buttonStillPressed = Array.from(activeMobilePointers.values()).some(function(pointer){
        return pointer.button === activeControl.button;
    });

    if(!buttonStillPressed){
        activeControl.button.classList.remove("is-pressed");
    }

    if(activeControl.controlName === "jump" && !controls.jump){
        jumpPressed = false;
    }
}

function releaseAllMobileControls(){
    for(const pointerId of Array.from(activeMobilePointers.keys())){
        releaseMobilePointer(pointerId);
    }
}

if(mobileControlsElement){
    mobileControlsElement.addEventListener("contextmenu", function(event){
        event.preventDefault();
    });

    for(const button of mobileControlsElement.querySelectorAll("[data-control]")){
        button.addEventListener("pointerdown", function(event){
            event.preventDefault();

            if(roomTransitionMovementLocked){
                return;
            }

            const controlName = button.dataset.control;
            const actions = getMobileActions(controlName);

            activeMobilePointers.set(event.pointerId, { button, controlName });
            button.setPointerCapture(event.pointerId);
            button.classList.add("is-pressed");
            setControlState(actions, true, mobileControlState);

            if(actions.dash){
                tryDash();
            }

            if(actions.jump){
                tryJump();
            }

            if(actions.interact && canEnterDoor){
                enterDoor();
            }
        });

        button.addEventListener("pointermove", function(event){
            if(!activeMobilePointers.has(event.pointerId)){
                return;
            }

            const bounds = button.getBoundingClientRect();
            const isOutside = event.clientX < bounds.left || event.clientX > bounds.right ||
                event.clientY < bounds.top || event.clientY > bounds.bottom;

            if(isOutside){
                releaseMobilePointer(event.pointerId);

                if(button.hasPointerCapture(event.pointerId)){
                    button.releasePointerCapture(event.pointerId);
                }
            }
        });

        for(const eventName of ["pointerup", "pointercancel", "lostpointercapture"]){
            button.addEventListener(eventName, function(event){
                releaseMobilePointer(event.pointerId);
            });
        }
    }

    window.addEventListener("blur", releaseAllMobileControls);
    document.addEventListener("visibilitychange", function(){
        if(document.hidden){
            releaseAllMobileControls();
        }
    });
}
