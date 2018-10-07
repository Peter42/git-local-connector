package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os/exec"
	"os/user"
	"path/filepath"
	"encoding/json"
	"errors"

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

func readStringMessage(conn *websocket.Conn) (string, error) {
	for {
		messageType, msg, err := conn.ReadMessage()
		if err != nil {
			return "", err
		}

		if messageType == websocket.BinaryMessage {
			err := conn.WriteMessage(websocket.TextMessage, []byte("Only Text Messages are supported"))
			if err != nil {
				return "", err
			}
		} else {
			return string(msg), nil
		}
	}
}

func send_response(conn *websocket.Conn, kind packageType, data interface{}, to packageBasis) error {
	msgobj := packageBasis{
		Kind: kind,
		UUID: to.UUID,
		Data: data}
	msgobjstr, _ := json.Marshal(msgobj)
	return conn.WriteMessage(websocket.TextMessage, msgobjstr)
}

func send_error(conn *websocket.Conn, msg string, to packageBasis) error {
	return send_response(conn, errorResponseType, &errorResponse{Msg: msg}, to)
}

func send_void(conn *websocket.Conn, to packageBasis) error {
	return send_response(conn, voidResponseType, nil, to)
}

func handshake(conn *websocket.Conn) error {
	msg, err := readStringMessage(conn)
	if err != nil {
		return err
	}

	var pack packageBasis
	err = json.Unmarshal([]byte(msg), &pack)
	if err != nil {
		return err
	}

	if pack.Kind != helloType {
		send_error(conn, "Handshake missing", pack)
		return errors.New("Handshake missing")
	}

	var helloPack helloPackage
	hack, _ := json.Marshal(pack.Data)
	err = json.Unmarshal(hack, &helloPack)
	if err != nil {
		send_error(conn, "Handshake parsing error", pack)
		return err
	}

	if helloPack.Version != 1 {
		send_error(conn, "Unsupported Protocol Version", pack)
		return errors.New("Unsupported Protocol Version")
	}

	// TODO: check uuid

	return send_void(conn, pack)

}

func handler(w http.ResponseWriter, r *http.Request) {
	w.Header()["Access-Control-Allow-Origin"] = []string{"chrome-extension://hlepfoohegkhhmjieoechaddaejaokhf"}
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	err = handshake(conn)
	if err != nil {
		log.Println(err)
		return
	}

	var local localRepo

	for {
		msg, err := readStringMessage(conn)
		if err != nil {
			log.Println(err)
			return
		}

		var pack packageBasis
		err = json.Unmarshal([]byte(msg), &pack)
		if err != nil {
			log.Println(err)
			return
		}

		if pack.Kind == findRepoRequestType {
			var request findRepoRequest
			hack, _ := json.Marshal(pack.Data)
			err = json.Unmarshal(hack, &request)
			if err != nil {
				send_error(conn, "Request parsing error", pack)
				continue
			}

			repoLocation := filepath.Join(homeDir, "git", request.RepoName)
			_, err = gogit.OpenRepository(repoLocation)
			if err != nil {
				local = localRepo{
					RemoteRepositiory: request.RepoName,
					Path:              nil}
				send_response(conn, localRepoType, nil, pack)
			} else {
				local = localRepo{
					RemoteRepositiory: request.RepoName,
					Path:              &repoLocation}
				send_response(conn, localRepoType, local, pack)
			}
		} else if pack.Kind == cloneRequestType {
			var request cloneRequest
			hack, _ := json.Marshal(pack.Data)
			err = json.Unmarshal(hack, &request)
			if err != nil {
				log.Println(err)
				send_error(conn, "Request parsing error", pack)
				continue
			}

			var cloneLocation string
			if request.LocalPath != nil && *request.LocalPath != "" {
				cloneLocation = *request.LocalPath
			} else {
				cloneLocation = filepath.Join(homeDir, "git", local.RemoteRepositiory)
			}
			
			response, err := exec.Command("git", "clone", request.RepoUrl, cloneLocation).CombinedOutput()
			if err != nil {
				log.Println(err)
				log.Println(response)
				send_error(conn, "could not clone", pack)
			} else {
				local.Path = &cloneLocation
				send_response(conn, cloneResponseType, &cloneResponse{Output: string(response)}, pack)
			}


		} else if pack.Kind == openRequestType {
			var request openRequest
			hack, _ := json.Marshal(pack.Data)
			err = json.Unmarshal(hack, &request)
			if err != nil {
				log.Println(err)
				send_error(conn, "Request parsing error", pack)
				continue
			}
			os_open(*request.Repo.Path)
			send_void(conn, pack)

		} else {
			send_error(conn, "unkown command", pack)
		}
	}
}

var homeDir string

func main() {

	usr, err := user.Current()
	if err != nil {
		log.Fatal(err)
	}
	homeDir = usr.HomeDir

	http.HandleFunc("/api/", handler)
	fmt.Println(http.ListenAndServe("localhost:7365", nil))
}
