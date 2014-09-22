/* parser lexical grammar */
%lex

%s if_drt list_drt assign_drt interpolation exp logic_op array hash

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
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>\"[^"\n]*["\n]|\'[^'\n]*['\n]     return 'STRING'

<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>[ \t]*"true"                      return 'TRUE'
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>[ \t]*"false"                     return 'FALSE'
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>[a-zA-Z][a-zA-Z_0-9]*        %{
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
<interpolation,if_drt,list_drt,assign_drt,exp,array,hash>"]"                    %{
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
<exp,assign_drt,array,hash>[ \t]*","                                                             return ','
<hash>":"                                                                       return ':'
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
<hash>[ \t]+                        return ''
<array>[ \t]+                       return ''
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
%left '??' '?html' '?string' '?keys'

%right UMINUS
%right NOT
%left EXISTS
%left '(' ')'
%start html
