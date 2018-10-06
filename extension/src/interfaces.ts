/**
 * Interfaces
 */

export enum PackageType {
    Empty = 'Empty',
    Hello = 'Hello',
    FindRepoRequest = 'FindRepoRequest',
    LocalRepo = 'LocalRepo',
    CloneRequest = 'CloneRequest',
    CloneResponse = 'CloneResponse',
    OpenRequest = 'OpenRequest'
}

export interface PackageBasis {
    kind: PackageType;
    uuid: string;
    // tslint:disable-next-line:no-any
    data: any;
}

export interface HelloPackage {
    uuid: string;
    version: string;
}

export interface FindRepoRequest {
    repoName: string;
}

export interface CloneRequest {
    repoUrl: string;
    localPath?: string;
}

export interface CloneResponse {
    output: string;
}

export interface OpenRequest {
    repo: LocalRepo;
}

//

export interface LocalRepo {
    remoteRepositiory: string;
    path: string;
}

export interface Service {
    findRepo(name: string): Promise<LocalRepo>;

    clone(url: string, localPath?: string): Promise<string>;

    open(repo: LocalRepo): Promise<void>;
}
