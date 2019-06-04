<template>
    <div>
        <div class="status">
            <i class="iconfont light-red" 
            :class="{'icon-lianjie':iconLink,'icon-shoudong':!iconLink}" 
            @click="switchStatus()"></i>
            <label :for="'param'+param.id">{{param.name}}</label>
        </div>
        <input type="text" :id="'param'+param.id" placeholder="please input" v-show="isCustom">
        <div class="link-msg" v-show="!isCustom">
            <p class="reg-msg">origin / user registration information:</p>
            <p class="origin-txt">msg</p>
            <filter-box></filter-box>
            <i class="iconfont light-red unlink icon-lianjie-duankai"></i>
        </div>
    </div>
</template>

<script>
import filterBox from './FilterBox';
    export default {
        name:'parameter-item',
        props:{
            param:{
                type:Object,
                default:function(){
                    return {}
                }
            },
            index:{
                type:Number,
                default:0
            }
        },
        components:{
            filterBox
        },
        data(){
            return {
                iconLink:false, //true：显示关联图标，false：显示手型图标
            }
        },
        methods:{
            /**
             * 切换手型与挂链图标
             */
            switchStatus(){
                this.iconLink = !this.iconLink;
            },
        },
        computed: {
            /**
             *  连接图标：显示字段选择框，手型图标：显示自定义输入框
             */
            isCustom(){
                return !this.iconLink; 
            }
        },
    }
</script>

<style lang="scss" scoped>
@import '@/scss/base.scss';
    $m10:10px;
    input,.link-msg{
        border:1px solid $color-gray-11;margin-top:$m10;
        &.dis{display:none;}
    }
    input{
        width:100%;padding:6px 10px;
    }
    label{
       display:inline-block;
    }

    .status{ 
        >i{
            margin-right:5px;font-size:18px;
        }
    }

    
    // 关联容器
    .link-msg{
        padding:10px;position:relative;
        p{
            &.origin-txt{margin-top:5px;}
            &.reg-msg{margin-right:23px;}
        }
        i.unlink{
            position:absolute;right:3px;top:3px;font-size:20px;
        }
    }
</style>