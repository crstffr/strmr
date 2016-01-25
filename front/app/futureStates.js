/**
 * These are the future states that are supplied to the ui router extras
 * $futureStateProvider via the lazyRouter. Currently only supports lazy
 * loading the top level routes. Child routes are specified in the parent
 * route definition.
 *
 * @type {Array}
 */
module.exports = [
	{
		urlPrefix: '/',
		stateName: 'app',
		src: 'app/routes/index.route',
		type: 'lazyroute'
	},
	{
		stateName: 'app.auth',
		urlPrefix: '/auth/',
		src: 'app/routes/auth/auth.route',
		type: 'lazyroute'
	},
	{
		stateName: 'app.auth.login',
		urlPrefix: '/auth/login/',
		src: 'app/routes/auth/login/auth.login.route',
		type: 'lazyroute'
	},
	{
		stateName: 'app.auth.logout',
		urlPrefix: '/auth/logout/',
		src: 'app/routes/auth/logout/auth.logout.route',
		type: 'lazyroute'
	},
	{
		stateName: 'app.auth.register',
		urlPrefix: '/auth/register/',
		src: 'app/routes/auth/register/auth.register.route',
		type: 'lazyroute'
	},
	{
		stateName: 'app.library',
		urlPrefix: '/library/',
		src: 'app/routes/library/library.route',
		type: 'lazyroute'
	},
	{
		stateName: 'app.library.movies',
		urlPrefix: '/library/movies/',
		src: 'app/routes/library/movies/library.movies.route',
		type: 'lazyroute'
	},
	{
		stateName: 'app.library.tvshows',
		urlPrefix: '/library/tvshows/',
		src: 'app/routes/library/tvshows/library.tvshows.route',
		type: 'lazyroute'
	},
	{
		stateName: 'app.magnet',
		urlPrefix: '/magnet/',
		src: 'app/routes/magnet/magnet.route',
		type: 'lazyroute'
	}
];
