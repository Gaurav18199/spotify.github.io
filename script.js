// Initialize the Variables
let songIndex = 0;
let audioElement = new Audio('songs/1.mp3');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let currentTimeDisplay = document.getElementById('currentTime');
let totalDurationDisplay = document.getElementById('totalDuration');
let songItems = Array.from(document.getElementsByClassName('songItem'));

let songs = [
    { songName: "Sadness and sorrow Naruto", filePath: "songs/1.mp3", coverPath: "img/cover1.jpg" },
    { songName: "Shootout", filePath: "songs/2.mp3", coverPath: "img/cover2.jpg" },
    { songName: "Another Love", filePath: "songs/3.mp3", coverPath: "img/cover3.jpg" },
    { songName: "Somewhere only we know", filePath: "songs/4.mp3", coverPath: "img/cover4.jpg" },
    { songName: "Memory robot", filePath: "songs/5.mp3", coverPath: "img/cover5.jpg" },
    { songName: "Night call", filePath: "songs/6.mp3", coverPath: "img/cover6.jpg" },
];

// Update song item details
songItems.forEach((element, i) => {
    element.getElementsByTagName('img')[0].src = songs[i].coverPath; // Set cover image
    element.getElementsByClassName("songName")[0].innerText = songs[i].songName;
});

// Handle play/pause click
masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        masterPlay.classList.replace('fa-circle-play', 'fa-circle-pause');
        gif.style.opacity = 1;
    } else {
        audioElement.pause();
        masterPlay.classList.replace('fa-circle-pause', 'fa-circle-play');
        gif.style.opacity = 0;
    }
});

// Function to format time in minutes and seconds
const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Update song time and duration display
audioElement.addEventListener('timeupdate', () => {
    let progress = (audioElement.currentTime / audioElement.duration) * 100;
    myProgressBar.value = progress;

    currentTimeDisplay.innerText = formatTime(audioElement.currentTime);
    if (!isNaN(audioElement.duration)) {
        totalDurationDisplay.innerText = formatTime(audioElement.duration);
    }
});

// Seek to specific time in song when progress bar is clicked
myProgressBar.addEventListener('click', (e) => {
    const progressBarWidth = myProgressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = audioElement.duration;
    audioElement.currentTime = (clickX / progressBarWidth) * duration;
});

// Play song when clicking play icon in song list
const makeAllPlays = () => {
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
        element.classList.replace('fa-circle-pause', 'fa-circle-play');
    });
}

Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
    element.addEventListener('click', (e) => {
        makeAllPlays();
        songIndex = parseInt(e.target.id);
        e.target.classList.replace('fa-circle-play', 'fa-circle-pause');
        audioElement.src = songs[songIndex].filePath;
        masterSongName.innerText = songs[songIndex].songName;
        audioElement.currentTime = 0;
        audioElement.play();
        gif.style.opacity = 1;
        masterPlay.classList.replace('fa-circle-play', 'fa-circle-pause');
    });
});

// Next and Previous functionality
document.getElementById('next').addEventListener('click', () => {
    songIndex = (songIndex >= songs.length - 1) ? 0 : songIndex + 1;
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.replace('fa-circle-play', 'fa-circle-pause');
});

document.getElementById('previous').addEventListener('click', () => {
    songIndex = (songIndex <= 0) ? 0 : songIndex - 1;
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.replace('fa-circle-play', 'fa-circle-pause');
});

// Search Functionality
document.getElementById('searchBar').addEventListener('input', function() {
    let query = this.value.toLowerCase();
    songItems.forEach((element, i) => {
        let songName = songs[i].songName.toLowerCase();
        element.style.display = songName.includes(query) ? 'flex' : 'none';
    });
});

// Handle song upload
document.getElementById('songUpload').addEventListener('change', function(event) {
    let file = event.target.files[0];
    
    if (file && file.type.startsWith('audio/')) { // Check if the file is an audio file
        let songURL = URL.createObjectURL(file);
        let songName = file.name.split('.').slice(0, -1).join('.');

        // Add the new song to the songs array
        songs.push({songName: songName, filePath: songURL, coverPath: 'img/default-cover.jpg'});

        // Create a new song item in the playlist
        let newSongItem = document.createElement('div');
        newSongItem.classList.add('songItem');
        newSongItem.innerHTML = `
            <img src="img/default-cover.jpg" alt="${songName}">
            <span class="songName">${songName}</span>
            <span class="timestamp">
                <i class="fa fa-play-circle songItemPlay" id="${songs.length - 1}"></i>
            </span>
        `;

        // Append new song to the song list
        document.querySelector('.songItemContainer').appendChild(newSongItem);

        // Update the songItems array
        songItems = Array.from(document.getElementsByClassName('songItem'));

        // Play the newly uploaded song on click
        Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
            element.addEventListener('click', (e) => {
                makeAllPlays();
                songIndex = parseInt(e.target.id);
                e.target.classList.replace('fa-circle-play', 'fa-circle-pause');
                audioElement.src = songs[songIndex].filePath;
                masterSongName.innerText = songs[songIndex].songName;
                audioElement.currentTime = 0;
                audioElement.play();
                gif.style.opacity = 1;
                masterPlay.classList.replace('fa-circle-play', 'fa-circle-pause');
            });
        });
    } else {
        alert('Please upload a valid audio file.');
    }
});
