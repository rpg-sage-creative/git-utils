import { exec } from "node:child_process";
/** @internal Quick and dirty command line executer. */
export async function execCli(cmd, cwd) {
    return new Promise((resolve, reject) => {
        exec(cmd, { cwd }, (error, stdout, stderr) => {
            if (error)
                reject(error);
            else if (stderr)
                reject(stderr);
            else
                resolve(stdout);
        });
    });
}
