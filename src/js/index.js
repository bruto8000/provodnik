let app = new Vue({
    el: "#app",
    data: {
        route: window.location.hash,
        menu: {},
        screen: "",
        status: "loading",
        editableProject: {},
        routes : ['show-proj', 'edit-proj', 'edit-tabel', 'employees', 'show-calendar', 'show-tabel', 'add-proj']
    },
    mounted() {


        window.onhashchange = (function (n, o) {

            this.route = location.hash.slice(1);
        }).bind(this)

        this.menu = M.Sidenav.init(document.getElementById('menu'))

        document.addEventListener('keydown', function (key) {
            if (key.code == "Escape") {

                if (!this.menu.isOpen)
                    this.menu.open()
                else
                    this.menu.close()
            }
        }.bind(this))

        Vue.nextTick(() => {
            if (!location.hash.slice(1))
                this.status = 'waiting';

                this.setScreen(location.hash.slice(1))
            
        });


 
    },
    components: {
        showProj: showProj,
        employees: Employees
   

    },
    methods: {
        setScreen(component) {
            console.log('changing screen')
            this.menu.close();
            if (this.screen == component) {
                return;
            }
            if(!this.routes.includes(component)){
                console.log('UPS', component)
                component = '';
            }
            this.status = 'loading';

            setTimeout(() => {


                this.screen = component;
                location.hash = component
            }, 100)
            setTimeout(() => {
                this.status = 'waiting';
            }, 500);


        },
        editProj(project) {

            this.editableProject = project;
            this.setScreen('edit-proj')
        },


    },

    watch: {
        route(n, o) {
            if (n == this.screen) {
                return;
            } else {
                console.log('setting New')
                this.setScreen(n)
            }


        }
    }

})