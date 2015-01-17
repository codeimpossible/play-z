ig.module('game.entities.big-boy')
.requires(
  'impact.impact',
  'game.entities.zombie',
  'game.entities.dead-big-boy'
)
.defines(function() {
  EntityBigBoy = EntityZombie.extend({
    pointValue: 300,

    name: 'bigboy',

    animSheet: new ig.AnimationSheet( 'media/big-boy.png', 48, 48 ),

    // the size of our collider
    size: { x: 20, y: 48 },

    health: 20,
    maxHealth: 20,

    speed: 2000,

    deathEntity: EntityDeadBigBoy,

    // the offset of collider
    offset: { x: 12, y: 0 }
  });
});
