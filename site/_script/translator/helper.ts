import { FILES } from "file/manager";
import { Helper, Location, LocationType } from "translator";
import { UNIQUE } from "./unique";

export class EditorHelper extends Helper
{
    async getParserFileSrc(location: Location): Promise<string>
    {
        if (location.type === LocationType.Topic && location.path === 'localhost')
        {
            if (!FILES.hasPath(location.target))
                throw new Error(`Missing file '${location.target}'!`);

            return await FILES.getFile(location.target);
        }
        else return '';
    }

    async getRenderFileSrc(location: Location): Promise<string>
    {
        if (location.type === LocationType.Topic && location.path === 'localhost')
            return await FILES.getFile(location.target);
        else
            return '/assets/images/sample-image.svg';
    }

    async getImageSize(src: string): Promise<{ width: number; height: number; }>
    {
        if (src === '')
            return { width: 800, height: 300 };

        return await new Promise(resolve =>
        {
            let img = new Image;
                img.onload = () =>
                {
                    resolve({ width: img.width, height: img.height });
                };
                img.src = src;
        });
    }

    async getUnique(id: string)
    {
        console.log('test1');
        return UNIQUE.get(id);
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
                hint: 'Hint',
                answer: 'Answer',
                solution: 'Solution'
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