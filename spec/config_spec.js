var spec_helpers = require('./spec_helpers').init(),
    module_path = spec_helpers.root_path(),
    described_module = require(module_path + "/src/config");

describe("config module", function(){
    var config =  described_module.init();

    it("#settings('grid') should return correct grid constants", function(){
        var grid_constants = config.settings('grid'),
            max_num_columns_in_row = grid_constants['max_num_columns_in_row'];

        expect(typeof grid_constants).toBe('object');
        expect(grid_constants['left_margin']).toBe(50);
        expect(max_num_columns_in_row(0)).toBe(7);
    });
});