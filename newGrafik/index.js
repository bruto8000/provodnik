
let app = new Vue({
  el: "#app",
  data: {
    datesFromXSX: {},
    selectValues: [],
    selectedIdx: [],
    grafik: null,
    datePickers: {
      fdate: "",
      sdate: "",
      range: []
    },
    OJs: {},
    filename: "",
    calculatedRows: [],
    loading: false,
    colors:  [
        "#c2185b",
        "#3949ab",
        "#2196f3",
        "#00bcd",
        "#009688",
        "#66bb6a",
        "#f4ff81",
        "#f4511e",
        "#00e676",
      ]
  },
  methods: {
    loadFile(e) {

  
       this.loading = true;
      var reader = new FileReader();

      reader.readAsArrayBuffer(e.target.files[0]);
      this.filename = e.target.files[0].name
      reader.onload = function (e) {
        var data = new Uint8Array(reader.result);
        var wb = XLSX.read(data, { type: "array" });

        console.log(wb);

       let oJS = XLSX.utils.sheet_to_json(wb.Sheets["Прогноз По Запускам"],  {raw: false});
        console.log(oJS);
      let oJS2 = XLSX.utils.sheet_to_json(wb.Sheets["План Факт 1 Линия"], {raw: false});
      console.log('OJS2',oJS2);
        let values = Object.values(oJS[1]);
        let keys = Object.keys(oJS[1]);
        values.forEach((v, idx) => {
          if (v.split(".")[2] && v.split(".")[2].length == 4) {
            values[idx] = v.split(".");
            console.log(values[idx]);
            values[idx][2] = values[idx][2].slice(2);
            values[idx] = values[idx].join(".");
          }
        });
        this.datesFromXSX = {
          keys: keys,
          values: values,
        };

        let iterableArr = oJS.slice(2);
        iterableArr.forEach((row, idx) => {
          let selectValue = {
            label: `${row["__EMPTY_4"]} ${row["__EMPTY_2"]} ${row["__EMPTY_3"]}`,
            idx: idx
          };
          this.selectValues.push(selectValue);
        });
        this.oJS = oJS
        this.initDates();
        this.initSelect();
        this.loading = false;
      }.bind(this);
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

      this.range = dates;
      return dates;
    },
    initGrafik() {
     
      if(!(this.checkDates && this.checkSelected)){
          return;
      }


this.datePickers.range  = this.dateRange(this.datePickers.fdate, this.datePickers.sdate, '.', 2);
this.calculatedRows = this.getValues();
if(this.grafik){
    this.updateGrafik();
    return;
}
this.createGrafik();
   
    },
    createGrafik(){
        let ctx = document.getElementById("XSXgrafik");

        // this.grafik = new Chart(ctx, {
        //   type: "line",
        //   data: {
        //     labels: table.range,
        //     datasets: table.TRs.map((TR, idxOfTR) => {
        //       return {
        //         data: TR.inputs.map((input) => input.value),
        //         label: TR.type,
        //         fill: false,
        //         borderColor: table.colors[idxOfTR],
        //         backgroundColor: table.colors[idxOfTR],
        //       };
        //     }),
        //   },
        // });



 this.grafik = new Chart(ctx, {
          type: "line",
          data: {
            labels: this.datePickers.range,
            datasets: this.calculatedRows
         
          },
        });


    },
    updateGrafik() {

this.grafik.data.labels = this.datePickers.range;
this.grafik.data.datasets = this.calculatedRows;
this.grafik.update();

    },
    async initDates() {
      await this.$nextTick();
      Kalendar.set({
        showMonthBtn: true,
        showKvartalBtn: true,
        showYearBtn: true,
      });
    },
    async initSelect() {
      await this.$nextTick();
      M.FormSelect.init(document.querySelectorAll("select"));
    },
    checkDates(){
        if(!this.datePickers.sdate || !this.datePickers.fdate){
            M.toast({html:"Даты не выбраны."})
            return false
        }
        return true
    },
    checkSelected(){
        if(!this.selectedIdx.length){
            M.toast({html:"Активности  не выбраны."})
            return false
        }
        return true
    },
    getValues(){

        if(!this.checkSelected){return}
        let arrOfEmployees = [];
        this.selectedIdx.forEach((idxOfSelected,idxOfArr)=>{
            let currentRow =   this.oJS[idxOfSelected+2];
       
            let employeeObject = {
                label: this.selectValues[idxOfSelected].label,
                data: [],
                fill: false,
                borderColor: this.colors[idxOfArr],
                backgroundColor : this.colors[idxOfArr]
            }
            this.datePickers.range.forEach(date=>{
                if(this.datesFromXSX.values.includes(date)){
             let key = this.datesFromXSX.keys[this.datesFromXSX.values.indexOf(this.datesFromXSX.values.find((v)=>date==v))];
            //  console.log(key,'key') 
            //  console.log(currentRow[key]) 
            //  console.log(currentRow) 
             employeeObject.data.push(Math.round(currentRow[key]));
                }
            })
arrOfEmployees.push(employeeObject);
        })
        return arrOfEmployees;

    }
  },
});
