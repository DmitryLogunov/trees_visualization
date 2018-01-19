class DataParser
  constructor: (json_data) ->
    @data = JSON.parse(json_data)['data']

  properties_settings: () ->
    categories_styles = {}
    for item_type, category of @data['categories']
      categories_styles[item_type] = category['style']
    properties = {}
    for item_type, category of @data['categories']
      properties[item_type] = category['properties']
    styles = {}
    for style_uid, style of @data['styles']
      styles[style_uid] = style
    {
      categories_styles: categories_styles,
      properties: properties,
      styles: styles
    }

init = (json_data) ->
  new DataParser(json_data)

exports.init = init