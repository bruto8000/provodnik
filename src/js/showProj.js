// setTimeout(()=>location.reload(), 3000) 


let app = new Vue({
    el: "#app",
    data: {
        kalendar: "",
        projects: [],
        table: {
            created: false
        },
        filterSelect: {
            bizness: "",
            zapusk: "",
            status: "",
            fdate: "",
            sdate: "",
            soprovod: ""

        },
        filterInput: {
            zakazchik: "",
            nazvanie: "",
            opisanie: "",


        },
        sort: {
            column: ""
        },
        employees: [],
        modal: {
            project: {

            }
        }
    },
    mounted: function () {

        axios.get('../vendor/showProj.php')
        .then(res => {
            this.projects = res.data.reverse();
        }, err => {
                M.toast({
                    html: "Ошибка " + err
                })
            });
            
            axios.get('../vendor/showEmployees.php')
            .then(res => {
                
                
                this.employees = res.data;
                
                Vue.nextTick( ()=> {
                    this.kalendar = Kalendar.set();
                    M.FormSelect.init(document.querySelectorAll('select'))
                  
                })
                
                
            })
            
            this.modal.modal = M.Modal.init(document.getElementById('projectModal'));
            this.modal.modal.$overlay[0].onclick  = ()=>{
                this.modal.modal.close();
            }
      
            
      
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
            Vue.nextTick(function () {
                M.FormSelect.init(document.querySelectorAll('select'))
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
        },
        openProject(project){
this.modal.project = project;
this.modal.modal.open();



        },
        exportToExcel: function () {


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
            this.table.created = true;
            Vue.nextTick(()=>{
                tableToExcel(document.getElementById('allTable'), 'Проекты');
                this.table.created = false;
            })
          
        },
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
                if (!this.sort.column) return  1;
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














