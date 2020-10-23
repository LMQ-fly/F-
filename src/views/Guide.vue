<template>
  <div>
    <div class="swiper-container guidepagecontainer">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <img
            src="https://img.zcool.cn/community/014b9c575183f832f875a4298980df.jpg@2o.jpg"
            alt
            class="auto-img"
          />
        </div>
       
        <div class="swiper-slide">     
          <van-button color="linear-gradient(to right, #f4771d, #d32234)" to="adv">开启智能新时代</van-button>
        </div>
      </div>
      <!-- Add Pagination -->
      <div class="swiper-pagination guidepagepagination"></div>
    </div>
  </div>
</template>

<script>

export default {

};
</script>

<style lang="less" scoped>
.swiper-container {
  width: 100%;
  height: 100%;
}
.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.van-button {
  position: absolute;
  top: 75%;
  left: 50%;
  transform: translateX(-64px);
}

</style>