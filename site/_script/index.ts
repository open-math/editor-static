import { disableCtrlSave } from "disableCtrlSave";
import { initEditor } from "editor";
import { FileUi } from "file/ui";
import { switchPreviewTheme } from "iframe";
import { initInifoPanel as initInfoPanel } from "info";
import { initPanes } from "pane";
import { liveReload } from "reload";
import { initResizer } from "resize";
import { initTabs } from "tab";
import { initZip } from "zip";
import { initContent } from "./content";

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

    initInfoPanel();
    initContent();

    // TEST

    document.querySelector('main > header> button.themeSwitch').addEventListener('click', () =>
    {
        switchPreviewTheme();
    });
});