<template>
    <div class="container" ref="writeCon">
        <div class="title">{{title}}</div>
        <div ref="writeScon" class="content scroll">
            <!-- <template  v-if="title=='write'"> -->
                <data-origin class="do-item" 
                v-for="(item,index) in source_list" 
                :key="item.source_id" 
                :source="item"
                :feild_color="feild_color"
                :iconLink_state="iconLink_state"
                :all_param_feild="all_param_feild"
                :write_index="getIndex(index)"
                v-on:moveOrigin="moveOrigin"
                v-on:deleteOrigin="deleteOrigin"></data-origin>
            <!-- </template> -->
            
            <!-- <template v-else>
                <data-origin class="do-item" 
                v-for="item in source_list" 
                :key="item.source_id" 
                :source="item"
                :feild_color="feild_color"
                :iconLink_state="iconLink_state"
                :all_param_feild="all_param_feild"
                v-on:moveOrigin="moveOrigin"
                v-on:deleteOrigin="deleteOrigin"></data-origin>
            </template> -->
        </div>
        <!-- 移动元素 start -->
        <data-origin 
        ref="moveDataOrigin" 
        class="do-item move-data-origin"
        :class="{dis:moveDis}"
        :style="{left:moveS_x+'px',top:moveS_y+'px'}"
        v-for="(item) in moveSource" 
        :key="item.name"
        :source="item"></data-origin>
        <!-- 移动元素 end -->
    </div>
</template>

<script>
import dataOrigin from '../components/DataOrigin'
    export default {
        name:'scroll-container',
        components:{
            dataOrigin
        },
        props:{
            title:{
                type:String,
                default:"title"
            },
            source_list:{
                type:Array,
                default(){
                    return [];
                }
            },
            feild_color:{
                type:Array,
                default:function(){
                    return [];
                }
            },
            iconLink_state:{
                type:Array,
                default:function(){
                    return [];
                }
            },
            all_param_feild:{
                type:Array,
                default:function(){
                    return []
                }
            }
        },
        data:function(){
            return {
                // opacity:-1,
                moveSource:[], //移动data-origin数据
                moveDis:false, //移动data-origin true:隐藏 ,false:显示

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
                let list = this.source_list;
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
                    _this.moveDis = true;
                });
            },
            /**
             * 删除data-origin
             */
            deleteOrigin(data){
                let id = data.data_origin_id;
                let arr = this.source_list;

                for(let i=0;i<arr.length;i++){
                    if(arr[i].data_origin_id==id){
                    arr.splice(i,1);
                    break;
                    }
                }
            },
            getIndex(index){
                return this.title=='write' ? index : -1;
            }
        }
    }
</script>

<style lang="scss" scoped>
@import '@/scss/base.scss';
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
.move-data-origin{
  position:fixed;z-index:999;opacity:0.5;
  &.dis{
      display:none;
  }
}
</style>