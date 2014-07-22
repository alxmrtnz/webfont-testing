
To work in a local (non-VM) environment

```
  export NODE_ENV=local
```

Get dependencies

```
  npm install grunt-cli -g
  npm install karma -g
  npm install
```

To build everything just run

```
  grunt
```

If you need a static file server with socket.io for development

```
  grunt server
```

Watch/livereload

```
  grunt watch
```

###JavaScript Structure (Angular.js/Browserify)
Angular.js provides a wealth of functionality for non-trivial, data-driven front ends. For this reason, it is included by default. [Browserify](http://browserify.org/) allows us to require modules like in nodejs. This allows for a modular structure encourages strict separation of concern for induvidual components. The structure is like so.

```
- app.js // the application entry point
- controllers.js // aggregates the controllers module
- services.js // aggregates the services/factories module
- directives.js // aggregates the application directives
- filters.js // defines the application's filters
- controllers/
	- mainCtrl.js // defines the main controller (other controllers go in this folder)
- services/
	- aService.js // defines a service (other services/factories go in this foler)
- directives/
	- fooDirective.js // defines the foo directive (other directives go in this folder)

```