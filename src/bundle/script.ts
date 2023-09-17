import esbuild from "esbuild";

import { CONFIG } from "src/config";

export function bundleScripts()
{
    esbuild.buildSync({
        entryPoints: ['site/_script/index.ts'],
        outfile: 'dist/script.js',
        charset: 'utf8',
        bundle: true,
        sourcemap: CONFIG.watch,
        minify: !CONFIG.watch
    });
}

export function bundlePreviewScripts()
{
    esbuild.buildSync({
        entryPoints: ['site/_script/preview/index.ts'],
        outfile: 'dist/preview/script.js',
        charset: 'utf8',
        bundle: true,
        sourcemap: CONFIG.watch,
        minify: !CONFIG.watch
    });
}