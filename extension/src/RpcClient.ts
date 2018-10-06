import {PackageBasis, PackageType} from './interfaces';
import {uuid} from './util';

/**
 *
 */

export interface RpcClientOptions {
    endpoint: string;
    retryTimeout?: number;
    callTimeout: number;
}

export interface RpcClientCallOptions {
    timeout?: number;
}

export class RpcClient {

    private ws?: WebSocket;

    private options: RpcClientOptions;

    //tslint:disable-next-line:no-any
    private responseHandler = new Map<string, (err: Error | null, data: any) => void>();
    //tslint:disable-next-line:no-any
    private requestHandler = new Map<PackageType, (data: any) => void>();

    constructor(options?: Partial<RpcClientOptions>) {
        this.options = {
            ...{
                endpoint: 'ws://localhost:123/api',
                callTimeout: 10000
            },
            ...options
        };
    }

    public connect() {
        this.ws = new WebSocket(this.options.endpoint);
        this.ws.addEventListener('message', this.onMessage.bind(this));
        this.ws.addEventListener('open', () => {
            console.debug('websocket connected');
        });
        this.ws.addEventListener('error', (err) => {
            console.error('websocket error', err);
            this.ws = undefined;
        });
        this.ws.addEventListener('close', () => {
            console.info('websocket closed');
            if (this.options.retryTimeout && this.options.retryTimeout > 0) {
                setTimeout(this.connect.bind(this), this.options.retryTimeout);
            }
            this.ws = undefined;
        });
    }

    public send<T>(kind: PackageType, data: T): void {
        this.sendInternal({
            kind,
            data,
            uuid: uuid()
        });
    }

    public async call<T, T2>(kind: PackageType, data: T, options?: RpcClientCallOptions): Promise<T2> {
        const callUuid = uuid();

        return new Promise<T2>((resolve, reject) => {
            this.responseHandler.set(callUuid, (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res);
            });
            if (options && options.timeout || this.options.callTimeout) {
                setTimeout(
                    () => {
                        reject(new Error('Request Timeout'));
                    },
                    options && options.timeout ? options.timeout : this.options.callTimeout
                );
            }

            this.sendInternal({
                kind,
                data,
                uuid: callUuid
            });
        }).finally(() => {
            this.responseHandler.delete(callUuid);
        });
    }

    public on<T>(kind: PackageType, cb: (data: T) => void): void {
        this.requestHandler.set(kind, cb);
    }

    private onMessage(evt: MessageEvent): void {
        let obj: PackageBasis;
        try {
            obj = JSON.parse(evt.data);
        } catch (err) {
            console.debug('Invalid Package', err.message);

            return;
        }
        if (!obj || !obj.kind || !obj.uuid) {
            console.debug('Invalid Package', evt.data);

            return;
        }
        let error = null;
        if (obj.kind === PackageType.ErrorResponse) {
            if (!obj.data || !obj.data.message) {
                console.warn("Invalid Error Response", obj);
                error = new Error("error response");
            } else {
                error = new Error(obj.data.message);
            }
        }

        const respHandler = this.responseHandler.get(obj.uuid);
        if (respHandler) {
            respHandler(error, obj.data);

            return;
        }

        const reqHandler = this.requestHandler.get(obj.kind);
        if (reqHandler) {
            reqHandler(obj.data);

            return;
        }

        console.debug('Unhandled package', obj);
    }

    private sendInternal(pkg: PackageBasis): void {
        if (!this.ws) {
            throw new Error('Not connected to backend');
        }
        this.ws.send(JSON.stringify(pkg));
    }
}
