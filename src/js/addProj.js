// setTimeout(()=>location.reload(), 3000) 


let app = new Vue({
    el: "#app",
    data: {
        project: {
            fdate: "",
            sdate: "",
            nazvanie: "",
            bizness: "",
            zapusk: "",
            soprovod: "",
            status: "",
            zakazchik: "",
          //  opisanieBody: "", Will added Automaticly
          
        },
        
        editor: '',
        undate: false,
        employees: []
    },
    mounted: function () {
        console.log("I AM mounted");
        this.kalendar =  Kalendar.set();
        console.log(  this.kalendar);
        axios.get('../vendor/showEmployees.php')
            .then(res => {

                // res.data.forEach(element => {
                //     element.halfName = element['full_name'].split(' ')[0] + ' ' +
                //         element['full_name'].split(' ')[1][0] + '.';
                // });
                this.employees = res.data;
                Vue.nextTick(function () {
                    M.AutoInit();
                  })
         


                  

            this.editor = new FroalaEditor('#pbody', {
                // Set the file upload URL.
    
                toolbarButtons: [
                    ['bold', 'italic', 'underline', '|', 'fontSize', 'color', 'formatOL', 'formatUL',
                        'insertLink', 'insertTable', 'insertImage', 'html', 'insertFileRR'
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

            });

    
    
          



    },
    methods: {

        closeModal: function(e,v){
            console.log(M.Datepicker)
        this.kalendar.forEach(element => {
           if(element.isOpen){
               element.close();
            

           }
     
        });
          
       
      
        },
        setDate: function(type){


            this.kalendar.forEach(element => {
                if(element.isOpen){
                    if(type == 'month'){
                        
                        element.setInputValue(element.calendars[0].month + ' ' + element.calendars[0].year )
              //          element.el.value = element.calendars[0].month + ' ' + element.calendars[0].year 
                    }else if (type == 'year'){

                        element.setInputValue(element.calendars[0].year)
   
                    }else{
                        element.setInputValue(    element.el.value = ['','I', 'II', "III", "IV"][Math.ceil((element.calendars[0].month + 1)/3)] + ' ' + element.calendars[0].year )
                    
                    }
                    console.log(element)
                    console.log(element.el)
                    console.log(element.calendars)
                    element.close();
                 
     
                }
            })

          
    

        },

        addProj: function () {
            try {
            

                for (prop in this.project) {
                    if (!this.project[prop]) {

                        throw new Error("Пусто, чего-то не хватает: " + prop);
                    }
                }


            if( this.editor.html.get().length < 50){

                throw new Error("Описание слишком короткое.");
            }

            } catch (e) {

                M.toast({
                    html: e
                });

                return;

            }

this.project.opisanieBody = this.editor.html.get().replace(/'/ig, '"');

            axios.post('../vendor/addProj.php', JSON.stringify(this.project))
                .then((r) => {
                    console.log(r.data);
                    if (r.data == "OK") {
                        M.toast({
                            html: "Проект добавлен"
                        });
                        for (prop in this.project) {
                            this.project[prop] = '';

                        };
                        this.editor.html.set('')

                    } else {
                        throw new Error(r.data)
                    }

                })
                .catch(e => {
                    M.toast({
                        html: "Проект НЕ добавлен" + e
                    });
                })


        },
        undateZapusk: function(){
         this.undate =    !this.undate;
         this.project.sdate = this.undate ? "Не определена" : "";
        }    
    }
})












//КАЛЕНДАРИ

