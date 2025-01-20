const mix = require('laravel-mix');

require('dotenv').config({ path: __dirname + '/../../../../.env' });

// Disable manifest.
Mix.manifest.refresh = _ => void 0;

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your WordPress-theme. By default, we are compiling the Sass
 | for the application as well as bundling up all the JS files.
 |
 */

mix

    // CSS.
    .sass('assets/scss/style.scss', './style.css')
    .sass('assets/scss/adt-searchform.scss', './dist/css')
    .sass('assets/scss/adt-blog-posts.scss', './dist/css')
    .sass('assets/scss/adt-issues.scss', './dist/css')

    // .sass('assets/sass/form-widget-popup.scss', './assets/css/form-widget-popup.css', {
    //     additionalData: "$WP_HOME: '" + process.env.WP_HOME + "';",
    // })

    // JS.
    .js('assets/js/adt-searchform.js', './dist/js')
    .js('assets/js/adt-faq.js', './dist/js')

    // Options.
    .options({
        processCssUrls: false
    });