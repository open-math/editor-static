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

//

export function switchPreviewTheme()
{
    postMessage({ command: IFRAME_COMMAND.SwitchTheme });
}

export function setPreviewContent(content: string)
{
    postMessage({ command: IFRAME_COMMAND.SetContent, content: content });
}

export function sendUniqueToPreview(uniqueId: string, uniqueContent: string)
{
    postMessage({
        command: 'renderUnique',
        uniqueId: uniqueId,
        uniqueContent: uniqueContent
    });
}