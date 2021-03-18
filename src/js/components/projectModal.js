let projectModal = {
  props: ["project", "showDonut"],

  data() {
    return {
      modal: {},

      projectTypes: {
        public: "Публичный",
        private: "Приватный",
        secret: "Секретный",
      },

      currentProject: {},
    };
  },
  watch: {
    project: function (n, o) {
      // console.log('PROJECT')
      if (!n.id) return;
      if (this.currentProject.id == n.id) {
        this.modal.open();
        //    console.log('uje est')
        return;
      }
      // console.log('oy new')
      this.destroyDonuts();
      this.currentProject = n;

      this.modal.open();
      console.log(this.project.audits);
      Vue.nextTick(() => {
        this.createDonuts(this.project.audits);

        this.toolTipsInit();
      });
    },
  },
  computed: {},
  mounted() {
    this.modal = M.Modal.init(document.getElementById("projectModal"), {
      inDuration: 0,
      outDuration: 0,
      onCloseEnd: function () {
        console.log(this);

        this.$emit("update:project", { id: null });
      }.bind(this),
    });

    this.modal.$overlay[0].onclick = () => {
      this.modal.close();
    };
  },
  methods: {
    createDonuts(audits) {
      if (!audits) return;
      audits.forEach((audit) => {
        console.log("Making Donut");
        if (!audit) {
          return;
        }
        let ctx = document
          .getElementById("DONUT" + this.currentProject.audits.indexOf(audit))
          .getContext("2d");
        let data = [];
        let labels = [];
        let colors = [];
        audit.rows.forEach((row) => {
          data.push(row.propInt);
          labels.push(
            row.propName.length > 20
              ? row.propName.slice(0, 20) + "..."
              : row.propName
          );
        });
        audit.donut = new Chart(ctx, {
          type: "doughnut",
          data: {
            datasets: [
              {
                data: data,
                backgroundColor: [
                  "#c2185b",
                  "#3949ab",
                  "#2196f3",
                  "#00bcd",
                  "#009688",
                  "#66bb6a",
                  "#f4ff81",
                  "#f4511e",
                  "#00e676",
                  "#cddc39",
                ].sort((v) => {
                  return Math.floor(Math.random() * 10) > 5 ? 1 : -1;
                }),
              },
            ],
            labels: labels,
          },

          // These labels appear in the legend and in the tooltips when hovering different arcs
        });
      });
    },
    destroyDonuts() {
      if (!this.currentProject.audits) return;
      this.currentProject.audits.forEach((audit) => {
        if (audit.donut) audit.donut.destroy();
      });
    },
    editProject() {
      console.log("emmiting edit proj");
      this.$emit("edit-proj", this.currentProject);
      // location.replace('./editProj.html?'+this.currentProject.id);
    },
    toolTipsInit() {
      document.querySelectorAll(".cut-to-20-ch").forEach((th) => {
        if (th.innerText.length > 21) {
          th.dataset.tooltip = th.innerText;
          th.innerText = th.innerText.slice(0, 20);
          th.dataset.position = "bottom";
          th.classList.toggle("tooltiped");
        }
      });

      if (!window.tooltips) {
        window.tooltips = [];
      }

      window.tooltips.push(
        M.Tooltip.init(document.querySelectorAll(".tooltiped"))
      );
    },
  },
  template: `


<div id="projectModal" class="modal">



<div class="modal-content">
    <h1 class="title is-2">{{currentProject.nazvanie}}</h1>
    <p>{{currentProject.opisanie}} </p>
    <div v-html="currentProject.opisanieBody">

    </div>





    <div class="audits "
        v-show="showDonut && currentProject.audits && currentProject.audits.length">
        <h3 class="center fluid-text title is-2">
           Доп.информация (Аудит)

        </h3>





        <div class="box" v-for="audit,idx in currentProject.audits" :key="idx">




      

            <h4 class="center fluid-text title is-4">{{audit.name}}</h4>
            <div class="columns">
                <div class="column is-6 is-offset-3 title-is-5 has-text-centered">
                    Тип: {{ projectTypes[audit.type] }}

                </div>


            </div>

            <div class="columns">
                <div class="column is-6">

                    <table class="table  centered is-hoverable is-fullwidth" >
                        <thead>
                            <tr>
                                <th class="cut-to-20-ch">{{audit.subname}}</th>
                                <th>Кол-во</th>


                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="row,rowIdx in audit.rows">
                                <td class="truncate cut-to-20-ch"  :id="idx+rowIdx">{{row.propName}}</td>
                                <td>{{row.propInt}}</td>


                            </tr>
                            
                        </tbody>
                    </table>


                </div>

                <div class="column is-6">
                    <canvas class="" :id="'DONUT'+idx" width="400" height="400">
                    </canvas>
                </div>
            </div>

        </div>




    </div>
    <div class="modal-footer">
        <a class="modal-close btn-flat" @click="editProject()">Изменить</a>
        <a class="modal-close  btn-flat">Закрыть</a>
    </div>
</div>



</div> 




`,
};
