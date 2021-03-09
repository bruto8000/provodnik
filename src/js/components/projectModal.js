let projectModal = {props: ['project'],

data(){
    return {
modal: {},
projectinside: {}
    }
},
watch :{

project:function(n,o){

    if(!n.id)return;
    this.modal.open();
},

},
computed: {
 
   
}
,
mounted(){

    this.modal = M.Modal.init(document.getElementById('projectModal'),{
        inDuration: 0,
        outDuration: 0,
        onCloseEnd: function(){
            console.log(this)
            this.$emit('change-project-to-null')
        }.bind(this)
    });

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
  <a href="#!" class="modal-close  btn-flat">Закрыть</a>
</div>
</div>

`

}