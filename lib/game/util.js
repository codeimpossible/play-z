// a collection of our own extension methods
ig.module('game.util')
.defines(function(){
  Array.prototype.random = function() {
    var len = this.length;
    var index = Math.floor(Math.random() * ((len - 1) - 0 + 1)) + 0;
    return this[index];
  };

  ig._ = (function(utils) {
    utils.coinFlip = function() {
      var x = Math.floor(Math.random() * ((100 - 1) - 0 + 1)) + 0;
      return x >= 50;
    };

    utils.rndRange = function(min, max) {
      return Math.floor(Math.random() * ((max - 1) - 0 + 1)) + min;
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
