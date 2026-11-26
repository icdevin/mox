package webapisrv

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"golang.org/x/net/html"
)

func TestDocumentationPages(t *testing.T) {
	// Checking relative navigation when the API is mounted outside its default path.
	handler := http.StripPrefix("/custom/api", NewServer(1024, "/custom/api/", false))
	for _, method := range append([]string{""}, methodNames...) {
		t.Run(method, func(t *testing.T) {
			recorder := httptest.NewRecorder()
			handler.ServeHTTP(recorder, httptest.NewRequest("GET", "/custom/api/v0/"+method, nil))
			if recorder.Code != http.StatusOK {
				t.Fatalf("status %d: %s", recorder.Code, recorder.Body)
			}
			root, err := html.Parse(strings.NewReader(recorder.Body.String()))
			tcheckf(t, err, "parsing documentation")
			links := map[string]bool{}
			controls := map[string]bool{}
			var visit func(*html.Node)
			visit = func(n *html.Node) {
				for _, attr := range n.Attr {
					if n.Data == "a" && attr.Key == "href" {
						links[attr.Val] = true
					}
					if attr.Key == "id" {
						controls[attr.Val] = true
					}
				}
				for child := n.FirstChild; child != nil; child = child.NextSibling {
					visit(child)
				}
			}
			visit(root)
			for _, name := range methodNames {
				if !links[name] || methodDescriptions[name] == "" {
					t.Fatalf("missing navigation or description for %s", name)
				}
			}
			if !links["./"] || !controls["uiTheme"] {
				t.Fatal("missing overview or theme control")
			}
			if method != "" {
				if !controls["webapirequest"] || !controls["apiStatus"] {
					t.Fatal("missing request controls")
				}
				binary := method == "MessageRawGet" || method == "MessagePartGet"
				if controls["webapiresponse"] == binary {
					t.Fatal("wrong response UI for method")
				}
			}
		})
	}
}
