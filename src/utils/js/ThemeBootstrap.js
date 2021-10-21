const themedata = {
  light: {
    foreground: '#fff',
    foregroundInverse: '#000',
  },
  dark: {
    foreground: '#000',
    foregroundInverse: '#fff',
  },
}

function parse(theme) {
  return themedata[theme] ?? null;
}

const theme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('theme', theme);
const loadingText = document.getElementById('LOAD_STATUS');

const parsed = parse(theme);
loadingText.style.background = parsed.foreground;
loadingText.style.color = parsed.foregroundInverse;