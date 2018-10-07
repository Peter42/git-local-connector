package main

type packageType string

const (
	// requests
	helloType           packageType = "Hello"
	findRepoRequestType packageType = "FindRepoRequest"
	cloneRequestType    packageType = "CloneRequest"
	openRequestType     packageType = "OpenRequest"
	// responses
	cloneResponseType packageType = "CloneResponse"
	errorResponseType packageType = "ErrorResponse"
	voidResponseType  packageType = "VoidResponse"
	localRepoType     packageType = "LocalRepo"
)

type packageBasis struct {
	Kind packageType `json:"kind"`
	UUID string      `json:"uuid"`
	Data interface{} `json:"data"`
}

type helloPackage struct {
	UUID    string `json:"uuid"`
	Version int    `json:"version"`
}

type findRepoRequest struct {
	RepoName string `json:"repoName"`
}

type cloneRequest struct {
	RepoUrl   string  `json:"repoUrl"`
	LocalPath *string `json:"localPath"`
}

type cloneResponse struct {
	Output string `json:"output"`
}

type openRequest struct {
	Repo localRepo `json:"repo"`
}

type errorResponse struct {
	Msg string `json:"msg"`
}

//

type localRepo struct {
	RemoteRepositiory string  `json:"remoteRepositiory"`
	Path              *string `json:"path"`
}
