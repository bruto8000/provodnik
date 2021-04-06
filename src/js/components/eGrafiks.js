Vue.component("eGrafiksComponent", {
  props: ["eGrafiks"],

  data() {
    return {
      datesFromXSXZapusk: {},
      datesFromXSXPlanFact: {},
      selectValuesPlanFact: [],
      selectValuesZapusk: [],
      oJS: [],
      oJS2: [],
      watcherNeed : true,
      filename: "",
      loading: false,
      colors: [
        "#c2185b",
        "#3949ab",
        "#2196f3",
        "#00bcd",
        "#009688",
        "#66bb6a",
        "#f4ff81",
        "#f4511e",
        "#00e676",
      ],
      isComponentInited: false,
      selectGrafikModal: null,
      imageCopyModal: null,
      fileloadstatus: "waiting", //waiting, loaded. parsed
      eGrafikImg: "",
      whiteBackgroundPlugin : {
        beforeDraw: function(c) {
            var ctx = c.chart.ctx;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, c.chart.width, c.chart.height);
        }
      }
      // eGrafiks: [
      //   //   {type: "", //zapusk | planFact
      //   //   range : [dates],
      //   //   fdate: "",
      //   //   sdate: "",
      //   //   selectedIdx: [],
      //   //   grafik: {}
      //   // }
      // ],
    };
  },

   mounted() {
  // console.log('mounted')
  this.initimageCopyModal();


  },
  methods: {
    loadFile(e) {
      this.loading = true;
      let reader = new FileReader();
      reader.readAsArrayBuffer(e.target.files[0]);
      this.filename = e.target.files[0].name;
      reader.onload = () => {
        this.parseFile(reader.result);
        this.loading = false;
        // this.initDates();
        // this.initSelect();
        if (this.fileloadstatus == "parsed") {
          this.initselectGrafikModal();
          
          // this.eGrafiks.forEach((eGrafik) => {
          //   eGrafik.loadType = "fl";
          // });
        }
      };
    },
    parseFile(result) {
      var data = new Uint8Array(result);
      try {
        let wb = XLSX.read(data, {
          type: "array",
          sheets: ["Прогноз По Запускам", "План Факт 1 Линия"],
          bookDeps: true,
          PRN: true,
          xlfn: true,

        });
        // wb.Sheets["План Факт 1 Линия"]['!ref'] = 'A1:ZZ100';
        // console.log(wb);

        let oJS = XLSX.utils.sheet_to_json(wb.Sheets["Прогноз По Запускам"], {
          raw: false,
        });

        let oJS2 = XLSX.utils.sheet_to_json(wb.Sheets["План Факт 1 Линия"], {
          raw: false,
          range: 0,
        });
        wb = null;
        delete wb;
  
        let values = Object.values(oJS[0]);
        let keys = Object.keys(oJS[0]);

        let normalizeFunction = function (values) {

          let format = 'dd/mm/yy'
          values.forEach((v, idx) => {
            let splited = v.split("/");
            if (splited.length == 3) {
              if(splited[1]>13)format = 'mm/dd/yy';
              if(format == 'mm/dd/yy'){
                let helper = splited[0];
                splited[0] = splited[1];
                splited[1] = helper;
              }
              splited.forEach((sv, sidx) => {
                if (sv.length == 1) {
                  splited[sidx] = "0" + sv;
                  values[idx] = splited.join("/");
                }
              });
            }
          });
          
          return values;
        };
        values = normalizeFunction(values);

        this.datesFromXSXZapusk = {
          keys: keys,
          values: values,
        };

        values = Object.values(oJS2[1]);
        keys = Object.keys(oJS2[1]);

        values = normalizeFunction(values);
        this.datesFromXSXPlanFact = {
          keys: keys,
          values: values,
        };

        let iterableArr = oJS.slice(2);
        iterableArr.forEach((row, idx) => {
          let selectValue = {
            label: `${row["__EMPTY_4"]} ${row["__EMPTY_2"]} ${row["__EMPTY_3"]}`,
            idx: idx,
          };
          this.selectValuesZapusk.push(selectValue);
        });
        iterableArr = oJS2.slice(3);
        iterableArr.forEach((row, idx) => {
          let selectValue = {
            label: row["__EMPTY"],
            idx: idx,
          };
          this.selectValuesPlanFact.push(selectValue);
        });

        this.oJS = oJS;
        this.oJS2 = oJS2;
      } catch (e) {
        M.toast({
          html:
            "Не удалось загрузить файл. Убедитесь в правильности загружаемого файла." +
            e.message,
        });
        return;
      }
      this.fileloadstatus = "parsed";
    },
    dateRange: function (date1, date2, splitString = " ", yearLength = 4) {
      ///DATE
      let parts = date1.split(" ");

      let startDate;
      let endDate;
      if (parts.length === 3) {
        startDate = new Date(parts[2], parts[1] - 1, parts[0]);

        parts = date2.split(" ");

        endDate = new Date(parts[2], parts[1] - 1, parts[0]);
      } else if (parts.length == 2) {
        if (isNaN(Number(parts[0]))) {
          switch (parts[0]) {
            case "I":
              startDate = new Date(parts[1], "0", "1");
              endDate = new Date(parts[1], "3", "0");
              break;
            case "II":
              startDate = new Date(parts[1], "3", "1");
              endDate = new Date(parts[1], "6", "0");
              break;
            case "III":
              startDate = new Date(parts[1], "6", "1");
              endDate = new Date(parts[1], "9", "0");
              break;
            case "IV":
              startDate = new Date(parts[1], "9", "1");
              endDate = new Date(parts[1], "11", "31");
              break;
          }
        } else {
          //MONTH SELECTED

          startDate = new Date(parts[1], parts[0] - 1, "1");
          endDate = new Date(parts[1], parts[0], "0");
        }
      } else {
        startDate = new Date(parts[0], 0, 1);
        endDate = new Date(parts[0], 11, 31);
      }

      if (endDate < startDate) {
        let y;
        y = startDate;
        startDate = endDate;
        endDate = y;
      }

      let dates = [];
      //to avoid modifying the original date
      const theDate = new Date(startDate);

      while (theDate < endDate) {
        let dateForPush = "";

        if (theDate.getDate() < 10) {
          dateForPush += "0" + theDate.getDate() + splitString;
        } else {
          dateForPush += theDate.getDate() + splitString;
        }

        if (theDate.getMonth() < 9) {
          dateForPush += "0" + (theDate.getMonth() + 1) + splitString;
        } else {
          dateForPush += theDate.getMonth() + 1 + splitString;
        }
        if (yearLength == 4) {
          dateForPush += theDate.getFullYear();
        } else {
          dateForPush += theDate.getFullYear().toString().slice(2, 4);
        }
        dates.push(dateForPush);
        theDate.setDate(theDate.getDate() + 1);
      }

      let dateForPush = "";

      if (theDate.getDate() < 10) {
        dateForPush += "0" + theDate.getDate() + splitString;
      } else {
        dateForPush += theDate.getDate() + splitString;
      }

      if (theDate.getMonth() < 9) {
        dateForPush += "0" + (theDate.getMonth() + 1) + splitString;
      } else {
        dateForPush += theDate.getMonth() + 1 + splitString;
      }
      if (yearLength == 4) {
        dateForPush += theDate.getFullYear();
      } else {
        dateForPush += theDate.getFullYear().toString().slice(2, 4);
      }
      dates.push(dateForPush);

      // dates //

      return dates;
    },
    initGrafik(eGrafik) {

     
  
      if (eGrafik.loadType == "fl") {
        if (!(this.checkDates(eGrafik) && this.checkSelected(eGrafik))) {
          return;
        }

        eGrafik.range = this.dateRange(eGrafik.fdate, eGrafik.sdate, "/", 2);

        eGrafik.datasets = this.getValues(eGrafik);
        this.addNagruzkasDataset(eGrafik)
      }
     
      if (eGrafik.grafik) {
        this.updateGrafik(eGrafik);
        return;
      }


 
      this.createGrafik(eGrafik);
  
    },
    addNagruzkasDataset(eGrafik){

if(!eGrafik.nagruzkas || !this.validateNagruzkaDataset(eGrafik)) return;
      eGrafik.nagruzkas.forEach(nagruzka=>{



        let  dataset = {
          label: nagruzka.label.replace(
            '"',
            '\"'
          ).replace("'", "\'"),
          data: [],
          radius: 12,
          fill: false,
      borderColor: 'orange',
      backgroundColor: 'orange',
      pointStyle: "triangle",
      hoverRadius: "16"
        };

        let normalizedDate = [nagruzka.date.split(' ')[0] ,  nagruzka.date.split(' ')[1] , nagruzka.date.split(' ')[2].slice(2)].join('/');
        eGrafik.range.forEach(date=>{
        
         if(normalizedDate == date){
           dataset.data.push(nagruzka.value)
         }else{

           dataset.data.push(null)
         }
        })
eGrafik.datasets.push(dataset);


      })


    },
    validateNagruzkaDataset(eGrafik){
    
      if(   eGrafik.nagruzkas &&
        
      eGrafik.nagruzkas.find(nagruzka=>{
return (!nagruzka.label || !nagruzka.date || !nagruzka.value);
    })
      ){
        console.log(!nagruzka.label )
        console.log(!nagruzka.date )
        console.log(!nagruzka.value )
        M.toast({html:'Комментарий на графике заполнен не полностью'});
        return false;
      }
      return true;
      // forEach(nagruzka=>{

      //   if(!nagruzka.label || nagruzka.date || nagruzka.value){
      //     M.toast({html:"Комментарий на графике заполнен не полностью"});
      //   isValidated = false;
      //     return;
      //   }
    },
    createGrafik(eGrafik) {
console.log('creating Egrafik', eGrafik)
      let ctx = document.getElementById(
        "eGrafik" + this.eGrafiks.indexOf(eGrafik)
      );
      eGrafik.grafik = new Chart(ctx, {
        type: "line",
        data: {
          labels: eGrafik.range.slice(),
          datasets: eGrafik.datasets.slice(),
        },
        options : {
          onClick	: this.eGrafikClickHandler,
          legend: {
            display: true,
            position: 'bottom',
            labels: {
                usePointStyle: true ,
          
            }
        },

        tooltips: {
          callbacks: {
              label: function(tooltipItem, data) {
              
     
                if(data.datasets[tooltipItem.datasetIndex].pointStyle == 'triangle')return data.datasets[tooltipItem.datasetIndex].label;
                  var label = data.datasets[tooltipItem.datasetIndex].label || '';

                  if (label) {
                      label += ': ';
                  }
                  label += Math.round(tooltipItem.yLabel * 100) / 100;
                  return label;
              }
              }
             },
             scales: {
              xAxes: [{
                  gridLines: {
                      display:false
                  }
              }],
              yAxes: [{
                  gridLines: {
                      display:false
                  }   
              }]
          }
    },
    plugins: [this.whiteBackgroundPlugin]
      });
      
    },
    updateGrafik(eGrafik) {
      eGrafik.grafik.data.labels = eGrafik.range.slice();
      eGrafik.grafik.data.datasets = eGrafik.datasets.slice();
      eGrafik.grafik.update();
    },
    async initDates(offMonth, offKvartal,datepickerClass ='.datepickerEGrafik') {
      await this.$nextTick();
      Kalendar.set({
        showMonthBtn: !offMonth,
        showKvartalBtn: !offKvartal,
      }, datepickerClass);
    },
    async initSelect() {
      await this.$nextTick();
      M.FormSelect.init(document.querySelectorAll("select"));
    },
    checkDates(eGrafik) {
      if (!eGrafik.sdate || !eGrafik.fdate) {
        M.toast({ html: "Даты не выбраны." });
        return false;
      }
      return true;
    },
    checkSelected(eGrafik) {
      if(eGrafik.type == 'zapusk'){
      if (!eGrafik.selectedIdx.length) {
        M.toast({ html: "Активности  не выбраны." });
        return false;
      }
    }else {
      if (eGrafik.selectedIdx === '') {
        M.toast({ html: "Активность  не выбрана." });
        return false;
      }
    }

      return true;
    },
    getValues(eGrafik) {
      let arrOfEmployees = [];


      if(eGrafik.type =='zapusk'){

        eGrafik.selectedIdx.forEach((idxOfSelected, idxOfArr) => {
        let currentRow = this.oJS[idxOfSelected + 2];
       let  employeeObject = {
          label: this.selectValuesZapusk[idxOfSelected].label.replaceAll(
            `"`,
            `\"`
          ).replaceAll("'", "\'"),
          data: [],
          fill: false,
          borderColor: this.colors[idxOfArr],
          backgroundColor: this.colors[idxOfArr],
        };

        eGrafik.range.forEach((date) => {
          if (this.datesFromXSXZapusk.values.includes(date)) {
            let key = this.datesFromXSXZapusk.keys[
              this.datesFromXSXZapusk.values.indexOf(
                this.datesFromXSXZapusk.values.find((v) => date == v)
              )
            ];
            employeeObject.data.push(Math.round(currentRow[key]) || 0);


   
          } else {
            
            employeeObject.data.push(0);
          }
        });

        arrOfEmployees.push(employeeObject);
      });

      }else{

  /// Прогноз ГРАФИК
       let currentRow = this.oJS2[eGrafik.selectedIdx + 3];


     let  employeeObject = {
        label: "Прогноз " + this.selectValuesPlanFact[eGrafik.selectedIdx].label.replaceAll(
          `"`,
          `\"`
        ).replaceAll("'", "\'"),
        data: [],
        fill: false,
        borderColor: 'red',
        backgroundColor: 'red'
      };

      eGrafik.range.forEach((date) => {
        if (this.datesFromXSXPlanFact.values.includes(date)) {
          let key = this.datesFromXSXPlanFact.keys[
            this.datesFromXSXPlanFact.values.indexOf(
              this.datesFromXSXPlanFact.values.find((v) => date == v)
            )
          ];

  
          employeeObject.data.push(Math.round(currentRow[key]) || 0);
        } else {
          employeeObject.data.push(0);
        }
      });


      arrOfEmployees.push(employeeObject);

  /// ФАКТ ГРАФИК

  if(eGrafik.fact){
      employeeObject = {
        label: "Факт " + this.selectValuesPlanFact[eGrafik.selectedIdx].label.replaceAll(
          `"`,
          `\"`
        ).replaceAll("'", "\'"),
        data: [],
        fill: false,
        borderColor: 'blue',
        backgroundColor: 'blue',
      };


    
      eGrafik.range.forEach((date) => {
        if (this.datesFromXSXPlanFact.values.includes(date)) {
          let key = this.datesFromXSXPlanFact.keys[
            this.datesFromXSXPlanFact.values.indexOf(
              this.datesFromXSXPlanFact.values.find((v) => date == v)
            )
          ];

  
          employeeObject.data.push(Math.round(currentRow[Object.keys(currentRow)[Object.keys(currentRow).indexOf(key) + 1]]) || 0);
        } else {
          employeeObject.data.push(0);
        }
      });


      arrOfEmployees.push(employeeObject);

    }


      }

      
 
    

        
 
      return arrOfEmployees;
    },
    addGrafPlanFact() {
      this.watcherNeed = false;
      this.eGrafiks.push({
        type: "planFact", //zapusk | planFact
        range: [],
        fdate: "",
        sdate: "",
        selectedIdx: '',
        grafik: null,
        loadType: "fl",
        fact: false,
        nagruzkas: []
      });
      this.initDates();
      this.initSelect();
      this.selectGrafikModal.close();
  
    },
    addGrafZapusk() {
 
      this.watcherNeed = false;
      this.eGrafiks.push({
        type: "zapusk", //zapusk | planFact
        range: [],
        fdate: "",
        sdate: "",
        selectedIdx: [],
        grafik: null,
        loadType: "fl",
        nagruzkas: []
      });

      this.initDates();
      this.initSelect();
      this.selectGrafikModal.close();
 
    },
    initselectGrafikModal() {
      this.selectGrafikModal = M.Modal.init(
        document.getElementById("selectGrafikModal")
      );
    },
    initimageCopyModal() {
      this.imageCopyModal = M.Modal.init(
        document.getElementById("imageCopyModal")
      );
    },
    openGrafSelectModal() {
      this.selectGrafikModal.open();
    },
    unlockGrafik(eGrafik){
      eGrafik.loadType = 'fl';
      this.initSelect();
    },
    addNagruzka(eGrafik){
eGrafik.nagruzkas.push({
  label: '',
  date: "",
  value: ''
})
this.initDates(true,true,'.datepicker-nagruzka');
    },
   deleteNagruzka(eGrafik){
    eGrafik.nagruzkas.pop();
   },
   deleteEGrafik(eGrafik){
     
if(eGrafik.grafik){
  eGrafik.grafik.destroy();
 
}
this.eGrafiks.splice(this.eGrafiks.indexOf(eGrafik),1)
   },
    eGrafikClickHandler(e){
//     console.log(  this.eGrafiks[0].grafik
//       .getElementsAtEvent(e))
//     console.log(  this.eGrafiks[0].grafik
//       .getElementAtEvent(e))
//     console.log(  this.eGrafiks[0].grafik
//       .getDatasetAtEvent(e))
// console.log(e)
    },
    copyImg(eGrafik){

      if(!eGrafik.grafik)return

    this.eGrafikImg = eGrafik.grafik.toBase64Image();
this.imageCopyModal.open();
    
    }
  },
  watch: {
    eGrafiks(n,o) {
   
 
 if(!this.watcherNeed){this.watcherNeed = true; return};
 if(o && o.length){
   o.forEach((eGrafik,idx)=>{
  if(!eGrafik.grafik){
    o.splice(idx,1);
    return;
  }
     eGrafik.grafik.destroy();
     eGrafik.grafik = undefined;
   })
 }


  

        this.$nextTick().then(() => {
 
          this.eGrafiks.forEach((eGrafik) => {
            eGrafik.loadType = "db"; ///LOADED FROM DataBase
           
       
            this.initGrafik(eGrafik);
          });

          this.initDates();
          this.initSelect();
        });

    }
  
  },

  template: `<div class="eGrafiks">
  <div class="box">
    <div v-if="fileloadstatus != 'parsed'">
      <h1 class="title is-1 has-text-centered">
        Выберите файл для построения графика...
      </h1>

      <input
        placeholder="Выберите файл"
        class="input"
        @change="loadFile"
        type="file"
        name="resume"
      />
    </div>

    <div class="" v-show="loading">
      <h1 class="title is-1">Загрузка...</h1>
    </div>

    <div v-if="fileloadstatus=='parsed'">
      <div class="columns">
        <div class="column is-2">
          <button class="is-primary button" @click="openGrafSelectModal">
            Добавить график
          </button>
        </div>
        <div class="column is-6 is-offset-1">
          <h2 class="title is-2 has-text-centered">Графики по Excell</h2>
          <h3 class="title is-3 has-text-centered">{{filename}}</h3>
        </div>
      </div>
    </div>
  </div>

  <div class="box" v-for="(eGrafik,idx) in eGrafiks" :key="idx">
    <div class="panel columns my-2 py-3">
    <div class="mx-2">

   
      <button
        @click="copyImg(eGrafik)"
        class="button is-primary"
        :disabled="!eGrafik.grafik"
      >
        <span class="mdi mdi-content-copy"> </span>
      </button>
    </div>


    <div class="mx-2">

   
    <button
      @click="deleteEGrafik(eGrafik)"
      class="button is-danger"
     
    >
      <span class="mdi mdi-delete"> </span>
    </button>
  </div>
      <div v-if="eGrafik.loadType=='db'" class="mx-2">
        <button
          class="button is-primary"
          @click="unlockGrafik(eGrafik)"
          :disabled="fileloadstatus!='parsed'"
        >
          Разблокировать график
        </button>
      </div>
    </div>

    <div v-if="eGrafik.type =='zapusk'">
      <h2 class="title is-2">График по запускам</h2>
      <h3 class="title is-3">Выберите активности:</h3>
      <select
        v-model="eGrafik.selectedIdx"
        multiple
        class="my-6"
        :disabled="eGrafik.loadType == 'db'"
      >
        <option
          v-for="selectValue in selectValuesZapusk"
          :value="selectValue.idx"
        >
          {{selectValue.label}}
        </option>
      </select>

      <div class="nagruzkas">
        <div class="is-flex">
          <h4 class="title is-4 mx-2">Комментарии на графике:</h4>
          <div class="mx-2">
            <button
              :disabled="eGrafik.loadType == 'db'"
              @click="addNagruzka(eGrafik)"
              class="button is-success"
            >
              <span class="mdi mdi-plus"></span>
            </button>
          </div>

          <div class="mx-2">
            <button
              @click="deleteNagruzka(eGrafik)"
              class="button is-danger"
              :disabled="!eGrafik.nagruzkas.length || eGrafik.loadType == 'db'"
            >
              <span class="mdi mdi-minus"></span>
            </button>
          </div>
        </div>

        <div>
          <ul>
            <li v-for="nagruzka in eGrafik.nagruzkas">
              <div class="columns">
                <div class="column is-4">
                  <input
                    type="text"
                    class="input is-primary"
                    placeholder="Информация"
                    v-model="nagruzka.label"
                    :disabled="eGrafik.loadType == 'db'"
                  />
                </div>
                <div class="column is-4">
                  <input
                    type="text"
                    class="input is-primary datepicker-nagruzka"
                    placeholder="Дата"
                    v-model.lazy="nagruzka.date"
                    :disabled="eGrafik.loadType == 'db'"
                  />
                </div>
                <div class="column is-4">
                  <input
                    type="text"
                    class="input is-primary"
                    placeholder="Колличество (высота)"
                    v-model="nagruzka.value"
                    :disabled="eGrafik.loadType == 'db'"
                  />
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="box">
        <h2 class="title is-2 has-text-centered">Даты</h2>
        <div class="columns">
          <div class="column is-6 has-text-centered">
            <input
              type="text"
              v-model.lazy="eGrafik.fdate"
              class="datepicker  datepickerEGrafik input"
              :disabled="eGrafik.loadType == 'db'"
            />
          </div>
          <div class="column is-6 has-text-centered">
            <input
              type="text"
              v-model.lazy="eGrafik.sdate"
              class="datepicker datepickerEGrafik  input"
              :disabled="eGrafik.loadType == 'db'"
            />
          </div>
        </div>
        <div class="columns">
          <button
            class="button is-danger column is-2 is-offset-5 is-size-4"
            @click="initGrafik(eGrafik)"
            :disabled="eGrafik.loadType == 'db'"
          >
            Создать график
          </button>
        </div>
        <div class="columns">
          <div class="column is-8 is-offset-2">
            <canvas :id="'eGrafik'+idx" style="background-color: #fff"></canvas>
          </div>
        </div>
      </div>
    </div>

    <div v-if="eGrafik.type =='planFact'">
      <h2 class="title is-2">График по План/Факту</h2>
      <h3 class="title is-3">Выберите активность:</h3>
      <select
        v-model="eGrafik.selectedIdx"
        class="my-6"
        :disabled="eGrafik.loadType == 'db'"
      >
        <option value="" selected></option>
        <option
          v-for="selectValue in selectValuesPlanFact"
          :value="selectValue.idx"
        >
          {{selectValue.label}}
        </option>
      </select>

      <div class="center">
        <label :for="'factCheck'+idx">
          <input
            type="checkbox"
            v-model="eGrafik.fact"
            :id="'factCheck'+idx"
            :disabled="eGrafik.loadType == 'db'"
          />
          <span>Факт</span>
        </label>
      </div>

      <div class="nagruzkas">
        <div class="is-flex">
          <h4 class="title is-4 mx-2">Комментарии на графике:</h4>
          <div class="mx-2">
            <button
              :disabled="eGrafik.loadType == 'db'"
              @click="addNagruzka(eGrafik)"
              class="button is-success"
            >
              <span class="mdi mdi-plus"></span>
            </button>
          </div>

          <div class="mx-2">
            <button
              @click="deleteNagruzka(eGrafik)"
              class="button is-danger"
              :disabled="!eGrafik.nagruzkas.length || eGrafik.loadType == 'db'"
            >
              <span class="mdi mdi-minus"></span>
            </button>
          </div>
        </div>

        <div>
          <ul>
            <li v-for="nagruzka in eGrafik.nagruzkas">
              <div class="columns">
                <div class="column is-4">
                  <input
                    type="text"
                    class="input is-primary"
                    placeholder="Информация"
                    v-model="nagruzka.label"
                    :disabled="eGrafik.loadType == 'db'"
                  />
                </div>
                <div class="column is-4">
                  <input
                    type="text"
                    class="input is-primary datepicker-nagruzka"
                    placeholder="Дата"
                    v-model.lazy="nagruzka.date"
                    :disabled="eGrafik.loadType == 'db'"
                  />
                </div>
                <div class="column is-4">
                  <input
                    type="text"
                    class="input is-primary"
                    placeholder="Колличество (высота)"
                    v-model="nagruzka.value"
                    :disabled="eGrafik.loadType == 'db'"
                  />
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="box">
        <h2 class="title is-2 has-text-centered">Даты</h2>
        <div class="columns">
          <div class="column is-6 has-text-centered">
            <input
              type="text"
              v-model.lazy="eGrafik.fdate"
              class="datepicker datepickerEGrafik input"
              :disabled="eGrafik.loadType == 'db'"
            />
          </div>
          <div class="column is-6 has-text-centered">
            <input
              type="text"
              v-model.lazy="eGrafik.sdate"
              class="datepicker datepickerEGrafik input"
              :disabled="eGrafik.loadType == 'db'"
            />
          </div>
        </div>
        <div class="columns">
          <button
            class="button is-danger column is-2 is-offset-5 is-size-4"
            @click="initGrafik(eGrafik)"
            :disabled="eGrafik.loadType == 'db'"
          >
            Создать график
          </button>
        </div>
        <div class="columns">
          <div class="column is-8 is-offset-2">
            <canvas :id="'eGrafik'+idx" style="background-color: #fff"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" id="selectGrafikModal">
    <div class="modal-content">
      <div class="box is-clickable" @click="addGrafZapusk">
        График для прогноза по запускам
      </div>
      <div class="box is-clickable" @click="addGrafPlanFact">
        График для План Факт 1 Линия
      </div>
    </div>
    <div class="modal-footer">
      <a class="modal-close waves-effect waves-green btn-flat">Закрыть</a>
    </div>
  </div>

  <div class="modal" id="imageCopyModal">
    <div class="modal-content">
      <h2 class="title is-2 has-text-centered">Скопируйте картинку</h2>
      <div class="columns">
        <div class="column is-12 has-text-centered">
          <img :src="eGrafikImg" alt="" />
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <a class="modal-close waves-effect waves-green btn-flat">Закрыть</a>
    </div>
  </div>
</div>
`,
});
