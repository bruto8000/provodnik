// setTimeout(()=>location.reload(), 3000) 




let app = new Vue({
    el: "#app",
    data: {

        dataSource: [

        ],
        selected: false,
        canReWriteSelected: true,
        header: '',
        currentProjects: [],
        projectForModal: {},
        monthSpans: [],
        monthWrappers: [],
        monthsWithUnsetDate: [],
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
        currentMonth: 0


    },
    mounted: function () {
        setTimeout(() => {
            for (let i = 0; i < 12; i++) {
                this.monthSpans.push(document.getElementById('monthSpan' + i))
                this.monthWrappers.push(document.getElementById('monthWrapper' + i))
            }
        }, 200);


        setTimeout(() => {
            console.log(this.monthWrappers)
            this.monthWrappers.forEach((e, idx) => {
                e.onclick = () => {
                    this.monthCheck(idx)
                }
            })
        }, 1000);


        axios.get('./vendor/showProj.php')
            .then(({
                data
            }) => {

                ///PARSING 

                data.forEach(DATE => {
                    let splited = DATE.sdate.split(' ');

                    if (splited.length === 1) return;
                    if (splited.length == 3) {
                        splited[1] = splited[1] - 1;
                        DATE.startDate = new Date(...splited.reverse())
                        DATE.endDate = DATE.startDate;

                    } else {

                        if (isNaN(Number(splited[0]))) {

                            return;
                            switch (splited[0]) {
                                case 'I':
                                    DATE.startDate = new Date(splited[1], 0, 1);
                                    DATE.endDate = new Date(splited[1], 3, 0);
                                    break;
                                case 'II':
                                    DATE.startDate = new Date(splited[1], 3, 1);
                                    DATE.endDate = new Date(splited[1], 6, 0);
                                    break;
                                case 'III':
                                    DATE.startDate = new Date(splited[1], 6, 1);
                                    DATE.endDate = new Date(splited[1], 9, 0);
                                    break;
                                case 'IV':
                                    DATE.startDate = new Date(splited[1], 9, 1);
                                    DATE.endDate = new Date(splited[1], 12, 31);
                                    break;


                            }

                        } else if (splited.length === 2) {
                            splited[0]--;
                            DATE.unseted = true;
                            DATE.month = splited[0];
                            if (!this.monthsWithUnsetDate.includes(splited[0])) {
                                this.monthsWithUnsetDate.push(splited[0])
                            } //Тут значит что проект нужно подвозять к календарю на месяц
                        }
                    }
                });
                this.dataSource = data;

                setTimeout(() => {

                    this.monthSet();
                }, 300);


            })




    },
    methods: {
        monthSet() {

            this.monthSpans.forEach((e, idx) => {
                if (this.monthsWithUnsetDate.includes(idx)) e.innerText = '•'
            })

        },
        monthCheck(idx) {
            console.log(idx)
            if ((this.currentProjects = this.unsetDateProjects.filter(v => {
                   return v.month == idx;
                })).length) {
             this.showUnsetDate = true;
             this.currentMonth = idx;
             this.header = ` Активности без даты старта на ${this.months[this.currentMonth]}  - ${this.currentProjects.length } :`
                    this.stopSelect();

            } else return;




        },
        setDay({
            date,
            events
        }) {
            if (this.selected && this.canReWriteSelected) {
                this.selected = false;
                this.header =    `Активности на выбранный день - ${this.currentProjects.length }  :`
            };
            if (this.selected) return;
            this.currentProjects = events;

        },
        setRange({
            startDate,
            endDate
        }) {
            if ((this.currentProjects = this.dataSource.filter(v => {
                    if (v.startDate >= startDate && v.endDate <= endDate) return true;
                    return false;
                })).length) {
                    this.stopSelect();
                    this.header =    `Активности на выбранный период - ${this.currentProjects.length }  :`


            }
            return;

        },
        openProject(project) {

            this.projectForModal = project;
        },
        stopSelect(ms){
if(!ms)ms=4000;
console.log(ms)
this.canReWriteSelected = false;
this.selected = true;
setTimeout(() => {
    this.canReWriteSelected = true;
    this.showUnsetDate = false
}, ms);

        }


    },
    components: {
        calendar: Calendar,
        projectModal: projectModal,
        preloader: preloader
    },
    computed: {
        unsetDateProjects() {
            return this.dataSource.filter(v => {
            
                return !!v.unseted
            })
        }
    }
})