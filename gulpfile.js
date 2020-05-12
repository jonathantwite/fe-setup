const { series, parallel, src, dest, watch } = require('gulp');
const del = require('del');
const rollup = require('rollup');
const resolve = require('@rollup/plugin-node-resolve');
const { babel } = require('@rollup/plugin-babel');
const { terser } = require('rollup-plugin-terser');
const autoprefixer = require('autoprefixer')
// const sourcemaps = require('gulp-sourcemaps')
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const cssnano = require('cssnano');

const scriptsOut = 'scripts';
const stylesOut = 'styles';

function devJs(){
    return rollup.rollup({
        input: 'src/pages/index-page.js',
        plugins: [ 
            resolve(),
            babel({
                exclude: 'node_modules/**',
                include: 'src/**',
                babelHelpers: 'bundled'
            })
        ]
    }).then(bundle => 
        bundle.write({
            file: scriptsOut + '/index-page.js',
            format: 'iife'
        })
    );
}

function buildJs(){
    return rollup.rollup({
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
            file: scriptsOut + '/index-page.js',
            format: 'iife'
        })
    );
}

function devCss(){
    return src('./scss/**/*.scss')
        .pipe(sass({
            includePaths: ['node_modules']
        }).on('error', sass.logError))
        //.pipe(concatcss('all.css'))
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(dest('./' + stylesOut + '/'));
}
   
function buildCss(){
    return src('./scss/**/*.scss')
        .pipe(sass({
            includePaths: ['node_modules']
        }).on('error', sass.logError))
        //.pipe(concatcss('all.css'))
        .pipe(postcss([
            autoprefixer(),
            cssnano()
        ]))
        .pipe(dest('./' + stylesOut + '/'));
}
  
function clean(){
    return del([scriptsOut + '/**', '!' + scriptsOut, stylesOut + '/**', '!' + stylesOut]);
}

function develop(){
    watch(['src/**/*.js'], { ignoreInitial: false }, devJs);
    watch(['scss/**/*.scss'], { ignoreInitial: false }, devCss);
}

exports.clean = clean;
exports.develop = series(clean, develop);
exports.default = series(clean, parallel(buildJs, buildCss));
