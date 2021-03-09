let projectModal = {props: ['project'],

data(){
    return {
modal: {}
    }
},
watch :{
project : function(n,o){
    this.modal.open();
}
},
computed: {
   
}
,
mounted(){

    this.modal = M.Modal.init(document.getElementById('projectModal'));

        this.modal.$overlay[0].onclick  = ()=>{
            this.modal.close();
        }
   

    

},
template : `


<div id="projectModal" class="modal">
<div class="modal-content">
  <h4>{{project.nazvanie}}</h4>
 <p>{{project.opisanie}} </p>
  <div v-html="project.opisanieBody">

  </div>

</div>
<div class="modal-footer">
  <a href="#!" class="modal-close waves-effect waves-green btn-flat">Закрыть</a>
</div>
</div>

`

}