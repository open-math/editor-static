let reconnectDelay = 500;
let ws: WebSocket;

export let liveReload = (retry: boolean = false) =>
{
    if (location.hostname !== 'localhost')
        return;

    ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () =>
    {
        if (retry)
            location.reload();
    }

    ws.onmessage = e =>
    {
        if (e.data === 'reload')
            location.reload();
    }

    ws.onclose = () => setTimeout(() => { liveReload(true) }, reconnectDelay);
}