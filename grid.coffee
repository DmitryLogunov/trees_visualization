class Grid
  constructor: (data) ->
    config = require("./config").init()
    @grid_settings = config.settings('grid')
    @item_settings = config.settings('item')
    @max_num_columns_in_row_proc = @grid_settings['max_num_columns_in_row']
    @helpers = require("./helpers").init()
    @data = data
    @grid_matrix = []
    @item_types = Object.keys(@data['categories'])
    @width = 0
    @height = 0
    @item_module = {}

  calculate_items_matrix: () ->
    for item_type in @item_types
      items_by_groups = this.split_by_groups_and_sort(@data['items'][item_type])
      for group, items_of_type_in_group of items_by_groups
        current_row = -1 if current_row == undefined
        current_row++
        @grid_matrix[current_row] = []
        current_column = 0
        for uid, item_data  of items_of_type_in_group
          if current_column >= @max_num_columns_in_row_proc(current_row)
            current_row++
            @grid_matrix[current_row] = []
            current_column = 0
          @grid_matrix[current_row][current_column] =
            uid: uid,
            type: item_type,
            data: item_data,
            position: {}
          current_column++
    @grid_matrix

  calculate_items_positions: () ->
    this.calculate_items_matrix() if @grid_matrix.length == 0
    return if @grid_matrix.length == 0
    for row, row_items of  @grid_matrix
      for column, item of row_items
        current_item_module = @item_module(row, column)
        @grid_matrix[row][column]['position'] = current_item_module.position()

  matrix: () ->
    return this.calculate_items_matrix() if @grid_matrix.length == 0
    @grid_matrix

  split_by_groups_and_sort: (items) ->
    items_by_groups = {}
    unsorted_uids_items = {}
    $this = this
    push_to_items_by_groups = (group, uids_items_in_group) ->
      sorted_uids_items_in_group = $this.sort_items_in_group(uids_items_in_group)
      items_by_groups[group] = {}
      for uid in sorted_uids_items_in_group
        items_by_groups[group][uid] = items[uid]
    for uid, item_data  of items
      if item_data['group'].toString() not in Object.keys(unsorted_uids_items)
        if !current_group? || ( current_group != item_data['group'] && unsorted_uids_items[current_group]?)
          push_to_items_by_groups(current_group, unsorted_uids_items[current_group]) if current_group?
          current_group = item_data['group']
        unsorted_uids_items[current_group] = {}
      unsorted_uids_items[current_group][uid] = item_data['sort']
    if current_group? && unsorted_uids_items[current_group]?
      push_to_items_by_groups(current_group, unsorted_uids_items[current_group])
    items_by_groups

  sort_items_in_group: (items) ->
    sort_handler = (a, b) ->
      return -1 if items[a] < items[b]
      1
    Object.keys(items).sort(sort_handler)

  num_all_items: () ->
    length_objects = 0
    for item_type in @item_types
      length_objects += Object.keys(@data['items'][item_type]).length
    length_objects

  num_rows: () ->
    this.calculate() unless @grid_matrix?
    @grid_matrix.length

  max_num_columns: () ->
    this.calculate() unless @grid_matrix?
    num_columns_in_rows = []
    for row in @grid_matrix
      num_columns_in_rows.push(row.length)
    @helpers.getMaxOfArray(num_columns_in_rows)

  drawing_area_width: () ->
    max_num_columns = this.max_num_columns()
    max_columns_area_width = max_num_columns*( @item_settings['width'] +  2*@item_settings['border_width']) +
      ( max_num_columns - 1 )*@grid_settings['horisontal_space_between_items']
    default_drawing_area_width = @grid_settings['screen_width']  - @grid_settings['left_margin'] - @grid_settings['right_margin']
    Math.round(Math.max(max_columns_area_width, default_drawing_area_width) + @grid_settings['left_margin'] + @grid_settings['right_margin'])

  drawing_area_center_position: () ->
    @width = this.width() if @width == 0
    Math.round( @width / 2 )

  set_width: () ->
    @width = this.drawing_area_width() if @width == 0
    @width

  set_height: () ->
    return @height if @height > 0
    num_rows = this.num_rows()
    row_height_with_borders_and_vertical_gape = @item_settings['height'] + 2*@item_settings['border_width'] + @grid_settings['vertical_space_between_items']
    @height = Math.round(@grid_settings['top_margin'] + num_rows*row_height_with_borders_and_vertical_gape + @grid_settings['bottom_margin'])
    @height

init = (data) ->
  grid = new Grid(data)
  grid.calculate_items_matrix()
  grid.set_width()
  grid.set_height()
  grid.item_module = require("./item").init(grid.drawing_area_center_position())
  grid.calculate_items_positions()
  grid

exports.init = init