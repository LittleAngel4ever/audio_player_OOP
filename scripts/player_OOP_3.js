class MusicPlayer {
  constructor(container, songs) {
    this.container = container
    this.songs = songs
    this.currentIndex = 0
    this.audio = container.querySelector(".audio-player")

    this.init()
  }

  init() {
    this.renderSongsList()
    this.setupVolume()
    this.resetTime()
    this.hideLyrics()

    // кнопки
    this.container.querySelector(".play-btn").onclick = () => this.togglePlay()
    this.container.querySelector(".prev-btn").onclick = () => this.prevSong()
    this.container.querySelector(".next-btn").onclick = () => this.nextSong()
    this.container.querySelector(".back-btn").onclick = () => this.returnToList()
    this.container.querySelector(".text-btn").onclick = () => this.toggleLyricsPanel()
  }

  renderSongsList() {
    const list = this.container.querySelector(".music-items")
    list.innerHTML = ""
    this.songs.forEach((track, index) => {
      const li = document.createElement("li")
      li.innerHTML = `<img src="${track.cover}" class="cover-thumb"><span>${track.title}</span>`
      li.onclick = () => this.loadSong(index)
      if (index === this.currentIndex) li.classList.add("active-item")
      list.appendChild(li)
    })
  }

  loadSong(index) {
    this.currentIndex = index
    const track = this.songs[index]

    this.container.querySelector(".music-list").style.display = "none"
    this.container.querySelector(".player-box").style.display = "block"
    this.container.querySelector(".song-title").textContent = track.title
    this.container.querySelector(".album-cover").src = track.cover

    this.audio.pause()
    this.audio.src = track.src
    this.audio.load()

    this.container.querySelector(".play-symbol").src = "assets/play.png"
    this.container.querySelector(".download-link").href = track.src

    fetch(track.lyricsFile)
      .then(r => r.ok ? r.text() : Promise.reject())
      .then(text => this.container.querySelector(".song-text").textContent = text)
      .catch(() => this.container.querySelector(".song-text").textContent = "Song text not found.")

    this.setProgress()
    this.renderSongsList()
  }

  togglePlay() {
    const icon = this.container.querySelector(".play-symbol")
    if (this.audio.paused) {
      this.audio.play().then(() => {
        icon.src = "assets/pause.png"
      })
    } else {
      this.audio.pause()
      icon.src = "assets/play.png"
    }
  }

  prevSong() {
    this.currentIndex = (this.currentIndex - 1 + this.songs.length) % this.songs.length
    this.loadSong(this.currentIndex)
  }

  nextSong() {
    this.currentIndex = (this.currentIndex + 1) % this.songs.length
    this.loadSong(this.currentIndex)
  }

  returnToList() {
    this.container.querySelector(".player-box").style.display = "none"
    this.container.querySelector(".music-list").style.display = "block"
    this.renderSongsList()
  }

  setProgress() {
    const progress = this.container.querySelector(".seek-bar")
    const curTimeEl = this.container.querySelector(".time-current")
    const totalTimeEl = this.container.querySelector(".time-total")

    this.audio.ontimeupdate = () => {
      if (this.audio.duration) {
        progress.value = (this.audio.currentTime / this.audio.duration) * 100
        curTimeEl.textContent = this.formatTime(this.audio.currentTime)
        totalTimeEl.textContent = this.formatTime(this.audio.duration)
      }
    }

    progress.oninput = e => {
      if (this.audio.duration) {
        this.audio.currentTime = (e.target.value / 100) * this.audio.duration
      }
    }

    this.audio.onended = () => this.nextSong()
  }

  setupVolume() {
    const volumeBar = this.container.querySelector(".sound-bar")
    this.audio.volume = (volumeBar.value || 80) / 100
    volumeBar.oninput = e => {
      this.audio.volume = e.target.value / 100
    }
  }

  resetTime() {
    this.container.querySelector(".time-current").textContent = "0:00"
    this.container.querySelector(".time-total").textContent = "0:00"
  }

  hideLyrics() {
    this.container.querySelector(".lyrics-panel").classList.remove("active")
  }

  toggleLyricsPanel() {
    this.container.querySelector(".lyrics-panel").classList.toggle("active")
  }

  formatTime(seconds) {
    const minutes = Math.floor((seconds || 0) / 60)
    const secs = Math.floor((seconds || 0) % 60)
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`
  }
}

const songs1 = [
  {title: "Шёлк", src: "songs/shelk.mp3", cover: "covers_of_songs/shelc.jpg", lyricsFile: "texts/shelc.txt"},
  {title: "Настоящая", src: "songs/nastoyshay.mp3", cover: "covers_of_songs/nastoyashay.jpg", lyricsFile: "texts/nastoyashay.txt"}
]

const songs2 = [
  {title: "Стерва", src: "songs/sterva.mp3", cover: "covers_of_songs/sterva.jpg", lyricsFile: "texts/sterva.txt"},
  {title: "Венера-Юпитер", src: "songs/venera-upiter.mp3", cover: "covers_of_songs/venera-upiter.jpg", lyricsFile: "texts/venera-upiter.txt"}
]



window.onload = () => {
  new MusicPlayer(document.getElementById("player1"), songs1)
  new MusicPlayer(document.getElementById("player2"), songs2)
}
