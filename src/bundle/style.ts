import sass from "sass";

import { CONFIG } from "src/config";
import { writeFile } from "src/util";

export function bundleStyles()
{
    let destCss = 'dist/style.css';
    let destMap = 'dist/style.css.map';

    let compileResult = sass.compile('site/_style/index.scss', {
        loadPaths: ['site/_style'],
        style: CONFIG.watch ? 'expanded' : 'compressed',
        sourceMap: CONFIG.watch
    });

    let css = compileResult.css;

    if (compileResult.sourceMap)
    {
        css += '\n/*# sourceMappingURL=style.css.map */';
        writeFile(destMap, JSON.stringify(compileResult.sourceMap));
    }

    writeFile(destCss, css);
}

export function bundlePreviewStyles()
{
    let destCss = 'dist/preview/style.css';
    let destMap = 'dist/preview/style.css.map';

    let compileResult = sass.compile('site/_style/preview/index.scss', {
        loadPaths: ['site/_style'],
        style: CONFIG.watch ? 'expanded' : 'compressed',
        sourceMap: CONFIG.watch
    });

    let css = compileResult.css;

    if (compileResult.sourceMap)
    {
        css += '\n/*# sourceMappingURL=style.css.map */';
        writeFile(destMap, JSON.stringify(compileResult.sourceMap));
    }

    writeFile(destCss, css);
}