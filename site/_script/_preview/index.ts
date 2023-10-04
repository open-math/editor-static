import { disableCtrlSave } from "disableCtrlSave";
import { IFRAME_COMMAND } from "iframe";

import { initLinkClick } from "./linkClick";

declare let OMathContent;

//
//
//

disableCtrlSave();
initLinkClick();

//
//
//

window.addEventListener('message', e =>
{
    switch (e.data.command)
    {
        case IFRAME_COMMAND.SwitchTheme:
            switchTheme();
            break;
        case IFRAME_COMMAND.SetContent:
            setContent(e.data.content);
            break;
    }
});

function switchTheme()
{
    let currentTheme = document.documentElement.getAttribute('data-theme');
    let nextTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', nextTheme);
    document.querySelector('meta[name="color-scheme"]').setAttribute('content', nextTheme);
}

function setContent(content: string)
{
    let contentElem = document.querySelector('body > article');
        contentElem.innerHTML = content;

    let options =
    {
    }

    OMathContent.initProducts(contentElem, options);
}