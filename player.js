class Tracks {
    constructor(file, fileTitle, id) {
        this.audioTitle = fileTitle.substring(fileTitle.lastIndexOf('\\') + 1, fileTitle.lastIndexOf('.'));
        this.audio = file; this.audio.volume = 0.5;
        this.isActive = false;
        this.isDel = false;
        this.id = id;
        this.createElements();
        this.initEvents();
    };
    calculateLen() {
        if (isNaN(this.audio.duration)) {return "00:00"};
        this.minLen = String(Math.floor(this.audio.duration / 60));
        this.secLen = String(Math.floor(this.audio.duration) - (this.minLen * 60));
        return this.minLen.padStart(2, '0') + ':' + this.secLen.padStart(2, '0');
    }
    createElements() {
        this.wrapper = document.createElement('div'); this.wrapper.classList.add('customAudio');
        this.goBack = document.createElement('button'); this.goBack.textContent = '◄◄';
        this.startBtn = document.createElement('button'); this.startBtn.textContent = '▶'
        this.goForw = document.createElement('button'); this.goForw.textContent = '►►';
        this.resetBtn = document.createElement('button'); this.resetBtn.textContent = '◼';
        this.progress = document.createElement('div'); this.progress.classList.add('progress');
        this.audioName = document.createElement('span'); this.audioName.textContent = this.audioTitle;
        this.progressBar = document.createElement('input'); this.progressBar.type = 'range'; this.progressBar.value = 0;
        this.progress.appendChild(this.progressBar); this.progress.appendChild(this.audioName);
        this.timer = document.createElement('span');
        this.volume = document.createElement('div'); this.volume.classList.add('volume');
        this.volumeInp = document.createElement('input'); this.volumeInp.type = 'range'; this.volumeInp.max = 100; this.volumeInp.value = 50;
        this.volumeTitle = document.createElement('span'); this.volumeTitle.textContent = 'Volume';
        this.delBtn = document.createElement('button'); this.delBtn.textContent = 'X';
        this.volume.appendChild(this.volumeInp); this.volume.appendChild(this.volumeTitle);
        this.wrapper.appendChild(this.goBack);
        this.wrapper.appendChild(this.startBtn);
        this.wrapper.appendChild(this.goForw);
        this.wrapper.appendChild(this.resetBtn);
        this.wrapper.appendChild(this.progress);
        this.wrapper.appendChild(this.timer);
        this.wrapper.appendChild(this.volume);
        this.wrapper.appendChild(this.delBtn);
    };
    initEvents() {
        this.initMetadata();
        this.startBtn.addEventListener('click', () => this.start());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.progressBar.addEventListener('input', () => this.control());
        this.delBtn.addEventListener('contextmenu', () => this.deleteAlert());
        this.delBtn.addEventListener('click', () => this.deleteConfirm());
        this.goBack.addEventListener('click', () => this.backward());
        this.goForw.addEventListener('click', () => this.forward());
        this.volumeInp.addEventListener('input', () => this.volumeCange());
    };
    initMetadata() {
        // если метаданные уже загружены
        if (this.audio.readyState > 0) {
            this.setupDuration();
        } else {
            // загрузка метаданных
            this.audio.addEventListener('loadedmetadata', () => this.setupDuration());
        }
    };

    setupDuration() {
        this.audioLen = this.calculateLen();
        this.timer.textContent = `00:00\n${this.audioLen}`;
        this.audio.addEventListener('timeupdate', () => this.changeTime());
    };
    start() {
        if (!this.isActive) {
            allTracks.forEach(f => f.stop());
            this.audio.play()
            this.startBtn.textContent = '⏸';
            this.isActive = true;
        } else {this.stop()};
    };
    reset() {
        if (this.isActive) {this.stop()};
        this.audio.currentTime = 0;
    };
    stop() {
        this.startBtn.textContent = '▶';
        this.audio.pause();
        this.isActive = false;
    };
    forward() {this.audio.currentTime += 5};
    backward() {this.audio.currentTime -= 5};
    deleteAlert() {
        event.preventDefault();
        if (!this.isDel) {
            this.delBtn.textContent = 'Sure?';
            this.isDel = true;
        } else {
            this.delBtn.textContent = 'X';
            this.isDel = false;
        };
    };
    deleteConfirm() {
        if (!this.isDel) {return};
        this.audio.currentTime = 0;
        this.audio.pause();
        URL.revokeObjectURL(this.audio.src);
        document.querySelector('.currentFolder').removeChild(this.wrapper);
        for (var i = 0; i < tracksData.length; i++) {
            if (tracksData[i].id === this.id) {allTracks.splice(i, 1); tracksData.splice(i, 1); break};
        }
        console.log(allTracks); console.log(tracksData.length);
        updateTracks(tracksData);
    };
    changeTime() {
        if (this.audio.currentTime === this.audio.duration) {this.audio.currentTime = 0; this.stop()};
        this.progressBar.value = this.audio.currentTime / this.audio.duration * 100;
        const mins = String(Math.floor(this.audio.currentTime / 60));
        const sec = String(Math.floor(this.audio.currentTime) - mins * 60);
        this.timer.textContent = `${mins.padStart(2, '0')}:${sec.padStart(2, '0')}\n${this.audioLen}`
    };
    volumeCange() {
        this.audio.volume = this.volumeInp.value / 100;
    };
    control() {
        //if (this.isActive) {this.stop()}; при попытке перемотки останавливает трек
        this.audio.currentTime = this.progressBar.value / 100 * this.audio.duration;
    };
};