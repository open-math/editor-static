export function disableCtrlSave()
{
    document.addEventListener("keydown", function(e) {
        if ((e.ctrlKey || e.metaKey) && e.code === "KeyS") {
            e.preventDefault();
        }
    }, false);
}