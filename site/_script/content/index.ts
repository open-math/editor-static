import { State } from "state";
import { setTranslateResult, setupWorker } from "./workerClient";
import { sendUniqueToPreview, setPreviewContent } from "iframe";
import { TranslatorResult } from "_worker/translator";
import { getCurrentTab } from "tab";

let renderedUniques = {};

export function initContent()
{
    setupWorker({
        uniqueMap: State.getUniques()
    });

    setTranslateResult(result => { translateResult(result); });

    window.addEventListener('message', e =>
    {
        if (e.data?.command !== 'renderUnique')
            return;

        let uniqueId = e.data.uniqueId;

        if (renderedUniques[uniqueId])
            sendUniqueToPreview(uniqueId, renderedUniques[uniqueId]);
        else
            sendUniqueToPreview(uniqueId, `No unique found with id '${uniqueId}'!`);
    });
}

function translateResult(result: TranslatorResult)
{
    //console.log(result);

    if (result.parseResult.errors)
        result.parseResult.errors.forEach(error => console.error(error));

    State.saveUniques(result.uniqueMap);

    renderedUniques = result.renderedUniqueMap;

    if (result.tab === getCurrentTab())
        setPreviewContent(result.renderResult);
}