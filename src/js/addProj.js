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
        audits: [{
            name: "Название аудита",
            rows: [{
                propName: "Причина ...",
                propInt: 25,
                propColor: ""
            }],
            type: 'public | private | secret'

        }]


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


        console.log("I AM mounted");
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
                    if (!this.employees.find((e) => {
                            return e.full_name == this.project.soprovod
                        })) {
                        this.employees.push({
                            full_name: this.project.soprovod
                        })





                    }
                    Vue.nextTick(() => {

                        M.FormSelect.init(document.querySelectorAll('select'))
                    })

                },
                (err) => {
                    M.toast({
                        html: "Ошибка: " + err
                    });
                },
            );


            this.createDonut();


        },
        editProj: function () {
            if (!this.validateMainRows()) return;


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
                                return;
                            }

                            this.project[prop] = '';

                        };
                        this.editor.html.set('');
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

                        throw new Error("Пусто, чего-то не хватает: " + prop);
                    }
                }


                if (this.editor.html.get().length < 50) {

                    throw new Error("Описание слишком короткое.");
                }
                return true;

            } catch (e) {

                M.toast({
                    html: e
                });

                return false;

            }
        },
        createDonut(audit) {
if(!audit){return}
            let ctx = document.getElementById( 'DONUT'+this.audits.indexOf(audit)).getContext('2d');
            let data = [];
            let labels = [];
            let colors = [];
            audit.rows.forEach(row => {
              data.push(row.propInt);
              labels.push(row.propName);
              colors.push(row.propColor);
            });
            audit.donut = new Chart(ctx, {
                type: 'doughnut',
                data: {

                    datasets: [{
                        data: data,
                        backgroundColor: 'green'
                    }],
                    labels: labels
                }
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
                colors.push(row.propColor)
              });
           console.log(audit)
           console.log()
           audit.donut.config.data.datasets[0].data = data;
           audit.donut.config.data.datasets[0].backgroundColor = colors;
           audit.donut.config.data.labels = labels;
           audit.donut.update();

        },
        deleteRowInAudit(audit) {
            audit.rows.pop();
        },
        addRowToAudit(audit) {
            audit.rows.push({
                propName: "",
                propInt: 0
            });
            this.initSelectColor();
        },
        deleteAudit() {
            this.audits.pop();
        },
        addAudit() {
            this.audits.push({

                name: "Название аудита",
                rows: [{
                    propName: "Причина ...",
                    propInt: 25
                }],
                type: ''


            });
            this.initSelectColor();
            Vue.nextTick(()=>{

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