var spec_helpers = require('./spec_helpers').init(),
    module_path = spec_helpers.root_path(),
    fixtures_path = module_path + "/spec/fixtures",
    fs = require("fs"),
    config = require(module_path + '/src/config').init(),
    data_source = fs.readFileSync(fixtures_path + '/data_example.json', "utf8"),
    data_parser = require(module_path + "/src/data_parser").init(data_source),
    grid = require(module_path + "/src/grid").init(data_parser.data),
    items_matrix = grid.matrix();

describe("grid module", function(){
  it("#init should correctly init grid object from json data", function(){
      expect(typeof grid.data).toBe('object');
      expect(typeof grid.data['items']).toBe('object');
      expect(grid.width).toBe(1524);
      expect(grid.height).toBe(916);
  });

  it("#calculate should return items matrix (with grouping)", function(){
      expect(typeof items_matrix).toBe('object');
      expect(items_matrix.length).toBe(4);
      expect(items_matrix[0].length).toBe(3);
      expect(items_matrix[1].length).toBe(6);
      expect(items_matrix[2].length).toBe(4);
      expect(items_matrix[3].length).toBe(2);
      expect(items_matrix[0][0]['uid']).toBe('uid_person_3');
      expect(items_matrix[0][1]['uid']).toBe('uid_person_2');
      expect(items_matrix[0][2]['uid']).toBe('uid_person_1');
      expect(items_matrix[3][1]['position']['left']).toBe(922);
      expect(items_matrix[3][1]['position']['top']).toBe(662);
      expect(items_matrix[3][1]['position']['right']).toBe(1101);
      expect(items_matrix[3][1]['position']['bottom']).toBe(766);
  });
});