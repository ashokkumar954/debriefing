// Karma configuration
// Generated on Wed Nov 09 2022 22:22:57 GMT+0200 (GMT+02:00)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../',


        // frameworks to use
        // available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
        frameworks: ['requirejs', 'mocha', 'chai', 'sinon', 'chai-sinon'],
        client: {mocha: {ui: 'tdd'}},

        // list of files / patterns to load in the browser
        files: [
            'test/unit-main.js',
            'test/unit-index.js',

            //App and test files
            {pattern: 'web/js/**/*.js', included: false, served: true, watched: true},
            {pattern: 'web/**/*.html', included: false, served: true, watched: true},
            {pattern: 'web/**/*.json', included: false, served: true, watched: true},
            {pattern: 'test/unit/**/*.js', included: false, served: true, watched: true}
        ],

        coverageReporter: {
            type: 'lcov',
            dir: 'coverage/',
            subdir: './'
        },

        junitReporter: {
            outputDir: "coverage/",
            outputFile:"unit_test_report.xml",
            suite:"UnitTests",
            useBrowserName: false
        },

        // exclude nothing (customize if needed)
        exclude: [],

        preprocessors: {
            'web/js/*.js': ['coverage'],
            'web/js/!(vendor|libs)/**/*.js': ['coverage']
        },

        reporters: ['spec', 'coverage', 'junit'],

        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,

        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox', '--disable-gpu'] // --disable-gpu is also often needed in headless environments
            }
        },

        // start these browsers
        // available browser launchers: https://www.npmjs.com/search?q=keywords:karma-launcher
        browsers: ['ChromeHeadlessNoSandbox'],
        singleRun: true,
        concurrency: Infinity
    });
};
