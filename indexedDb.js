
let folders = [{
    button: document.getElementById('startButton'),
    folder: document.getElementById('startFolder'), 
    folderName: 'Start Page'
}];
let allTracks = []
function initDB() {
    const request = indexedDB.open('data', 1);
    request.onerror = () => {
        console.log('Ошибка базы данных:', request.error);
    };
    request.onupgradeneeded = () => {
        console.log('обновление...');
        db = request.result; // получение ссылки на бд
        if (!db.objectStoreNames.contains('folders')) {
            const folders = db.createObjectStore('folders', {keyPath: 'id'}); // создание хранилища
        };
        if (!db.objectStoreNames.contains('tracks')) {
            const tracks = db.createObjectStore('tracks', {keyPath: 'id'})
        };
        if (!db.objectStoreNames.contains('foldsIds')) {
            const foldsIds = db.createObjectStore('foldsIds', {keyPath: 'id'});
        };
        if (!db.objectStoreNames.contains('tracksIds')) {
            const tracksIds = db.createObjectStore('tracksIds', {keyPath: 'id'});
        };
    };
    request.onsuccess = () => {
        db = request.result;
        //db.close(); 
        //delDb();
        console.log('БД открыта!');
        loadData();
        loadIds();
    };
};

function updateFolders(content) {
    if (!db) {console.error('Ошибка: db не определена'); return};
    let transaction = db.transaction('folders', 'readwrite'); // создание транзакции
    let foldersData = transaction.objectStore('folders'); // получение хранилища через транзакцию
    foldersData.delete(1).onsuccess = () => {
        foldersData.put({id: 1, data: content});
        console.log('Папки обновлены успешно');
    }; 
};
function updateTracks(content) {
    if (!db) {console.error('Ошибка: db не определена'); return};
    let transaction = db.transaction('tracks', 'readwrite');
    let tracksData = transaction.objectStore('tracks');
    tracksData.delete(1).onsuccess = () => {
        tracksData.put({id: 1, data: content});
        console.log('Треки обновлены успешно');
    }; 
};
function updateFoldsIds(content) {
    if (!db) {console.error('Ошибка: db не определена'); return};
    let transaction = db.transaction('foldsIds', 'readwrite');
    let foldsIdsData = transaction.objectStore('foldsIds');
    foldsIdsData.delete(1).onsuccess = () => {
        foldsIdsData.put({id: 1, data: content});
        console.log('Айди папок обновлены успешно');
    }; 
};
function updateTracksIds(content) {
    if (!db) {console.error('Ошибка: db не определена'); return};
    let transaction = db.transaction('tracksIds', 'readwrite');
    let tracksIdsData = transaction.objectStore('tracksIds');
    tracksIdsData.delete(1).onsuccess = () => {
        tracksIdsData.put({id: 1, data: content});
        console.log('Айди треков обновлены успешно');
    }; 
};
function loadIds() {
    let transaction1 = db.transaction('foldsIds', 'readonly');
    let foldsIdsStore = transaction1.objectStore('foldsIds');
    let request1 = foldsIdsStore.getAll();

    let transaction2 = db.transaction('tracksIds', 'readonly');
    let tracksIdsStore = transaction2.objectStore('tracksIds');
    let request2 = tracksIdsStore.getAll();

    request1.onsuccess = async () => {
        const allRecords = request1.result;
        const IdsRecord = allRecords.find(r => r.id === 1);
        if (IdsRecord?.data) {foldId = IdsRecord.data};
    };
    request1.onerror = () => {console.log('Ошибка: ', request1.error)};

    request2.onsuccess = async () => {
        const allRecords = request2.result;
        const IdsRecord = allRecords.find(r => r.id === 1);
        if (IdsRecord?.data) {trackId = IdsRecord.data};
    };
    request2.onerror = () => {console.log('Ошибка: ', request2.error)};
}
function loadData() {
    let transaction1 = db.transaction('folders', 'readonly');
    let foldersStore = transaction1.objectStore('folders');
    let request1 = foldersStore.getAll();

    let transaction2 = db.transaction('tracks', 'readonly');
    let tracksStore = transaction2.objectStore('tracks');
    let request2 = tracksStore.getAll();
    
    request1.onsuccess = async () => {
    const allRecords = request1.result;
    const foldersRecord = allRecords.find(r => r.id === 1);
    
        if (foldersRecord?.data) {
            foldersData = foldersRecord.data;
            foldersData.forEach(f => {
                const folder = new Folder(f.name, f.id);
                folderList.appendChild(folder.newBtnCont);
                mainSpace.appendChild(folder.newFolder);
            });
        } else {
            console.log("Нет данных о папках в БД");
        }
    };
    request1.onerror = () => {
        console.error('Ошибка:', request1.error);
    };
    request2.onsuccess = async () => {
        const allRecords = request2.result;
        const tracksRecord = allRecords.find(r => r.id === 1);
        if (tracksRecord?.data) {
            tracksData = tracksRecord.data;
            console.log(tracksData);
            tracksData.forEach(t => {
                const blob = new Blob([t.binaryData], { type: "audio/mp3" });
                const audioUrl = URL.createObjectURL(blob);
                const audio = new Audio(audioUrl);        
                const track = new Tracks(audio, t.title, t.id);
                allTracks.push(track);
                for (let i = 0; i < foldersData.length; i++) {
                    if (foldersData[i].tracksIds?.includes(t.id)) {
                        if (folders[i+1]) {
                            folders[i+1].folder.appendChild(track.wrapper);
                        }
                        break;
                    }
                }
            })
        }
    };
    request2.onerror = () => {
        console.log('Ошибка:', request2.error);
    };
};

function delDb() {
    const request = indexedDB.deleteDatabase('data');
    request.onsuccess = () => {
        console.log('База данных успешно удалена');
    };
    request.onerror = () => {
        console.error('Ошибка при удалении базы данных');
    };
    request.onblocked = () => {
        console.warn('Удаление заблокировано (возможно, база открыта в другом месте)');
    };
};