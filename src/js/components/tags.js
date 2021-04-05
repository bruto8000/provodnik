 Vue.component('tags-component',{
props: ['tags'],
  data() {
    return {
        tagBodyModal: null,
      taglist: [
        "Ознакомление с активностью ",
        "Согласование презентации на КК, LL, Постанализ, ОКЭ, КЭ, УК (нет слайда от ДОК) ",
        "Согласование презентации на КК, LL, Постанализ, ОКЭ, КЭ, УК (есть слайд от ДОК) ",
        "Прогноз нагрузки ",
        "Согласование ресурсов ",
        "Перерасчет прогноза (1-2 раза) ",
        "Перерасчет прогноза (больше 2-х раз) ",
        "Оценка рисков ",
        "Оценка требований (Работа с БФТ) ",
        "Согласование запуска с монобрендом ",
        "Согласование с курьерской службой ",
        "Обучение (не требуется) ",
        "Обучение (требуется) ",
        "Создание выделенного номера ",
        "Создание/Изменение видеоинструкции ",
        "Запрос на создание маршрутизации/настройки на сплитов ",
        "Настройка маршрутизации/сплитов ",
        "Согласование новости на сайте ",
        "Согласование лендинга ",
        "Запрос отклика ",
        "Распоряжение ",
        "Тестирование (до 400 шагов)",
        "Тестирование (до 800 шагов)",
        "Тестирование (от 800 шагов)",
        "IVR (добавление данных без доп.вопросов и встреч)",
        "IVR (добавление данных: есть доп.вопросы и встречи)",
        "Чат-бот (запрос/ добавление данных без согласования)",
        "Чат-бот (требуется согласование данных с КО, маркетингом, юристами)",
        "Согласование стандартных фраз (до 4-х/не требуется согласования с функциями)",
        "Согласование стандартных фраз (больше 4-х/требуется согласование с функциями)",
        "Автоответчик (до 2-х текстов)",
        "Автоответчик (больше 2-х текстов)",
        "UIVR",
        "Процедура обслуживания (требуются минимальные правки в FAQ/диагностиках)",
        "Процедура обслуживания (требуется создание новой процедуры/диагностики/ветки)",
        "Процедура обслуживания (фин.кейс со стороны ДОК на доработку SMAN)",
        "ССBO/ACRM/CSM/HD/Helper (правки в 1-м BO)",
        "ССBO/ACRM/CSM/HD/Helper (правки в нескольких BO)",
        "Первичный постанализ",
        "Создание РГ внутри ДОК",
        "Информирование заинтересованных о старте/переносе запуска",
        "Отработка багов",
        "Обсуждение сложных вопросов с привлечением руководителей и экспертов",
        "Новость на сотрудников",
        "Приоритизация звонков в ДОК",
        "ЛК/МП (согласование)",
        "ЛК/МП (тестирование продукта в рамках тестовой среды с отработкой комментариев со стороны Л.Мониной)",
        "Аудит (до 2-х аудитов)",
        "Аудит (больше 2-х аудитов)",
        "Пересмотр требований",
        "Заведение тематик (до 5-ти)",
        "Заведение тематик (больше 5-ти)",
        "Смс-шаблоны (корректировка действующих до 30)",
        "Смс-шаблоны (корректировка действующих больше 30)",
        "Смс-шаблоны (создание новых до 10-ти)",
        "Смс-шаблоны (создание новых больше 10-ти)",
        "Нотификация на клиентов (до 10-ти)",
        "Нотификация на клиентов (больше 10-ти)",
        "Проверка выборок (запрос отчетникам/есть данные в выборке)",
        "Проверка выборок (самостоятельная выгрузка до 2-х отчетов/2-х параметров)",
        "Проверка выборок (самостоятельная выгрузка более 2-х отчетов/2-х параметров)",
        "Прайсы",
        "Правки в СУЗ (незначительные)",
        "Правки в СУЗ (значительные/в нескольких док-х до 5)",
        "Создание 1 документа/правки в нескольких док-х >5",
        "Создание нескольких документов",
      ],

      currentTag: {
          body: ''
      }
    };
  },
  mounted() {
    M.Dropdown.init(document.querySelectorAll(".dropdown-trigger"));
 this.tagBodyModal =   M.Modal.init(document.getElementById('tagBodyModal'),{
    inDuration: 0,
    outDuration: 0
 });
 console.log(this.tagBodyModal)
  },
  methods: {
    selectTag(tag) {
      this.tags.push({
        label: tag,
        body: ''
      });
    this.tooltipsInit();
    },
    async tooltipsInit(){
await        this.$nextTick()
        M.Tooltip.init(document.querySelectorAll('.tooltippedTag'));
    },
    editTagBody(tag){
        this.currentTag = tag;
        this.openTagBodyModal();
    },
    openTagBodyModal(){
this.tagBodyModal.open();
    },
    deleteTag(tag){
let idx =  this.tags.indexOf(tag);
this.tags.splice(idx,1)
    }
  },
  template: `
  <div>
  <div class="columns m-4 is-align-items-center">
    <div class="mx-4"><h2 class="title is-2">Теги:</h2></div>
    <div class="mx-4">
      <button
        data-target="tagDropDown"
        class="dropdown-trigger button is-primary"
      >
        Выбрать
      </button>
    </div>
  </div>

  <div class="field is-grouped is-grouped-multiline">
    <div v-for="tag in tags" class="tags has-addons m-2">
      <span
        @click="editTagBody(tag)"
        class="tag is-clickable is-medium"
        data-position="bottom"
        :data-tooltip="tag.label"
        :class="{
          'is-danger': tag.body,
          'is-info': !tag.body,
          'tooltippedTag' : tag.label.length > 20 
        }"
        >{{tag.label.length > 20 ? tag.label.slice(0,17) + '...' :
        tag.label }}</span
      >
      <a class="tag is-delete is-medium" @click="deleteTag(tag)"></a>
    </div>
  </div>
  <ul id="tagDropDown" class="dropdown-content">
    <li
      class="p-4"
      v-for="(tag,i) in taglist"
      :key="i"
      @click="selectTag(tag)"
    >
      {{tag}}
    </li>
  </ul>

  <div class="modal" id="tagBodyModal">
    <div class="modal-content">
      <h3 class="is-title is-3">Введите тело</h3>
      <textarea class="textarea" v-model="currentTag.body"> </textarea>
    </div>

    <div class="modal-footer">
      <button class="is-danger button" @click="currentTag.body = ''">
        Очистить
      </button>
      <button class="is-primary modal-close button">Закрыть</button>
    </div>
  </div>
</div>`
});
