/* parser lexical grammar */
%lex

%s if_drt list_drt assign_drt macro_drt interpolation exp logic_op array hash custom_drt_start custom_drt_content

%%

"${"                                %{
                                        this.begin('interpolation');
                                        return '${';
                                    %}
<if_drt,list_drt,assign_drt,exp,array,hash>"}"                                  %{
                                                                                    this.popState();
                                                                                    return 'CLOSEBRACE';
                                                                                %}
"}"                                  %{
                                        this.popState();
                                        return '}';
                                    %}
"as"                                return 'AS'
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>[0-9]+("."[0-9]+)?\b              return 'NUMBER'
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash,custom_drt_start>\"[^"\n]*["\n]|\'[^'\n]*['\n]     return 'STRING'

<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>[ \t\n]*"true"                      return 'TRUE'
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>[ \t\n]*"false"                     return 'FALSE'
<interpolation,if_drt,list_drt,macro_drt,assign_drt,exp,array,hash,custom_drt_start>[a-zA-Z][a-zA-Z_0-9]*        %{
                                                                                        return 'IDENTIFIER';
                                                                                      %}
<list_drt>".."                                                                        return '..'
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>"*"                               return '*'
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>"/"                               return '/'
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>"%"                               return '%'
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>"-"                               return '-'
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>"+"                               return '+'

<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>"["                          %{
                                                                                        this.begin('array');
                                                                                        return '[';
                                                                                      %}
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>[ \t\n]*"]"                    %{
                                                                                    this.popState();
                                                                                    return ']';
                                                                                %}
<if_drt,list_drt,assign_drt,exp,array,hash>"{"                                  %{
                                                                                    this.begin('hash');
                                                                                    return 'OPENBRACE';
                                                                                %}
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>"||"                   %{
                                                                                    return '||';
                                                                                %}
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>"&&"                   %{
                                                                                    return '&&';
                                                                                %}
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>"<="                              return '<='
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>">="                              return '>='
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>"<"                               return '<'
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>[ \t]*"("              %{
                                                                                    this.begin('exp');
                                                                                    return '(';
                                                                                %}
<exp>">"                                                                        return '>'
<exp,assign_drt,array,hash>[ \t]*","                                            return ','
<hash>":"                                                                       return ':'
<custom_drt_start>"="                                                           return 'SETVALUE'
<custom_drt_start>[ \t\n]+                                                        return 'SEP'
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>")"[ \t]*              %{
                                                                                    this.popState();
                                                                                    return ')';
                                                                                %}
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>"."                         return 'DOT'
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>"=="                        return '=='
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>"!="                        return '!='
<assign_drt>"="                                                                 return '='
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>[ \t]*"!"                   return '!'

<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>"??"[ \t]*                  return '??'
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>"?html"[ \t]*               return '?html'
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>"?string"[ \t]*             return '?string'
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>"?keys"[ \t]*             return '?keys'

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


<if_drt,list_drt,assign_drt,macro_drt>[ \t]*">"   %{
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

"<#macro"                           %{
                                        this.begin('macro_drt');
                                        return 'DIRECTIVE_MACRO_START_TAG';
                                    %}
"</#macro>"                         %{
                                        return 'DIRECTIVE_MACRO_END_TAG';
                                    %}

"<@"[a-zA-Z]*                       %{
                                        yytext = yytext.slice(2);
                                        this.yy.util._lexStack.push(yytext);
                                        this.begin('custom_drt_start');
                                        return 'CUSTOM_START';
                                    %}
<custom_drt_start>[ \t\n]*">"               %{
                                        this.popState();
                                        this.begin('custom_drt_content');
                                        return 'CUSTOM_START_END';
                                    %}
<custom_drt_content>"</@"[a-zA-Z]*">"   %{
                                        var top = this.yy.util._lexStack.slice(-1);
                                        if (top.length > 0) {
                                            var custom = yytext.slice(3,-1);
                                            if (top[0] === custom) {
                                                this.yy.util._lexStack.pop();
                                                this.popState();
                                                return 'CUSTOM_END';
                                            }
                                        }
                                        return 'CHARS';
                                        %}
<custom_drt_start>[ \t\n]*"/>"      %{
                                        this.popState();
                                        return 'CUSTOM_SELFCLOSING';
                                    %}

<interpolation>[ \t]+               return ''
<hash>[ \t]+                        return ''
<array>[ \t]+                       return ''
[ \t\n]+                            return 'INDENT'
(.|\n)                              return 'CHAR'
<<EOF>>								return 'EOF'
/lex

%left '||' '&&'
%left '>' '<' '>=' '<=' '==' '!='
%left '+' '-'
%left '%'
%left '*' '/'
%left '='
%left '??' '?html' '?string' '?keys'

%right UMINUS
%right NOT
%left EXISTS
%left '(' ')'
%start html
