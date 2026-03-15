import { noop } from "@rsc-utils/type-utils";
import { execCli } from "./internal/execCli.js";
export async function readBranchName(repoPath) {
    const branch = await execCli("git branch --show-current", repoPath).catch(noop);
    return branch?.trim();
}
