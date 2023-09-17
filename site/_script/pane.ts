import { FILES } from "file/manager";
import { State } from "state";
import { exportTopic, importTopic } from "zip";

export function initPanes()
{
    initMainPane();

    //

    let paneButtons = document.querySelectorAll('body > aside.menu > button');

    paneButtons.forEach(paneButon =>
    {
        paneButon.addEventListener('click', () =>
        {
            let toSet = true;

            if (paneButon.hasAttribute('data-current'))
            {
                toSet = false;
                unsetPane();
            }

            paneButtons.forEach(_paneButton => _paneButton.removeAttribute('data-current'));

            if (toSet)
                setPane(paneButon.getAttribute('data-pane'));
        });
    });
}

function unsetPane()
{
    document.querySelector('body > aside.panes').removeAttribute('data-pane');
}

function setPane(name: string)
{
    document.querySelector(`body > aside.menu > button[data-pane="${name}"]`).setAttribute('data-current', '');
    document.querySelector('body > aside.panes').setAttribute('data-pane', name);
}

function initMainPane()
{
    let pane = document.querySelector('body > aside.panes > .pane[data-pane="main"]');

    pane.querySelector('button.reset').addEventListener('click', () =>
    {
        if (confirm('Everything will be lost!'))
        {
            State.reset();
            FILES.reset().then(() => location.reload());
        }
    });

    pane.querySelector('button.export').addEventListener('click', () =>
    {
        exportTopic();
    });

    pane.querySelector('button.import').addEventListener('click', () =>
    {
        importTopic();
    });
}