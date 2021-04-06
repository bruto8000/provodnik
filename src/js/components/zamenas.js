 Vue.component('zamenasComponent',{
props: ['allEmployees', 'mainEmployee','zamenas'],
  data() {
    return {
  
      
      };
    
  },
  mounted() {
    M.Collapsible.init(document.getElementById("zamenasCollaps"));
  },
  computed: {
    employees() {
      return this.allEmployees.map((v) => v.full_name).filter(v=>v!=this.mainEmployee);
    },
  },
  methods:{
    addZamena(){
        this.zamenas.push({
            employee: '',
            fdate: "",
            sdate:""
        });
      
        
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
      this.zamenas.splice(this.zamenas.indexOf(zamena),1);
  
          }
  },
  watch :{
    zamenas(){
      this.initDates();
      this.initSelect();
    }
  },
  template: `    <div >
  <ul class="collapsible" id="zamenasCollaps">
    <li>
      <div class="collapsible-header">
        <h3 class="title is-3">Замещающие</h3>
      </div>
      <div class="collapsible-body">

        <div class="columns">
          <div class="m-2">
            <button class="button is-info" @click="addZamena">
              Добавить замещающего
            </button>
          </div>
        </div>
        <div class="columns" v-for="(zamena,idx) in zamenas" :key="idx">
          <div class="column is-1">
            <button @click="deleteZamena(zamena)" class="button is-danger"><span class="mdi mdi-delete"></span></button>
          </div>
          <div class="column is-7 p-0">
            <select v-model="zamena.employee" class="zamenaSelect">
              <option :value="employee" v-for="employee in employees">
                {{employee}}
              </option>
            </select>
          </div>
          <div class="column is-2">
            <input
              type="text"
              class="datepicker zamenaDate input"
              v-model.lazy="zamena.fdate"
            />
          </div>
          <div class="column is-2">
            <input
              type="text"
              class="datepicker zamenaDate input"
              v-model.lazy="zamena.sdate"
            />
          </div>
        </div>
      </div>
    </li>
  </ul>
</div>`
});
