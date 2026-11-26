package http

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestDiagnosticsPages(t *testing.T) {
	for _, tc := range []struct {
		path    string
		handler http.HandlerFunc
		want    string
	}{
		{"/", metricsIndex, "Prometheus"},
		{"/debug/pprof/", profilingHandler, "goroutine?debug=1"},
	} {
		w := httptest.NewRecorder()
		tc.handler(w, httptest.NewRequest("GET", tc.path, nil))
		if w.Code != http.StatusOK || !strings.Contains(w.Body.String(), tc.want) || !strings.Contains(w.Body.String(), "uiTheme") {
			t.Fatalf("unexpected diagnostics page %s: %d %s", tc.path, w.Code, w.Body)
		}
	}
	for _, method := range []string{"GET", "POST"} {
		direct, wrapped := httptest.NewRecorder(), httptest.NewRecorder()
		http.DefaultServeMux.ServeHTTP(direct, httptest.NewRequest(method, "/debug/pprof/cmdline", nil))
		profilingHandler(wrapped, httptest.NewRequest(method, "/debug/pprof/cmdline", nil))
		if wrapped.Code != direct.Code || wrapped.Body.String() != direct.Body.String() || wrapped.Header().Get("Content-Type") != direct.Header().Get("Content-Type") {
			t.Fatal("profiling wrapper changes standard handler response")
		}
	}
	w := httptest.NewRecorder()
	metricsIndex(w, httptest.NewRequest("POST", "/", nil))
	if w.Code != http.StatusMethodNotAllowed {
		t.Fatalf("unexpected status %d", w.Code)
	}
	w = httptest.NewRecorder()
	metricsIndex(w, httptest.NewRequest("GET", "/missing", nil))
	if w.Code != http.StatusNotFound {
		t.Fatalf("unexpected status %d", w.Code)
	}
}
