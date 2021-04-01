// setTimeout(()=>location.reload(), 3000)

let showProj = {
  data() {
    return {
      kalendar: "",
      projects: [],
      table: {
        created: false,
      },
      filterSelect: {
        bizness: "",
        zapusk: "",
        status: "",
        fdate: "",
        sdate: "",
        soprovod: "",
      },
      filterInput: {
        zakazchik: "",
        nazvanie: "",
      },
      filterHTML: {
        opisanie: "",
      },
      filterOcenka:"all",
      sort: {
        column: "",
        r: "",
      },
      employees: [],

      projectForModal: {},
    };
  },
  mounted: function () {
    axios.get("../vendor/showProj.php").then(
      (res) => {
        this.projects = res.data.reverse();
        this.projects.forEach((proj) => {
          let htmlEl = document.createElement("div");
          htmlEl.innerHTML = proj.opisanieBody;

          proj.opisanieBodyCuted =
            htmlEl.innerText.length < 50
              ? htmlEl.innerText
              : htmlEl.innerText.slice(0, 50) + "...";
          proj.opisanieBodyHTML = htmlEl;
        });
      },
      (err) => {
        M.toast({
          html: "Ошибка " + err,
        });
      }
    );

    axios.get("../vendor/showEmployees.php").then((res) => {
      this.employees = res.data;

      Vue.nextTick(() => {
        this.kalendar = Kalendar.set();
        M.FormSelect.init(document.querySelectorAll("select"), {
          dropdownOptions: {
            constrainWidth: false,
          },
        });
      });
    });

    // this.modal.modal = M.Modal.init(document.getElementById('projectModal'));
    // this.modal.modal.$overlay[0].onclick  = ()=>{
    //     this.modal.modal.close();
    // }
  },
  methods: {
    resetFilter: function () {
      for (prop in this.filterSelect) {
        this.filterSelect[prop] = "";
      }
      for (prop in this.filterInput) {
        this.filterInput[prop] = "";
      }
      this.filterHTML.opisanie = "";
      this.sort.r = 1;
      this.sort.column = "";
      this.filterOcenka = "all"
      Vue.nextTick(function () {
        M.FormSelect.init(
          document.querySelectorAll("select", {
            dropdownOptions: {
              constrainWidth: false,
            },
          })
        );
      });
    },
    sortChange(column) {
      if (this.sort.column == column) {
        if (this.sort.r == 1) {
          this.sort.r = -1;
        } else {
          this.sort.r = 1;
        }
        this.sort.column = "";
        this.sort.column = column;
      } else {
        this.sort.column = column;
        this.sort.r = 1;
      }
    },
    openProject(project) {
   
      this.projectForModal = project;

    },
    exportToExcel: function () {
      var tableToExcel = (function () {
        var uri = "data:application/vnd.ms-excel;base64,",
          template =
            '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
          base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)));
          },
          format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
              return c[p];
            });
          };
        return function (table, name) {
          if (!table.nodeType) table = document.getElementById(table);
          var ctx = {
            worksheet: name || "Worksheet",
            table: table.innerHTML,
          };
          window.location.href = uri + base64(format(template, ctx));
        };
      })();
      this.table.created = true;
      Vue.nextTick(() => {
        tableToExcel(document.getElementById("allTable"), "Проекты");
        this.table.created = false;
      });
    },
    editProj(project) {
 
      this.$emit("edit-proj", project);

    },
  },
  watch: {},
  computed: {
    projectsFiltred: function () {
      return this.projects
        .filter((v, i, arr) => {
          for (prop in this.filterSelect) {
            if (this.filterSelect[prop]) {
              if (v[prop] != this.filterSelect[prop]) return false;
            }
          }
          for (prop in this.filterInput) {
            if (this.filterInput[prop]) {
              if (
                !v[prop]
                  .toUpperCase()
                  .includes(this.filterInput[prop].toUpperCase())
              )
                return false;
            }
          }
          if (this.filterHTML.opisanie.length) {
            if (
              !v.opisanieBodyHTML.innerText.includes(this.filterHTML.opisanie)
            ) {
              return false;
            }
          }
          if(this.filterOcenka != 'all'){
            if(this.filterOcenka == '' && !v.ocenka.type ){return true;}
          return  ((v.ocenka.type === this.filterOcenka));
          }
          return true;
        })
        .sort((a, b) => {
          if (!this.sort.column) return 1;
          if (this.sort.column == "sdate" || this.sort.column == "fdate") {
            let fakeA = a[this.sort.column];
            let fakeB = b[this.sort.column];
            fakeA = fakeA.split(" ").reverse().join(" ");
            fakeB = fakeB.split(" ").reverse().join(" ");
            fakeA = fakeA.replace(/\s/g, "");
            fakeB = fakeB.replace(/\s/g, "");
            if (fakeA > fakeB) return 1 * this.sort.r;
            else return -1 * this.sort.r;
          } else {
            if (a[this.sort.column] > b[this.sort.column])
              return 1 * this.sort.r;
            else {
              return -1 * this.sort.r;
            }
          }
        });
    },
  },
  components: {
    projectModal: projectModal,
  },
  template: `
  <div>

      <div class="block">
  
  
          <div class="center is-flex is-justify-content-center is-align-items-center" >
              <h1 class="title is-1 mx-2">Проекты</h1> 
              
              <div class="button is-small is-primary mx-2" @click="resetFilter">СБРОС</div>
  
              <div class="button z-depth-3" mx-2 style="width: 40px; padding: 0; border-radius: 50%;" @click="exportToExcel">
                  <img src="./EX.png" width="100%" style="border-radius: 50%;" alt=""></div>
                  <div class="is-absolute is-right-0">
                      <h5 class="is title is-5 m-0">Оценка:</h5>
                      <select  v-model="filterOcenka">
                          <option value="all" selected>Все</option>
                          <option value="">Без оценки</option>
                          <option value="Успешно">Успешно</option>
                          <option value="С ошибкой">С ошбкой</option>
                      </select>
                  </div>
          </div>
  
      </div>
  
      <table id="allTable" v-show="false" v-if="table.created">
  
          <tr>
  
              <th class="" @click="sortChange('fdate')">Дата спуска</th>
              <th class="" @click="sortChange('sdate')">Дата запуска</th>
              <th class="" @click="sortChange('bizness')">Вид бизнеса</th>
              <th class="" @click="sortChange('zapusk')">Тип запуска </th>
              <th class="" @click="sortChange('nazvanie')">Название</th>
              <th class="" @click="sortChange('opisanie')">Описание</th>
              <th class="" @click="sortChange('soprovod')">Сопровождающий</th>
              <th class="" @click="sortChange('zakazchik')">Заказчик</th>
              <th class="" @click="sortChange('status')">Статус</th>
  
          </tr>
  
  
  
  
  
  
          <tr class="columns hover__bg" v-for="project in projectsFiltred" @click="openProject(project)">
              <td class="">{{project.fdate}}</td>
              <td class="">{{project.sdate}}</td>
              <td class="">{{project.bizness}}</td>
              <td class="">{{project.zapusk}}</td>
              <td class="">{{project.nazvanie}}</td>
              <td class="">{{project.opisanie}}</td>
              <td class="">{{project.soprovod}}</td>
              <td class="">{{project.zakazchik}}</td>
              <td class="">{{project.status}}</td>
  
          </tr>
  
  
  
      </table>
  
  
  
  
  
      <div class="columns center" style="padding-right:16px">
  
  
          <div class="column is-1 sort__button " @click="sortChange('fdate')"> <button class="button is-small is-primary " :class="{
              'is-danger' :  sort.column == 'fdate' && sort.r ==1,
              'is-info' :  sort.column == 'fdate' && sort.r ==-1
            }">Дата спуска
              </button> </div>
          <div class="column is-1 sort__button  " @click="sortChange('sdate')"> <button class="button is-small is-primary" :class="{
              'is-danger' :  sort.column == 'sdate' && sort.r ==1,
              'is-info' :  sort.column == 'sdate' && sort.r ==-1
            }">Дата
                  запуска</button> </div>
          <div class="column is-1 sort__button  " @click="sortChange('bizness')"> <button class="button is-small is-primary" :class="{
              'is-danger' :  sort.column == 'bizness' && sort.r ==1,
              'is-info' :  sort.column == 'bizness' && sort.r ==-1
            }"> Вид
                  бизнеса</button></div>
          <div class="column is-1 sort__button  " @click="sortChange('zapusk')"> <button class="button is-small is-primary" :class="{
              'is-danger' :  sort.column == 'zapusk' && sort.r ==1,
              'is-info' :  sort.column == 'zapusk' && sort.r ==-1
            }">Тип
                  запуска</button> </div>
          <div class="column is-1 sort__button  " @click="sortChange('nazvanie')"> <button
                  class="button is-small is-primary" :class="{
                      'is-danger' :  sort.column == 'nazvanie' && sort.r ==1,
                      'is-info' :  sort.column == 'nazvanie' && sort.r ==-1
                    }">Название</button> </div>
          <div class="column is-2 sort__button  " @click="sortChange('opisanie')"> <button
                  class="button is-small is-primary"  :class="{
                      'is-danger' :  sort.column == 'opisanie' && sort.r ==1,
                      'is-info' :  sort.column == 'opisanie' && sort.r ==-1
                    }">Описание</button> </div>
          <div class="column is-2 sort__button  " @click="sortChange('soprovod')"> <button
                  class="button is-small is-primary" :class="{
                    'is-danger' :  sort.column == 'soprovod' && sort.r ==1,
                    'is-info' :  sort.column == 'soprovod' && sort.r ==-1
                  }">Сопровождающий</button> </div>
          <div class="column is-2 sort__button  " @click="sortChange('zakazchik')"> <button
                  class="button is-small is-primary"  :class="{
                      'is-danger' :  sort.column == 'zakazchik' && sort.r ==1,
                      'is-info' :  sort.column == 'zakazchik' && sort.r ==-1
                    }">Заказчик</button> </div>
          <div class="column is-1 sort__button  " @click="sortChange('status')"> <button
                  class="button is-small is-primary"  :class="{
                      'is-danger' :  sort.column == 'status' && sort.r ==1,
                      'is-info' :  sort.column == 'status' && sort.r ==-1
                    }">Статус</button> </div>
  
  
  
      </div>
  
  
      <div class="columns" style="padding-right:16px; border-bottom: 2px solid #26a69a; padding-bottom: 10px; margin-bottom: 5px;">
          <div class="column is-1"><input type="text" class="datepicker input" v-model.lazy="filterSelect.fdate"></div>
          <div class="column is-1"><input type="text" class="datepicker input" v-model.lazy="filterSelect.sdate"></div>
          <div class="column is-1 p-1">
              <select  v-model="filterSelect.bizness" id="bizness">
                  <option value="" selected>Вид бизнеса</option>
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
          <div class="column is-1 p-1">
  
              <select  v-model="filterSelect.zapusk" id="zapusk">
                  <option value="" selected>Тип запуска</option>
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
          <div class="column is-1"><input type="text" class="input" v-model="filterInput.nazvanie"></div>
          <div class="column is-2"><input type="text" class="input" v-model="filterHTML.opisanie"></div>
          <div class="column is-2 p-1">
  
              <select v-model="filterSelect.soprovod" id="soprovod">
                  <option value="" selected>Сопровождающий</option>
                  <option v-for="employee in employees" :value="employee['full_name']">{{employee['full_name']}}
                  </option>
              </select>
  
  
          </div>
          <div class="column is-2"><input type="text" class="input" v-model="filterInput.zakazchik"></div>
  
  
      
  
          <div class="column is-1 p-1"> <select  v-model="filterSelect.status" id="status">
                  <option value="" selected>Статус      </option>
                  <option value="В работе">В работе </option>
                  <option value="Выполнено">Выполнено </option>
                  <option value="Отложено">Отложено</option>
                  <option value="Отменено">Отменено</option>
  
  
              </select></div>
  
  
  
      </div>
      <div style="max-height: 75vh; overflow-y: auto; overflow-x: hidden;">
  
  
          <div class="columns hover__bg p-1" v-for="project in projectsFiltred" @click="openProject(project)">
              <div class="column is-1">{{project.fdate}}</div>
              <div class="column is-1">{{project.sdate}}</div>
              <div class="column is-1">{{project.bizness}}</div>
              <div class="column is-1">{{project.zapusk}}</div>
              <div class="column is-1">{{project.nazvanie}}</div>
              <div class="column is-2">{{project.opisanieBodyCuted}}</div>
              <div class="column is-2">{{project.soprovod}}</div>
              <div class="column is-2">{{project.zakazchik}}</div>
              <div class="column is-1">{{project.status}}</div>
  
          </div>
      </div>
  
  
  
    
  
      <project-modal :project.sync='projectForModal' v-on:edit-proj="editProj" show-donut="true"></project-modal>
      
      
      </div>
       `,
};
