import { globSync } from "glob";

import { copyFile, normalize } from "src/util";

export function moveFiles()
{
    let ignorePatterns = ['_*/**', '**/_*'];

    let siteFiles = globSync(
        'site/**/*',
        {
            ignore: ignorePatterns.map(pattern => 'site/' + pattern),
            nodir: true
        }
    );

    let rootFiles = globSync(
        'site/_root/**/*',
        {
            ignore: ignorePatterns.map(pattern => 'site/_root/' + pattern),
            nodir: true
        }
    );

    siteFiles.forEach(siteFile => copyFile(
        siteFile,
        'dist/assets/' + siteFile.replace(normalize('site/'), '')
    ));

    rootFiles.forEach(rootFile => copyFile(
        rootFile,
        'dist/' + rootFile.replace(normalize('site/_root/'), '')
    ));
}