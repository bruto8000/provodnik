

let Kalendar = (()=>{






    function kalendarSet(prop, querySelector) {
        return M.Datepicker.init(document.querySelectorAll( querySelector || '.datepicker'),
    
            {
                ...prop,
    
            
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



    return  {
set: kalendarSet
    }
})();
