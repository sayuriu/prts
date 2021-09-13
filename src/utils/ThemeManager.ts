export default class ThemeManager {
	static Switch(currentTheme = 'light')
	{
		if (currentTheme === 'light') currentTheme = 'dark';
		else currentTheme = 'light';
		localStorage.setItem('theme', currentTheme);
		document.documentElement.setAttribute('theme', currentTheme);
		return currentTheme;
	}
	static Load()
	{
		const theme = localStorage.getItem('theme') || 'light';
		document.documentElement.setAttribute('theme', theme);
		return theme;
	}
}
