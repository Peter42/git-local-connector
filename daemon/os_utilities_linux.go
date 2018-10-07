package main

import (
	"os/exec"
)

func os_open(path string) {
	exec.Command("xdg-open .", path).Start()
}