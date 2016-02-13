module.exports = {

    baseURL: '/',

    dest: 'bundle',
    file: 'bundle.js',
    bust: true,

    builder: {
        minify: true,
        mangle: true,
        sourceMaps: true,
        lowResSourceMaps: false
    },

    bundles: {
        libs: {
            items: ['angular', 'lodash']
        },
        common: {
            combine: true,
            exclude: ['libs'],
            items: ['strmr-common']
        },
        style: {
            exclude: ['libs', 'common'],
            items: ['style/style']
        },
        app: {
            exclude: ['libs', 'common', 'style'],
            items: ['app/app']
        },
        routes: {
            exclude: ['libs', 'common', 'style', 'app'],
            items: [
                'app/routes/index.route',
                'app/routes/auth/auth.route',
                'app/routes/auth/login/auth.login.route',
                'app/routes/library/library.route',
                'app/routes/magnet/magnet.route'
            ]
        }
    }
};
