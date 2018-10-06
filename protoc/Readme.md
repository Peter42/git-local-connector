
## Usage

Build for GO:
```
mkdir -p daemon/grpc
docker run -it --rm -v $PWD:/app phil9909/git-local-connector-grpc -I/app/protocol service.proto --go_out=plugins=grpc:/app/daemon/grpc
```

Build for Web:
```
mkdir -p extension/build/grpc extension/src/grpc
docker run -it --rm -v $PWD:/app phil9909/git-local-connector-grpc -I/app/protocol service.proto --js_out=import_style=typescript:/app/extension/build/grpc --grpc-web_out=import_style=typescript,mode=grpcwebtext:/app/extension/src/grpc
```