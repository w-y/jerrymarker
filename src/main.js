if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
    exports.parser = jerrymarker;
    exports.Parser = jerrymarker.Parser;
    exports.main = function commonjsMain(args) {
        if (!args[1]) {
            console.log('Usage: '+args[0]+' FILE');
            process.exit(1);
        }
        var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
        return exports.parser.parse(source);
    };
    if (typeof module !== 'undefined' && require.main === module) {
        exports.main(process.argv.slice(1));
    }
}

