Vue.component('preloader', { props: ['status'],
data(){
    return{
        done: false
    }

},
mounted(){
    

},
template : `




<div class="" v-show="status == 'loading'" style="width: 100%;height: 100%; position: fixed;  background-color: black; top: 0px; left:0px; z-index:9999">
<div class="preloader-wrapper big active" style="top:50%; left: 50%" >
    <div class="spinner-layer spinner-blue-only">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
    </div>


</div>
`

});