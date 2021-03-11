let projectModal = {props: ['project'],

data(){
    return {
modal: {},

projectTypes: {
    public : "Публичный",
    private: "Приватный",
    secret: "Секретный"
}
    }
},
watch :{

project:function(n,o){

    if(!n.id)return;
    this.modal.open();
   console.log(this.project.audits)
   Vue.nextTick(()=>{
    if(this.project.audits){
        this.project.audits.forEach(audit=>{
            this.createDonut(audit);
        })
    }
   })
  
    
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
methods: {
    createDonut(audit) {
        console.log('CREATING', audit)
if(!audit){return}
        let ctx = document.getElementById( 'DONUT'+this.project.audits.indexOf(audit)).getContext('2d');
        let data = [];
        let labels = [];
        let colors = [];
        audit.rows.forEach(row => {
          data.push(row.propInt);
          labels.push(row.propName);
          colors.push(row.propColor);
        });
        audit.donut = new Chart(ctx, {
            type: 'doughnut',
            data: {

                datasets: [{
                    data: data,
                    backgroundColor: colors
                }],
                labels: labels
            }
            // These labels appear in the legend and in the tooltips when hovering different arcs


        });
    },
    editProject(){
        location.replace('./editProj.html?'+this.project.id);
    }



},
template : `

<div id="projectModal" class="modal">
<div class="modal-content">
  <h4>{{project.nazvanie}}</h4>
 <p>{{project.opisanie}} </p>
  <div v-html="project.opisanieBody">

  </div>





  <div class="audits container" v-show="project.audits">
    <h3 class="center fluid-text">
        Статусы по запуску/Доп.информация (Аудит)
     
     </h3>  


 


     <div class="row" v-for="audit,idx in project.audits" :key="idx">




<br>

        <h4 class="center fluid-text">{{audit.name}}</h4>
        <div class="row">
            <div class="col m6 offset-m3">
            Тип: {{ projectTypes[audit.type] }}
      
            </div>
        
           
        </div>
<div class="col m6">

    <table class=" centered">
        <thead>
          <tr>
              <th>Причины обращения</th>
              <th>Кол-во</th>
         

          </tr>
        </thead>

        <tbody>
          <tr v-for="row in audit.rows">
            <td>{{row.propName}}</td>
            <td>{{row.propInt}}</td>
         
 
          </tr>
      <tr>
     

      </tr>  
        </tbody>
      </table>


      </div>
    
        <div class="col m6">
     <canvas class="" :id="'DONUT'+idx" width="400" height="400">
      </canvas>
        </div>
    </div>

</div>




</div>
<div class="modal-footer">
<a href="#!" class="modal-close btn-flat"  @click="editProject()">Изменить</a>
  <a href="#!" class="modal-close  btn-flat">Закрыть</a>
</div>
</div>

`

}