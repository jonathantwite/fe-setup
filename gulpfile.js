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
const purgecss = require('@fullhuman/postcss-purgecss');

const scriptsOut = 'scripts';
const stylesOut = 'styles';

function js(isDev){
    return rollup.rollup({
        input: 'src/pages/index-page.js',
        plugins: [ 
            resolve(),
            ...!isDev
                ? [ 
                    babel({
                        exclude: 'node_modules/**',
                        include: 'src/**',
                        babelHelpers: 'bundled'
                    }),
                    terser() 
                ]
                : []
        ]
    }).then(bundle => 
        bundle.write({
            file: scriptsOut + '/index-page.js',
            format: 'iife'
        })
    );
}
   
function css(isDev){
    return src('./scss/**/*.scss')
        .pipe(sass({
            includePaths: ['node_modules']
        }).on('error', sass.logError))

        //css.pipe(concatcss('all.css'))
        
        .pipe(postcss([
            autoprefixer(),
            ...!isDev 
                ? [ 
                    cssnano(),
                    purgecss({
                        content: ['*.html', '!node_modules/**/*']
                    })
                ]
                : []
        ]))
        .pipe(dest('./' + stylesOut + '/'));
}
  
function buildCss(){
    return css(false);
}

function devCss(){
    return css(true);
}

function buildJs(){
    return js(false);
}

function devJs(){
    return js(true);
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
