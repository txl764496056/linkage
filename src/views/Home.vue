<template>
  <div class="home">
    <div class="top">
      <select name="" id="" v-model="source_type">
        <option value="1" checked>read</option>
        <option value="2">write</option>
      </select>
      <button @click="addData()">add</button>
    </div>

    <scroll-container 
    :title="'write'" 
    :state_msg='state_msg'
    :source_list="write_list">
    </scroll-container>

    <scroll-container 
    :title="'read'" 
    :state_msg="state_msg"
    :source_list="read_list">
    </scroll-container>
    
    <button class="submit" @click="submit()">提交</button>
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
// @ is an alias to /src
import scrollContainer from '../components/ScrollContainer'
export default {
  name: 'home',
  components: {
    scrollContainer
  },
  data(){
    return {
      read_list:[], //可读数据
      write_list:[], //可写数据
      source_type:1, //可读可写数据类型值 1：可读，2：可写
      state_msg:{
         iconLink_state:[], //所有手型/关联图标状态。true：显示关联图标，false：显示手型图标
         all_param_feild:[],//所有参数信息，每个字段，序列号与图标状态一一对应
         feild_color:[] ,//返回字段高亮颜色判断
      },
      num:0, //字段值加序列号(parameter下的字段)
      data_origin_id:0, //DataOrigin 唯一标识符，也是数量统计，每次页面刷新则重新排序
    }
  },
  mounted(){
    this.axios.get("/source").then(res=>{
      let data = res.data;
      for(let i=0;i<data.length;i++){
        this.sourceProcess(data[i]);
      }
    });  
  },
  methods:{
    /**
     * parameter(参数信息) 下所有字段加序列号
     * 每个字段值的关联图标状态
     */
    paramFieldIndex(obj){
      for(let key in obj){
          this.state_msg.iconLink_state.push(false); //每个字段值的关联图标状态
          obj[key].para_index = this.num++; //每个字段值加序列号，
          this.state_msg.all_param_feild.push(obj[key]); //存放所有的参数信息 字段对象
        }
    },
    /**
     * 
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
          this.state_msg.feild_color.push(false);//返回字段状态，可写的才有返回字段
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
    },
    /**
     * 统计结果
     * input_origin 用户输入的数据源
     * select_origin 用户选择的数据源
     * select_filter 用户选择的过滤器
     * upper_level 用户选中数据源字段所在组件（data-origin)的序列号(唯一标识)
     * input_origin 与 select_origin 只能需要一个有值
     * 数据格式：
     * 1）用户输入：{
     *      object_id:"", //当前组件data-origin的序列号（唯一标识）
     *      source_id:"",
     *      key:input_origin
     *   } 
     * key:input_origin  字段：用户输入的数据源,如：area_id:"gender"
     * 2）用户选择：{
     *      object_id:"", //当前组件data-origin的序列号（唯一标识）
     *      source_id:"",
     *      parameters:{
     *        key:{
     *          bind:"1",  //这个值不变，每个对象的bind都是1
     *          value:"2.gender|filter-1|filter-2"
     *        }
     *      }
     *   } 
     *   key：字段 value:"返回字段值所在组件data-origin的序列号.返回字段值|过滤器1|过滤器2"
     */
    statisticResult(){
      let result = [];
      let list = [];
      list.push(...this.write_list);
      list.push(...this.read_list);

      list.map(function(item){

        let temp = {};
        temp.object_id = item.data_origin_id;
        temp.source_id = item.source_id;
        temp.parameters = {};

        for(let key in item.parameter){

            let obj = item.parameter[key];
            temp.parameters[key] = {};

            //  用户输入数据源存在且不为空
            if( obj.input_origin && obj.input_origin!='' ){
                temp.parameters[key] = obj.input_origin;

              // 用户选择数据源和过滤器
            }else if( obj.select_origin && obj.select_origin!='' ){
              
              let filter = "";
              if(obj.select_filter && obj.select_filter.length>0){
                filter += "|";
                filter += obj.select_filter.reduce(function(prev,cur){
                  return prev+"|"+cur;
                });
              }
              temp.parameters[key] = {
                bind:"1",
                value:obj.upper_level+"."+obj.select_origin+filter
              }
            }else{
              temp.parameters[key] = "";
            }

        } //end-for
        
        if(temp){
          result.push(temp);
        }
        console.log(result);
      }); //end-map
    },
    /**
     * 提交答案
     */
    submit(){
      this.statisticResult();
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
.do-item{
  width:360px;
}

.submit{
  background-color:$color-theme;border:none;color:#fff;font-size:20px;display:block;margin:50px auto;padding:8px 20px;border-radius:5px;min-width:120px;letter-spacing: 1px;
}

</style>

