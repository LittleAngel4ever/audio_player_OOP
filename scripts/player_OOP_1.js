/*======== OBJECT ======== */

const songs = [
  {title: "Шёлк", src: "songs/shelk.mp3", cover: "covers_of_songs/shelc.jpg", lyricsFile: "texts/shelc.txt"},
  {title: "Настоящая", src: "songs/nastoyshay.mp3", cover: "covers_of_songs/nastoyashay.jpg", lyricsFile: "texts/nastoyashay.txt"},
  {title: "Стерва", src: "songs/sterva.mp3", cover: "covers_of_songs/sterva.jpg", lyricsFile: "texts/sterva.txt"},
  {title: "Венера-Юпитер", src: "songs/venera-upiter.mp3", cover: "covers_of_songs/venera-upiter.jpg", lyricsFile: "texts/venera-upiter.txt"}
]

const player = {
  songs: songs,
  currentIndex: 0,
  audio: null,

  init() {
    this.audio = document.getElementById("audio-player")
    this.renderSongsList()
    this.setupVolume()
    this.resetTime()
    this.hideLyrics()
  },

  renderSongsList() {
    const list = document.getElementById("music-items")
    if (!list) return
    list.innerHTML = ""

    this.songs.forEach((track, index) => {
      const li = document.createElement("li")
      li.innerHTML = `<img src="${track.cover}" alt="${track.title}" class="cover-thumb" />
                      <span class="title-text">${track.title}</span>`
      li.onclick = () => this.loadSong(index)
      if (index === this.currentIndex) li.classList.add("active-item")
      list.appendChild(li)
    })
  },

  loadSong(index) {
    this.currentIndex = index
    const track = this.songs[index]

    document.getElementById("music-list").style.display = "none"
    document.getElementById("player-box").style.display = "block"
    document.getElementById("song-title").textContent = track.title
    document.getElementById("song-artist").textContent = "Ваня Дмитриенко"
    document.getElementById("album-cover").src = track.cover

    this.audio.pause()
    this.audio.src = track.src
    this.audio.load()

    const playIcon = document.getElementById("play-symbol")
    playIcon.src = "assets/play.png"
    playIcon.alt = "Play"

    document.getElementById("download-link").href = track.src

    fetch(track.lyricsFile)
      .then(r => r.ok ? r.text() : Promise.reject())
      .then(text => document.getElementById("song-text").textContent = text)
      .catch(() => document.getElementById("song-text").textContent = "Song text not found.")

    this.setProgress()
    this.renderSongsList()
  },

  togglePlay() {
    const icon = document.getElementById("play-symbol")
    if (this.audio.paused) {
      this.audio.play().then(() => {
        icon.src = "assets/pause.png"
        icon.alt = "Pause"
      }).catch(() => {})
    } else {
      this.audio.pause()
      icon.src = "assets/play.png"
      icon.alt = "Play"
    }
  },

  prevSong() {
    this.currentIndex = (this.currentIndex - 1 + this.songs.length) % this.songs.length
    this.loadSong(this.currentIndex)
  },

  nextSong() {
    this.currentIndex = (this.currentIndex + 1) % this.songs.length
    this.loadSong(this.currentIndex)
  },

  returnToList() {
    document.getElementById("player-box").style.display = "none"
    document.getElementById("music-list").style.display = "block"
    this.renderSongsList()
  },

  setProgress() {
    this.audio.ontimeupdate = () => {
      const progress = document.getElementById("seek-bar")
      const curTimeEl = document.getElementById("time-current")
      const totalTimeEl = document.getElementById("time-total")

      if (this.audio.duration && progress) {
        progress.value = (this.audio.currentTime / this.audio.duration) * 100
        curTimeEl.textContent = this.formatTime(this.audio.currentTime)
        totalTimeEl.textContent = this.formatTime(this.audio.duration)
      }
    }

    const progressBar = document.getElementById("seek-bar")
    if (progressBar) {
      progressBar.oninput = e => {
        if (this.audio.duration) {
          this.audio.currentTime = (e.target.value / 100) * this.audio.duration
        }
      }
    }

    this.audio.onended = () => this.nextSong()
  },

  setupVolume() {
    const volumeBar = document.getElementById("sound-bar")
    if (volumeBar) {
      this.audio.volume = (volumeBar.value || 80) / 100
      volumeBar.oninput = e => {
        this.audio.volume = e.target.value / 100
      }
    }
  },

  resetTime() {
    document.getElementById("time-current").textContent = "0:00"
    document.getElementById("time-total").textContent = "0:00"
  },

  hideLyrics() {
    const panel = document.getElementById("lyrics-panel")
    if (panel) panel.classList.remove("active")
  },

  toggleLyricsPanel() {
    const panel = document.getElementById("lyrics-panel")
    if (panel) panel.classList.toggle("active")
  },

  formatTime(seconds) {
    const minutes = Math.floor((seconds || 0) / 60)
    const secs = Math.floor((seconds || 0) % 60)
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`
  }
}


window.onload = () => {
  player.init()

  document.getElementById("play-btn").onclick = () => player.togglePlay()
  document.querySelector(".controls button:nth-child(1)").onclick = () => player.prevSong()
  document.querySelector(".controls button:nth-child(3)").onclick = () => player.nextSong()
  document.getElementById("back-btn").onclick = () => player.returnToList()
  document.getElementById("text-btn").onclick = () => player.toggleLyricsPanel()
}
