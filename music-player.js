const player = {
    NEXT: 1,
    PREV: -1,

    // Get DOM elements
    playlist: document.querySelector(".playlist"),
    songTitle: document.querySelector(".song-title"),
    audio: document.querySelector("#audio"),
    togglePlayBtn: document.querySelector(".btn-toggle-play"),
    playIcon: document.querySelector("#play-icon"),
    btnNext: document.querySelector(".btn-next"),
    btnPrev: document.querySelector(".btn-prev"),
    progress: document.querySelector("#progress"),
    repeatBtn: document.querySelector(".btn-repeat"),
    cd: document.querySelector(".cd"),
    shuffleBtn: document.querySelector(".btn-random"),
    cdThumb: document.querySelector(".cd-thumb"),

    isSeeking: false, // Biến kiểm tra xem có đang tua hay không
    isRepeat: localStorage.getItem("isRepeat") === "true",
    isShuffle: localStorage.getItem("isShuffle") === "true",

    shuffleBag: [], // Chứa chỉ mục các song chưa phát khi bật shuffle

    // Mảng chứa các bài hát
    songs: [
        {
            id: 1,
            name: "GÃ SĂN CÁ",
            path: "./assets/musics/GÃ SĂN CÁ.mp3",
            artist: "Lâm Bảo Ngọc",
            image: "./assets/img/img-song-1.jpg",
        },
        {
            id: 2,
            name: "Kho Báu (with Rhymastic)",
            path: "./assets/musics/Kho Báu (with Rhymastic).mp3",
            artist: "(S)TRONG, Rhymastic",
            image: "./assets/img/img-song-2.jpg",
        },
        {
            id: 3,
            name: "Mất Kết Nối",
            path: "./assets/musics/Mất Kết Nối.mp3",
            artist: "Dương Domic",
            image: "./assets/img/img-song-3.jpg",
        },
        {
            id: 4,
            name: "Anh Đã Không Biết Cách Yêu Em",
            path: "./assets/musics/Anh Đã Không Biết Cách Yêu Em.mp3",
            artist: "Quang Đăng Trần",
            image: "./assets/img/img-song-4.jpg",
        },
        {
            id: 5,
            name: "Ngày Này Năm Ấy",
            path: "./assets/musics/Ngày Này Năm Ấy.mp3",
            artist: "Việt Anh",
            image: "./assets/img/img-song-5.jpg",
        },
        {
            id: 6,
            name: "NGƯỜI ĐẦU TIÊN",
            path: "./assets/musics/NGƯỜI ĐẦU TIÊN.mp3",
            artist: "Juky San",
            image: "./assets/img/img-song-6.jpg",
        },
        {
            id: 7,
            name: "Nỗi Đau Giữa Hòa Bình",
            path: "./assets/musics/Nỗi Đau Giữa Hòa Bình.mp3",
            artist: "Hòa Minzy, Nguyễn Văn Chung",
            image: "./assets/img/img-song-7.jpg",
        },
    ],
    // Chỉ mục song hiện tại
    currentIndex: 0,
    // Lấy song hiện tại
    getCurrentSong() {
        return this.songs[this.currentIndex];
    },
    // Step: 1
    loadCurrentSong() {
        // Tải song hiện tại
        const currentSong = this.getCurrentSong();
        // Hiển thị tên song hiện tại
        this.songTitle.textContent = currentSong.name;
        // Đặt src của thẻ audio thành đường dẫn song hiện tại
        this.audio.src = currentSong.path;

        // Đổi ảnh đĩa CD theo bài
        this.cdThumb.style.backgroundImage = `url('${currentSong.image}')`;
    },

    // Xáo trộn mảng
    shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    // Nạp lại shuffleBag: chứa mọi index ngoại trừ excludeIndex
    refillShuffleBag(excludeIndex = this.currentIndex) {
        const n = this.songs.length;
        this.shuffleBag = [];
        for (let i = 0; i < n; i++) {
            if (i !== excludeIndex) this.shuffleBag.push(i);
        }
        this.shuffleArray(this.shuffleBag);
    },

    // Rút 1 bài ngẫu nhiên từ túi; nếu hết thì nạp lại
    drawFromShuffleBag() {
        if (this.songs.length <= 1) return this.currentIndex;
        if (this.shuffleBag.length === 0) {
            this.refillShuffleBag();
        }
        return this.shuffleBag.pop();
    },

    // Nhảy tới index cụ thể
    goTo(index) {
        this.currentIndex = index;
        this.loadCurrentSong();
        this.render();
        this.audio.play();
    },

    // Step: 3
    handlePrevOrNext(step) {
        // Shuffle bật: prev/next đều rút ngẫu nhiên từ túi, không theo thứ tự
        if (this.isShuffle) {
            const nextIndex = this.drawFromShuffleBag();
            this.goTo(nextIndex);
            return;
        }

        // Shuffle tắt: giữ logic vòng lặp như cũ
        this.currentIndex =
            (this.currentIndex + step + this.songs.length) % this.songs.length;
        this.loadCurrentSong();
        this.render();
        this.audio.play();
    },

    init() {
        // Step: 2
        this.loadCurrentSong();

        // Xử lý sự kiện DOM

        // Xử lý click button play/pause
        this.togglePlayBtn.addEventListener("click", () => {
            // Nếu đang paused thì play
            if (this.audio.paused) {
                this.audio.play();
            }
            // Đang play thì pause
            else {
                this.audio.pause();
            }
        });

        // Đổi icon thành pause khi song play
        this.audio.addEventListener("play", () => {
            this.playIcon.classList.remove("fa-play");
            this.playIcon.classList.add("fa-pause");

            this.cd.classList.add("playing");
            this.cd.style.animationPlayState = "running";
        });

        // Đổi icon thành play khi song paused
        this.audio.addEventListener("pause", () => {
            this.playIcon.classList.remove("fa-pause");
            this.playIcon.classList.add("fa-play");

            this.cd.style.animationPlayState = "paused";
        });

        // Step: 4
        this.btnNext.addEventListener("click", () => {
            this.handlePrevOrNext(this.NEXT); // Xử lý next
        });

        this.btnPrev.addEventListener("click", () => {
            if (this.audio.currentTime > 2) {
                this.audio.currentTime = 0;
            } else {
                this.handlePrevOrNext(this.PREV); // Xử lý prev
            }
        });

        this.audio.addEventListener("timeupdate", () => {
            const { duration, currentTime } = this.audio;
            if (!duration || this.isSeeking) return;

            this.progress.value = Math.round((currentTime / duration) * 100);
        });

        this.progress.addEventListener("mousedown", () => {
            this.isSeeking = true;
        });

        this.progress.addEventListener("mouseup", (e) => {
            this.isSeeking = false;
            const nextProgress = e.target.value;
            const nextDuration = (nextProgress / 100) * this.audio.duration;
            this.audio.currentTime = nextDuration;
        });

        this.audio.addEventListener("ended", () => {
            if (this.isRepeat) {
                this.audio.play();
            } else {
                this.handlePrevOrNext(this.NEXT);
            }
        });

        this.repeatBtn.addEventListener("click", () => {
            this.isRepeat = !this.isRepeat;
            this.repeatBtn.classList.toggle("active", this.isRepeat);
            localStorage.setItem("isRepeat", this.isRepeat);
        });

        // Toggle Shuffle
        this.shuffleBtn.addEventListener("click", () => {
            this.isShuffle = !this.isShuffle;
            this.shuffleBtn.classList.toggle("active", this.isShuffle);
            localStorage.setItem("isShuffle", this.isShuffle);

            // Mỗi lần bật shuffle, nạp túi mới loại trừ bài hiện tại
            if (this.isShuffle) {
                this.refillShuffleBag(this.currentIndex);
            } else {
                // Tắt shuffle thì xoá túi cho gọn
                this.shuffleBag = [];
            }
        });

        // Render danh sách songs
        this.render();

        // Cập nhật trạng thái các nút repeat, shuffle
        this.repeatBtn.classList.toggle("active", this.isRepeat);
        this.shuffleBtn.classList.toggle("active", this.isShuffle);
        if (this.isShuffle) this.refillShuffleBag(this.currentIndex);

        // Click playlist để phát bài tương ứng
        this.playlist.addEventListener("click", (e) => {
            const songEl = e.target.closest(".song");
            if (!songEl) return;

            const index = +songEl.dataset.index;
            this.goTo(index);
            if (this.isShuffle) this.refillShuffleBag(this.currentIndex);
        });
    },
    render() {
        function escapeHTML(str) {
            const div = document.createElement("div");
            div.textContent = str;
            return div.innerHTML;
        }

        const html = this.songs
            .map(
                (song, index) => `<div class="song ${
                    this.currentIndex === index ? "active" : ""
                }" data-index="${index}">
            <div
                class="thumb"
                style="background-image: url('${song.image}');"
            ></div>
            <div class="body">
                <h3 class="title">${escapeHTML(song.name)}</h3>
                <p class="author">${escapeHTML(song.artist)}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`
            )
            .join("");
        this.playlist.innerHTML = html;
    },
};

// Khởi tạo player
player.init();
