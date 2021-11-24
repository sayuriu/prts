(function() {
	let state = false;
	let time = [];
	let timeSinceLast = performance.now();
	function measure() {
		let newState = false;
		const diff = performance.now() - timeSinceLast;
		time.push(diff);
		if (document.hasFocus() && diff > 301) {
			newState = true;
			time.push('insert ^');
		}
		else;
		timeSinceLast = performance.now();
		if (state !== newState)
		{
			console.log(time);
			state = newState;
			console.warn('Don\'t open the console, unless you know what you are doing.');
			clearInterval(interval);
		}
	}
	let interval = setInterval(measure, 300);
})()