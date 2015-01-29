ig.module('game.config')
.defines(function(){
  GameConfig = {
    playerDodgeTime: 0.8,
    respawnTime: 5,

    defaultLevel: 'LevelLevel1',

    waveInterimTime: 5,

    zIndexes: {
      enemies: 40,
      player: 100,
      slime: 20,
      ladder: 30
    }
  };
});
