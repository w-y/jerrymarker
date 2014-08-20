(function() {
    var util = this.util = {};

    util.travel = travel;

    this.compile = compile;

    function travel_statement(node, context) {
        switch(node.op) {
            case 'assign':
                var v;
                switch(node.rv.type) {
                    case 'expression':
                        v = travel_expression(node.rv);
                        break;
                    case 'object':
                        v = travel_object(node.rv);
                        break;
                }
                travel_assign(node.lv, null, context, v);
        }
    }
    function travel_assign(l, r, c, newVal) {
        var q = [];
        var i;
        var curr, next;
        curr = c;
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
                return c[l];
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
                    case '==':
                        return (travel_expression(l.v1, null, context) == travel_expression(l.v2, null, context));
                    case '-':
                        return (travel_expression(l.v1, null, context) - travel_expression(l.v2, null, context));
                    case '/':
                        return (travel_expression(l.v1, null, context) / travel_expression(l.v2, null, context));
                    case 'eval':
                        return (travel_expression(l.v1, null, context));
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

                while (curr.child) {
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
        if (node.collection) {
            var list = context[node.collection];
            var old = context[node.item];

            for (i = 0; i < list.length; ++i) {
                context[node.item] = list[i];
                travel(node.statement, context, bufferIn, bufferOut);
            }

            context[node.item] = old;
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
                bufferIn(travel_object(node, null, context, bufferIn, bufferOut));
                break;
            case 'iterpolation':
                travel(node.v, context, bufferIn, bufferOut);
                break;
            case 'expression':
                bufferIn(travel_expression(node, null, context, bufferIn, bufferOut));
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
                 f.context = context;
                 return travel(root, context, bufferIn, bufferOut);
             };
             f.ast = root;
             return f;
         }
         return null;
    }
}).call(jerrymarker);
