import type { TInitData, TRequestData, TranslatorResult } from "_worker/translator";

let worker: Worker;
let resultCb;

export function setupWorker(initData: TInitData)
{
    worker = new Worker('/worker.js');
    worker.postMessage(initData);

    worker.onmessage = e =>
    {
        let result = e.data as TranslatorResult;

        if (resultCb)
            resultCb(result);
    }
}

export function translate(data: TRequestData)
{
    worker.postMessage(data);
}

export function setTranslateResult(cb: (result: TranslatorResult) => void)
{
    if (resultCb)
        throw new Error('Dublicate translator result callback!');

    resultCb = cb;
}