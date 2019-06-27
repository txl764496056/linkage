<template>
    <div>
        <div class="dr-header iconfont" 
        :class="{'icon-dw':isFold}"
         @click="foldDRBody()">{{title}}</div>
        <div ref="dr"
        class="dr-body" 
        :style='dr_style'>
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
                isFold:false, //true:折叠 false:展开
                dr_height:0, //保存 dr-body的高度
                dr_style:{ //dr-body 内联样式
                    overflow:'hidden',
                } 
            }
        },
        mounted(){

            // 节点渲染完成获取 dr-body 高度
            this.$nextTick(function(){
                this.getHeight();
            });
            
        },
        methods:{
            /**
             * 点击dr-header 折叠后面的dr-body
             */
            foldDRBody(){
                this.isFold = !this.isFold;
                
                if(this.isFold){
                    this.fold();
                }else{
                    this.unfold();
                    // dr-body 添加动画结束 事件
                    this.$refs.dr.addEventListener('webkitTransitionEnd',this.drHAuto);
                }

            },
            /**
             * 展开完成后
             * dr-body的高度设置为auto
             */
            drHAuto(){
                this.setHeight('auto');
            },
            /**
             * 设置 dr-body 的高度
             */
            setHeight(height){
                let isVis = 'visible';
                if(height!=='auto'){
                    height += 'px';
                    isVis = 'hidden';
                }
                this.$set(this.dr_style,'height',height); 
                this.$set(this.dr_style,'overflow',isVis);
            },
            /**
             * 展开dr-body
             */
            unfold(){
                this.setHeight(this.dr_height);
            },
            /**
             * 折叠 dr-body
             */
            fold(){
               let promise = Promise.resolve();
               promise.then(()=>{
                    this.getHeight();
                    this.setHeight(this.dr_height) ;
                    // dr-body 移除动画结束 事件
                    this.$refs.dr.removeEventListener('webkitTransitionEnd',this.drHAuto);
               }).then(()=>{
                   this.setHeight(0);
               })
            },
            /**
             * 获取dr-body高度
             */
            getHeight(){
                this.dr_height = this.$refs.dr.offsetHeight;
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
    user-select:none;
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
    padding:0 10px;
    transition:all 0.7s;
    background-color:#fff;
}
</style>