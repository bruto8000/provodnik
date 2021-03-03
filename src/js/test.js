// setTimeout(()=>location.reload(), 3000) 



let app = new Vue({
            el: "#app",
            data: {

                date1: "",
                date2: "",
                tabel: '',
                range: [],
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
                axios.get('../vendor/showTabel.php')
                    .then(res => {
                        this.tabel = res.data;
                    }, err => {
                        M.toast({
                            html: "Ошибка " + err
                        })
                    })
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
                editSome: function (f, l) {
                    let arrOfSome = []
                    arrOfSome = this.tabelFiltred.slice(f.x, l.x);
                    console.log(arrOfSome)
                },
                enterSome: function (day, who) {

                    switch (this.some.step) {
                        case -1:
                            console.log(-1)
                            return;
                        case 0: {
                            M.toast({
                                html: "Выберите начальный"
                            });
                            this.some.step = 1;

                            break;
                        }
                        case 1: {
                            this.some.F.X = this.tabelFiltred.indexOf(day);
                            this.some.F.Y = Object.keys(day).indexOf(who);
                            M.toast({
                                html: "Выберите конечный"
                            });
                            this.some.step = 2;
                            break;
                        }
                        case 2: {
                            this.some.L.X = this.tabelFiltred.indexOf(day);
                            this.some.L.Y = Object.keys(day).indexOf(who);
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
                            element.somes = Object.keys(element).slice(this.some.F.Y, this.some.L.Y + 1);
                        }
                        this.$forceUpdate()
                    });



                }


            },
            watch: {
                someInput: function (n, o) {
                    if (this.some.step == 3) {
                        this.some.somes.forEach(element => {
                            element.somes.forEach(v => {
                                element[v] = n;
                            })
                        });
                    }

                }},
                computed: {
                    someInput: function () {
                        return this.some.input;
                    },
                    tabelFiltred: function () {


                        if (!this.range.length) return [];


                        return this.tabel.filter(v => {
                            if (!v.somes) v.somes = [];
                            if (this.range.indexOf(v.date) > (-1)) return true;
                            return false;
                        })


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
                    format: "dd mm yyyy"




                }


            );
            //КАЛЕНДАРИ

        }