const CLIENT_ID = "YOUR_CLIENT_ID.apps.googleusercontent.com";
const API_KEY = "YOUR_API_KEY";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly";

const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");
const uploadFileInput = document.getElementById("uploadFile");
const uploadBtn = document.getElementById("uploadBtn");
const mediaGallery = document.getElementById("mediaGallery");

let authInstance;

function handleClientLoad() {
    gapi.load("client:auth2", initClient);
}

function initClient() {
    gapi.client.init({ apiKey: API_KEY, clientId: CLIENT_ID, discoveryDocs: DISCOVERY_DOCS, scope: SCOPES })
        .then(() => {
            authInstance = gapi.auth2.getAuthInstance();
            updateSigninStatus(authInstance.isSignedIn.get());
            authInstance.isSignedIn.listen(updateSigninStatus);
        })
        .catch(error => console.error("Error initializing Google API:", error));
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        loginBtn.style.display = "none";
        logoutBtn.style.display = "block";
        listDriveFiles();
    } else {
        loginBtn.style.display = "block";
        logoutBtn.style.display = "none";
        mediaGallery.innerHTML = "";
    }
}

loginBtn.onclick = () => authInstance.signIn();
logoutBtn.onclick = () => authInstance.signOut();

uploadBtn.onclick = () => {
    const file = uploadFileInput.files[0];
    if (!file) return alert("Select a file first!");

    const metadata = {
        name: file.name,
        mimeType: file.type,
    };

    const formData = new FormData();
    formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    formData.append("file", file);

    fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST",
        headers: new Headers({ Authorization: `Bearer ${authInstance.currentUser.get().getAuthResponse().access_token}` }),
        body: formData,
    })
        .then(response => response.json())
        .then(file => {
            alert("File uploaded successfully!");
            listDriveFiles();
        })
        .catch(error => console.error("Error uploading file:", error));
};

function listDriveFiles() {
    gapi.client.drive.files.list({
        pageSize: 10,
        fields: "files(id, name, mimeType)",
    }).then(response => {
        mediaGallery.innerHTML = "";
        response.result.files.forEach(file => {
            if (file.mimeType.startsWith("image/")) {
                mediaGallery.innerHTML += `<img src="https://drive.google.com/uc?id=${file.id}" alt="${file.name}" width="200">`;
            } else if (file.mimeType.startsWith("video/")) {
                mediaGallery.innerHTML += `<video controls width="200"><source src="https://drive.google.com/uc?id=${file.id}" type="${file.mimeType}"></video>`;
            }
        });
    });
}

handleClientLoad();
