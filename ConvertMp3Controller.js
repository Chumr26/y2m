const path = require('path');
// const fs = require('fs');
const { fetchApi } = require('./utils');

function writeServerSendEvent(res, data) {
    res.write('id: ' + new Date().toLocaleTimeString() + '\n');
    res.write('data: ' + data + '\n\n');
}

//[POST] /convert-mp3
async function index(req, res) {
    let videoID = req._parsedUrl.query;
    if (videoID.length >= 11) {
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
            }
        }

        // Use RapidApi
        const json = await fetchApi(videoID);
        if (json.status === 'ok') {
            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            });
            const data = {
                result: 'success',
                songTitle: json.title,
                songThumnail: `https://img.youtube.com/vi/${encodeURIComponent(
                    videoID
                )}/mqdefault.jpg`,
                songLink: json.link,
            };
            return writeServerSendEvent(res, JSON.stringify(data));
        } else if (json.code === '403') {
            const data = {
                success: false,
                errMessage:
                    'Video ID or Youtube link not found, please try again.',
            };
            return writeServerSendEvent(res, sseId(), JSON.stringify(data));
        }

        // Use youtube-mp3-downloader package

        // YD.download(videoID);
        // YD.on('finished', function (err, data) {
        //     // Xóa file sau 30s
        //     setTimeout(() => {
        //         if (fs.existsSync(data.file)) {
        //             fs.unlinkSync(data.file);
        //             console.log('Deleted', data.file);
        //         }
        //     }, 60000);
        //     console.log(JSON.stringify(data));
        //     const info = {
        //         result: 'success',
        //         songTitle: data.title,
        //         songThumnail: `https://img.youtube.com/vi/${encodeURIComponent(
        //             videoID
        //         )}/mqdefault.jpg`,
        //         songLink: 'audio/' + path.basename(data.file),
        //     };
        //     writeServerSendEvent(res, JSON.stringify(info));
        // });

        // YD.on('error', function (error) {
        //     console.log(error);
        //     const info = {
        //         result: 'failure',
        //         error,
        //         errMessage:
        //             'Video ID or Youtube link not found, please try again.',
        //     };
        //     writeServerSendEvent(res, JSON.stringify(info));
        // });

        // YD.on('progress', function (progress) {
        //     progress.result = 'processing';
        //     console.log(JSON.stringify(progress));
        //     writeServerSendEvent(res, JSON.stringify(progress));
        // });
    } else {
        // Độ dài ít hơn 11 ký tự
        return {
            result: 'failure',
            errMessage: 'Please enter a valid video ID or Youtube link.',
        };
    }
}

module.exports = index;
