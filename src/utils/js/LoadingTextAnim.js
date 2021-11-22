let i = 1,
dur = 300,
string_l = 'LOADING',
string_d = 'READY',
intervalFunc = function(){
	const text = document.getElementById('LOAD_STATUS');
	const status = text.getAttribute('status');
	text.textContent = string_l + '.'.repeat(i);
	if(i===3) i =0; i++;
},
activeInterval = setInterval(intervalFunc, dur);
document.addEventListener('load_status', function(){
	const text = document.getElementById('LOAD_STATUS');
	const status = text.getAttribute('status');
	if (status === 'loading')
		activeInterval = setInterval(intervalFunc, dur);
	else
	{
		text.textContent = string_d;
		clearInterval(activeInterval);
		activeInterval = null;
	}
});