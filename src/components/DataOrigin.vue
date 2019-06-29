<template>
    <div class="dr-item"
    ref="itemBox"
    :class="{opacity:opacity==source.data_origin_id}">
        <div class="dr-title">
            <i @click="shiftOrigin" class="iconfont icon-yidong move"></i>
            Data origin{{source.data_origin_id}}
            <i @click="deleteOrigin()" class="iconfont icon-remove remove"></i>
        </div>
        <div class="dr-container">
            <!-- v-on:changeFeildLight="changeFeildLight" -->
            <header-body v-if="parameter" :title="'Parameter Information'" class="hd-item">
                <parameter-item class="pi-item" 
                v-for="(item) in parameter" :key="item.name" 
                :param="item" 
                :write_index='write_index'
                :iconLink_state="iconLink_state"
                :selectedField="selectedField"
                
                :feild_color="feild_color"></parameter-item>
            </header-body>
            <header-body 
            :title="'Return Feild'"
            v-if="response"
             class="hd-item">
             <!-- 返回字段选中状态满足条件，
             1、返回字段是高亮 2、返回字段name=当前关联对象数据源 保存的name 
             3、返回字段所在data-origin序列号=当前关联对象数据源 保存的data-origin序列号 -->
                <div class="field-list">
                    <span class="unit"
                    v-for="(item,key,index) in response" 
                    :key="item.name"
                    @click="feildActive(index,item.name)"  
                    :class="{'light':feild_color[write_index],
                    'selected':(selectedField.name==item.name)&&(selectedField.id==source.data_origin_id)&&feild_color[write_index]}">{{item.name}}</span>
                </div>
            </header-body>
        </div>
    </div>
</template>

<script>
import headerBody from './HeaderBody';
import parameterItem from './ParameterItem';
    export default {
        name:"data-origin",
        components:{
            headerBody,
            parameterItem
        },
        props:{
            source:{
                type:Object,
                default:function(){
                    return {};
                }
            },
            feild_color:{
                type:Array,
                default:function(){
                    return [];
                }
            },
            // write类型数据的序列号
            write_index:{
                type:Number,
                default:-1
            },
            // write read 两种类型的序列号，都是0开始，在每个滚动组件里从0开始排序，为移动插入数据源用
            index:{
                type:Number,
                default:-1
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
            },
            isDown:{
                type:Boolean,
                default:false
            },
            selectedField:{
                type:Object,
                default(){
                    return {}
                }
            }
        },
        data:function(){
            return {
                filter:[], //过滤器
                parameter:"", //参数信息
                response:"", //返回字段
                opacity:-1, //data-origin定位
            }
        },
        mounted(){
            this.parameter = this.source.parameter;
            this.response = this.source.response;
        },
        methods:{
            /**
             * opacity 透明度恢复为 1
             */
            changeOpacity(){
                this.opacity = -1;
            },
            /**
             * 取消  所有高亮状态
             */
            cancelLight(){
                for(let i=0;i<this.feild_color.length;i++){
                    this.feild_color.splice(i,1,false);
                }
            },
            /**
             * 所有关联图标切换至手型，即 取消所有关联状态
             */
            cancelLink(){
                for(let i=0;i<this.iconLink_state.length;i++){
                    this.iconLink_state.splice(i,1,false);
                }
                
            },
            /**
             * 移动data-origin
             */
            shiftOrigin(evt){

                this.cancelLink();
                this.cancelLight();

                this.opacity = this.source.data_origin_id;

                // 触发的坐标点,根据屏幕
                // let x = evt.clientX;
                // let y = evt.clientY;
                // 触发坐标点 ，根据页面
                let x = evt.pageX;
                let y = evt.pageY;

                // 组件的宽和高
                let itemH = this.$refs.itemBox.clientHeight || this.$refs.itemBox.offsetHeight;
                let itemW = this.$refs.itemBox.clientWidth || this.$refs.itemBox.offsetWidth;
                
                // 坐标值 最小点  范围
                let x_min = x - this.$refs.itemBox.offsetLeft;
                let y_min = y - this.$refs.itemBox.offsetTop;
                let index = this.index;

                this.$emit("moveOrigin",{
                    index,
                    x,
                    y,
                    x_min,
                    y_min,
                    itemH,
                    itemW
                });
            },
            /**
             * 删除当前data-origin
             */
            deleteOrigin(){
                this.$emit("deleteOrigin",{
                    data_origin_id:this.source.data_origin_id
                })                
            },
            /**
             * 返回字段选中状态
             */
           feildActive(index,value){
               
               // 非高亮状态直接返回
               if( !this.feild_color[this.write_index] ){return;}

               let num = this.iconLinkLightIndex(); 

               //找出对应的参数信息字段对象,并添加新的属性
               this.$set(this.all_param_feild[num],'select_origin',value);
               //选中字段所在组件的序列号    
               this.$set(this.all_param_feild[num],'upper_level',this.source.data_origin_id);
               this.$set(this.all_param_feild[num],'input_origin','');
                
               this.$set(this.selectedField,'id',this.source.data_origin_id);
               this.$set(this.selectedField,'name',value);
           },
           /**
            * 高亮“关联”图标在iconLink_state中的序列号
            * >高亮“关联”图标的序列号==参数信息字段的序列号
            */
           iconLinkLightIndex(){
               let num = -1;
               this.iconLink_state.filter(function(item,index){
                  if(item){
                      num = index;
                      return ;
                  }
               });
               return num;
           }
        },
        watch:{
            // 颜色监控
           feild_color:function(){
           },
           source(){
                this.parameter = this.source.parameter;
                this.response = this.source.response;
           },
            isDown(){
                let _this = this;
                let promise = Promise.resolve();
                if(this.isDown){
                    promise.then(()=>{
                        _this.changeOpacity();
                    }).then(()=>{
                        _this.$emit('initIsDown');
                    });
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
@import "@/scss/base.scss";
.dr-item{
    margin:10px;
}
.opacity{
    opacity:0.5;
}
.dr-title{
    $h:40px;
    height:$h;line-height:$h;
    background-color:$color-theme;
    display:flex;justify-content: space-between;font-size:20px;
    color:$color-white;
    user-select:none;
    .move,.remove{
        color:$color-kelly-1;font-size:20px; padding:0 10px;
    }
}
.dr-container{
    border:1px solid $color-theme;
    >*{font-size:16px;}
    
    // 返回字段列表
    .field-list{
        margin-bottom:15px;margin-top:15px;
        .unit{
            color:$color-gray-6;margin:5px;border:1px solid $color-gray-11;padding:3px 10px;border-radius:6px;margin:5px;display:inline-block;
            &.light{
                background-color:$color-kelly-1;color:$color-theme;
            }
            &.light,&.selected{
                border-color:$color-theme;
            }
            &.selected{
               color:$color-white;background-color:$color-theme;
            }
        }
    }
}
.pi-item{
    margin-bottom:10px;
    &:first-of-type{
        margin-top:10px;
    }
}
</style>