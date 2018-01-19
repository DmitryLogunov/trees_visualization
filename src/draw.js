// Generated by CoffeeScript 1.12.7
(function() {
  var Draw, init;

  Draw = (function() {
    var StylesParser;

    function Draw(width, height, properties_settings) {
      var SVG, document, window;
      window = require('svgdom');
      SVG = require('svg.js')(window);
      document = window.document;
      this.draw = SVG(document.documentElement).size(width, height);
      this.styles_parser = new StylesParser(properties_settings);
    }

    Draw.prototype.clear = function() {
      this.draw.clear();
      return this;
    };

    Draw.prototype.svg = function() {
      return this.draw.svg();
    };

    Draw.prototype.item_box = function(item) {
      var item_style;
      item_style = this.styles_parser.parse_item_styles(item['type'], item['data']);
      this.draw_handler('item_box', [item['position']], item_style).call();
      return this;
    };

    Draw.prototype.items = function(items_matrix) {
      var i, item, j, len, len1, rows;
      for (i = 0, len = items_matrix.length; i < len; i++) {
        rows = items_matrix[i];
        for (j = 0, len1 = rows.length; j < len1; j++) {
          item = rows[j];
          this.item_box(item);
        }
      }
      return this;
    };

    Draw.prototype.draw_handler = function(type, positions, style) {
      var $this;
      $this = this;
      return function() {
        var height, left, top, width;
        switch (type) {
          case 'item_box':
            left = positions[0]['left'];
            top = positions[0]['top'];
            width = positions[0]['right'] - positions[0]['left'];
            height = positions[0]['bottom'] - positions[0]['top'];
            return $this.draw.rect(width, height).radius(8).fill('yellow').move(left, top);
        }
      };
    };

    StylesParser = (function() {
      function StylesParser(properties_settings) {
        this.properties_settings = properties_settings;
      }

      StylesParser.prototype.get_item_styles = function(item_type, item_data) {
        var default_category_style, properties_styles, property, property_uid, ref, value_style;
        properties_styles = {};
        default_category_style = this.properties_settings['styles'][this.properties_settings['categories_styles'][item_type]];
        if (default_category_style == null) {
          default_category_style = {};
        }
        ref = this.properties_settings['properties'][item_type];
        for (property_uid in ref) {
          property = ref[property_uid];
          value_style = this.properties_settings['styles'][property['values'][item_data[property_uid]]];
          if (value_style == null) {
            value_style = {};
          }
          properties_styles[property_uid] = {
            default_property_style: this.properties_settings['styles'][property['style']],
            sort: property['sort'],
            value_style: value_style
          };
        }
        return {
          default_category_style: default_category_style,
          properties_styles: properties_styles
        };
      };

      StylesParser.prototype.parse_item_styles = function(item_type, item_data) {};

      StylesParser.prototype.merge_styles = function(first_style, second_style) {};

      return StylesParser;

    })();

    return Draw;

  })();

  init = function(width, height, properties_settings) {
    return new Draw(width, height, properties_settings);
  };

  exports.init = init;

}).call(this);