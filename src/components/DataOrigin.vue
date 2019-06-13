<template>
    <div class="dr-item"
    ref="itemBox" 
    :class="{opacity:opacity==source.data_origin_id}">
        <div class="dr-title">
            <i @click="shiftOrigin" class="iconfont icon-yidong move"></i>
            Data origin
            <i @click="deleteOrigin()" class="iconfont icon-remove remove"></i>
        </div>
        <div class="dr-container">
            <header-body v-if="parameter" :title="'Parameter Information'" class="hd-item">
                <parameter-item class="pi-item" 
                v-for="(item) in parameter" :key="item.name" 
                :param="item" 
                :write_index='write_index'
                :iconLink_state="iconLink_state"
                v-on:changeFeildLight="changeFeildLight"
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
                    'selected':(feild_active.name==item.name)&&(feild_active.upper_level==source.data_origin_id)&&feild_color[write_index]}">{{item.name}}</span>
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
            write_index:{
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
             * 移动data-origin
             */
            shiftOrigin(evt){
                
                this.opacity = this.source.data_origin_id;

                // 触发的坐标点
                let x = evt.clientX;
                let y = evt.clientY;

                // 组件的宽和高
                let itemH = this.$refs.itemBox.clientHeight || this.$refs.itemBox.offsetHeight;
                let itemW = this.$refs.itemBox.clientWidth || this.$refs.itemBox.offsetWidth;
                
                // 坐标值 最小点  范围
                let x_min = x - this.$refs.itemBox.offsetLeft;
                let y_min = y - this.$refs.itemBox.offsetTop;

                this.$emit("moveOrigin",{
                    id:this.source.data_origin_id,
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
             * 子组件点击切换手型/关联图标时，查找并显示 高亮字段
             */
            changeFeildLight(){
                let index = this.iconLinkLightIndex();
                let upper_level = this.all_param_feild[index].upper_level;
                let name = this.all_param_feild[index].select_origin;
                this.setFeildLight(name,upper_level);
            },
            /**
             * 设置 高亮返回字段
             */
            setFeildLight(name,upper_level){
                this.$store.commit('setFeildActive', {
                    name:name || "",
                    upper_level:(upper_level<0 ? -1:upper_level)
                });
            },
            /**
             * 返回字段选中状态
             */
           feildActive(index,value){
               
               // 非高亮状态直接返回
               if( !this.feild_color[this.write_index] ){return;}

               let num = this.iconLinkLightIndex(); 

               this.setFeildLight(value,this.source.data_origin_id);

               //找出对应的参数信息字段对象,并添加新的属性
               this.$set(this.all_param_feild[num],'select_origin',value);
               //选中字段所在组件的序列号    
               this.$set(this.all_param_feild[num],'upper_level',this.source.data_origin_id);
               this.$set(this.all_param_feild[num],'input_origin','');
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
        computed:{
           feild_active(){
               return this.$store.state.feild_active;
           }
        },
        watch:{
            // 颜色监控
           feild_color:function(){
            // this.feild_active = -1;
           }
        } 
    }
</script>

<style lang="scss" scoped>
@import "@/scss/base.scss";
.opacity{
    opacity:0.5;
}
.dr-title{
    $h:40px;
    height:$h;line-height:$h;
    background-color:$color-theme;
    display:flex;justify-content: space-between;font-size:20px;
    color:$color-white;
    .move,.remove{
        color:$color-kelly-1;font-size:20px; padding:0 10px;
    }
}
.dr-container{
    border:1px solid $color-theme;
    >*{font-size:16px;}
    
    // 返回字段列表
    .field-list{
        .unit{
            color:$color-gray-6;margin:5px;border:1px solid $color-gray-11;padding:3px 10px;border-radius:6px;margin:5px;display:inline-block;
            &.light{
                background-color:$color-kelly-1;color:$color-theme;
            }
            &.light,&.selected{
                border-color:$color-theme;
            }
            &.selected{
               color:$color-white;
            }
        }
    }
}
.pi-item{
    margin-bottom:10px;
}
</style>