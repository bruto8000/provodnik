// setTimeout(()=>location.reload(), 3000) 


 Vue.component('editProj',{
props : ['projectFromParent'],
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
            //  opisanieBody: "", Will added Automaticly
//   opisanie: "", OLD
        },
    

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
     

    }

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


            let someDate = new Date();
        this.kalendar[0] = Kalendar.set({
            showMonthBtn: true,
            events: [someDate.toDateString()]
        }, '#sdate');
        this.kalendar[1] = Kalendar.set({

        }, '#fdate');


this.loadProject();

       


this.$refs.sdate.dataset.tooltip = "Нажмите чтобы сделать неопределенной";
this.$refs.sdate.dataset.position = "top";
 M.Tooltip.init(this.$refs.sdate)





    },
    methods: {


        loadProject() {
 

      
            if(!this.projectFromParent.id){
     
                M.toast({html:'Неверная ссылка,  перенаправление...'})
                setTimeout(() => {
                    location.hash = ''
                }, 1000);
            }else{
                this.project = Object.assign({},this.projectFromParent ) 
            }
            
            


        },
        editProj: function (event) {
            event.target.classList.toggle('is-loading')
            if (!this.validateMainRows() || !this.validateAudits()) {
                
                
                setTimeout(() => {
                    event.target.classList.toggle('is-loading')
                }, 400);
                
                
                
                return;


            }

            this.project.opisanieBody = this.editor.html.get().replace(/'/ig, '"');
            this.project.audits = []
            this.audits.forEach((audit,idx)=>{
                this.project.audits[idx] = Object.assign({},audit, {donut: null})
            })
            this.project.id = this.projectID;

       console.log(this.project.audits)
            axios.post('../vendor/editProj.php', JSON.stringify(this.project))
                .then((r) => {
                    setTimeout(() => {
                        event.target.classList.toggle('is-loading')
                    }, 400);
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
        },
        validateAudits() {
            try {


                this.audits.forEach((audit,idx)=>{
                    console.log(audit)
                    console.log('audit.name.lengt')
                    console.log(audit.name)
                    if(audit.name.length<3){
                        throw new Error("Загаловок аудита не должен быть меньше 3х символов" + ' (аудит #' + (idx+1) +')' );  
                    }
                    console.log(audit.subname)
                    if(audit.subname.length<3){
                        throw new Error("Подзагаловок аудита не должен быть меньше 3х символов" + ' (аудит #' + (idx+1) +')');  
                    }
                    if(audit.type==""){
                        throw new Error("Не выбран тип аудита (Public/Private)");  
                    }
                    audit.rows.forEach(row=>{
                       
                        if(row.propName==""){
                            throw new Error("Не выбрано имя для строки в аудите: " + audit.name);  
                        }
                        if(row.propInt==""){
                            throw new Error("Не выбрано колличество для строки в аудите: " + audit.name);  
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
                subname: "",
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
 
    watch: {
       
projectFromParent : function(n,o){

console.log(n, ' IS NEW PROJ');
this.loadProject();

    }

},



    template: `
    <div class="container">

  
    <h1 class="center title is-1">Изменение проекта</h1>
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
        <div class="column is-6 center ">
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




<br><br>



<div class="audits">
<h3 class="center fluid-text title is-3">
    Статусы по запуску/Доп.информация (Аудит)
    <button class="button is-danger" :disabled="!audits.length" @click="deleteAudit()">-</button>
    <button class="button is-primary" @click="addAudit()">+</button>
 </h3>  





 <div class="row" v-for="audit,idx in audits" :key="idx">




<br>

    <h4 class="center title is-4 my-1"> Загаловок аудита : {{audit.name}}</h4>
    <div class="columns">
        <div class="column is-6 is-offset-3">

            <input type="text" class="input" v-model="audit.name" placeholder="Заголовок" >
        </div>
        <div class="column is-2 p-1">
            <select class="selectColor" v-model="audit.type">
                <option value="public">Публичный</option>
                <option value="private">Приватный</option>
                <option value="secret">Секретный</option>
            </select>
        </div>
       
    </div>


    <div class="columns">

 
<div class="column is-6">

<table class=" centered">
    <thead>
      <tr class="my-1">
          <th>     <input type="text" class="is-large input" v-model="audit.subname" placeholder="Подзаголовок" ></th>
          <th class="has-text-centered"> Кол-во</th>
          <td>        <button class="button is-danger" :disabled="!audit.rows.length" @click="deleteRowInAudit(audit)">-</button>
       <button class="button is-success" @click="addRowToAudit(audit)">+</button></td>
      </tr>
    </thead>

    <tbody>
      <tr v-for="row in audit.rows">
        <td><input type="text" class="input" v-model='row.propName' @change="updateDonut(audit)" placeholder="Причина"></td>
        <td><input type="number" class="input" v-model='row.propInt' placeholder="Колличество" @change="updateDonut(audit)"></td>
     

      </tr>
  <tr>
 

  </tr>  
    </tbody>
  </table>


  </div>

    <div class="column is-6">
 <canvas class="" :id="'DONUT'+idx" width="400" height="400">
  </canvas>
    </div>
</div>
</div>
</div>


<div class="columns my-4">
<div @click="editProj" class="button has-text-white is-large is-primary column is-12 black-text title is-3">
    Изменить проект
</div>
</div>



</div>

    
    `
})












//КАЛЕНДАРИ