export enum StateProp
{
    Tab = 'tab',

    Article = 'article',
    Summary = 'summary',
    Practicum = 'practicum',

    Files = 'files',

    // Info

    Title = 'title',
    Description = 'description',
    Tags = 'tags',
    Contributors = 'contributors',
}

export type TopicPart = StateProp.Article | StateProp.Summary | StateProp.Practicum;

export class State
{
    static reset()
    {
        localStorage.clear();
    }

    //

    static get(property: StateProp)
    {
        return localStorage.getItem(property);
    }

    static set(property: StateProp, value: any)
    {
        localStorage.setItem(property, value);
    }

    static clear(property: StateProp)
    {
        localStorage.removeItem(property);
    }

    //

    static getTab(): TopicPart
    {
        let tab = this.get(StateProp.Tab);
        if (!tab)
            tab = 'article';

        return tab as any;
    }

    static getContent(topicPart: TopicPart)
    {
        let content = this.get(topicPart);

        if (content === null)
            content = '';

        return content;
    }

    //

    static saveUniques(uniqueMap: object)
    {
        localStorage.setItem('uniques', JSON.stringify(uniqueMap));
    }

    static getUniques()
    {
        let jsonUniques = localStorage.getItem('uniques');

        if (!jsonUniques)
            return {};

        return JSON.parse(jsonUniques);
    }
}