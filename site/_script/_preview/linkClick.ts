export function initLinkClick()
{
    let previewModal: PreviewModal;

    window.addEventListener('load', () =>
    {
        previewModal = new PreviewModal;
    });

    window.addEventListener('message', e =>
    {
        if (e.data.command !== 'renderUnique')
            return;

        previewModal.open(e.data.uniqueId, e.data.uniqueContent);
    });

    globalThis.OMathEvent = globalThis.OMathEvent || {};

    globalThis.OMathEvent.onLinkClick = (link, e) =>
    {
        e.preventDefault();

        window.parent.postMessage({
            command: 'renderUnique',
            uniqueId: link.getAttribute('data-preview') || link.getAttribute('href')
        });
    }
}

class PreviewModal
{
    target: HTMLElement;
    content: HTMLElement;

    constructor()
    {
        let previewRoot = document.querySelector('#preview');

        this.target = previewRoot.querySelector(':scope > article > header > .target');
        this.content = previewRoot.querySelector(':scope > article > .content');

        previewRoot.addEventListener('click', e =>
        {
            if (e.target === previewRoot)
                this.hide();
        })

        previewRoot.querySelector(':scope > article > header > i').addEventListener('click', () =>
        {
            this.hide();
        });
    }

    open(target: string, content: string)
    {
        this.target.innerHTML = target;
        this.content.innerHTML = content;

        globalThis.OMathContent.initProducts(this.content, {});

        document.body.classList.add('previewOpen');
    }

    hide()
    {
        document.body.classList.remove('previewOpen');
    }
}