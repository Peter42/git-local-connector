package main

import (
	"os/exec"
)

func os_open(path string) {
	exec.Command("explorer", path).Start()
}
