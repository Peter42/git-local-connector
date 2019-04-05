[![Go Report Card](https://goreportcard.com/badge/github.com/Peter42/git-local-connector)](https://goreportcard.com/report/github.com/Peter42/git-local-connector)

# Install

## Linux

Debain based systems (apt):

```bash
sudo sh -c 'curl https://deb.philipp1994.de/KEY.gpg | apt-key add -'
sudo sh -c 'echo "deb https://deb.philipp1994.de/ /" > /etc/apt/sources.list.d/philipp1994.list'
sudo apt update
sudo apt install git-local-connector
```

## Windows

```cmd
choco source add --name git-local-connector --source https://www.myget.org/F/git-local-connector/
choco install --pre git-local-connector
```