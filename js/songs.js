console.log("Java Script for Songs");
let currentSong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid Input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;

}

async function getSongs() {
    try {
        let a = await fetch("http://127.0.0.1:5500/SpotifySongs/");
        let response = await a.text();

        // Parse the HTML response
        let div = document.createElement("div");
        div.innerHTML = response;
        let as = div.getElementsByTagName("a");

        let songs = [];
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
                songs.push(decodeURIComponent(element.href.split("/SpotifySongs/")[1]));
            }
        }
        return songs;
    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];
    }
}

const playMusic = (track, pause = false) => {
    // Ensure the track name is sanitized and properly encoded
    currentSong.src = "/SpotifySongs/" + encodeURIComponent(track.trim());
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

async function main() {
    // Get the list of the songs
    songs = await getSongs();
    // console.log(songs);
    playMusic(songs[0], true)

    // Show all the songs in the playlist
    let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML += `
            <li> 
                <img src="music.svg" alt="">
                <div class="info">
                    <div>${song.replace(".mp3", "")}</div>
                    <div>Matt</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img src="play.svg" alt="">
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

    // Attach an event listener to play, previous, next
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();

            // Replace the play button with the pause SVG
            play.innerHTML = `<svg width="65px" height="65px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M9 7C9 6.44772 8.55228 6 8 6C7.44772 6 7 6.44772 7 7V17C7 17.5523 7.44772 18 8 18C8.55228 18 9 17.5523 9 17V7ZM17 7C17 6.44772 16.5523 6 16 6C15.4477 6 15 6.44772 15 7V17C15 17.5523 15.4477 18 16 18C16.5523 18 17 17.5523 17 17V7Z"></path>
                            </g>
                        </svg>`;
        } else {
            currentSong.pause();

            // Replace the pause button with the play SVG
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

    // Listen for time update even listener
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    // Add event listener to previous
previous.addEventListener("click", () => {
    console.log("Previous clicked");
    console.log(currentSong);

    // Get the current song's filename (e.g., "song1.mp3")
    let currentSongFile = decodeURIComponent(currentSong.src.split("/SpotifySongs/")[1]);

    // Find the current song's index in the songs array
    let index = songs.indexOf(currentSongFile);
    
    // Check if there is a previous song
    if (index > 0) {
        console.log("Playing previous song:", songs[index - 1]);
        playMusic(songs[index - 1]);
    } else {
        console.log("No previous song available.");
    }
});

// Add event listener to next
next.addEventListener("click", () => {
    console.log("Next clicked");

    // Get the current song's filename (e.g., "song1.mp3")
    let currentSongFile = decodeURIComponent(currentSong.src.split("/SpotifySongs/")[1]);

    // Find the current song's index in the songs array
    let index = songs.indexOf(currentSongFile);

    // Check if there is a next song
    if (index + 1 < songs.length) {
        console.log("Playing next song:", songs[index + 1]);
        playMusic(songs[index + 1]);
    } else {
        console.log("No next song available.");
    }
});

}

// Start the application
main();
