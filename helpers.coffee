class Helpers
  constructor: () ->

  getMaxOfArray: (array) ->
    Math.max.apply(null, array);

init = () ->
  new Helpers

exports.init = init