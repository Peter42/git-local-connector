
## Usage

Build for GO:
```
docker run -it --rm -v $PWD:/app protoc -I/app/protocol file.proto --go_out=plugins=grpc:/app/daemon/grpc
```

Build for Web:
```
docker run -it --rm -v $PWD:/app protoc -I/app/protocol file.proto --js_out=import_style=typescript:/app/extension/dist/grpc --grpc-web_out=import_style=typescript,mode=grpcwebtext:/app/src/grpc
```