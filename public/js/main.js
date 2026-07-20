function gameLoop(currentTime){

    if(!lastTime){
        lastTime = currentTime;
    }

    let deltaTime = (currentTime - lastTime) / 16.67;
    lastTime = currentTime;

    if(deltaTime > 2){
        deltaTime = 2;
    }

    if(roomTransitionMovementLocked){
        player.style.left = x + "px";
        player.style.top = y + "px";
        requestAnimationFrame(gameLoop);
        return;
    }

    //animacao especial ao voltar da sala 6 para a sala 5 pelo buraco
    if(isEmergingFromHole){
        emergeProgress += (emergeSpeed / 400) * deltaTime;

        const emergeArcProgress = Math.min(1, emergeProgress);
        const emergeArcInverse = 1 - emergeArcProgress;

        x = emergeStartX + (emergeSafeX - emergeStartX) * emergeArcProgress;
        y =
            emergeArcInverse * emergeArcInverse * emergeStartY +
            2 * emergeArcInverse * emergeArcProgress * emergePeakY +
            emergeArcProgress * emergeArcProgress * emergeTargetY;

        if(emergeArcProgress >= 1){
            y = emergeTargetY;
            x = emergeSafeX;
            velocityY = 0;
            isGrounded = true;
            isEmergingFromHole = false;
        }

        player.style.left = x + "px";
        player.style.top = y + "px";
        requestAnimationFrame(gameLoop);
        return;
    }

    //dash horizontal com colisao e cooldown
    if(isDashing){
        x += facingDirection * dashSpeed * deltaTime;

        const dashPlayerBox = {
            x: x,
            y: y,
            width: hitbox.width,
            height: hitbox.height
        };

        if(checkWallCollision(dashPlayerBox)){
            x -= facingDirection * dashSpeed * deltaTime;
            isDashing = false;
            dashTime = 0;

            setTimeout(function(){
                dashCooldown = false;
            }, 500);
        }

        dashTime -= deltaTime;

        if(dashTime <= 0){
            isDashing = false;

            setTimeout(function(){
                dashCooldown = false;
            }, 500);
        }
    }

    player.classList.toggle("dashing", isDashing);

    //movimentação horizontal
    if(controls.moveRight){
        x += speed * deltaTime;

        facingDirection = 1;

        const playerBox = {
            x: x,
            y: y,
            width: hitbox.width,
            height: hitbox.height
        };

        if(checkWallCollision(playerBox)){
            x -= speed * deltaTime;
        }
    }

    if(controls.moveLeft){
        x -= speed * deltaTime;

        facingDirection = -1;

        const playerBox = {
            x: x,
            y: y,
            width: hitbox.width,
            height: hitbox.height
        };

        if(checkWallCollision(playerBox)){
            x += speed * deltaTime;
        }
    }

    applyRoomEffects();

    //movimentação vertical
    velocityY += gravity * deltaTime;
    y += velocityY * deltaTime;

    const verticalPlayerBox = {
        x: x,
        y: y,
        width: hitbox.width,
        height: hitbox.height
    };

    //plataforma da sala 4: espera um pouco apos o toque e depois cai
    if(fallingPlatformElement){

    fallingPlatform.y = fallingPlatformY;

    if(checkColision(verticalPlayerBox, fallingPlatform) && !fallingPlatformTimerStarted){
        fallingPlatformTimerStarted = true;

        setTimeout(function(){
            fallingPlatformFalling = true;
        }, 700);
    }

    if(fallingPlatformFalling){
        fallingPlatformY += 4 * deltaTime;
        fallingPlatformElement.style.top = fallingPlatformY + "px";
        }

        if(fallingPlatformY > gameHeight){
        fallingPlatformElement.style.display = "none";
        fallingPlatformFalling = false;
        }
    }

    //colisao vertical encaixa o player sobre plataformas, pisos e tetos
    const collidedBox = getCollidingBox(verticalPlayerBox);

    if(collidedBox){
        if(velocityY > 0){
            y = collidedBox.y - hitbox.height;
            isGrounded = true;
            coyoteTime = coyoteTimeMax;
        }else if(velocityY < 0){
            y = collidedBox.y + collidedBox.height;
        }

        velocityY = 0;
    }else{
        isGrounded = false;

        if(coyoteTime > 0){
            coyoteTime--;
        }
    }

    updateHealthSystem(collidedBox);

    //impede o player de sair pela esquerda
    if(x < roomBounds.left){
        const playerBox = createPlayerBox();

        if(checkRoomExit(playerBox)){
            player.style.left = x + "px";
            player.style.top = y + "px";
            requestAnimationFrame(gameLoop);
            return;
        }

        x = roomBounds.left;
    }

    //impede o player de sair por cima
    if(y < roomBounds.top){
        y = roomBounds.top;
        velocityY = 0;
    }

    //impede o player de sair pela direita
    if(x > roomBounds.right - hitbox.width){
        x = roomBounds.right - hitbox.width;
    }

    //impede o player de sair por baixo
    if(y > roomBounds.bottom - hitbox.height){
        y = roomBounds.bottom - hitbox.height;
        velocityY = 0;
        isGrounded = true;
    }

    //cria a hitbox atual do player
    const playerBox = createPlayerBox();

    //transicoes que nao foram capturadas no limite esquerdo tambem sao avaliadas aqui
    if(checkRoomExit(playerBox)){
        player.style.left = x + "px";
        player.style.top = y + "px";
        requestAnimationFrame(gameLoop);
        return;
    }

    //ativa interação com a porta somente se a porta existir na página
    if(currentRoom === 1 && doorElement && checkColision(playerBox, door)){
        canEnterDoor = true;

        if(popup){
            popup.style.display = "block";
        }

    }else{
        canEnterDoor = false;

        if(popup){
            popup.style.display = "none";
        }
    }

    //se cair no buraco da área 5, vai para area6
    updateMobileInteractionButton();

    if(currentRoom === 5 && checkColision(playerBox, downExitArea)){
        currentRoom = 6;
        loadRoom();
    }

    if(
        currentRoom === 6 &&
        damageObstacleElement &&
        checkColision(playerBox, damageObstacle)
    ){
        damagePopupElement.style.display = "block";
    }else{
        damagePopupElement.style.display = "none";
    }

    //fragmento de memória(popup)
    if(currentRoom === 6 && memoryFragmentElement && checkColision(playerBox, memoryFragment)){
        collectMemoryFragment();
    }

    //objetivos de memoria rodam no fim do frame, depois das colisoes e transicoes
    checkMemoryPedestalDelivery(playerBox);
    updateMemoryFragmentFollower(deltaTime);

    //atualiza a posição do player na tela
    player.style.left = x + "px";
    player.style.top = y + "px";

    //faz o loop rodar infinitamente
    requestAnimationFrame(gameLoop);
}


resizeGame();
window.addEventListener("resize", resizeGame);

//inicia o loop do jogo
loadRoom();
requestAnimationFrame(gameLoop);
