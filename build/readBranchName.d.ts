/** Uses `git branch --show-current` to read the current git branch for the given repoPath. */
export declare function readBranchName(repoPath: string): Promise<string | undefined>;
