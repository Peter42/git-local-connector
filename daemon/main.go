package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os/exec"
	"os/user"
	"path/filepath"
	"strings"

	"github.com/gorilla/websocket"
	"github.com/speedata/gogit"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(_ *http.Request) bool {
		return true
	},
}

func lookupBranches(repo *gogit.Repository) []string {
	files, err := ioutil.ReadDir(filepath.Join(repo.Path, ".git", "refs", "heads"))
	if err != nil {
		log.Fatal(err)
	}
	branches := make([]string, len(files))
	for i, f := range files {
		branches[i] = f.Name()
	}
	return branches
}

func handler(w http.ResponseWriter, r *http.Request) {
	w.Header()["Access-Control-Allow-Origin"] = []string{"chrome-extension://hlepfoohegkhhmjieoechaddaejaokhf"}
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	var repository *gogit.Repository
	var repoName string

	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		var response []byte

		if messageType == websocket.BinaryMessage {
			response = []byte("Only Text Messages are supported")
		} else {
			data := strings.Split(string(p), " ")
			command := data[0]

			if command == "setrepo" {
				repoName = data[1]
				repoLocation := filepath.Join(homeDir, "git", repoName)
				repository, err = gogit.OpenRepository(repoLocation)
				if err != nil {
					response = []byte(strings.Join([]string{"failed", repoLocation}, " "))
					log.Println(err)
				} else {
					response = []byte(repository.Path)
				}
			} else if command == "clone" {
				url := data[1]
				target := data[2]
				response = []byte(strings.Join([]string{"cloneoutput", "git", "clone", url, target}, " "))
				if err := conn.WriteMessage(websocket.TextMessage, response); err != nil {
					log.Println(err)
					return
				}
				response, err = exec.Command("git", "clone", url, target).CombinedOutput()
				if err != nil {
					log.Println(err)
				}
				response = append([]byte("cloneoutput "), response...)
			} else if command == "open" {
				os_open(repository)
				response = nil
			} else {
				response = []byte("unkown command")
			}

		}

		if response != nil {
			if err := conn.WriteMessage(websocket.TextMessage, response); err != nil {
				log.Println(err)
				return
			}
		}

	}
}

var homeDir string

/*
func branchesHandler(rw http.ResponseWriter, r *http.Request) {
	reponame := r.URL.Path[10:]
	repository, err := gogit.OpenRepository(filepath.Join(homeDir, "git", reponame))

	branches := lookupBranches(repository)

	rw.Header()["Access-Control-Allow-Origin"] = []string{"chrome-extension://hlepfoohegkhhmjieoechaddaejaokhf"}
	for _, f := range branches {
		rw.Write([]byte(f))
		rw.Write([]byte(","))
	}
}*/

func main() {

	usr, err := user.Current()
	if err != nil {
		log.Fatal(err)
	}
	homeDir = usr.HomeDir

	http.HandleFunc("/api/", handler)
	//http.HandleFunc("/branches/", branchesHandler)
	fmt.Println(http.ListenAndServe("localhost:7365", nil))
}
