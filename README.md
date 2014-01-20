# Gizmo

## What is Gizmo?

> "It's like jQuery UI's 'Widget' factory - but without the need for jQuery."

Gizmo is a simple, but extendable platform for building reusable front-end components. Gizmo is similar to jQuery UI's [Widget factory](http://jqueryui.com/widget/) - but without the reliance on jQuery (or any other external libraries, for that matter).

## Core Functionality

### Event Emitters

All of the tools necessary for implementing the [observer pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#observerpatternjavascript) are baked in to Gizmo:

```javascript
var Truck = Gizmo.extend({
	'init': function() {
	
        this.bind('some_event', function(data) {
	        // Callback function is fired whenever `some_event` occurs.
        });
        
        this.trigger('some_event', {
	        'name': 'Moe'
        });
        
	}
});
```

### DOM State Notifications

A Gizmo component will trigger a `ready` event when it is inserted into the DOM, and a `destroy` event when it is removed, enabling the developer to perform setup and teardown routines as needed and at the correct time.

```javascript
var Truck = Gizmo.extend({
	'init': function() {
	
        this.bind('ready', function() {
	        // The component has been inserted into the DOM.
        });
        
		this.bind('destroy', function() {
			// The component has been removed from the DOM.
		});
        
	}
});
```


### Inheritance

A Gizmo component can easily extend the functionality offered by an existing component by calling that component's `extend` method:

```javascript
var Vehicle = Gizmo.extend({
	'go': function() {
		console.log('I am going.');
	}
});

var Truck = Vehicle.extend({
	'go': function() {
		console.log('I am rolling.');
	}
});
```

### Prototype Chaining

In the previous example, `Truck` can still call `Vehicle`'s overridden `go` method as shown below:

```javascript
var Truck = Vehicle.extend({
	'go': function() {
		this._super();
	}
});
```

### Default Options

When creating a new instance of a Gizmo components, two arguments are passed: the ID of a container element and an (optional) options object, as shown below:

```javascript
var truck = new Truck('container', {
	'color': 'blue',
	'wheels': 4
});
```

A Gizmo component has the ability to define default options as shown here:

```javascript
var Truck = Vehicle.extend({
	'defaults': {
		'color': 'red',
		'wheels': 6
	}
});
```

## Examples

### Creating a New Gizmo Component

In the following example, a RequireJS module is created in which we define a new Gizmo component. We "require" a template, which is passed to the component. In this example, we're using the RequireJS [text plugin](https://github.com/requirejs/text) -  but you could just as easily use something more sophisticated such as [Handlebars](https://github.com/SlexAxton/require-handlebars-plugin). We also require a stylesheet containing rules specific to this component. As a result, a developer needing to implement this component need only require a single module and instantiate it, as shown in the next example.

```javascript
define([
	'require',
	'gizmo',
	'text!./my_template.txt',
	'css!./my_style.css'
], function(require, Gizmo, template, css) {

    var Widget = Gizmo.extend({
	    'template': template,
	    'init': function() {
	    
		    // A new instance of the widget has been created.
		    
			// this.el contains a reference the our component's DOM node.
		    
		    this.bind('ready', function() {
			    // The widget is available within the DOM.
		    });
		    
		    this.bind('destroy', function() {
			    // The widget has been removed from the DOM.
		    });
		    
	    }
    });
    
	return Widget;

});
```

### Using a Gizmo Component

With our Gizmo component now defined, we can use it as shown below:

```javascript
require(['path/to/component'], function(Widget) {
    var widget = new Widget('containerID', {
	    'option1': 'value1',
	    'option2': 'value2'
    });
});
```

## Installation

### Bower

```
$ bower install gizmo
```

## License (MIT)

```
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```