let iframe: HTMLIFrameElement;

export enum IFRAME_COMMAND
{
    SwitchTheme,
    SetContent
}

function postMessage(message: any)
{
    if (!iframe)
        iframe = document.querySelector('body > main > .wrapper > .preview > iframe');

    iframe.contentWindow.postMessage(message);
}

export function switchTheme()
{
    postMessage({ command: IFRAME_COMMAND.SwitchTheme });
}

export function setContent(content: string)
{
    postMessage({ command: IFRAME_COMMAND.SetContent, content: content });
}

export function sendUnique(uniqueId: string, uniqueContent: string)
{
    postMessage({
        command: 'renderUnique',
        uniqueId: uniqueId,
        uniqueContent: uniqueContent
    });
}