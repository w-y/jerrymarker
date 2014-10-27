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
        return Object.prototype.toString.call(obj) === '[object Array]';
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
        var env = envOp('get');

        var context = env.context;

        switch(node.op) {
            case 'assign':
                var v;
                switch(node.rv.type) {
                    case 'expression':
                        v = traverse_expression(node.rv, null, envOp);
                        break;
                    case 'object':
                        v = traverse_object(node.rv, null, envOp);
                        break;
                }
                traverse_assign(node.lv, null, v, envOp);
        }
    }
    function traverse_assign(l, r, newVal, envOp) {
        var q = [];

        _traverse_assign(l, r, newVal, q, envOp);

        _deep_assign(q, newVal, envOp);
    }
    function _deep_assign(keys, val, envOp) {
        var env = envOp('get');
        var context = env.context;

        if (keys.length > 1) {
            var k = keys.shift();

            if (context) {
                context[k] = val;
            }
            if(context[k] === null || typeof context[k] !== 'object') {
                context[k] = {};
            }
            _deep_assign(context[k], keys, val);
        } else {
            context[keys[0]] = val;
        }
    }
    function _traverse_assign(l, r, newVal, q, envOp) {
        var v;
        if (l.op) {
            switch (l.op) {
                case '.':
                    _traverse_assign(l.v1, l.v2, newVal, q, envOp);
                    q.push(l.v2);
                    return;
                case 'value':
                    _traverse_assign(l.v1, l.v2, newVal, q, envOp);
                    if (l.v2) {
                        q.push(l.v2);
                    }
                    return;
            }
        } else {
            q.push(l);
        }
    }
    function traverse_object(l, r, envOp) {
        var v, v1, v2;
        var i = 0;
        var temp;

        var action_table = {
            object: traverse_object,
            expression: traverse_expression
        };
        switch (l.op) {
            case '.':
                v = traverse_object(l.v1, l.v2, envOp);
                if (v) {
                    return v[l.v2];
                }
                return undefined;
            case 'value':
                v = traverse_object(l.v1, l.v2, envOp);
                return v;
            case 'literalvalue':
                return l.v1;
            case 'array':
                temp = [];
                for (i = 0; i < l.v1.length; ++i) {
                    temp.push(action_table[l.v1[i].type](l.v1[i], null, envOp));
                }
                return temp;
            case 'hash':
                temp = {};
                for (var prop in l.v1) {
                    if (l.v1.hasOwnProperty(prop)) {
                        temp[prop] = action_table[l.v1[prop].type](l.v1[prop], null, envOp);
                    }
                }
                return temp;
            case '[]':
                v1 = traverse_object(l.v1, null, envOp);
                v2 = traverse_object(l.v2, null, envOp);

                if (v2 && v1[v2]) {
                    return v1[v2];
                } else {
                    if (l.spare) {
                        l.spare.op = 'literalvalue';
                    }
                    v2 = traverse_object(l.spare, null, envOp);
                    return v1[v2];
                }
                return;
            default:
                return envOp('getKey', l);
        }
    }
    function traverse_expression(l, r, envOp) {
        var v1 = null;
        var v2 = null;
        var temp = null;
        var i = 0;
        switch(l.type) {
            case 'expression':
                switch(l.op) {
                    case '*':
                        return traverse_expression(l.v1, null, envOp) * traverse_expression(l.v2, null, envOp);
                    case '+':
                        v1 = traverse_expression(l.v1, null, envOp);
                        v2 = traverse_expression(l.v2, null, envOp);

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
                        return traverse_expression(l.v1, null, envOp) % traverse_expression(l.v2, null, envOp);
                    case '==':
                        return (traverse_expression(l.v1, null, envOp) == traverse_expression(l.v2, null, envOp));
                    case '!=':
                        return (traverse_expression(l.v1, null, envOp) != traverse_expression(l.v2, null, envOp));
                    case '-':
                        return (traverse_expression(l.v1, null, envOp) - traverse_expression(l.v2, null, envOp));
                    case '/':
                        return (traverse_expression(l.v1, null, envOp) / traverse_expression(l.v2, null, envOp));
                    case 'eval':
                        return (traverse_expression(l.v1, null, envOp));
                    case 'uminus':
                        return -(traverse_expression(l.v1, null, envOp));
                    case 'unot':
                        return !(traverse_expression(l.v1, null, envOp));
                    case 'exist':
                        return existy(traverse_expression(l.v1, null, envOp));
                    case 'existset':
                        temp = traverse_expression(l.v1, null, envOp);
                        if (!existy(temp)) {
                            var spare = traverse_expression(l.v2, null, envOp);
                            return spare;
                        }
                        return;
                    case 'trueset':
                        return traverse_expression(l.v1, null, envOp) ? traverse_expression(l.v2, null, envOp) : traverse_expression(l.v3, null, envOp);
                    case 'tohtml':
                        return htmlspecialchars((traverse_expression(l.v1, null, envOp)));
                    case 'keys':
                        return getKeys(traverse_expression(l.v1, null, envOp));
                    case '||' :
                        return traverse_expression(l.v1, null, envOp) || traverse_expression(l.v2, null, envOp);
                    case '&&' :
                        return traverse_expression(l.v1, null, envOp) && traverse_expression(l.v2, null, envOp);
                    case '>' :
                        return traverse_expression(l.v1, null, envOp) > traverse_expression(l.v2, null, envOp);
                    case '<' :
                        return traverse_expression(l.v1, null, envOp) < traverse_expression(l.v2, null, envOp);
                    case '>=' :
                        return traverse_expression(l.v1, null, envOp) >= traverse_expression(l.v2, null, envOp);
                    case '<=' :
                        return traverse_expression(l.v1, null, envOp) <= traverse_expression(l.v2, null, envOp);
                }
                break;
            case 'object':
                return traverse_object(l, null, envOp);
        }
    }
    function traverse_if(root, envOp) {
        if (root.cond) {
            if (true === traverse_expression(root.cond, null, envOp)) {
                traverse(root.statement, envOp);
            } else {
                var curr = root;

                while (curr) {
                    var v = traverse_expression(curr.cond, null, envOp);
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
        envOp('addFunc', node.name, function(param) {
            return node;
        });
    }
    function traverse_custom(node, envOp) {
        var func = envOp('getFunc', node.key);
        var localEnv;
        var content;
        var result;
        var macroNode;
        var env;
        var context;
        var props;
        var propsParent;

        props = traverse_object(node.prop, null, envOp);

        propsParent = envOp('getKeyThis', 'props');

        if (!props) {
            props = {};
        }
        if (!propsParent) {
            propsParent = {};
        }

        if (func) {
            localEnv = _build_local_env();

            envOp('push', localEnv);

            envOp('setKey', 'this', {
                props:deepObjectExtend(props, propsParent)
            });

            if (props && props.watch) {

                envOp('watch', props.watch, function(newData) {
                    var result;

                    localEnv = _build_local_env();

                    envOp('push', localEnv);
                    envOp('setKey', 'this', {
                        props:newData
                    });

                    result = traverse(macroNode.content, envOp);

                    envOp('pop', localEnv);

                    return result;
                });
            }

            env = envOp('get');

            traverse(node.content, envOp);

            content = envOp('bufferOut');

            macroNode = func.call(this, content);

            result = traverse(macroNode.content, envOp);

            envOp('pop', localEnv);

            envOp('bufferIn', result);
        }
    }

    function traverse_list(node, envOp) {
        var i;
        var collection = [];
        var localEnv;
        var content;

        if (node.isRange) {
            if (node.collection && 2 === node.collection.length) {
                var start = parseInt(traverse_object(node.collection[0], null, envOp), 10);
                var end = parseInt(traverse_object(node.collection[1], null, envOp), 10);
                var step = 1;

                while (start < end) {
                    collection.push(start);
                    start += step;
                }
            }
        }
        else {
            if (node.collection) {
                collection = traverse_object(node.collection, null, envOp);
            }
        }

        localEnv = _build_local_env(envOp);
        envOp('push', localEnv);

        if (collection) {
            for (i = 0; i < collection.length; ++i) {
                traverse_assign(node.alias, null, collection[i], envOp);
                traverse(node.statement, envOp);
            }
        }
        content = envOp('bufferOut');
        envOp('pop');

        envOp('bufferIn', content);
    }
    function traverse(node, envOp) {
        var env;
        var action_table;

        if (!node) {
            return;
        }
        env = envOp('get');

        action_table = {
            content: function(node, envOp) {
                for(var i = 0; i < node.v.length; ++i) {
                    traverse(node.v[i], envOp);
                }
            },
            literal: function(node, envOp) {
                envOp('bufferIn', node.v);
            },
            object: function(node, envOp) {
                envOp('bufferIn', traverse_object(node, null, envOp));
            },
            iterpolation: function(node, envOp) {
                traverse(node.v, envOp);
            },
            expression: function(node, envOp) {
                envOp('bufferIn', traverse_expression(node, null, envOp));
            },
            'if': traverse_if,
            list: traverse_list,
            statement: traverse_statement,
            custom: traverse_custom,
            macro: traverse_macro
        };
        action_table[node.type](node, envOp);

        return envOp('bufferOut');
    }
    function compile(input) {
        var root = this.parse(input);
        var _this = this;
        var i;
        var test;

        if (root) {
            var f = function(context) {
                f.set = function(data, key, callback) {
                    var i;
                    var result = [];
                    if (!f.watches) {
                        f.watches = [];
                    }

                    for (i = 0; i < f.watches.length; i++) {

                        if (f.watches[i].key === key) {
                            result.push({
                                data: f.watches[i].func.call(null, data)
                            });
                        }
                    }
                    callback.call(null, result);
                };
                var env = [{
                    func_table: {},
                        buffer: [],
                        context: context
                }];

                var envOp = function(op, param1, param2) {
                    var currEnv = env[env.length-1];
                    var action_table = {
                        watch: function(param1, param2) {
                            if (!f.watches) {
                                f.watches = [];
                            }
                            f.watches.push({
                                key: param1,
                            func: param2
                            });
                        },
                        bufferIn: function(param1) {
                            currEnv.buffer.push(param1);
                            return;
                        },
                        bufferOut: function() {
                            return currEnv.buffer.join('');
                        },
                        addFunc: function(param1, param2) {
                            currEnv.func_table[param1] = param2;
                            return;
                        },
                        getFunc: function(param1) {
                            for (i=env.length-1; i>=0; i--) {
                                test = env[i].func_table[param1];
                                if (existy(test)) {
                                    return test;
                                }
                            }
                        },
                        get: function() {
                            return currEnv;
                        },
                        push: function(param1) {
                            env.push(param1);
                        },
                        pop: function() {
                            return env.pop();
                        },
                        setKey: function(param1, param2) {
                            currEnv.context[param1] = param2;
                        },
                        getKey: function(param1) {
                            for (i=env.length-1; i>=0; i--) {
                                test = env[i].context[param1];
                                if (existy(test)) {
                                    return test;
                                }
                            }
                        },
                        getKeyThis: function(param1) {
                            for (i=env.length-1; i>=0; i--) {
                                test = env[i].context.this;
                                if (existy(test)) {
                                    return test[param1];
                                }
                            }
                        },
                        debug: function() {
                            console.log(env);
                            return;
                        }
                    };
                    return action_table[op](param1, param2);
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
