package http

import (
	"fmt"
	htmltemplate "html/template"
	"net/http"
	runtimepprof "runtime/pprof"

	"github.com/mjl-/mox/webui"
)

var diagnosticsTemplate = htmltemplate.Must(htmltemplate.New("diagnostics").Parse(`<!doctype html><html><head><meta charset="utf-8"><title>{{.Title}} · devn</title>` + webui.Head() + `</head><body>` + webui.Header("Diagnostics") + `<main class="uiDocument"><h1>{{.Title}}</h1><p>{{.Description}}</p><section class="uiSection"><h2>{{.Section}}</h2><table><thead><tr><th>Name</th><th>Description</th>{{if .ShowCounts}}<th class="alignRight">Count</th>{{end}}</tr></thead><tbody>{{range .Links}}<tr><td><a href="{{.URL}}">{{.Name}}</a></td><td>{{.Description}}</td>{{if $.ShowCounts}}<td class="alignRight">{{.Count}}</td>{{end}}</tr>{{end}}</tbody></table></section></main></body></html>`))

type diagnosticLink struct {
	Name, URL, Description, Count string
}

type diagnosticsPage struct {
	Title, Description, Section string
	ShowCounts                  bool
	Links                       []diagnosticLink
}

func renderDiagnostics(w http.ResponseWriter, page diagnosticsPage) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := diagnosticsTemplate.Execute(w, page); err != nil {
		pkglog.Errorx("rendering diagnostics", err)
	}
}

func metricsIndex(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	if r.Method != http.MethodGet && r.Method != http.MethodHead {
		w.Header().Set("Allow", "GET, HEAD")
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	renderDiagnostics(w, diagnosticsPage{
		Title: "Metrics", Description: "Server health and Prometheus monitoring data.", Section: "Endpoints",
		Links: []diagnosticLink{
			{Name: "Metrics", URL: "metrics", Description: "Prometheus text exposition"},
			{Name: "Health", URL: "health", Description: "Server health check"},
		},
	})
}

// Keeping raw profiles and downloads on the standard Go handlers.
func profilingHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/debug/pprof/" || (r.Method != http.MethodGet && r.Method != http.MethodHead) {
		http.DefaultServeMux.ServeHTTP(w, r)
		return
	}
	page := diagnosticsPage{Title: "Runtime profiles", Description: "Inspect the running server with Go profiling tools.", Section: "Profiles", ShowCounts: true}
	for _, profile := range runtimepprof.Profiles() {
		page.Links = append(page.Links, diagnosticLink{Name: profile.Name(), URL: profile.Name() + "?debug=1", Description: "View profile as text", Count: fmt.Sprint(profile.Count())})
	}
	page.Links = append(page.Links,
		diagnosticLink{Name: "Command line", URL: "cmdline", Description: "Process command line"},
		diagnosticLink{Name: "CPU profile", URL: "profile", Description: "Download a 30-second CPU profile"},
		diagnosticLink{Name: "Execution trace", URL: "trace", Description: "Download a 1-second execution trace"},
	)
	renderDiagnostics(w, page)
}
