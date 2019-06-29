<template>
    <div class="container" ref="writeCon">
        <div class="title">{{title}}</div>
        <div ref="writeScon" class="content scroll">
            <data-origin class="do-item" 
            :class="{translate:hoverStatus[index]}"
            v-for="(item,index) in source_list" 
            :key="item.source_id" 
            :source="item"
            v-bind.sync="$attrs.state_msg"
            :write_index="originIndex(index)"
            :index="index"
            :isDown="isDown"
            v-on:initIsDown='initIsDown'
            @mouseover.native="overItem(index)"
            v-on:moveOrigin="moveOrigin"
            v-on:deleteOrigin="deleteOrigin"></data-origin>
        </div>
        <!-- 移动元素 start -->
        <data-origin 
        v-if="moveSource.source_id"
        ref="moveDataOrigin" 
        class="do-item move-data-origin"
        :class="{dis:moveDis}"
        :style="{left:moveS_x+'px',top:moveS_y+'px'}"
        :source="moveSource"></data-origin>
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
        },
        data:function(){
            return {
                index:-1, //当前移动元素的序列号

                moveSource:{}, //移动data-origin数据
                moveDis:true, //移动data-origin true:隐藏 ,false:显示

                moveS_x:0, // 可移动data-origin top值
                moveS_y:0, //可移动data-origin left值
                // 可移动data-origin 最小坐标点  
                moveS_ymin:0,
                moveS_xmin:0,
                // 可移动data-origin 最大坐标点
                moveS_ymax:0,
                moveS_xmax:0,

                isDown:false, //鼠标是否点下（已经已经浮起移动元素的情况下），true:点下  false：没有点下

                distance:0 ,//滚动条滚动距离
                scrollIntervalId:-1, // 滚动动画计时器id
                scrollx_max:0, //横向滚动的最大距离
                hoverStatus:[], //所有data-origin的悬停状态记录，true:鼠标悬停在当前元素，false：鼠标未悬停在当前元素
                hoverCurr:-1 ,//鼠标悬停的data-origin的序列号
            }
        },
        mounted(){
            this.initHoverStatus();
        },
        methods:{
            getIndex(index){
                return this.title=='write' ? index:-1;
            },
            /**
             * 移动data-origin显示时，悬停效果生效
             * 状态序列号，与source_list每个对象序列号对应
             */
            overItem(index){
                // 若可移动data-origin是隐藏的，则不往后执行
                if(this.moveDis){return;}
                this.hoverCurr = index;
                // 悬停状态
                this.hoverStatus.splice(index,1,true);
                // 其他的去除悬停状态
                for(let i=0;i<this.hoverStatus.length;i++){
                    if(i!==index){
                        this.hoverStatus.splice(i,1,false);
                    }
                }
            },
            /**
             * 所有 data-origin 的悬停状态设为false
             */
            setHoverStatus(){
                for(let i=0;i<this.hoverStatus.length;i++){
                    this.hoverStatus.splice(i,1,false);
                }
            },
            /**
             * 初始化每个的悬停状态
             */
            initHoverStatus(){
                this.hoverStatus = [];
                for(let i=0;i<this.source_list.length;i++){
                    this.hoverStatus.push(false);
                }
            },
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
            initIsDown(){
                this.isDown = false;
            },
            /**
             * 鼠标按下事件
             */
            moveDown(){
                // 删除绑定的mousemove事件
                document.removeEventListener("mousemove",this.moveXY);
                // 隐藏移动data-origin
                this.moveDis = true;
                // 清空可移动元素的数据
                this.moveSource = {};
                this.isDown = true;

                // 完成移动，将移动元素插入指定位置
                this.doneMove(this.index);
                this.setHoverStatus(); //清除data-origin的悬停状态
                this.hoverCurr = -1;
            },
             /**
             * 移动data-origin
             * 效果：1、利用一个非列表里的data-origin(名为A)，渲染出需要移动的data-origin一样的数据
             *      2、透明度都将为0.5
             *      3、移动A，A跟随鼠标移动
             *      4、鼠标点击，A停止移动，获取data-origin的悬停状态为true的序列号= 可移动元素在source_list中的序列号
             *      5、将可移动元素，插入至悬停元素之前的，并且删除原数组（source_list）中可移动的数据
             */
            moveOrigin(data){
                let _this = this;

                this.moveDis = false;
                this.index = data.index;

                // 找到移动元素的数据
                this.moveSource = this.source_list[data.index];

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

                // 鼠标按下
                document.addEventListener("mousedown",this.moveDown);
            },
            /**
             * 对数据进行插入删除，页面重新渲染，模拟移动
             * index,是需要移动的data-origin的序列号
             */
            doneMove(index){
                if(this.hoverCurr==-1) return;
                let item = Object.assign({},this.source_list[index]);
                // 插入位置在移动元素后面
                if(this.hoverCurr>index){
                    
                    // 如果是可读数据移动，插入位置在当前移动元素之前
                    if(item.permission=='Write'){
                        // 在移动数据与悬停数据之间的数据，且是可写数据
                        for(let i=this.index+1;i<this.hoverCurr;i++){
                            let temp = this.source_list[i];
                            for(let key in temp.parameter){
                                // 数据已选择关联数据（字段),并非手动输入
                                if((temp.parameter[key].upper_level>=0)&&(temp.parameter[key].upper_level==item.data_origin_id)){
                                    this.$delete(temp.parameter[key],'upper_level');
                                    // this.$delete(item.parameter[key],'input_origin'); //手动输入的不需要清除
                                    this.$delete(temp.parameter[key],'select_origin');
                                }
                            }
                            this.source_list.splice(i,1,temp);
                        }
                    }

                    this.source_list.splice(this.hoverCurr,0,item);//插入
                    this.source_list.splice(index,1); //删除
                    // 插入位置在移动元素前面
                }else if(this.hoverCurr<index){
                    // 如果是可写数据移动，插入位置在当前移动元素之前
                    if(item.permission=='Write'){
                        for(let key in item.parameter){
                            // 当前移动的数据已选择关联数据（字段),并非手动输入
                            if(item.parameter[key].upper_level>=0&&item.parameter[key].upper_level>=this.hoverCurr){
                                this.$delete(item.parameter[key],'upper_level');
                                // this.$delete(item.parameter[key],'input_origin'); //手动输入的不需要清除
                                this.$delete(item.parameter[key],'select_origin');
                            }
                        }
                    }
                    this.source_list.splice(index,1); //删除
                    this.source_list.splice(this.hoverCurr,0,item);//插入
                }
                // 插入位置与就是移动元素之前的位置，则不做处理

                // 删除绑定的mousedown事件
                document.removeEventListener("mousedown",this.moveDown);
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
            originIndex(index){
                return this.title=='write' ? index : -1;
            }
        },
        watch:{
            source_list(){
                this.initHoverStatus();
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
      .do-item{
        flex-shrink:0;transition:all 0.05s;
        &.translate{
            margin-left:60px;
            // box-shadow:0 0 10px $color-theme;
        }   
      }
    }
    
  }
}
.move-data-origin{
    // 根据父元素定位，配合pageX,pageY,无论页面滚动多少，它始终在相对于父元素，在视觉上也是在指定范围内。
    // 会跟着页面滚动而 滚动
  position:absolute;
  //与clientX,clientY配合，移动元素会在屏幕的指定范围内移动，但是页面滚动后，视觉上感觉这个元素离开了容器
  // 不会跟着页面滚动而滚动
  // position:fixed; 
  z-index:999;opacity:0.5;
  &.dis{
      display:none;
  }
}
</style>