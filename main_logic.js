
const nameMenu = document.querySelector('.droppedBtn');
const createBtn = document.getElementById('create');
const confInp = document.getElementById('folderInput');
const confBtn = document.getElementById('nameConfirm');

const folderList = document.getElementById('aside');
const modalWindow1 = document.getElementById('confirm');
const fileAlert = document.getElementById('alert');
const alertBtn = document.getElementById('delAlert');
const alertTitle = document.getElementById('alertTitle');

var mainSpace = document.getElementById('main');
const startButton = document.getElementById('startButton');
const startFolder = document.getElementById('startFolder');

const loading = document.getElementById('loading');

const fileBtn = document.getElementById('choose');
const fileInp = document.getElementById('fileInp');

let isBusy = false;
let trackId = 0;
let foldId = 0;
let foldersData = [];
let tracksData = [];
let db;
loading.classList.replace('hide', 'loadingWrapper');
initDB();
setTimeout(() => {
    loading.classList.replace('loadingWrapper', 'hide');
}, 500);
startButton.addEventListener('click', () => {
    for (var i = 1; i < folders.length; i++) {
        folders[i].folder.classList.remove('currentFolder'); folders[i].folder.classList.add('hide');
        folders[i].button.classList.remove('temporaryCol');
    };
    fileBtn.disabled = true; fileBtn.classList.replace('choose', 'disabled');
    startFolder.classList.remove('hide'); startFolder.classList.add('currentFolder');
    startButton.classList.add('temporaryCol');
});
startButton.click(); startButton.focus();

nameMenu.addEventListener('mouseover', () => {modalWindow1.classList.replace('hide', 'show')});
nameMenu.addEventListener('mouseout', () => {modalWindow1.classList.replace('show', 'hide');});
createBtn.addEventListener('click', () => {modalWindow1.classList.replace('show', 'hide');});
confBtn.addEventListener('click', () => {
    const name = confInp.value.trim() || null;
    confInp.value = '';
    if (!name) {return};
    for (var i = 0; i < foldersData.length; i++) {
        if (foldersData[i].name.includes(name)) {
            alertTitle.textContent = `Name '${name}' is already existing`;
            fileAlert.classList.replace('hide', 'alert');
            return;
        };
    };
    modalWindow1.classList.replace('show', 'hide');
    const fold = new Folder(name, foldId);
    foldersData.push({id: foldId, name: name, tracksIds: []});
    updateFolders(foldersData);
    foldId++;
    updateFoldsIds(foldId);
    mainSpace.append(fold.newFolder);
    folderList.appendChild(fold.newBtnCont);
    
});

alertBtn.addEventListener('click', () => {fileAlert.classList.replace('alert', 'hide')});


fileBtn.addEventListener('click', () => {if (!fileBtn.disabled) {fileInp.click()}});
fileInp.addEventListener('change', async () => {
    const file = fileInp.files[0];
    fileURL = URL.createObjectURL(file);
    const track = new Audio(fileURL);
    const player = new Tracks(track, fileInp.value, trackId);
    allTracks.push(player); console.log(allTracks);
    binaryData = await file.arrayBuffer();
    tracksData.push({id: trackId, title: fileInp.value, binaryData});
    updateTracks(tracksData);
    fileInp.innerHTML = '';
    document.querySelector('.currentFolder').appendChild(player.wrapper);
    for (var i = 0; i < foldersData.length; i++) {
        if (folders[i+1].folder.classList.contains('currentFolder')) {
            foldersData[i].tracksIds.push(trackId);
            console.log(foldersData[i].tracksIds);
            break;
        };
    };
    updateFolders(foldersData);
    trackId++;
    updateTracksIds(trackId);
});
