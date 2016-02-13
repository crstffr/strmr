// Use of Gulp Help requires passing Gulp to the
// gulp-help plugin.  This is also where we
// specify the global Gulp Help options.

var gulp = require('gulp-help')(require('gulp'), {
    hideEmpty: true,
    hideDepsMessage: true
});

var _ = require('lodash');
var sequence = require('run-sequence');
var child_process = require('child_process');


/***********************
 * PATHS
 ***********************/

var _root = __dirname + '/';
var _app = _root + '/';
var _static = _app + '/';
var _source = _static + 'app/';

var _paths = {
    dist: _root + 'dist/',

    config: {
        npm: _root + 'package.json',
        karma: _root + 'karma.conf.js',
        system: _static + 'config.js'
    },

    js: _static + 'app/',
    css: _static + 'style/css/',
    sass: _static + 'style/sass/',
    jspm: _static + 'jspm/',
    images: _static + 'images/',
    components: _source + 'components/',

    test: {
        results: _static + 'test/reports/results/',
        coverage: _static + 'test/reports/coverage/'
    }
};

/***********************
 * GLOBS
 ***********************/

var globs = {

    js: [
        _paths.js + '**/!(*spec|mock).js'
    ],

    css: [
        _paths.js + '**/*.css',
        _paths.css + '**/*.css'
    ],

    html: [
        // Looking for JS app templates
        _paths.js + '**/*.html'
    ],

    lang: [
        _static + 'lang/**/*.js'
    ],

    sass: {
        app: [

            // Files that are watched and then rebuilt into
            // app.min.css when they are modified.

            _paths.sass + '**/*.scss'
        ],
        comp: [

            // Files that are watched and then rebuilt into
            // their own component folders when modified.

            _paths.js + '**/*.scss'
        ]
    },

    test: {
        results: [
            _paths.test.results + '**/*.html'
        ],
        coverage: [
            _paths.test.coverage + '**/*.html'
        ]
    }
};


/***********************
 * MAIN TASKS
 ***********************/

gulp.task('default', ['help']);

gulp.task('clean', function(done) {
    sequence(
        'dist:clean',
        done
    );
});

gulp.task('sass', 'Create CSS files from SASS sources.', function (done) {
    sequence(
        'sass:app',
        'sass:comp',
        done
    );
});

gulp.task('server', 'Serve the application and reload files on change.', function (done) {
    sequence(
        'sass',
        'sass:watch',
        'lint:watch',
        'build:server',
        done
    );
});

gulp.task('tdd', 'Serve test coverage, test source files on change.', function (done) {
    sequence(
        'sass',
        'sass:watch',
        'lint:watch',
        'unit-test:watch',
        'build:server',
        'coverage:server',
        done
    );
});

gulp.task('test', 'JSHint and unit test the application JS.', function(done) {
    sequence(
        'lint',
        'unit-test',
        done
    );
});

gulp.task('deploy', 'Bundle and copy files to Firebase', function(done) {
    sequence(
        'bundle',
        'firebase:deploy',
        'unbundle',
        done
    );
});


/***********************
 * SASS to CSS
 ***********************/

gulp.task('sass:app', function () {

    var sassJspm = require('sass-jspm-importer');
    var sourcemaps = require('gulp-sourcemaps');
    var minifyCSS = require('gulp-minify-css');
    var rename = require('gulp-rename');
    var sass = require('gulp-sass');

    return gulp.src(globs.sass.app)
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            functions: sassJspm.resolve_function(_paths.jspm),
            importer: sassJspm.importer
        }).on('error', sass.logError))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifyCSS())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(_paths.css));
});

gulp.task('sass:comp', function () {

    var sassJspm = require('sass-jspm-importer');
    var sourcemaps = require('gulp-sourcemaps');
    var minifyCSS = require('gulp-minify-css');
    var rename = require('gulp-rename');
    var sass = require('gulp-sass');

    return gulp.src(globs.sass.comp, {base: './'})
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            functions: sassJspm.resolve_function(_paths.jspm),
            importer: sassJspm.importer
        }).on('error', sass.logError))
        .pipe(minifyCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./'));
});


gulp.task('sass:watch', function () {

    // Watch app SASS files for changes, rebuild as needed

    gulp.watch(globs.sass.app, ['sass:app']);
    gulp.watch(globs.sass.comp, ['sass:comp']);

});

/***********************
 * LINT
 ***********************/


gulp.task('lint', function () {

    var print = require('gulp-print');
    var jshint = require('gulp-jshint');

    return gulp.src(globs.js)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(print(function (filepath) {
            return 'Linted: ' + filepath;
        }));
});

gulp.task('lint:changed', function () {

    var print = require('gulp-print');
    var cache = require('gulp-cached');
    var jshint = require('gulp-jshint');

    return gulp.src(globs.js)
        .pipe(cache('linting'))  // Only lint changed or uncached files
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(print(function (filepath) {
            return 'Linted: ' + filepath;
        }));
});

gulp.task('lint:watch', ['lint:changed'], function () {
    gulp.watch(globs.js, ['lint:changed']);
});



/***********************
 * UNIT TEST
 ***********************/


gulp.task('unit-test', function (done) {

    var Karma = require('karma');

    new Karma.Server({
        configFile: _paths.config.karma,
        singleRun: true
    }, done).start();
});

gulp.task('unit-test:watch', [], function (done) {

    var Karma = require('karma');

    var isdone = false;
    var server = new Karma.Server({
        configFile: _paths.config.karma,
        autoWatch: true,
        singleRun: false
    });
    server.on('run_complete', function() {
        // this ensures done() is called so that the run
        // sequence is maintained, but also ensures that
        // done() is only called once.
        if (!isdone) { done(); isdone = 1; }
    });
    server.start();
});

/***********************
 * BUNDLE
 ***********************/

gulp.task('bundle', [], function(done){

    var minimist = require('minimist');
    var options = minimist(process.argv.slice(2));

    var config = require('./bundle.config');
    var Bundler = require('jspm-bundler');
    var bundler = new Bundler(config);
    bundler.bundle(options.g).then(function(){
        done();
    });

});

gulp.task('unbundle', [], function(done){

    var minimist = require('minimist');
    var options = minimist(process.argv.slice(2));

    var config = require('./bundle.config');
    var Bundler = require('jspm-bundler');
    var bundler = new Bundler(config);
    bundler.unbundle(options.g).then(function(){
        done();
    });

});

gulp.task('firebase:deploy', [], function(done){
    var spawn = require('child_process').spawn;
    spawn('firebase', ['deploy'], {stdio: 'inherit'}).on('close', function(){
        done();
    });
});


/***********************
 * BROWSER SYNC
 ***********************/


gulp.task('build:server', [], function (done) {

    var browserSync = require('browser-sync');

    browserSync.create().init({
        port: 8100,
        ui: { port: 8101 },
        open: false,
        notify: false,
        logLevel: 'error',
        ghostMode: false,
        timestamps: false,
        logFileChanges: false,
        server: {baseDir: _paths.static },
        files: [].concat(globs.js)
                .concat(globs.css)
                .concat(globs.html)
                .concat(globs.lang)
    });

    done();

});

gulp.task('coverage:server', function (done) {

    var browserSync = require('browser-sync');

    browserSync.create().init({
        port: 8200,
        ui: { port: 8201 },
        open: true,
        notify: false,
        ghostMode: false,
        logLevel: 'silent',
        logFileChanges: false,
        files: globs.test.coverage,
        server: {baseDir: _paths.test.coverage }
    });

    done();
});
