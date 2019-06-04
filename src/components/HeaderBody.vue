<template>
    <div>
        <div class="dr-header iconfont" 
        :class="{'icon-dw':isFold}"
         @click="foldDRBody()">{{title}}</div>
        <div class="dr-body" :class="{fold:isFold}">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name:"header-body",
        props:{
            title:{
                type:String,
                default:'title'
            }
        },
        data:function(){
            return {
                isFold:false
            }
        },
        methods:{
            /**
             * 点击dr-header 折叠后面的dr-body
             */
            foldDRBody(){
                this.isFold = !this.isFold;
            }
        }
    }
</script>

<style lang="scss" scoped>
@import '@/scss/base.scss';
.dr-header{
    $h:38px;
    height:$h;line-height:$h;
    background-color:$color-kelly-1;
    color:$color-black-4;
    padding:0 10px;
    font-size:18px;
    display:flex;justify-content:space-between;
    &::after{
        color:$color-theme;
        content:"\e6b0"; 
        margin-left:20px;
    }
    &.icon-dw{
        &::after{
            content:"\ebe8";
        }
    }
}

.dr-body{
    padding:15px 10px;
    transition:height 1s;
    background-color:#fff;
    &.fold{
        height:0;overflow:hidden;padding-bottom:0;padding-top:0;
    }
}
</style>