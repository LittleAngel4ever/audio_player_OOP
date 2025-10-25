class MusicPlayer {
    constructor(songs) {
      this.songs = songs || []
      this.currentIndex = 0
      this.audio = document.getElementById("audio-player")
  
      this.bindControls()
      this.renderSongsList()
      this.setupVolume()
      this.resetTime()
      this.hideLyrics()
    }
  
    bindControls() {
      const playBtn = document.getElementById("play-btn")
      if (playBtn) playBtn.onclick = () => this.togglePlay()
  
      const prevBtn = document.getElementById("prev-btn")
      if (prevBtn) prevBtn.onclick = () => this.prevSong()
  
      const nextBtn = document.getElementById("next-btn")
      if (nextBtn) nextBtn.onclick = () => this.nextSong()
  
      const backBtn = document.getElementById("back-btn")
      if (backBtn) backBtn.onclick = () => this.returnToList()
  
      const textBtn = document.getElementById("text-btn")
      if (textBtn) textBtn.onclick = () => this.toggleLyricsPanel()
  
      const seekBar = document.getElementById("seek-bar")
      if (seekBar) {
        seekBar.oninput = e => {
          if (this.audio.duration) {
            const val = Number(e.target.value)
            this.audio.currentTime = (val / 100) * this.audio.duration
          }
        }
      }
    }
  
    renderSongsList() {
      const list = document.getElementById("music-items")
      if (!list) return
      list.innerHTML = ""
  
      if (!this.songs.length) {
        const empty = document.createElement("li")
        empty.textContent = "Нет песен"
        empty.style.color = "var(--spotify-text-muted)"
        list.appendChild(empty)
        return
      }
  
      this.songs.forEach((track, index) => {
        const li = document.createElement("li")
        li.innerHTML = `
          <img src="${track.cover || "assets/default_cover.png"}" alt="${track.title}" class="cover-thumb" />
          <span class="title-text">${track.title}</span>
        `
        li.onclick = () => this.loadSong(index)
        if (index === this.currentIndex) li.classList.add("active-item")
        list.appendChild(li)
      })
    }
  
    loadSong(index) {
      if (index < 0 || index >= this.songs.length) return
      this.currentIndex = index
      const track = this.songs[index]
  
      const musicList = document.getElementById("music-list")
      const playerBox = document.getElementById("player-box")
      if (musicList) musicList.style.display = "none"
      if (playerBox) playerBox.style.display = "block"
  
      const titleEl = document.getElementById("song-title")
      const artistEl = document.getElementById("song-artist")
      const coverEl = document.getElementById("album-cover")
  
      if (titleEl) titleEl.textContent = track.title
      if (artistEl) artistEl.textContent = track.artist || "Неизвестный исполнитель"
      if (coverEl) coverEl.src = track.cover || "assets/default_cover.png"
  
      // Audio setup
      this.audio.pause()
      this.audio.src = track.src
      this.audio.load()
  
      const playIcon = document.getElementById("play-symbol")
      if (playIcon) {
        playIcon.src = "assets/play.png"
        playIcon.alt = "Play"
      }
  
      const dl = document.getElementById("download-link")
      if (dl) dl.href = track.src
  
      // Lyrics
      const songTextEl = document.getElementById("song-text")
      if (songTextEl) {
        if (track.lyricsFile) {
          fetch(track.lyricsFile)
            .then(r => (r.ok ? r.text() : Promise.reject()))
            .then(text => (songTextEl.textContent = text))
            .catch(() => (songTextEl.textContent = "Song text not found."))
        } else {
          songTextEl.textContent = ""
        }
      }
  
      this.setProgress()
      this.renderSongsList()
    }
  
    togglePlay() {
      const icon = document.getElementById("play-symbol")
      if (this.audio.paused) {
        this.audio.play().then(() => {
          if (icon) {
            icon.src = "assets/pause.png"
            icon.alt = "Pause"
          }
        }).catch(() => {
          // Автовоспроизведение может быть заблокировано браузером без взаимодействия с пользователем
        })
      } else {
        this.audio.pause()
        if (icon) {
          icon.src = "assets/play.png"
          icon.alt = "Play"
        }
      }
    }
  
    prevSong() {
      if (!this.songs.length) return
      this.currentIndex = (this.currentIndex - 1 + this.songs.length) % this.songs.length
      this.loadSong(this.currentIndex)
    }
  
    nextSong() {
      if (!this.songs.length) return
      this.currentIndex = (this.currentIndex + 1) % this.songs.length
      this.loadSong(this.currentIndex)
    }
  
    returnToList() {
      const playerBox = document.getElementById("player-box")
      const musicList = document.getElementById("music-list")
      if (playerBox) playerBox.style.display = "none"
      if (musicList) musicList.style.display = "block"
      this.renderSongsList()
    }
  
    setProgress() {
      this.audio.ontimeupdate = () => {
        const progress = document.getElementById("seek-bar")
        const curTimeEl = document.getElementById("time-current")
        const totalTimeEl = document.getElementById("time-total")
  
        if (this.audio.duration && progress) {
          progress.value = (this.audio.currentTime / this.audio.duration) * 100
          if (curTimeEl) curTimeEl.textContent = this.formatTime(this.audio.currentTime)
          if (totalTimeEl) totalTimeEl.textContent = this.formatTime(this.audio.duration)
        }
      }
  
      this.audio.onended = () => this.nextSong()
    }
  
    setupVolume() {
      const volumeBar = document.getElementById("sound-bar")
      if (volumeBar) {
        this.audio.volume = (Number(volumeBar.value) || 80) / 100
        volumeBar.oninput = e => {
          this.audio.volume = Number(e.target.value) / 100
        }
      }
    }
  
    resetTime() {
      const cur = document.getElementById("time-current")
      const tot = document.getElementById("time-total")
      if (cur) cur.textContent = "0:00"
      if (tot) tot.textContent = "0:00"
    }
  
    hideLyrics() {
      const panel = document.getElementById("lyrics-panel")
      if (panel) panel.classList.remove("active")
    }
  
    toggleLyricsPanel() {
      const panel = document.getElementById("lyrics-panel")
      if (panel) panel.classList.toggle("active")
    }
  
    formatTime(seconds) {
      const minutes = Math.floor((seconds || 0) / 60)
      const secs = Math.floor((seconds || 0) % 60)
      return `${minutes}:${secs < 10 ? "0" : ""}${secs}`
    }
  }
  
  /* ====== Исходные песни (остаются) ====== */
  let songs = [
    {title: "Шёлк", src: "songs/shelk.mp3", cover: "covers_of_songs/shelc.jpg", lyricsFile: "texts/shelc.txt", artist: "Ваня Дмитриенко"},
    {title: "Настоящая", src: "songs/nastoyshay.mp3", cover: "covers_of_songs/nastoyashay.jpg", lyricsFile: "texts/nastoyashay.txt", artist: "Ваня Дмитриенко"},
    {title: "Стерва", src: "songs/sterva.mp3", cover: "covers_of_songs/sterva.jpg", lyricsFile: "texts/sterva.txt", artist: "Ваня Дмитриенко"},
    {title: "Венера-Юпитер", src: "songs/venera-upiter.mp3", cover: "covers_of_songs/venera-upiter.jpg", lyricsFile: "texts/venera-upiter.txt", artist: "Ваня Дмитриенко"}
  ]
  
  let player = null
  
  /* ====== Инициализация и модалка (добавление любых песен из сети) ====== */
  window.onload = () => {
    player = new MusicPlayer(songs)
  
    const modal = document.getElementById("modal")
    const openBtn = document.getElementById("create-player-btn")
    const closeBtn = document.getElementById("close-modal-btn")
    const addBtn = document.getElementById("add-song-btn")
  
    const titleInput = document.getElementById("song-title-input")
    const srcInput = document.getElementById("song-src-input")
    const coverInput = document.getElementById("song-cover-input")
    const lyricsInput = document.getElementById("song-lyrics-input")
  
    if (openBtn) {
      openBtn.onclick = () => {
        if (modal) modal.style.display = "flex"
        if (titleInput) titleInput.value = ""
        if (srcInput) srcInput.value = ""
        if (coverInput) coverInput.value = ""
        if (lyricsInput) lyricsInput.value = ""
      }
    }
  
    if (closeBtn) {
      closeBtn.onclick = () => {
        if (modal) modal.style.display = "none"
      }
    }
  
    if (addBtn) {
      addBtn.onclick = () => {
        const title = (titleInput?.value || "").trim()
        const src = (srcInput?.value || "").trim()
        const cover = (coverInput?.value || "").trim()
        const lyricsFile = (lyricsInput?.value || "").trim()
  
        if (!title || !src) {
          alert("Введите хотя бы название и ссылку на mp3")
          return
        }
  
        // Нормализуем URL: убираем кавычки и пробелы по краям
        const normalizedSrc = src.replace(/^"+|"+$/g, "").trim()
        const normalizedCover = cover.replace(/^"+|"+$/g, "").trim()
        const normalizedLyrics = lyricsFile.replace(/^"+|"+$/g, "").trim()
  
        // Добавление новой песни
        const newSong = {
          title,
          src: normalizedSrc,
          cover: normalizedCover || "assets/default_cover.png",
          lyricsFile: normalizedLyrics || "",
          artist: "Пользователь"
        }
        songs.push(newSong)
  
        // Обновляем существующий плеер без пересоздания
        player.songs = songs
        player.renderSongsList()
  
        // Закрываем модалку и показываем список
        if (modal) modal.style.display = "none"
        const playerBox = document.getElementById("player-box")
        const musicList = document.getElementById("music-list")
        if (playerBox) playerBox.style.display = "none"
        if (musicList) musicList.style.display = "block"
      }
    }
  
    // Закрытие модалки по клику на подложку
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none"
      })
    }
  }
  