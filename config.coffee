class Config
  constructor: () ->
    @module_path = __dirname.split('/')

  settings: (type) ->
    switch type
      when 'grid'
        {
          'screen_width': 1200,
          'left_margin': 50,
          'right_margin': 50,
          'top_margin': 50,
          'bottom_margin': 50,
          'header_height': 100,
          'vertical_space_between_items': 100,
          'horisontal_space_between_items': 70,
          'max_num_columns': 8,
          'max_num_columns_in_row': (row) ->
            if row == 0 then 7 else 8
        }
      when 'item'
        {
          'width': 175,
          'height': 100,
          'border_width': 2
        }

init = () ->
  new Config

exports.init = init