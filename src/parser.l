/* parser lexical grammar */
%lex

%s if_drt list_drt assign_drt interpolation exp logic_op array

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
<interpolation,if_drt,list_drt,assign_drt,exp,array>[0-9]+("."[0-9]+)?\b              return 'NUMBER'
<interpolation,if_drt,list_drt,assign_drt,exp,array>\"[^"\n]*["\n]|\'[^'\n]*['\n]     return 'STRING'

<interpolation,if_drt,list_drt,assign_drt,exp,array>[ \t]*"true"                      return 'TRUE'
<interpolation,if_drt,list_drt,assign_drt,exp,array>[ \t]*"false"                     return 'FALSE'
<interpolation,if_drt,list_drt,assign_drt,exp,array>[a-zA-Z][a-zA-Z_0-9]*             %{
                                                                                        return 'IDENTIFIER';
                                                                                      %}
<list_drt>".."                                                                        return '..'
<interpolation,if_drt,list_drt,assign_drt,exp,array>"*"                               return '*'
<interpolation,if_drt,list_drt,assign_drt,exp,array>"/"                               return '/'
<interpolation,if_drt,list_drt,assign_drt,exp,array>"%"                               return '%'
<interpolation,if_drt,list_drt,assign_drt,exp,array>"-"                               return '-'
<interpolation,if_drt,list_drt,assign_drt,exp,array>"+"                               return '+'

<interpolation,if_drt,list_drt,assign_drt,exp,array>"["                               %{
                                                                                        this.begin('array');
                                                                                        return '[';
                                                                                      %}
<interpolation,if_drt,list_drt,assign_drt,exp,array>"]"                         %{
                                                                                    this.popState();
                                                                                    return ']';
                                                                                %}
<interpolation,if_drt,list_drt,assign_drt,exp,array>"||"                        %{
                                                                                    return '||';
                                                                                %}
<interpolation,if_drt,list_drt,assign_drt,exp,array>"&&"                        %{
                                                                                    return '&&';
                                                                                %}
<interpolation,if_drt,list_drt,assign_drt,exp,array>"<="                              return '<='
<interpolation,if_drt,list_drt,assign_drt,exp,array>">="                              return '>='
<interpolation,if_drt,list_drt,assign_drt,exp,array>"<"                               return '<'
<interpolation,if_drt,list_drt,assign_drt,exp,array>[ \t]*"("                   %{
                                                                                    this.begin('exp');
                                                                                    return '(';
                                                                                %}
<exp>">"                                                                        return '>'
<exp,assign_drt,array>[ \t]*","                                                             return ','
<interpolation,if_drt,list_drt,assign_drt,exp,array>")"[ \t]*                   %{
                                                                                    this.popState();
                                                                                    return ')';
                                                                                %}
<interpolation,if_drt,list_drt,assign_drt,exp,array>"."                         return 'DOT'
<interpolation,if_drt,list_drt,assign_drt,exp,array>"=="                        return '=='
<interpolation,if_drt,list_drt,assign_drt,exp,array>"!="                        return '!='
<assign_drt>"="                                                                 return '='
<interpolation,if_drt,list_drt,assign_drt,exp,array>[ \t]*"!"                   return '!'

<interpolation,if_drt,list_drt,assign_drt,exp,array>"??"[ \t]*                  return '??'
<interpolation,if_drt,list_drt,assign_drt,exp,array>"?html"[ \t]*               return '?html'
<interpolation,if_drt,list_drt,assign_drt,exp,array>"?string"[ \t]*             return '?string'

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
%left '??' '?html' '?string'

%right UMINUS
%right NOT
%left EXISTS
%left '(' ')'
%start html
