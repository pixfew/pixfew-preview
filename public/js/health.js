const maxHealth = 3;
let currentHealth = maxHealth;
let damageInvulnerable = false;
let safeCheckpointX = x;
let safeCheckpointY = y;

function updateHealthDisplay(){
    if(!healthDisplayElement){
        return;
    }

    Array.from(healthDisplayElement.children).forEach(function(point, index){
        point.classList.toggle("lost", index >= currentHealth);
    });
}

function setSafeCheckpoint(checkpointX, checkpointY){
    safeCheckpointX = checkpointX;
    safeCheckpointY = checkpointY;
}

function showDamageFeedback(){
    player.classList.remove("damaged");
    void player.offsetWidth;
    player.classList.add("damaged");

    setTimeout(function(){
        player.classList.remove("damaged");
    }, 50);

    if(damageFlashElement){
        damageFlashElement.classList.remove("active");
        void damageFlashElement.offsetWidth;
        damageFlashElement.classList.add("active");
    }
}

function receiveDamage(){
    if(damageInvulnerable){
        return;
    }

    damageInvulnerable = true;
    currentHealth--;

    x = safeCheckpointX;
    y = safeCheckpointY;
    velocityY = 0;
    isGrounded = true;
    isDashing = false;
    dashTime = 0;

    showDamageFeedback();
    updateHealthDisplay();

    if(currentHealth <= 0){
        currentHealth = maxHealth;

        setTimeout(function(){
            updateHealthDisplay();
        }, 350);
    }

    setTimeout(function(){
        damageInvulnerable = false;
    }, 900);
}

function updateSafeCheckpoint(collidedBox){
    const standingOnSafeSurface =
        isGrounded &&
        collidedBox &&
        collidedBox !== area8DamageFloor;

    if(!standingOnSafeSurface){
        return;
    }

    const checkpointMargin = 40;
    const safeMinX = collidedBox.x;
    const safeMaxX = collidedBox.x + collidedBox.width - hitbox.width;
    const checkpointX = Math.max(
        safeMinX,
        Math.min(x - facingDirection * checkpointMargin, safeMaxX)
    );

    setSafeCheckpoint(checkpointX, y);
}

function updateHealthSystem(collidedBox){
    if(currentRoom !== 8){
        return;
    }

    if(collidedBox === area8DamageFloor){
        receiveDamage();
        return;
    }

    updateSafeCheckpoint(collidedBox);
}

updateHealthDisplay();
