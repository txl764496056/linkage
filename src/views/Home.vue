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
        v-for="(item,index) in write_list" 
        :key="item.source_id" 
        :source="item"
        :feild_color="feild_color"
        :iconLink_state="iconLink_state"
        :write_index="index"></data-origin>
      </div>
    </div>
    <div class="container">
      <div class="title">write</div>
      <div class="content scroll">
        <data-origin class="do-item" 
        v-for="item in read_list" 
        :key="item.source_id" 
        :feild_color="feild_color"
        :iconLink_state="iconLink_state"
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
      iconLink_state:[], //所有手型/关联图标状态。true：显示关联图标，false：显示手型图标
      feild_color:[] //返回字段高亮颜色判断
    }
  },
  mounted(){
    this.axios.get("/source").then(res=>{
      let data = res.data;
      let num = 0;
      for(let i=0;i<data.length;i++){

        for(let key in data[i].parameter){
          this.iconLink_state.push(false); //每个字段值的关联图标状态
          data[i].parameter[key].para_index = num++; //每个字段值加序列号，
        }

        // 分离可读可写数据
        if(data[i].permission=='Read'){
          this.read_list.push(data[i]);
          this.feild_color.push(false);//返回字段状态
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

