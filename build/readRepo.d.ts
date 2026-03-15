import { type CommitData } from "./readCommit.js";
type PackageJson = {
    name: string;
    version: string;
};
type BuildDate = {
    birthtimeMs: number;
    ctimeMs: number;
};
type GitRepoData = {
    package?: PackageJson;
    branch?: string;
    build?: BuildDate;
    commit?: CommitData;
    rscUtils: PackageJson[];
};
export declare function readRepo(repoPath: string): Promise<GitRepoData | undefined>;
export {};
