class Item
  constructor: (row, column, drawing_area_center_position) ->
    config = require("./config").init()
    @row = row
    @column = column
    @drawing_area_center_position = drawing_area_center_position
    @grid_settings = config.settings('grid')
    @item_settings = config.settings('item')

  position: () ->
    {
      'left': this.left_border_position(),
      'right': this.right_border_position(),
      'top': this.top_border_position(),
      'bottom': this.bottom_border_position()
    }

  left_border_position: () ->
    item_width_with_right_space = @item_settings['width'] + 2*@item_settings['border_width'] + @grid_settings['horisontal_space_between_items']
    start_x_position = @drawing_area_center_position - (parseInt(@item_settings['width']) / 2) - @item_settings['border_width']
    shift = (if parseInt(@column) % 2 == 0 then -1 else 1)*Math.round(( parseInt(@column) ) / 2 )*item_width_with_right_space
    Math.round(start_x_position + shift)

  right_border_position: () ->
    Math.round(this.left_border_position() + @item_settings['width'] + 2*@item_settings['border_width'])

  top_border_position: () ->
    item_height_with_bottom_space = @item_settings['height'] + 2*@item_settings['border_width'] + @grid_settings['vertical_space_between_items']
    Math.round(@grid_settings['top_margin'] + @row*item_height_with_bottom_space)

  bottom_border_position: () ->
    Math.round(this.top_border_position() + @item_settings['height'] + 2*@item_settings['border_width'])

init = (drawing_area_center_position) ->
  (row, column) ->
    new Item(row, column, drawing_area_center_position)


exports.init = init