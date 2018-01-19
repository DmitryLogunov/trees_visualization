class Trees
  constructor: (json_data) ->
    @data_parser = require("./data_parser").init(json_data)
    @grid = require("./grid").init(@data_parser.data)
    @data_matrix = @grid.matrix()
    @draw = require("./draw").init(@grid.width, @grid.height, @data_parser.properties_settings())

  svg: () ->
    @draw.items(@data_matrix).svg()

init = (json_data) ->
  new Trees(json_data)

exports.init = init