package main

type packeageType string
const (
    // requests
    helloType           packeageType = "Hello"
    findRepoRequestType packeageType = "FindRepoRequest"
    cloneRequestType    packeageType = "CloneRequest"
    // responses
    cloneResponseType   packeageType = "CloneResponse"
    errorResponseType   packeageType = "ErrorResponse"
    voidResponseType    packeageType = "VoidResponse"
)

type packageBasis struct {
    Kind packeageType  `json:"kind"`
    UUID string        `json:"uuid"`
    Data interface{}   `json:"data"`
}

type helloPackage struct {
    UUID string   `json:"uuid"`
    Version int   `json:"version"`
}

type findRepoRequest struct {
    RepoName string  `json:"repoName"`
}

type cloneRequest struct {
    RepoUrl   string  `json:"repoUrl"`
    LocalPath string  `json:"localPath"`
}

type cloneResponse struct {
    Output string  `json:"output"`
}

type openRequest struct {
    Repo localRepo  `json:"repo"`
}

type errorResponse struct {
    Msg string  `json:"msg"`
}

//

type localRepo struct {
    RemoteRepositiory string  `json:"remoteRepositiory"`
    Path              string  `json:"path"`
}