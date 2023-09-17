import { disableCtrlSave } from "disableCtrlSave";
import { initEditor } from "editor";
import { FileUi } from "file/ui";
import { sendUnique, switchTheme } from "iframe";
import { initInifoPanel } from "info";
import { initPanes } from "pane";
import { liveReload } from "reload";
import { initResizer } from "resize";
import { initTabs } from "tab";
import { TRANSLATOR } from "translator/translator";
import { UNIQUE } from "translator/unique";
import { initZip } from "zip";

liveReload();
disableCtrlSave();

window.addEventListener('load', () =>
{
    initZip();

    initEditor();
    initResizer();

    initPanes();
    new FileUi;
    initTabs();

    initInifoPanel();

    // TEST

    document.querySelector('main > header> button.themeSwitch').addEventListener('click', () =>
    {
        switchTheme();
    });
});

window.addEventListener('message', e =>
{
    if (e.data.command === 'renderUnique')
    {
        let uniqueId = e.data.uniqueId;
        let uniqueContent = UNIQUE.get(uniqueId);

        if (!uniqueContent)
        {
            sendUnique(uniqueId, `No unique found with id '${uniqueId}'!`);
            return;
        }

        TRANSLATOR.renderer.renderBlocks(uniqueContent).then(content =>
        {
            uniqueContent = content;
            sendUnique(uniqueId, uniqueContent);
        });
    }
});