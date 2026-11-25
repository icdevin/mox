package store

import (
	"bytes"
	"fmt"
	"path/filepath"
	"sort"
	"testing"
	"time"

	"github.com/mjl-/bstore"
)

func TestLoginAttemptPages(t *testing.T) {
	db, err := bstore.Open(ctxbg, filepath.Join(t.TempDir(), "auth.db"), nil, LoginAttempt{})
	tcheck(t, err, "opening database")
	old := AuthDB
	AuthDB = db
	defer func() { AuthDB = old; db.Close() }()
	now := time.Now().UTC()
	var expected []LoginAttempt
	for i := 0; i < 12; i++ {
		a := LoginAttempt{Last: now.Add(-time.Duration(i / 4)), First: now, AccountName: fmt.Sprintf("account%d", i%2), UserAgent: fmt.Sprint(i), Result: AuthSuccess}
		a.Key = a.calculateKey()
		tcheck(t, db.Insert(ctxbg, &a), "inserting attempt")
		expected = append(expected, a)
	}
	sort.Slice(expected, func(i, j int) bool {
		if expected[i].Last.Equal(expected[j].Last) {
			return bytes.Compare(expected[i].Key, expected[j].Key) > 0
		}
		return expected[i].Last.After(expected[j].Last)
	})
	for _, account := range []string{"", "account0", "missing"} {
		var want []LoginAttempt
		for _, a := range expected {
			if account == "" || a.AccountName == account {
				want = append(want, a)
			}
		}
		for _, size := range []int{1, 3, 5, 12, 13} {
			t.Run(fmt.Sprintf("%s/%d", account, size), func(t *testing.T) {
				cursor := ""
				seen := 0
				for {
					page, err := LoginAttemptListPage(ctxbg, account, size, cursor)
					tcheck(t, err, "listing page")
					n := min(size, len(want)-seen)
					if len(page.Attempts) != n {
						t.Fatalf("got %d rows, want %d", len(page.Attempts), n)
					}
					for _, a := range page.Attempts {
						if !bytes.Equal(a.Key, want[seen].Key) {
							t.Fatalf("unexpected row %d", seen)
						}
						seen++
					}
					if (page.Next != "") != (seen < len(want)) {
						t.Fatalf("incorrect next cursor at row %d", seen)
					}
					if page.Next == "" {
						break
					}
					cursor = page.Next
				}
			})
		}
	}
	for _, size := range []int{0, -1, 1001} {
		if _, err := LoginAttemptListPage(ctxbg, "", size, ""); err == nil {
			t.Fatalf("accepted size %d", size)
		}
	}
	for _, cursor := range []string{"bad!", "e30"} {
		if _, err := LoginAttemptListPage(ctxbg, "", 2, cursor); err == nil {
			t.Fatal("accepted invalid cursor")
		}
	}
	page, err := LoginAttemptListPage(ctxbg, "account0", 2, "")
	tcheck(t, err, "listing account")
	if _, err := LoginAttemptListPage(ctxbg, "account1", 2, page.Next); err == nil {
		t.Fatal("accepted cursor for another account")
	}
	// Keeping the cursor usable when its row is deleted between requests.
	last := page.Attempts[1]
	tcheck(t, db.Delete(ctxbg, &last), "deleting cursor row")
	next, err := LoginAttemptListPage(ctxbg, "account0", 2, page.Next)
	tcheck(t, err, "listing after deletion")
	if len(next.Attempts) != 2 {
		t.Fatal("missing rows after deletion")
	}
}
