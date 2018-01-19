class Draw
  constructor: (width, height, properties_settings) ->
    window = require('svgdom')
    SVG    = require('svg.js')(window)
    document = window.document
    @draw = SVG(document.documentElement).size(width, height)
    @styles_parser = new StylesParser(properties_settings)

  clear: () ->
    @draw.clear()
    this

  svg: () ->
    @draw.svg()

  item_box: (item) ->
    item_style = @styles_parser.parse_item_styles(item['type'], item['data'])
    this.draw_handler('item_box', [item['position']], item_style).call()
    this

  items: (items_matrix) ->
    for rows in items_matrix
      for item in rows
        this.item_box(item)
    this

  draw_handler: (type, positions, style) ->
    $this = this
    () ->
      switch type
        when 'item_box'
          left = positions[0]['left']
          top = positions[0]['top']
          width = positions[0]['right'] - positions[0]['left']
          height = positions[0]['bottom'] - positions[0]['top']
          $this.draw.rect(width, height).radius(8).fill('yellow').move(left, top)

  class StylesParser
    constructor: (properties_settings) ->
      @properties_settings = properties_settings

    get_item_styles: (item_type, item_data) ->
      properties_styles = {}
      default_category_style =  @properties_settings['styles'][@properties_settings['categories_styles'][item_type]]
      default_category_style = {} unless default_category_style?
      for property_uid, property of @properties_settings['properties'][item_type]
        value_style = @properties_settings['styles'][property['values'][item_data[property_uid]]]
        value_style = {} unless value_style?
        properties_styles[property_uid] =
          {
            default_property_style: @properties_settings['styles'][property['style']],
            sort: property['sort'],
            value_style: value_style
          }
      {
        default_category_style: default_category_style,
        properties_styles: properties_styles
      }

    parse_item_styles: (item_type, item_data) ->
      # возвращает hash определния стиля для заданного item (ключи - css свойства)
      # алгоритм:
      # - получаем hash стилей (get_item_styles)
      # - для каждого property в хэше стилей определяем приоритетеный стиль (merge default_property_style и value_style c приоритетеом value_style)
      # - определяем приоритетеный стиль по всем properties /merged_properties_style/ (merge c учетом sort по каждому значению хэшей определений стилей)
      # - merge default_category_style и merged_properties_style (c приоритетом merged_properties_style по каждому свойству хэшей определений стилей)

    merge_styles: (first_style, second_style) ->
      # first_style, second_style = {'style': {хэш с определением стиля, ключи - свойства css}, 'sort': числовое_значение_веса_стиля }
      # возвращает {хэш с определением стиля; ключи - свойства css, объединение ключей обоих стилей}
      # алгоритм:
      # -- получаем массив объединения ключей-свойств хэшей стилей
      # -- определяем результирующий хэш
      # -- добавлем в результирующий хэш значения для каждого совйства, перебирая по всем ключам и сравнивая веса стилей:
      #    --- если в одном из хешей стилей ключа нет - берем значение из того, в котором значения для ключа определено
      #    --- если определено в обоих хэшах, берем из того, в котором sort больше; если sort одинаковое - берем значение из first_style

init = (width, height, properties_settings) ->
  new Draw(width, height, properties_settings)

exports.init = init