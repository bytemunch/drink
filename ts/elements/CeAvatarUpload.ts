class CeAvatarUpload extends HTMLElement {
    realInput;
    fakeUploadButton;
    photoButton;
    preview;
    file: string;

    constructor() {
        super();


    }

    connectedCallback() {
        this.realInput = document.createElement('input');
        this.realInput.setAttribute('type', 'file');
        this.realInput.setAttribute('hidden', 'hidden');

        this.realInput.addEventListener('change', e => {
            const file = this.realInput.files[0];

            file.extension = file.name.split('.').pop();

            if (!['png','jpeg','gif','jpg'].includes(file.extension.toLowerCase())) {
                errorPopUp('File is not supported! Please choose a PNG, JPEG or GIF image.');
                return;
            }

            let shrunkFile;

            let image = document.createElement('img');
            image.setAttribute('src', URL.createObjectURL(file));
            image.style.display = 'none';
            image.style.width = 'unset';
            image.style.height = 'unset';
            document.body.appendChild(image);

            image.addEventListener('load', () => {
                shrunkFile = shrinkImage(image);
                // setup image preview
                this.preview.src = shrunkFile;
                this.file = shrunkFile;
            })

            image.addEventListener('error', e => console.error(e));
        })

        this.appendChild(this.realInput);

        this.fakeUploadButton = document.createElement('button');
        this.fakeUploadButton.textContent = 'Upload...';
        this.fakeUploadButton.classList.add('small');

        this.fakeUploadButton.addEventListener('click', () => {
            this.realInput.click();
        })

        this.appendChild(this.fakeUploadButton);

        this.preview = document.createElement('img');
        this.preview.classList.add('account-img');
        this.appendChild(this.preview);
    }

    upload() {
        if (!this.file) {
            return; // exit gracefully, image is not required
        }

        const storageRef = firebase.storage().ref().child(`avatars/${userdata.uid}.png`);
        storageRef.putString(this.file,'data_url',{contentType:'image/png'})
        .then(snap=>{
            userdata.getAvi();
        })
        .catch(e=>console.error(e));
    }

}

customElements.define('ce-avatar-upload', CeAvatarUpload);