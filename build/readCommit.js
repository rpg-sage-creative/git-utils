import { execCli } from "./internal/execCli.js";
export async function readCommit(repoPath) {
    const splitter = "_*|*_";
    const keyMap = {
        shortHash: "%h",
        hash: "%H",
        subject: "%s",
        subjectClean: "%f",
        b: "%b",
        cTimestamp: "%ct",
        cTimeRelative: "%cr",
        cName: "%cn",
        cEmail: "%ce",
        aTimestamp: "%at",
        aTimeRelative: "%ar",
        aName: "%an",
        aEmail: "%ae",
    };
    const keys = Object.keys(keyMap);
    const values = Object.values(keyMap);
    const raw = await execCli(`git log -1 --pretty=format:"${values.join(splitter)}"`, repoPath).catch(() => undefined);
    if (!raw)
        return undefined;
    const lines = raw.split(splitter);
    return lines.reduce((info, line, lineIndex) => {
        const key = keys[lineIndex];
        info[key] = key === "aTimestamp" || key === "cTimestamp" ? +line.trim() : line.trim();
        return info;
    }, {});
}
