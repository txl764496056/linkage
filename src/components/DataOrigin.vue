<template>
    <div class="dr-item">
        <div class="dr-title iconfont icon-yidong">Data Origin</div>
        <div class="dr-container">
            <header-body :title="'Parameter Information'" class="hd-item">
                <div class="status">
                    <i class="iconfont" 
                    :class="{'icon-lianjie':iconLink,'icon-shoudong':!iconLink}" 
                    @click="switchStatus()"></i>
                    <label for="key1">user ID</label>
                </div>
                <input type="text" placeholder="please input" v-show="isCustom">
                <div class="link-msg" v-show="!isCustom">
                    <p>origin / user registration information:</p>
                    <p class="origin-txt">msg</p>
                    <div class="filter-list" @mouseleave="filterListfold()">
                        <button class="caption iconfont" @click="filterList()">filter</button>
                        <ul class="filter-select" v-bind:class="{'unfold':isUnfold}">
                            <li class="unit" 
                            v-for="val in filter" :key="val"
                            @click="selectFilter(val)">{{val}}</li>
                        </ul>
                    </div>
                    <div class="filter-box">
                        <span v-for="val in select_filter" :key="val">{{val}}</span>
                    </div>
                </div>
            </header-body>
            <header-body :title="'Return Feild'" class="hd-item">
                <div class="field-list">
                    <span class="unit" v-for="val in feild" :key="val">{{val}}</span>
                </div>
            </header-body>
        </div>
    </div>
</template>

<script>
import headerBody from './HeaderBody';
    export default {
        name:"data-origin",
        components:{
            headerBody
        },
        props:{
            feild:{
                type:Array,
                default:function(){
                    return ['feild1','feild2'];
                }
            },
            filter:{
                type:Array,
                default:function(){
                    return ['filter1','filter2','filter3'];
                }
            }
        },
        data:function(){
            return {
                isUnfold:false,
                isCustom:true,
                iconLink:false, //true：显示关联图标，false：显示手型图标
                select_filter:[] //已选择的过滤器
            }
        },
        methods:{
            filterList(){
                this.isUnfold = !this.isUnfold;
            },
            filterListfold(){
                this.isUnfold = false;
            },
            /**
             * 切换手型与挂链图标
             * 连接图标：显示字段选择框，手型图标：显示自定义输入框
             */
            switchStatus(){
                this.iconLink = !this.iconLink;
                this.isCustom = !this.iconLink; //当前显示图标 与 (字段选择、输入字段) 反正来的
            },
            /**
             * 选择过滤器
             */
            selectFilter(val){
                this.$emit('send-result',"ddfdfd");

                // let flag = this.select_filter.every(function(item){
                //     return item!==val;
                // })
                
                // if(flag){
                //     this.select_filter.push(val);
                    
                // }
                
                
                this.isUnfold = false;
            }
        },
        // watch:{
        //     "select_filter":function(){

        //         this.$emit('sendResult',"ffdfdfd");
        //     }
        // }
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
    
    p.origin-txt{margin-top:5px;}

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
            margin-right:5px;
        }
    }

    // 过滤器-列表容器
    $captionH:30px;
    .filter-list{
        position:relative;margin-top:15px;width:120px;
        .caption{
            background-color:$color-theme;color:$color-white;border:none;border-radius:5px;padding:0 10px;height:$captionH;line-height:$captionH;
            &::after{content:"\ebe6";font-size:12px;margin-left:3px;}
        }
    }
    // 过滤器列表
    .filter-select{display:none;
        position:absolute;left:0;top:$captionH - 3px;
        background-color:$color-white;
        border:1px solid $color-theme;width:100%;
        .unit{
            list-style:none;line-height:30px;padding:0 10px;
            &:hover{
                background-color:$color-kelly-1;
            }
        }
        &.unfold{
            display:block;;
        }
    }
    // 过滤器内容
    .filter-box{
        display:flex;margin-top:10px;overflow-x:auto;padding-bottom:10px;
        span{
            padding:4px 10px;border:1px solid $color-gray-11;list-style:none;margin:0 5px;border-radius:6px;color:$color-gray-6;
        }
    }
    // 关联容器
    .link-msg{
        padding:10px;
    }
    // 返回字段列表
    .field-list{
        margin:0 5px;
        .unit{
            color:$color-gray-6;margin:5px;border:1px solid $color-gray-11;padding:3px 10px;border-radius:6px;
        }
    }
}
</style>