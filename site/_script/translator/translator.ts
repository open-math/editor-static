import { Parser, Renderer, Location } from "translator";

import { EditorHelper } from "./helper";
import { UNIQUE } from "./unique";
import { getCurrentTab } from "tab";

let location = new Location;
    location.path = 'localhost';

export let LOCATION = location;

//

class Translator
{
    parser: Parser;
    renderer: Renderer;

    constructor()
    {
        let helper = new EditorHelper;

        this.parser = new Parser(LOCATION, helper);
        this.renderer = new Renderer(LOCATION, helper);
    }

    async translate(str: string): Promise<string>
    {
        let parseResult = await this.parser.parse(str);

        UNIQUE.set(getCurrentTab(), ...parseResult.uniques);

        let blocks = parseResult.blocks;
        let renderResult = await this.renderer.renderBlocks(blocks);

        parseResult.errors.forEach(error => console.error(error));

        return renderResult;
    }
}

export let TRANSLATOR = new Translator;