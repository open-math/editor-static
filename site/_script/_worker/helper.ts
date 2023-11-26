import { get } from "idb-keyval/dist/index.cjs";
import { Helper, Location } from "translator";
import { UNIQUE } from "./unique";

function normalizePath(path: string)
{
    let parts = path.split('/');

    if (parts.length === 3)
        parts.shift();

    return parts.join('/');
}

export class EditorHelper extends Helper
{
    isEditor() { return true; }

    async hasAsset(location: Location): Promise<boolean>
    {
        return !!(await get(normalizePath(location.target)));
    }

    async getAssetSrc(location: Location): Promise<string>
    {
        return (await get(normalizePath(location.target)));
    }

    async getImageSize(location: Location): Promise<{ width: number; height: number; }>
    {
        let size = await get(normalizePath(location.target) + ':size');

        if (!size)
            throw new Error(`No image size found for image '${location}'!`);

        return { width: size.width, height: size.height };
    }

    async getUnique(id: string)
    {
        return UNIQUE.get(id);
    }

    getMathMacros(): object
    {
        return {};
    }

    i18n(phrase: string): string
    {
        let phraseMap = {
            error: 'Error!',
            anchor: 'Link to this section',
            accentBlock:
            {
                important: { name: 'Important' },
                example:
                {
                    name: 'Example',
                    expand: 'Solution'
                },
                definition: { name: 'Definition' },
                theorem:
                {
                    name: 'Theorem',
                    expand: 'Proof'
                }
            },
            task:
            {
                hint:       'Hint',
                answer:     'Answer',
                note:       'Note',
                solution:   'Solution',
                similar:    'Similar tasks',
                similarNum: 'Similar task',
                generate:   'Generate similar task',
            }
        };

        let cursor = phraseMap;
        let phraseParts = phrase.split('.');
        let result = phrase;

        for (let i = 0; i < phraseParts.length; i++)
        {
            try
            {
                let value = cursor[phraseParts[i]];
                cursor = value;

                if (i === phraseParts.length - 1)
                    if (typeof value === 'string')
                        result = value;
            } catch { break; }
        }

        return result;
    }
}