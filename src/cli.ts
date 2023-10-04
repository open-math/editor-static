import { rimraf } from "rimraf";
import express from "express";
import { WebSocketServer } from "ws";
import chokidar from "chokidar";

import fs from "fs";

import { buildLayout, buildPreview } from "./bundle/layout";
import { bundlePreviewScripts, bundleScripts, bundledWorker } from "./bundle/script";
import { Config, setConfig } from "./config";
import { bundlePreviewStyles, bundleStyles } from "./bundle/style";
import { moveFiles } from "./bundle/files";

import { copyAssetsTo } from "translator/node";

//#region Init
//
//

let args = process.argv.slice(2);

if (args.length === 0)
{
    throw new Error(`Missing command!`);
}

let command = args.pop();

if (!['build', 'watch'].includes(command))
{
    throw new Error(`Unknown command '${command}'. Use 'build' or 'watch'!`);
}

let config = new Config;
    config.watch = command === 'watch';

setConfig(config);

switch (command)
{
    case 'build':
        build();
        break;
    case 'watch':
        watch();
        break;
}

//
//
//#endregion

async function watch()
{
    let httpServer = express();
        httpServer.use(express.static('dist'));
        httpServer.listen(3000, () => {});

    let wss = new WebSocketServer({ port: 8080 });
    let ws: WebSocket;

    wss.on('connection', socket => ws = socket);

    let delay = null;

    chokidar.watch('site').on('all', () =>
    {
        clearTimeout(delay);
        delay = setTimeout(async () => {
            try
            {
                await build();
                console.log('\nDone!');
                if (ws) ws.send('reload');
            }
            catch (e) { console.log(e); }
        }, 1000);
    });

    console.log('\nEditor running on http://localhost:3000');
}

async function build()
{
    await clear();

    buildLayout();

    bundleScripts();
    bundledWorker();
    bundleStyles();
    moveFiles();

    fs.mkdirSync('dist/content');
    copyAssetsTo('dist/content');

    fs.writeFileSync('dist/CNAME', 'editor.omath.net');

    buildPreview();
    bundlePreviewScripts()
    bundlePreviewStyles();
}

async function clear()
{
    await rimraf('dist');
    fs.mkdirSync('dist');
}