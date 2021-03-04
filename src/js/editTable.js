// setTimeout(()=>location.reload(), 3000) 



let app = new Vue({
    el: "#app",
    data: {
        employees: [],
        date1: "",
        date2: "",
        tabel: '',
        range: ["01 03 2021", "02 03 2021", "03 03 2021", "04 03 2021", "05 03 2021", "06 03 2021", "07 03 2021", "08 03 2021", "09 03 2021", "10 03 2021", "11 03 2021", "12 03 2021", "13 03 2021", "14 03 2021", "15 03 2021", "16 03 2021", "17 03 2021", "18 03 2021", "19 03 2021", "20 03 2021", "21 03 2021", "22 03 2021", "23 03 2021", "24 03 2021", "25 03 2021", "26 03 2021", "27 03 2021", "28 03 2021", "29 03 2021", "30 03 2021", "31 03 2021"],
        some: {
            step: -1,
            F: {
                X: '',
                Y: ''
            },
            L: {
                X: '',
                Y: ''
            },
            somes: [],
            input: ""
        }

 
    },
    mounted: function () {
        console.log("I AM mounted");
        kalendarSet();
        M.AutoInit();


        axios.all([
            axios.get('../vendor/showEmployees.php'),
            axios.get('../vendor/showTabel.php')
          ]).then(axios.spread((Eres, Tres) => {
          console.log(Tres.data[0].body) 
Tres.data.forEach(dt=>{

 
Eres.data.forEach(em=>{
if(!dt.body[em.nid]){
    dt.body[em.nid] = '';
}
})
})


this.tabel = Tres.data;
this.employees = Eres.data;
          }) )

  },
    methods: {
        dateRange: function () {



            let date1 = this.date1;
            let date2 = this.date2;



            ///DATE
            let parts = date1.split(' ')


            let startDate = new Date(parts[2], parts[1] - 1, parts[0]);



            parts = date2.split(' ')

            let endDate = new Date(parts[2], parts[1] - 1, parts[0]);



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
            console.log(dates)
            this.range = dates;
            return dates;










        },
        createTable: function () {
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
                    console.log(-1);

                    return;
                case 0: {
                    M.toast({
                        html: "Выберите начальный"
                    });


                    this.some.somes.forEach(element => {
                        element.somes = [];
                    });

                    this.some.step = 1;
                    this.some.somes = [];
                    this.some.input = '';

                    break;
                }
                case 1: {
                    this.some.F.X = this.tabelFiltred.indexOf(day);
                    this.some.F.Y = Object.keys(day.body).indexOf(who);
                    M.toast({
                        html: "Выберите конечный"
                    });
                    this.some.step = 2;
                    break;
                }
                case 2: {
                    this.some.L.X = this.tabelFiltred.indexOf(day);
                    this.some.L.Y = Object.keys(day.body).indexOf(who);
                    this.modifSome();
                    M.toast({
                        html: "Подсчет"
                    });
                    this.some.step = 3;
                    break;
                }



            }
        },

        modifSome: function () {
            // slice(this.some.F.X, this.some.L.X)
            console.log(this.some.F.X, 'X1')
            console.log(this.some.L.X, "Y1")
            this.tabelFiltred.forEach((element, idx) => {
                element.somes = [];
                if (idx >= this.some.F.X && idx <= this.some.L.X) {
                    // console.log(element)

                    this.some.somes.push(element);
                    // console.log(Object.keys(element))
                    // console.log(this.some.F.Y, this.some.L.Y)
                    element.somes = Object.keys(element.body).slice(this.some.F.Y, this.some.L.Y + 1);
                }
                this.$forceUpdate()
            });



        },
        clearSome: function () {

            this.some.somes.forEach(element => {
                element.somes = [];
            });
            this.some.step = -1;
            this.some.input = '';
            this.$forceUpdate()
        },
        changeOnServer: function () {
            M.toast({
                html: "Синхронизирую..."
            })
            axios.post('../vendor/saveTabel.php', JSON.stringify(this.tabel))
                .then(res => {
                    console.log(res.data)
                    if (res.data == "OK") {
                        M.toast({
                            html: "Синхронизация успешна!"
                        })
                    } else {
                        M.toast({
                            html: "Синхрогизация не удалась" + res.data
                        })
                    }
                })
        },
        exportToExcel : function(){
            

    var tableToExcel = (function () {
        var uri = 'data:application/vnd.ms-excel;base64,',
          template =
          '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
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
          window.location.href = uri + base64(format(template, ctx))
        }
      })()

      tableToExcel (document.getElementById('allTable'), 'Табель вывод' + this.range[0] + '-' + this.range[this.range.length-1])
        }

    },
    watch: {
        someInput: function (n, o) {
            if (this.some.step === 3) {
                this.some.somes.forEach(element => {
                    element.somes.forEach(v => {
                        element.body[v] = n;
                    })
                });
            }

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

        }
    },
    filters: {
        dayOfWeek: function (val) {
            console.log(val)


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

           
        }
    }



})








//КАЛЕНДАРИ


function kalendarSet() {
    M.Datepicker.init(document.querySelectorAll('.kalendar'),

        {


            i18n: {

                months: [
                    'Январь',
                    'Февраль',
                    'Март',
                    'Апрель',
                    'Май',
                    'Июнь',
                    'Июдь',
                    'Август',
                    'Сентябрь',
                    'Октябрь',
                    'Ноябрь',
                    'Декабрь'
                ],

                monthsShort: [
                    'Январь',
                    'Февраль',
                    'Март',
                    'Апрель',
                    'Май',
                    'Июнь',
                    'Июль',
                    'Август',
                    'Сентябрь',
                    'Октябрь',
                    'Ноябрь',
                    'Декабрь'
                ],
                weekdays: [
                    'Понедельник',
                    'Вторник',
                    'Среда',
                    'Четверг',
                    'Пятница',
                    'Суббота',
                    'Воскресенье'
                ],
                weekdaysShort: ['Вс',
                    'Пн',
                    'Вт',
                    'Ср',
                    'Чт',
                    'Пт ',
                    'Сб ',

                ],
                weekdaysAbbrev: ['Вс',
                    'Пн',
                    'Вт',
                    'Ср',
                    'Чт',
                    'Пт ',
                    'Сб ',

                ],
                cancel: "Отмена",
                clear: "Очистить",
                done: "ОК"



            },
            firstDay: 1,
            format: "dd mm yyyy",
            minDate: new Date('2021 01 01'),
            maxDate: new Date('2021 12 31'),
            showDaysInNextAndPreviousMonths: true,
            autoClose: true



        }


    );
    //КАЛЕНДАРИ

}