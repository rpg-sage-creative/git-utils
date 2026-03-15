import { parseJson } from "@rsc-utils/json-utils";
import { readdir, readFile, stat } from "node:fs";
import { join } from "node:path";
import { readBranchName } from "./readBranchName.js";
import { readCommit } from "./readCommit.js";
async function readPackageJson(repoPath) {
    return new Promise(resolve => readFile(join(repoPath, "package.json"), null, (error, buffer) => resolve(error ? undefined : parseJson(String(buffer))))).catch(() => undefined);
}
async function readBuildDate(repoPath) {
    return new Promise(resolve => stat(join(repoPath, "build"), (err, stats) => resolve(err ? undefined : { birthtimeMs: stats.birthtimeMs, ctimeMs: stats.ctimeMs }))).catch(() => undefined);
}
async function readRscUtilsPackages(rootPath) {
    const packages = [];
    const utilPath = join(rootPath, "node_modules", "@rsc-utils");
    const allNames = await new Promise(resolve => readdir(utilPath, (err, files) => resolve(err ? [] : files))).catch(() => []);
    const validNames = allNames.filter(dirName => dirName !== ".");
    for (const libName of validNames) {
        const pkg = await readPackageJson(join(utilPath, libName));
        if (pkg) {
            packages.push({ name: pkg.name, version: pkg.version });
        }
    }
    return packages;
}
export async function readRepo(repoPath) {
    return {
        package: await readPackageJson(repoPath),
        branch: await readBranchName(repoPath),
        build: await readBuildDate(repoPath),
        commit: await readCommit(repoPath),
        rscUtils: await readRscUtilsPackages(repoPath)
    };
}
