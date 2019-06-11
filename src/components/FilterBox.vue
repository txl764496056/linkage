<template>
    <div>
        <div class="filter-list" @mouseleave="filterListfold()">
            <button class="caption iconfont" @click="filterList()">filter</button>
            <ul class="filter-select" v-bind:class="{'unfold':isUnfold}">
                <li class="unit" 
                v-for="val in filter" :key="val"
                @click="selectFilter(val)">{{val}}</li>
            </ul>
        </div>
        <div class="filter-box" v-show='select_filter.length>0'>
            <span v-for="(val,index) in select_filter" :key="val">
                {{val}}
                <i @click="deletSelect(index)" class="iconfont icon-cha"></i>
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        name:'filter-box',
        props:{
            filter:{
                type:Array,
                default:function(){
                    return ['filter-1','filter-2','filter-3','filter-4'];
                }
            }
        },
        data(){
            return {
                isUnfold:false, //过滤器列表显示与隐藏
                select_filter:[] //已选择的过滤器
            }
        }, 
        methods:{ 
            filterListfold(){
                this.isUnfold = false;
            },
            filterList(){
                this.isUnfold = !this.isUnfold;
            },
            /**
             * 删除过滤器
             */
            deletSelect(index){
                this.select_filter.splice(index,1);
            },
            /**
             * 选择过滤器
             */
            selectFilter(val){

                // 查是否已存在已选列表中
                let flag = this.select_filter.every(function(item){
                    return item!==val;
                })
                
                if(flag){
                    this.select_filter.push(val);
                    
                }
                // 关闭下拉列表
                this.isUnfold = false;

                // 将选择的过滤器给父组件
                this.$emit('selectFilter',this.select_filter);
            },
            /**
             * 清空已选择过滤器
             */
            emptySelectFilter(){
                this.select_filter.splice(0,this.select_filter.length);
                this.$emit('selectFilter',this.select_filter);
            }
        }
    }
</script>

<style lang="scss" scoped>
@import '@/scss/base.scss';
// 过滤器-列表容器
    $captionH:30px;
    .filter-list{
        position:relative;margin-top:15px;width:120px;z-index:99;
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
            padding:4px 10px;border:1px solid $color-gray-11;list-style:none;margin:0 6px;border-radius:6px;color:$color-gray-6;position:relative;margin-top:8px;
            i{
                position:absolute;right:-8px;top:-8px;width:20px;height:20px;border-radius:50%;color:$color-theme;background-color:$color-kelly-1;font-size:12px;text-align:center;line-height:20px;
                &:hover{
                    background-color:$color-theme;color:$color-white;
                }
            }
        }
    }
</style>