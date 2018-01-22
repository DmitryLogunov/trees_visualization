// Generated by CoffeeScript 2.1.1
(function() {
  var Grid, init,
    indexOf = [].indexOf;

  Grid = class Grid {
    constructor(data) {
      var config;
      config = require("./config").init();
      this.grid_settings = config.settings('grid');
      this.item_settings = config.settings('item');
      this.max_num_columns_in_row_proc = this.grid_settings['max_num_columns_in_row'];
      this.helpers = require("./helpers").init();
      this.data = data;
      this.grid_matrix = [];
      this.item_types = Object.keys(this.data['categories']);
      this.width = 0;
      this.height = 0;
      this.item_module = {};
    }

    calculate_items_matrix() {
      var current_column, current_row, group, i, item_data, item_type, items_by_groups, items_of_type_in_group, len, ref, uid;
      ref = this.item_types;
      for (i = 0, len = ref.length; i < len; i++) {
        item_type = ref[i];
        items_by_groups = this.split_by_groups_and_sort(this.data['items'][item_type]);
        for (group in items_by_groups) {
          items_of_type_in_group = items_by_groups[group];
          if (current_row === void 0) {
            current_row = -1;
          }
          current_row++;
          this.grid_matrix[current_row] = [];
          current_column = 0;
          for (uid in items_of_type_in_group) {
            item_data = items_of_type_in_group[uid];
            if (current_column >= this.max_num_columns_in_row_proc(current_row)) {
              current_row++;
              this.grid_matrix[current_row] = [];
              current_column = 0;
            }
            this.grid_matrix[current_row][current_column] = {
              uid: uid,
              type: item_type,
              data: item_data,
              position: {}
            };
            current_column++;
          }
        }
      }
      return this.grid_matrix;
    }

    calculate_items_positions() {
      var column, current_item_module, item, ref, results, row, row_items;
      if (this.grid_matrix.length === 0) {
        this.calculate_items_matrix();
      }
      if (this.grid_matrix.length === 0) {
        return;
      }
      ref = this.grid_matrix;
      results = [];
      for (row in ref) {
        row_items = ref[row];
        results.push((function() {
          var results1;
          results1 = [];
          for (column in row_items) {
            item = row_items[column];
            current_item_module = this.item_module(row, column);
            results1.push(this.grid_matrix[row][column]['position'] = current_item_module.position());
          }
          return results1;
        }).call(this));
      }
      return results;
    }

    matrix() {
      if (this.grid_matrix.length === 0) {
        return this.calculate_items_matrix();
      }
      return this.grid_matrix;
    }

    split_by_groups_and_sort(items) {
      var $this, current_group, item_data, items_by_groups, push_to_items_by_groups, ref, uid, unsorted_uids_items;
      items_by_groups = {};
      unsorted_uids_items = {};
      $this = this;
      push_to_items_by_groups = function(group, uids_items_in_group) {
        var i, len, results, sorted_uids_items_in_group, uid;
        sorted_uids_items_in_group = $this.sort_items_in_group(uids_items_in_group);
        items_by_groups[group] = {};
        results = [];
        for (i = 0, len = sorted_uids_items_in_group.length; i < len; i++) {
          uid = sorted_uids_items_in_group[i];
          results.push(items_by_groups[group][uid] = items[uid]);
        }
        return results;
      };
      for (uid in items) {
        item_data = items[uid];
        if (ref = item_data['group'].toString(), indexOf.call(Object.keys(unsorted_uids_items), ref) < 0) {
          if ((typeof current_group === "undefined" || current_group === null) || (current_group !== item_data['group'] && (unsorted_uids_items[current_group] != null))) {
            if (typeof current_group !== "undefined" && current_group !== null) {
              push_to_items_by_groups(current_group, unsorted_uids_items[current_group]);
            }
            current_group = item_data['group'];
          }
          unsorted_uids_items[current_group] = {};
        }
        unsorted_uids_items[current_group][uid] = item_data['sort'];
      }
      if ((current_group != null) && (unsorted_uids_items[current_group] != null)) {
        push_to_items_by_groups(current_group, unsorted_uids_items[current_group]);
      }
      return items_by_groups;
    }

    sort_items_in_group(items) {
      var sort_handler;
      sort_handler = function(a, b) {
        if (items[a] < items[b]) {
          return -1;
        }
        return 1;
      };
      return Object.keys(items).sort(sort_handler);
    }

    num_all_items() {
      var i, item_type, len, length_objects, ref;
      length_objects = 0;
      ref = this.item_types;
      for (i = 0, len = ref.length; i < len; i++) {
        item_type = ref[i];
        length_objects += Object.keys(this.data['items'][item_type]).length;
      }
      return length_objects;
    }

    num_rows() {
      if (this.grid_matrix == null) {
        this.calculate();
      }
      return this.grid_matrix.length;
    }

    max_num_columns() {
      var i, len, num_columns_in_rows, ref, row;
      if (this.grid_matrix == null) {
        this.calculate();
      }
      num_columns_in_rows = [];
      ref = this.grid_matrix;
      for (i = 0, len = ref.length; i < len; i++) {
        row = ref[i];
        num_columns_in_rows.push(row.length);
      }
      return this.helpers.getMaxOfArray(num_columns_in_rows);
    }

    drawing_area_width() {
      var default_drawing_area_width, max_columns_area_width, max_num_columns;
      max_num_columns = this.max_num_columns();
      max_columns_area_width = max_num_columns * (this.item_settings['width'] + 2 * this.item_settings['border_width']) + (max_num_columns - 1) * this.grid_settings['horisontal_space_between_items'];
      default_drawing_area_width = this.grid_settings['screen_width'] - this.grid_settings['left_margin'] - this.grid_settings['right_margin'];
      return Math.round(Math.max(max_columns_area_width, default_drawing_area_width) + this.grid_settings['left_margin'] + this.grid_settings['right_margin']);
    }

    drawing_area_center_position() {
      if (this.width === 0) {
        this.width = this.width();
      }
      return Math.round(this.width / 2);
    }

    set_width() {
      if (this.width === 0) {
        this.width = this.drawing_area_width();
      }
      return this.width;
    }

    set_height() {
      var num_rows, row_height_with_borders_and_vertical_gape;
      if (this.height > 0) {
        return this.height;
      }
      num_rows = this.num_rows();
      row_height_with_borders_and_vertical_gape = this.item_settings['height'] + 2 * this.item_settings['border_width'] + this.grid_settings['vertical_space_between_items'];
      this.height = Math.round(this.grid_settings['top_margin'] + num_rows * row_height_with_borders_and_vertical_gape + this.grid_settings['bottom_margin']);
      return this.height;
    }

  };

  init = function(data) {
    var grid;
    grid = new Grid(data);
    grid.calculate_items_matrix();
    grid.set_width();
    grid.set_height();
    grid.item_module = require("./item").init(grid.drawing_area_center_position());
    grid.calculate_items_positions();
    return grid;
  };

  exports.init = init;

}).call(this);
