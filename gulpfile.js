const { series, parallel, src, dest } = require('gulp');
const rollup = require('rollup');
const resolve = require('@rollup/plugin-node-resolve');
const { babel } = require('@rollup/plugin-babel');
const { terser } = require('rollup-plugin-terser');
const autoprefixer = require('autoprefixer')
// const sourcemaps = require('gulp-sourcemaps')
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const cssnano = require('cssnano');

const jsRollupBabel = () =>
  rollup.rollup({
    input: 'src/pages/index-page.js',
    plugins: [ 
        resolve(),
        babel({
          exclude: 'node_modules/**',
          include: 'src/**',
          babelHelpers: 'bundled'
        }),
        terser()
    ]
  }).then(bundle => 
    bundle.write({
      file: 'scripts/index-page.js',
      format: 'iife'
    })
  );

const buildJs = series(jsRollupBabel);

const buildCss = () =>
  src('./scss/**/*.scss')
    .pipe(sass({
      includePaths: ['node_modules']
    }).on('error', sass.logError))
    //.pipe(concatcss('all.css'))
    .pipe(postcss([
      autoprefixer(),
      cssnano()
    ]))
    .pipe(dest('./styles/'));
  
  

const def = series(parallel(buildJs, buildCss));


module.exports = {
  "default": def,
  buildJs,
  buildCss
};



//var gulp = require("gulp");
//const rollup = require('rollup');
//
//gulp.task("default", function () {
//  return gulp.src("src/**/*.js")
//    .pipe(babel())
//    .pipe(concat("all.js"))
//    .pipe(gulp.dest("dist"));
//});