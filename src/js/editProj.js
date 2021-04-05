// setTimeout(()=>location.reload(), 3000)

Vue.component("editProj", {
  props: ["projectFromParent"],
  data() {
    return {
      project: {
        fdate: "",
        sdate: "",
        nazvanie: "",
        bizness: "",

        zapusk: "",
        soprovod: "",
        status: "",
        zakazchik: "",
        flags: [],
        ocenka: {
          type: "",
          reason: "",
        },
        AB: [
          // {
          // type: 'big',
          // range: [1,2,3,4],
          // TRs: [
          //   {
          //     type : "Смс-рассылка",
          //     inputs: [{value}]
          //   },
          //   {type : "Смс-рассылка",
          //     inputs: [{value}]
          //   },
        ],

        statusZapusk: [],
        risks: [],
        audits: [],
        difficulty: "",
        bugs: [],
        dopinfo: "",
        //  opisanieBody: "", Will added Automaticly
        //   opisanie: "", OLD
      },
      requirements: [
        "fdate",
        "sdate",
        "nazvanie",
        "bizness",
        "zapusk",
        "soprovod",
        "status",
        "zakazchik",
        "flags",
      ],

      editor: "",
      undate: false,
      employees: [],
      kalendar: [],
      donut: "",
      audits: [
        //     {
        //     name: "Название аудита",
        //     subname: ""
        //     rows: [{
        //         propName: "Причина ...",
        //         propInt: 25,
        //         propColor: ""
        //     }],
        //     type: 'public | private | secret'
        // }
      ],
      projectNameErrors: {
        fdate: "Дата спуска",
        sdate: "Дата запуска",
        nazvanie: "Название",
        bizness: "Вид бизнеса",
        zapusk: "Тип запуска",
        soprovod: "Сопровождающий",
        status: "Статус",
        zakazchik: "Заказчик",
        difficulty: "Сложность",
      },
      buttonIsLoading: false,
      ABModal: {},
    };
  },
  mounted: function () {
    //     setTimeout(() => {
    //       M.Collapsible.init(document.querySelectorAll('.collapsible'));

    // // this.addABtabel('big')

    //     }, 1000);
    axios.get("../vendor/showEmployees.php").then((res) => {
      this.employees = res.data;

      this.editor = new FroalaEditor("#pbody", {
        // Set the file upload URL.

        toolbarButtons: [
          [
            "bold",
            "italic",
            "underline",
            "|",
            "fontSize",
            "color",
            "formatOL",
            "formatUL",
            "insertLink",
            "insertTable",
            "insertImage",
            "html",
            "insertFileRR",
          ],
        ],
        fileUploadURL: "upload_file.php",
        fileUploadParams: {
          id: "my_editor",
        },
        imageUploadURL: "upload_image.php",
        imageUploadParams: {
          id: "my_editor2",
        },
        language: "ru",
      });
      this.dopeditor = new FroalaEditor("#dopbody", {
        // Set the file upload URL.

        toolbarButtons: [
          [
            "bold",
            "italic",
            "underline",
            "|",
            "fontSize",
            "color",
            "formatOL",
            "formatUL",
            "insertLink",
            "insertTable",

            "html",
          ],
        ],

        language: "ru",
      });
      this.loadProject();
    });

    this.$refs.sdate.dataset.tooltip = "Нажмите чтобы сделать неопределенной";
    this.$refs.sdate.dataset.position = "top";
    M.Tooltip.init(this.$refs.sdate);
    this.ABModal = M.Modal.init(document.getElementById("ABModal"));
  },
  methods: {
    loadProject() {
      if (!this.projectFromParent.id) {
        M.toast({
          html: "Неверная ссылка,  перенаправление...",
        });
        // setTimeout(() => {
        //   location.hash = "show-proj";
        // }, 1000);
      } else {
        console.log(this.projectFromParent.AB)
        this.project = (({
          id,
          fdate,
          sdate,
          nazvanie,
          bizness,
          zapusk,
          soprovod,
          status,
          zakazchik,
          flags,
          ocenka,
          AB,
          statusZapusk,
          risks,
          audits,
          difficulty,
          bugs,
          eGrafiks,
          tags,
        }) => ({
          id,
          fdate,
          sdate,
          nazvanie,
          difficulty,
          bizness,
          zapusk,
          soprovod,
          status,
          zakazchik,
          flags :JSON.parse(JSON.stringify(flags)),
          ocenka : JSON.parse(JSON.stringify(ocenka)),
          AB : JSON.parse(JSON.stringify(AB)),
          statusZapusk :  JSON.parse(JSON.stringify(statusZapusk)),
          risks : JSON.parse(JSON.stringify(risks)),
          audits: JSON.parse(JSON.stringify(audits)) ,
          bugs : JSON.parse(JSON.stringify(bugs)) ,
          eGrafiks : JSON.parse(JSON.stringify(eGrafiks)) ,
          tags :  JSON.parse(JSON.stringify(tags)) ,
        }))(this.projectFromParent);

        if (this.projectFromParent.opisanieBody)
          setTimeout(() => {
            this.editor.html.set(this.projectFromParent.opisanieBody);
          }, 200);
        setTimeout(() => {
          this.dopeditor.html.set(this.projectFromParent.dopinfo);
        }, 200);
        Vue.nextTick(function () {
          console.log(this);
          M.FormSelect.init(document.querySelectorAll("select"));
          M.Collapsible.init(document.querySelectorAll(".collapsible"));
          this.initStatusZapusk();
          this.initDates();
          this.project.audits.forEach((v) => {
            this.createDonut(v);
          });

          this.project.AB.forEach((table) => {
            if (table.type == "big") {
              this.createGrafik(table);
            }
          });
        }, this);

        this.initGrafikDates();
        this.initdeletingModal();
      }
    },
    initdeletingModal(){
      this.deletingModal = M.Modal.init(document.getElementById('deletingModal'));
    },
    openDeletingModal(){
      this.deletingModal.open();
    },
    initDates() {
      this.kalendar[0] = Kalendar.set(
        {
          showMonthBtn: true,
        },
        "#sdate"
      );
      this.kalendar[1] = Kalendar.set({}, "#fdate");
    },
    editProj: function (event) {
      this.editButtonToggle(true);

      if (!this.validateALL()) {
        setTimeout(() => {
          this.editButtonToggle(false);
        }, 400);

        return;
      }
      let projectToSend = (({
        id,
        fdate,
        sdate,
        nazvanie,
        bizness,
        zapusk,
        soprovod,
        status,
        zakazchik,
        flags,
        ocenka,
        AB,
        statusZapusk,
        risks,
        audits,
        difficulty,
        bugs,
        eGrafiks,
        tags
      }) => ({
        id,
        fdate,
        sdate,
        nazvanie,
        bizness,
        zapusk,
        soprovod,
        status,
        zakazchik,
        flags,
        ocenka,
        AB,
        statusZapusk,
        risks,
        audits,
        difficulty,
        bugs,
        eGrafiks,
        tags
      }))(this.project);
     

      projectToSend.opisanieBody = this.editor.html.get().replace(/'/gi, '"');
      projectToSend.dopinfo = this.dopeditor.html.get().replace(/'/gi, '"');



    projectToSend.audits = [];

      this.project.audits.forEach((audit, idx) => {
        projectToSend.audits[idx] = {
          ...audit,
          donut: null
        }
        // if (audit.donut) {
        //   audit.donut.destroy();
        //   audit.donut = null;
        // }
      });

      console.log(projectToSend.audits)

      projectToSend.AB = [];
      this.project.AB.forEach((table, idx) => {
        projectToSend.AB[idx] = {
          ...table,
          line: null
        }
        
        // if (table.type == "big") {
        //   if (table.line) {
        //     table.line.destroy();
        //     table.line = null;
        //   }
        // }
      });
      projectToSend.eGrafiks = [];
      
      this.project.eGrafiks.forEach((eGrafik, idx) => {
        if (eGrafik.grafik) {
          projectToSend.eGrafiks[idx] = 
          { 
     ...eGrafiks,
     grafik: null

          }
        
          console.log(eGrafik);
          // eGrafik.grafik.destroy();
          // eGrafik.grafik = null;

      //     projectToSend.eGrafiks[idx].datasets = eGrafik.datasets.map((e) => {
      //  let returnable = {
      //         ...e,
      //         _meta : null
      //       };
      //       delete returnable._meta;
      //       return returnable;
      //     });
        }
      });
      console.log(projectToSend);

      axios
        .post("../vendor/editProj.php", JSON.stringify(projectToSend))
        .then((r) => {
          setTimeout(() => {
            this.editButtonToggle(false);
          }, 400);

          if (r.data == "OK") {
            M.toast({
              html: "Проект изменен",
            });
            this.projectFromParent = Object.assign(this.projectFromParent, this.project)
          } else {
            throw new Error(r.data);
          }
        })
        .catch((e) => {
          M.toast({
            html: "Проект НЕ изменен! " + e,
          });
        });
    },
    editButtonToggle(status) {
      if (status) {
        this.buttonIsLoading = true;
      } else {
        this.buttonIsLoading = false;
      }
    },

    undateZapusk: function () {
      this.undate = !this.undate;
      this.project.sdate = this.undate ? "Не определена" : "";
    },
    validateMainRows() {
      try {
        for (prop in this.project) {
          if (!this.project[prop]) {
            throw new Error(
              "Пусто, чего-то не хватает: " + this.projectNameErrors[prop]
            );
          }
        }

        if (this.editor.html.get().length < 50) {
          throw new Error("Описание слишком короткое.");
        }
        return true;
      } catch (e) {
        M.toast({
          html: e.message,
        });

        return false;
      }
    },
    validateAudits() {
      try {
        this.project.audits.forEach((audit, idx) => {
          if (audit.name.length < 3) {
            throw new Error(
              "Загаловок аудита не должен быть меньше 3х символов" +
                " (аудит #" +
                (idx + 1) +
                ")"
            );
          }

          if (audit.subname.length < 3) {
            throw new Error(
              "Подзагаловок аудита не должен быть меньше 3х символов" +
                " (аудит :" +
                audit.name +
                ")"
            );
          }
          if (audit.type == "") {
            throw new Error(
              "Не выбран тип аудита (Public/Private)" +
                " (аудит :" +
                audit.name +
                ")"
            );
          }
          audit.rows.forEach((row) => {
            if (row.propName == "") {
              throw new Error(
                "Не выбрано имя для строки в аудите: " + audit.name
              );
            }
            if (row.propInt == "") {
              throw new Error(
                "Не выбрано колличество для строки в аудите: " + audit.name
              );
            }
          });
        });

        return true;
      } catch (e) {
        M.toast({
          html: e.message,
        });

        return false;
      }
    },
    createDonut(audit) {
      console.log('CREATING DONUT...')
      if (!audit) {
        return;
      }
      if(audit.donut){
        console.log(audit)
        console.log('has donut')
        this.updateDonut(audit);
        return;
      }
      let ctx = document
        .getElementById("DONUT" + this.project.audits.indexOf(audit))
        .getContext("2d");
      let data = [];
      let labels = [];
      let colors = [];
      audit.rows.forEach((row) => {
        data.push(row.propInt);
        labels.push(row.propName);
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
              ].sort((v) => {
                return Math.floor(Math.random() * 10) > 5 ? 1 : -1;
              }),
            },
          ],
        },

        // These labels appear in the legend and in the tooltips when hovering different arcs
      });
    },
    updateDonut(audit) {
      console.log('UPDATING DONUT...')
      if (!audit.donut) {
        this.createDonut(audit);
        return;
      }
      let data = [];
      let labels = [];
      let colors = [];
      audit.rows.forEach((row) => {
        data.push(row.propInt);
        labels.push(row.propName);
      });

      audit.donut.config.data.datasets[0].data = data;
      audit.donut.config.data.labels = labels;
      audit.donut.update();
    },
    deleteRowInAudit(audit) {
      audit.rows.pop();
      this.updateDonut(audit);
    },
    addRowToAudit(audit) {
      if (audit.rows.length >= 10) {
        M.toast({
          html: "Достигнуто максимальное колличество строк",
        });
        return;
      }
      audit.rows.push({
        propName: "",
        propInt: 0,
      });
      this.updateDonut(audit);
      this.initSelectColor();
    },
    deleteAudit() {
      this.project.audits.pop();
    },
    addAudit() {
      this.project.audits.push({
        name: "",
        subname: "",
        rows: [
          {
            propName: "",
            propInt: 0,
          },
        ],
        type: "",
      });
      this.initSelectColor();
      Vue.nextTick(() => {
        this.createDonut(this.project.audits[this.project.audits.length - 1]);
      });
    },
    initSelectColor() {
      Vue.nextTick(() => {
        M.FormSelect.init(document.querySelectorAll(".selectColor"));
      });
    },
    changeOcenka() {
      if (
        this.project.ocenka.type == "Успешный" ||
        this.project.ocenka.type == ""
      )
        this.project.ocenka.reason = "";
      Vue.nextTick(() => {
        M.FormSelect.init(document.querySelectorAll("select"));
      });
    },
    validateOcenka() {
      if (
        this.project.ocenka.type == "С ошибкой" &&
        this.project.ocenka.reason == ""
      ) {
        M.toast({
          html: "Оценка проекта выбрана с ошибкой, но не выбрана причина",
        });
        return false;
      }
      return true;
    },
    validateALL() {
      // console.log(
      //   "validate",
      //   this.validateMainRows() &&
      //     this.validateAudits() &&
      //     this.validateOcenka()
      // );
      return (
        this.validateMainRows() &&
        this.validateAudits() &&
        this.validateOcenka() &&
        this.validateStatusZapusk() &&
        this.validateRisks() &&
        this.validateBugs() &&
        this.validateAB() &&
        this.validateEGrafiks() 

      );
    },
    openABmodal() {
      this.ABModal.open();
    },
    addStatusZapuskRow() {
      this.project.statusZapusk.push({
        opisanie: "",
        srok: "",
      });
      this.initStatusZapusk();
    },
    initStatusZapusk() {
      Vue.nextTick(() => {
        Kalendar.set(
          {
            showClearBtn: true,
            showMonthBtn: true,
            showKvartalBtn: true,
            container: document.getElementById("statusZapuskDate"),
          },
          ".statusZapuskDate"
        );

        setTimeout(() => {
          console.log(document.querySelectorAll(".statusZapuskInput"));

          M.Autocomplete.init(document.querySelectorAll(".statusZapuskInput"), {
            minLength: 1,
            data: {
              "Готовность в СУЗ": null,
              "Ожидаются прайсы": null,
              "Прайсы будут размещены": null,
              "В IVR информация передана": null,
              "IVR будет готов": null,
              "FAQ в проработке": null,
              "В чат-бот информация передана": null,
              "Чат-бот будет готов": null,
              "Тематики на согласовании": null,
              "Тематики будут готовы ": null,
              "Ожидается прогноз нагрузки": null,
              "Ожидается согласование ресурсов": null,
              КК: null,
              "Анализ Дизайн": null,
              "Полная готовность к запуска": null,
              "Инициатива запустилась.": null,
              "Запрос отклика": null,
              "Наблюдение за откликом": null,
              "Ожидается решение по обучению": null,
              "Обучение будет проводиться с": null,
              "АО на согласовании": null,
              "АО будет готов": null,
              "СФ на согласовании": null,
              "СФ будут готовы": null,
              "Процедура в проработке": null,
              "Процедура будет готова ": null,
              "Выдвинуты требования": null,
              "Согласование экстренной схемы": null,
              "Согласование маршрутизации/настройки сплитов": null,
              Тестирование: null,
              "Согласование коммуникаций ": null,
              "Согласование лендинга": null,
              "Согласование текста новости": null,
            },
          });
        }, 1000);
      });
    },
    deleteStatusZapuskRow() {
      this.project.statusZapusk.pop();
    },
    validateStatusZapusk() {
      if (
        this.project.statusZapusk.filter((v, idx) => {
          if (!v.opisanie) {
            M.toast({
              html: `Вы не ввели имя для строки ${
                idx + 1
              } в статусе по запуску`,
            });
            return true;
          }
        }).length
      ) {
        return false;
      }
      return true;
    },
    addRisksRow() {
      if (this.project.risks.length < 10) {
        this.project.risks.push({
          opisanie: "",
          prognoz: "",
          status: "",
        });
        this.initSelectRisks();
      } else {
        M.toast({
          html: "Вы достигли максимального количества срок '10'",
        });
      }
    },
    deleteRisksRow() {
      this.project.risks.pop();
    },
    validateRisks() {
      try {
        this.project.risks.forEach((risk, idx) => {
          for (prop in risk) {
            if (!risk[prop])
              throw new Error(
                `Не введены данные в рисках, поле ${prop} в строке ${idx + 1}`
              );
          }
        });
      } catch (e) {
        M.toast({
          html: e.message,
        });

        return false;
      }
      return true;
    },
    initSelectRisks() {
      this.$nextTick().then(() => {
        M.FormSelect.init(document.querySelectorAll(".risk-select"));
      });
    },
    destroyDonuts() {
      if (!this.project.audits) return;
      this.project.audits.forEach((audit) => {
        if (audit.donut) {audit.donut.destroy(); audit.donut = null}
      });
    },
    addBugsRow() {
      this.project.bugs.push({
        opisanie: "",
        soprovod: "",
        srok: "",
        comment: "",
        status: "",
      });
      this.initSelectBugs();
    },
    deleteBugsRow() {
      this.project.bugs.pop();
    },
    validateBugs() {
      try {
        this.project.bugs.forEach((bug, idx) => {
          for (prop in bug) {
            if (!bug[prop])
              throw new Error(
                `Не введены данные в багах, поле ${prop} в строке ${idx + 1}`
              );
          }
        });
      } catch (e) {
        M.toast({
          html: e.message,
        });

        return false;
      }
      return true;
    },
    initSelectBugs() {
      this.$nextTick().then(() => {
        M.FormSelect.init(document.querySelectorAll(".bug-select"));
      });
    },
    validateDopinfo() {
      this.project.dopinfo = this.dopeditor.html.get().replace(/'/gi, '"');
    },
    addABtabel(type) {
      if (type == "small")
        this.project.AB.push({
          type: "small",
          FMC: "",
          FTTB: "",
          B2C: "",
          B2B: "",
          FIX: "",
          PC: "",
        });
      if (type == "big") {
        let table = {
          type: "big",
          range: [],
          TRs: [],
        };

        (table.colors = [
          "#c2185b",
          "#3949ab",
          "#2196f3",
          "#00bcd",
          "#009688",
          "#66bb6a",
          "#f4ff81",
          "#f4511e",
          "#00e676",
        ].sort((v) => {
          return Math.floor(Math.random() * 10) > 5 ? 1 : -1;
        })),
          this.project.AB.push(table);
        this.$nextTick().then(() => {
          this.initGrafikDates();
          this.createGrafik(table);
        });
      }
    },
    async initGrafikDates() {
      await this.$nextTick();
      M.Dropdown.init(document.querySelectorAll(".dropdownTableRow"), {
        constrainWidth: false,
        hover: true,
      });
      Kalendar.set({}, ".table-date");
    },
    addTableTR(table, type) {
      table.TRs.push({
        type: type,
        inputs: table.range.map((v) => {
          return { value: "" };
        }),
      });
      this.updateGrafik(table);
    },
    deleteTableTR(table, type) {
      console.log(table, type);
      let idxOfTR = table.TRs.indexOf(table.TRs.find((v) => v.type === type));

      console.log(idxOfTR);
      table.TRs.splice(idxOfTR, 1);
      let color = table.colors[idxOfTR];
      console.log(color);
      table.colors.splice(idxOfTR, 1);
      table.colors.push(color);
      let idxOfLabel = table.line.data.datasets.indexOf(
        table.line.data.datasets.find((v) => v.label === type)
      );
      table.line.data.datasets.splice(idxOfLabel, 1);
      this.updateGrafik(table);
      // this.usedTypes(table);
    },
    changeTableRange(table) {
      if (table.fdate && table.sdate) {
        table.range = this.dateRange(table.fdate, table.sdate);
      }
      table.TRs.forEach((TR) => {
        while (TR.inputs.length < table.range.length) {
          TR.inputs.push({ value: "" });
        }
        if (TR.inputs.length > table.range.length) {
          TR.inputs.splice(table.range.length);
        }
      });

      // this.updateGrafik(table)
    },
    dateRange(date1, date2) {
      ///DATE
      let parts = date1.split(" ");

      let startDate;
      let endDate;
      if (parts.length === 3) {
        startDate = new Date(parts[2], parts[1] - 1, parts[0]);

        parts = date2.split(" ");

        endDate = new Date(parts[2], parts[1] - 1, parts[0]);
      } else if (parts.length == 2) {
        if (isNaN(Number(parts[0]))) {
          switch (parts[0]) {
            case "I":
              startDate = new Date(parts[1], "0", "1");
              endDate = new Date(parts[1], "3", "0");
              break;
            case "II":
              startDate = new Date(parts[1], "3", "1");
              endDate = new Date(parts[1], "6", "0");
              break;
            case "III":
              startDate = new Date(parts[1], "6", "1");
              endDate = new Date(parts[1], "9", "0");
              break;
            case "IV":
              startDate = new Date(parts[1], "9", "1");
              endDate = new Date(parts[1], "11", "31");
              break;
          }
        } else {
          //MONTH SELECTED

          startDate = new Date(parts[1], parts[0] - 1, "1");
          endDate = new Date(parts[1], parts[0], "0");
        }
      } else {
        startDate = new Date(parts[0], 0, 1);
        endDate = new Date(parts[0], 11, 31);
      }

      if (endDate < startDate) {
        let y;
        y = startDate;
        startDate = endDate;
        endDate = y;
      }

      let dates = [];
      //to avoid modifying the original date
      const theDate = new Date(startDate);

      while (theDate < endDate) {
        let dateForPush = "";

        if (theDate.getDate() < 10) {
          dateForPush += "0" + theDate.getDate() + " ";
        } else {
          dateForPush += theDate.getDate() + " ";
        }

        if (theDate.getMonth() < 9) {
          dateForPush += "0" + (theDate.getMonth() + 1) + " ";
        } else {
          dateForPush += theDate.getMonth() + 1 + " ";
        }
        dateForPush += theDate.getFullYear();
        dates.push(dateForPush);
        theDate.setDate(theDate.getDate() + 1);
      }

      let dateForPush = "";

      if (theDate.getDate() < 10) {
        dateForPush += "0" + theDate.getDate() + " ";
      } else {
        dateForPush += theDate.getDate() + " ";
      }

      if (theDate.getMonth() < 9) {
        dateForPush += "0" + (theDate.getMonth() + 1) + " ";
      } else {
        dateForPush += theDate.getMonth() + 1 + " ";
      }
      dateForPush += theDate.getFullYear();
      dates.push(dateForPush);

      // dates //

      // this.range = dates;
      return dates;
    },
    createGrafik(table) {
      let idx = this.project.AB.indexOf(table);
      let ctx = document.getElementById("line" + idx);
      table.line = new Chart(ctx, {
        type: "line",
        data: {
          labels: table.range,
          datasets: table.TRs.map((TR, idxOfTR) => {
            return {
              data: TR.inputs.map((input) => input.value),
              label: TR.type,
              fill: false,
              borderColor: table.colors[idxOfTR],
              backgroundColor: table.colors[idxOfTR],
            };
          }),
        },
        options: {
          scales: {
            xAxes: [
              {
                gridLines: {
                  display: false,
                },
              },
            ],
            yAxes: [
              {
                gridLines: {
                  display: false,
                },
              },
            ],
          },
        },
      });
    },
    updateGrafik(table) {
      if (!table.line) {
        this.createGrafik(table);
        return;
      }
      table.TRs.map((TR, idxOfTR) => {
        TR.inputs.map((input, idxOfInput) => {
          if (!table.line.data.datasets[idxOfTR]) {
            table.line.data.datasets[idxOfTR] = {
              label: TR.type,
              data: [],
              fill: false,
              borderColor: table.colors[idxOfTR],
              backgroundColor: table.colors[idxOfTR],
            };
          }
          table.line.data.datasets[idxOfTR].data[idxOfInput] = input.value;
        });

        table.line.data.datasets[idxOfTR].label = TR.type;
        console.log(table.line.data.datasets);

        if (
          table.line.data.datasets[idxOfTR] &&
          table.range.length < table.line.data.datasets[idxOfTR].data.length
        ) {
          table.line.data.datasets[idxOfTR].data.splice(table.range.length - 1);
        }
      });
      if (table.TRs.length < table.line.data.datasets.length) {
        table.line.data.datasets.splice(table.TRs.length - 1);
      }

      // table.line.data.datasets.forEach((dataset,idx)=>{
      //   dataset.data.forEach((value,idxOfInput)=>{
      //     table.line.data.datasets[idx].data[idxOfInput] = table.TRs[idx]?.inputs[idxOfInput]?.value;

      //   })
      // })
      table.line.data.labels = table.range;
      table.line.update();
    },
    deleteAB(table) {
      if (table.type == "big") {
        table.line.destroy();
      }
      this.project.AB = this.project.AB.filter((v) => v != table);
    },
    usedTypes(table) {
      return table.TRs.map((v) => v.type);
    },
    validateAB() {
      try {
        this.project.AB.forEach((table) => {
          if (table.type == "big") {
            if (!table.range.length) {
              throw new Error("Не выбраны даты для таблицы в абонентской базе");
            }
            if (!table.TRs.length) {
              throw new Error(
                "Не выбраны действия для таблицы в абонентской базе"
              );
            }
          }
        });
      } catch (e) {
        M.toast({ html: e.message });
        return false;
      }
      return true;
    },
    destroyAB() {
      if (!this.project.AB) return;
      this.project.AB.forEach((table) => {
        if (table.line) table.line.destroy();
      });
    },
    validateEGrafiks(){
      try {
        this.project.eGrafiks.forEach((eGrafik, idx) => {
       
          if(
            (eGrafik.nagruzkas && eGrafik.nagruzkas.find(nagruzka=>{
      return (!nagruzka.label || !nagruzka.date || !nagruzka.value);
          })
           ) || (!eGrafik.sdate || !eGrafik.fdate) ||  (eGrafik.type == 'zapusk' && !eGrafik.selectedIdx.length) || (eGrafik.type != 'zapusk' && eGrafik.selectedIdx === '')){
              throw new Error(
                `Некорректно заполнены графики по план факту.`
              );
         
            }


              
   
        });
      } catch (e) {
        M.toast({
          html: e.message,
        });

        return false;
      }
      return true;
    },
    deleteProj(){
      axios
      .post("../vendor/deleteProj.php", JSON.stringify({
        id: this.project.id
      }))
      .then((r) => {
   

        if (r.data == "OK") {
          M.toast({
            html: "Проект удален",
          });
          this.projectFromParent.deleted = true;
          setTimeout(() => {
            location.hash = "show-proj";
          }, 1000);
       
        } else {
          throw new Error(r.data);
        }
      })
      .catch((e) => {
        M.toast({
          html: "Проект НЕ удален! " + e,
        });
      });
    }
  },
  watch: {
    projectFromParent: function (n, o) {
      this.loadProject();
    },
  },
  deactivated() {
    console.log("deactivated");

    this.destroyDonuts();
    this.destroyAB();
  },
  activated(){
    this.project.audits.forEach((v) => {
      this.createDonut(v);
    });

    this.project.AB.forEach((table) => {
      if (table.type == "big") {
        this.createGrafik(table);
      }
    });
  },

  template: /*html*/ `<div class="container">


  <h1 class="center title is-1">Изменение проекта</h1>
  <div class="columns">
      <div class="column is-3 ">
          <div class="center">Дата спуска</div> <input v-model.lazy="project.fdate" id="fdate" type="text"
              class="datepicker center input" value="" placeholder="Выберите дату">
      </div>
      <div class="column is-3">
          <div class="center" @click="undateZapusk" ref='sdate'>Дата запуска</div> <input :disabled="undate"
              v-model.lazy="project.sdate" id="sdate" type="text" class="datepicker center input" value=""
              placeholder="Выберите дату">
      </div>
      <div class="column is-6 center ">
          <div class="  ">Название</div>
          <input placeholder="Введите Название" v-model="project.nazvanie" id="nazvanie" type="text"
              class="validate input">
      </div>
  </div>
  <div class="columns">
      <div class="column is-3 p-1 center ">
          <div class="  ">Вид бизнеса</div>
          <div class="">
              <select v-model="project.bizness" id="bizness">
                  <option value="" disabled selected>Вид бизнеса</option>
                  <option value="FMC">FMC</option>
                  <option value="B2B">B2B</option>
                  <option value="B2C">B2C</option>
                  <option value="ПК">ПК</option>
                  <option value="FTTB">FTTB</option>
                  <option value="FMC/FTTB">FMC/FTTB</option>
                  <option value="BTB/BTC">BTB/BTC</option>
                  <option value="FMC/B2C">FMC/B2C</option>
              </select>
          </div>
      </div>
      <div class="column is-3  p-1 center">
          <div class="  ">Тип запуска</div>
          <div class="">
              <select v-model="project.zapusk" id="zapusk">
                  <option value="" disabled selected>Тип запуска</option>
                  <option value="Запуск ТП">Запуск ТП</option>
                  <option value="Перезапуск ТП">Перезапуск ТП</option>
                  <option value="Закрытие ТП">Закрытие ТП</option>
                  <option value="Офсет">Офсет</option>
                  <option value="Симплификация/Репайсинг">Симплификация/Репайсинг</option>
                  <option value="Запуск Услуги">Запуск Услуги</option>
                  <option value="Изменение условий услиги">Изменение условий услиги</option>
                  <option value="Закрытие условий">Закрытие условий</option>
                  <option value="Запуск акции">Запуск акции</option>
                  <option value="Закрытие акции">Закрытие акции</option>
                  <option value="SMS/push/email рассылка">SMS/push/email рассылка</option>
                  <option value="Запуск Города">Запуск Города</option>
                  <option value="Оборудование">Оборудование</option>
              </select>
          </div>
      </div>

      <div class="column is-3 center p-1">
          <div class="  ">Сложность</div>
          <select v-model="project.difficulty"  id="difficulty">
<option value="1">1</option>
<option value="1.5">1.5</option>
<option value="2">2</option>
<option value="2.5">2.5</option>
<option value="3">3</option>
<option value="3.5">3.5</option>



          </select>
    
      </div>
      <div class="column is-3 center ">
          <div class="  ">Заказчик</div>
          <input placeholder="Введите заказчика" v-model="project.zakazchik" id="zakazchik" type="text"
              class="validate input">
      </div>
  </div>
  <div class="columns">
      <div class="column is-6 p-1">
          <div class="   center">Сопровождающий</div>
          <div class="">

              <select v-model="project.soprovod" id="soprovod">

                  <option value="" selected>Сопровождающий</option>
                  <option v-for="employee in employees" :value="employee['full_name']">{{employee['full_name']}}
                  </option>

              </select>
          </div>


      </div>



      <div class="column is-3  p-1 center ">
          <div class="">Статус</div>
          <div class="">
              <select v-model="project.status" id="status">
                  <option value="" disabled selected>Статус</option>
                  <option value="В работе">В работе </option>
                  <option value="Выполнено">Выполнено </option>
                  <option value="Отложено">Отложено</option>
                  <option value="Отменено">Отменено</option>


              </select>

          </div>
      </div>




      <div class="column is-3 center  p-1 ">
          <div class="  ">Флаги</div>
          <select placeholder="Флаги" v-model="project.flags" id="zakazchik" type="text" class="validate" multiple>

              <option disabled value="">Выбор</option>
              <option value="Влияние">Влияние</option>
              <option value="Экстренный запуск">Экстренный запуск</option>
              <option value="ДПП">ДПП</option>
              <option value="Конфиденциальность">Конфиденциальность</option>


          </select>

      </div>

  </div>
  <div class="columns">

      <div class="column is-12">

          <div class="froala">
              <label for="pbody">Описание</label>
              <textarea class="form-control" columns="7" wrap="hard" id="pbody" name="pbody"></textarea>
          </div>
      </div>
  </div>



  <br><br>


  <ul class="collapsible">
    
      <li>
          <div class="collapsible-header">

              <h3 class="title is-4 has-text-centered">

                  Абонентская база
              </h3>
          </div>
          <div class="collapsible-body">


              <div class="AB">
                  <h1 class="title is-1">
                      Абонентская база
                     
                      <button class="button is-primary" @click="openABmodal()">+</button>
                  </h1>

                  <div v-for="(table,idx) in project.AB" :key="idx" class=" my-5 box center">
                      <button class="button is-danger left"  @click="deleteAB(table)">-</button>

                      <div class="column is-6 is-offset-3" v-if="table.type == 'small'">

                          <table class="table  is-narrow is-fullwidth ">
                              <tr>
                                  <td>Вид бизнеса</td>
                                  <td>АБ</td>
                              </tr>

                              <tr>
                                  <td>FMC</td>
                                  <td> <input type="text" class="input" v-model="table.FMC"></td>
                              </tr>

                              <tr>
                                  <td>FTTB</td>
                                  <td><input type="text" class="input" v-model="table.FTTB"></td>
                              </tr>
                              <tr>
                                  <td>B2C</td>
                                  <td><input type="text" class="input" v-model="table.B2C"></td>
                              </tr>

                              <tr>
                                  <td>B2B</td>
                                  <td><input type="text" class="input" v-model="table.B2B"></td>
                              </tr>

                              <tr>
                                  <td>FIX</td>
                                  <td><input type="text" class="input" v-model="table.FIX"></td>
                              </tr>


                              <tr>
                                  <td>ПК</td>
                                  <td><input type="text" class="input" v-model="table.PC"></td>
                              </tr>
                          </table>

                      </div>

                      <div class="" v-if="table.type == 'big'">
                          <div class="columns">
                     

                                  <div class="column is-3 is-offset-3">
                                      <input type="text"  placeholder="Выберите дату" @change="changeTableRange(table)" class="datepicker input  table-date" v-model.lazy="table.fdate">
                                  </div>

                                  <div class="column is-3 ">
                                      <input type="text" placeholder="Выберите дату" @change="changeTableRange(table)" class="datepicker input table-date" v-model.lazy="table.sdate">
                                  </div>

                      
                          </div>

                          <div class="">
                              <div class="table-container">
                              <table class="table ma">
                                  <tr>
                                      <td >

                        

                               
                                          <button v-show="usedTypes(table).length<5" class='dropdown-trigger button is-primary dropdownTableRow '
                                              :data-target="'dropdown'+idx">Действие</button>

                                          <!-- Dropdown Structure -->
                                          <ul :id="'dropdown'+idx" class='dropdown-content' >
                                              <li v-if="!usedTypes(table).includes('Смс-рассылка')" class="px-4 py-2" @click="addTableTR(table,'Смс-рассылка')">Смс-рассылка</li>
                                              <li v-if="!usedTypes(table).includes('E-mail рассылка')" class="px-4 py-2" @click="addTableTR(table,'E-mail рассылка')">E-mail рассылка</li>
                                              <li v-if="!usedTypes(table).includes('Push-рассылка')" class="px-4 py-2" @click="addTableTR(table,'Push-рассылка')">Push-рассылка</li>
                                              <li v-if="!usedTypes(table).includes('ТВ реклама')" class="px-4 py-2" @click="addTableTR(table,'ТВ реклама')">ТВ реклама</li>
                                              <li v-if="!usedTypes(table).includes('Офсет')" class="px-4 py-2" @click="addTableTR(table,'Офсет')">Офсет</li>
                                          </ul>
                           

                                      </td>
                                      <td v-for="date in table.range" class="min-w-100 px-2">{{date}} </td>


                                  </tr>

                                  <tr v-for="(TR,idxOfTR) in table.TRs" :key="idxOfTR">
                                      <td class="fixedTD has-text-left"><span class="mdi mdi-poll" :style="{ color: [table.colors[idxOfTR]]}"></span><span @click="deleteTableTR(table,TR.type)" class="mdi mdi-delete-outline"></span>  {{TR.type}}</td>
                                      <td v-for="(TD,idxOfTD) in TR.inputs"  :key="idxOfTD" class="min-w-100 px-2">
                                          <input type="number" class="input" :name="idxOfTR+idxOfTD" @change="updateGrafik(table)" v-model="TD.value">
                                      </td>
                                  </tr>

                              </table>
                          </div>
                          </div>
                        
                          <div class="columns">

                              <div class="column is-8 is-offset-2">

                                  <canvas :id="'line'+idx">

                                  </canvas>
                              </div>
                          </div>
                      </div>


                  </div>






                  <div class="modal" id="ABModal">
                      <div class="modal-content">
                          <h4 class="my-5 title is-4">Выберите тип новых данных</h4>

                          <div class="columns ">


                              <div class="column  has-text-centered box is-clickable mx-5">

                                  <table @click="addABtabel('small')"
                                      class="table modal-close  is-narrow is-fullwidth ">
                                      <tr>
                                          <td>Вид бизнеса</td>
                                          <td>АБ</td>
                                      </tr>

                                      <tr>
                                          <td>FMC</td>
                                          <td></td>
                                      </tr>

                                      <tr>
                                          <td>FTTB</td>
                                          <td></td>
                                      </tr>
                                      <tr>
                                          <td>B2C</td>
                                          <td></td>
                                      </tr>

                                      <tr>
                                          <td>B2B</td>
                                          <td></td>
                                      </tr>

                                      <tr>
                                          <td>FIX</td>
                                          <td></td>
                                      </tr>


                                      <tr>
                                          <td>ПК</td>
                                          <td></td>
                                      </tr>
                                  </table>
                              </div>



                              <div class="column is-clickable box  table ">
                                  <table @click="addABtabel('big')" class="table modal-close is-narrow is-fullwidth ">
                                      <tr>
                                          <td>Действие</td>
                                          <td>дд.мм.гг</td>
                                          <td>дд.мм.гг</td>


                                      </tr>


                                      <tr>
                                          <td>Смс-рассылка</td>
                                          <td></td>
                                          <td></td>






                                      </tr>

                                      <tr>
                                          <td>E-mail рассылка</td>
                                          <td></td>
                                          <td></td>


                                      </tr>

                                      <tr>
                                          <td>Push-рассылка

                                          </td>
                                          <td></td>
                                          <td></td>


                                      </tr>
                                      <tr>
                                          <td>ТВ реклама</td>
                                          <td></td>
                                          <td></td>
                                      </tr>
                                      <tr>
                                          <td>Офсет</td>
                                          <td></td>
                                          <td></td>
                                      </tr>
                                  </table>
                              </div>
                          </div>






                      </div>
                      <div class="modal-footer">
                          <a class="modal-close button is-primary">Закрыть</a>
                      </div>
                  </div>


              </div>


          </div>
      </li>
      <li>
          <div class="collapsible-header">
              <h3 class="title is-4 ">

                  Статус по запуску
              </h3>
          </div>
          <div class="collapsible-body">

              <div class="statusZapusk">

                  <h3 class="title is-4 has-text-centered">


                      Статус по запуску
                      <button class="button is-danger" :disabled="!project.statusZapusk.length"
                          @click="deleteStatusZapuskRow">-</button>
                      <button class="button is-primary" @click="addStatusZapuskRow">+</button>


                  </h3>


                  <div class="if-fullwidth w100" v-if="project.statusZapusk.length">
                      <div class="columns">
                          <div class="column is-9">Описание статуса</div>
                          <div class="column">Срок</div>

                      </div>

                      <div class="columns" v-for="(row,idx) in project.statusZapusk" :key="idx">
                          <div class="column is-9">
                              <div class="input-field m-0">
                              <input type="text" class="input is-primary autocomplete statusZapuskInput"
                                  v-model.lazy="row.opisanie"></div>
                              </div>
                          <div class="column">
                              
                       

                    
                              <input type="text" class="input is-primary  datepicker statusZapuskDate"
                                  v-model.lazy="row.srok"></div>
                        
                      </div>

                  </div>



                  <div id='statusZapuskDate'></div>
              </div>
          </div>
      </li>




      <li>
          <div class="collapsible-header">

              <h3 class="title is-4">
                  Риски

              </h3>
          </div>
          <div class="collapsible-body">




              <div class="risks">




                  <h3 class="title is-4 has-text-centered">


                      Риски по запуску
                      <button class="button is-danger" :disabled="!project.risks.length"
                          @click="deleteRisksRow">-</button>
                      <button class="button is-primary" :disabled="project.risks.length >= 10"
                          @click="addRisksRow">+</button>


                  </h3>


                  <div class="if-fullwidth w100" v-if="project.risks.length">
                      <div class="columns">

                          <div class="column is-5">Описание риска</div>
                          <div class="column is-5">Прогноз влияния</div>
                          <div class="column is-2">Вероятность реализации риска </div>

                      </div>


                      <div class="columns" v-for="row in project.risks">

                          <div class="column is-5"><input type="text" class="input is-primary" v-model="row.opisanie">
                          </div>
                          <div class="column is-5"><input type="text" class="input is-primary" v-model="row.prognoz">
                          </div>
                          <div class="column is-2 p-0">


                              <select v-model="row.status" class="risk-select">
                                  <option value="Низкая">Низкая</option>
                                  <option value="Средняя">Средняя</option>
                                  <option value="Высокая">Высокая</option>

                              </select>
                          </div>
                      </div>




                  </div>


              </div>



          </div>
      </li>




      <li>
          <div class="collapsible-header">
              <h3 class="title is-4">
                  Аудиты

              </h3>
          </div>
          <div class="collapsible-body">







              <div class="audits ">
                  <h3 class="center fluid-text title is-3">
                      Голос клиента (Аудит)
                      <button class="button is-danger" :disabled="!project.audits.length"
                          @click="deleteAudit()">-</button>
                      <button class="button is-primary" @click="addAudit()">+</button>
                  </h3>





                  <div class="column box" v-for="audit,idx in project.audits" :key="idx">




                      <br>

                      <h4 class="center title is-4 my-1"> Загаловок аудита : {{audit.name}}</h4>
                      <div class="columns">
                          <div class="column is-6 is-offset-3">

                              <input type="text" class="input" v-model="audit.name" placeholder="Заголовок">
                          </div>
                          <div class="column is-2 p-1">
                              <select class="selectColor" v-model="audit.type">
                                  <option value="public">Публичный</option>
                                  <option value="private">Приватный</option>
                                  <option value="secret">Секретный</option>
                              </select>
                          </div>

                      </div>


                      <div class="columns">


                          <div class="column is-6">

                              <table class=" centered">
                                  <thead>
                                      <tr class="my-1">
                                          <th> <input type="text" class="is-large input" v-model="audit.subname"
                                                  placeholder="Подзаголовок"></th>
                                          <th class="has-text-centered"> Кол-во</th>
                                          <td> <button class="button is-danger" :disabled="!audit.rows.length"
                                                  @click="deleteRowInAudit(audit)">-</button>
                                              <button class="button is-success"
                                                  @click="addRowToAudit(audit)">+</button></td>
                                      </tr>
                                  </thead>

                                  <tbody>
                                      <tr v-for="row in audit.rows">
                                          <td><input type="text" class="input" v-model='row.propName'
                                                  @change="updateDonut(audit)" placeholder="Причина"></td>
                                          <td><input type="number" class="input" v-model='row.propInt'
                                                  placeholder="Колличество" @change="updateDonut(audit)"></td>


                                      </tr>
                                      <tr>


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




          </div>
      </li>










      <li>
          <div class="collapsible-header">

              <h3 class="title is-4">
                  Баги

              </h3>
          </div>
          <div class="collapsible-body">




              <div class="bugs">




                  <h3 class="title is-4 has-text-centered">


                      Баги
                      <button class="button is-danger" :disabled="!project.bugs.length"
                          @click="deleteBugsRow">-</button>
                      <button class="button is-primary" @click="addBugsRow">+</button>


                  </h3>


                  <div class="if-fullwidth w100" v-if="project.bugs.length">
                      <div class="columns">

                          <div class="column is-2">Описание</div>
                          <div class="column is-4">Ответственный за исполнение</div>
                          <div class="column is-2">Срок решения</div>
                          <div class="column is-2">Комментарий</div>
                          <div class="column is-2">Статус</div>

                      </div>


                      <div class="columns" v-for="row in project.bugs">




                          <div class="column is-2"> <input type="text" class="input is-primary"
                                  v-model.lazy="row.opisanie"></div>
                          <div class="column is-4 p-0">

                              <select class="bug-select" v-model="row.soprovod">
                                  <option v-for="(employee,idx) in employees" :key="idx"
                                      :value="employee['full_name']">{{employee['full_name']}}</option>
                              </select>

                          </div>
                          <div class="column is-2"><input type="text" class="input is-primary"
                                  v-model.lazy="row.srok"></div>
                          <div class="column is-2"><input type="text" class="input is-primary"
                                  v-model.lazy="row.comment"></div>
                          <div class="column is-2 p-0">

                              <select class="bug-select" v-model="row.status">
                                  <option value='Выполнено'>Выполнено</option>
                                  <option value='В работае'>В работае</option>
                                  <option value='Отложено'>Отложено</option>
                                  <option value='Отменено'>Отменено</option>
                              </select>


                          </div>



                      </div>
                  </div>




              </div>


          </div>




      </li>










      <li>
          <div class="collapsible-header">
              <h3 class="title is-4">

                  Доп. информация
              </h3>
          </div>
          <div class="collapsible-body">

              <div class="statusZapusk">

                  <h3 class="title is-4 has-text-centered">
                      Доп. информация
                  </h3>



                  <div class="froala">
                      <label for="pbody"> Доп. информация</label>
                      <textarea class="form-control" columns="7" wrap="hard" id="dopbody" name="dopbody"></textarea>
                  </div>




              </div>
          </div>
      </li>



      <li>
      <div class="collapsible-header">
          <h3 class="title is-4">

              Прогноз по запускам/План Факт
          </h3>
      </div>
      <div class="collapsible-body">

         <e-grafiks-component :eGrafiks.sync='project.eGrafiks'></e-grafiks-component>
      </div>
  </li>

  <li>
  <div class="collapsible-header">
      <h3 class="title is-4">

          Теги
      </h3>
  </div>
  <div class="collapsible-body">

     <tags-component :tags.sync='project.tags'></tags-component>
  </div>
</li>



  </ul>


  <div class="columns my-4">
      <div @click="editProj" :disabled="buttonIsLoading" :class="{'is-loading': buttonIsLoading}"
          class="button has-text-white is-large is-primary column is-12 black-text title is-3">
          Изменить проект
      </div>
  </div>
  <div class="columns my-4">
  <div @click="openDeletingModal" :disabled="buttonIsLoading" :class="{'is-loading': buttonIsLoading}"
      class="button has-text-white is-large is-danger column is-12 black-text title is-3">
     Удалить проект
  </div>
</div>


<div class="modal" id='deletingModal'>
<div class="modal-content">
<h2 class='title is-2'>Вы уверены что хотите удлаить этот проект?</h2>
<p>Проект уйдет в архив. Данные останутся но тянутся не будут.</p>
</div>
<div class="modal-footer">
<button @click="deleteProj" class='button modal-close is-danger'>Да, удалить</button>
<button class='button modal-close is-primary'>Нет, закрыть</button>

</div>
</div>

</div>


`,
});
