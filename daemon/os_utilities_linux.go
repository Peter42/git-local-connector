package main

import (
	"os/exec"
)

func osOpen(path string) {
	exec.Command("xdg-open .", path).Start()
}
