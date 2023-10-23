const path = require('path');
const YoutubeMp3Downloader = require('youtube-mp3-downloader');

module.exports = new YoutubeMp3Downloader({
    ffmpegPath: path.resolve(__dirname, '../', 'tools', 'ffmpeg', 'ffmpeg.exe'),
    outputPath: path.resolve(__dirname, '../', 'public', 'audio'),
    youtubeVideoQuality: 'highestaudio',
    queueParallelism: 2,
    progressTimeout: 2000,
    allowWebm: false,
});