if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
    exports.parser = jerrymarker;
    exports.Parser = jerrymarker.Parser;
    exports.main = function commonjsMain(args) {
        if (!args[1]) {
            console.log('Usage: '+args[0]+' FILE');
            process.exit(1);
        }
        var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
        var template = exports.parser.compile(source);
        var context = {};
        console.log(template(context));
    };
    if (typeof module !== 'undefined' && require.main === module) {
        exports.main(process.argv.slice(1));
    }
}

