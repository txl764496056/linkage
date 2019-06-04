<template>
  <div class="home">
    <div class="top">
      <select name="" id="" @change="getData()">
        <option value="1" checked>read</option>
        <option value="2">write</option>
      </select>
      <button>add</button>
    </div>
    <div class="container">
      <div class="title">write</div>
      <div class="content scroll">
        <data-origin v-on:send-result="getResult"></data-origin>
        <data-origin></data-origin>
        <data-origin></data-origin>
      </div>
    </div>
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
// @ is an alias to /src
import dataOrigin from '../components/DataOrigin'
export default {
  name: 'home',
  components: {
    dataOrigin //参数信息组件
  },
  mounted(){
    
  },
  methods:{
    getData(){
      this.axios.get("/read_source").then(res=>{
        console.log(res.data);
      });
    },
    /**
     * 获得已经选择的过滤器
     */
    getResult(aaa){
      console.log("data",aaa);
    }
  }
}
</script>

<style lang="scss" scope>
@import '@/scss/base.scss';
.home{text-align:left;margin:0 20px;background-color:$color-white;padding:0 30px;}
.top{
  padding:30px 0;
  select{
    width:100px;height:30px;border-radius:5px;
  }
  button{
    background-color:transparent;margin-left:20px;padding:7px 30px;
    border:1px solid $color-gray-11;border-radius:5px;box-shadow:inset 0 0 12px $color-gray-11;
  }
}
.container{
  >.title{
    $h:50px;
    height:$h;color:$color-white;background-color:$color-theme;font-size:28px;font-weight:bold;padding:0 20px;line-height:$h;
  }
  .content{
    padding:20px 10px;
    /* 属性嵌套 */
    border: 1px solid $color-theme {
      top:none;
    };

    &.scroll{
      display:flex;overflow-x:scroll;
      .dr-item{
        flex-shrink:0;
        margin:10px;
      }
    }
    
  }
}
</style>

