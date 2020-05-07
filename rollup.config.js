import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

export default {
    input: 'src/pages/index-page.js',
    output: {
        file: 'scripts/index-page.js',
        format: 'iife'
    },
    plugins: [ 
        resolve(),
        babel({
            exclude: 'node_modules/**',
            include: 'src/**',
            babelHelpers: 'bundled'
        })
    ]
}