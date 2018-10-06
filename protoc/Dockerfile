FROM namely/protoc

RUN apk add git make g++

# install grpc-web plugin
RUN git clone https://github.com/grpc/grpc-web /tmp/grpc-web && \
    cd /tmp/grpc-web && \
    LDFLAGS=-L/usr/local/lib/protobuf make install-plugin && \
    rm -rf /tmp/grpc-web