
let app = new Vue({
    el: "#app",
    data: {
        full_name: "",
        nid: "",
        login: "",
        employees: [],
        EditableEmployee: {},
        modals: {
          editModal: null,
          deleteModal: null
        }

 
    },

mounted(){
  axios.get('./vendor/showEmployees.php').then((result)=>{
    this.employees = result.data.reverse();
  }, (err)=>{
    M.toast({html: "Упс, не удалось получить данные с сервера : ("})
  });

 this.modals.editModal =  M.Modal.init(document.getElementById('editModal'));
 this.modals.deleteModal =  M.Modal.init(document.getElementById('deleteModal'));


}
    ,methods:  {
    addToServ:    function (event) {

        event.target.classList.toggle('is-loading')

  if(!this.full_name || !this.nid || !this.login){
      M.toast({html:"Упс, что-то пусто"});
      setTimeout(() => {
        event.target.classList.toggle('is-loading')
    },400);
      return;
  }
  axios.post('../vendor/addEmployee.php',JSON.stringify( {
      full_name: this.full_name,
      nid: this.nid,
      login: this.login
  }))
  .then(res=>{
    setTimeout(() => {
      event.target.classList.toggle('is-loading')
  }, 400);
      console.log(res.data)
      if(res.data=="OK"){
          M.toast({html: "Сотрудник добавлен"});
          this.employees.unshift({
      'full_name' : this.full_name,
      nid: this.nid,
      login: this.login
          })
          this.full_name = ''
          this.nid = ''
          this.login = ''
      }else  if(res.data == 'NID'){
        
         
        M.toast({html: "Уникальный ID уже существует"});
      }else{
        M.toast({html: "Что-то не так. Зовите программиста" + res.data});
      }
  })
    
},
deleteFromServ: function(employee){

  axios.post('./vendor/deleteEmployee.php',JSON.stringify(this.EditableEmployee))
  .then(result=>{
    M.toast({html: "Сотрудник удален"})
this.employees = this.employees.filter(e=>{return e.nid != this.EditableEmployee.nid})
  }, error=>{
    M.toast({html: "Сотрудник НЕ удален" + error})
  })
  .then(()=>{
   
  })

},

editOnServ: function(employee){

  if(!this.EditableEmployee.full_name ||  !this.EditableEmployee.login){
    M.toast({html:"Упс, что-то пусто"});
    return;
}


  axios.post('./vendor/editEmployee.php',JSON.stringify(this.EditableEmployee))
  .then(result=>{
    M.toast({html: "Сотрудник изменен"})

this.employees.map((e)=>{
  if(e.nid == this.EditableEmployee.nid){
    console.log(e)
    e.full_name = this.EditableEmployee.full_name;
    e.login = this.EditableEmployee.login;
  }
})

}, error=>{
    M.toast({html: "Сотрудник НЕ изменен" + error})
  })


},
deleteModalOpen(employee){
  this.EditableEmployee = Object.assign({}, employee)
this.modals.deleteModal.open();
},
editModalOpen(employee){
  this.EditableEmployee = Object.assign({}, employee)
this.modals.editModal.open();
}

    },
components:{
preloader: preloader
}
});