// setTimeout(()=>location.reload(), 3000) 


let app = new Vue({
    el: "#app",
    data: {
   
        date1: "",
        date2: ""        

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
        dateRange : function () {
     
        
            
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
                                dateForPush += theDate.getDate()  + ' '
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
                            dateForPush += theDate.getDate()  + ' '
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
                   
        return dates;
            
                  
                    
            
                     
            
            
            
                   
            
                    },
        createTable: function(){
//             let range = this.dateRange();


// range.forEach((element,idx) => {
//     setTimeout(() => {
//         axios.post('../vendor/test.php', JSON.stringify({
//             date: element
//         }))
//         .then(res=>console.log(res.data))
//     }, idx * 100);
   
// });
      
        }
    },
    watch: {

    },
    computed: {
    
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