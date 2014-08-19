## jerrymarker.js
------

Jerrymarker.js is a template engine in javascript, just like a [freemarker](http://freemarker.org/) which is written in java.

Jerrymarker = javascript + freemarker-- on same day.

We are tired of coding in freemarker and then swiching to another js template for the ajax parts, so why not a combination of both.

The code is written by a newbie who don't have a good taste about coding. Still Imporving...

Whatever, we hope to keep it easily understandable to those who want to learn how template engine works, and we will keep improving it.

Most importantly, just have fun and enjoy it.

## Installing
-----

Installing jerrymarker is easy now. Simple download the javascript from the dist folder.

## Usage
-----

### Interpolation

```javascript
    var context = {
        name: 'bob'  
    };
    
    var source = '<div> Hello ${name} ! </div>';
    
    var template = jerrymarker.compile(source);
    
    document.write(template.parse(context));
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
    
    document.write(template.parse(context));
```

Then we get

```html
    name: bob, age: 25
```

### Directive

