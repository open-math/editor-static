import { State } from "state";

class Unique
{
    map: object;

    constructor()
    {
        this.map = State.getUniques();
    }

    get(uniqueId: string)
    {
        return this.map[uniqueId];
    }

    set(tab: string, ...uniques: any[])
    {
        Object.keys(this.map).forEach(key =>
        {
            if (key.startsWith('@' + tab))
                delete this.map[key];
        });

        uniques.forEach(unique => this.map[unique.id] = unique.content);
        State.saveUniques(this.map);
    }
}

export let UNIQUE = new Unique;