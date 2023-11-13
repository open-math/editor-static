import { State, StateProp } from "state";

export function initInifoPanel()
{
    let panel = document.querySelector('body > aside.panes > .pane[data-pane="info"]');

    let titleElem = panel.querySelector('.title') as HTMLInputElement;
        titleElem.value = State.get(StateProp.Title) ?? '';
        titleElem.oninput = () => State.set(StateProp.Title, titleElem.value);

    let descElem = panel.querySelector('.desc') as HTMLTextAreaElement;
        descElem.value = State.get(StateProp.Description) ?? '';
        descElem.oninput = () => State.set(StateProp.Description, descElem.value);

    let tagsElem = panel.querySelector('.tags') as HTMLTextAreaElement;
        tagsElem.value = State.get(StateProp.Tags) ?? '';
        tagsElem.oninput = () => State.set(StateProp.Tags, tagsElem.value);
        
    let contributorsElem = panel.querySelector('.contributors') as HTMLTextAreaElement;
        contributorsElem.value = State.get(StateProp.Contributors) ?? '';
        contributorsElem.oninput = () => State.set(StateProp.Contributors, contributorsElem.value);

    let macrosElem = panel.querySelector('.macros') as HTMLTextAreaElement;
        macrosElem.value = State.get(StateProp.Macros) ?? '';
        macrosElem.oninput = () => State.set(StateProp.Macros, macrosElem.value);
}