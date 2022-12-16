import { src, dest, series, watch, task, lastRun } from "gulp";
import ts from "gulp-typescript";
import { ChildProcess, spawn } from "child_process";
import color from "cli-color";

const tsProject = ts.createProject("tsconfig.json");

function transpileTS() {
    return src("src/**/*.ts", { since: lastRun(transpileTS) })
        .pipe(tsProject())
        .pipe(dest("build"))
}

function transpileData() {
    return src("src/data/**/*.json", { since: lastRun(transpileData) })
        .pipe(dest("build/data"))
}

function transpile(cb) {
    series(transpileTS, transpileData)(() => { cb() })
}

/**
 * @type {undefined | ChildProcess}
 */
let process = undefined;
let i = 1;

function runServer(cb, rerun = true) {
    process = spawn("node", ["build/index.js"], { stdio: 'inherit' });

    process.on("spawn", () => {
        console.clear();
        console.log(`${color.green("Process output")}` + (rerun ? ` (iteration ${color.green(i++)})` : ""));
        console.log("");
    });

    process.on("exit", (code) => {
        const c = code === 0 ? color.green : color.red;

        console.log(`Process ${c("exited")} with code ${c(code || "undefined")}`)
    });

    cb();
}

function killServer(cb) {
    if (process !== undefined) {
        process.on("exit", () => { cb() })
        process.kill();
        process = undefined;
    } else {
        cb();
    }
}

const dev = () => {
    series(transpile, runServer)(() => { });

    watch("src/**/*.ts", series(killServer, transpileTS, runServer));
    watch("src/data/**/*.json", series(killServer, transpileData, runServer));
};

exports.start = exports.default = (cb) => runServer(cb, false);
exports.build = transpile;
exports.dev = dev;