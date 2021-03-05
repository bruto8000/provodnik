// setTimeout(()=>location.reload(), 3000) 


let app = new Vue({
    el: "#app",
    data: {
       editor : ''
    

    },
    mounted: function () {
        console.log("I AM mounted");

        
        this.editor = new FroalaEditor('#pbody', {
            // Set the file upload URL.

            toolbarButtons: [
                ['bold', 'italic', 'underline', '|', 'fontSize', 'color', 'formatOL', 'formatUL',
                    'insertLink', 'insertTable', 'insertImage', 'html', 'insertFile'
                ]
            ],
            fileUploadURL: 'upload_file.php',
            fileUploadParams: {
                id: 'my_editor'
            },
            imageUploadURL: 'upload_image.php',
            imageUploadParams: {
                id: 'my_editor2'
            },
            language: 'ru'
        })


      


    },
    methods: {


 
}})







