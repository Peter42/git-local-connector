package main

import (
	"os/exec"
)

func osOpen(path string) {
	exec.Command("explorer", path).Start()
}
