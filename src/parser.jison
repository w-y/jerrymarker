/* parser lexical grammar */
%lex

%s if_drt list_drt assign_drt interpolation exp logic_op

%%

\$\{                                %{
                                        this.begin('interpolation');
                                        return '${';
                                    %}
\}                                  %{
                                        this.popState();
                                        return '}';
                                    %}
"as"                                return 'AS'
<interpolation,if_drt,list_drt,assign_drt,exp>[0-9]+("."[0-9]+)?\b              return 'NUMBER'
<interpolation,if_drt,list_drt,assign_drt,exp>\"[^"\n]*["\n]|\'[^'\n]*['\n]     return 'STRING'

<interpolation,if_drt,list_drt,assign_drt,exp>[a-zA-Z][a-zA-Z_0-9]*             %{
                                                                                    return 'IDENTIFIER';
                                                                                %}
<list_drt>".."                                                                  return '..'
<interpolation,if_drt,list_drt,assign_drt,exp>"*"                               return '*'
<interpolation,if_drt,list_drt,assign_drt,exp>"/"                               return '/'
<interpolation,if_drt,list_drt,assign_drt,exp>"%"                               return '%'
<interpolation,if_drt,list_drt,assign_drt,exp>"-"                               return '-'
<interpolation,if_drt,list_drt,assign_drt,exp>"+"                               return '+'
<interpolation,if_drt,list_drt,assign_drt,exp>"||"                              %{
                                                                                    return '||';
                                                                                %}
<interpolation,if_drt,list_drt,assign_drt,exp>"&&"                              %{
                                                                                    return '&&';
                                                                                %}
<interpolation,if_drt,list_drt,assign_drt,exp>"<="                              return '<='
<interpolation,if_drt,list_drt,assign_drt,exp>">="                              return '>='
<interpolation,if_drt,list_drt,assign_drt,exp>"<"                               return '<'
<interpolation,if_drt,list_drt,assign_drt,exp>[ \t]*"("                         %{
                                                                                    this.begin('exp');
                                                                                    return '(';
                                                                                %}
<exp>">"                                                                        return '>'
<interpolation,if_drt,list_drt,assign_drt,exp>")"[ \t]*                         %{
                                                                                    this.popState();
                                                                                    return ')';
                                                                                %}
<interpolation,if_drt,list_drt,assign_drt,exp>"."                               return 'DOT'
<interpolation,if_drt,list_drt,assign_drt,exp>"=="                              return '=='
<interpolation,if_drt,list_drt,assign_drt,exp>"!="                              return '!='
<assign_drt>"="                                                                 return '='
<interpolation,if_drt,list_drt,assign_drt,exp>[ \t]*"!"                               return '!'

<interpolation,if_drt,list_drt,assign_drt,exp>"??"[ \t]*                        return '??'
<interpolation,if_drt,list_drt,assign_drt,exp>"?html"[ \t]*                     return '?html'

"<#if"                              %{
                                        this.begin('if_drt');
                                        return 'DIRECTIVE_IF_START_TAG';
                                    %}
"</#if>"                            %{
                                        return 'DIRECTIVE_IF_END_TAG';
                                    %}

"<#list"                            %{
                                        this.begin('list_drt');
                                        return 'DIRECTIVE_LIST_START_TAG';
                                    %}
"</#list>"                          %{
                                        return 'DIRECTIVE_LIST_END_TAG';
                                    %}


<if_drt,list_drt,assign_drt>[ \t]*">"   %{
                                            this.popState();
                                            return 'DIRECTIVE_END';
                                        %}

"<#elseif"                          %{
                                        this.begin('if_drt');
                                        return 'DIRECTIVE_ELSEIF_START_TAG';
                                    %}
"<#else"                            %{
                                        this.begin('if_drt');
                                        return 'DIRECTIVE_ELSE_START_TAG';
                                    %}
"<#assign"                          %{
                                        this.begin('assign_drt');
                                        return 'DIRECTIVE_ASSIGN_START_TAG';
                                    %}

<interpolation>[ \t]+               return ''
[ \t]+                              return 'INDENT'
(.|\n)                              return 'CHAR'
<<EOF>>								return 'EOF'
/lex

%left '||' '&&'
%left '>' '<' '>=' '<=' '==' '!='
%left '+' '-'
%left '%'
%left '*' '/'
%left '='
%left '??' '?html'

%right UMINUS
%right NOT
%left EXISTS
%left '(' ')'
%start html

%% /* parser language grammar */
html
 : contents EOF {
     var root = $1;
     $$ = root;
     return $$;
   }
 ;

contents
 : content {
        var n = new yy.ast.ContentNode();
        n.v.push($1);
        $$ = n;
   }
 | contents content {
        var n = new yy.ast.ContentNode();
        n.v.push($2);

        $1.v.push(n);
        $$ = $1;
   }
 ;

 OBJECT
    : OBJECT DOT IDENTIFIER {
        $$ = new yy.ast.ObjectNode('.', $1, $3);
    }
    | IDENTIFIER {
        $$ = new yy.ast.ObjectNode('value', $1);
    }
 ;

 e
    : e '+' e {
        $$ = new yy.ast.ExpressionNode($2, $1, $3);
    }
    | e '*' e {
        $$ = new yy.ast.ExpressionNode($2, $1, $3);
    }
    | e '%' e {
        $$ = new yy.ast.ExpressionNode($2, $1, $3);
    }
    | e '==' e {
        $$ = new yy.ast.ExpressionNode($2, $1, $3);
    }
    | e '!=' e {
        $$ = new yy.ast.ExpressionNode($2, $1, $3);
    }
    | e '-' e {
        $$ = new yy.ast.ExpressionNode($2, $1, $3);
    }
    | e '/' e {
        $$ = new yy.ast.ExpressionNode($2, $1, $3);
    }
    | e '<' e {
        $$ = new yy.ast.ExpressionNode($2, $1, $3);
    }
    | e '>' e {
        $$ = new yy.ast.ExpressionNode($2, $1, $3);
    }
    | e '>=' e {
        $$ = new yy.ast.ExpressionNode($2, $1, $3);
    }
    | e '<=' e {
        $$ = new yy.ast.ExpressionNode($2, $1, $3);
    }
    | e '||' e {
        $$ = new yy.ast.ExpressionNode($2, $1, $3);
    }
    | e '&&' e {
        $$ = new yy.ast.ExpressionNode($2, $1, $3);
    }
    | '(' e ')' {
        $$ = new yy.ast.ExpressionNode('eval', $2);
    }
    | '-' e %prec UMINUS {
        $$ = new yy.ast.ExpressionNode('uminus', $2);
    }
    | INDENT '-' e %prec UMINUS {
        $$ = new yy.ast.ExpressionNode('uminus', $3);
    }
    | '!' e %prec NOT {
        $$ = new yy.ast.ExpressionNode('unot', $2);
    }
    | e '??' %prec EXISTS {
        $$ = new yy.ast.ExpressionNode('exist', $1);
    }
    | e '?html' {
        $$ = new yy.ast.ExpressionNode('tohtml', $1);
    }
    | OBJECT '!' e %prec EXISTS {
        $$ = new yy.ast.ExpressionNode('existset', $1, $3);
    }
    | INDENT OBJECT '!' e %prec EXISTS {
        $$ = new yy.ast.ExpressionNode('existset', $2, $4);
    }
    | INDENT '!' e %prec NOT {
        $$ = new yy.ast.ExpressionNode('unot', $3);
    }
    | NUMBER {
        $$ = new yy.ast.ObjectNode('literalvalue', Number(yytext));
    }
    | INDENT NUMBER {
        $$ = new yy.ast.ObjectNode('literalvalue', Number($2));
    }
    | NUMBER INDENT {
        $$ = new yy.ast.ObjectNode('literalvalue', Number($1));
    }
    | INDENT NUMBER INDENT {
        $$ = new yy.ast.ObjectNode('literalvalue', Number($2));
    }
    | STRING {
        //"hello"->hello
        $$ = new yy.ast.ObjectNode('literalvalue', $1.slice(1,-1));
    }
    | INDENT STRING {
        $$ = new yy.ast.ObjectNode('literalvalue', $2.slice(1,-1));
    }
    | INDENT STRING INDENT {
        $$ = new yy.ast.ObjectNode('literalvalue', $2.slice(1,-1));
    }
    | STRING INDENT {
        $$ = new yy.ast.ObjectNode('literalvalue', $1.slice(1,-1));
    }
    | OBJECT {
        $$ = new yy.ast.ObjectNode('value', $1);
    }
    | OBJECT INDENT {
        $$ = new yy.ast.ObjectNode('value', $1);
    }
    | INDENT OBJECT {
        $$ = new yy.ast.ObjectNode('value', $2);
    }
    | INDENT OBJECT INDENT {
        $$ = new yy.ast.ObjectNode('value', $2);
    }
;

INTERPOLATIONS
    : '${' e '}' {
        $$ = $2;
    }
;


content
    :
    INTERPOLATIONS {
        $$ = new yy.ast.InterPolationNode($1);
    }
    | CHAR {
        $$ = new yy.ast.LiteralNode($1);
    }
    | INDENT {
        $$ = new yy.ast.LiteralNode($1);
    }
    | IFDIRECTIVE
    | LISTDIRECTIVE
    | ASSIGNDIRECTIVE
    ;

IFDIRECTIVE
    :
    DIRECTIVE_IF_START_TAG e DIRECTIVE_END contents DIRECTIVE_IF_END_TAG
    {
        var nd = new yy.ast.IFNode($2, $4, null);
        $$ = nd;
    }
    |
    DIRECTIVE_IF_START_TAG e DIRECTIVE_END contents ELSEIF
    {
        var nd = new yy.ast.IFNode($2, $4, $5);
        $$ = nd;
    }
;

ELSEIF
    :
    DIRECTIVE_ELSEIF_START_TAG e DIRECTIVE_END contents ELSEIF
    {
        var nd = new yy.ast.IFNode($2, $4, $5);
        $$ = nd;
    }
    | DIRECTIVE_ELSE_START_TAG DIRECTIVE_END contents DIRECTIVE_IF_END_TAG {
        var trueCondition = new yy.ast.ObjectNode('literalvalue', true);
        var nd = new yy.ast.IFNode(trueCondition, $3, null);
        $$ = nd;
    }
    | DIRECTIVE_ELSE_START_TAG INDENT DIRECTIVE_END contents DIRECTIVE_IF_END_TAG {
        var trueCondition = new yy.ast.ObjectNode('literalvalue', true);
        var nd = new yy.ast.IFNode(trueCondition, $4, null);
        $$ = nd;
    }
    | DIRECTIVE_ELSEIF_START_TAG e DIRECTIVE_END contents DIRECTIVE_IF_END_TAG
    {
        var nd = new yy.ast.IFNode($2, $4, null);
        $$ = nd;
    }
;

LISTDIRECTIVE
    :
    DIRECTIVE_LIST_START_TAG INDENT OBJECT INDENT AS INDENT OBJECT DIRECTIVE_END contents DIRECTIVE_LIST_END_TAG
    {
        $$ = new yy.ast.ListNode($3, $7, $9);
    }
    |
    DIRECTIVE_LIST_START_TAG INDENT OBJECT INDENT AS INDENT OBJECT INDENT DIRECTIVE_END contents DIRECTIVE_LIST_END_TAG
    {
        $$ = new yy.ast.ListNode($3, $7, $10);
    }
    |
    DIRECTIVE_LIST_START_TAG INDENT OBJECT '..' OBJECT INDENT AS INDENT OBJECT DIRECTIVE_END contents DIRECTIVE_LIST_END_TAG
    {
        $$ = new yy.ast.ListNode([$3, $5], $9, $11, true);
    }
    |
    DIRECTIVE_LIST_START_TAG INDENT OBJECT '..' NUMBER INDENT AS INDENT OBJECT DIRECTIVE_END contents DIRECTIVE_LIST_END_TAG
    {
        var end = new yy.ast.ObjectNode('literalvalue', Number($5));
        $$ = new yy.ast.ListNode([$3, end], $9, $11, true);
    }
    |
    DIRECTIVE_LIST_START_TAG INDENT NUMBER '..' OBJECT INDENT AS INDENT OBJECT DIRECTIVE_END contents DIRECTIVE_LIST_END_TAG
    {
        var start = new yy.ast.ObjectNode('literalvalue', Number($3));
        $$ = new yy.ast.ListNode([start, $5], $9, $11, true);
    }
    |
    DIRECTIVE_LIST_START_TAG INDENT NUMBER '..' NUMBER INDENT AS INDENT OBJECT DIRECTIVE_END contents DIRECTIVE_LIST_END_TAG
    {
        var start = new yy.ast.ObjectNode('literalvalue', Number($3));
        var end = new yy.ast.ObjectNode('literalvalue', Number($5));

        $$ = new yy.ast.ListNode([start, end], $9, $11, true);
    }
;

ASSIGNDIRECTIVE
    :
    DIRECTIVE_ASSIGN_START_TAG INDENT OBJECT '=' e DIRECTIVE_END
    {
        var lv = new yy.ast.ObjectNode('value', $3);
        $$ = new yy.ast.StatementNode('assign', lv, $5);
    }
    |
    DIRECTIVE_ASSIGN_START_TAG INDENT OBJECT INDENT '=' e DIRECTIVE_END
    {
        var lv = new yy.ast.ObjectNode('value', $3);
        $$ = new yy.ast.StatementNode('assign', lv, $6);
    }
;
