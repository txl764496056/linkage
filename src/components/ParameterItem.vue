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
            <filter-box ref="filterbox" v-on:selectFilter="selectFilter"></filter-box>
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
            selectedField:{
                type:Object,
                default(){
                    return {}
                }
            }
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
             * 已选择过滤器，当过滤器列表项选中并点击时，生效
             */
            selectFilter(data){
                
                this.emptyInputOrigin();
                this.$set(this.param,'select_filter',data);
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
             * 清空已选择的feild高亮
             */
            clearSelectedField(){
                this.$set(this.selectedField,'id',-1);
                this.$set(this.selectedField,'name',"");
            },
            /**
             * 切换手型与挂链图标
             */
            switchStatus(){

                this.clearSelectedField()

                // 切换图标
                this.iconLink = !this.iconLink;

                this.iconLinkState();

                // 关联-切换后
                if(this.iconLink){
                    this.setFeildLight();
                    this.showLinkMsg = true;//显示origin关联板块
                    this.$emit('changeFeildLight');
                    if(this.param.upper_level>=0){
                        this.$set(this.selectedField,'id',this.param.upper_level);
                        this.$set(this.selectedField,'name',this.param.select_origin);
                    }
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
                    this.emptySelectOrigin();
                }
            },
            /**
             * 关联板块隐藏
             * 表示解除绑定关系，清空已选择的绑定内容
             * 当前关联版块，对应的关联图标隐藏
             * 取消 所有 返回字段 高亮
             */
            linkMsg(){
                this.emptySelectOrigin();
                this.emptySelectFilter();
                this.$refs.filterbox.emptySelectFilter();
                this.iconLink = false;
                this.showLinkMsg = false;

                this.cancelFeildLight();
            },
            /**
             * 清空已选择过滤器
             */
            emptySelectFilter(){
                this.$set(this.param,'select_filter','');
            },
            /**
             * 清空已选择数据源
             */
            emptySelectOrigin(){
                this.$set(this.param,'select_origin','');
            },
            /**
             * 清空已输入数据源
             */
            emptyInputOrigin(){
                this.$set(this.param,'input_origin','');
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
                // this.setFeildLight(); 

            },
            // param(){
            //    if(this.param.upper_level>=0){
            //         this.$set(this.selectedField,'id',this.param.upper_level);
            //         this.$set(this.selectedField,'name',this.param.select_origin);
            //     }
            // }
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