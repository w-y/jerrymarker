(function() {
    var util = this.util = this.yy.util = {};

    util.traverse = traverse;

    util.stack = [];

    util.deepObjectExtend = deepObjectExtend;

    this.compile = compile;

    var nativeIsArray = Array.isArray;

    /* jshint ignore:start */
    function existy(v) {
        return null != v;
    }
    /* jshint ignore:end */
    function htmlspecialchars(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    }
    function htmlspecialchars_decode(str) {
        return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, '\'');
    }
    function getKeys(obj) {
        var r = [];
        for (var k in obj) {
            if (!obj.hasOwnProperty(k)) {
                continue;
            }
            r.push(k);
        }
        return r;
    }
    var isArray = nativeIsArray || function(obj) {
        return toString.call(obj) === '[object Array]';
    };
    var isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    function deepObjectExtend(target, source) {
        for (var prop in source) {
            if (prop in target) {
                deepObjectExtend(target[prop], source[prop]);
            } else {
                target[prop] = source[prop];
            }
        }
        return target;
    }
    /* jshint ignore:start */
    function deepCopy(src, /* INTERNAL */ _visited) {
        if(src == null || typeof(src) !== 'object'){
            return src;
        }

        // Initialize the visited objects array if needed
        // This is used to detect cyclic references
        if (_visited == undefined){
            _visited = [];
        }
        // Otherwise, ensure src has not already been visited
        else {
            var i, len = _visited.length;
            for (i = 0; i < len; i++) {
                // If src was already visited, don't try to copy it, just return the reference
                if (src === _visited[i]) {
                    return src;
                }
            }
        }

        // Add this object to the visited array
        _visited.push(src);

        //Honor native/custom clone methods
        if(typeof src.clone == 'function'){
            return src.clone(true);
        }

        //Special cases:
        //Array
        if (Object.prototype.toString.call(src) == '[object Array]') {
            //[].slice(0) would soft clone
            ret = src.slice();
            var i = ret.length;
            while (i--){
                ret[i] = deepCopy(ret[i], _visited);
            }
            return ret;
        }
        //Date
        if (src instanceof Date){
            return new Date(src.getTime());
        }
        //RegExp
        if(src instanceof RegExp){
            return new RegExp(src);
        }
        //DOM Elements
        if(src.nodeType && typeof src.cloneNode == 'function'){
            return src.cloneNode(true);
        }

        //If we've reached here, we have a regular object, array, or function

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
    /* jshint ignore:end*/
    function traverse_statement(node, envOp) {
        console.log(envOp('debug'));
        var env = envOp('get');

        var context = env.context;
        console.log(context);

        switch(node.op) {
            case 'assign':
                var v;
                switch(node.rv.type) {
                    case 'expression':
                        v = traverse_expression(node.rv, null, context);
                        break;
                    case 'object':
                        v = traverse_object(node.rv, null, context);
                        break;
                }
                traverse_assign(node.lv, null, context, v);
        }
        console.log('#############');
        console.log(envOp('debug'));
        console.log('#############');
    }
    function traverse_assign(l, r, c, newVal) {
        console.log('---------------');
        console.log(l);
        console.log(newVal);
        console.log('---------------');
        var q = [];
        _traverse_assign(l, r, c, newVal, q);
        console.log(q);

        _deep_assign(c, q, newVal);
    }
    function _deep_assign(obj, keys, val) {
        if (keys.length > 1) {
            var k = keys.shift();

            if (obj) {
                obj[k] = val;
            }
            if(obj[k] === null || typeof obj[k] !== 'object') {
                obj[k] = {};
            }
            _deep_assign(obj[k], keys, val);
        } else {
            obj[keys[0]] = val;
        }
    }
    function _traverse_assign(l, r, c, newVal, q) {
        var v;
        if (l.op) {
            switch (l.op) {
                case '.':
                    _traverse_assign(l.v1, l.v2, c, newVal, q);
                    q.push(l.v2);
                    return;
                case 'value':
                    _traverse_assign(l.v1, l.v2, c, newVal, q);
                    if (l.v2) {
                        q.push(l.v2);
                    }
                    return;
            }
        } else {
            q.push(l);
        }
    }
    function traverse_object(l, r, c, envOp) {
        var v, v1, v2;
        var i = 0;
        var temp;

        var func_table = {
            object: traverse_object,
            expression: traverse_expression
        };
        switch (l.op) {
            case '.':
                v = traverse_object(l.v1, l.v2, c, envOp);
                return v[l.v2];
            case 'value':
                v = traverse_object(l.v1, l.v2, c, envOp);
                return v;
            case 'literalvalue':
                return l.v1;
            case 'array':
                temp = [];
                for (i = 0; i < l.v1.length; ++i) {
                    temp.push(func_table[l.v1[i].type](l.v1[i], null, c, envOp));
                }
                return temp;
            case 'hash':
                temp = {};
                for (var prop in l.v1) {
                    if (l.v1.hasOwnProperty(prop)) {
                        temp[prop] = func_table[l.v1[prop].type](l.v1[prop], null, c, envOp);
                    }
                }
                return temp;
            case '[]':
                v1 = traverse_object(l.v1, null, c, envOp);
                v2 = traverse_object(l.v2, null, c, envOp);

                if (v2 && v1[v2]) {
                    return v1[v2];
                } else {
                    if (l.spare) {
                        l.spare.op = 'literalvalue';
                    }
                    v2 = traverse_object(l.spare, null, null, envOp);
                    return v1[v2];
                }
                return;
            default:
                return envOp('getKey', l);
                /*if (c) {
                    return c[l];
                } else {
                    return undefined;
                }*/
        }
    }
    function traverse_expression(l, r, context) {
        var v1 = null;
        var v2 = null;
        var temp = null;
        var i = 0;
        switch(l.type) {
            case 'expression':
                switch(l.op) {
                    case '*':
                        return traverse_expression(l.v1, null, context) * traverse_expression(l.v2, null, context);
                    case '+':
                        v1 = traverse_expression(l.v1, null, context);
                        v2 = traverse_expression(l.v2, null, context);

                        if (isArray(v1)) {
                            i = 0;
                            temp = [];

                            for (i = 0; i < v1.length; i++) {
                                temp.push(deepCopy(v1[i]));
                            }

                            if (isArray(v2)) {
                                for (i = 0; i < v2.length; i++) {
                                    temp.push(deepCopy(v2[i]));
                                }
                            } else {
                                temp.push(deepCopy(v2));
                            }
                            return temp;
                        }
                        return v1 + v2;
                    case '%':
                        return traverse_expression(l.v1, null, context) % traverse_expression(l.v2, null, context);
                    case '==':
                        return (traverse_expression(l.v1, null, context) == traverse_expression(l.v2, null, context));
                    case '!=':
                        return (traverse_expression(l.v1, null, context) != traverse_expression(l.v2, null, context));
                    case '-':
                        return (traverse_expression(l.v1, null, context) - traverse_expression(l.v2, null, context));
                    case '/':
                        return (traverse_expression(l.v1, null, context) / traverse_expression(l.v2, null, context));
                    case 'eval':
                        return (traverse_expression(l.v1, null, context));
                    case 'uminus':
                        return -(traverse_expression(l.v1, null, context));
                    case 'unot':
                        return !(traverse_expression(l.v1, null, context));
                    case 'exist':
                        return existy(traverse_expression(l.v1, null, context));
                    case 'existset':
                        temp = traverse_expression(l.v1, null, context);
                        if (!existy(temp)) {
                            var spare = traverse_expression(l.v2, null, context);
                            return spare;
                        }
                        return;
                    case 'trueset':
                        return traverse_expression(l.v1, null, context) ? traverse_expression(l.v2, null, context) : traverse_expression(l.v3, null, context);
                    case 'tohtml':
                        return htmlspecialchars((traverse_expression(l.v1, null, context)));
                    case 'keys':
                        return getKeys(traverse_expression(l.v1, null, context));
                    case '||' :
                        return traverse_expression(l.v1, null, context) || traverse_expression(l.v2, null, context);
                    case '&&' :
                        return traverse_expression(l.v1, null, context) && traverse_expression(l.v2, null, context);
                    case '>' :
                        return traverse_expression(l.v1, null, context) > traverse_expression(l.v2, null, context);
                    case '<' :
                        return traverse_expression(l.v1, null, context) < traverse_expression(l.v2, null, context);
                    case '>=' :
                        return traverse_expression(l.v1, null, context) >= traverse_expression(l.v2, null, context);
                    case '<=' :
                        return traverse_expression(l.v1, null, context) <= traverse_expression(l.v2, null, context);
                }
                break;
            case 'object':
                return traverse_object(l, null, context);
        }
    }
    function traverse_if(root, context, envOp) {
        if (root.cond) {
            if (true === traverse_expression(root.cond, null, context)) {
                traverse(root.statement, envOp);
            } else {
                var curr = root;

                while (curr) {
                    var v = traverse_expression(curr.cond, null, context);
                    if (v) {
                        traverse(curr.statement, envOp);
                        break;
                    }
                    curr = curr.child;
                }
                return;
            }
        }
    }

    function _build_local_env() {
        var localEnv = {
            buffer: [],
            context: {},
            func_table: {}
        };
        return localEnv;
    }
    function traverse_macro(node, envOp) {
        var localEnv = _build_local_env(envOp);
        var env;
        var content;
        var context;

        envOp('push', localEnv);
        env = envOp('get');
        context = env.context;

        console.log('^^^^^^^^^');
        console.log(context);
        console.log('^^^^^^^^^');
        traverse(node.content, envOp);

        content = envOp('bufferOut');

        envOp('pop', localEnv);

        envOp('addFunc', node.name, function(param) {
            return content;
        });
    }
    function traverse_custom(node, envOp) {
        var func = envOp('getFunc', node.key);
        var localEnv;
        var content;
        var result;
        var env;
        var context;

        if (func) {
            localEnv = _build_local_env();

            envOp('push', localEnv);

            env = envOp('get');
            context = env.context;

            traverse(node.content, envOp);

            content = envOp('bufferOut');

            result = func.call(this, content);

            envOp('pop', localEnv);

            envOp('bufferIn', result);
        }
    }

    function traverse_list(node, context, envOp) {
        var i;
        var collection = [];
        if (node.isRange) {
            if (node.collection && 2 === node.collection.length) {
                var start = parseInt(traverse_object(node.collection[0], null, context), 10);
                var end = parseInt(traverse_object(node.collection[1], null, context), 10);
                var step = 1;

                while (start < end) {
                    collection.push(start);
                    start += step;
                }
            }
        }
        else {
            if (node.collection) {
                collection = traverse_object(node.collection, null, context);
            }
        }

        for (i = 0; i < collection.length; ++i) {
            traverse_assign(node.alias, null, context, collection[i]);
            traverse(node.statement, envOp);
        }
    }
    function traverse(node, envOp) {
        var env;
        if (!node) {
            return;
        }
        env = envOp('get');
        context = env.context;

        switch (node.type) {
            case 'content':
                for(var i = 0; i < node.v.length; ++i) {
                    traverse(node.v[i], envOp);
                }
                break;
            case 'literal':
                envOp('bufferIn', node.v);
                break;
            case 'object':
                envOp('bufferIn', traverse_object(node, null, context, envOp));
                break;
            case 'iterpolation':
                traverse(node.v, envOp);
                break;
            case 'expression':
                envOp('bufferIn', traverse_expression(node, null, context));
                break;
            case 'if':
                traverse_if(node, context, envOp);
                break;
            case 'list':
                traverse_list(node, context, envOp);
                break;
            case 'statement':
                traverse_statement(node, envOp);
                break;
            case 'custom':
                traverse_custom(node, envOp);
                break;
            case 'macro':
                traverse_macro(node, envOp);
                break;
        }
        return envOp('bufferOut');
    }

    function compile(input) {
        var root = this.parse(input);
        var _this = this;
        var i;

        if (root) {
            var f = function(context) {
                var env = [{
                    func_table: {},
                    buffer: [],
                    context: context
                }];

                var envOp = function(op, param1, param2) {
                    var currEnv = env[env.length-1];
                    switch(op) {
                        case 'bufferIn':
                            currEnv.buffer.push(param1);
                            return;
                        case 'bufferOut':
                            return currEnv.buffer.join('');
                        case 'addFunc':
                            currEnv.func_table[param1] = param2;
                            return;
                        case 'getFunc':
                            return currEnv.func_table[param1];
                        case 'get':
                            return currEnv;
                        case 'push':
                            env.push(param1);
                            return;
                        case 'pop':
                            return env.pop();
                        case 'getKey':
                            for (var i=env.length-1; i>=0; i--) {
                                var test = env[i].context[param1];
                                if (!existy(test)) {
                                    return test;
                                }
                            }
                            return null;
                        case 'debug':
                            console.log(env);
                            return;
                        default:
                            break;
                    }
                };

                var result = traverse(root, envOp);

                _this.util.stack = [];
                return result;
            };
            f.ast = root;
            return f;
        }
        return null;
    }
}).call(jerrymarker);
