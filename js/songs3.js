console.log("Java Script for Songs");
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    try {
        currFolder = folder;
        let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
        let response = await a.text();

        // Parse the HTML response
        let div = document.createElement("div");
        div.innerHTML = response;
        let as = div.getElementsByTagName("a");

        songs = [];
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
                songs.push(decodeURIComponent(element.href.split(`/${folder}/`)[1]));
            }
        }

    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];
    }

    // Show all the songs in the playlist
    let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML += `
            <li> 
                <img src="img/music.svg" alt="">
                <div class="info">
                    <div>${song.replace(".mp3", "")}</div>
                    <div>Matt</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img src="img/play.svg" alt="">
                </div> 
            </li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            let trackName = e.querySelector(".info").firstElementChild.innerHTML.trim() + ".mp3";
            console.log("Playing:", trackName);
            playMusic(trackName);
        });
    });

    return songs;
}

const playMusic = (track, pause = false) => {
    // Ensure the track name is sanitized and properly encoded
    currentSong.src = `/${currFolder}/` + encodeURIComponent(track.trim());
    if (!pause) {
        currentSong.play().catch(err => console.error("Playback error:", err));
        // Replace the play button with the pause SVG
        play.innerHTML = `<svg width="60px" height="60px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
     <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
     <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
     <g id="SVGRepo_iconCarrier">
         <path fill-rule="evenodd" clip-rule="evenodd" d="M9 7C9 6.44772 8.55228 6 8 6C7.44772 6 7 6.44772 7 7V17C7 17.5523 7.44772 18 8 18C8.55228 18 9 17.5523 9 17V7ZM17 7C17 6.44772 16.5523 6 16 6C15.4477 6 15 6.44772 15 7V17C15 17.5523 15.4477 18 16 18C16.5523 18 17 17.5523 17 17V7Z"></path>
     </g>
 </svg>`;
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
};

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/SpotifySongs/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;



    let anchors = div.getElementsByTagName("a");

    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];


        if (e.href.includes("/SpotifySongs/")) {
            let folder = e.href.split("/SpotifySongs/").slice(-1)[0]

            // Get metadata of the folder
            let a = await fetch(`http://127.0.0.1:5500/SpotifySongs/${folder}/info.json`)
            let response = await a.json();
            console.log(response);
            let artistlist = document.querySelector(".artists-list");
            artistlist.innerHTML = artistlist.innerHTML + `<div data-folder="${folder}" class="artist card-filter">
                        <img src="/SpotifySongs/${folder}/songimg.webp" alt="">
                        <a class="art-link" href="#"><span class="name">${response.title}</span></a>
                        <span class="role">${response.description}</span>
                    </div>`
        }
    }

    // Load playlist when click on the artist
    Array.from(document.getElementsByClassName("artist")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`SpotifySongs/${item.currentTarget.dataset.folder}`);
            if (songs.length > 0) {
                playMusic(songs[0], true);
            }
        })
    })
}

async function main() {
    // Get the list of the songs
    await getSongs("SpotifySongs/esong");
    playMusic(songs[0], true)

    // Dsiplay all the albums on the page
    displayAlbums();

    // Attach an event listener to play, previous, next
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.innerHTML = `<svg width="65px" height="65px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M9 7C9 6.44772 8.55228 6 8 6C7.44772 6 7 6.44772 7 7V17C7 17.5523 7.44772 18 8 18C8.55228 18 9 17.5523 9 17V7ZM17 7C17 6.44772 16.5523 6 16 6C15.4477 6 15 6.44772 15 7V17C15 17.5523 15.4477 18 16 18C16.5523 18 17 17.5523 17 17V7Z"></path>
                            </g>
                        </svg>`;
        } else {
            currentSong.pause();
            play.innerHTML = `<svg height="60px" width="60px" version="1.1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60" xml:space="preserve">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <g>
                        <path
                            d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30 c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15 C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z">
                        </path>
                        <path
                            d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30 S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z">
                        </path>
                    </g>
                </g>
            </svg>`;
        }
    });

    // Listen for time update event listener
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    // Modified previous button event listener
    previous.addEventListener("click", () => {
        if (!songs || !currFolder) {
            console.error("No songs or folder selected.");
            return;
        }

        const currentSongName = decodeURIComponent(currentSong.src.split(`/${currFolder}/`)[1]);
        let index = songs.indexOf(currentSongName);

        // If song not found in playlist or it's the first song
        if (index === -1) {
            index = 0;
        } else if (index === 0) {
            index = songs.length - 1;  // Go to last song
        } else {
            index = index - 1;  // Go to previous song
        }

        playMusic(songs[index]);
    });

    // Modified next button event listener
    next.addEventListener("click", () => {
        if (!songs || !currFolder) {
            console.error("No songs or folder selected.");
            return;
        }

        const currentSongName = decodeURIComponent(currentSong.src.split(`/${currFolder}/`)[1]);
        let index = songs.indexOf(currentSongName);

        // If song not found in playlist or it's the last song
        if (index === -1 || index === songs.length - 1) {
            index = 0;  // Go to first song
        } else {
            index = index + 1;  // Go to next song
        }

        playMusic(songs[index]);
    });


}

// Start the application
main();