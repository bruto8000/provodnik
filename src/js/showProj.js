// setTimeout(()=>location.reload(), 3000) 


let app = new Vue({
    el: "#app",
    data: {
        kalendar : "",
        projects: [],
        filterSelect: {
            bizness: "",
            zapusk: "",
            status: "",
            fdate: "",
            sdate: ""

        },
        filterInput: {
            zakazchik: "",
            nazvanie: "",
            opisanie: "",
          
         
        },
        sort: {
            column: ""
        },
        employees: []
    },
    mounted: function () {
        console.log("I AM mounted");
       this.kalendar = kalendarSet();
 console.log(this.kalendar)
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

              
                this.employees = res.data;
             
                Vue.nextTick(function () {
                    M.AutoInit();
                  })
         

            })


    },
    methods: {

        closeModalDate: function(e,v){
            console.log(M.Datepicker)
        this.kalendar.forEach(element => {
           if(element.isOpen){
               element.close();
            

           }
     
        });
          
       
      
        },
        setDate: function(type){


            this.kalendar.forEach(element => {
                if(element.isOpen){
                    if(type == 'month'){
                        
                        element.setInputValue(element.calendars[0].month + ' ' + element.calendars[0].year )
              //          element.el.value = element.calendars[0].month + ' ' + element.calendars[0].year 
                    }else if (type == 'year'){

                        element.setInputValue(element.calendars[0].year)
   
                    }else{
                        element.setInputValue(    element.el.value = ['','I', 'II', "III", "IV"][Math.ceil((element.calendars[0].month + 1)/3)] + ' ' + element.calendars[0].year )
                    
                    }
                    console.log(element)
                    console.log(element.el)
                    console.log(element.calendars)
                    element.close();
                 
     
                }
            })

          
    

        }
        ,resetFilter: function () {
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
  return  M.Datepicker.init(document.querySelectorAll('.kalendar'),

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
            autoClose: true,
            onOpen: function(){
                var elems = document.querySelectorAll('.dropdown-trigger');
                var instances = M.Dropdown.init(elems);
            }



        }


    );
    //КАЛЕНДАРИ

}