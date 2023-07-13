// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,

	// Stage
	prodAdbApi: 'https://stage.ampliz.com',
	prodHcApi: 'https://hcapi.ampliz.com',
	prodNPIApi: 'https://hcapi.ampliz.com',

	prodB2BApi: 'http://159.138.102.73:9000',
	prodGlobalB2BApi: 'https://test.ampliz.com',

	// Prod
	// prodAdbApi: 'https://go.ampliz.com',
	// prodHcApi: 'https://stageapi.ampliz.com',
	// prodNPIApi: 'https://stageapi.ampliz.com',

	// prodB2BApi: 'http://159.138.102.73:9000',
	// prodGlobalB2BApi: 'https://test.ampliz.com',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
