class Folder {
    constructor(name, id) {
        this.folderName = name;
        this.id = id;
        this.isShow = true;
        this.makeElements();
        this.initEvents();
    };
    initEvents() {
        this.renameBtn.addEventListener('click', () => this.rename());
        this.delBtn.addEventListener('click', () => this.delete());
        //this.folderBtn.addEventListener('focus', () => this.showFolder());
        //this.folderBtn.addEventListener('focusout', () => this.hideFolder());
        this.folderBtn.addEventListener('contextmenu', () => this.showMenu());
        this.folderBtn.addEventListener('click', () => this.changeFolder());
    };
    makeElements() {
        // сама папка
        this.p = document.createElement('p'); this.p.textContent = `Current folder: ${this.folderName}`;
        this.newFolder = document.createElement('div'); this.newFolder.className = 'hide'; this.newFolder.appendChild(this.p);
        // кнопка выбора папки
        this.folderBtn = document.createElement('button'); this.folderBtn.textContent = this.folderName;
        // выпадающее меню папки
        this.newFoldMenu = document.createElement('div'); this.newFoldMenu.classList = 'hide';
        this.renameInp = document.createElement('input'); this.renameInp.placeholder = 'Enter the new name'; this.renameInp.value = this.folderName;
        this.renameBtn = document.createElement('button'); this.renameBtn.textContent = 'Rename';
        this.delBtn = document.createElement('button'); this.delBtn.textContent = 'Delete';
        this.newFoldMenu.appendChild(this.renameInp); this.newFoldMenu.appendChild(this.renameBtn); this.newFoldMenu.appendChild(this.delBtn);
        // объединение двух предыдущих в один контейнер
        this.newBtnCont = document.createElement('div'); this.newBtnCont.classList = 'btnContent';
        this.newBtnCont.appendChild(this.folderBtn); this.newBtnCont.appendChild(this.newFoldMenu);
        this.newBtnCont.id = this.folderName;
        folders.push({
            button: this.folderBtn,
            folder: this.newFolder,
            menu: this.newFoldMenu,
        });
    };
    //showFolder() {this.newFolder.classList.replace('hide', 'currentFolder')};
    //hideFolder(event) {
    //    if (!this.newFolder.contains(event.relatedTarget)) {this.newFolder.classList.replace('currentFolder', 'hide')}
    //};
    changeFolder() {
        for (var i = 0; i < folders.length; i++) {
            folders[i].folder.classList.remove('currentFolder'); folders[i].folder.classList.add('hide');
            folders[i].button.classList.remove('temporaryCol');
        }
        this.newFolder.classList.remove('hide'); this.newFolder.classList.add('currentFolder');
        fileBtn.classList.replace('disabled', 'choose'); fileBtn.disabled = false;
        this.folderBtn.classList.add('temporaryCol');
        this.isShow = false;
    };
    showMenu() {
        event.preventDefault();
        if (this.isShow) {
            this.isShow = false;
            this.newFoldMenu.classList.remove('hide'); this.newFoldMenu.classList.add('foldMenu');
        } else {
            this.newFoldMenu.classList.remove('foldMenu'); this.newFoldMenu.classList.add('hide');
            this.isShow = true;
        };
    };
    rename() {
        this.check = true;
        this.newName = this.renameInp.value.trim() || null;
        this.renameInp.value = '';
        this.newFoldMenu.classList.replace('foldMenu', 'hide');
        if (!this.newName || this.name === this.newName) {return};
        
        for (var i = 0; i < foldersData.length; i++) {
            if (foldersData[i].name === this.newName) {alertTitle.textContent = `name '${this.newName}' is already existing`; fileAlert.classList.replace('hide', 'alert');; this.check = false; break};
        };
        if (!this.check) {return};
        for (var i = 0; i < foldersData.length; i++) {
            if (foldersData[i].name === this.folderName) {
                foldersData[i].name = this.newName;
                console.log(foldersData[i].name);
                break;
            };
        };
        this.folderBtn.textContent = this.newName;
        this.p.textContent = `Current folder: ${this.newName}`;
        this.folderName = this.newName; this.renameInp.value = this.folderName;
        updateFolders(foldersData);
    };
    delete() {
        this.newFolder.remove(); this.newBtnCont.remove();
        for (var i = 0; i < foldersData.length; i++) {
            if (foldersData[i].id === this.id) {
                if (foldersData[i].tracksIds) {
                    allTracks = allTracks.filter(t => !foldersData[i].tracksIds.includes(t.id));
                    tracksData = tracksData.filter(t => !foldersData[i].tracksIds.includes(t.id));
                };
                foldersData.splice(i, 1);
                folders.splice(i+1, 1);
                break;
            };
        };
        updateFolders(foldersData);
        updateTracks(tracksData);
        console.log(folders);
        console.log(allTracks);
        startButton.click();
    };
};
