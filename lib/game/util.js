// a collection of our own extension methods
ig.module('game.util')
.requires(
  'impact.impact',
  'impact.entity'
)
.defines(function(){
  Array.prototype.random = function() {
    var len = this.length;
    var index = Math.floor(Math.random() * ((len - 1) - 0 + 1)) + 0;
    return this[index];
  };

  ig.Entity.inject({
    isVisible: function( offset ) {
      offset = offset || {x: 0, y: 0};

      var visibleCoords = {
        xLeft: ig.game.screen.x - offset.x,
        yTop: ig.game.screen.y - offset.y,
        xRight: ig.game.screen.x - offset.x + ig.system.width,
        yBottom: ig.game.screen.y - offset.y + ig.system.height
      };

      if( (this.pos.x.toInt() > visibleCoords.xRight.toInt())  ||
        (this.pos.x.toInt() < visibleCoords.xLeft.toInt())     ||
        (this.pos.y.toInt() < visibleCoords.yTop)              ||
        (this.pos.y.toInt() > visibleCoords.yBottom)
      ) {
        return false;
      }
      return true;
    }
  });

  ig._ = (function(utils) {
    utils.coinFlip = function() {
      var x = Math.floor(Math.random() * ((100 - 1) - 0 + 1)) + 0;
      return x >= 50;
    };

    utils.rndRange = function(min, max) {
      return Math.floor(Math.random() * ((max - 1) - 0 + 1)) + min;
    };

    utils.nearestEntity = function( type, source ) {
      var nearestDistance = Infinity;
      var nearestEntity;

      var ents = ig.game.getEntitiesByType(type);
      for( var i = 0; i < ents.length; i++ ) {
        var ent = ents[i];
        var distance = source.distanceTo( ent );
        if( ent != source ) {
          if( distance < nearestDistance ) {
            nearestDistance = distance;
            nearestEntity = ent;
          }
        }
      }
      return nearestEntity;
    };

    utils.log = function(category, action, label, value) {
      var args = ['send', 'event'].concat(Array.prototype.slice.call(arguments));
      if(window.ga) {
        return window.ga.apply(window.ga, args);
      }
    };

    utils.applyOffset = function(entity, offset) {
      var pos = entity.pos;
      var flipped = entity.flip;
      var result = {
        x: pos.x + offset.x,
        y: pos.y + offset.y
      };

      if(flipped) {
        result.x = pos.x + (offset.x * -1) + (entity.size.x - 2);
      }

      return result;
    };

    utils.q = {};
    if(window.location.href.indexOf("?") > -1) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        utils.q[pair[0]] = pair[1];
      }
    }

    return utils;
  })({});
});
