/* eslint-disable */

const Fetch = (function(){

	if (!('fetch' in window)) {
		console.log('Fetch API not found, try including the polyfill');
		return null;
	}

	// Source: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

	const postData = function(url = '', data = {}) {
		// Default options are marked with *
			return fetch(url, {
					method: 'POST', // *GET, POST, PUT, DELETE, etc.
					mode: 'cors', // no-cors, cors, *same-origin
					cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
					credentials: 'same-origin', // include, *same-origin, omit
					headers: {
							'Content-Type': 'application/json',
							// 'Content-Type': 'application/x-www-form-urlencoded',
					},
					redirect: 'follow', // manual, *follow, error
					referrer: 'no-referrer', // no-referrer, *client
					body: JSON.stringify(data), // body data type must match "Content-Type" header
			})
			.then(response => response.json())// parses JSON response into native Javascript objects 
	}


	const getData = function(url = '') {
	// Default options are marked with *
		return fetch(url, {
				method: 'GET', // *GET, POST, PUT, DELETE, etc.
				mode: 'cors', // no-cors, cors, *same-origin
				cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
				credentials: 'same-origin', // include, *same-origin, omit
				headers: {
						'Content-Type': 'application/json',
				},
				redirect: 'follow', // manual, *follow, error
				referrer: 'no-referrer', // no-referrer, *client
		})
		.then(response => response.json()) // parses JSON response into native Javascript objects 
	}

	return {
		postData,
		getData
	}
})();