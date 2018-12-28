// https://spectrum.chat/zeit/general/unable-to-import-module-now-launcher-error~2662f0ba-4186-402f-b1db-2e3c43d8689a
const env =
	process.env.NODE_ENV === 'development'
		? {} // We're never in "production server" phase when in development mode
		: !process.env.NOW_REGION
		? require('next/constants') // Get values from `next` package when building locally
		: require('next-server/constants') // Get values from `next-server` package when building on now v2

// fix: prevents error when .css files are required by node
// https://github.com/zeit/next.js/blob/master/examples/with-ant-design/next.config.js
if (typeof require !== 'undefined') {
	require.extensions['.css'] = file => {}
}

module.exports = (phase, { defaultConfig }) => {
	// prepare
	let config = defaultConfig

	// disable extensions in production, as they are precompiled
	if (phase === env.PHASE_PRODUCTION_SERVER) return config

	// add css
	const withCss = require('@zeit/next-css')
	config = withCss(config)

	// add typescript
	const withTypescript = require('@zeit/next-typescript')
	config = withTypescript(config)

	// export
	return config
}
