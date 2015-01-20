ig.module('game.config')
.defines(function(){
  GameConfig = {
    reloadTimeShotgun: 4,
    reloadTimePistol: 0.9,
    reloadTimeRifle: 2.5,

    playerDodgeTime: 0.8,
    respawnTime: 5,

    defaultLevel: 'LevelLevel1',

    waveInterimTime: 5,
  };
});
