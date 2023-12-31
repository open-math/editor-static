import { translate } from "content/workerClient";
import { State } from "state";
import { getCurrentTab } from "tab";

declare let require, monaco;

let editor;
let changeDelay = 1000;

let changeId = 0;

export function initEditor()
{
    let changeTimeout;

    require.config({ paths: { vs: 'assets/vendor/monaco/min/vs' } });

    require(['vs/editor/editor.main'], function () {
        editor = monaco.editor.create(document.querySelector('main .editor'),
        {
            automaticLayout: true,
            minimap: { enabled: false },
            padding: { top: 30 },
            renderWhitespace: 'all',
            theme: 'vs-dark',
            value: State.getContent(State.getTab()),
            language: 'markdown'
        });

        editor.getModel().onDidChangeContent(() =>
        {
            State.set(getCurrentTab() as any, editor.getValue());

            clearTimeout(changeTimeout);
            changeTimeout = setTimeout(() => { onEditorChange(editor.getValue()) }, changeDelay);
        });

        onEditorChange(editor.getValue());
    });
}

export function setEditorContent(topicPart: string)
{
    let content = State.getContent(topicPart as any);
    
    let _changeDelay = changeDelay;
    changeDelay = 0;
    editor.getModel().setValue(content);
    changeDelay = _changeDelay;
}

function onEditorChange(content: string)
{
    translate({ tab: getCurrentTab(), content: content });
}