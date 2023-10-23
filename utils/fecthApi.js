// const fetch = require('node-fetch');

module.exports = async (videoID) => {
    const url = `${process.env.API_URL}?id=${encodeURIComponent(videoID)}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': process.env.API_KEY,
            'X-RapidAPI-Host': process.env.API_HOST,
        },
    };

    try {
        const fetchApi = await fetch(url, options);
        return await fetchApi.json();
    } catch (error) {
        console.log(error);
    }
};
