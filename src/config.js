// Generated by CoffeeScript 1.12.7
(function() {
  var Config, init;

  Config = (function() {
    function Config() {
      this.module_path = __dirname.split('/');
    }

    Config.prototype.settings = function(type) {
      switch (type) {
        case 'grid':
          return {
            'screen_width': 1200,
            'left_margin': 50,
            'right_margin': 50,
            'top_margin': 50,
            'bottom_margin': 50,
            'header_height': 100,
            'vertical_space_between_items': 100,
            'horisontal_space_between_items': 70,
            'max_num_columns': 8,
            'max_num_columns_in_row': function(row) {
              if (row === 0) {
                return 7;
              } else {
                return 8;
              }
            }
          };
        case 'item':
          return {
            'width': 175,
            'height': 100,
            'border_width': 2
          };
      }
    };

    return Config;

  })();

  init = function() {
    return new Config;
  };

  exports.init = init;

}).call(this);
