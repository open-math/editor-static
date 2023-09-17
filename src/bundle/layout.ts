import pug from "pug";

import { writeFile } from "src/util";

export function buildLayout()
{
    writeFile(
        'dist/index.html',
        pug.renderFile('site/_layout/index.pug', { basedir: 'site/_layout' })
    );
}

export function buildPreview()
{
    writeFile(
        'dist/preview/index.html',
        pug.renderFile('site/_layout/preview.pug', { basedir: 'site/_layout' })
    );
}