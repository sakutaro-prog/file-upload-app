document.getElementById('uploadButton').addEventListener('click', function() {
    // フラスクサーバーにファイルをアップロードするための処理を書く
    alert('ファイルをアップロードする処理をここに書きます。');
});

// FlaskサーバーのIPアドレスに置き換え
const socket = io('https://35.200.15.158:8000'); // HTTPS対応

function uploadFiles() {
    const files = document.getElementById('fileInput').files;
    const uploadStatus = document.getElementById('uploadStatus');
    const progress = document.getElementById('progress');
    uploadStatus.textContent = 'アップロード中...';
    progress.textContent = '';

    Array.from(files).forEach(file => {
        const formData = new FormData();
        formData.append('file', file);

        fetch('https://35.200.15.158:8000/upload', {  // Flaskのアップロード先を指定
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.message) {
                progress.textContent += `${file.name} がアップロードされました。\n`;
            } else if (data.error) {
                progress.textContent += `エラー: ${data.error}\n`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
}

// ファイル選択状態が更新されたときの処理
var fileNames = []; // グローバル変数宣言
document.getElementById('fileInput').addEventListener('change', function() {
    fileNames = []; // ここでリセット
    for (var i = 0; i < this.files.length; i++) {
        fileNames.push(this.files[i].name);
    }
    var displayText = fileNames.length > 0 ? fileNames.join(', ') : 'ファイルが選択されていません';
    document.getElementById('fileName').textContent = displayText;

    var userInput1 = document.getElementById('userInput1').value;
    if ((fileNames.length > 0) && (userInput1 != '')) {
        // 登録ボタンを有効化
        registButton.disabled = false;
        registButton.classList.remove('disabled');
    } else {
        // 登録ボタンを無効化
        registButton.disabled = true;
        registButton.classList.add('disabled');
    }
});

// サーバー情報が更新されたときの処理
document.getElementById('userInput1').addEventListener('input', function() {
    updateRegistButtonState();
});

function updateRegistButtonState() {
    var userInput1 = document.getElementById('userInput1').value;
    var registButton = document.getElementById('registButton');
    if ((fileNames.length > 0) && (userInput1 !== '')) {
        // 登録ボタンを有効化
        registButton.disabled = false;
        registButton.classList.remove('disabled');
    } else {
        // 登録ボタンを無効化
        registButton.disabled = true;
        registButton.classList.add('disabled');
    }
}

// 画像ファイルのアップロード成功
function onSuccess(message) {
    console.log('Success:', message);
    alert(message);
    document.getElementById('fileName').textContent = ''; // ファイル名表示をクリア
    document.getElementById('uploadStatus').textContent = ''; // 進行状況メッセージをクリア
    document.getElementById('userInput1').value = ''; // サーバー番号をクリア
}

// 画像ファイルのアップロード失敗
function onFailure(error) {
    console.error('Error:', error);
    alert('ファイルのアップロードに失敗しました。');
    document.getElementById('uploadStatus').textContent = ''; // 進行状況メッセージをクリア
}

function displaySelectedFileName() {
    var fileInput = document.getElementById('fileInput');
    var fileNameDisplay = document.getElementById('fileName');
    if (fileInput.files.length > 0) {
        var fileNames = Array.from(fileInput.files).map(file => file.name).join(', ');
        fileNameDisplay.textContent = fileNames;
    } else {
        fileNameDisplay.textContent = 'ファイルが選択されていません';
    }
}
