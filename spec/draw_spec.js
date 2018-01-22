var spec_helpers = require('./spec_helpers').init(),
    module_path = spec_helpers.root_path(),
    fs = require("fs"),
    fixtures_path = module_path + "spec/fixtures",
    data_source = fs.readFileSync(fixtures_path + "/data_example.json", "utf8"),
    data_parser = require(module_path + "/src/data_parser").init(data_source),
    data_hash = data_parser.data,
    described_module = require(module_path + "/src/draw").init(300, 400, data_parser.properties_settings());

describe("draw module", function(){
    it("#merge_styles should return correct merged style for 2 styles", function(){
        var styles_parser =  described_module.styles_parser,
            first_style  = {'style': {'a': 1, 'b': 2, 'c': 3}, 'sort': 1},
            second_style = {'style': {'b': 4, 'c': 5, 'd': 6}, 'sort': 2},
            merged_style = styles_parser.merge_styles(first_style, second_style),
            expected_style = {'a': 1, 'b': 4, 'c': 5, 'd': 6};

        expect(merged_style['style']).toEqual(expected_style);
    });

    it("#parse_item_styles should return correct item styles hash", function(){
        var styles_parser =  described_module.styles_parser,
            item_type = Object.keys(data_hash['categories'])[0],
            item_uid = Object.keys(data_hash['items'][item_type])[0],
            item_data = data_hash['items'][item_type][item_uid],
            merged_style = styles_parser.parse_item_styles(item_type, item_data);

        expect(merged_style['background-color']).toBe('#e0e0e0');
        expect(merged_style['border-color']).toBe('#000');
        expect(merged_style['border-width']).toBe('2px');
    });
});