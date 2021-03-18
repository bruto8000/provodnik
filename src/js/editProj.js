// setTimeout(()=>location.reload(), 3000)

Vue.component("editProj", {
  props: ["projectFromParent"],
  data() {
    return {
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
        ocenka: {
          type: "",
          reason: "",
        },
        AB: [],
        statusZapusk: [],
        //  opisanieBody: "", Will added Automaticly
        //   opisanie: "", OLD
      },
      requirements: [
        "fdate",
        "sdate",
        "nazvanie",
        "bizness",
        "zapusk",
        "soprovod",
        "status",
        "zakazchik",
        "flags",
      ],

      editor: "",
      undate: false,
      employees: [],
      kalendar: [],
      donut: "",
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
        zapusk: "Тип запуска",
        soprovod: "Сопровождающий",
        status: "Статус",
        zakazchik: "Заказчик",
      },
      buttonIsLoading: false,
      ABModal: {},
    };
  },
  mounted: function () {
    axios.get("../vendor/showEmployees.php").then((res) => {
      this.employees = res.data;

      this.editor = new FroalaEditor("#pbody", {
        // Set the file upload URL.

        toolbarButtons: [
          [
            "bold",
            "italic",
            "underline",
            "|",
            "fontSize",
            "color",
            "formatOL",
            "formatUL",
            "insertLink",
            "insertTable",
            "insertImage",
            "html",
            "insertFileRR",
          ],
        ],
        fileUploadURL: "upload_file.php",
        fileUploadParams: {
          id: "my_editor",
        },
        imageUploadURL: "upload_image.php",
        imageUploadParams: {
          id: "my_editor2",
        },
        language: "ru",
      });

      this.loadProject();
    });

    let someDate = new Date();
    this.kalendar[0] = Kalendar.set(
      {
        showMonthBtn: true,
        events: [someDate.toDateString()],
      },
      "#sdate"
    );
    this.kalendar[1] = Kalendar.set({}, "#fdate");

    console.log(this.editor);

    this.$refs.sdate.dataset.tooltip = "Нажмите чтобы сделать неопределенной";
    this.$refs.sdate.dataset.position = "top";
    M.Tooltip.init(this.$refs.sdate);
    this.ABModal = M.Modal.init(document.getElementById("ABModal"));
  },
  methods: {
    loadProject() {
      /*DELETE*/ M.FormSelect.init(document.querySelectorAll("select"));

      if (!this.projectFromParent.id) {
        M.toast({
          html: "Неверная ссылка,  перенаправление...",
        });
        // setTimeout(() => {
        //   location.hash = "show-proj";
        // }, 1000);
      } else {
        this.project = (({
          id,
          fdate,
          sdate,
          nazvanie,
          bizness,
          zapusk,
          soprovod,
          status,
          zakazchik,
          flags,
          ocenka,
          AB,
          statusZapusk,
        }) => ({
          id,
          fdate,
          sdate,
          nazvanie,
          bizness,
          zapusk,
          soprovod,
          status,
          zakazchik,
          flags,
          ocenka,
          AB,
          statusZapusk,
        }))(this.projectFromParent);

        if (this.projectFromParent.opisanieBody)
          setTimeout(() => {
            this.editor.html.set(this.projectFromParent.opisanieBody);
          }, 200);

        Vue.nextTick(function () {
          M.FormSelect.init(document.querySelectorAll("select"));
        });
      }
    },
    editProj: function (event) {
      this.editButtonToggle(true);

      if (!this.validateALL()) {
        setTimeout(() => {
          this.editButtonToggle(false);
        }, 400);

        return;
      }

      this.project.opisanieBody = this.editor.html.get().replace(/'/gi, '"');
      this.project.audits = [];
      this.audits.forEach((audit, idx) => {
        this.project.audits[idx] = Object.assign({}, audit, {
          donut: null,
        });
      });
      console.log(JSON.stringify(this.project));

      axios
        .post("../vendor/editProj.php", JSON.stringify(this.project))
        .then((r) => {
          setTimeout(() => {
            this.editButtonToggle(false);
          }, 400);

          if (r.data == "OK") {
            M.toast({
              html: "Проект изменен",
            });
          } else {
            throw new Error(r.data);
          }
        })
        .catch((e) => {
          M.toast({
            html: "Проект НЕ изменен! " + e,
          });
        });
    },
    editButtonToggle(status) {
      if (status) {
        this.buttonIsLoading = true;
      } else {
        this.buttonIsLoading = false;
      }
    },
    addProj: function (event) {
      event.target.classList.toggle("is-loading");
      if (!this.validateMainRows()) {
        setTimeout(() => {
          event.target.classList.toggle("is-loading");
        }, 400);

        return;
      }
      this.project.opisanieBody = this.editor.html.get().replace(/'/gi, '"');

      axios
        .post("../vendor/addProj.php", JSON.stringify(this.project))
        .then((r) => {
          setTimeout(() => {
            event.target.classList.toggle("is-loading");
          }, 400);

          if (r.data == "OK") {
            M.toast({
              html: "Проект добавлен",
            });
            for (prop in this.project) {
              if (prop == "flags") {
                this.project[prop] = [];
                continue;
              }

              this.project[prop] = "";
            }

            this.editor.html.set(" ");
            delete this.project["opisanieBody"];
          } else {
            throw new Error(r.data);
          }
        })
        .catch((e) => {
          M.toast({
            html: "Проект НЕ добавлен" + e,
          });
        });
    },
    undateZapusk: function () {
      this.undate = !this.undate;
      this.project.sdate = this.undate ? "Не определена" : "";
    },
    validateMainRows() {
      try {
        for (prop in this.project) {
          if (!this.project[prop]) {
            throw new Error(
              "Пусто, чего-то не хватает: " + this.projectNameErrors[prop]
            );
          }
        }

        if (this.editor.html.get().length < 50) {
          throw new Error("Описание слишком короткое.");
        }
        return true;
      } catch (e) {
        M.toast({
          html: e.message,
        });

        return false;
      }
    },
    validateAudits() {
      try {
        this.audits.forEach((audit, idx) => {
          if (audit.name.length < 3) {
            throw new Error(
              "Загаловок аудита не должен быть меньше 3х символов" +
                " (аудит #" +
                (idx + 1) +
                ")"
            );
          }

          if (audit.subname.length < 3) {
            throw new Error(
              "Подзагаловок аудита не должен быть меньше 3х символов" +
                " (аудит :" +
                audit.name +
                ")"
            );
          }
          if (audit.type == "") {
            throw new Error(
              "Не выбран тип аудита (Public/Private)" +
                " (аудит :" +
                audit.name +
                ")"
            );
          }
          audit.rows.forEach((row) => {
            if (row.propName == "") {
              throw new Error(
                "Не выбрано имя для строки в аудите: " + audit.name
              );
            }
            if (row.propInt == "") {
              throw new Error(
                "Не выбрано колличество для строки в аудите: " + audit.name
              );
            }
          });
        });

        return true;
      } catch (e) {
        M.toast({
          html: e.message,
        });

        return false;
      }
    },
    createDonut(audit) {
      if (!audit) {
        return;
      }
      let ctx = document
        .getElementById("DONUT" + this.audits.indexOf(audit))
        .getContext("2d");
      let data = [];
      let labels = [];
      let colors = [];
      audit.rows.forEach((row) => {
        data.push(row.propInt);
        labels.push(row.propName);
      });
      audit.donut = new Chart(ctx, {
        type: "doughnut",
        data: {
          datasets: [
            {
              data: data,
              backgroundColor: [
                "#c2185b",
                "#3949ab",
                "#2196f3",
                "#00bcd",
                "#009688",
                "#66bb6a",
                "#f4ff81",
                "#f4511e",
                "#00e676",
              ].sort((v) => {
                return Math.floor(Math.random() * 10) > 5 ? 1 : -1;
              }),
            },
          ],
        },

        // These labels appear in the legend and in the tooltips when hovering different arcs
      });
    },
    updateDonut(audit) {
      let data = [];
      let labels = [];
      let colors = [];
      audit.rows.forEach((row) => {
        data.push(row.propInt);
        labels.push(row.propName);
      });

      audit.donut.config.data.datasets[0].data = data;
      audit.donut.config.data.labels = labels;
      audit.donut.update();
    },
    deleteRowInAudit(audit) {
      audit.rows.pop();
      this.updateDonut(audit);
    },
    addRowToAudit(audit) {
      if (audit.rows.length >= 10) {
        M.toast({
          html: "Достигнуто максимальное колличество строк",
        });
        return;
      }
      audit.rows.push({
        propName: "",
        propInt: 0,
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
        rows: [
          {
            propName: "",
            propInt: 0,
          },
        ],
        type: "",
      });
      this.initSelectColor();
      Vue.nextTick(() => {
        this.createDonut(this.audits[this.audits.length - 1]);
      });
    },
    initSelectColor() {
      Vue.nextTick(() => {
        M.FormSelect.init(document.querySelectorAll(".selectColor"));
      });
    },
    changeOcenka() {
      if (
        this.project.ocenka.type == "Успешный" ||
        this.project.ocenka.type == ""
      )
        this.project.ocenka.reason = "";
      Vue.nextTick(() => {
        M.FormSelect.init(document.querySelectorAll("select"));
      });
    },
    validateOcenka() {
      if (
        this.project.ocenka.type == "С ошибкой" &&
        this.project.ocenka.reason == ""
      ) {
        M.toast({
          html: "Оценка проекта выбрана с ошибкой, но не выбрана причина",
        });
        return false;
      }
      return true;
    },
    validateALL() {
      // console.log(
      //   "validate",
      //   this.validateMainRows() &&
      //     this.validateAudits() &&
      //     this.validateOcenka()
      // );
      return (
        this.validateMainRows() &&
        this.validateAudits() &&
        this.validateOcenka() &&
        this.validateStatusZapusk()
      );
    },
    openABmodal() {
      this.ABModal.open();
    },
    addStatusZapuskRow() {
      this.project.statusZapusk.push({
        opisanie: "",
        srok: "",
      });
      Vue.nextTick(() => {
        Kalendar.set({
          showClearBtn: true,
          showMonthBtn: true,
          showKvartalBtn: true,
          container: document.getElementById("statusZapuskDate"),
        });
      });
    },

    deleteStatusZapuskRow() {
      this.project.statusZapusk.pop();
    },
    validateStatusZapusk() {
      if (
        this.project.statusZapusk.filter((v, idx) => {
          if (!v.opisanie) {
     
            M.toast({
              html: `Вы не ввели имя для строки ${
                idx + 1
              } в статусе по запуску`,
            });
            return true;
          }
        }).length
      ) {
        return false;
      }
      return true;
    },
  },

  watch: {
    projectFromParent: function (n, o) {
      console.log(n, " IS NEW PROJ");
      this.loadProject();
    },
  },

  template: /*html*/ `

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



<div class="ocenka">
<h1 class="title is-1">Оценка</h1>
  <div class="columns">
  <div class="column is-4 p1">

  <select v-model="project.ocenka.type" @change="changeOcenka">
  <option value="">Не выбрана</option>
  <option value="Успешный">Успешный</option>
  <option value="С ошибкой">С ошибкой</option>
  </select>

 
  
  </div>
  
  <div class="column is-8 p1">
  


  <select v-model="project.ocenka.reason"  :disabled="project.ocenka.type != 'С ошибкой'">
  <option value="Нарушение регламента МИ, есть влияние на клиента/сотрудника">Нарушение регламента МИ, есть влияние на клиента/сотрудника
  </option>
  <option value="Наличие багов (не технических), влияющих на клиента, процессы компании/департамента. Сопровождающий мог проработать самостоятельно">Наличие багов (не технических), влияющих на клиента, процессы компании/департамента. Сопровождающий мог проработать самостоятельно
  </option>
<option value="Не инициировано изменение процедуры/продукта для улучшения сервиса для клиента">
Не инициировано изменение процедуры/продукта для улучшения сервиса для клиента
</option>
<option value="Не инициирована подготовка инструментов/схем и процедур обслуживания клиента для сотрудников">

Не инициирована подготовка инструментов/схем и процедур обслуживания клиента для сотрудников

</option>

  </select>
 

  </div>
  </div>

</div>


<div class="AB">
<h1 class="title is-1">
АБ
<button class="button is-danger" :disabled="!project.AB.length" @click="deleteAB()">-</button>
<button class="button is-primary" @click="openABmodal()">+</button>
</h1>








<div class="modal" id="ABModal">
<div class="modal-content">
  <h4 class="my-5 title is-4" >Выберите тип новых данных</h4>
 
  <div class="columns ">
  


  <div class="column  has-text-centered is-clickable box">
  <h3> Просто ввести число</h3>
  <input type="number" class="input is-primary">
  </div>



  <div class="column  has-text-centered box is-clickable mx-5">
  
  <table class="table  is-narrow is-fullwidth " >
<tr>
<td>Вид бизнеса</td>
<td>АБ</td>
</tr>

<tr>
<td>FMC</td>
<td></td>
</tr>

<tr>
<td>FTTB</td>
<td></td>
</tr>
<tr>
<td>B2C</td>
<td></td>
</tr>

<tr>
<td>FMC</td>
<td></td>
</tr>

<tr>
<td>FIX</td>
<td></td>
</tr>


<tr>
<td>ПК</td>
<td></td>
</tr>
</table>
  </div>



  <div class="column is-clickable box  table ">
  <table class="table is-narrow is-fullwidth ">
  <tr>
  <td>Действие</td>
  <td>дд.мм.гг</td>
  <td>дд.мм.гг</td>
 
 
  </tr>


  <tr>
  <td>Смс-рассылка</td>
  <td></td>
  <td></td>


 


  
  </tr>

  <tr> 
  <td>E-mail рассылка</td>
  <td></td>
<td></td>


  </tr>

  <tr>
  <td>Push-рассылка
  
  </td>
  <td></td>
<td></td>


  </tr>
  
  <tr>
  <td>ТВ реклама</td>
  <td></td>
<td></td>


  </tr>

  <tr>
  <td>Офсет</td>
  <td></td>
<td></td>


  </tr>

  </table>
  
  </div>
  
  
  </div>






</div>
<div class="modal-footer">
  <a href="#!" class="modal-close button is-primary">Закрыть</a>
</div>
</div>


</div>





<div class="statusZapusk">

<h3 class="title is-3">


Статус по запуску
<button class="button is-danger" :disabled="!project.statusZapusk.length" @click="deleteStatusZapuskRow">-</button>
<button class="button is-primary" @click="addStatusZapuskRow">+</button>


</h3>


<div class="if-fullwidth w100">
<div class="columns">
<div class="column is-9">Описание статуса</div>
<div>Срок</div>

</div>

<div  class="columns" v-for="(row,idx) in project.statusZapusk" :key="idx">
<div class="column is-9"><input type="text" class="input is-primary" v-model.lazy="row.opisanie"></div>
<div class="column"><input type="text" class="input is-primary datepicker" v-model.lazy="row.srok"></div>

</div>

</div>



<div id='statusZapuskDate'></div>
</div>







<div class="audits ">
<h3 class="center fluid-text title is-3">
  Голос клиента (Аудит)
    <button class="button is-danger" :disabled="!audits.length" @click="deleteAudit()">-</button>
    <button class="button is-primary" @click="addAudit()">+</button>
 </h3>  





 <div class="column box" v-for="audit,idx in audits" :key="idx">




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
<div @click="editProj" :disabled="buttonIsLoading" :class="{'is-loading': buttonIsLoading}" class="button has-text-white is-large is-primary column is-12 black-text title is-3">
    Изменить проект
</div>
</div>



</div>

    
    `,
});
