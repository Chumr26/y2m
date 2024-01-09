// const respones = [0, 0, 0, 1];

// function server() {
//     const data = respones.shift();
//     if (data) {
//         return data;
//     } else
//         setTimeout(() => {
//             console.log(server());
//         }, 1000);
// }

// console.log(server());

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

// function fetcherPromise() {
//     const videoID = 'HaY5Yzsi-EA';
//     const url = `${API_URL}?id=${encodeURIComponent(videoID)}`;
//     fetch(url, options)
//         .then((res) => res.json())
//         .then((data) => {
//             if (data.status === 'ok') {
//                 console.log(data);
//             } else if (data.status === 'processing') {
//                 console.log(data.progress);
//                 setTimeout(() => {
//                     fetcher();
//                 }, 500);
//             } else console.log('else');
//         });
// }

async function fetcherAsycn() {
    const videoID = 'tp5UtYrCjA0';
    const url = `${API_URL}?id=${encodeURIComponent(videoID)}`;

    const data = await (await fetch(url, options)).json();
    if (data.status === 'ok') {
        console.log(data);
    } else if (data.status === 'processing') {
        console.log(data.progress);
        setTimeout(() => {
            fetcherAsycn();
        }, 500);
    } else console.log('else');
}

fetcherAsycn();
