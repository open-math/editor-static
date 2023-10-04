import { setEditorContent } from "editor";
import { State, StateProp } from "state";

export function initTabs()
{
    let tabs = document.querySelectorAll('body > main > header > .tabs > button');

    tabs.forEach(tab =>
    {
        tab.addEventListener('click', () =>
        {
            if (tab.hasAttribute('data-current'))
                return;

            tabs.forEach(_tab => _tab.removeAttribute('data-current'));
            setCurrentTab(tab.getAttribute('data-tab'));
        });
    });

    let currentTab = State.getTab();
    setCurrentTab(currentTab, false);
}

export function getCurrentTab()
{
    return document.querySelector('body > main > header > .tabs > button[data-current]').getAttribute('data-tab');
}

function setCurrentTab(tab: string, updateEditor: boolean = true)
{
    document.querySelector(`body > main > header > .tabs > button[data-tab="${tab}"]`).setAttribute('data-current', '');
    State.set(StateProp.Tab, tab);
    
    if (updateEditor)
    {
        setEditorContent(tab);
    }
}