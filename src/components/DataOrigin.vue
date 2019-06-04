<template>
    <div class="dr-item">
        <div class="dr-title iconfont icon-yidong">Data Origin</div>
        <div class="dr-container">
            <header-body :title="'Parameter Information'" class="hd-item">
                <parameter-item class="pi-item" v-for="(item) in parameter" :key="item.name" :param="item"></parameter-item>
            </header-body>
            <header-body 
            :title="'Return Feild'"
            v-if="response"
             class="hd-item">
                <div class="field-list">
                    <span class="unit"  
                    v-for="item in response" 
                    :key="item.name"
                    :class="{'light':feild_color[index]}">{{item.name}}</span>
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
            index:{
                type:Number,
                default:0
            }
        },
        data:function(){
            return {
                filter:[],
                parameter:"",
                response:""
            }
        },
        mounted(){
            this.parameter = this.source.parameter;
            this.response = this.source.response;
        },
        methods:{
           
        },
        computed:{
           
        }
    }
</script>

<style lang="scss" scoped>
@import "@/scss/base.scss";
.dr-title{
    $h:40px;
    height:$h;line-height:$h;
    background-color:$color-theme;
    padding:0 10px;
    display:flex;justify-content: space-between;font-size:20px;
    color:$color-white;
    &::after{
    content:"\e61d";
    }
    &::after,&::before{
        color:$color-kelly-1;
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
                background-color:$color-theme;color:$color-white;
            }
        }
    }
}
.pi-item{
    margin-bottom:10px;
}
</style>