(function() {
    var SpecHelpers, init;

    SpecHelpers = (function() {
        function SpecHelpers() {}

        SpecHelpers.prototype.root_path = function() {
            var dirname = __dirname.split('/'), i, path = "/";
            for (i = 0, len = dirname.length; i < len; i++) {
                if(dirname[i] != "" && dirname[i] != "spec") { path += dirname[i] +"/"; }
            }
            return path;
        };

        return SpecHelpers;

    })();

    init = function() {
        return new SpecHelpers;
    };

    exports.init = init;

}).call(this);