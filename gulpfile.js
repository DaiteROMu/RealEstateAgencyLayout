let { src, dest } = require('gulp');
let gulp = require('gulp');
let prettyHtml = require('gulp-pretty-html');
let browserSync = require('browser-sync');
let del = require('del');
let scss = require('gulp-sass');
let stylelint = require('gulp-stylelint');
let autoprefixer = require('gulp-autoprefixer');
let group_media = require('gulp-group-css-media-queries');
let clean_css = require('gulp-clean-css');
let rename = require('gulp-rename');
let babel = require('gulp-babel');
let concat = require('gulp-concat');
let eslint = require('gulp-eslint');
let uglify = require('gulp-uglify-es').default;
let imagemin = require('gulp-imagemin');

let project_folder = './dist/';
let source_folder = './src/';

let path = {
    build: {
        html: project_folder,
        css: project_folder + 'css/',
        js: project_folder + 'js/',
        img: project_folder + 'img/',
        fonts: project_folder + 'fonts/',
    },
    src: {
        html: source_folder + '/*.html',
        css: source_folder + 'scss/styles.scss',
        js: source_folder + 'js/*.js',
        img: source_folder + 'img/**/*.{jpg,png,svg,gif,ico}',
        fonts: source_folder + 'fonts/*.ttf',
    },
    watch: {
        html: source_folder + '**/*.html',
        css: source_folder + 'scss/**/*.scss',
        js: source_folder + 'js/**/*.js',
        img: source_folder + 'img/**/*.{jpg,png,svg,gif,ico}',
    },
    clean: project_folder,
};

function browserSyncFunction() {
    browserSync.init({
        server: {
            baseDir: project_folder,
        },
        port: 3000,
        notify: false,
    });
}

function html() {
    return src(path.src.html)
        .pipe(
            prettyHtml({
                indent_size: 4,
                indent_char: ' ',
                unformatted: [
                    'code',
                    'pre',
                    'em',
                    'strong',
                    'span',
                    'i',
                    'b',
                    'br',
                ],
            })
        )
        .pipe(dest(path.build.html));
}

function css() {
    return src(path.src.css)
        .pipe(
            stylelint({
                failAfterError: false,
                reporters: [
                    {
                        formatter: 'string',
                        console: true,
                    },
                ],
            })
        )
        .pipe(
            scss({
                outputStyle: 'expanded',
            })
        )
        .pipe(group_media())
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 5 versions'],
                cascade: true,
            })
        )
        .pipe(dest(path.build.css))
        .pipe(
            clean_css({
                level: {
                    1: {
                        specialComments: 0,
                    },
                },
            })
        )
        .pipe(
            rename({
                extname: '.min.css',
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browserSync.stream());
}

function js() {
    return src(path.src.js)
        .pipe(
            babel({
                presets: ['@babel/env'],
            })
        )
        .pipe(concat('script.js'))
        .pipe(
            eslint({
                fix: true,
            })
        )
        .pipe(eslint.format())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(
            rename({
                extname: '.min.js',
            })
        )
        .pipe(dest(path.build.js));
}

function img() {
    return src(path.src.img)
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true,
                optimizationLevel: 3,
            })
        )
        .pipe(dest(path.build.img));
}

function clean() {
    return del(path.clean);
}

function watcher() {
    gulp.watch(path.watch.html, html).on('change', browserSync.reload);
    gulp.watch(path.watch.js, js).on('change', browserSync.reload);
    gulp.watch(path.watch.img, img).on('change', browserSync.reload);
    gulp.watch(path.watch.css, css);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, img));
let watch = gulp.parallel(build, browserSyncFunction, watcher);

exports.html = html;
exports.css = css;
exports.js = js;
exports.img = img;
exports.build = build;
exports.watch = watch;
exports.default = watch;
