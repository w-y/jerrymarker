(function() {
    var util = this.util;

    this.compile = compile;

    function _build_local_env() {
        var localEnv = {
            buffer: [],
            context: {},
            func_table: {}
        };
        return localEnv;
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
                                if (util.existy(test)) {
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
                                if (util.existy(test)) {
                                    return test;
                                }
                            }
                        },
                        getKeyThis: function(param1) {
                            for (i=env.length-1; i>=0; i--) {
                                test = env[i].context.this;
                                if (util.existy(test)) {
                                    return test[param1];
                                }
                            }
                        }
                    };
                    return action_table[op](param1, param2);
                };

                var result = traverse(root, envOp);
                _this.util._lexStack = [];

                return result;
            };
            f.ast = root;
            return f;
        }
        return null;
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
                envOp('bufferIn', traverseObject(node, null, envOp));
            },
            iterpolation: function(node, envOp) {
                traverse(node.v, envOp);
            },
            expression: function(node, envOp) {
                envOp('bufferIn', traverseExpression(node, null, envOp));
            },
            'if': traverseIf,
            list: traverseList,
            statement: traverseStatement,
            custom: traverseCustom,
            macro: traverseMacro
        };
        action_table[node.type](node, envOp);

        return envOp('bufferOut');
    }

    function traverseStatement(node, envOp) {
        var env = envOp('get');

        var context = env.context;

        switch(node.op) {
            case 'assign':
                var v;
                switch(node.rv.type) {
                    case 'expression':
                        v = traverseExpression(node.rv, null, envOp);
                        break;
                    case 'object':
                        v = traverseObject(node.rv, null, envOp);
                        break;
                }
                traverseAssign(node.lv, null, v, envOp);
        }
    }

    function traverseAssign(l, r, newVal, envOp) {
        var q = [];

        _traverseAssign(l, r, newVal, q, envOp);

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

    function _traverseAssign(l, r, newVal, q, envOp) {
        var v;
        if (l.op) {
            switch (l.op) {
                case '.':
                    _traverseAssign(l.v1, l.v2, newVal, q, envOp);
                    q.push(l.v2);
                    return;
                case 'value':
                    _traverseAssign(l.v1, l.v2, newVal, q, envOp);
                    if (l.v2) {
                        q.push(l.v2);
                    }
                    return;
            }
        } else {
            q.push(l);
        }
    }

    function traverseObject(l, r, envOp) {
        var v, v1, v2;
        var i = 0;
        var temp;

        var action_table = {
            object: traverseObject,
            expression: traverseExpression
        };
        switch (l.op) {
            case '.':
                v = traverseObject(l.v1, l.v2, envOp);
                if (v) {
                    return v[l.v2];
                }
                return undefined;
            case 'value':
                v = traverseObject(l.v1, l.v2, envOp);
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
                v1 = traverseObject(l.v1, null, envOp);
                v2 = traverseObject(l.v2, null, envOp);

                if (v2 && v1[v2]) {
                    return v1[v2];
                } else {
                    if (l.spare) {
                        l.spare.op = 'literalvalue';
                    }
                    v2 = traverseObject(l.spare, null, envOp);
                    return v1[v2];
                }
                return;
            default:
                return envOp('getKey', l);
        }
    }

    function traverseExpression(l, r, envOp) {
        var v1 = null;
        var v2 = null;
        var temp = null;
        var i = 0;
        switch(l.type) {
            case 'expression':
                switch(l.op) {
                    case '*':
                        return traverseExpression(l.v1, null, envOp) * traverseExpression(l.v2, null, envOp);
                    case '+':
                        v1 = traverseExpression(l.v1, null, envOp);
                        v2 = traverseExpression(l.v2, null, envOp);

                        if (isArray(v1)) {
                            i = 0;
                            temp = [];

                            for (i = 0; i < v1.length; i++) {
                                temp.push(util.deepCopy(v1[i]));
                            }

                            if (isArray(v2)) {
                                for (i = 0; i < v2.length; i++) {
                                    temp.push(util.deepCopy(v2[i]));
                                }
                            } else {
                                temp.push(util.deepCopy(v2));
                            }
                            return temp;
                        }
                        return v1 + v2;
                    case '%':
                        return traverseExpression(l.v1, null, envOp) % traverseExpression(l.v2, null, envOp);
                    case '==':
                        return (traverseExpression(l.v1, null, envOp) == traverseExpression(l.v2, null, envOp));
                    case '!=':
                        return (traverseExpression(l.v1, null, envOp) != traverseExpression(l.v2, null, envOp));
                    case '-':
                        return (traverseExpression(l.v1, null, envOp) - traverseExpression(l.v2, null, envOp));
                    case '/':
                        return (traverseExpression(l.v1, null, envOp) / traverseExpression(l.v2, null, envOp));
                    case 'eval':
                        return (traverseExpression(l.v1, null, envOp));
                    case 'uminus':
                        return -(traverseExpression(l.v1, null, envOp));
                    case 'unot':
                        return !(traverseExpression(l.v1, null, envOp));
                    case 'exist':
                        return util.existy(traverseExpression(l.v1, null, envOp));
                    case 'existset':
                        temp = traverseExpression(l.v1, null, envOp);
                        if (!util.existy(temp)) {
                            var spare = traverseExpression(l.v2, null, envOp);
                            return spare;
                        }
                        return;
                    case 'trueset':
                        return traverseExpression(l.v1, null, envOp) ? traverseExpression(l.v2, null, envOp) : traverseExpression(l.v3, null, envOp);
                    case 'tohtml':
                        return util.htmlspecialchars((traverseExpression(l.v1, null, envOp)));
                    case 'keys':
                        return util.getKeys(traverseExpression(l.v1, null, envOp));
                    case 'size':
                        temp = traverseExpression(l.v1, null, envOp);
                        if (temp) {
                            return temp.length;
                        }
                        break;
                    case 'index_of':
                        v1 = traverseExpression(l.v1, null, envOp);
                        v2 = traverseExpression(l.v2, null, envOp);

                        if (v1 && v2) {
                            return v1.indexOf(v2);
                        }

                        break;
                    case '||' :
                        return traverseExpression(l.v1, null, envOp) || traverseExpression(l.v2, null, envOp);
                    case '&&' :
                        return traverseExpression(l.v1, null, envOp) && traverseExpression(l.v2, null, envOp);
                    case '>' :
                        return traverseExpression(l.v1, null, envOp) > traverseExpression(l.v2, null, envOp);
                    case '<' :
                        return traverseExpression(l.v1, null, envOp) < traverseExpression(l.v2, null, envOp);
                    case '>=' :
                        return traverseExpression(l.v1, null, envOp) >= traverseExpression(l.v2, null, envOp);
                    case '<=' :
                        return traverseExpression(l.v1, null, envOp) <= traverseExpression(l.v2, null, envOp);
                }
                break;
            case 'object':
                return traverseObject(l, null, envOp);
        }
    }

    function traverseIf(root, envOp) {
        if (root.cond) {
            if (true === traverseExpression(root.cond, null, envOp)) {
                traverse(root.statement, envOp);
            } else {
                var curr = root;

                while (curr) {
                    var v = traverseExpression(curr.cond, null, envOp);
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

    function traverseMacro(node, envOp) {
        envOp('addFunc', node.name, function(param) {
            return node;
        });
    }

    function traverseCustom(node, envOp) {
        var func = envOp('getFunc', node.key);
        var localEnv;
        var content;
        var result;
        var macroNode;
        var env;
        var context;
        var props;
        var propsParent;

        props = traverseObject(node.prop, null, envOp);

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
                props : util.deepObjectExtend(props, propsParent)
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

    function traverseList(node, envOp) {
        var i;
        var collection = [];
        var localEnv;
        var content;

        if (node.isRange) {
            if (node.collection && 2 === node.collection.length) {
                var start = parseInt(traverseObject(node.collection[0], null, envOp), 10);
                var end = parseInt(traverseObject(node.collection[1], null, envOp), 10);
                var step = 1;

                while (start < end) {
                    collection.push(start);
                    start += step;
                }
            }
        }
        else {
            if (node.collection) {
                collection = traverseObject(node.collection, null, envOp);
            }
        }

        localEnv = _build_local_env(envOp);
        envOp('push', localEnv);

        if (collection) {
            for (i = 0; i < collection.length; ++i) {
                traverseAssign(node.alias, null, collection[i], envOp);
                traverse(node.statement, envOp);
            }
        }
        content = envOp('bufferOut');
        envOp('pop');

        envOp('bufferIn', content);
    }
}).call(jerrymarker);
