import errorPopUp from "../functions/errorPopUp.js";
import firebase, { firestore } from '../functions/firebase.js';

import { userdata } from '../index.js';
import { PROVIDER_VARS } from '../index.js';
import shrinkImage from "../functions/shrinkImage.js";
import dataURItoFile from "../functions/dataURItoFile.js";
import CustomElement from "./CustomElement.js";

export default class CeAvatarUpload extends CustomElement {
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

        document.body.appendChild(image);

        image.addEventListener('load', () => {
            this.shrunkFile = shrinkImage(image);
            // setup image preview
            this.preview.style.backgroundImage = `url(${this.shrunkFile}`;
            this.file = dataURItoFile(this.shrunkFile);
        })

        image.addEventListener('error', e => console.error(e));
    }

    async connectedCallback() {
        await super.connectedCallback();

        this.realInput = this.shadowRoot.querySelector('#real-input');

        // If we have external profile pic
        // and don't currently have a profile pic
        if (false) {
            firebase.storage().ref().child(`avatars/${this.uid}.png`).getDownloadURL()
                .catch(async err => {
                    if (PROVIDER_VARS.avi) {
                        fetch(PROVIDER_VARS.avi)
                            .then(res => res.blob())
                            .then(blob => this.setImage(blob))
                    }
                })
        }

        this.realInput.addEventListener('change', e => {
            const file = this.realInput.files[0]
            file.extension = file.name.split('.').pop();

            if (!['png', 'jpeg', 'gif', 'jpg'].includes(file.extension.toLowerCase())) {
                errorPopUp('File is not supported! Please choose a PNG, JPEG or GIF image.');
                return;
            }

            this.setImage(file)
        })

        this.fakeUploadButton = this.shadowRoot.querySelector('#fake-input');

        this.fakeUploadButton.addEventListener('click', () => {
            this.realInput.click();
        })

        this.preview = this.shadowRoot.querySelector('ce-avatar');
        this.preview.uid = this.uid;

        this.applyStyle();
    }

    async upload() {

        return new Promise((res, rej) => {
            if (!this.file) {
                rej('no file provided'); // exit gracefully, image is not required
            }

            const storageRef = firebase.storage().ref().child(`avatars/${this.uid}.png`);
            const uploader = storageRef.put(this.file);

            uploader.on(firebase.storage.TaskEvent.STATE_CHANGED,
                (snap) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snap.bytesTransferred / snap.totalBytes) * 100;
                    // console.log('Upload is ' + progress + '% done');
                    switch (snap.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            // console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            // console.log('Upload is running');
                            break;
                    }
                },
                (error) => { },
                () => { /*console.log('upload complete');*/ res(0); }
            );
        })

    }
}