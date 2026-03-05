require.config({
    baseUrl: '/code/web/js',

    // dynamically load all test files
    deps: ['/code/test/unit-index.js'],
    paths: {
        'ojs': 'libs/oj/18.1.0/debug',
        'ojL10n': 'libs/oj/18.1.0/ojL10n',
        'ojtranslations': 'libs/oj/18.1.0/resources',
        'knockout': 'libs/knockout/knockout-3.5.1.debug',
        'jquery': 'libs/jquery/jquery-3.7.1',
        'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.14.1',
        'text': 'libs/require/text',
        'signals': 'libs/js-signals/signals',
        'ojdnd': 'libs/dnd-polyfill/dnd-polyfill-1.0.2',
        'css': 'libs/require-css/css',
        'css-builder': 'libs/require-css/css-builder',
        'normalize': 'libs/require-css/normalize',
        '@oracle/oraclejet-preact': 'libs/oraclejet-preact/amd',
        'preact': 'libs/preact/dist/preact.umd',
        'preact/hooks': 'libs/preact/hooks/dist/hooks.umd',
        'preact/compat': 'libs/preact/compat/dist/compat.umd',
        'preact/devtools': 'libs/preact/devtools/dist/devtools.umd.js',
        'preact/jsx-runtime': 'libs/preact/jsx-runtime/dist/jsxRuntime.umd',
        'hammerjs': 'libs/hammer/hammer-2.0.8',
        'customElements': 'libs/webcomponents/custom-elements',
        'touchr': 'libs/touchr/touchr'
    },
    callback: function () {
        if (window.karma) window.karma.start();
    }
});