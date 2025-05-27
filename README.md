# uibuilder Template: Svelte Simple

This is a very simple template for using the [Svelte](https://svelte.dev/) front-end framework with uibuilder and Node-RED. It was originally created from Svelte's https://github.com/sveltejs/template template.

## Getting Started

You could manually copy the template folders into your uibuilder instance root folder but it is much easier to use the built-in template manager in uibuilder. This will copy the template into your uibuilder instance and set it up for you. This template is available in the uibuilder template manager as `Svelte Simple`. To install it, go to the uibuilder node in Node-RED and select the `Svelte Simple` template from the dropdown list. This will copy the template into your uibuilder instance and set it up for you.

Once loaded into your uibuilder instance, no updates will be made to the template files by uibuilder. If you want to update the template, you can do so by re-doing the installation. Of course, this will overwrite all files of the same name so if you want to retain anything you have done, make a copy first.

### Template preparation

As this template uses [Svelte](https://svelte.dev/) as the front-end framework, you will need to install the development dependencies. To do this, run the following from the instance root folder:

```bash
npm install
```

This will install all of the required dependencies for Svelte and Rollup. You can also install any other npm packages you want to use in your app.

### Serve `dist` not `src`

The template requires a build step and therefore you need to change the uibuilder node settings to use the `dist` folder as the source folder. This is done in the advanced settings of the uibuilder node. The `dist` folder is where the built files will be served from. The template is distributed with the `dist` folder already populated so you can use it immediately. 

### Development

Note that the template is configured to use an HTML element (in `src/index.html`) with the id `app` as the root element for the Svelte app. This is where the Svelte app will be mounted. You can change this if you want but you will need to change it in `index.html`, `main.js` and `rollup.config.js` to match.

As you start to develop your app, you can run the development server by running the following command from the instance root folder:

```bash
npm run build
```

This creates a background task that watches for changes in the `src` folder and automatically rebuilds the `dist` folder when changes are detected. 

If you have the page open in your browser, it will automatically reload when changes are made. This is a great way to develop your app as you can see the changes immediately.

If you're using [Visual Studio Code](https://code.visualstudio.com/) it is recommended to install the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode). If you are using other editors you may need to install a plugin in order to get syntax highlighting and intellisense.

### Production

Once you have finished your development, you should stop the dev server and run the following command from the instance root folder:

```bash
npm run build
```
This will create an optimised version of your code in the `dist` folder.

## UI

The template shows a simple UI with a card showing 2 dynamic outputs. The first of which can be changed by sending a message to the uibuilder node containing a `msg.greeting` string. They are examples of how to use dynamic data in the Svelte app.

There is a form card containing 3 inputs and a button that uses the `uibuilder.eventSend(event)` function to send a message to the Node-RED. The message will contain the values of the inputs as `msg.payload` as well as extended form data in `msg._ui`. This is a simple way to send data from your UI to Node-RED.

There is then another button that uses the `uibuilder.send(msg)` function to send a custom message back to Node-RED. This is a simple way to send any custom data from your UI to Node-RED.

There is also an empty `<div>` element with the id `more`. This is included in all uibuilder templates. It is used by the uibuilder example flows that output dynamic UI elements. You may find it convenient to use for your own purposes. You can add your own elements to it in the HTML or JavaScript code. The uibuilder example flows will add their own elements to it when they are run.

In addition, the `more` div uses uibuilder's `uib-topic` special attribute which allows it to be used as a target for messages sent from Node-RED. This is a useful feature that allows you to easily update the content of the page without having to write any JavaScript code. Send a message containing `{ topic: 'more', payload: 'Hello World' }` to the `uibuilder` node and the content of the `more` div will be updated with "Hello World". Note that the payload can contain HTML. As an example, use an inject node with `msg.payload` set to use a JSONata expression like `"<b style='background-color:var(--error)'>Hello!</b> This is a message from Node-RED at " & $moment()`. Don't forget to set `msg.topic` to `more` so that the uibuilder client library knows where to send the message.

> **WARNING**: Using the "more" topic completely overwrites the contents of the `more` div.

## Folders

* `/` - The root folder contains this file. It can be used for other things **but** it will not be served up in the Node-RED web server. 
* `/src/` - the default folder that serves files as web resources. However, this can be changed to a different folder if desired.
* `/dist/` - the default folder for serving files as web resources where a build step is used. In that case, the `/src` folder is the source used by the build tool and `/dist` is the destination for the build (the "distribution" folder).
* `/routes/` - This folder can contain `.js` files defining routing middleware for uibuilder's ExpressJS web server.
* `/api/` - This folder can contain `.js` files defining REST API's specific to this uibuilder instance.
* `/types/` - Contains typescript definition files (`*.d.ts`) for the uibuilder client library. This is not used by uibuilder but can be used by your IDE to provide type checking and auto-completion for the uibuilder client library. This is useful if you are using TypeScript or JavaScript with type checking enabled. Remember to update these for new uibuilder versions.

The above folders will all pre-exist for the built-in uibuilder templates. The folders can safely be removed if not needed but one folder must exist to serve the web resources from (this cannot be the root folder).

The template only has files in the root and `src` folders. The `src` folder is the default used by uibuilder to serve up files to clients.

One reserved item in the root folder however will be a `package.json` file. This will be used in the future to help with build/compile steps. You can still use it yourself, just bear in mind that a future version of uibuilder will make use it as well. If you need to have any development packages installed to build your UI, don't forget to tell `npm` to save them as development dependencies not normal dependencies.

The `dist` folder should be used if you have a build step to convert your source code to something that browsers understand. So if you are using a build (compile) step to produce your production code, ensure that it is configured to use the `dist` folder as the output folder and that it creates at least an `index.html` file.

You can switch between the `src` and `dist` (or other) folders using the matching setting in the Editor. See uibuilder's advanced settings tab.

Also note that you can use **linked** folders and files in this folder structure. This can be handy if you want to maintain your code in a different folder somewhere or if your default build process needs to use sub-folders other than `src` and `dist`.(Though as of v6, you can specify any sub-folder to be served)

## Files in this template

* `package.json`: REQUIRED. Defines the basic structure, name, description of the project and defines any local development dependencies if any. Also works with `npm` allowing the installation of dev packages (such as build or linting tools).
* `README.md`: This file. Change this to describe your web app and provide documentation for it.
* `LICENSE`: A copy of the Apache 2.0 license. Replace with a different license if needed. Always license your code. Apache 2.0 matches the licensing of uibuilder.
* `tsconfig.json`: A configuration file for TypeScript. This can be used by your IDE to provide descriptions, type checking and auto-completion for the uibuilder client library. This is useful if you are using TypeScript or JavaScript with type checking enabled. Uses the typescript definition files in the `/types` folder, remember to update these for new uibuilder versions.

* `src/index.html`: Contains the static HTML that hosts your Svelte app. It is required.
* `src/main.js`: Is the entry point for your Svelte app. It is required.
* `src/index.css`: The master CSS for styling. Linked to in the html file. Also imports the Svelte app's CSS.
* `src/App.svelte`: The main Svelte app. This defines the core Svelte app. It is required.

* `dist/index.html`: The live version of the `src/index.html` file.
* `dist/index.css`: The live version of the `src/index.css` file.
* `dist/build/bundle.js`: The built version of the Svelte app.
* `dist/build/bundle.css`: The built version of the Svelte app's CSS.
* `dist/build/bundle.js.map`: The source map for the built version of the Svelte app. This is used for debugging and is optional.

## Multiple HTML pages

uibuilder will happily serve up any number of web pages from a single instance. It will also make use of sub-folders. However, each folder should have an `index.html` file so that a URL that ends with the folder name will still work without error.

Note that each html file is a separate page and requires its own JavaScript and uibuilder library reference. When moving between pages, remember that every page is stand-alone, a new environment. You can share one `index.js` file between multiple pages if you prefer but each page will run a separate instance. Moving the library processing to a web worker may allow sharing of connections, this will be explored in the future.

If multiple pages are connected to the same uibuilder instance, they will all get the same broadcast messages from Node-RED. So if you want to handle different messages on different pages, remember to filter them in your front-end JavaScript in `uibuilder.onChange('msg', ....)` function. Turn on the advanced flag for including a `msg._uib` property in output if you need to differentiate between pages and/or clients in Node-RED.

## URL endpoints

When specifying links in your HTML, CSS and JavaScript files, you should use relative URLs. e.g. `./index.js` will load that file from the `src` folder or wherever else you have told uibuilder to use.

When using uibuilder's server-side resources, you will generally use `../uibuilder/....`, for example `../uibuilder/uib-brand.min.css` as seen in the default `index.css` file. When accessing a front-end library being served by uibuilder, you can use the form `../uibuilder/vendor/....`. Use the "Full details" button in the uibuilder node to see all of the possible endpoints you may want to use.

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

This template may be used however you like. It is provided as a test template for uibuilder and is not intended to be a full template. You are free to use it as a starting point for your own template or to use it as-is if you find it useful.

