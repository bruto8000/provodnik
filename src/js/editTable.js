// setTimeout(()=>location.reload(), 3000) 




let app = new Vue({
    el: "#app",
    data: {
        history: {
            write: true,
            arrOfHistory:  [],
            copy: false,
            isLast: true,
            isFirst: true,
            diff: 0
          },
        trueNID: [],
        employees: [],
        kalendar: [],
        date1: "",
        date2: "",
        tabel: [],
        range: ["01 03 2021", "02 03 2021", "03 03 2021", "04 03 2021", "05 03 2021", "06 03 2021", "07 03 2021", "08 03 2021", "09 03 2021", "10 03 2021", "11 03 2021", "12 03 2021", "13 03 2021", "14 03 2021", "15 03 2021", "16 03 2021", "17 03 2021", "18 03 2021", "19 03 2021", "20 03 2021", "21 03 2021", "22 03 2021", "23 03 2021", "24 03 2021", "25 03 2021", "26 03 2021", "27 03 2021", "28 03 2021", "29 03 2021", "30 03 2021", "31 03 2021"],
        some: {
            OFF: false,
            step: -1,
            F: {
                X: '',
                Y: ''
            },
            L: {
                X: '',
                Y: ''
            },
            PRE: {
                X: "",
                Y: ""
            },
            somes: [],
            presomes: [],
            input: ""
        },
        datesFromApi : []


    },
    mounted: function () {
        console.log("I AM mounted");

        this.kalendar = Kalendar.set({
            showMonthBtn: true,
            showKvartalBtn: true,
            showYearBtn: true
        });


        axios.all([
            axios.get('../vendor/showEmployees.php'),
            axios.get('../vendor/showTabel.php'),
            axios.get('https://isdayoff.ru/api/getdata?year=2021&pre=0&delimeter=DAY')
        ]).then(axios.spread((Eres, Tres,Dres) => {
       
            this.datesFromApi = Dres.data.split('DAY');
  
 
            Tres.data.forEach((dt,idxOfDay,dateArr) => {
                dt.presomes = [];
dt.vixod = this.datesFromApi[idxOfDay] == 1 ;





if(dt.vixod ){
    if(idxOfDay==0)return;
   
    dateArr[idxOfDay-1].isNextDayVixod = true;
}else{
    dateArr[idxOfDay-1].isNextDayVixod = false;
}

if((idxOfDay) == (dateArr.length -1)){
   dt.isNextDayVixod = true;
}





                Eres.data.forEach(em => {
                    if (!dt.body[em.nid]) {
                        dt.body[em.nid] = '';
                    }
                     if((dt.body[em.nid] == '') && ((dt.vixod ))){
                        dt.body[em.nid] = "В";
                    } })
            })
            Eres.data.forEach(em => {
                this.trueNID.push(em.nid)
            })


            this.tabel = Tres.data;
            this.employees = Eres.data;
          //  this.changeOnServer();
        }))

    },
    methods: {
        dateRange: function () {



            let date1 = this.date1;
            let date2 = this.date2;



            ///DATE
            let parts = date1.split(' ')

            let startDate;
            let endDate;
            if (parts.length === 3) {
                startDate = new Date(parts[2], parts[1] - 1, parts[0]);

                parts = date2.split(' ')

                endDate = new Date(parts[2], parts[1] - 1, parts[0]);


            } else if (parts.length == 2) {

                if (isNaN(Number(parts[0]))) {

                    switch (parts[0]) {

                        case 'I':
                            startDate = new Date(parts[1], '0', '1');
                            endDate = new Date(parts[1], '3', '0');
                            break;
                        case 'II':
                            startDate = new Date(parts[1], '3', '1');
                            endDate = new Date(parts[1], '6', '0');
                            break;
                        case 'III':
                            startDate = new Date(parts[1], '6', '1');
                            endDate = new Date(parts[1], '9', '0');
                            break;
                        case 'IV':
                            startDate = new Date(parts[1], '9', '1');
                            endDate = new Date(parts[1], '11', '31');
                            break;

                    }


                } else {
                    //MONTH SELECTED

                    startDate = new Date(parts[1], parts[0] - 1, '1');
                    endDate = new Date(parts[1], parts[0], '0');



                }


            } else {
                startDate = new Date(parts[0], 0, 1);
                endDate = new Date(parts[0], 11, 31);
            }


if(endDate < startDate){
    let y;
    y = startDate;
    startDate = endDate;
    endDate = y;
}


            let dates = []
            //to avoid modifying the original date
            const theDate = new Date(startDate)

            while (theDate < endDate) {




                let dateForPush = '';

                if (theDate.getDate() < 10) {
                    dateForPush += '0' + theDate.getDate() + ' '
                } else {
                    dateForPush += theDate.getDate() + ' '
                }

                if (theDate.getMonth() < 9) {
                    dateForPush += '0' + (theDate.getMonth() + 1) + ' '
                } else {
                    dateForPush += theDate.getMonth() + 1 + ' '
                }
                dateForPush += theDate.getFullYear();
                dates.push(dateForPush)
                theDate.setDate(theDate.getDate() + 1)
            }


            let dateForPush = '';

            if (theDate.getDate() < 10) {
                dateForPush += '0' + theDate.getDate() + ' '
            } else {
                dateForPush += theDate.getDate() + ' '
            }

            if (theDate.getMonth() < 9) {
                dateForPush += '0' + (theDate.getMonth() + 1) + ' '
            } else {
                dateForPush += theDate.getMonth() + 1 + ' '
            }
            dateForPush += theDate.getFullYear();
            dates.push(dateForPush)


            // dates //

            this.range = dates;
            return dates;










        },
        createTable: function () {
            //THIS IS FOR BACKEND
            //             let range = this.dateRange();


            // range.forEach((element,idx) => {
            //     setTimeout(() => {
            //         axios.post('../vendor/test.php', JSON.stringify({
            //             date: element
            //         }))
            //         .then(res=>console.log(res.data))
            //     }, idx * 100);

            // });

        },

        enterSome: function (day, who) {

 
            switch (this.some.step) {
                case -1:
            

                    return;
                case 0: {
                    M.toast({
                        html: "Выберите начальный"
                    });


              this.clearSome(false);
              this.some.step = 1;
          

                    break;
                }
                case 1: {
                    this.some.F.X = this.tabelFiltred.indexOf(day);
                    this.some.F.Y = this.trueNID.indexOf(who);
                    M.toast({
                        html: "Выберите конечный"
                    });
                    this.some.step = 2;
                    break;
                }
                case 2: {
                    this.some.L.X = this.tabelFiltred.indexOf(day);
                    this.some.L.Y = this.trueNID.indexOf(who);
                    this.modifSome();
                    M.toast({
                        html: "Подсчет"
                    });
                    this.some.step = 3;
                    break;
                }
                case 4: {

                    let x = this.some.L.X - this.some.F.X;
                    let y = this.some.L.Y - this.some.F.Y;


                    this.some.F.X = this.tabelFiltred.indexOf(day);
                    this.some.F.Y = this.trueNID.indexOf(who);
                    this.some.L.X = this.some.F.X + x;
                    this.some.L.Y = this.some.F.Y + y;
                    // let oldinput = this.some.input;

                    if(!this.history.copy){

               
                    this.some.somes.forEach(element => {
                        element.somes.forEach((v, idx, arr) => {
                            element.body[v] = " ";
                            element.presomes = [];
                        })
                    });
                }
                    this.history.write = false;
                    this.history.copy= false;
                    this.clearSome(true);
                    this.some.step = 3;
                    this.modifSome();
                    Vue.nextTick(e => {

                        let i = 0;
        
                        this.some.somes.forEach(element => {
                            element.somes.forEach((v, idx, arr) => {
                                element.body[v] = this.history.arrOfHistory[this.history.arrOfHistory.length-1][i];
                                // console.log(this.history[this.history.arrOfHistory.length-1][i])
                    
                    
                                element.presomes = [];
                                i++;
                            })
                        });

                        // this.some.input = oldinput;
                        Vue.nextTick(()=>{

                            this.history.write = true;
                        })
                    })

                    break;
                }



            }
        },
        preEnterSome: function (day, nid) {

            if(this.some.OFF) return;
this.some.OFF = true;
setTimeout(() => {
    this.some.OFF = false; 
}, 0);

            if (!(this.some.step == 2 || this.some.step == 4)) {
                return;
            }






            if (this.some.step == 2) {

                this.some.PRE.X = this.tabelFiltred.indexOf(day);
                this.some.PRE.Y = this.trueNID.indexOf(nid);
                this.some.presomes = [];
                this.tabelFiltred.forEach((element, idx) => {
                    element.presomes = [];
                 
                    if (idx >= this.some.F.X && idx <= this.some.PRE.X) {


                        this.some.presomes.push(element);

                        element.presomes = this.trueNID.slice(this.some.F.Y, this.some.PRE.Y + 1);
                    } else {
                        return;
                    }
                })
             
            } else {



                this.some.PRE.X = this.tabelFiltred.indexOf(day);
                this.some.PRE.Y = this.trueNID.indexOf(nid);
let x = this.some.L.X - this.some.F.X;
let y = this.some.L.Y - this.some.F.Y;
this.some.presomes = [];
                this.tabelFiltred.forEach((element, idx) => {
                    element.presomes = [];
                    if (idx >= this.some.PRE.X && idx <= this.some.PRE.X + x) {


                        this.some.presomes.push(element);

                        element.presomes = this.trueNID.slice(this.some.PRE.Y, this.some.PRE.Y + y + 1);


                    }else{return;}


           

                });



            }




        },
        moveSome: function (day, who) {
            if (this.some.step == 4) {
                M.toast({
                    html: "Выберите новое начаало"
                })
                return;
            }
            if (!(this.some.step == 3)) {
                M.toast({
                    html: "Сначала отметье"
                })
                return;
            }


            this.some.step = 4;
            M.toast({
                html: "Выберите новое начало"
            });







        },

        modifSome: function () {
            // slice(this.some.F.X, this.some.L.X)
        
            this.tabelFiltred.forEach((element, idx) => {
                element.somes = [];
                if (idx >= this.some.F.X && idx <= this.some.L.X) {


                    this.some.somes.push(element);
             

                    element.somes = this.trueNID.slice(this.some.F.Y, this.some.L.Y + 1);
                    element.presomes = [];
                }


                this.$forceUpdate()

            });



        },
        clearSome: function (keepHistory) {

if(!keepHistory){
    this.history.arrOfHistory = [];
    this.history.isLast = true;
    this.history.isFirst = true;
}
            this.some.somes.forEach(element => {
                element.somes = [];
              
            });
            this.some.presomes.forEach(element => {
                element.presomes = [];
            });
            
            this.some.step = -1;

            this.some.input = '';
            this.some.somes = [];
            this.$forceUpdate()
        },
        changeOnServer: function (event) {
       event.target.classList.toggle('is-loading')
        
            axios.post('../vendor/saveTabel.php', JSON.stringify(this.tabel))
                .then(res => {
                    console.log(res.data)
                    if (res.data == "OK") {
                        setTimeout(() => {
                            event.target.classList.toggle('is-loading')
                        }, 200);
                        M.toast({
                            html: "Данные сохранены."
                        })
                    } else {
                        M.toast({
                            html: "Синхрогизация не удалась" + res.data
                        })
                    }
                })
        },
  
        exportToExcel: function (id) {


            var tableToExcel = (function () {
                var uri = 'data:application/vnd.ms-excel;base64,',
                    template =
                    '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
                    base64 = function (s) {
                        return window.btoa(unescape(encodeURIComponent(s)))
                    },
                    format = function (s, c) {
                        return s.replace(/{(\w+)}/g, function (m, p) {
                            return c[p];
                        })
                    }
                return function (table, name) {
                    if (!table.nodeType) table = document.getElementById(table)
                    var ctx = {
                        worksheet: name || 'Worksheet',
                        table: table.innerHTML
                    }
                    console.log(table)
                    console.log(ctx.table)
             ctx.table = ctx.table.replace(/class="[\w\s-]+"/gu, '')
             console.log(ctx.table)
                    window.location.href = uri + base64(format(template, ctx))
                }
            })()

            tableToExcel(document.getElementById(id), 'Табель вывод' + this.range[0] + '-' + this.range[this.range.length - 1])
        },
        moveHistory: function(direction) {

            if(this.some.step != 3 ){   M.toast({html: "История работает только для множества"})   ;return;}
            if(!direction){
                //BACK
                console.log("BACK")
                this.history.isLast = false;


         
 this.history.diff ++;
 if(((this.history.arrOfHistory.length - 1) -this.history.diff ) == 0){
     this.history.isFirst = true;
 }
                this.history.write = false;
                let i = 0;
        
                this.some.somes.forEach(element => {
                    element.somes.forEach((v, idx, arr) => {
                        element.body[v] = this.history.arrOfHistory[(this.history.arrOfHistory.length-1)-this.history.diff][i];
                            i++;
                    })
                });

                // this.some.input = oldinput;
                Vue.nextTick(()=>{
                    this.history.write = true;
                })
       


            }else{
               
console.log("Forwar")
 this.history.diff--;
 if(this.history.diff == 0){
    this.history.isLast = true;
 }
 this.history.isFirst = false;
                this.history.write = false;
                let i = 0;
        
                this.some.somes.forEach(element => {
                    element.somes.forEach((v, idx, arr) => {
                        element.body[v] = this.history.arrOfHistory[(this.history.arrOfHistory.length-1)-this.history.diff][i];
                            i++;
                    })
                });

                Vue.nextTick(()=>{
                    this.history.write = true;
                })
       



            }
        },
        filterInput: function(day,emp){
         day.body[emp] = day.body[emp].toUpperCase()
        },
        planFactCalculate(){
            this.plan = 0;
this.employees.forEach(em=>{
    em.fact = 0;
    em.factWithoutZ = 0;
})

            this.tabelFiltred.forEach((v,idx)=>{
           
           
                    this.employees.forEach((em,eidx)=>{

                        for(let nid in v.body) {
                            if(em.nid == nid){
                              
                                if(v.body[nid].trim().toUpperCase() == 'З' ){
                                    if(v.isNextDayVixod){
                                        em.fact +=7;
                                     
                                    }else{
                                        em.fact +=  8.25;
                                    
                                    }
                                }else if( ! isNaN(Number(v.body[nid].trim().replace(',', '.')))){
                                    em.fact +=  Number(v.body[nid].trim().replace(',', '.'))  ;
                                    em.factWithoutZ  +=  Number(v.body[nid].trim().replace(',', '.'))  ;
                                }
                            }
                        }
                    })
                    if(! v.vixod){
               
                  if(v.isNextDayVixod){
                       this.plan += 7;

                    }else{
                       this.plan += 8.25;
                    }
                }
                
            })
 
        }

    },
    watch: {
        someInput: function (n, o) {
            if (this.some.step === 3) {
                this.some.somes.forEach(element => {
                    element.somes.forEach(v => {
                        element.body[v] = n.toUpperCase();
                    })
                });
            }

        },
        date1: function (n, o) {
            if (n.split(' ').length == 3 && this.date2.split(' ').length == 3) {
                this.dateRange();
                return;
            }
            if(n.split(' ').length == 2 || n.split(' ').length == 1){
                this.date2 = n;
                this.dateRange();
            }
            return;
        },
        date2: function (n, o) {
            if (n.split(' ').length == 3 && this.date1.split(' ').length == 3) {
                this.dateRange();
                return;
            }
            if(n.split(' ').length == 2 || n.split(' ').length == 1){
                this.date1 = n;
                this.dateRange();
                return;
            }
            return;
        },
        someArrInput: function(n,o){
            if(!this.history.write || !n.length) return;
         

            if(!(this.history.isLast)){
                console.log(this.history.arrOfHistory.slice(0, - (this.history.diff)))
                this.history.arrOfHistory = this.history.arrOfHistory.slice(0, - (this.history.diff))
            }
            this.history.arrOfHistory.push(n);
            this.history.isLast = true;
            this.history.isFirst = false;
            this.history.diff = 0;
            if(this.history.arrOfHistory.length==1){this.history.isFirst = true;}else{this.history.isFirst = false;} 
        },
        tabelFiltred: function(n){
            console.log(n)
            this.planFactCalculate();
        }
    },
    computed: {
        someInput: function () {
            return this.some.input;
        },
        tabelFiltred: function () {


            if (!this.range.length) return [];

            try {
                return this.tabel.filter(v => {
                    if (!v.somes) v.somes = [];
                    if (this.range.indexOf(v.date) > (-1)) return true;
                    return false;
                })
            } catch {
                return []
            }
          

        },
        someArrInput: function(){
            let arr = []
            this.some.somes.forEach(e=>{
                e.somes.forEach(ie=>{
               
                   
                    arr.push(e.body[ie]);
                })
            })
            return arr;
        }
       
    },
    filters: {
        dayOfWeek: function (val) {



            let parts = val.split(' ')


            let filtredDate = new Date(parts[2], parts[1] - 1, parts[0]);


            switch (filtredDate.getDay()) {
                case 0:
                    return 'ВСК';
                case 1:
                    return "ПН";
                case 2:
                    return "ВТ";
                case 3:
                    return "СР";
                case 4:
                    return "ЧТ";
                case 5:
                    return "ПТ";
                case 6:
                    return "СБ";
                case 7:
                    return "ВСК";
            }


        },
        filterDotZeroZero(val){
       return  val.toFixed(2)
        }
        
    },
    components: {
        preloader: preloader
    }



})








