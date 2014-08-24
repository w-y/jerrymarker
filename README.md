# Jerrymarker.js
------

Jerrymarker.js is a template engine in javascript, just like a [freemarker](http://freemarker.org/) which is written in java.

Jerrymarker = javascript + freemarker-- on same day.

We are tired of coding in freemarker and then swiching to another js template for the ajax parts, so why not a combination of both.

Whatever, we hope to keep it easily understandable to those who want to learn how the parser works.

Most importantly, just have fun and enjoy it.

# Installing
-----

Installing jerrymarker is easy now. Simple download the javascript from the dist folder.

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
                    <span>person.name</span>
                    <span>person.job</span>
                </li> 
            </#list>
            </ul>
        </script>

### assignment

assign a number, string or expression to a var in the context:

        <script id="test-list" type="text/x-jerrymarker-template">
            <#assign x = 2 >
            <#list x..10 as i>
                ${i}
            </#list>

            <#assign y = 'hello' >
            ${y}
            <#assign z = (1+2)*3 >
            ${z}
        </script>

then we get 
```html
    2 3 4 5 6 7 8 9
    hello
    9
```

