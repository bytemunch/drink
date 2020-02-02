import errorPopUp from "../functions/errorPopUp.js";
import firebase from '../functions/firebase.js';

import {userdata} from '../index.js';
import {PROVIDER_VARS} from '../index.js';

export default class CeAvatarUpload extends HTMLElement {
    realInput;
    fakeUploadButton;
    photoButton;
    preview;
    file: File;
    shrunkFile;
    uid;

    constructor(uid = userdata.uid) {
        super();
        this.uid = uid;
    }

    setImage(file) {
        let image = document.createElement('img');
        image.setAttribute('src', URL.createObjectURL(file));
        image.style.display = 'none';
        image.style.width = 'unset';
        image.style.height = 'unset';
        document.body.appendChild(image);

        image.addEventListener('load', () => {
            this.shrunkFile = shrinkImage(image);
            // setup image preview
            this.preview.style.backgroundImage = `url(${this.shrunkFile}`;
            this.file = dataURItoFile(this.shrunkFile);
        })

        image.addEventListener('error', e => console.error(e));
    }

    connectedCallback() {
        this.realInput = document.createElement('input');
        this.realInput.setAttribute('type', 'file');
        this.realInput.setAttribute('hidden', 'hidden');

        // If we have external profile pic
        // and don't currently have a profile pic
        if (false) {
            firebase.storage().ref().child(`avatars/${this.uid}.png`).getDownloadURL()
            .catch(async err=>{
                if (PROVIDER_VARS.avi) {
                    fetch(PROVIDER_VARS.avi)
                    .then(res=>res.blob())
                    .then(blob=>this.setImage(blob))
                }
            })
        }

        this.realInput.addEventListener('change', e => {
            const file = this.realInput.files[0]
            file.extension = file.name.split('.').pop();

            if (!['png','jpeg','gif','jpg'].includes(file.extension.toLowerCase())) {
                errorPopUp('File is not supported! Please choose a PNG, JPEG or GIF image.');
                return;
            }

            this.setImage(file)
        })

        this.appendChild(this.realInput);

        this.fakeUploadButton = document.createElement('button');
        this.fakeUploadButton.textContent = 'Upload...';
        this.fakeUploadButton.classList.add('small');

        this.fakeUploadButton.addEventListener('click', () => {
            this.realInput.click();
        })

        this.appendChild(this.fakeUploadButton);

        this.preview = document.createElement('ce-avatar');
        this.preview.uid = this.uid;
        this.preview.classList.add('account-img');
        this.appendChild(this.preview);
    }

    upload() {
        if (!this.file) {
            return; // exit gracefully, image is not required
        }

        const storageRef = firebase.storage().ref().child(`avatars/${this.uid}.png`);
        storageRef.put(this.file)
        //storageRef.putString(this.file,'data_url',{contentType:'image/png'})
        .then(snap=>{
            // room.getAvi(this.uid)
            // .then(()=>updateDOM())
        })
        .catch(e=>console.error(e));
    }
}

// customElements.define('ce-avatar-upload', CeAvatarUpload);