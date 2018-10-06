package main

import (
	"os/exec"

	"github.com/speedata/gogit"
)

func os_open(repo *gogit.Repository) {
	exec.Command("xdg-open .", repo.Path).Start()
}