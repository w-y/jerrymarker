# Jerrymarker.js
------

Jerrymarker is a template engine in javascript. Using jison to generate the js code, which makes it easy to scale the lexical and grammer rules to build a more powerful parser. Jerrymarker will build a simple syntax tree for your template and use your context to traverse and render it whenever you want. The rules in jerrymarker template is just like what is in [freemarker](http://freemarker.org/) which is a template engine in Java.

We are tired of coding in freemarker and then swiching to another js template for the ajax parts, so why not a combination of both. In the future you can use nodejs to render the template. Jerrymarker's target is "jerrymarker = javascript + freemarker-- ++".

Whatever, we hope to keep it easily understandable to those who want to learn how the parser works.

Most importantly, just have fun and enjoy it.

# Installing
-----

        grunt build  //to generate the parser javascript from lex/yacc rule

        grunt       //concat the parser and other util codes to generate the dist js files


Installing jerrymarker is easy now. Simple use the javascript from the dist folder. Or just download the javascript from [project site] (http://www.jerrymarker.com).

# Usage
-----

## Interpolation

```javascript
    var context = {
        name: 'bob'
    };

    var source = '<div> Hello ${name} ! </div>';

    var template = jerrymarker.compile(source);

    document.write(template(context));
```
Then we get

```html
    Hello bob !
```

Object is ok
```javascript
    var context = {
        person: {
            name: 'bob',
            age: 25
        }
    };

    var source = 'name: ${person.name}, age: ${person.age}';

    var template = jerrymarker.compile(source);

    document.write(template(context));
```

Then we get

```html
    name: bob, age: 25
```

## Directive

### condition

```javascript
    var context = {
        person: {
            name: 'bob',
            age: 25,
            gender: 'M'
        }
    };
```

        <script id="candidator" type="text/x-jerrymarker-template">
            <#if person.gender == 'M' >
                He is ${person.name}
            <#else>
                She is ${person.name}
            </#if>
        </script>

```javascript
    var nd = document.getElementById('condidator');

    var source = nd.innerHTML;
    
    var template = jerrymarker.compile(source);

    doucument.write(template(context));
```

### loop

```javascript
    var context = {
        people: [
            {
                name: 'bob',
                job: 'programmer'
            },
            {
                name: 'hugo',
                job: 'gardener'
            },
            {
                name: 'jo',
                job: 'student'
            }
        ]
    };
```

        <script id="candidator" type="text/x-jerrymarker-template">
            <ul>
            <#list people as person >
                <li>
                    <span>${person.name}</span>
                    <span>${person.job}</span>
                </li> 
            </#list>
            </ul>
        </script>

### assignment

you assign a number, string or expression to a var in the template:

        <script id="test-assign" type="text/x-jerrymarker-template">
            <#assign x = 2 >
            <#list x..10 as i>
                ${i}
            </#list>

            <#assign y = 'hello' >
            ${y}
            <#assign z = (1+2)*3 >
            ${z}
        </script>

```javascript
    
    var nd = document.getElementById('test-assign');

    var source = nd.innerHTML;
    
    var template = jerrymarker.compile(source);

    doucument.write(template({}));
```

then we get 
```html
    2 3 4 5 6 7 8 9
    hello
    9
```

