// setTimeout(()=>location.reload(), 3000) 


let app = new Vue({
    el: "#app",
    data: {
        projects: [],
        filterSelect: {
            bizness: "",
            zapusk: "",
            status: "",

        },
        filterInput: {
            zakazchik: "",
            nazvanie: "",
            opisanie: "",
            fdate: "",
            sdate: ""
        },
        sort: {
            column: ""
        },
        employees: []
    },
    mounted: function () {
        console.log("I AM mounted");
        kalendarSet();
 
        axios.get('../vendor/showProj.php')
            .then(res => {
                this.projects = res.data;
            }, err => {
                M.toast({
                    html: "Ошибка " + err
                })
            });

            axios.get('../vendor/showEmployees.php')
            .then(res => {

                res.data.forEach(element => {
                    element.halfName = element['full_name'].split(' ')[0] + ' ' +
                        element['full_name'].split(' ')[1][0] + '.';
                });
                this.employees = res.data;
             
                Vue.nextTick(function () {
                    M.AutoInit();
                  })
         

            })


    },
    methods: {
        resetFilter: function () {
            for (prop in this.filterSelect) {
                this.filterSelect[prop] = ''
            }
            for (prop in this.filterInput) {
                this.filterInput[prop] = ''
            }
            this.sort.r = 1;
            this.sort.column = '';
            Vue.nextTick(function(){
                M.AutoInit();
            })
        
        },
        sortChange(column) {

            if (this.sort.column == column) {
                if (this.sort.r == 1) {
                    this.sort.r = -1;
                } else {
                    this.sort.r = 1
                }
                this.sort.column = "";
                this.sort.column = column;

            } else {

                this.sort.column = column;
                this.sort.r = 1;
            }
        }
    },
    watch: {

    },
    computed: {
        projectsFiltred: function () {
            return this.projects.filter((v, i, arr) => {
                for (prop in this.filterSelect) {
                    if (this.filterSelect[prop]) {
                        if (v[prop] != (this.filterSelect[prop])) return false;
                    }
                }
                for (prop in this.filterInput) {
                    if (this.filterInput[prop]) {
                        if (!v[prop].toUpperCase().includes(this.filterInput[prop].toUpperCase())) return false;
                    }
                }
                return true;
            }).sort((a, b) => {
                if (!this.sort.column) return 0;
                if (this.sort.column == 'sdate' || this.sort.column == 'fdate') {
                    let fakeA = a[this.sort.column];
                    let fakeB = b[this.sort.column];
                    fakeA = fakeA.split(' ').reverse().join(' ');
                    fakeB = fakeB.split(' ').reverse().join(' ');
                    fakeA = fakeA.replace(/\s/g, '');
                    fakeB = fakeB.replace(/\s/g, '');
                    if (fakeA > fakeB) return (1 * this.sort.r);
                    else return (-1 * this.sort.r);
                } else {
                    if (a[this.sort.column] > b[this.sort.column]) return 1 * this.sort.r;
                    else {
                        return -1 * this.sort.r;
                    }
                }
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
                    'Июль',
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
                    'Июдь',
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