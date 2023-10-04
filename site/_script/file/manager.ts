import { get, set, del, delMany, clear } from "idb-keyval/dist/index.cjs";
import { State, StateProp } from "state";

type TFilesMap = { [folder: string]: { [filename: string]: null } }

export class FileManager
{
    filesMap: TFilesMap;

    constructor()
    {
        let filesRaw = State.get(StateProp.Files);
        this.filesMap = filesRaw ? JSON.parse(filesRaw) : { assets: { } };
    }

    save()
    {
        State.set(StateProp.Files, JSON.stringify(this.filesMap));
    }

    async reset()
    {
        await clear();
    }

    //

    hasPath(path: string)
    {
        let parts = path.split('/');
        
        if (parts.length === 3)
            parts.shift();

        let cursor = this.filesMap;

        while (parts.length > 0)
        {
            cursor = cursor[parts.shift()];

            if (typeof cursor === 'undefined')
                return false;
        }

        return true;
    }

    //
    // Folders
    //

    hasFolder(folder: string)
    {
        return this.hasPath(folder);
    }

    getFolders()
    {
        return Object.keys(this.filesMap);
    }

    addFolder(folder: string)
    {
        if (!this.hasFolder(folder))
            this.filesMap[folder] = {};

        this.save();
    }

    async removeFolder(folder: string)
    {
        if (!this.hasFolder(folder))
            return;

        let toRemovePaths = Object.keys(this.filesMap[folder]).map(filename => folder + '/' + filename);
        await delMany(toRemovePaths);

        delete this.filesMap[folder];

        this.save();
    }

    //
    // Files
    //

    getFiles(folder: string)
    {
        return Object.keys(this.filesMap[folder]);
    }

    async addFile(folder: string, file: File | string, dataURL = null)
    {
        let filename = file instanceof File ? file.name : file;
        
        if (!dataURL)
            dataURL = await fileToDataUrl(file as File);

        await set(folder + '/' + filename, dataURL);

        try
        {
            let size = await getImageSize(dataURL);
            await set(folder + '/' + filename + ':size', { width: size.width, height: size.height });
        }
        catch (e) {}

        this.filesMap[folder][filename] = null;

        this.save();
    }

    async getFile(path: string)
    {
        path = FileManager.toShortPath(path);
        return get(path);
    }

    async removeFile(folder: string, file: string)
    {
        await del(folder + '/' + file);
        await del(folder + '/' + file + ':size');

        delete this.filesMap[folder][file];

        this.save();
    }

    //
    //
    //

    static toShortPath(path: string)
    {
        let parts = path.split('/');

        if (parts.length === 3)
            parts.shift();

        return parts.join('/');
    }

    static toFullPath(path: string)
    {
        if (!path.startsWith('assets/'))
            path = 'assets/' + path;

        return path;
    }
}

export let FILES = new FileManager;

//
//
//

export async function fileToDataUrl(file: File)
{
    return new Promise(resolve =>
    {
        let reader = new FileReader;
            reader.onload = e => resolve(e.target.result);
            reader.readAsDataURL(file);
    });
}

async function getImageSize(src: string): Promise<{ width: number, height: number }>
{
    return new Promise((resolve, reject) =>
    {
        let img = new Image;
            img.onload = () => { resolve({ width: img.width, height: img.height }); };
            img.onerror = reject;
            img.src = src;
    });
}