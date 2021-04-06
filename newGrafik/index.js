new Vue({
  el: "#app",
  data() {
    return { allEmployees: ['bruto1','bruto2'
    ,'bruto3'
    ,'bruto4'
    ,'bruto5'
    ,'bruto6'
    ,'bruto7'
    ,'bruto8'
    ,'bruto9'
    ,'bruto10'
    ,'bruto11'
    ,'bruto12'
    ,'bruto13'
    ,'bruto14'
    ,'bruto15'], mainEmployee: "bruto5", zamens: [] };
    
  },
  mounted() {
    M.Collapsible.init(document.getElementById("zamensCollaps"));
  },
  computed: {
    employees() {
      return this.allEmployees.filter((v) => true);
    },
  },
  methods:{
    addZamena(){
        this.zamens.push({
            employee: '',
            fdate: "",
            sdate:""
        });
        this.initDates();
        this.initSelect();
        
    },
    async initDates(){
await this.$nextTick();
Kalendar.set(null,'.zamenaDate')
    },
    async initSelect(){
        await this.$nextTick();
        M.FormSelect.init(document.querySelectorAll('.zamenaSelect')) 
    },
    deleteZamena(zamena){
      
this.zamens.splice(this.zamens.indexOf(zamena),1);
this.initDates();
this.initSelect();
    }
  }
});
