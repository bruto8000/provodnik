
let app = new Vue({
    el: "#app",
    data: {
        full_name: "",
        nid: "",
        login: ""


 
    },
    methods:  {
    addToServ:    function () {
  if(!this.full_name || !this.nid || !this.login){
      M.toast({html:"Упс, что-то пусто"});
      return;
  }
  axios.post('../vendor/addEmployee.php',JSON.stringify( {
      full_name: this.full_name,
      nid: this.nid,
      login: this.login
  }))
  .then(res=>{
      console.log(res.data)
      if(res.data=="OK"){
          M.toast({html: "Сотрудник добавлен"});
          this.full_name = ''
          this.nid = ''
          this.login = ''
      }else  if(res.data == 'NID'){
         
        M.toast({html: "Уникальный ID уже существует"});
      }else{
        M.toast({html: "Что-то не так. Зовите программиста" + res.data});
      }
  })
    
}}
});