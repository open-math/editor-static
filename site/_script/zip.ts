import YAML from 'yaml';
import { getMany } from "idb-keyval/dist/index.cjs";

import { FILES, FileManager, fileToDataUrl } from "file/manager";
import { State, StateProp, TopicPart } from "state";

declare let require, zip;

export function initZip()
{
    require(['assets/vendor/zip.min.js'], _zip => zip = _zip)
}

export async function importTopic()
{
    let zipDataUrl = await new Promise(resolve =>
    {
        let input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.addEventListener('change', async e =>
            {
                let file = (e.target as any).files[0];
                resolve(await fileToDataUrl(file));
            });
            document.body.appendChild(input);
            input.click();
            input.remove();
    });

    let zipReader = new zip.ZipReader(new zip.Data64URIReader(zipDataUrl));

    //

    let entires = await zipReader.getEntries();
    for (let i = 0; i < entires.length; i++)
    {
        let entry = entires[i];

        switch (entry.filename)
        {
            case 'article.md':
            case 'summary.md':
            case 'practicum.md':
                State.set(entry.filename.replace('.md', ''), await entry.getData(new zip.TextWriter()));
                break;
            case 'topic.yml':
                let info = YAML.parse(await entry.getData(new zip.TextWriter()));
                if (info.title)         State.set(StateProp.Title, info.title);
                if (info.desc)          State.set(StateProp.Description, info.desc);
                if (info.keywords)      State.set(StateProp.Tags, info.keywords.join('\n'));
                if (info.contributors)  State.set(StateProp.Contributors, info.contributors.join('\n'));
                break;
            default:
                let parts = entry.filename.split('/');
                if (parts.length === 1)
                    break;
                let folder = parts.at(-2);
                let filename = parts.at(-1);

                if (folder)
                    await FILES.addFolder(folder);

                if (filename)
                {
                    let dataURL = await entry.getData(new zip.Data64URIWriter());

                    if (filename.endsWith('.svg'))
                        dataURL = dataURL.replace('data:', 'data:image/svg+xml');

                    await FILES.addFile(folder, filename, dataURL);
                }
                break;
        }
    }

    location.reload();
}

export async function exportTopic()
{
    let zipFileWriter = new zip.BlobWriter;
    let zipWriter = new zip.ZipWriter(zipFileWriter);

    //

    let topicParts = [StateProp.Article, StateProp.Summary, StateProp.Practicum];
    for (let i = 0; i < topicParts.length; i++)
    {
        let content = State.getContent(topicParts[i] as TopicPart);
        if (content)
            await zipWriter.add(topicParts[i] + '.md', new zip.TextReader(content));
    }

    //

    let filePaths = [];
    FILES.getFolders().forEach(folder => FILES.getFiles(folder).forEach(file => filePaths.push(folder + '/' + file)));

    let fileDataArr = await getMany(filePaths);

    for (let i = 0; i < filePaths.length; i++)
    {
        let path = FileManager.toFullPath(filePaths[i]);
        let data = fileDataArr[i];

        await zipWriter.add(path, new zip.Data64URIReader(data));
    }

    // Topic Info

    let topicInfo = {};

    let title = State.get(StateProp.Title);
    if (title)
        topicInfo['title'] = title;

    let desc = State.get(StateProp.Description);
    if (desc)
        topicInfo['desc'] = desc;

    let tagsRaw = State.get(StateProp.Tags);
    if (tagsRaw)
    {
        let keywords = tagsRaw.split('\n').map(keyword => keyword.trim());
        topicInfo['keywords'] = keywords;
    }

    let contributorsRaw = State.get(StateProp.Contributors);
    if (contributorsRaw)
    {
        let contributors = contributorsRaw.split('\n').map(contributor => contributor.trim());
        topicInfo['contributors'] = contributors;
    }

    if (Object.keys(topicInfo).length > 0)
        await zipWriter.add('topic.yml', new zip.TextReader(YAML.stringify(topicInfo)));

    //

    zipWriter.close();

    let zipFileBlob = new Blob([await zipFileWriter.getData()], { type: 'application/zip' });
    
    let date = new Date;
    let dateStr = `-${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}-${date.getHours()}.${date.getMinutes()}`;

    let filename = title ?? 'topic';
        filename += dateStr + '.zip';

    let link = document.createElement('a');
        link.setAttribute('download', filename);
        link.href = URL.createObjectURL(zipFileBlob);
        document.body.appendChild(link);
        link.click();
        link.remove();
}