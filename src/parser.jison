/* parser lexical grammar */
%lex

%s if_drt list_drt assign_drt interpolation

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
<interpolation,if_drt,list_drt,assign_drt>[0-9]+("."[0-9]+)?\b              return 'NUMBER'
<interpolation,if_drt,list_drt,assign_drt>\"[^"\n]*["\n]|\'[^'\n]*['\n]     return 'STRING'

<interpolation,if_drt,list_drt,assign_drt>[a-zA-Z][a-zA-Z_0-9]*             %{
                                                                                return 'IDENTIFIER';
                                                                            %}
<list_drt>".."                                                              return '..'
<interpolation,if_drt,list_drt,assign_drt>"*"                               return '*'
<interpolation,if_drt,list_drt,assign_drt>"/"                               return '/'
<interpolation,if_drt,list_drt,assign_drt>"-"                               return '-'
<interpolation,if_drt,list_drt,assign_drt>"+"                               return '+'
<interpolation,if_drt,list_drt,assign_drt>"!"                               return '!'
<interpolation,if_drt,list_drt,assign_drt>"("                               return '('
<interpolation,if_drt,list_drt,assign_drt>")"                               return ')'
<interpolation,if_drt,list_drt,assign_drt>"."                               return 'DOT'
<interpolation,if_drt,list_drt,assign_drt>"=="                              return '=='
<assign_drt>"="                                                             return '='

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


<if_drt,list_drt,assign_drt>">"     %{
                                        this.popState();
                                        return '>';
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

%left '+' '-'
%left '*' '/'
%left '^'
%left '='
%left '=='

%right '!'
%right '%'
%left UMINUS

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
    | e '==' e {
        $$ = new yy.ast.ExpressionNode($2, $1, $3);
    }
    | e '-' e {
        $$ = new yy.ast.ExpressionNode($2, $1, $3);
    }
    | e '/' e {
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
    | INDENT '(' e ')' {
        $$ = new yy.ast.ExpressionNode('eval', $3);
    }
    | '(' e ')' INDENT{
        $$ = new yy.ast.ExpressionNode('eval', $2);
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
    | INDENT '+' {
        $$ = $2;
    }
    | '+' INDENT {
        $$ = $1;
    }
    | INDENT '+' INDENT {
        $$ = $2;
    }
    | INDENT '*' {
        $$ = $2;
    }
    | '*' INDENT {
        $$ = $1;
    }
    | INDENT '*' INDENT {
        $$ = $2;
    }
    | INDENT '-' {
        $$ = $2;
    }
    | '-' INDENT {
        $$ = $1;
    }
    | INDENT '-' INDENT {
        $$ = $2;
    }
    | INDENT '/' {
        $$ = $2;
    }
    | '/' INDENT {
        $$ = $1;
    }
    | INDENT '/' INDENT {
        $$ = $2;
    }
    | INDENT '==' {
        $$ = $2;
    }
    | '==' INDENT {
        $$ = $1;
    }
    | INDENT '==' INDENT {
        $$ = $2;
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
    DIRECTIVE_IF_START_TAG e '>' contents DIRECTIVE_IF_END_TAG
    {
        var nd = new yy.ast.IFNode($2, $4, null);
        $$ = nd;
    }
    |
    DIRECTIVE_IF_START_TAG e '>' contents ELSEIF
    {
        var nd = new yy.ast.IFNode($2, $4, $5);
        $$ = nd;
    }
;

ELSEIF
    :
    DIRECTIVE_ELSEIF_START_TAG e '>' contents ELSEIF
    {
        var nd = new yy.ast.IFNode($2, $4, $5);
        $$ = nd;
    }
    | DIRECTIVE_ELSE_START_TAG '>' contents DIRECTIVE_IF_END_TAG {
        var nd = new yy.ast.IFNode(true, $3, null);
        $$ = nd;
    }
    | DIRECTIVE_ELSE_START_TAG INDENT '>' contents DIRECTIVE_IF_END_TAG {
        var nd = new yy.ast.IFNode(true, $4, null);
        $$ = nd;
    }
    | DIRECTIVE_ELSEIF_START_TAG e '>' contents DIRECTIVE_IF_END_TAG
    {
        var nd = new yy.ast.IFNode($2, $4, null);
        $$ = nd;
    }
;

LISTDIRECTIVE
    :
    DIRECTIVE_LIST_START_TAG INDENT OBJECT INDENT AS INDENT OBJECT '>' contents DIRECTIVE_LIST_END_TAG
    {
        $$ = new yy.ast.ListNode($3, $7, $9);
    }
    |
    DIRECTIVE_LIST_START_TAG INDENT OBJECT INDENT AS INDENT OBJECT INDENT '>' contents DIRECTIVE_LIST_END_TAG
    {
        $$ = new yy.ast.ListNode($3, $7, $10);
    }
    |
    DIRECTIVE_LIST_START_TAG INDENT OBJECT '..' OBJECT INDENT AS INDENT OBJECT '>' contents DIRECTIVE_LIST_END_TAG
    {
        $$ = new yy.ast.ListNode([$3, $5], $9, $11, true);
    }
    |
    DIRECTIVE_LIST_START_TAG INDENT OBJECT '..' NUMBER INDENT AS INDENT OBJECT '>' contents DIRECTIVE_LIST_END_TAG
    {
        var end = new yy.ast.ObjectNode('literalvalue', Number($5));
        $$ = new yy.ast.ListNode([$3, end], $9, $11, true);
    }
    |
    DIRECTIVE_LIST_START_TAG INDENT NUMBER '..' OBJECT INDENT AS INDENT OBJECT '>' contents DIRECTIVE_LIST_END_TAG
    {
        var start = new yy.ast.ObjectNode('literalvalue', Number($3));
        $$ = new yy.ast.ListNode([start, $5], $9, $11, true);
    }
    |
    DIRECTIVE_LIST_START_TAG INDENT NUMBER '..' NUMBER INDENT AS INDENT OBJECT '>' contents DIRECTIVE_LIST_END_TAG
    {
        var start = new yy.ast.ObjectNode('literalvalue', Number($3));
        var end = new yy.ast.ObjectNode('literalvalue', Number($5));

        $$ = new yy.ast.ListNode([start, end], $9, $11, true);
    }
;

ASSIGNDIRECTIVE
    :
    DIRECTIVE_ASSIGN_START_TAG INDENT OBJECT '=' e '>'
    {
        var lv = new yy.ast.ObjectNode('value', $3);
        $$ = new yy.ast.StatementNode('assign', lv, $5);
    }
    |
    DIRECTIVE_ASSIGN_START_TAG INDENT OBJECT INDENT '=' e '>'
    {
        var lv = new yy.ast.ObjectNode('value', $3);
        $$ = new yy.ast.StatementNode('assign', lv, $6);
    }
;
