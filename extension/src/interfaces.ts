/**
 * Interfaces
 */

export enum Packages {
    Hello = "Hello",
    FindRepoRequest = "FindRepoRequest",
    CloneRequest = "CloneRequest"
}

export interface PackageBasis {
    id: Packages;
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