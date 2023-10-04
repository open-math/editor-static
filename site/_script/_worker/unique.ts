class Unique
{
    map: object;

    get(uniqueId: string)
    {
        return this.map[uniqueId];
    }

    set(tab: string, uniques: any[])
    {
        Object.keys(this.map).forEach(key =>
        {
            if (key.startsWith('@' + tab))
                delete this.map[key];
        });

        uniques.forEach(unique => this.map[unique.id] = unique.content);
    }
}

export let UNIQUE = new Unique;