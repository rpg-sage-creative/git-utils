export type CommitData = {
    shortHash: string;
    hash: string;
    subject: string;
    subjectClean: string;
    b: string;
    cTimestamp: number;
    cTimeRelative: string;
    cName: string;
    cEmail: string;
    aTimestamp: number;
    aTimeRelative: string;
    aName: string;
    aEmail: string;
};
/** Uses `git log -1 --pretty=format:""` to parse information about the current commit for the given repoPath. */
export declare function readCommit(repoPath: string): Promise<CommitData | undefined>;
