<template>
  <div class="home">
    <div class="top">
      <select name="" id="" >
        <option value="1" checked>read</option>
        <option value="2">write</option>
      </select>
      <button @click="addData()">add</button>
    </div>
    <div class="container">
      <div class="title">write</div>
      <div class="content scroll">
        <data-origin class="do-item" 
        v-for="item in write_list" 
        :key="item.source_id" 
        :source="item"
        :feild_color="feild_color"></data-origin>
      </div>
    </div>
    <div class="container">
      <div class="title">write</div>
      <div class="content scroll">
        <data-origin class="do-item" 
        v-for="item in read_list" 
        :key="item.source_id" 
        :source="item"></data-origin>
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
  data(){
    return {
      list:[],
      read_list:[], //可读数据
      write_list:[], //可写数据
      feild_color:[]
    }
  },
  mounted(){
    this.axios.get("/source").then(res=>{
      let data = res.data;
      for(let i=0;i<data.length;i++){
        // 分离刻度可写数据
        if(data[i].permission=='Read'){
          this.read_list.push(data[i]);
          this.feild_color.push(true);
        }else{
          this.write_list.push(data[i]);
        }
        
      }
    })
  },
  methods:{
    addData(){
      this.axios.get("/write_source").then(res=>{
        let source = res.data;
        this.list.push(source);
      });
    }
  },
 
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
  margin-top:30px;
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
.do-item{
  width:360px;
}
</style>

