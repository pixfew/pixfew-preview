let fallingPlatformY = 420;
let fallingPlatformFalling = false;
let fallingPlatformTimerStarted = false;

//efeitos locais de sala que alteram o player sem virar regra global do jogo
function applyRoomEffects(){
    const playerBox = createPlayerBox();

    if(currentRoom === 4 && windZoneElement && checkColision(playerBox, windZone)){
        velocityY = -6;
        isGrounded = false;
    }
}

