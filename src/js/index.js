


let app = new Vue({
    el: "#app",
    data: {

     menu: {},
     screen: "",
     status: "loading",
     editableProject: {}
    },
    mounted(){
       this.menu = M.Sidenav.init(document.getElementById('menu'))

document.addEventListener('keydown', function(key){
  if(key.code == "Escape"){

      this.menu.open()
  }
}.bind(this))

Vue.nextTick(()=>{
this.status = 'waiting';
})
    },
        components:{
            showProj: showProj,
            employees: Employees

    },
    methods :{
        setScreen(component){
            this.menu.close();
            this.status = 'loading';
            this.screen = component;
  setTimeout(() => {
   
    this.status = 'waiting';

  }, 500);
          
 
        },
        editProj(project){
            console.log(project)
            console.log('catching emmit in parent ')
this.editableProject = project;
this.setScreen('edit-proj')
        }

    }

})