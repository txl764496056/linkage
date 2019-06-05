<template>
  <div class="home">
    <div class="top">
      <select name="" id="" v-model="source_type">
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
      read_list:[], //可读数据
      write_list:[], //可写数据
      source_type:1, //可读可写数据类型值 1：可读，2：可写
      iconLink_state:[], //所有手型/关联图标状态。true：显示关联图标，false：显示手型图标
      num:0, //字段值加序列号(parameter下的字段)
      data_origin_id:0, //DataOrigin 唯一标识符，也是数量统计
      feild_color:[] //返回字段高亮颜色判断
    }
  },
  mounted(){
    this.axios.get("/source").then(res=>{
      let data = res.data;
      for(let i=0;i<data.length;i++){
        this.sourceProcess(data[i]);
      }
    })
  },
  methods:{
    /**
     * parameter(参数信息) 下所有字段加序列号
     * 每个字段值的关联图标状态
     */
    paramFieldIndex(obj){
      for(let key in obj){
          this.iconLink_state.push(false); //每个字段值的关联图标状态
          obj[key].para_index = this.num++; //每个字段值加序列号，
        }
    },
    /**
     * 每一个 data-origin 增加一个唯一标识
     */
    dataOriginId(obj){
      obj['data_origin_id'] = this.data_origin_id++; //给每个加上唯一标识符
    },
    /**
     * 分离可读和可写数据
     * 可读加一个，返回字段状态数组一项
     */
    separateRWsource(obj){
      if(obj.permission=='Read'){
          this.read_list.push(obj);
        }else{
          this.write_list.push(obj);
          this.feild_color.push(false);//返回字段状态，可写的才有返回字段
        }
    },
    /**
     * 获得的每条数据进行处理
     */
    sourceProcess(source){
      
      //每个字段值 加序列号、关联图标状态
      this.paramFieldIndex(source.parameter);

      //给每个加上唯一标识符
      this.dataOriginId(source);
      
      // 分离可读可写数据
      this.separateRWsource(source);
    },
    /**
     * 添加一条 可读/可写 数据
     */
    addData(){

      let url = (this.source_type==="2" ? "/write_source":"/read_source");

      this.axios.get(url).then(res=>{
          this.sourceProcess(res.data);
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

