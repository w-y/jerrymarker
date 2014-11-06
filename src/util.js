/* jshint ignore:start */
(function() {
    var util = this.util = this.yy.util = {};

    util._lexStack = [];

    var nativeIsArray = Array.isArray;

    util.isArray = isArray = nativeIsArray || function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };
    util.isObject = isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    util.existy = function existy(v) {
        return null != v;
    }

    util.htmlspecialchars = function htmlspecialchars(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    }
    util.htmlspecialchars_decode = function htmlspecialchars_decode(str) {
        return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, '\'');
    }

    util.getKeys = function getKeys(obj) {
        var r = [];
        for (var k in obj) {
            if (!obj.hasOwnProperty(k)) {
                continue;
            }
            r.push(k);
        }
        return r;
    }

    util.deepObjectExtend = function deepObjectExtend(target, source) {
        for (var prop in source) {
            if (prop in target) {
                deepObjectExtend(target[prop], source[prop]);
            } else {
                target[prop] = source[prop];
            }
        }
        return target;
    }
    util.deepCopy = function deepCopy(src, /* INTERNAL */ _visited) {
        if(src == null || typeof(src) !== 'object'){
            return src;
        }

        if (_visited == undefined){
            _visited = [];
        } else {
            var i, len = _visited.length;
            for (i = 0; i < len; i++) {
                if (src === _visited[i]) {
                    return src;
                }
            }
        }
        _visited.push(src);

        if(typeof src.clone == 'function'){
            return src.clone(true);
        }

        if (Object.prototype.toString.call(src) == '[object Array]') {
            ret = src.slice();
            var i = ret.length;
            while (i--) {
                ret[i] = deepCopy(ret[i], _visited);
            }
            return ret;
        }
        if (src instanceof Date){
            return new Date(src.getTime());
        }
        if(src instanceof RegExp){
            return new RegExp(src);
        }
        if(src.nodeType && typeof src.cloneNode == 'function'){
            return src.cloneNode(true);
        }

        //make sure the returned object has the same prototype as the original
        var proto = (Object.getPrototypeOf ? Object.getPrototypeOf(src): src.__proto__);
        if (!proto) {
            proto = src.constructor.prototype; //this line would probably only be reached by very old browsers
        }
        var ret = Object.create(proto);

        for(var key in src){
            //Note: this does NOT preserve ES5 property attributes like 'writable', 'enumerable', etc.
            //For an example of how this could be modified to do so, see the singleMixin() function
            ret[key] = deepCopy(src[key], _visited);
        }
        return ret;
    }
}).call(jerrymarker);
/* jshint ignore:end */
