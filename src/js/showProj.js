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
        }
    },
    mounted: function () {
        console.log("I AM mounted");
        kalendarSet();
        M.AutoInit();
        axios.get('../vendor/showProj.php')
            .then(res => {
                this.projects = res.data;
            }, err => {
                M.toast({
                    html: "Ошибка " + err
                })
            })
    },
    methods: {
resetFilter : function(){
    for (prop in this.filterSelect) {
        this.filterSelect[prop] = ''     
    }
    for (prop in this.filterInput) {
        this.filterInput[prop] = ''     
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
                        if (! v[prop].toUpperCase().includes(this.filterInput[prop].toUpperCase())) return false;
          
                    }
                }
                
                
                
                return true;

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
            format: "dd mm yyyy"




        }


    );
    //КАЛЕНДАРИ

}