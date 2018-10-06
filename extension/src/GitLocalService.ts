import { LocalRepo, Service, PackageType, FindRepoRequest, CloneRequest, CloneResponse, OpenRequest } from "./interfaces";
import { RpcClient } from "./RpcClient";

/**
 *
 */

export class GitLocalService implements Service {

    private backend = new RpcClient();

    public findRepo(name: string): Promise<LocalRepo> {
        return this.backend.call<FindRepoRequest, LocalRepo>(PackageType.FindRepoRequest, {
            repoName: name
        });
    }

    public clone(url: string, localPath?: string | undefined): Promise<string> {
        return this.backend.call<CloneRequest, CloneResponse>(PackageType.CloneRequest, {
            repoUrl: url,
            localPath: localPath
        }).then((res) => res.output);
    }

    public open(repo: LocalRepo): Promise<void> {
        return this.backend.call<OpenRequest, void>(PackageType.OpenRequest, {
            repo
        });
    }
}
