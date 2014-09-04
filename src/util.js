(function() {
    var util = this.util = {};

    util.travel = travel;

    this.compile = compile;

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
    function travel_statement(node, context) {
        switch(node.op) {
            case 'assign':
                var v;
                switch(node.rv.type) {
                    case 'expression':
                        v = travel_expression(node.rv, null, context);
                        break;
                    case 'object':
                        v = travel_object(node.rv, null, context);
                        break;
                }
                travel_assign(node.lv, null, context, v);
        }
    }
    function travel_assign(l, r, c, newVal) {
        var q = [];
        _travel_assign(l, r, c, newVal, q);

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
    function _travel_assign(l, r, c, newVal, q) {
        var v;
        if (l.op) {
            switch (l.op) {
                case '.':
                    _travel_assign(l.v1, l.v2, c, newVal, q);
                    q.push(l.v2);
                    return;
                case 'value':
                    _travel_assign(l.v1, l.v2, c, newVal, q);
                    if (l.v2) {
                        q.push(l.v2);
                    }
                    return;
            }
        } else {
            q.push(l);
        }
    }
    function travel_object(l, r, c) {
        var v;
        switch (l.op) {
            case '.':
                v = travel_object(l.v1, l.v2, c);
                return v[l.v2];
            case 'value':
                v = travel_object(l.v1, l.v2, c);
                return v;
            case 'literalvalue':
                return l.v1;
            default:
                if (c) {
                    return c[l];
                } else {
                    return undefined;
                }
        }
    }
    function travel_expression(l, r, context) {
        switch(l.type) {
            case 'expression':
                switch(l.op) {
                    case '*':
                        return travel_expression(l.v1, null, context) * travel_expression(l.v2, null, context);
                    case '+':
                        return travel_expression(l.v1, null, context) + travel_expression(l.v2, null, context);
                    case '%':
                        return travel_expression(l.v1, null, context) % travel_expression(l.v2, null, context);
                    case '==':
                        return (travel_expression(l.v1, null, context) == travel_expression(l.v2, null, context));
                    case '!=':
                        return (travel_expression(l.v1, null, context) != travel_expression(l.v2, null, context));
                    case '-':
                        return (travel_expression(l.v1, null, context) - travel_expression(l.v2, null, context));
                    case '/':
                        return (travel_expression(l.v1, null, context) / travel_expression(l.v2, null, context));
                    case 'eval':
                        return (travel_expression(l.v1, null, context));
                    case 'uminus':
                        return -(travel_expression(l.v1, null, context));
                    case 'unot':
                        return !(travel_expression(l.v1, null, context));
                    case 'exist':
                        return existy(travel_expression(l.v1, null, context));
                    case 'existset':
                        var temp = travel_expression(l.v1, null, context);
                        if (!existy(temp)) {
                            var spare = travel_expression(l.v2, null, context);
                            return spare;
                        }
                        return;
                    case 'tohtml':
                        return htmlspecialchars((travel_expression(l.v1, null, context)));
                    case '||' :
                        return travel_expression(l.v1, null, context) || travel_expression(l.v2, null, context);
                    case '&&' :
                        return travel_expression(l.v1, null, context) && travel_expression(l.v2, null, context);
                    case '>' :
                        return travel_expression(l.v1, null, context) > travel_expression(l.v2, null, context);
                    case '<' :
                        return travel_expression(l.v1, null, context) < travel_expression(l.v2, null, context);
                    case '>=' :
                        return travel_expression(l.v1, null, context) >= travel_expression(l.v2, null, context);
                    case '<=' :
                        return travel_expression(l.v1, null, context) <= travel_expression(l.v2, null, context);
                }
                break;
            case 'object':
                return travel_object(l, null, context);
        }
    }
    function travel_if(root, context, bufferIn, bufferOut) {
        if (root.cond) {
            if (true === travel_expression(root.cond, null, context)) {
                travel(root.statement, context, bufferIn, bufferOut);
            } else {
                var curr = root;

                while (curr) {
                    var v = travel_expression(curr.cond, null, context);
                    if (v) {
                        travel(curr.statement, context, bufferIn, bufferOut);
                        break;
                    }
                    curr = curr.child;
                }
                return;
            }
        }
    }

    function travel_list(node, context, bufferIn, bufferOut) {
        var i;
        var collection = [];
        if (node.isRange) {
            if (node.collection && 2 === node.collection.length) {
                var start = parseInt(travel_object(node.collection[0], null, context), 10);
                var end = parseInt(travel_object(node.collection[1], null, context), 10);
                var step = 1;

                while (start < end) {
                    collection.push(start);
                    start += step;
                }
            }
        }
        else {
            if (node.collection) {
                collection = travel_object(node.collection, null, context);
            }
        }

        for (i = 0; i < collection.length; ++i) {
            travel_assign(node.alias, null, context, collection[i]);
            travel(node.statement, context, bufferIn, bufferOut);
        }
    }
    function travel(node, context, bufferIn, bufferOut) {
        if (!node) {
            return;
        }
        switch (node.type) {
            case 'content':
                for(var i = 0; i < node.v.length; ++i) {
                    travel(node.v[i], context, bufferIn, bufferOut);
                }
                break;
            case 'literal':
                bufferIn(node.v);
                break;
            case 'object':
                bufferIn(travel_object(node, null, context));
                break;
            case 'iterpolation':
                travel(node.v, context, bufferIn, bufferOut);
                break;
            case 'expression':
                bufferIn(travel_expression(node, null, context));
                break;
            case 'if':
                travel_if(node, context, bufferIn, bufferOut);
                break;
            case 'list':
                travel_list(node, context, bufferIn, bufferOut);
                break;
            case 'statement':
                travel_statement(node, context);
                break;
        }
        return bufferOut();
    }

    function compile(input) {
         var root = this.parse(input);

         if (root) {
             var f = function(context) {
                 var buffer = [];
                 var bufferIn = function(d) {
                     buffer.push(d);
                 };
                 var bufferOut = function() {
                     return buffer.join('');
                 };
                 return travel(root, context, bufferIn, bufferOut);
             };
             f.ast = root;
             return f;
         }
         return null;
    }
}).call(jerrymarker);
