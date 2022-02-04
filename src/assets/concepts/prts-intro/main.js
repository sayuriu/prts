localStorage.setItem('theme', localStorage.getItem('theme') || 'dark');
document.body.classList.add(localStorage.getItem('theme'));

const progressBar = document.querySelector('load-progress-bar');
const logo = document.querySelector('#logo-container');
const header = document.querySelector('header');
const reload = document.querySelector('reload');
const theme = document.querySelector('theme');

progressBar.style.width = "100%";
logo.style.pointerEvents = "none";
setTimeout(() => logo.style.pointerEvents = "all", 2800);
document.body.style.transition = "all 0.5s cubic-bezier(0.88,-0.07, 0.22, 1.01)";

if (header.classList.contains('active')) header.classList.toggle('active');
if (logo.classList.contains('active')) logo.classList.toggle('active');

logo.addEventListener('click', () => {
	progressBar.style.transitionTimingFunction = "cubic-bezier(0.88,-0.07, 0.22, 1.01)";
	progressBar.style.transitionDuration = "1s";
	progressBar.style.width = "0%";
	header.classList.toggle('active');
	logo.classList.toggle('active');
});

reload.addEventListener('click', () => {
	progressBar.style.transitionTimingFunction = "cubic-bezier(0.88,-0.07, 0.22, 1.01)";
	progressBar.style.transitionDuration = "1s";
	progressBar.style.width = "0%";
	setTimeout(() => document.body.style.opacity = 0, 700);
	setTimeout(() => document.location.reload(true), 1200);
});

theme.addEventListener('click', () => {
	document.body.classList.toggle('light');
	document.body.classList.toggle('dark');
	localStorage.setItem('theme', localStorage.getItem('theme') === 'light' ? 'dark' : 'light');
});