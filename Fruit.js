function displaySelectedImage(event, elementId) {
    const selectedImage = document.getElementById(elementId);
    const fileInput = event.target;

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            // Hiển thị ảnh đã chọn
            selectedImage.src = e.target.result;

            // Tạo một key mới dựa trên thời gian hiện tại
            const timestamp = new Date().getTime();
            const key = 'selectedImage_' + timestamp;

            // Lưu ảnh vào Local Storage với key mới
            localStorage.setItem(key, e.target.result);

            // Hiển thị tất cả ảnh từ Local Storage
            displayAllImages();
        };

        reader.readAsDataURL(fileInput.files[0]);
    }
}

function displayAllImages() {
    const imageContainer = document.getElementById('imageContainer');
    imageContainer.innerHTML = ''; // Xóa các ảnh hiện có để hiển thị lại

    // Tạo một mảng để lưu trữ các key từ Local Storage
    const keys = [];

    // Duyệt qua tất cả các key trong Local Storage và thêm chúng vào mảng
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.includes('selectedImage_')) {
            keys.push(key);
        }
    }

    // Sắp xếp các key theo thứ tự giảm dần của thời gian
    keys.sort((a, b) => {
        const timeA = parseInt(a.split('_')[1]);
        const timeB = parseInt(b.split('_')[1]);
        return timeB - timeA;
    });

    let result = '';

    // Duyệt qua các key đã sắp xếp và hiển thị ảnh
    keys.forEach(key => {
        const imageData = localStorage.getItem(key);
        result += `
            <div class="d-flex">
                <img src="${imageData}" class="mx-3 my-3" alt="example placeholder" style="width: 250px;" >
                <div class="d-flex flex-column">
                    <h1>Kết quả nhận diện</h1>
                    <p><strong>id: </strong>${key}</p>
                    <p><strong>Loại quả: </strong>Quả táo</p>
                    <p><strong>Độ chín: </strong>80%</p>
                </div>
            </div>
        `;
    });

    imageContainer.innerHTML = result;
}


// Hiển thị tất cả ảnh từ Local Storage khi tải lại trang
window.onload = function () {
    displayAllImages();

};



// Camera
let videoStream;    

function openCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Trình duyệt không hỗ trợ truy cập camera.');
        return;
    }

    const constraints = {
        video: true
    };

    const video = document.getElementById('videoCamera');
    video.style.display = 'block'; // Hiển thị video element

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            video.srcObject = stream;
            video.play();
            videoStream = stream;
        })
        .catch(function (err) {
            console.error('Lỗi: ', err);
        });
}

function captureImage() {
    const canvas = document.getElementById('canvasCamera');
    const video = document.getElementById('videoCamera');
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataURL = canvas.toDataURL('image/jpeg');

    const selectedImage = document.getElementById('selectedImage');
    selectedImage.src = imageDataURL;

    // Tạo một key mới dựa trên thời gian hiện tại
    const timestamp = new Date().getTime();

    const keyImage = 'selectedImage_' + timestamp;
    const keyFruitName = 'fruitName_' + timestamp;
    const keyRipeness = 'ripeness_' + timestamp;

    // data
    valueFruitName = 'Quả táo_' + timestamp;
    valueRipeness = '80%_' + timestamp;

    // Lưu ảnh vào Local Storage với key mới
    localStorage.setItem(keyImage, imageDataURL);
    localStorage.setItem(keyFruitName, valueFruitName);
    localStorage.setItem(keyRipeness, valueRipeness);

    // Hiển thị tất cả ảnh từ Local Storage
    displayAllImages();
}

// Tắt camera
function stopCamera() {
    if (videoStream) {
        const videoTracks = videoStream.getVideoTracks();
        videoTracks.forEach(track => track.stop());
        videoStream = null;

        const video = document.getElementById('videoCamera');
        video.style.display = 'none'; // Ẩn video element khi dừng camera
    }
}
