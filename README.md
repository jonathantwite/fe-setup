# Notes

## 1.  Initial npm setup

*jquery*, *bootstrap* and *popper.js* were added as dependencies.

## 2.  Create module file

I created a set of js files within `src/` using es6 module and arrow function syntax.  `services/calculatorService.mjs` is a service module that exports a `doCalcuation()` method.  This method uses two of the four functions in `modules/maths.mjs`.  The `pages/index-page.js` is a non-exporting file that is to be used directly on an html page.  It uses jQuery selectors to read user-added values and call the `doCalculation()` method from the `calculatorService` module.

In the html page `index.html`, the following script tag was added:

```[html]
<script src="src/pages/index-page.js" type="module">
```

As browsers do not understand the `node_module` layout, the following import must be used in `pages/index-page.js`

```[js]
import '../../node_modules/jquery/dist/jquery';
```

This allows the page to run in up-to-date modern browsers.

## 3.  Add Rollup

*rollup* and *@rollup/plugin-node-resolve* were installed as devDependencies.

A `rollup.config.js` file was created with the following setup:

```[js]
import resolve from '@rollup/plugin-node-resolve';

export default {
    input: 'src/pages/index-page.js',
    output: {
        file: 'scripts/index-page.js',
        format: 'iife'
    },
    plugins: [
        resolve()
    ]
}
```

Rather than having a dependency on a specific jQuery file, the import in `pages/index-page.js` was updated to the npm package, which the `plugin-node-resolve` plugin for rollup resolves:

```[js]
import 'jquery'
```

This allows the command `npx rollup -c` to create a new file `scripts/index-page.js` with the bundled code in *IIFE* format.  The `index.html` was updated to use this file.

```[html]
<script src="scripts/index-page.js"></script>
```

Note that *Tree-Shaking* has automatically taken place and so the functions `multiply()` and `divide()` do not appear in the output file.

## 3.  Add Babel

*@babel/core*, *@babel/preset-env* and *@rollup/plugin-babel* were installed as devDependencies.

A `.babelrc` configuration file was created in the `src/` directory with the following:

```[json]
{
    "presets": [
        ["@babel/env",{ "modules": false }]
    ]
}
```

This prevents babel from converting the es6 modules to *IIFE* or *CommonJS* modules, leaving this for Rollup.

The `rollup.config.js` file is updated to use the babel rollup plugin:

```
import babel from '@rollup/plugin-babel';

export default {
    ...
    plugins: [ 
        ...
        babel({
          exclude: 'node_modules/**',
          include: 'src/**',
          babelHelpers: 'bundled'
        })
    ]
}
```

This will only transpile files in the `src/` folder, and explicitly ignores the `node_module/` imports.  

A `.browserslistrc` file is created with the required browser targets.  Use the `npx browserslist` command to show all browsers targeted by the rules added to this file.

## 4.  Switching to Gulpfile

*gulp* was installed as a devDependency.

A `gulpfile.js` was created to run the Rollup/Babel commands.  The Rollup API currently cannot read the `rollup.config.js` file and so the configuration is copied into the gulpfile method calling Rollup, `rollupBabel()`.  Note that the `output` object is used in the `bundle.write()` method, not the `rollup.rollup()` method.  Also note that Babel must be imported as a method, whereas Rollup and the resolve plugin can be imported as a module:

```[js]
const rollup = require('rollup');
const resolve = require('@rollup/plugin-node-resolve');
const { babel } = require('@rollup/plugin-babel');
```

## 5.  Adding uglification with Terser

*rollup-plugin-terser* was installed as a devDependency.

The terser plugin was imported into the `gulpfile.js` and added as a plugin to the `rollup.rollup()` configuration:

```[js]
const rollupBabel = () =>
    rollup.rollup({
        ...
        plugins: [
            ...
            terser()
        ]
  })...
```

## 6.  Adding Bootstrap

The Bootstrap 4 JavaScript is added via an import of `'bootstrap'` on the `index-page.js` file.  The complete Bootstrap 4 css is initially added via a link tag pointing to the `node_modules/` bootstrap distribution file.

```[html]
<link href="/node_modules/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet" />
```

## 7.  Adding SCSS compilation

*gulp-sass*, *postcss*, *autoprefixer* and *cssnano* were installed as devDependencies. 

A new folder is created called `scss/` with a `site.scss` file.  A `_site.scss` theme file is created in a `scss/themes/` folder.  The `site.scss` file imports the theme file and then the bootstrap file using

```[scss]
@import "bootstrap/scss/bootstrap";
@import "./themes/site";
```

A new gulp task was created to process the `.scss` files, using autoprefixer and cssnano as plugins for postcss.  The gulp-sass method is called with the `includePaths` parameter used to ensure that the `node_modules` folder is scanned when looking for import files:

```[js]
src('./scss/**/*.scss')
    .pipe(sass({
          includePaths: ['node_modules']
    }).on('error', sass.logError))
    ...
```

The task outputs the files to the `styles/` folder and the link tab in `index.html` updated to

```[html]
<link href="styles/site.css" rel="stylesheet" />
```

## 8.  Using only required Bootstrap styling

Note the original SCSS layout was based on the 7-1 Architecture method, but doesn't work very well with Bootstrap (especially when removing unused map items).

The `vendor/_bootstrap_.scss` file was renamed `vendor/_site-bootstrap.scss`.  The generic bootstrap import was replaced with the required bootstrap imports:

```[scss]
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/mixins";
```

The customisations within the `themes/` folder were then added to this file followed by the bootstrap components wanted.

## 9.  Combine build processes

*del* as installed as a devDependency.

A new `clean` gulp task was created to delete the compiled JavaScript and CSS files.  The default task was updated to run this `clean` task in series before the JavaScript and css tasks which run in parallel.

In `package.json`, the `build` script is updated to run the default gulp task.

```[json]
...
"scripts": {
    ...
    "build": "gulp"
},
```
