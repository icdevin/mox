// Package webui shares styles between server-rendered pages and browser applications.
package webui

import (
	_ "embed"
	"html"
)

//go:embed theme.css
var themeCSS string

//go:embed component.css
var componentCSS string

//go:embed settings.css
var settingsCSS string

// Head adds trusted, embedded styles and system theme selection to HTML templates.
func Head() string {
	return `<link rel="icon" href="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%3E%3Crect%20width%3D%2232%22%20height%3D%2232%22%20rx%3D%227%22%20fill%3D%22%23f9f6f1%22%2F%3E%3Cpath%20fill%3D%22%23b94706%22%20fill-rule%3D%22evenodd%22%20d%3D%22M19%205h7v2h-2v17h2v2h-7v-2c-1.5%201.7-3.2%202.5-5.5%202.5C8.9%2026.5%206%2023.2%206%2018.5S9.1%2010%2013.8%2010c2.1%200%203.8.7%205.2%202V7h-2V5h2Zm0%2013.4c0-4.2-1.5-6.3-4-6.3s-4%202.2-4%206.4%201.5%206.4%204%206.4%204-2.3%204-6.5Z%22%2F%3E%3C%2Fsvg%3E" /><meta name="viewport" content="width=device-width, initial-scale=1"><style>` + themeCSS + componentCSS + settingsCSS + `
.uiDocument { max-width: 1200px; margin: auto; padding: 28px 32px; }
.uiDocument table { overflow-wrap: anywhere; }
.uiDocument h1 { overflow-wrap: anywhere; }
@media (max-width: 760px) { .uiDocument { padding: 20px 16px; } }
</style><script>
(() => {
 const system = matchMedia('(prefers-color-scheme: dark)');
 const apply = () => {
  let theme = 'system';
  try { theme = localStorage.getItem('webutilitytheme') || 'system'; } catch (_) {}
  let dark = theme === 'dark';
  if (theme === 'system') { dark = system.matches; }
  document.documentElement.dataset.theme = 'light';
  if (dark) { document.documentElement.dataset.theme = 'dark'; }
  const select = document.getElementById('uiTheme');
  if (select) { select.value = theme; }
 };
 system.addEventListener('change', apply);
 apply();
 addEventListener('DOMContentLoaded', () => {
  apply();
  document.getElementById('uiTheme').addEventListener('change', (e) => {
   try { localStorage.setItem('webutilitytheme', e.target.value); } catch (_) {}
   document.documentElement.dataset.theme = e.target.value;
   if (e.target.value === 'system') {
    document.documentElement.dataset.theme = 'light';
    if (system.matches) { document.documentElement.dataset.theme = 'dark'; }
   }
  });
 });
})();
</script>`
}

// Header keeps navigation and theme controls consistent on server-rendered pages.
func Header(title string) string {
	return `<header class="uiHeader"><strong class="brandName">devn</strong><span>` + html.EscapeString(title) + `</span><label>Theme <select id="uiTheme"><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select></label></header>`
}
