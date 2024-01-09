// Selectors
const form = document.querySelector('form');
const submitBtn = document.querySelector('form button');
const succesContainer = document.querySelector('.success');
const title = document.querySelector('.success h3');
const downloadLink = document.querySelector('.success a');
const thumnail = document.querySelector('.thumnail');
const failureMsg = document.querySelector('.failure strong');
const progress = document.querySelector('.progress strong');

// Handle events
form.onsubmit = submitHandler;

// handlers
function submitHandler(event) {
    event.preventDefault();
    const inputValue = event.target.elements.videoID.value;
    if (inputValue) {
        cleanup();
        const sanitizedVideoID = sanitize(inputValue);
        const videoID = sanitizedVideoID.videoID;
        if (!videoID) {
            failureMsg.innerText = sanitizedVideoID.error;
            return;
        }
        const url = `${API_URL}?id=${encodeURIComponent(videoID)}`;
        fetcher(url, options, videoID);
    }
}

function successContainerHandler(data, videoID) {
    title.innerText = data.title;
    thumnail.src = `https://img.youtube.com/vi/${encodeURIComponent(
        videoID
    )}/mqdefault.jpg`;
    downloadLink.href = data.link;
    succesContainer.style.display = 'block';
}

// helpers
function cleanup() {
    succesContainer.style.display = 'none';
    failureMsg.innerText = '';
    progress.innerText = '';
}

async function fetcher(url, options, videoID) {
    try {
        const data = await (await fetch(url, options)).json();
        if (data.status === 'ok') {
            progress.innerText = '';
            submitBtn.innerText = 'Convert';
            submitBtn.disabled = false;
            successContainerHandler(data, videoID);
        } else if (data.status === 'processing') {
            submitBtn.innerHTML = '<div class="loader"></div>';
            submitBtn.disabled = true;
            progress.innerText = data.progress + ' %';
            setTimeout(() => {
                fetcher(url, options, videoID);
            }, 1000);
        } else if (data.status === 'fail') {
            failureMsg.innerText = data.error;
        }
    } catch (error) {
        failureMsg.innerText = error;
    }
}

function sanitize(videoID) {
    if (videoID.length > 11) {
        const regex_browser = /v=([a-zA-Z0-9_-]+)/;
        const regex_app = /youtu.be\/([a-zA-Z0-9_-]+)/;
        let match;
        if (videoID.includes('youtube.com')) {
            match = regex_browser.exec(videoID);
        } else if (videoID.includes('youtu.be')) {
            match = regex_app.exec(videoID);
        }
        if (match) {
            videoID = match[1];
        } else return { error: 'Not match: Invalid Youtube video link' };
    } else if (videoID.length < 11) {
        return { error: 'Invalid video link' };
    }
    return { videoID };
}

const API_KEY = 'fd5ca15b5dmsh53c6cfba376c180p114718jsn72a9199022aa';
const API_HOST = 'youtube-mp36.p.rapidapi.com';
const API_URL = 'https://youtube-mp36.p.rapidapi.com/dl';

const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST,
    },
};
