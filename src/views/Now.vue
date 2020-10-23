<template>
    <div class="now">
         <van-nav-bar title="现在下单" left-text="返回" left-arrow :fixed="true" @click-left="back" />
    </div>
</template>

<script>
import '../assets/less/now.less'
    export default {
        data(){
            return{

            }
        },
        methods:{
            back(){
                this.$router.go(-1)
            }
        }
    }
</script>

