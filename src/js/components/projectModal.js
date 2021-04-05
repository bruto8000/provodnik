let projectModal = {
  props: ["project", "showDonut"],

  data() {
    return {
      modal: {},

      projectTypes: {
        public: "Публичный",
        private: "Приватный",
        secret: "Секретный",
      },

      currentProject: {
  
        ocenka: {

        
          type : "",
          reason: ""
        }
      },
    };
  },
  watch: {
    project: function (n, o) {

      if (!n.id) return;
      if (this.currentProject.id == n.id) {
       this.initProject(); 
        
     
        return;
      }

      this.destroyDonuts();
      this.destroyGrafiks();
      if(this.currentProject && this.currentProject.ocenka){
      if(this.currentProject.ocenka.type == 'С ошибкой' && this.currentProject.ocenka.reason == '' ){
        console.log('С ошибкой? но без?')
        this.currentProject.ocenka.type = '';
        this.closeReasonModal();
      }
    }
        this.currentProject = n;
        if(!this.currentProject.ocenka.type)
        this.currentProject.ocenka = {
          type : "",
          reason: ""
        }
      
        this.initProject();

   
    
    },
  },
  computed: {},
  activated(){
 
  },
  mounted() {

    this.modal = M.Modal.init(document.getElementById("projectModal"), {
      inDuration: 0,
      outDuration: 0,
      onCloseEnd: function () {
      

        this.$emit("update:project", { id: null });
      }.bind(this),
    });
    this.reasonModal = M.Modal.init(document.getElementById("reasonModal"), {
      inDuration: 0,
      outDuration: 0,
      onCloseEnd: function () {
     
      }.bind(this),
    });
    this.modal.$overlay[0].onclick = () => {
      this.modal.close();
    };
    this.reasonModal.$overlay[0].onclick = () => {
      this.reasonModal.close();
    };
  },
  methods: {
    createDonuts(audits) {
      if (!audits) return;
      audits.forEach((audit) => {
       
        if (!audit || audit.donutProjectModal) {
          return;
        }
        let ctx = document
          .getElementById("DONUT" + this.currentProject.audits.indexOf(audit))
          .getContext("2d");
        let data = [];
        let labels = [];
        let colors = [];
        audit.rows.forEach((row) => {
          data.push(row.propInt);
          labels.push(
            row.propName.length > 20
              ? row.propName.slice(0, 20) + "..."
              : row.propName
          );
        });
        audit.donutProjectModal = new Chart(ctx, {
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
                  "#cddc39",
                ].sort((v) => {
                  return Math.floor(Math.random() * 10) > 5 ? 1 : -1;
                }),
              },
            ],
            labels: labels,
          },

          // These labels appear in the legend and in the tooltips when hovering different arcs
        });
      });
    },
    createGrafiks(AB) {
      if (!AB) return;
      AB.forEach((table) => {
       
        if (!table || table.type == 'small') {
          return;
        }
        let ctx = document
          .getElementById("line" + this.currentProject.AB.indexOf(table));
       
     
      
      
        table.lineProjectModal = new Chart(ctx, {
          type: 'line',
          data: {
              labels: table.range,
              datasets: table.TRs.map((TR,idxOfTR)=>{
                return {
                  data: TR.inputs.map(input=>input.value),
                  label: TR.type,
                  fill: false,
                  borderColor: table.colors[idxOfTR],
                  backgroundColor : table.colors[idxOfTR]
                }
              })
            
          },

      });


      });
    },
    destroyDonuts() {
      if (!this.currentProject.audits) return;
      this.currentProject.audits.forEach((audit) => {
        if (audit.donutProjectModal) audit.donutProjectModal.destroy();  audit.donutProjectModal = null;
      });
    },
    destroyGrafiks() {
      if (!this.currentProject.AB) return;
      this.currentProject.AB.forEach((table) => {
        if (table.type == 'big' && table.lineProjectModal) {table.lineProjectModal.destroy(); table.lineProjectModal = null;}
      });
    },
    editProject() {
      this.destroyDonuts();
      this.destroyGrafiks();
      this.$emit("edit-proj", this.currentProject);
      // location.replace('./editProj.html?'+this.currentProject.id);
    },
    toolTipsInit() {
      document.querySelectorAll(".cut-to-20-ch").forEach((th) => {
        if (th.innerText.length > 21) {
          th.dataset.tooltip = th.innerText;
          th.innerText = th.innerText.slice(0, 20);
          th.dataset.position = "bottom";
          th.classList.toggle("tooltiped");
        }
      });

      if (!window.tooltips) {
        window.tooltips = [];
      }

      window.tooltips.push(
        M.Tooltip.init(document.querySelectorAll(".tooltiped"))
      );
    },
    ocenkaInit() {

  
    M.FormSelect.init(document.querySelectorAll(".select-projectModal"));

    this.ocenkaReasonTooltipInit();

    },
    initProject(){
      this.modal.open();
      Vue.nextTick(() => {
        this.createDonuts(this.project.audits);
        this.createGrafiks(this.project.AB);
        this.toolTipsInit();
 
      
        
        this.ocenkaInit();
      });
    },
    changeOcenka() {
    
      if (
        this.currentProject.ocenka.type == "Успешно" ||
        this.currentProject.ocenka.type == ""
      ){
        this.currentProject.ocenka.reason = "";
        this.changeOcenkaOnServ();
      }else{
this.openReasonModal();
        }
      
    },
    openReasonModal(){
      this.reasonModal.open();
      M.FormSelect.init(document.querySelectorAll(".selectReason"));
    },
    closeReasonModal(){
      this.reasonModal.close();
      this.$forceUpdate();

this.ocenkaReasonTooltipInit();
this.changeOcenkaOnServ();
      // if(this.currentProject.ocenka.reason == ""){
      //   this.currentProject.ocenka.type ='Без оценки';
      // }
    },
    ocenkaReasonTooltipInit(){
      this.$nextTick().then(()=>{

        M.Tooltip.init(document.querySelectorAll('.ocenkaReason'));
      })
    },
    changeOcenkaOnServ(){
   
      axios.post('./vendor/changeOcenka.php', JSON.stringify({
        id: this.currentProject.id,
        ocenka: this.currentProject.ocenka
      }))
    }
    
  },
  template: /*html*/`


  <div id="projectModal" class="modal">
  
  
  
      <div class="modal-content">
          <div class="right">
  
            
  
  
  
      
              <select @change="changeOcenka" v-model="currentProject.ocenka.type" class="select-projectModal">
                  <option value=""><span class="mdi  mdi-alert">Без оценки</span> </option>
                  <option value="Успешно"><span class="mdi  mdi-check">Успешно</span></option>
                  <option value="С ошибкой"><span class="mdi  mdi-close">С ошибкой</span></option>
        
              </select>
  
              
  <div v-if="currentProject.ocenka.type == 'С ошибкой' && currentProject.ocenka.reason != ''" data-position="bottom" :data-tooltip="currentProject.ocenka.reason" class="ocenkaReason tooltipped has-text-centered">Причина<span class="mdi mdi-cursor-default"></span> </div>
       
          </div>
          <h1 class="title is-2">{{currentProject.nazvanie}}</h1>
          <p>{{currentProject.opisanie}} </p>
          <div v-html="currentProject.opisanieBody">
      
          </div>
      
      
      
      
      
          <div class="audits "
              v-show="showDonut && currentProject.audits && currentProject.audits.length">
              <h3 class="center fluid-text title is-2">
                 Доп.информация (Аудит)
      
              </h3>
      
      
      
      
      
              <div class="box" v-for="audit,idx in currentProject.audits" :key="idx">
      
      
      
      
            
      
                  <h4 class="center fluid-text title is-4">{{audit.name}}</h4>
                  <div class="columns">
                      <div class="column is-6 is-offset-3 title-is-5 has-text-centered">
                          Тип: {{ projectTypes[audit.type] }}
      
                      </div>
      
      
                  </div>
      
                  <div class="columns">
                      <div class="column is-6">
      
                          <table class="table  centered is-hoverable is-fullwidth" >
                              <thead>
                                  <tr>
                                      <th class="cut-to-20-ch">{{audit.subname}}</th>
                                      <th>Кол-во</th>
      
      
                                  </tr>
                              </thead>
      
                              <tbody>
                                  <tr v-for="row,rowIdx in audit.rows">
                                      <td class="truncate cut-to-20-ch"  :id="idx+rowIdx">{{row.propName}}</td>
                                      <td>{{row.propInt}}</td>
      
      
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
  
  
          <div class="AB"    v-show=" currentProject.AB && currentProject.AB.length">
  
  
  
              <h3 class="center fluid-text title is-2">
                  Абонентская База
       
               </h3>
  
  <div class="box" v-for="(table,idx) in currentProject.AB" :key="idx">
  
  
      <div class="columns">
          <canvas :id="'line'+idx">
  
          </canvas>
      </div>
  </div>
  
  
              
  
  
          </div>
  
  
  
          <div class="modal-footer">
  
  
              <a class="modal-close btn-flat" @click="editProject()">Изменить</a>
              <a class="modal-close  btn-flat">Закрыть</a>
          </div>
      </div>
      
      
      <div id="reasonModal" class="modal">
          <div class="modal-content">
            Выберите причину:
  
  
  
         <select class="selectReason" @change.lazy="closeReasonModal" v-model="currentProject.ocenka.reason"  >
                  <option  value="Нарушение регламента МИ, есть влияние на клиента/сотрудника">Нарушение
                      регламента МИ, есть влияние на клиента/сотрудника
                  </option>
                  <option 
                      value="Наличие багов (не технических), влияющих на клиента, процессы компании/департамента. Сопровождающий мог проработать самостоятельно">
                      Наличие багов (не технических), влияющих на клиента, процессы компании/департамента.
                      Сопровождающий мог проработать самостоятельно
                  </option>
                  <option 
                      value="Не инициировано изменение процедуры/продукта для улучшения сервиса для клиента">
                      Не инициировано изменение процедуры/продукта для улучшения сервиса для клиента
                  </option>
                  <option 
                      value="Не инициирована подготовка инструментов/схем и процедур обслуживания клиента для сотрудников">
  
                      Не инициирована подготовка инструментов/схем и процедур обслуживания клиента для
                      сотрудников
  
                  </option>
  
              </select>
          </div>
          <div class="modal-footer">
            <a  @click="closeReasonModal" class=" button is-primary">Закрыть</a>
          </div>
        </div>
      </div> 
      
      
      
      
  `,
};
