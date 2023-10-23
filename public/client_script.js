let hasEventsourse;
const input = document.querySelector('.input');
const submitBtn = document.querySelector('.button-submit');
const message = document.querySelector('.message strong');
const outputContainer = document.querySelector('.output-container');
const downloadLink = document.querySelector('#download-link');
const thumnail = document.querySelector('.thumnail');
const songTitle = document.querySelector('.song-title');
const convertBtn = document.querySelector('.btn-class-name .font');
const progress = document.querySelector('.progress');
const progressLoader = document.querySelector('.progress-loader');
const spinningIcon = `
    <svg class="spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
            d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z" />
    </svg>
`;

// Click convert button on enter input box
input.onkeypress = (e) => {
    if (e.keyCode === 13) {
        submitBtn.click();
    }
};
submitBtn.onclick = (e) => {
    if (input.value && !hasEventsourse) {
        // Xoay spinning khi đợi even message
        submitBtn.innerHTML = spinningIcon;
        submitBtn.disabled = true;
        submitBtn.style.cursor = 'not-allowed';
        // Xóa kết quả trước đó
        songTitle.style.display = 'none';
        downloadLink.style.display = 'none';
        thumnail.style.display = 'none';
        message.style.display = 'none';

        // Tạo đối tượng eventSource
        const source = new EventSource('/convert-mp3?' + input.value);
        hasEventsourse = true;

        // Lắng nghe sự kiện
        source.addEventListener(
            'open',
            function (e) {
                console.log('Connections to the server established..');
            },
            false
        );

        source.onmessage = function (e) {
            const data = JSON.parse(e.data);
            // Sự kiện xử lý
            if (data.result === 'processing') {
                // Phần trăm tiến trình
                const percentage = `${parseInt(data.progress.percentage)}%`;
                // Cập nhật tiến trình
                progress.style.width = percentage;
                message.innerText = percentage;
                // Hiện thanh tiến trình và thông tin download
                if (progressLoader.style.display !== 'block') {
                    progressLoader.style.display = 'block';
                    message.style.display = 'block';
                }
                // Hiện thumnail
                if (thumnail.style.display !== 'block') {
                    thumnail.src = `https://img.youtube.com/vi/${encodeURIComponent(
                        data.videoId
                    )}/mqdefault.jpg`;
                    thumnail.style.display = 'block';
                }
                // Sự kiện đã hoàn thành
            } else if (data.result === 'success') {
                // Ẩn message và thanh tiến trình
                message.style.display = 'none';
                progressLoader.style.display = 'none';
                // Hiện thông tin download
                if (data.songThumnail) {
                    thumnail.src = data.songThumnail;
                    thumnail.style.display = 'block';
                }
                downloadLink.href = data.songLink;
                downloadLink.style.display = 'block';
                songTitle.innerText = data.songTitle;
                songTitle.style.display = 'block';
                // Đóng kết nối
                source.close();
                hasEventsourse = false;
                submitBtn.disabled = false;
                submitBtn.style.cursor = 'pointer';
                submitBtn.innerHTML = 'Convert';
            }
            // Sự kiện lỗi
            else {
                message.innerText = data.errMessage;
                // Đóng kết nối
                source.close();
                hasEventsourse = false;
                submitBtn.innerHTML = 'Convert';
                submitBtn.disabled = false;
                submitBtn.style.cursor = 'poiter';
            }
        };
    }
};
