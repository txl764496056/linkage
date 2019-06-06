<template>
    <div>
        <div class="status">
            <i class="iconfont light-red" 
            :class="{'icon-lianjie':iconLink,'icon-shoudong':!iconLink}" 
            @click="switchStatus()"
            :param_index="param.para_index"></i>
            <label :for="'param'+param.para_index">{{param.name}}</label>
        </div>
        <input type="text" v-model="param.input_origin" @input="inputOrigin()" :id="'param'+param.para_index" placeholder="please input" v-show="isCustom">
        <div class="link-msg" v-show="showLinkMsg">
            <p class="reg-msg">origin / user registration information:</p>
            <p class="origin-txt">{{ param.select_origin || "please select"}}</p>
            <filter-box v-on:selectFilter="selectFilter()"></filter-box>
            <i @click="linkMsg()" class="iconfont light-red unlink icon-lianjie-duankai"></i>
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
            },
        },
        components:{
            filterBox
        },
        data(){
            return {
                iconLink:false, //true：显示关联图标，false：显示手型图标
                input_origin:'',
                showLinkMsg:false //true:显示关联板块 
            }
        },
        mounted(){
            this.iconLink = this.iconLink_state[this.param.para_index];
            this.input_origin = this.param.input_origin || '';
        },
        methods:{
            /**
             * 已选择过滤器
             */
            selectFilter(data){
                console.log(data);
            },
            /**
             * 取消 所有 返回字段高亮
             */
            cancelFeildLight(){
                for(let i=0;i<this.feild_color.length;i++){
                    this.feild_color.splice(i,1,false);
                }
            },
            /**
             * 设置 部分 返回字段高亮
             * 如果点击的是可读，则可写的所有返回字段高亮
             */
            setFeildLight(){
                let endIndex = this.write_index;
                let len = this.feild_color.length;
                if(endIndex<0){
                    endIndex = len;
                }
                for(let i=0;i<len;i++){
                    if(i<endIndex){
                        this.feild_color.splice(i,1,true);
                    }else{
                        this.feild_color.splice(i,1,false);
                    }
                }
            },
            /**
             * 手型图标状态
             */
            iconLinkState(){
                for(let i=0;i<this.iconLink_state.length;i++){
                    if(i!=this.param.para_index){
                        this.iconLink_state.splice(i,1,false);
                    }else{
                        this.iconLink_state.splice(this.param.para_index,1,this.iconLink);
                    }
                }
            },
            /**
             * 切换手型与挂链图标
             */
            switchStatus(){

                // 切换图标
                this.iconLink = !this.iconLink;

                this.iconLinkState();

                // 关联-切换后
                if(this.iconLink){
                    this.setFeildLight();
                    this.showLinkMsg = true;//显示origin关联板块
                // 手型-切换后
                }else{
                    this.cancelFeildLight();
                }
            },
            /**
             * 输入 origin 与 选择 origin 只能有一个 有效
             */
            inputOrigin(){
                if(this.param.input_origin!=''){
                    this.$set(this.param,'input_origin',this.param.input_origin);
                    this.$set(this.param,'select_origin','');
                }
            },
            /**
             * 关联板块隐藏
             * 表示解除绑定关系，清空已选择的绑定内容
             * 当前关联版块，对应的关联图标隐藏
             * 取消 所有 返回字段 高亮
             */
            linkMsg(){
                this.$set(this.param,'select_origin','');
                this.iconLink = false;
                this.showLinkMsg = false;

                this.cancelFeildLight();
            }
        },
        computed: {
            /**
             *  没有显示关联板块，
             *  则 显示自定义输入框
             */
            isCustom(){
                return !this.showLinkMsg; 
            },
        },
        watch:{
            iconLink_state(){
                this.iconLink = this.iconLink_state[this.param.para_index];
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