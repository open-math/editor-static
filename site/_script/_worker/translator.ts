import { Location, LocationType, ParseResult, Parser, Renderer } from "translator";

import { EditorHelper } from "./helper";
import { UNIQUE } from "./unique";

export type TInitData =
{
    uniqueMap: object
}

export type TRequestData =
{
    tab:        string;
    content:    string;
    macros:     object;
}

export class TranslatorResult
{
    tab:                string;
    uniqueMap:          object;
    renderedUniqueMap:  object;
    parseResult:        ParseResult;
    renderResult:       string;
}

//
//
//

let inited = false;

let requestIdMap = {};

onmessage = async e =>
{
    if (!inited)
    {
        inited = true;
        initWorker(e.data);
    }

    let data = e.data as TRequestData;

    requestIdMap[data.tab] = requestIdMap[data.tab] ?? 0;

    let requestId = ++requestIdMap[data.tab];

    //

    let result = await translate(data.tab, data.content, data.macros);

    if (requestId !== requestIdMap[data.tab])
        return;

    UNIQUE.set(data.tab, result.parseResult.uniques);

    result.tab =        data.tab;
    result.uniqueMap =  UNIQUE.map;
    result.renderedUniqueMap = await renderUniques();

    if (requestId !== requestIdMap[data.tab])
        return;

    postMessage(result);
}

//

let helper = new EditorHelper;

async function translate(tab: string, content: string, macros: object): Promise<TranslatorResult>
{
    let location = new Location;
        location.type = tab as LocationType;
        location.path = 'localhost';

    helper.getMathMacros = () => macros;

    let parser = new Parser(location, helper);
    let renderer = new Renderer(location, helper);

    renderer.onRenderError = (p, e) =>
    {
        console.error(e);
    }

    let result = new TranslatorResult;
        result.parseResult = await parser.parse(content);
        result.renderResult = await renderer.renderBlocks(result.parseResult.blocks);

    return result;
}

async function renderUniques()
{
    let location = new Location;
    let renderer = new Renderer(location, helper);
    let resultMap = {};

    let uniqueIds = Object.keys(UNIQUE.map);
    for (let i = 0; i < uniqueIds.length; i++)
    {
        let uniqueId = uniqueIds[i];
        resultMap[uniqueId] = await renderer.renderBlocks(UNIQUE.get(uniqueId));
    }

    return resultMap;
}

//

function initWorker(initData: TInitData)
{
    UNIQUE.map = initData.uniqueMap;
}