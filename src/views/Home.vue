<template>
  <div class="home">
    <div class="top">
      <select name="" id="" v-model="source_type">
        <option value="1" checked>read</option>
        <option value="2">write</option>
      </select>
      <button @click="addData()">add</button>
    </div>
    <div class="container" ref="writeCon">
      <div class="title">write</div>
      <div ref="writeScon" class="content scroll">
        <data-origin class="do-item" 
        v-for="(item,index) in write_list" 
        :key="item.source_id" 
        :source="item"
        :feild_color="feild_color"
        :iconLink_state="iconLink_state"
        :all_param_feild="all_param_feild"
        :write_index="index"
        v-on:moveOrigin="moveOrigin"
        v-on:deleteOrigin="deleteOrigin"></data-origin>
      </div>
    </div>
    <div class="container">
      <div class="title">read</div>
      <div class="content scroll">
        <data-origin class="do-item" 
        v-for="item in read_list" 
        :key="item.source_id" 
        :feild_color="feild_color"
        :iconLink_state="iconLink_state"
        :all_param_feild="all_param_feild"
        :source="item"
        v-on:moveOrigin="moveOrigin"
        v-on:deleteOrigin="deleteOrigin"></data-origin>
      </div>
    </div>
    <button class="submit" @click="submit()">提交</button>
    <!-- 移动元素 start -->
    <!-- <div class="move-data-origin"> -->
      <data-origin 
        ref="moveDataOrigin" 
        class="do-item move-data-origin"
        :style="{left:moveS_x+'px',top:moveS_y+'px'}"
        v-for="(item) in moveSource" 
        :key="item.name"
        :source="item"></data-origin>
    <!-- </div> -->
    <!-- 移动元素 end -->
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
      all_param_feild:[],//所有参数信息，每个字段，序列号与图标状态一一对应
      num:0, //字段值加序列号(parameter下的字段)
      data_origin_id:0, //DataOrigin 唯一标识符，也是数量统计，每次页面刷新则重新排序
      feild_color:[] ,//返回字段高亮颜色判断
      moveSource:[], //移动data-origin数据
      
      moveS_x:0, // 可移动data-origin top值
      moveS_y:0, //可移动data-origin left值
      // 可移动data-origin 最小坐标点  
      moveS_ymin:0,
      moveS_xmin:0,
      // 可移动data-origin 最大坐标点
      moveS_ymax:0,
      moveS_xmax:0,

      distance:0 ,//滚动条滚动距离
      scrollIntervalId:-1, // 滚动动画计时器id
      scrollx_max:0 //横向滚动的最大距离

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
     * 容器滚动
     * direction  滚动方向   right:向右， left:向左
     * step 每次滚动距离
     * scrollLeft  滚动容器向左滚动的真实距离，不是滚动条的滚动距离
     * 停止滚动条件：1、滚动距离达到临界值，2、鼠标滑入至滚动容器中间区域
     */
    scrollX(direction){
      let _this = this;

      let step = 30,time = 100;
      if(direction=="left"){
        step = -step;
      }
            
      this.scrollIntervalId = setInterval(function(){
        _this.distance += step;
        // 停止滚动
        if( _this.distance>_this.scrollx_max || _this.distance<0 ){
          clearInterval(_this.scrollIntervalId);
          _this.scrollIntervalId = -1;
        }
        _this.$refs.writeScon.scrollLeft = _this.distance; 
      },time);
    },
    moveXY(evt){
      
      let x = evt.clientX;
      let y = evt.clientY;

      if(x<this.moveS_xmin){
        x = this.moveS_xmin;
        if(this.scrollIntervalId<0 && this.distance>0){ this.scrollX('left'); }
      }else if( x>this.moveS_xmax ){
        x = this.moveS_xmax;
        if( this.scrollIntervalId<0 && this.distance<this.scrollx_max ){ 
          this.scrollX('right');
         }
        //  在滚动容器中间区域时，停止滚动
      }else{
        clearInterval(this.scrollIntervalId);
        this.scrollIntervalId = -1;
      }

      if(y<this.moveS_ymin){
        y = this.moveS_ymin;
      }else if( y>this.moveS_ymax ){
        y = this.moveS_ymax;
      }

      this.moveS_x = x;
      this.moveS_y = y;

    },
    /**
     * 移动data-origin
     * 效果：1、利用一个非列表里的data-origin(名为A)，渲染出需要移动的data-origin一样的数据
     *      2、透明度都将为0.5
     *      3、移动A，A跟随鼠标移动
     *      4、鼠标点击，A停止移动，如果点击了某个列表的data-origin，则在这个data-origin前插入需要移动的data-origin,(改变对应数据即可，将需要移动的数据先复制值对应位置，然后删除原来的)
     */
    moveOrigin(data){
      let _this = this;

      let id = data.id;
      let list = [];
      list.push(...this.write_list);
      list.push(...this.read_list);
      // 获取对应数据，渲染可移动data-origin
      for(let i=0;i<list.length;i++){
        if(list[i].data_origin_id==id){
          this.moveSource.push(list[i]);
          break;
        }
      }
      // 初始化坐标值
      this.moveS_x = data.x;
      this.moveS_y = data.y;

      // 坐标是值极点
      let c_width = this.$refs.writeCon.clientWidth || this.$refs.writeCon.offestWidth;
      let c_height = this.$refs.writeCon.clientHeight || this.$refs.writeCon.offestHeight;
      this.moveS_ymin = data.y_min;
      this.moveS_xmin = data.x_min;
      this.moveS_ymax = data.y_min + c_height - data.itemH/2;
      this.moveS_xmax = data.x_min + c_width - data.itemW/2;

      // 获得横向滚动最大距离
      let scon_width = this.$refs.writeScon.clientWidth || this.$refs.writeScon.offestWidth;
      this.scrollx_max = this.$refs.writeScon.scrollWidth - scon_width;

      // 绑定鼠标移动事件
      document.addEventListener("mousemove",_this.moveXY);
      // 鼠标按下，移除绑定的移动事件
      document.addEventListener("mousedown",function(){
          document.removeEventListener("mousemove",_this.moveXY);
          _this.posAbs = -1;
      });
    },
    /**
     * 删除data-origin
     */
    deleteOrigin(data){
      let id = data.data_origin_id;
      this.deleteOriginItem(this.write_list,id);
      this.deleteOriginItem(this.read_list,id);
    },
    /**
     * 删除可读或可写 某一个
     */
    deleteOriginItem(arr,id){
      for(let i=0;i<arr.length;i++){
        if(arr[i].data_origin_id==id){
          arr.splice(i,1);
          break;
        }
      }
    },
    /**
     * parameter(参数信息) 下所有字段加序列号
     * 每个字段值的关联图标状态
     */
    paramFieldIndex(obj){
      for(let key in obj){
          this.iconLink_state.push(false); //每个字段值的关联图标状态
          obj[key].para_index = this.num++; //每个字段值加序列号，
          this.all_param_feild.push(obj[key]); //存放所有的参数信息 字段对象
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
    },
    /**
     * 统计结果
     * input_origin 用户输入的数据源
     * select_origin 用户选择的数据源
     * select_filter 用户选择的过滤器
     * upper_level 用户选中数据源字段所在组件（data-origin)的序列号
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
.container{
  margin-top:30px;
  >.title{
    $h:50px;
    height:$h;color:$color-white;background-color:$color-theme;font-size:28px;font-weight:bold;padding:0 20px;line-height:$h;
  }
  .content{
    padding:20px 10px;position:relative;
    /* 属性嵌套 */
    border: 1px solid $color-theme {
      top:none;
    };

    &.scroll{
      display:flex;overflow-x:auto;
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

.submit{
  background-color:$color-theme;border:none;color:#fff;font-size:20px;display:block;margin:50px auto;padding:8px 20px;border-radius:5px;min-width:120px;letter-spacing: 1px;
}

.move-data-origin{
  position:fixed;z-index:999;opacity:0.5;
}
</style>

