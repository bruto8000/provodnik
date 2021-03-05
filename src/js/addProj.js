// setTimeout(()=>location.reload(), 3000) 


let app = new Vue({
    el: "#app",
    data: {
        project: {
            fdate: "",
            sdate: "",
            nazvanie: "",
            bizness: "",
            zapusk: "",
            soprovod: "",
            status: "",
            zakazchik: "",
            undate: false
        },
        employees: []
    },
    mounted: function () {
        console.log("I AM mounted");
        this.kalendar =  kalendarSet();
        console.log(  this.kalendar);
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

          
    

        },

        addProj: function () {
            try {
                for (prop in this.project) {
                    if (!this.project[prop]) {

                        throw new Error("Пусто, чего-то не хватает");
                    }
                }

            } catch (e) {

                M.toast({
                    html: e
                });

                return;

            }


            axios.post('../vendor/addProj.php', JSON.stringify(this.project))
                .then((r) => {
                    console.log(r.data);
                    if (r.data == "OK") {
                        M.toast({
                            html: "Проект добавлен"
                        });
                        for (prop in this.project) {
                            this.project[prop] = '';

                        }

                    } else {
                        throw new Error(r.data)
                    }

                })
                .catch(e => {
                    M.toast({
                        html: "Проект НЕ добавлен" + e
                    });
                })


        },
        undateZapusk: function(){
         this.project.undate =    !this.project.undate;
         this.project.sdate = this.project.undate ? "Не определена" : "";
        }    
    }
})












//КАЛЕНДАРИ


function kalendarSet() {
 return   M.Datepicker.init(document.querySelectorAll('.kalendar'),

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
            format: "dd mm yyyy",
            minDate: new Date('2021 01 01'),
            maxDate: new Date('2021 12 31'),
            showDaysInNextAndPreviousMonths: true,
            autoClose: true
   



        }


    );
    //КАЛЕНДАРИ

}