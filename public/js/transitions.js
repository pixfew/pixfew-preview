//configurações de saída de cada sala
const roomExitRules = [
    {
        room: 1,
        condition: playerBox => playerBox.x >= gameWidth - hitbox.width,
        toRoom: 3,
        apply: function(){
            nextSpawn = "fromLeft";
        }
    },
    {
    room: 3,
        condition: playerBox =>
            playerBox.x >= gameWidth - hitbox.width &&
            playerBox.y + playerBox.height > gameHeight * area3RightWallConfig.topOpeningStart &&
            playerBox.y < gameHeight * (
                area3RightWallConfig.topOpeningStart +
                area3RightWallConfig.topOpeningHeight
            ),
        toRoom: 4,
        apply: function(){
            nextSpawn = "fromLeft";
        }
    },
    {
    room: 3,
        condition: playerBox =>
            playerBox.x >= gameWidth - hitbox.width &&
            playerBox.y + playerBox.height > gameHeight * area3RightWallConfig.bottomOpeningStart &&
            playerBox.y < gameHeight * (
                area3RightWallConfig.bottomOpeningStart +
                area3RightWallConfig.bottomOpeningHeight
            ),
        toRoom: 5,
        apply: function(){
            nextSpawn = "fromLeft";
        }
    },
    {
        room: 5,
        condition: playerBox => 
            playerBox.x + playerBox.width > downExitArea.x &&
            playerBox.x < downExitArea.x + downExitArea.width &&
            playerBox.y >= gameHeight - hitbox.height,
        toRoom: 6,
        apply: function(){
            nextSpawn = "fromTop";
        }
    },
    {
        room: 2,
        condition: playerBox => playerBox.x < 0 && playerBox.y > 250 && playerBox.y < gameHeight - 250,
        toRoom: 1,
        apply: function(){
            nextSpawn = "door";
        }
    },
    {
        room: 3,
        condition: playerBox => playerBox.x < 0 && playerBox.y > 250 && playerBox.y < gameHeight - 250,
        toRoom: 1,
        apply: function(){
            nextSpawn = "fromRight";
        }
    },
    {
        room: 4,
        condition: playerBox => playerBox.x < 0 && playerBox.y > 250 && playerBox.y < gameHeight - 250,
        toRoom: 3,
        apply: function(){
            nextSpawn = "fromRightTop";
        }
    },
    {
        room: 4,
        condition: playerBox =>
            memoryFragmentDelivered &&
            playerBox.x >= gameWidth - hitbox.width &&
            playerBox.y + playerBox.height > area4RightExitArea.y &&
            playerBox.y < area4RightExitArea.y + area4RightExitArea.height,
        toRoom: 7,
        apply: function(){
            nextSpawn = "fromLeft";
        }
    },
    {
        room: 7,
        condition: playerBox =>
            area7BreakableWallOpen &&
            playerBox.x >= gameWidth - hitbox.width &&
            playerBox.y + playerBox.height > area7BreakableWallCrack.y &&
            playerBox.y < area7BreakableWallCrack.y + area7BreakableWallCrack.height,
        toRoom: 8,
        apply: function(){
            nextSpawn = "fromLeft";
        }
    },
    {
        room: 7,
        condition: playerBox =>
            playerBox.x < 0 &&
            playerBox.y > area7LeftExitArea.y &&
            playerBox.y < area7LeftExitArea.y + area7LeftExitArea.height,
        toRoom: 4,
        apply: function(){
            nextSpawn = "fromRight";
        }
    },
    {
        room: 8,
        condition: playerBox =>
            playerBox.x < 0 &&
            playerBox.y + playerBox.height > area8LeftExitArea.y &&
            playerBox.y < area8LeftExitArea.y + area8LeftExitArea.height,
        toRoom: 7,
        apply: function(){
            nextSpawn = "fromArea8";
        }
    },
    {
        room: 8,
        condition: playerBox =>
            playerBox.x + playerBox.width > area8TopExitArea.x &&
            playerBox.x < area8TopExitArea.x + area8TopExitArea.width &&
            playerBox.y <= 0,
        toRoom: 9,
        apply: function(){
            nextSpawn = "fromBottom";
        }
    },
    {
        room: 8,
        condition: playerBox =>
            playerBox.x >= gameWidth - hitbox.width &&
            playerBox.y + playerBox.height > area8RightExitArea.y &&
            playerBox.y < area8RightExitArea.y + area8RightExitArea.height,
        toRoom: 10,
        apply: function(){
            nextSpawn = "fromLeft";
        }
    },
    {
        room: 9,
        condition: playerBox =>
            playerBox.x + playerBox.width > area9BottomExitArea.x &&
            playerBox.x < area9BottomExitArea.x + area9BottomExitArea.width &&
            playerBox.y >= gameHeight - hitbox.height,
        toRoom: 8,
        apply: function(){
            nextSpawn = "fromTop";
        }
    },
    {
        room: 10,
        condition: playerBox =>
            playerBox.x < 0 &&
            playerBox.y + playerBox.height > area10LeftExitArea.y &&
            playerBox.y < area10LeftExitArea.y + area10LeftExitArea.height,
        toRoom: 8,
        apply: function(){
            nextSpawn = "fromRight";
        }
    },
    {
        room: 5,
        condition: playerBox =>
            playerBox.x < 0 &&
            playerBox.y > 250 &&
            playerBox.y < gameHeight - 250,
        toRoom: 3,
        apply: function(){
            nextSpawn = "fromRightBottom";
        }
    },
    {
        room: 6,
        condition: playerBox =>
            playerBox.x + playerBox.width > area6TopExitArea.x &&
            playerBox.x < area6TopExitArea.x + area6TopExitArea.width &&
            playerBox.y <= 0,
        toRoom: 5,
        apply: function(){
            nextSpawn = "fromHole";
        }
    },
];

//procura a primeira regra de saida valida para a sala atual e carrega a proxima sala
function checkRoomExit(playerBox){
    const exitRule = roomExitRules.find(item =>
        item.room === currentRoom &&
        item.condition(playerBox)
    );

    if(!exitRule){
        return false;
    }

    currentRoom = exitRule.toRoom;
    isDashing = false;
    dashTime = 0;
    setTimeout(function(){
        dashCooldown = false;
    }, 500);

    if(typeof exitRule.apply === "function"){
        exitRule.apply();
    }

    loadRoom();
    startRoomEntryControlLock();
    return true;
}
