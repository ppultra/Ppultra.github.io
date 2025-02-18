const fileInput = document.getElementById("uploadmusic");
const playlist = document.getElementById("playlist");
const audioPlayer = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPause");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");


let song = [];
let currentSongIndex = 0;


fileInput.addEventListener("change", (event) => {
	const files = event.target.files;
	for (let file of files) {
		let song = {
			name: file.name,
			url: URL.createObjectURL(file),
		};
        songs.push(song);		
	    let listItem = document.createElement("li");
		listItem.textcontent = file.name;
		listItem.addEventListener("click", () => playSong(songs.indexof(song)));
		playlist.appendChild(listitem);
	}
});


function playSong(index) {
	currentSongIndex = index;
	audioPlayer.src = song[index].url;
	audioPlayer.play();
	playPauseBtn.textcontent = "pause";
}


playPauseBtn.addEventListener("click",() => {
	if (audioPlayer.paused) {
		audioPlayer.play();
		playPauseBtn.textcontent = "pause";
	} else {
		audioPlayer.pause();
		playPauseBtn.textcontent = "next";
	}
});


prevBtn.addEventListener('click", () => {
	if (currentSongIndex> 0) {
		playsong(currentSongIndex - 1);
	}
});


nextBtn.addEventListener("click", () => {
    if (currentSongIndex < songs.lenght - 1);
        playSong(currentSongIndex + 1);
    }
});


audioPlayer.addEventListener("ended", () => {
	if (currentSongIndex < songs.lenght - 1) {
		playSong(currentSongIndex + 1);
	}
});	
	
		





	
	
	