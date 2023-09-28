import { FILES } from "./manager";

export class FileUi
{
    pane: HTMLElement;
    filesWrapper: HTMLElement;
    input: HTMLInputElement;

    constructor()
    {
        this.pane = document.querySelector('body > aside.panes > .pane[data-pane="files"]');
        this.filesWrapper = this.pane.querySelector(':scope > .filesWrapper');

        this.setupInput();
        this.withUpdateUi(() => this.updateUi());
    }

    setupInput()
    {
        this.input = <HTMLInputElement>this.pane.querySelector(':scope > input');
        this.input.onchange = e =>
        {
            let folder = this.input.getAttribute('data-target-folder');
            let file = (e.target as any).files[0];
            this.input.value = null;

            this.withUpdateUi(async () => await FILES.addFile(folder, file));
        }
    }
    
    //
    //
    //

    updateUi()
    {
        this.filesWrapper.innerHTML = FileUi.getFullRender();

        // Add folder
        this.filesWrapper.querySelector('.action.addFolder').addEventListener('click', () =>
        {
            let folder = prompt('Folder name:');

            if (!folder || FILES.hasFolder(folder))
                return;

            this.withUpdateUi(() => FILES.addFolder(folder));
        });

        // Add file
        this.filesWrapper.querySelectorAll('.action.addFile').forEach(elem => elem.addEventListener('click', () =>
        {
            let folder = elem.closest('.folder').getAttribute('data-name');
            this.input.setAttribute('data-target-folder', folder);
            this.input.click();
        }));

        // Remove
        this.filesWrapper.querySelectorAll('.action.remove').forEach(elem => elem.addEventListener('click', () =>
        {
            let fileElem = elem.closest('.file');
            let folder = elem.closest('.folder').getAttribute('data-name');

            this.withUpdateUi(async () =>
            {
                if (fileElem)
                    await FILES.removeFile(folder, fileElem.getAttribute('data-name'));
                else
                    await FILES.removeFolder(folder);
            });
        }));
    }

    //
    //
    //

    async withUpdateUi(func)
    {
        this.pane.setAttribute('data-refreshing', '');
        await func();
        this.pane.removeAttribute('data-refreshing');
        this.updateUi();
    }

    //
    // Render methods
    //

    static getFullRender()
    {
        let result = '';
        FILES.getFolders().forEach(folder => result += FileUi.getFolderRender(folder, FILES.getFiles(folder)));
        return result;
    }

    static getFolderRender(folder: string, files: string[])
    {
        let isRoot = folder === 'assets';

        let filesStr = '';
        files.forEach(file => filesStr += this.getFileRender(folder, file));

        return `
            <div class="folder" data-name="${folder}">
                <header>
                    <div class="name">${isRoot ? 'Assets' : folder}</div>
                    <div class="actions">
                        ${this.getActionRender('addFile')}
                        ${this.getActionRender(isRoot ? 'addFolder' : 'remove')}
                    </div>
                </header>
                <div class="content">
                    ${filesStr}
                </div>
            </div>
        `;
    }

    static getFileRender(folder: string, file: string)
    {
        return `
            <div class="file" data-folder="${folder}" data-name="${file}">
                <div class="name">${file}</div>
                <div class="actions">
                    ${this.getActionRender('remove')}
                </div>
            </div>
        `;
    }

    static getActionRender(name: string)
    {
        let icon = '';

        switch (name)
        {
            case 'addFile':
                icon = 'i-file-circle-plus';
                break;
            case 'addFolder':
                icon = 'i-folder-plus';
                break;
            case 'remove':
                icon = 'i-trash-can';
                break;
        }

        return `
            <div class="action ${name}">
                <i class="${icon}"></i>
            </div>
        `;
    }
}