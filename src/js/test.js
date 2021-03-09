// setTimeout(()=>location.reload(), 3000) 




let app = new Vue({
    el: "#app",
    data: {

        dataSource: [
        
        ],
        selected: false,
        canReWriteSelected: true,
        currentProjects: [],
        projectForModal: {}
    
    },
    mounted: function () {

axios.get('./vendor/showProj.php')
.then(({data})=>{

    ///PARSING 

 data.forEach(DATE => {
    let splited = DATE.fdate.split(' ');

    if(splited.length===1)return;
    if(splited.length == 3){
        splited[1] = splited[1] -1;
        DATE.startDate = new Date(...splited.reverse())
        DATE.endDate =   DATE.startDate;

    }else{

        if(isNaN(Number(splited[0]))){

            return;
            switch(splited[0]){
                case 'I' :  DATE.startDate = new Date(splited[1], 0,1);  DATE.endDate = new Date(splited[1], 3,0);break;
                case 'II' :  DATE.startDate = new Date(splited[1], 3,1);  DATE.endDate = new Date(splited[1], 6,0);break;
                case 'III' :  DATE.startDate = new Date(splited[1], 6,1);  DATE.endDate = new Date(splited[1], 9,0);break;
                case 'IV' :  DATE.startDate = new Date(splited[1], 9,1);  DATE.endDate = new Date(splited[1], 12,31);break;


            }

        }else{
            splited[0] = splited[0] -1;
            console.log(splited[0])
            DATE.startDate = new Date(...splited.reverse(), 1) ;  
         
            DATE.endDate = new Date( splited[0], splited[1] +1, 0);

        }




    }



   


});
this.dataSource = data;



 
})




    },
    methods: {
setDay({date,events}){
    if(this.selected && this.canReWriteSelected){this.selected=false};
    if(this.selected)return;
this.currentProjects = events;

},
setRange({startDate,endDate}){
this.canReWriteSelected = false;
this.selected = true;
this.currentProjects = this.dataSource.filter(v=>{
if(v.startDate>=startDate && v.endDate <= endDate)return true;
return false;
})
setTimeout(() => {
    this.canReWriteSelected = true;
}, 4000);
},
openProject(project){

this.projectForModal = project;
}


    },
    components: {
        calendar : Calendar,
        projectModal: projectModal
    }
})