/* parser generated by jison 0.4.15 */
/*
   Returns a Parser object of the following structure:

   Parser: {
   yy: {}
   }

   Parser.prototype: {
   yy: {},
   trace: function(),
   symbols_: {associative list: name ==> number},
   terminals_: {associative list: number ==> name},
   productions_: [...],
   performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
   table: [...],
   defaultActions: {...},
   parseError: function(str, hash),
   parse: function(input),

   lexer: {
   EOF: 1,
   parseError: function(str, hash),
   setInput: function(input),
   input: function(),
   unput: function(str),
   more: function(),
   less: function(n),
   pastInput: function(),
   upcomingInput: function(),
   showPosition: function(),
   test_match: function(regex_match_array, rule_index),
   next: function(),
   lex: function(),
   begin: function(condition),
   popState: function(),
   _currentRules: function(),
   topState: function(),
   pushState: function(condition),

   options: {
   ranges: boolean           (optional: true ==> token location info will include a .range[] member)
   flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
   backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
   },

   performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
   rules: [...],
   conditions: {associative list: name ==> set},
   }
   }


   token location info (@$, _$, etc.): {
   first_line: n,
   last_line: n,
   first_column: n,
   last_column: n,
   range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
   }


   the parseError function receives a 'hash' object with these members for lexer and parser errors: {
   text:        (matched text)
   token:       (the produced terminal token, if any)
   line:        (yylineno)
   }
   while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
   loc:         (yylloc)
   expected:    (string describing the set of expected tokens)
   recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
   }
*/
var jerrymarker = (function(){
    var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,6],$V1=[1,10],$V2=[1,5],$V3=[1,11],$V4=[1,12],$V5=[1,13],$V6=[5,19,22,24,28,30,32,33,34,36,38],$V7=[1,27],$V8=[1,22],$V9=[1,23],$Va=[1,26],$Vb=[1,24],$Vc=[1,25],$Vd=[1,17],$Ve=[1,18],$Vf=[1,19],$Vg=[1,20],$Vh=[1,32],$Vi=[1,33],$Vj=[1,34],$Vk=[1,35],$Vl=[1,36],$Vm=[11,12,13,14,15,17,23,29],$Vn=[1,49],$Vo=[8,11,12,13,14,15,17,19,23,29,37,39],$Vp=[11,14,17,23,29],$Vq=[11,12,14,15,17,23,29],$Vr=[1,81],$Vs=[1,82];
    var parser = {trace: function trace() { },
        yy: {},
    symbols_: {"error":2,"html":3,"contents":4,"EOF":5,"content":6,"OBJECT":7,"DOT":8,"IDENTIFIER":9,"e":10,"+":11,"*":12,"==":13,"-":14,"/":15,"(":16,")":17,"NUMBER":18,"INDENT":19,"STRING":20,"INTERPOLATIONS":21,"${":22,"}":23,"CHAR":24,"IFDIRECTIVE":25,"LISTDIRECTIVE":26,"ASSIGNDIRECTIVE":27,"DIRECTIVE_IF_START_TAG":28,">":29,"DIRECTIVE_IF_END_TAG":30,"ELSEIF":31,"DIRECTIVE_ELSEIF_START_TAG":32,"DIRECTIVE_ELSE_START_TAG":33,"DIRECTIVE_LIST_START_TAG":34,"AS":35,"DIRECTIVE_LIST_END_TAG":36,"..":37,"DIRECTIVE_ASSIGN_START_TAG":38,"=":39,"$accept":0,"$end":1},
    terminals_: {2:"error",5:"EOF",8:"DOT",9:"IDENTIFIER",11:"+",12:"*",13:"==",14:"-",15:"/",16:"(",17:")",18:"NUMBER",19:"INDENT",20:"STRING",22:"${",23:"}",24:"CHAR",28:"DIRECTIVE_IF_START_TAG",29:">",30:"DIRECTIVE_IF_END_TAG",32:"DIRECTIVE_ELSEIF_START_TAG",33:"DIRECTIVE_ELSE_START_TAG",34:"DIRECTIVE_LIST_START_TAG",35:"AS",36:"DIRECTIVE_LIST_END_TAG",37:"..",38:"DIRECTIVE_ASSIGN_START_TAG",39:"="},
    productions_: [0,[3,2],[4,1],[4,2],[7,3],[7,1],[10,3],[10,3],[10,3],[10,3],[10,3],[10,3],[10,1],[10,2],[10,2],[10,3],[10,1],[10,2],[10,3],[10,2],[10,1],[10,2],[10,2],[10,3],[10,2],[10,2],[10,3],[10,2],[10,2],[10,3],[10,2],[10,2],[10,3],[10,2],[10,2],[10,3],[10,2],[10,2],[10,3],[21,3],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[25,5],[25,5],[31,5],[31,4],[31,5],[31,5],[26,10],[26,11],[26,12],[26,12],[26,12],[26,12],[27,6]],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
        /* this == yyval */

        var $0 = $$.length - 1;
        switch (yystate) {
            case 1:

                var root = $$[$0-1];
                this.$ = root;
                return this.$;

                break;
            case 2:

                var n = new yy.ast.ContentNode();
                n.v.push($$[$0]);
                this.$ = n;

                break;
            case 3:

                var n = new yy.ast.ContentNode();
                n.v.push($$[$0]);

                $$[$0-1].v.push(n);
                this.$ = $$[$0-1];

                break;
            case 4:

                this.$ = new yy.ast.ObjectNode('.', $$[$0-2], $$[$0]);

                break;
            case 5: case 20: case 22:

                this.$ = new yy.ast.ObjectNode('value', $$[$0]);

                break;
            case 6: case 7: case 8: case 9: case 10:

                this.$ = new yy.ast.ExpressionNode($$[$0-1], $$[$0-2], $$[$0]);

                break;
            case 11:

                this.$ = new yy.ast.ExpressionNode('eval', $$[$0-1]);

                break;
            case 12:

                this.$ = new yy.ast.ObjectNode('literalvalue', Number(yytext));

                break;
            case 13:

                this.$ = new yy.ast.ObjectNode('literalvalue', Number($$[$0]));

                break;
            case 14: case 15:

                this.$ = new yy.ast.ObjectNode('literalvalue', Number($$[$0-1]));

                break;
            case 16:

                //"hello"->hello
                this.$ = new yy.ast.ObjectNode('literalvalue', $$[$0].slice(1,-1));

                break;
            case 17:

                this.$ = new yy.ast.ObjectNode('literalvalue', $$[$0].slice(1,-1));

                break;
            case 18: case 19:

                this.$ = new yy.ast.ObjectNode('literalvalue', $$[$0-1].slice(1,-1));

                break;
            case 21: case 23:

                this.$ = new yy.ast.ObjectNode('value', $$[$0-1]);

                break;
            case 24: case 27: case 30: case 33: case 36:

                this.$ = $$[$0];

                break;
            case 25: case 26: case 28: case 29: case 31: case 32: case 34: case 35: case 37: case 38: case 39:

                this.$ = $$[$0-1];

                break;
            case 40:

                this.$ = new yy.ast.InterPolationNode($$[$0]);

                break;
            case 41: case 42:

                this.$ = new yy.ast.LiteralNode($$[$0]);

                break;
            case 46: case 51:

                var nd = new yy.ast.IFNode($$[$0-3], $$[$0-1], null);
                this.$ = nd;

                break;
            case 47: case 48:

                var nd = new yy.ast.IFNode($$[$0-3], $$[$0-1], $$[$0]);
                this.$ = nd;

                break;
            case 49: case 50:

                var nd = new yy.ast.IFNode(true, $$[$0-1], null);
                this.$ = nd;

                break;
            case 52:

                this.$ = new yy.ast.ListNode($$[$0-7], $$[$0-3], $$[$0-1]);

                break;
            case 53:

                this.$ = new yy.ast.ListNode($$[$0-8], $$[$0-4], $$[$0-1]);

                break;
            case 54:

                this.$ = new yy.ast.ListNode([$$[$0-9], $$[$0-7]], $$[$0-3], $$[$0-1], true);

                break;
            case 55:

                var end = new yy.ast.ObjectNode('literalvalue', Number($$[$0-7]));
                this.$ = new yy.ast.ListNode([$$[$0-9], end], $$[$0-3], $$[$0-1], true);

                break;
            case 56:

                var start = new yy.ast.ObjectNode('literalvalue', Number($$[$0-9]));
                this.$ = new yy.ast.ListNode([start, $$[$0-7]], $$[$0-3], $$[$0-1], true);

                break;
            case 57:

                var start = new yy.ast.ObjectNode('literalvalue', Number($$[$0-9]));
                var end = new yy.ast.ObjectNode('literalvalue', Number($$[$0-7]));

                this.$ = new yy.ast.ListNode([start, end], $$[$0-3], $$[$0-1], true);

                break;
            case 58:

                var lv = new yy.ast.ObjectNode('value', $$[$0-3]);
                this.$ = new yy.ast.StatementNode('assign', lv, $$[$0-1]);

                break;
        }
    },
    table: [{3:1,4:2,6:3,19:$V0,21:4,22:$V1,24:$V2,25:7,26:8,27:9,28:$V3,34:$V4,38:$V5},{1:[3]},{5:[1,14],6:15,19:$V0,21:4,22:$V1,24:$V2,25:7,26:8,27:9,28:$V3,34:$V4,38:$V5},o($V6,[2,2]),o($V6,[2,40]),o($V6,[2,41]),o($V6,[2,42]),o($V6,[2,43]),o($V6,[2,44]),o($V6,[2,45]),{7:21,9:$V7,10:16,11:$V8,12:$V9,13:$Va,14:$Vb,15:$Vc,16:$Vd,18:$Ve,19:$Vf,20:$Vg},{7:21,9:$V7,10:28,11:$V8,12:$V9,13:$Va,14:$Vb,15:$Vc,16:$Vd,18:$Ve,19:$Vf,20:$Vg},{19:[1,29]},{19:[1,30]},{1:[2,1]},o($V6,[2,3]),{11:$Vh,12:$Vi,13:$Vj,14:$Vk,15:$Vl,23:[1,31]},{7:21,9:$V7,10:37,11:$V8,12:$V9,13:$Va,14:$Vb,15:$Vc,16:$Vd,18:$Ve,19:$Vf,20:$Vg},o($Vm,[2,12],{19:[1,38]}),{7:41,9:$V7,11:[1,42],12:[1,43],13:[1,46],14:[1,44],15:[1,45],18:[1,39],20:[1,40]},o($Vm,[2,16],{19:[1,47]}),o($Vm,[2,20],{8:$Vn,19:[1,48]}),{19:[1,50]},{19:[1,51]},{19:[1,52]},{19:[1,53]},{19:[1,54]},o($Vo,[2,5]),{11:$Vh,12:$Vi,13:$Vj,14:$Vk,15:$Vl,29:[1,55]},{7:56,9:$V7,18:[1,57]},{7:58,9:$V7},o($V6,[2,39]),{7:21,9:$V7,10:59,11:$V8,12:$V9,13:$Va,14:$Vb,15:$Vc,16:$Vd,18:$Ve,19:$Vf,20:$Vg},{7:21,9:$V7,10:60,11:$V8,12:$V9,13:$Va,14:$Vb,15:$Vc,16:$Vd,18:$Ve,19:$Vf,20:$Vg},{7:21,9:$V7,10:61,11:$V8,12:$V9,13:$Va,14:$Vb,15:$Vc,16:$Vd,18:$Ve,19:$Vf,20:$Vg},{7:21,9:$V7,10:62,11:$V8,12:$V9,13:$Va,14:$Vb,15:$Vc,16:$Vd,18:$Ve,19:$Vf,20:$Vg},{7:21,9:$V7,10:63,11:$V8,12:$V9,13:$Va,14:$Vb,15:$Vc,16:$Vd,18:$Ve,19:$Vf,20:$Vg},{11:$Vh,12:$Vi,13:$Vj,14:$Vk,15:$Vl,17:[1,64]},o($Vm,[2,14]),o($Vm,[2,13],{19:[1,65]}),o($Vm,[2,17],{19:[1,66]}),o($Vm,[2,22],{8:$Vn,19:[1,67]}),o($Vm,[2,24],{19:[1,68]}),o($Vm,[2,27],{19:[1,69]}),o($Vm,[2,30],{19:[1,70]}),o($Vm,[2,33],{19:[1,71]}),o($Vm,[2,36],{19:[1,72]}),o($Vm,[2,19]),o($Vm,[2,21]),{9:[1,73]},o($Vm,[2,25]),o($Vm,[2,28]),o($Vm,[2,31]),o($Vm,[2,34]),o($Vm,[2,37]),{4:74,6:3,19:$V0,21:4,22:$V1,24:$V2,25:7,26:8,27:9,28:$V3,34:$V4,38:$V5},{8:$Vn,19:[1,75],37:[1,76]},{37:[1,77]},{8:$Vn,39:[1,78]},o($Vp,[2,6],{12:$Vi,13:$Vj,15:$Vl}),o($Vq,[2,7],{13:$Vj}),o($Vm,[2,8]),o($Vp,[2,9],{12:$Vi,13:$Vj,15:$Vl}),o($Vq,[2,10],{13:$Vj}),o($Vm,[2,11]),o($Vm,[2,15]),o($Vm,[2,18]),o($Vm,[2,23]),o($Vm,[2,26]),o($Vm,[2,29]),o($Vm,[2,32]),o($Vm,[2,35]),o($Vm,[2,38]),o($Vo,[2,4]),{6:15,19:$V0,21:4,22:$V1,24:$V2,25:7,26:8,27:9,28:$V3,30:[1,79],31:80,32:$Vr,33:$Vs,34:$V4,38:$V5},{35:[1,83]},{7:84,9:$V7,18:[1,85]},{7:86,9:$V7,18:[1,87]},{7:21,9:$V7,10:88,11:$V8,12:$V9,13:$Va,14:$Vb,15:$Vc,16:$Vd,18:$Ve,19:$Vf,20:$Vg},o($V6,[2,46]),o($V6,[2,47]),{7:21,9:$V7,10:89,11:$V8,12:$V9,13:$Va,14:$Vb,15:$Vc,16:$Vd,18:$Ve,19:$Vf,20:$Vg},{19:[1,91],29:[1,90]},{19:[1,92]},{8:$Vn,19:[1,93]},{19:[1,94]},{8:$Vn,19:[1,95]},{19:[1,96]},{11:$Vh,12:$Vi,13:$Vj,14:$Vk,15:$Vl,29:[1,97]},{11:$Vh,12:$Vi,13:$Vj,14:$Vk,15:$Vl,29:[1,98]},{4:99,6:3,19:$V0,21:4,22:$V1,24:$V2,25:7,26:8,27:9,28:$V3,34:$V4,38:$V5},{29:[1,100]},{7:101,9:$V7},{35:[1,102]},{35:[1,103]},{35:[1,104]},{35:[1,105]},o($V6,[2,58]),{4:106,6:3,19:$V0,21:4,22:$V1,24:$V2,25:7,26:8,27:9,28:$V3,34:$V4,38:$V5},{6:15,19:$V0,21:4,22:$V1,24:$V2,25:7,26:8,27:9,28:$V3,30:[1,107],34:$V4,38:$V5},{4:108,6:3,19:$V0,21:4,22:$V1,24:$V2,25:7,26:8,27:9,28:$V3,34:$V4,38:$V5},{8:$Vn,19:[1,110],29:[1,109]},{19:[1,111]},{19:[1,112]},{19:[1,113]},{19:[1,114]},{6:15,19:$V0,21:4,22:$V1,24:$V2,25:7,26:8,27:9,28:$V3,30:[1,116],31:115,32:$Vr,33:$Vs,34:$V4,38:$V5},o($V6,[2,49]),{6:15,19:$V0,21:4,22:$V1,24:$V2,25:7,26:8,27:9,28:$V3,30:[1,117],34:$V4,38:$V5},{4:118,6:3,19:$V0,21:4,22:$V1,24:$V2,25:7,26:8,27:9,28:$V3,34:$V4,38:$V5},{29:[1,119]},{7:120,9:$V7},{7:121,9:$V7},{7:122,9:$V7},{7:123,9:$V7},o($V6,[2,48]),o($V6,[2,51]),o($V6,[2,50]),{6:15,19:$V0,21:4,22:$V1,24:$V2,25:7,26:8,27:9,28:$V3,34:$V4,36:[1,124],38:$V5},{4:125,6:3,19:$V0,21:4,22:$V1,24:$V2,25:7,26:8,27:9,28:$V3,34:$V4,38:$V5},{8:$Vn,29:[1,126]},{8:$Vn,29:[1,127]},{8:$Vn,29:[1,128]},{8:$Vn,29:[1,129]},o($V6,[2,52]),{6:15,19:$V0,21:4,22:$V1,24:$V2,25:7,26:8,27:9,28:$V3,34:$V4,36:[1,130],38:$V5},{4:131,6:3,19:$V0,21:4,22:$V1,24:$V2,25:7,26:8,27:9,28:$V3,34:$V4,38:$V5},{4:132,6:3,19:$V0,21:4,22:$V1,24:$V2,25:7,26:8,27:9,28:$V3,34:$V4,38:$V5},{4:133,6:3,19:$V0,21:4,22:$V1,24:$V2,25:7,26:8,27:9,28:$V3,34:$V4,38:$V5},{4:134,6:3,19:$V0,21:4,22:$V1,24:$V2,25:7,26:8,27:9,28:$V3,34:$V4,38:$V5},o($V6,[2,53]),{6:15,19:$V0,21:4,22:$V1,24:$V2,25:7,26:8,27:9,28:$V3,34:$V4,36:[1,135],38:$V5},{6:15,19:$V0,21:4,22:$V1,24:$V2,25:7,26:8,27:9,28:$V3,34:$V4,36:[1,136],38:$V5},{6:15,19:$V0,21:4,22:$V1,24:$V2,25:7,26:8,27:9,28:$V3,34:$V4,36:[1,137],38:$V5},{6:15,19:$V0,21:4,22:$V1,24:$V2,25:7,26:8,27:9,28:$V3,34:$V4,36:[1,138],38:$V5},o($V6,[2,54]),o($V6,[2,55]),o($V6,[2,56]),o($V6,[2,57])],
    defaultActions: {14:[2,1]},
    parseError: function parseError(str, hash) {
        if (hash.recoverable) {
            this.trace(str);
        } else {
            throw new Error(str);
        }
    },
    parse: function parse(input) {
        var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
        var args = lstack.slice.call(arguments, 1);
        var lexer = Object.create(this.lexer);
        var sharedState = { yy: {} };
        for (var k in this.yy) {
            if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
                sharedState.yy[k] = this.yy[k];
            }
        }
        lexer.setInput(input, sharedState.yy);
        sharedState.yy.lexer = lexer;
        sharedState.yy.parser = this;
        if (typeof lexer.yylloc == 'undefined') {
            lexer.yylloc = {};
        }
        var yyloc = lexer.yylloc;
        lstack.push(yyloc);
        var ranges = lexer.options && lexer.options.ranges;
        if (typeof sharedState.yy.parseError === 'function') {
            this.parseError = sharedState.yy.parseError;
        } else {
            this.parseError = Object.getPrototypeOf(this).parseError;
        }
        function popStack(n) {
            stack.length = stack.length - 2 * n;
            vstack.length = vstack.length - n;
            lstack.length = lstack.length - n;
        }
        _token_stack:
            function lex() {
                var token;
                token = lexer.lex() || EOF;
                if (typeof token !== 'number') {
                    token = self.symbols_[token] || token;
                }
                return token;
            }
        var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
        while (true) {
            state = stack[stack.length - 1];
            if (this.defaultActions[state]) {
                action = this.defaultActions[state];
            } else {
                if (symbol === null || typeof symbol == 'undefined') {
                    symbol = lex();
                }
                action = table[state] && table[state][symbol];
            }
            if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
            if (action[0] instanceof Array && action.length > 1) {
                throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
            }
            switch (action[0]) {
                case 1:
                    stack.push(symbol);
                    vstack.push(lexer.yytext);
                    lstack.push(lexer.yylloc);
                    stack.push(action[1]);
                    symbol = null;
                    if (!preErrorSymbol) {
                        yyleng = lexer.yyleng;
                        yytext = lexer.yytext;
                        yylineno = lexer.yylineno;
                        yyloc = lexer.yylloc;
                        if (recovering > 0) {
                            recovering--;
                        }
                    } else {
                        symbol = preErrorSymbol;
                        preErrorSymbol = null;
                    }
                    break;
                case 2:
                    len = this.productions_[action[1]][1];
                    yyval.$ = vstack[vstack.length - len];
                    yyval._$ = {
                        first_line: lstack[lstack.length - (len || 1)].first_line,
                        last_line: lstack[lstack.length - 1].last_line,
                        first_column: lstack[lstack.length - (len || 1)].first_column,
                        last_column: lstack[lstack.length - 1].last_column
                    };
                    if (ranges) {
                        yyval._$.range = [
                            lstack[lstack.length - (len || 1)].range[0],
                            lstack[lstack.length - 1].range[1]
                                ];
                    }
                    r = this.performAction.apply(yyval, [
                            yytext,
                            yyleng,
                            yylineno,
                            sharedState.yy,
                            action[1],
                            vstack,
                            lstack
                            ].concat(args));
                    if (typeof r !== 'undefined') {
                        return r;
                    }
                    if (len) {
                        stack = stack.slice(0, -1 * len * 2);
                        vstack = vstack.slice(0, -1 * len);
                        lstack = lstack.slice(0, -1 * len);
                    }
                    stack.push(this.productions_[action[1]][0]);
                    vstack.push(yyval.$);
                    lstack.push(yyval._$);
                    newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
                    stack.push(newState);
                    break;
                case 3:
                    return true;
            }
        }
        return true;
    }};
    /* generated by jison-lex 0.3.4 */
    var lexer = (function(){
        var lexer = ({

            EOF:1,

            parseError:function parseError(str, hash) {
                if (this.yy.parser) {
                    this.yy.parser.parseError(str, hash);
                } else {
                    throw new Error(str);
                }
            },

            // resets the lexer, sets new input
            setInput:function (input, yy) {
                this.yy = yy || this.yy || {};
                this._input = input;
                this._more = this._backtrack = this.done = false;
                this.yylineno = this.yyleng = 0;
                this.yytext = this.matched = this.match = '';
                this.conditionStack = ['INITIAL'];
                this.yylloc = {
                    first_line: 1,
                    first_column: 0,
                    last_line: 1,
                    last_column: 0
                };
                if (this.options.ranges) {
                    this.yylloc.range = [0,0];
                }
                this.offset = 0;
                return this;
            },

            // consumes and returns one char from the input
            input:function () {
                var ch = this._input[0];
                this.yytext += ch;
                this.yyleng++;
                this.offset++;
                this.match += ch;
                this.matched += ch;
                var lines = ch.match(/(?:\r\n?|\n).*/g);
                if (lines) {
                    this.yylineno++;
                    this.yylloc.last_line++;
                } else {
                    this.yylloc.last_column++;
                }
                if (this.options.ranges) {
                    this.yylloc.range[1]++;
                }

                this._input = this._input.slice(1);
                return ch;
            },

            // unshifts one char (or a string) into the input
            unput:function (ch) {
                var len = ch.length;
                var lines = ch.split(/(?:\r\n?|\n)/g);

                this._input = ch + this._input;
                this.yytext = this.yytext.substr(0, this.yytext.length - len);
                //this.yyleng -= len;
                this.offset -= len;
                var oldLines = this.match.split(/(?:\r\n?|\n)/g);
                this.match = this.match.substr(0, this.match.length - 1);
                this.matched = this.matched.substr(0, this.matched.length - 1);

                if (lines.length - 1) {
                    this.yylineno -= lines.length - 1;
                }
                var r = this.yylloc.range;

                this.yylloc = {
                    first_line: this.yylloc.first_line,
                    last_line: this.yylineno + 1,
                    first_column: this.yylloc.first_column,
                    last_column: lines ?
                        (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                        + oldLines[oldLines.length - lines.length].length - lines[0].length :
                        this.yylloc.first_column - len
                };

                if (this.options.ranges) {
                    this.yylloc.range = [r[0], r[0] + this.yyleng - len];
                }
                this.yyleng = this.yytext.length;
                return this;
            },

            // When called from action, caches matched text and appends it on next action
            more:function () {
                this._more = true;
                return this;
            },

            // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
            reject:function () {
                if (this.options.backtrack_lexer) {
                    this._backtrack = true;
                } else {
                    return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                        text: "",
                        token: null,
                        line: this.yylineno
                    });

                }
                return this;
            },

            // retain first n characters of the match
            less:function (n) {
                this.unput(this.match.slice(n));
            },

            // displays already matched input, i.e. for error messages
            pastInput:function () {
                var past = this.matched.substr(0, this.matched.length - this.match.length);
                return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
            },

            // displays upcoming input, i.e. for error messages
            upcomingInput:function () {
                var next = this.match;
                if (next.length < 20) {
                    next += this._input.substr(0, 20-next.length);
                }
                return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
            },

            // displays the character position where the lexing error occurred, i.e. for error messages
            showPosition:function () {
                var pre = this.pastInput();
                var c = new Array(pre.length + 1).join("-");
                return pre + this.upcomingInput() + "\n" + c + "^";
            },

            // test the lexed token: return FALSE when not a match, otherwise return token
            test_match:function (match, indexed_rule) {
                var token,
                lines,
                backup;

                if (this.options.backtrack_lexer) {
                    // save context
                    backup = {
                        yylineno: this.yylineno,
                        yylloc: {
                            first_line: this.yylloc.first_line,
                            last_line: this.last_line,
                            first_column: this.yylloc.first_column,
                            last_column: this.yylloc.last_column
                        },
                        yytext: this.yytext,
                        match: this.match,
                        matches: this.matches,
                        matched: this.matched,
                        yyleng: this.yyleng,
                        offset: this.offset,
                        _more: this._more,
                        _input: this._input,
                        yy: this.yy,
                        conditionStack: this.conditionStack.slice(0),
                        done: this.done
                    };
                    if (this.options.ranges) {
                        backup.yylloc.range = this.yylloc.range.slice(0);
                    }
                }

                lines = match[0].match(/(?:\r\n?|\n).*/g);
                if (lines) {
                    this.yylineno += lines.length;
                }
                this.yylloc = {
                    first_line: this.yylloc.last_line,
                    last_line: this.yylineno + 1,
                    first_column: this.yylloc.last_column,
                    last_column: lines ?
                        lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                        this.yylloc.last_column + match[0].length
                };
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                if (this.options.ranges) {
                    this.yylloc.range = [this.offset, this.offset += this.yyleng];
                }
                this._more = false;
                this._backtrack = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
                if (this.done && this._input) {
                    this.done = false;
                }
                if (token) {
                    return token;
                } else if (this._backtrack) {
                    // recover context
                    for (var k in backup) {
                        this[k] = backup[k];
                    }
                    return false; // rule action called reject() implying the next rule should be tested instead.
                }
                return false;
            },

            // return next match in input
            next:function () {
                if (this.done) {
                    return this.EOF;
                }
                if (!this._input) {
                    this.done = true;
                }

                var token,
                    match,
                    tempMatch,
                    index;
                if (!this._more) {
                    this.yytext = '';
                    this.match = '';
                }
                var rules = this._currentRules();
                for (var i = 0; i < rules.length; i++) {
                    tempMatch = this._input.match(this.rules[rules[i]]);
                    if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                        match = tempMatch;
                        index = i;
                        if (this.options.backtrack_lexer) {
                            token = this.test_match(tempMatch, rules[i]);
                            if (token !== false) {
                                return token;
                            } else if (this._backtrack) {
                                match = false;
                                continue; // rule action called reject() implying a rule MISmatch.
                            } else {
                                // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                                return false;
                            }
                        } else if (!this.options.flex) {
                            break;
                        }
                    }
                }
                if (match) {
                    token = this.test_match(match, rules[index]);
                    if (token !== false) {
                        return token;
                    }
                    // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                    return false;
                }
                if (this._input === "") {
                    return this.EOF;
                } else {
                    return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                        text: "",
                        token: null,
                        line: this.yylineno
                    });
                }
            },

            // return next match that has a token
            lex:function lex() {
                var r = this.next();
                if (r) {
                    return r;
                } else {
                    return this.lex();
                }
            },

            // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
            begin:function begin(condition) {
                this.conditionStack.push(condition);
            },

            // pop the previously active lexer condition state off the condition stack
            popState:function popState() {
                var n = this.conditionStack.length - 1;
                if (n > 0) {
                    return this.conditionStack.pop();
                } else {
                    return this.conditionStack[0];
                }
            },

            // produce the lexer rule set which is active for the currently active lexer condition state
            _currentRules:function _currentRules() {
                if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
                    return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
                } else {
                    return this.conditions["INITIAL"].rules;
                }
            },

            // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
            topState:function topState(n) {
                n = this.conditionStack.length - 1 - Math.abs(n || 0);
                if (n >= 0) {
                    return this.conditionStack[n];
                } else {
                    return "INITIAL";
                }
            },

            // alias for begin(condition)
            pushState:function pushState(condition) {
                this.begin(condition);
            },

            // return the number of states currently on the stack
            stateStackSize:function stateStackSize() {
                return this.conditionStack.length;
            },
            options: {},
            performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
                var YYSTATE=YY_START;
                switch($avoiding_name_collisions) {
                    case 0:
                        this.begin('interpolation');
                        return 22;

                        break;
                    case 1:
                        this.popState();
                        return 23;

                        break;
                    case 2:return 35
                           break;
                    case 3:return 18
                           break;
                    case 4:return 20
                           break;
                    case 5:
                           return 9;

                           break;
                    case 6:return 37
                           break;
                    case 7:return 12
                           break;
                    case 8:return 15
                           break;
                    case 9:return 14
                           break;
                    case 10:return 11
                            break;
                    case 11:return '!'
                            break;
                    case 12:return 16
                            break;
                    case 13:return 17
                            break;
                    case 14:return 8
                            break;
                    case 15:return 13
                            break;
                    case 16:return 39
                            break;
                    case 17:
                            this.begin('if_drt');
                            return 28;

                            break;
                    case 18:
                            return 30;

                            break;
                    case 19:
                            this.begin('list_drt');
                            return 34;

                            break;
                    case 20:
                            return 36;

                            break;
                    case 21:
                            this.popState();
                            return 29;

                            break;
                    case 22:
                            this.begin('if_drt');
                            return 32;

                            break;
                    case 23:
                            this.begin('if_drt');
                            return 33;

                            break;
                    case 24:
                            this.begin('assign_drt');
                            return 38;

                            break;
                    case 25:return ''
                            break;
                    case 26:return 19
                            break;
                    case 27:return 24
                            break;
                    case 28:return 5
                            break;
                }
            },
            rules: [/^(?:\$\{)/,/^(?:\})/,/^(?:as\b)/,/^(?:[0-9]+(\.[0-9]+)?\b)/,/^(?:"[^"\n]*["\n]|'[^'\n]*['\n])/,/^(?:[a-zA-Z][a-zA-Z_0-9]*)/,/^(?:\.\.)/,/^(?:\*)/,/^(?:\/)/,/^(?:-)/,/^(?:\+)/,/^(?:!)/,/^(?:\()/,/^(?:\))/,/^(?:\.)/,/^(?:==)/,/^(?:=)/,/^(?:<#if\b)/,/^(?:<\/#if>)/,/^(?:<#list\b)/,/^(?:<\/#list>)/,/^(?:>)/,/^(?:<#elseif\b)/,/^(?:<#else\b)/,/^(?:<#assign\b)/,/^(?:[ \t]+)/,/^(?:[ \t]+)/,/^(?:(.|\n))/,/^(?:$)/],
            conditions: {"if_drt":{"rules":[0,1,2,3,4,5,7,8,9,10,11,12,13,14,15,17,18,19,20,21,22,23,24,26,27,28],"inclusive":true},"list_drt":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17,18,19,20,21,22,23,24,26,27,28],"inclusive":true},"assign_drt":{"rules":[0,1,2,3,4,5,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,26,27,28],"inclusive":true},"interpolation":{"rules":[0,1,2,3,4,5,7,8,9,10,11,12,13,14,15,17,18,19,20,22,23,24,25,26,27,28],"inclusive":true},"INITIAL":{"rules":[0,1,2,17,18,19,20,22,23,24,26,27,28],"inclusive":true}}
        });
        return lexer;
    })();
    parser.lexer = lexer;
    function Parser () {
        this.yy = {};
    }
    Parser.prototype = parser;parser.Parser = Parser;
    return new Parser;
})();
