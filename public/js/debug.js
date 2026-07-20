(function(){
    const debugEnabled = new URLSearchParams(window.location.search).get("debug") === "1";

    if(!debugEnabled){
        return;
    }

    const panel = document.getElementById("debug-panel");
    const roomSelect = document.getElementById("debug-room-select");
    const goToRoomButton = document.getElementById("debug-go-to-room");
    const restoreHealthButton = document.getElementById("debug-restore-health");
    const fragmentCollectedInput = document.getElementById("debug-fragment-collected");
    const fragmentDeliveredInput = document.getElementById("debug-fragment-delivered");
    const room7WallOpenInput = document.getElementById("debug-room7-wall-open");
    const resetStatesButton = document.getElementById("debug-reset-states");

    if(!panel || !roomSelect){
        return;
    }

    const debugSafeSpawnFactories = {
        8: function(){
            const platform = area8Platforms[0];

            return {
                x: platform.x + (platform.width - hitbox.width) / 2,
                y: platform.y - hitbox.height
            };
        },
        9: function(){
            const floorSection = area9Floor[0];

            return {
                x: floorSection.x + 80,
                y: floorSection.y - hitbox.height
            };
        }
    };

    function getDebugSafeSpawn(roomNumber){
        const createOverride = debugSafeSpawnFactories[roomNumber];

        if(createOverride){
            return createOverride();
        }

        return {
            x: rooms[roomNumber].spawnX,
            y: rooms[roomNumber].spawnY
        };
    }

    function cancelDebugMovement(){
        isDashing = false;
        dashTime = 0;
        dashCooldown = false;
        velocityY = 0;
        isGrounded = false;
        isEmergingFromHole = false;
        emergeProgress = 0;
        spawnFromRight = false;
        nextSpawn = "default";

        player.classList.remove("dashing");
    }

    function goToDebugRoom(roomNumber){
        if(!rooms[roomNumber]){
            return;
        }

        cancelDebugMovement();
        currentRoom = roomNumber;
        loadRoom();

        const safeSpawn = getDebugSafeSpawn(roomNumber);
        x = safeSpawn.x;
        y = safeSpawn.y;
        velocityY = 0;

        if(roomNumber === 8 && typeof setSafeCheckpoint === "function"){
            setSafeCheckpoint(x, y);
        }

        player.style.left = x + "px";
        player.style.top = y + "px";
        roomSelect.value = String(roomNumber);
    }

    function syncDebugInputs(){
        fragmentCollectedInput.checked = playerHasMemoryFragment;
        fragmentDeliveredInput.checked = memoryFragmentDelivered;
        room7WallOpenInput.checked = area7BreakableWallOpen;
    }

    function refreshDebugMemoryVisual(){
        updateMemoryFragmentVisibility();

        if(!memoryFragmentElement || playerHasMemoryFragment || memoryFragmentDelivered){
            return;
        }

        memoryFragmentElement.classList.remove("following");
        memoryFragmentElement.style.left = memoryFragment.x + "px";
        memoryFragmentElement.style.top = memoryFragment.y + "px";
        memoryFragmentElement.style.display = currentRoom === 6 ? "block" : "none";
    }

    function restoreDebugHealth(){
        currentHealth = maxHealth;
        damageInvulnerable = false;
        updateHealthDisplay();
    }

    function setDebugFragmentCollected(collected){
        playerHasMemoryFragment = collected;

        if(collected){
            memoryFragmentDelivered = false;
        }

        refreshDebugMemoryVisual();
        syncDebugInputs();

        if(currentRoom === 4){
            goToDebugRoom(currentRoom);
        }
    }

    function setDebugFragmentDelivered(delivered){
        memoryFragmentDelivered = delivered;

        if(delivered){
            playerHasMemoryFragment = false;
        }

        refreshDebugMemoryVisual();
        syncDebugInputs();

        if(currentRoom === 4){
            goToDebugRoom(currentRoom);
        }
    }

    function setDebugRoom7WallOpen(open){
        area7BreakableWallOpen = open;
        area7BreakableWallHits = open ? area7BreakableWallMaxHits : 0;
        area7BreakableWallTouching = false;
        updateArea7BreakableWallVisual();
        syncDebugInputs();
    }

    function resetDebugStates(){
        restoreDebugHealth();
        playerHasMemoryFragment = false;
        memoryFragmentDelivered = false;
        area7BreakableWallOpen = false;
        area7BreakableWallHits = 0;
        area7BreakableWallTouching = false;

        updateArea7BreakableWallVisual();
        goToDebugRoom(currentRoom);
        refreshDebugMemoryVisual();
        syncDebugInputs();
    }

    Object.keys(rooms).forEach(function(roomNumber){
        const option = document.createElement("option");
        option.value = roomNumber;
        option.textContent = "Sala " + roomNumber;
        roomSelect.appendChild(option);
    });

    roomSelect.value = String(currentRoom);
    syncDebugInputs();
    panel.hidden = false;

    panel.addEventListener("keydown", function(event){
        event.stopPropagation();
    });

    panel.addEventListener("keyup", function(event){
        event.stopPropagation();
    });

    goToRoomButton.addEventListener("click", function(){
        goToDebugRoom(Number(roomSelect.value));
    });

    restoreHealthButton.addEventListener("click", restoreDebugHealth);

    fragmentCollectedInput.addEventListener("change", function(){
        setDebugFragmentCollected(fragmentCollectedInput.checked);
    });

    fragmentDeliveredInput.addEventListener("change", function(){
        setDebugFragmentDelivered(fragmentDeliveredInput.checked);
    });

    room7WallOpenInput.addEventListener("change", function(){
        setDebugRoom7WallOpen(room7WallOpenInput.checked);
    });

    resetStatesButton.addEventListener("click", resetDebugStates);
})();
