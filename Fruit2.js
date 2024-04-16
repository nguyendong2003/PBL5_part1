defaultImageURL = 'https://mdbootstrap.com/img/Photos/Others/placeholder.jpg'


// function displaySelectedImage(event, elementId) {
//     const selectedImage = document.getElementById(elementId);
//     const fileInput = event.target;

//     if (fileInput.files && fileInput.files[0]) {
//         const reader = new FileReader();

//         reader.onload = function (e) {
//             // Hiển thị ảnh đã chọn
//             selectedImage.src = e.target.result;
//         };

//         reader.readAsDataURL(fileInput.files[0]);
//     }
// }

function cropImageToSquare(image) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions to the height of the image
    canvas.width = image.height;
    canvas.height = image.height;

    // Draw image onto canvas
    ctx.drawImage(image, (image.width - image.height) / 2, 0, image.height, image.height, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/jpeg');
}

function displaySelectedImage(event, elementId) {
    const selectedImage = document.getElementById(elementId);
    const fileInput = event.target;

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const image = new Image();
            image.onload = function() {
                // Crop image to square
                const croppedImageDataUrl = cropImageToSquare(image);
                // Display cropped image
                selectedImage.src = croppedImageDataUrl;
            };
            image.src = e.target.result;
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
        const timestamp = key.split('_')[1]

        const imageData = localStorage.getItem(key);
        const fruitName = localStorage.getItem('fruitName_' + timestamp)
        const ripeness = localStorage.getItem('ripeness_' + timestamp)


        result += `
            <div id="item-fruit-${key}" class="d-flex mt-3 align-items-center" style="border-radius: 20px; background: #00fff3; border: 1px solid #ddd;" data-bs-toggle="modal" data-bs-target="#fruitModal" onclick="displayFruitDetails('${timestamp}')">
                <img src="${imageData}" class="mx-3 my-3" alt="example placeholder" style="width: 150px; height: 150px">
                <div class="d-flex flex-column">
                    <h3>Kết quả nhận diện</h3>
                    <p><strong>id: </strong>${timestamp}</p>
                    <p><strong>Loại quả: </strong>${fruitName}</p>
                    <p><strong>Độ chín: </strong>${ripeness}</p>
                </div>
            </div>
        `;
    });

    imageContainer.innerHTML = result;
}

// Function để hiển thị thông tin chi tiết của trái cây trong modal
function displayFruitDetails(timestamp) {
    const imageData = localStorage.getItem('selectedImage_' + timestamp);
    const fruitName = localStorage.getItem('fruitName_' + timestamp);
    const ripeness = localStorage.getItem('ripeness_' + timestamp);

    const fruitDetailsContainer = document.getElementById('fruitDetails');
    fruitDetailsContainer.innerHTML = `
        <img src="${imageData}" class="mx-3 my-3" alt="example placeholder" style="width: 250px" >
        <p><strong>id: </strong>${'selectedImage_' + timestamp}</p>
        <p><strong>Loại quả: </strong>${fruitName}</p>
        <p><strong>Độ chín: </strong>${ripeness}</p>
    `;
}


// Hiển thị tất cả ảnh từ Local Storage khi tải lại trang
window.onload = function () {
    displayAllImages();
    addHoverEffectToItems();
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

    // Ẩn nút "Mở Camera" thì ẩn chính nó đi
    const openCameraButton = document.getElementById('btn-open-camera');
    openCameraButton.style.display = 'none';

    const childOpenCamera = document.getElementById('child-open-camera')
    childOpenCamera.style.display = 'block'

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
}

function captureImage() {
    const canvas = document.getElementById('canvasCamera');
    const video = document.getElementById('videoCamera');
    const ctx = canvas.getContext('2d');

    // Lấy chiều rộng và chiều cao của video
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // Đảm bảo chiều cao không vượt quá chiều rộng
    const squareSize = Math.min(videoWidth, videoHeight);

    // Cắt ảnh từ trung tâm theo chiều rộng và chiều cao của video
    const x = (videoWidth - squareSize) / 2;
    const y = (videoHeight - squareSize) / 2;

    // Đặt kích thước của canvas bằng kích thước vuông cắt ảnh
    canvas.width = squareSize;
    canvas.height = squareSize;

    // Vẽ video lên canvas, chỉ vẽ phần ảnh vuông
    ctx.drawImage(video, x, y, squareSize, squareSize, 0, 0, squareSize, squareSize);

    // Chuyển đổi canvas thành đường dẫn dữ liệu của ảnh
    const imageDataURL = canvas.toDataURL('image/jpeg');

    // Hiển thị ảnh đã chụp lên trang web
    const selectedImage = document.getElementById('selectedImage');
    selectedImage.src = imageDataURL;
}



// Tắt camera
function stopCamera() {
    if (videoStream) {
        const videoTracks = videoStream.getVideoTracks();
        videoTracks.forEach(track => track.stop());
        videoStream = null;

        const video = document.getElementById('videoCamera');
        video.style.display = 'none'; // Ẩn video element khi dừng camera

        // 
        const openCameraButton = document.getElementById('btn-open-camera');
        openCameraButton.style.display = 'block';
    
        const childOpenCamera = document.getElementById('child-open-camera')
        childOpenCamera.style.display = 'none'
    }
}

function submitImage() {
    
    const selectedImage = document.getElementById('selectedImage');
    imageDataURL = selectedImage.src

    if(imageDataURL == defaultImageURL) {
        alert('Please upload an image')
        return;
    }
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
    addHoverEffectToItems();
}

function resetImage() {
    const selectedImage = document.getElementById('selectedImage');
    selectedImage.src = defaultImageURL;
}

function addHoverEffectToItems() {
    // Lấy tất cả các item
    const items = document.querySelectorAll('[id^="item-fruit-"]');

    // Duyệt qua từng item và thêm sự kiện hover vào
    items.forEach(item => {
        item.addEventListener('mouseover', function () {
            // Thêm lớp CSS khi hover vào
            this.classList.add('btn-change3')
        });

        item.addEventListener('mouseout', function () {
            // Xóa lớp CSS khi di chuột ra ngoài
            this.classList.remove('btn-change3')
        });
    });
}
