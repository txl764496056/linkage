<template>
    <div>
        <div class="status">
            <i class="iconfont light-red" 
            :class="{'icon-lianjie':iconLink,'icon-shoudong':!iconLink}" 
            @click="switchStatus()"></i>
            <label :for="'param'+param.para_index">{{param.name}}</label>
        </div>
        <input type="text" :id="'param'+param.para_index" placeholder="please input" v-show="isCustom">
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
            write_index:{ //data-origin的序列号
                type:Number,
                default:-1
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
            }
        },
        components:{
            filterBox
        },
        data(){
            return {
                // iconLink:false, //true：显示关联图标，false：显示手型图标
                iconLink:false
            }
        },
        mounted(){
            this.iconLink = this.iconLink_state[this.param.para_index]
        },
        methods:{
            /**
             * 切换手型与挂链图标
             */
            switchStatus(){
                // 切换图标
                this.iconLink = !this.iconLink;

                for(let i=0;i<this.iconLink_state.length;i++){
                    if(i!=this.param.para_index){
                        this.iconLink_state.splice(i,1,false);
                    }else{
                        this.iconLink_state.splice(this.param.para_index,1,this.iconLink);
                    }
                }

                // 如果点击的是可读，则可写的所有返回字段高亮
                let endIndex = this.write_index;
                let len = this.feild_color.length;
                if(endIndex<0){
                    endIndex = len;
                }
                
                // 关联-切换后
                if(this.iconLink){
                    for(let i=0;i<len;i++){
                        if(i<endIndex){
                            this.feild_color.splice(i,1,true);
                        }else{
                            this.feild_color.splice(i,1,false);
                        }
                    }
                // 手型-切换后
                }else{
                    for(let i=0;i<len;i++){
                        this.feild_color.splice(i,1,false);
                    }
                }
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
        watch:{
            iconLink_state(){
                this.iconLink = this.iconLink_state[this.param.para_index]
            }
        }
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