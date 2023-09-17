export function initResizer()
{
    let wrapper = document.querySelector('main > .wrapper');
    
    let editor =    wrapper.querySelector(':scope > .editor');
    let grip =      wrapper.querySelector(':scope > .grip');
    let preview =   wrapper.querySelector(':scope > .preview');
    
    let resizeOverlay = preview.querySelector(':scope > .resizeOverlay');

    let resizing = false;

    let beginResize = () =>
    {
        resizing = true;
        resizeOverlay.setAttribute('data-showing', '');
    }

    let endResize = () =>
    {
        resizing = false;
        resizeOverlay.removeAttribute('data-showing');
    }

    grip.addEventListener('mousedown', (e: MouseEvent) =>
    {
        beginResize();
    });

    wrapper.addEventListener('mousemove', (e: MouseEvent) =>
    {
        if (!resizing) return;
        editor.setAttribute('style', `flex: 0 1 auto; width: ${editor.clientWidth + e.movementX}px`);
    });

    wrapper.addEventListener('mouseout', (e: MouseEvent) =>
    {
        if (!wrapper.contains(e.relatedTarget as Element) && resizing)
        {
            endResize();
        }
    });

    window.addEventListener('mouseup', () =>
    {
        if (resizing) endResize();
    });

    grip.addEventListener('dblclick', () => editor.removeAttribute('style'));
}