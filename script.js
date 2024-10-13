const userInput1 = document.getElementById('userInput1');
const fileInput = document.getElementById('fileInput');
const registButton = document.getElementById('registButton');

let fileNames = []; // グローバル変数宣言

// 入力があるかどうかをチェックする関数
function updateRegistButtonState() {
    if (userInput1.value.trim() !== '' && fileNames.length > 0) {
        registButton.disabled = false; // ボタンを有効化
        registButton.classList.remove('disabled');
    } else {
        registButton.disabled = true; // ボタンを無効化
        registButton.classList.add('disabled');
    }
}

// ユーザー入力があるかどうかをチェックするイベントリスナー
userInput1.addEventListener('input', updateRegistButtonState);

// ファイル選択状態が更新されたときの処理
fileInput.addEventListener('change', function() {
    fileNames = []; // ここでリセット
    for (var i = 0; i < this.files.length; i++) {
        fileNames.push(this.files[i].name);
    }
    var displayText = fileNames.length > 0 ? fileNames.join(', ') : 'ファイルが選択されていません';
    document.getElementById('fileName').textContent = displayText;

    // 登録ボタンの状態を更新
    updateRegistButtonState();
});

// ファイルアップロード処理
function uploadFiles() {
    const files = fileInput.files;
    const uploadStatus = document.getElementById('uploadStatus');
    const progress = document.getElementById('progress');
    uploadStatus.textContent = 'アップロード中...';
    progress.textContent = '';

    Array.from(files).forEach(file => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            alert(`${file.name} はサポートされていないファイルタイプです。`);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://35.200.15.158:8000/upload', true);

        xhr.upload.onprogress = function(event) {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                progress.textContent = `${file.name}: ${Math.round(percentComplete)}%`;
            }
        };

        xhr.onload = function() {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                if (data.message) {
                    progress.textContent += `${file.name} がアップロードされました。\n`;
                } else if (data.error) {
                    progress.textContent += `エラー: ${data.error}\n`;
                }
            } else {
                progress.textContent += `エラー: ${xhr.statusText}\n`;
            }
        };

        xhr.send(formData);
    });
}

// ファイル名を表示する関数
function displaySelectedFileName() {
    const fileNameDisplay = document.getElementById('fileName');
    if (fileInput.files.length > 0) {
        const fileNames = Array.from(fileInput.files).map(file => file.name).join(', ');
        fileNameDisplay.textContent = fileNames;
    } else {
        fileNameDisplay.textContent = 'ファイルが選択されていません';
    }
}
