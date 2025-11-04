const STORAGE_KEY = 'lyricVaultSongs';

const defaultSongData = [
    { title: "Nimeonja Pendo Lako", genre: "thanksgiving", category: "General Hymn", lyrics: "Nimeonja pendo lako, nimejua u mwema\nNitakushukuru nitawainua wote wakusifu wewe\nNitawaongoza vyema waimbe kwa furaha\nNitakushukuru nitawainua wote wakusifu wewe..\n\n'Ukarimu wako Bwana, na huruma yako wewe\nMsamaha wako Bwana, na upole wako (wewe)\nUmenitendea wema usiopimika\nNitakushukuru nitawainua wote wakusifu wewe\n\nKina mama simameni, piga vigelegele\nNa kina baba nyanyuka mkapige makofi\n\nchorus\n\nWatu wote nesanesa chezeni kwa furaha\nInua mikono juu, mshangilieni Bwana\n\nchorus\n\nWatawa washangilie, makasisi waimbe\nWalei warukeruke, waseme aleluya\n\nchorus\n\nVitambaa mikononi, vipeperushwe juu\nNa vichwa viyumbeyumbe kwa mwendo wa kuringa -\n\nchorus\n\nNitakushukuru mimi, na nyumba yangu yote -\nNitayatangaza haya, maisha yangu yote -\n\nchores." },
    { title: "Ave Maria", genre: "marian", category: "Marian Song", lyrics: "Ave Maria, gratia plena,\nDominus tecum,\nbenedicta tu in mulieribus,\net benedictus fructus ventris tui, Iesus." },
    { title: "Here I Am Lord", genre: "praise", category: "Praise & Worship", lyrics: "I, the Lord of sea and sky,\nI have heard my people cry.\nAll who dwell in dark and sin,\nMy hand will save.\n\nHere I am, Lord.\nIs it I, Lord?\nI have heard you calling in the night.\nI will go, Lord, if you lead me.\nI will hold your people in my heart." },
    { title: "Hii ni Ekaristi", genre: "mass", category: "Communion Hymn", lyrics: "Hii ni ekaristi, aliyotuachia\nBwana Yesu Kristu (Kristu)\nMkombozi wa dunia\n\n{ (imbeni) Imbeni kwa furaha\n(sifuni) Sifuni ekaristi\n(alimo) Alimo Yesu Kristu (Kristu)\nAlimo ni mzima } *2\n\nYesu katuonea, wema pia huruma\nAlitupenda sana (sana)\nAkatupa uzima\n\nchorus\n\nJioni Alhamisi, alichukua mkate\nKaugeza mwili (mwili)\nKuleni mkaokoke\n\nchorus\n\nPia alichukua, kikombe cha divai\nKaigeuza damu (damu)\nKunyweni mkaokoke\n\nchorus\n\nWalipokwisha kula, kawaosha miguu\nNimewapa mfano (mfano)\nFanyeni nanyi vile\n\nchorus\n\nYesu mwili na damu, chakula cha uzima\nTujaliwe kupata (pata)\nUzima wa milele.\nchorus" },
    { title: "Come Back to Me (Lenten Song)", genre: "lenten", category: "Lenten Song", lyrics: "Long have I waited for your coming home to me\nAnd living deeply our new life.\n\nAs a shepherd gently leads his sheep,\nI will lead you home." },
    { title: "Tantum Ergo", genre: "eucharist", category: "Eucharistic Hymn", lyrics: "Tantum ergo Sacramentum\nVeneremur cernui:\nEt antiquum documentum\nNovo cedat ritui." },
    { title: "Bwana Yesu Kazaliwa", genre: "christmas", category: "Christmas Song", lyrics: "Bwana Yesu kazaliwa, Tumwimbie kwa furaha, aleluya...\nAleluya aleluya aleluya aleluya aleluya(chorus) \nKwa ajili yetu sisi, amezaliwa kitoto, aleluya \nchorus \nAmezaliwa kitoto, nasi tumepewa mwana, aleluya \nchorus \nUtawala na uwezo, vimo mabegani mwake, aleluya \n chorus \nJina lake ndilo Baba, wa milele tena mfalme, aleluya \n chorus \nEnzi yake ya kifalme, haitakuwa na mwisho, aleluya \n chorus\nAnakalia kitiye, chake Daudi babaye, aleluya\n chorus \nFuraha binti Sayuni, umpokee Bwana wako, aleluya \n chorus \nDunia na ifurahi, nchi na ishangilie, aleluya \n chorus *2 " },
];

let songData = []; 



function loadSongsFromStorage() {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
        songData = JSON.parse(storedData);
    } else {
        songData = defaultSongData;
        saveSongsToStorage(); 
    }
}


function saveSongsToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(songData));
}


document.addEventListener('DOMContentLoaded', () => {
    loadSongsFromStorage(); 
    
    loadInitialLyrics(songData);
    
    setupEventListeners();
    fetchMassReadings(); 
});

function setupEventListeners() {
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.getElementById('navMenu').classList.toggle('active');
    });

    document.getElementById('searchBtn').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    document.getElementById('browseBtn').addEventListener('click', performFilter);

    document.querySelectorAll('.genre-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const genre = e.target.getAttribute('data-genre');
            document.getElementById('genreSelect').value = genre;
            performFilter();
        });
    });

    document.getElementById('shareBtn').addEventListener('click', shareSongOfTheDay);

    document.getElementById('submitForm').addEventListener('submit', handleSongSubmission);

    document.getElementById('contactForm').addEventListener('submit', handleContactForm);

    document.getElementById('scrollTop').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


function loadInitialLyrics(songs) {
    const container = document.getElementById('lyricsContainer');
    container.innerHTML = ''; 

    if (songs.length === 0) {
        container.innerHTML = "<p>No songs found for this criteria.</p>";
        return;
    }

    songs.forEach(song => {
        const item = document.createElement('div');
        item.className = 'lyric-item';
        item.innerHTML = `
            <h3>${song.title} (${song.category})</h3>
            <pre>${song.lyrics}</pre>
            <p><strong>Genre:</strong> ${song.genre.charAt(0).toUpperCase() + song.genre.slice(1)}</p>
        `;
        container.appendChild(item);
    });
}


function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredSongs = songData.filter(song =>
        song.title.toLowerCase().includes(searchTerm) ||
        song.lyrics.toLowerCase().includes(searchTerm)
    );
    loadInitialLyrics(filteredSongs);
    document.getElementById('lyrics').scrollIntoView({ behavior: 'smooth' });
}


function performFilter() {
    const selectedGenre = document.getElementById('genreSelect').value;
    if (!selectedGenre) {
        loadInitialLyrics(songData); 
    } else {
        const filteredSongs = songData.filter(song => song.genre === selectedGenre);
        loadInitialLyrics(filteredSongs);
    }
    document.getElementById('lyrics').scrollIntoView({ behavior: 'smooth' });
}


function shareSongOfTheDay() {
    const title = document.getElementById('songTitle').textContent;
    const category = document.getElementById('songCategory').textContent;
    const lyrics = document.getElementById('songLyrics').textContent.trim();
    
    const message = `Hymns of Heaven Song of the Day\n\n${title}\n${category}\n\n${lyrics}\n\n---\nFind more Catholic lyrics at Hymns of Heaven!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
}


function handleSongSubmission(e) {
    e.preventDefault();
    const title = document.getElementById('songTitleInput').value.trim();
    const genre = document.getElementById('songGenreInput').value;
    const lyrics = document.getElementById('songLyricsInput').value.trim();
    const author = document.getElementById('songAuthorInput').value.trim() || 'Community Submission';
    const submitMessage = document.getElementById('submitMessage');

    const newSong = {
        title: title,
        genre: genre,
        category: `Submitted by: ${author}`,
        lyrics: lyrics
    };

    songData.unshift(newSong); 
    
    saveSongsToStorage(); 
    
    loadInitialLyrics(songData); 
    
    submitMessage.textContent = `"${title}" has been added successfully to the ${genre.toUpperCase()} genre!`;
    submitMessage.classList.remove('hidden');
    document.getElementById('submitForm').reset();
    
    setTimeout(() => {
        submitMessage.classList.add('hidden');
    }, 5000);

    document.getElementById('lyrics').scrollIntoView({ behavior: 'smooth' });
}


function handleContactForm(e) {
    e.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const message = document.getElementById('contactMsg').value.trim();

    const fullMessage = `Hello Hymns of Heaven Team! My name is ${name}. I have a message for you: "${message}"`;
    const encodedMessage = encodeURIComponent(fullMessage);
    
    const whatsappUrl = `https://wa.me/+254795077967?text=${encodedMessage}`; 

    const mailtoUrl = `jemohmutuku@gmail.com?subject=Website Inquiry from ${name}&body=${encodedMessage}`;
    
    const userConfirm = confirm("Click OK to send your message instantly via WhatsApp, or Cancel to copy the message for use in Phone Messenger/Email.");

    if (userConfirm) {
        window.open(whatsappUrl, '_blank');
    } else {
        navigator.clipboard.writeText(fullMessage).then(() => {
            alert("Message copied to clipboard! You can now paste it into your preferred messenger app or email.");
            window.open(mailtoUrl, '_blank');
        }).catch(err => {
            console.error('Could not copy text: ', err);
            window.open(mailtoUrl, '_blank'); 
        });
    }
}


function fetchMassReadings() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = today.toLocaleDateString('en-US', options);

    const dummyReadings = {
        feastDay: "Memorial of St. Charles Borromeo, Bishop",
        reading1: "A reading from the Letter of Saint Paul to the Romans (Rom 12:5-16). We, though many, are one body in Christ and individually parts of one another. For as in one body we have many parts, and all the parts do not have the same function, so we, though many, are one body in Christ and individually parts of one another.",
        gospel: "A reading from the Holy Gospel according to Luke (Lk 14:15-24). Jesus said to them, “When you hold a banquet, invite the poor, the crippled, the lame, the blind; and blessed indeed will you be because of their repayment at the resurrection of the righteous. For everyone who exalts himself will be humbled, and the one who humbles himself will be exalted.”"
    };

    setTimeout(() => {
        document.getElementById('feastDay').textContent = dummyReadings.feastDay;
        document.getElementById('reading1').innerHTML = `<h3>First Reading</h3><p>Today, ${dateString}</p><p>${dummyReadings.reading1}</p>`;
        document.getElementById('gospel').innerHTML = `<h3>Gospel Reading</h3><p>Today, ${dateString}</p><p>${dummyReadings.gospel}</p>`;
    }, 1500); 

}
