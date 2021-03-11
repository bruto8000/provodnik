// setTimeout(()=>location.reload(), 3000) 


let app = new Vue({
    el: "#app",
    data: {
        project: {
            fdate: "",
            sdate: "",
            nazvanie: "",
            bizness: "",
            opisanie: "",
            zapusk: "",
            soprovod: "",
            status: "",
            zakazchik: "",
            flags: [],
            //  opisanieBody: "", Will added Automaticly

        },
        projectID: 0,

        editor: '',
        undate: false,
        employees: [],
        kalendar: [],
        donut: '',
        audits: [
        //     {
        //     name: "Название аудита",
        //     rows: [{
        //         propName: "Причина ...",
        //         propInt: 25,
        //         propColor: ""
        //     }],
        //     type: 'public | private | secret'

        // }
    ],
    projectNameErrors: {
        fdate: "Дата спуска",
        sdate: "Дата запуска",
        nazvanie: "Название",
        bizness: "Вид бизнеса",
        opisanie: "Описание",  
        zapusk: "Тип запуска",
        soprovod: "Сопровождающий",
        status: "Статус",
        zakazchik: "Заказчик",
     

    }


    },
    mounted: function () {


        console.log(this.kalendar);
        axios.get('../vendor/showEmployees.php')
            .then(res => {

                // res.data.forEach(element => {
                //     element.halfName = element['full_name'].split(' ')[0] + ' ' +
                //         element['full_name'].split(' ')[1][0] + '.';
                // });
                this.employees = res.data;
                Vue.nextTick(function () {
                    M.FormSelect.init(document.querySelectorAll('select'));
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


    
        this.kalendar[0] = Kalendar.set({
            showMonthBtn: true
        }, '#sdate');
        this.kalendar[1] = Kalendar.set({

        }, '#fdate');


        console.log(location)

        if (location.pathname == '/editProj.html') {




            if (location.pathname == '/editProj.html' && (!isNaN(Number(location.search.slice(1))) && (location.search.length))) {
                this.projectID = location.search.slice(1);
                this.loadProject();
            } else {
                M.toast({
                    html: "Неверная ссылка"
                })
                setTimeout(() => {

                    location.replace('./menu.html')
                }, 2000);
            }


        }


this.$refs.sdate.dataset.tooltip = "Нажмите чтобы сделать неопределенной";
this.$refs.sdate.dataset.position = "top";
 M.Tooltip.init(this.$refs.sdate)





    },
    methods: {


        loadProject() {
            axios.get('./vendor/getProjById.php', {
                params: {
                    id: this.projectID
                }
            }).then(
                (res) => {
                    console.log(res.data);

     
                    for (prop in this.project) {
                        this.project[prop] = res.data[prop]
                    }
           
                    Object.assign(this.project, {
                        flags: res.data.flags || []

                    })
                    this.audits = res.data.audits || [];
                    console.log("HERE IS AUDITS",    this.audits )
  
                    
     setTimeout(() => {
        this.editor.html.set(res.data.opisanieBody);
     }, 200);
       
                    delete this.project.opisanieBody;
    
                    console.log((!this.employees.find((e) => {
              
                            return e.full_name == this.project.soprovod
                        })));
                    if (!this.employees.find((e) => {
                        console.log(e.full_name)
                        console.log(this.project.soprovod)
                        console.log(this.project.soprovod)
                            return e.full_name == this.project.soprovod
                        })) {
                            console.log('ERROR PLACE?')
                        this.employees.push({
                            full_name: this.project.soprovod
                        })
             

                 


                    }
    
                    Vue.nextTick(() => {

                        this.audits.forEach(audit=>{
                        this.createDonut(audit);
                    })
                        M.FormSelect.init(document.querySelectorAll('select'))
                    })

                },
                (err) => {
                    M.toast({
                        html: "Ошибка: " + err
                    });
                },
            );


            


        },
        editProj: function () {
            if (!this.validateMainRows() || !this.validateAudits()) return;

            this.project.opisanieBody = this.editor.html.get().replace(/'/ig, '"');
            this.project.audits = []
            this.audits.forEach((audit,idx)=>{
                this.project.audits[idx] = Object.assign({},audit, {donut: null})
            })
            this.project.id = this.projectID;

       console.log(this.project.audits)
            axios.post('../vendor/editProj.php', JSON.stringify(this.project))
                .then((r) => {
                    console.log(r.data);
                    if (r.data == "OK") {
                        M.toast({
                            html: "Проект изменен"
                        });
                     
                    
                        delete this.project["opisanieBody"];

                    } else {
                        throw new Error(r.data)
                    }

                })
                .catch(e => {
                    M.toast({
                        html: "Проект НЕ изменен! " + e
                    });
                })



        },
        addProj: function () {

            if (!this.validateMainRows()) return;
            this.project.opisanieBody = this.editor.html.get().replace(/'/ig, '"');

            axios.post('../vendor/addProj.php', JSON.stringify(this.project))
                .then((r) => {
                    console.log(r.data);
                    if (r.data == "OK") {
                        M.toast({
                            html: "Проект добавлен"
                        });
                        for (prop in this.project) {
                            if (prop == 'flags') {
                                this.project[prop] = [];
                                continue;
                            }

                            this.project[prop] = '';

                        };
                
                        this.editor.html.set(' ');
                        delete this.project["opisanieBody"];

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
        undateZapusk: function () {
            this.undate = !this.undate;
            this.project.sdate = this.undate ? "Не определена" : "";
        },
        validateMainRows() {
            try {


                for (prop in this.project) {
                    if (!this.project[prop]) {

                        throw new Error("Пусто, чего-то не хватает: " + this.projectNameErrors[prop]);
                    }
                }

console.log('validateMainRows')
                if (this.editor.html.get().length < 50) {

                    throw new Error("Описание слишком короткое.");
                }
                return true;

            } catch (e) {

                M.toast({
                    html: e.message
                });

                return false;

            }
        },
        validateAudits() {
            try {


                this.audits.forEach(audit=>{
                    console.log('audit.name.lengt')
                    if(audit.name.length<3){
                        throw new Error("Загаловок аудита не должен быть меньше 3х символов");  
                    }
                    if(audit.type==""){
                        throw new Error("Не выбран тип аудита (Public/Private)");  
                    }
                    audit.rows.forEach(row=>{
                        if(row.propColor==""){
                            throw new Error("Не выбран цвет для строки: " + row.propName);  
                        }
                        if(row.propName==""){
                            throw new Error("Не выбрано имя для строки в аудите: " + audit.name);  
                        }
                        
                    })
                    
                })
            


             
                return true;

            } catch (e) {

                M.toast({
                    html: e.message
                });

                return false;

            }
        },
        createDonut(audit) {
            console.log('CREATING', audit)
if(!audit){return}
            let ctx = document.getElementById( 'DONUT'+this.audits.indexOf(audit)).getContext('2d');
            let data = [];
            let labels = [];
            let colors = [];
            audit.rows.forEach(row => {
              data.push(row.propInt);
              labels.push(row.propName);

            });
            audit.donut = new Chart(ctx, {
                type: 'doughnut',
                data: {

                    datasets: [{
                     
                        data: data,
                        backgroundColor:  ['#c2185b', '#3949ab', '#2196f3', '#00bcd','#009688', '#66bb6a', '#f4ff81', '#f4511e', '#00e676' ].sort((v)=>{return (Math.floor(Math.random()*10) > 5) ? 1 : -1})
                    },
                ],
                 
                },
             
              
                // These labels appear in the legend and in the tooltips when hovering different arcs


            });
        },
        updateDonut(audit){
            let data = [];
            let labels = [];
            let colors = [];
            audit.rows.forEach(row => {
                data.push(row.propInt);
                labels.push(row.propName);
        
              });
           console.log(audit)
           console.log()
           audit.donut.config.data.datasets[0].data = data;
           audit.donut.config.data.labels = labels;
           audit.donut.update();

        },
        deleteRowInAudit(audit) {
            audit.rows.pop();
          this.updateDonut(audit);
        },
        addRowToAudit(audit) {
            if(audit.rows.length>=10){
                M.toast({html: "Достигнуто максимальное колличество строк"})
                return;
            }
            audit.rows.push({
                propName: "",
                propInt: 0
            });
            this.updateDonut(audit);
            this.initSelectColor();
            
        },
        deleteAudit() {
            this.audits.pop();
        },
        addAudit() {
            this.audits.push({

                name: "",
                rows: [{
                    propName: "",
                    propInt: 0
                }],
                type: ''


            });
            this.initSelectColor();
            Vue.nextTick(()=>{
                console.log('audit.name.lengt')
                this.createDonut(this.audits[this.audits.length-1]);
       
            });
        
        },
        initSelectColor(){
            Vue.nextTick(()=>{

                M.FormSelect.init(document.querySelectorAll('.selectColor'))
            })
        }
    },
    components: {
        preloader: preloader
    },
    watch: {
       
    }
})












//КАЛЕНДАРИ