const $ = document.querySelector.bind(document); 
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const muteBtn = $('#mute-btn');
const volumeSlider = $('#volume-slider');
const playlist = $('.playlist');


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    song: [
        { 
            name: 'Muộn rồi mà sao còn',
            singer: 'Sơn Tùng-MTP',
            path: './assets/music/Muộn Rồi Mà Sao Còn.mp3',
            image: './assets/img/Muộn rồi mà sao còn.jpg'
        },
        { 
            name: 'Chúng ta của hiện tại',
            singer: 'Sơn Tùng-MTP',
            path: './assets/music/Chúng Ta Của Hiện Tại.mp3',
            image: './assets/img/Chúng ta của hiện tại.jpg'
        },
        { 
            name: 'Có chắc yêu là đây',
            singer: 'Sơn Tùng-MTP',
            path: './assets/music/Có chắc yêu là đây.mp3',
            image: './assets/img/Có chắc yêu là đây.jpg'
        },
        { 
            name: 'Hãy trao cho anh',
            singer: 'Sơn Tùng-MTP',
            path: './assets/music/Hãy trao cho anh.mp3',
            image: './assets/img/Hãy trao cho anh.jpg'
        },
        { 
            name: 'Nơi này có anh',
            singer: 'Sơn Tùng-MTP',
            path: './assets/music/Nơi này có anh.mp3',
            image: './assets/img/Nơi này có anh.jpg'
        },
        { 
            name: 'Lạc trôi',
            singer: 'Sơn Tùng-MTP',
            path: './assets/music/Lạc trôi.mp3',
            image: './assets/img/Lạc trôi.jpg'
        },
        { 
            name: 'Chúng ta không thuộc về nhau',
            singer: 'Sơn Tùng-MTP',
            path: './assets/music/Chúng ta không thuộc về nhau.mp3',
            image: './assets/img/Chúng ta không thuộc về nhau.jpg'
        },
        { 
            name: 'Buông đôi tay nhau ra',
            singer: 'Sơn Tùng-MTP',
            path: './assets/music/Buông đôi tay nhau ra.mp3',
            image: './assets/img/Buông đôi tay nhau ra.jpg'
        },
        { 
            name: 'Âm thầm bên em',
            singer: 'Sơn Tùng-MTP',
            path: './assets/music/Âm thầm bên em.mp3',
            image: './assets/img/Âm thầm bên em.jpg'
        },
        { 
            name: 'Một năm mới bình an',
            singer: 'Sơn Tùng-MTP',
            path: './assets/music/Một năm mới bình an.mp3',
            image: './assets/img/Một năm mới bình an.jpg'
        },
        { 
            name: 'Chắc ai đó sẽ về',
            singer: 'Sơn Tùng-MTP',
            path: './assets/music/Chắc ai đó sẽ về.mp3',
            image: './assets/img/Chắc ai đó sẽ về.jpg'
        },
        { 
            name: 'Nắng ấm xa dần',
            singer: 'Sơn Tùng-MTP',
            path: './assets/music/Nắng ấm xa dần.mp3',
            image: './assets/img/Nắng ấm xa dần.jpg'
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    
    render: function (){
        const _this = this;
        const htmls = this.song.map(function(song,index) {  // viết declaration function thì phải đặt biến _this, còn arrow funct thì ghi luôn thisCurrentIndex
            return `
            <div class="song ${index === _this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {   // define property 'currentSong'
            get: function() {
                return this.song[this.currentIndex];
            }
        })
    },   

    handleEvent: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        console.log([cd])

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([    // animate trả về 1 đối tượng nên phải lưu vào biến.
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,  // 10 second
            iterations: Infinity   // quay vô cực
        })
        cdThumbAnimate.pause();

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop; // event keo' len keo' xuong
            const newCdWidth = cdWidth - scrollTop;
            console.log(newCdWidth);

            cd.style.width =  newCdWidth  > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Xử lý khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
            console.log(playBtn);
        }

        // Khi song được play 
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // Khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {   // audio.duration === Nan (trong clip co')
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100); // audio.currentTime: số giây nhạc hiện tại đang chạy
                progress.value = progressPercent;                                             // audio.duration: tổng số giây bài hát
                progress.style.background = 'linear-gradient(to right, #ec1f55 0%, #ec1f55 ' + progressPercent + '%, #d3d3d3 ' + progressPercent + '%, #d3d3d3 100%)'
            }
        }

        // Xử lý khi tua nhạc
        progress.oninput = function(e) {
            audio.pause();
            setTimeout(() => {
                audio.play();
            }, 500);
            const seek = audio.duration / 100 * e.target.value;  //e.target.value: % thanh tua.
            audio.currentTime = seek;
        }

        // Khi next song 
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.srcollToActiveSong();
        }

        // Khi prev song 
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.srcollToActiveSong();
        }

        // Xử lý bật / tắt random song 
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;   // đang false trở thành true
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // Xử lý lặp lại 1 bài hát
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // Xử lý next song khi audio ended
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();  // property này nó tự click
            }
        } 

        // Xử lý Mute / Unmute
        muteBtn.onclick = function (){
            if(audio.muted) {
                audio.muted = false;
                muteBtn.innerHTML = "Mute";
            } else {
                audio.muted = true;
                muteBtn.innerHTML = 'Unmute';
            }
        };

        // Xử lý tăng / giảm âm lượng
        volumeSlider.onchange = function(){
            audio.volume = volumeSlider.value / 100;  
        };     

        // Lắng nghe hành vi click vào playlist 
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')) {
                // Xử lý khi click vào bài hát
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // Xử lý khi click vào option của nhạc

            }
        }
    },

    srcollToActiveSong: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 250)
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;

        console.log(heading, cdThumb, audio);
    },
    
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.song.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.song.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.song.length);
        } while (newIndex === this.currentIndex);   // random tới khi nào kh trùng bài hiện tại thì out.

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function(){
        //  Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        // Định nghĩa các property cho Object
        this.defineProperties();

        // Lắng nghe và xử lý các event (DOM events)
        this.handleEvent();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render playlist
        this.render();

        // Hiện thị trạng trái ban đầu của button repeat và random
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}

app.start()
