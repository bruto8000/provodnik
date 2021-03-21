// setTimeout(()=>location.reload(), 3000) 


 Vue.component('addProj',{

    data(){return {
        project: {
            fdate: "",
            sdate: "",
            nazvanie: "",
            bizness: "",
         
            zapusk: "",
            soprovod: "",
            status: "",
            zakazchik: "",
            flags: [],
            difficulty: []
            //  opisanieBody: "", Will added Automaticly
//   opisanie: "", OLD
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
        //     subname: ""
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
        difficulty: "Сложность",
     

    }

    }
    },
    mounted: function () {
console.log('mounted')

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


            let someDate = new Date();
        this.kalendar[0] = Kalendar.set({
            showMonthBtn: true,
            events: [someDate.toDateString()]
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


       
        addProj: function (event) {
            event.target.classList.toggle('is-loading')
            if (!this.validateMainRows()) {


setTimeout(() => {
    event.target.classList.toggle('is-loading')
}, 400);




                return;
            } 
            this.project.opisanieBody = this.editor.html.get().replace(/'/ig, '"');
     
            axios.post('../vendor/addProj.php', JSON.stringify(this.project))
                .then((r) => {
     setTimeout(() => {
        event.target.classList.toggle('is-loading')
     }, 400);
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
        }

    },
 
    watch: {
       
    },
    template: 
    /*html*/`
    
    
    <div  class="container">


    <h1 class="center title is-1">Добавление проекта</h1>
    <div class="columns">
        <div class="column is-3 ">
            <div class="center">Дата спуска</div> <input v-model.lazy="project.fdate" id="fdate" type="text"
                class="datepicker center input" value="" placeholder="Выберите дату">
        </div>
        <div class="column is-3">
            <div class="center" @click="undateZapusk" ref='sdate'>Дата запуска</div> <input :disabled="undate"
                v-model.lazy="project.sdate" id="sdate" type="text" class="datepicker center input" value=""
                placeholder="Выберите дату">
        </div>
        <div class="column is-6 center ">
            <div class="  ">Название</div>
            <input placeholder="Введите Название" v-model="project.nazvanie" id="nazvanie" type="text"
                class="validate input">
        </div>
    </div>
    <div class="columns">
        <div class="column is-3 p-1 center ">
            <div class="  ">Вид бизнеса</div>
            <div class="">
                <select v-model="project.bizness" id="bizness">
                    <option value="" disabled selected>Вид бизнеса</option>
                    <option value="FMC">FMC</option>
                    <option value="B2B">B2B</option>
                    <option value="B2C">B2C</option>
                    <option value="ПК">ПК</option>
                    <option value="FTTB">FTTB</option>
                    <option value="FMC/FTTB">FMC/FTTB</option>
                    <option value="BTB/BTC">BTB/BTC</option>
                    <option value="FMC/B2C">FMC/B2C</option>
                </select>
            </div>
        </div>
        <div class="column is-3  p-1 center">
            <div class="  ">Тип запуска</div>
            <div class="">
                <select v-model="project.zapusk" id="zapusk">
                    <option value="" disabled selected>Тип запуска</option>
                    <option value="Запуск ТП">Запуск ТП</option>
                    <option value="Перезапуск ТП">Перезапуск ТП</option>
                    <option value="Закрытие ТП">Закрытие ТП</option>
                    <option value="Офсет">Офсет</option>
                    <option value="Симплификация/Репайсинг">Симплификация/Репайсинг</option>
                    <option value="Запуск Услуги">Запуск Услуги</option>
                    <option value="Изменение условий услиги">Изменение условий услиги</option>
                    <option value="Закрытие условий">Закрытие условий</option>
                    <option value="Запуск акции">Запуск акции</option>
                    <option value="Закрытие акции">Закрытие акции</option>
                    <option value="SMS/push/email рассылка">SMS/push/email рассылка</option>
                    <option value="Запуск Города">Запуск Города</option>
                    <option value="Оборудование">Оборудование</option>
                </select>
            </div>
        </div>

        <div class="column is-3 center ">
        <div class="  ">Сложность</div>
        <input placeholder="Введите сложность"  v-model="project.difficulty" id="difficulty" type="text"
            class="validate input">
    </div>

        <div class="column is-3 center ">
            <div class="  ">Заказчик</div>
            <input placeholder="Введите заказчика"  v-model="project.zakazchik" id="zakazchik" type="text"
                class="validate input">
        </div>
    </div>
    <div class="columns">
        <div class="column is-6 p-1">
            <div class="   center">Сопровождающий</div>
            <div class="">

                <select v-model="project.soprovod" id="soprovod">
                    
                    <option value="" selected>Сопровождающий</option>
                    <option v-for="employee in employees" :value="employee['full_name']">{{employee['full_name']}}
                    </option>
                    
                </select>
            </div>


        </div>



        <div class="column is-3  p-1 center ">
            <div class="">Статус</div>
            <div class="">
                <select v-model="project.status" id="status">
                    <option value="" disabled selected>Статус</option>
                    <option value="В работе">В работе </option>
                    <option value="Выполнено">Выполнено </option>
                    <option value="Отложено">Отложено</option>
                    <option value="Отменено">Отменено</option>


                </select>

            </div>
        </div>


   

        <div class="column is-3 center  p-1 ">
            <div class="  ">Флаги</div>
            <select placeholder="Флаги" v-model="project.flags" id="zakazchik" type="text"
                class="validate"
                multiple>
               
            <option disabled value="">Выбор</option>
            <option value="Влияние">Влияние</option>
            <option value="Экстренный запуск">Экстренный запуск</option>
            <option value="ДПП">ДПП</option>
            <option value="Конфиденциальность">Конфиденциальность</option>
            
            
            </select>

        </div>

    </div>
    <div class="columns">

        <div class="column is-12">

            <div class="froala">
                <label for="pbody">Описание</label>
                <textarea class="form-control" columnss="7" wrap="hard" id="pbody" name="pbody"></textarea>
            </div>
        </div>
    </div>
    <div class="columns">
        <div @click="addProj" class="button has-text-white is-large is-primary column is-12 black-text title is-3">
Добавить проект
        </div>
    </div>





</div>
    
    `
})












//КАЛЕНДАРИ