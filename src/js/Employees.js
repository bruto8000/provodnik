
let Employees = {

    data(){return {
        full_name: "",
        nid: "",
        login: "",
        employees: [],
        EditableEmployee: {},
        modals: {
          editModal: null,
          deleteModal: null
        }

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

template: `

<div class="container">



<div>
    <h3 class="center title is-3">Добавление сотрудника</h3>
<br>

    <div class="columns">
        <div class="column is-4">
            Сотрудник (ФИО)
        </div>
        <div class="column is-4">
           Логин *
        </div>
        <div class="column is-4">
           Уникальный ID
         </div>
        </div>
        
        
        <div class="columns">
            <div class="column is-4">
               <input  class="input" type="text" name="" id="" v-model="full_name">
            </div>
            <div class="column is-4">
                <input class="input"  type="text" name="" id="" v-model="login">
            </div>
            <div class="column is-4">
                <input class="input"  type="text" name="" id="" v-model="nid">
             </div>
            </div>
        
        
        <div class="columns center">
            <div class="button is-large is-primary column p-2" @click="addToServ">
                Добавить  <i class="mdi mdi-account-plus mdi-24px"></i>
            </div>
        </div>
        
        

</div>

<div class="columns my-5">
    <div class="column">
    <h3 class="title is-3 center">
        Список сотрудников
    </h3>
</div>
</div>
<div class="columns" v-for="employee in employees">

    <div class="column is-5"> {{employee.full_name}}</div>
    <div class="column is-3"> {{employee.login}} </div>
    <div class="column is-2">  {{employee.nid}}</div>
    <div class="column  is-2"> 
        <span class="icon is-large">

            <i class="mdi mdi-account-edit mdi-36px"  @click="editModalOpen(employee)" style="cursor: pointer;"></i> 
        </span>
        <span class="icon is-medium">

            <i @click="deleteModalOpen(employee)" class="mdi mdi-account-remove mdi-36px" style="cursor: pointer;"></i>
        
        </span>
        </div>

</div>

<div id="editModal" class="modal">
    <div class="modal-content">
      <h4 class="title is-4">Редактирование сотрудника</h4>
      <div class="columns my-2">
        <div class="column is-4">
            Сотрудник (ФИО)
        </div>
        <div class="column is-4">
           Логин
        </div>
        <div class="column is-4">
           Уникальный ID
         </div>
        </div>
        
        
        <div class="columns my-2">
            <div class="column is-4">
               <input class="input" type="text" name="" id="" v-model="EditableEmployee.full_name">
            </div>
            <div class="column is-4">
                <input class="input" type="text" name="" id="" v-model="EditableEmployee.login">
            </div>
            <div class="column is-4">
                <input class="input" type="text" name="" id="" v-model="EditableEmployee.nid" disabled>
             </div>
            </div>

    </div>
    <div class="modal-footer">
      <a href="#!" class="button is-info modal-close" @click='editOnServ'>Изменить</a>
      <a href="#!" class="button is-primary modal-close">Закрыть</a>
    </div>
  </div>
  <div id="deleteModal" class="modal">
    <div class="modal-content">
      <h4 class="title is-4">Удаление сотрудника</h4>
      <p class="my-2">Внимание, сотрудник будет удален! Данные связанные с сотрудником останутся, но отображаться не будут. Вы уверены?</p>

      <div class="columns">
        <div class="column is-4">
            Сотрудник (ФИО)
        </div>
        <div class="column is-4">
           Логин
        </div>
        <div class="column is-4">
           Уникальный ID
         </div>
        </div>
        <div class="columns">
            <div class="column is-4">
              {{EditableEmployee.full_name}}
            </div>
            <div class="column is-4">
                {{EditableEmployee.login}}
            </div>
            <div class="column is-4">
                {{EditableEmployee.nid}}
             </div>
            </div>

    </div>
    <div class="modal-footer">
      <a href="#!" class="modal-close button is-danger" @click="deleteFromServ">Удалить</a>
      <a href="#!" class="modal-close button is-primary">Закрыть</a>
    </div>
  </div>


</div>
`
}