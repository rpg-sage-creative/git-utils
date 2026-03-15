import { parseJson } from "@rsc-utils/json-utils";
import { readdir, readFile, stat } from "node:fs";
import { join } from "node:path";
import { readBranchName } from "./readBranchName.js";
import { readCommit, type CommitData } from "./readCommit.js";

type PackageJson = {
	name: string;
	version: string;
};

async function readPackageJson(repoPath: string): Promise<PackageJson | undefined> {
	return new Promise<PackageJson | undefined>(resolve =>
		readFile(join(repoPath, "package.json"), null, (error, buffer) => resolve(error ? undefined : parseJson<PackageJson>(String(buffer))))
	).catch(() => undefined);
}

type BuildDate = {
	birthtimeMs: number;
	ctimeMs: number;
};

async function readBuildDate(repoPath: string): Promise<BuildDate | undefined> {
	return new Promise<BuildDate | undefined>(resolve =>
		stat(join(repoPath, "build"), (err, stats) => resolve(err ? undefined : { birthtimeMs:stats.birthtimeMs, ctimeMs:stats.ctimeMs }))
	).catch(() => undefined);
}

async function readRscUtilsPackages(rootPath: string): Promise<PackageJson[]> {
	const packages: PackageJson[] = [];

	const utilPath = join(rootPath, "node_modules", "@rsc-utils");

	const allNames = await new Promise<string[]>(resolve =>
		readdir(utilPath, (err, files) => resolve(err ? [] : files))
	).catch(() => []);

	const validNames = allNames.filter(dirName => dirName !== ".");
	for (const libName of validNames) {
		const pkg = await readPackageJson(join(utilPath, libName));
		if (pkg) {
			packages.push({ name:pkg.name, version:pkg.version });
		}
	}
	return packages;
}

type GitRepoData = {
	package?: PackageJson;
	branch?: string;
	build?: BuildDate;
	commit?: CommitData;
	rscUtils: PackageJson[];
};

export async function readRepo(repoPath: string): Promise<GitRepoData | undefined> {
	return {
		package: await readPackageJson(repoPath),
		branch: await readBranchName(repoPath),
		build: await readBuildDate(repoPath),
		commit: await readCommit(repoPath),
		rscUtils: await readRscUtilsPackages(repoPath)
	};
}