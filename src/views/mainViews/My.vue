<template>
  <div class="my">
    <div class="my-bg" :style="{backgroundImage: `url(${userInfo.userBg})`}">
      <van-uploader v-if="isLogin" class="uploader-box" :after-read="upload" />
    </div>
    <div class="my-content">
      <div class="my-boxing">
        <div v-if="isLogin" class="my-box">
          <div class="my-img">
            <div class="img-box">
              <img class="auto-img" :src="userInfo.userImg" alt />
            </div>
            <div class="my-info">
              <div class="nickname">{{userInfo.nickName}}</div>
              <div class="desc">{{userInfo.desc == '' ? '这个家伙很懒，什么都没留下' : userInfo.desc}}</div>
            </div>
          </div>
        </div>
        <div class="not-login" v-else>
          <span @click="goLogin">请先登录</span>
        </div>

        <div class="lists">
          <van-cell
            :title="item.title"
            :to="item.to"
            size="large"
            is-link
            v-for="(item, index) in lists"
            :key="index"
          />
        </div>

        <van-cell class="help" title="帮助反馈" is-link 
       @click="showPopup" />

        <van-popup v-model="show" round position="bottom" :style="{ height: '60%' }" closeable>
          <h3 class="help-title">帮助反馈</h3>
          <van-collapse v-model="activeNames">
            <van-collapse-item title="账号问题" name="1">
              <h4>Q：如何修改自己的账户信息？</h4>
              <p>改App使用的是手机账号，您可以在“我的”页面修改个人账号信息</p>
            </van-collapse-item>
            <van-collapse-item title="订单问题" name="2">
              <h4>Q：如何取消订单?</h4>
              <p>如果商家尚未接单，您可以在订单详情页通过“取消订单”功能进行取消;如果商家已接单，则需要您电话联系后由商家取消订单。</p>
            </van-collapse-item>
            <van-collapse-item title="其它问题" name="3">
              <h4>Q：为什么图片上传失败?</h4>
              <p>图片上传有限制，如果超过系统规定的图片大小或者路径不对均不可上传</p>
            </van-collapse-item>
          </van-collapse>
        </van-popup>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/less/my.less";
import { utils } from "../../assets/js/utils";
export default {
  data() {
    return {
        show: false,
      activeNames: ["1"],
      lists: [
        { title: "个人资料", to: { name: "Person" } },
        { title: "我的订单", to: { name: "Order" } },
        { title: "我的收藏", to: { name: "Collect" } },
        { title: "收货地址", to: { name: "Shippingaddress" } },
        { title: "安全中心", to: { name: "Center" } }
      ],
      isLogin: false,
      userInfo: {},
      maxSize: 1 * 1024 * 1024,
   
    };
  },
  created() {
    this.getUserInfo();
  },

  methods: {
    // 请先登陆
    goLogin() {
      this.$router.push({
        name: "Login"
      });
    },
       showPopup() {
        this.show = true;
      },
    //查询用户信息
    getUserInfo() {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });

      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString
        }
      }).then(result => {
        this.$toast.clear();

        if (result.data.code == "A001") {
          if (result.data.result.length > 0) {
            this.isLogin = true;
            this.userInfo = result.data.result[0];
          }
        }
      });
    },

    //上传背景
    upload(file) {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      //获取文件类型
      let type = file.file.type.split("/")[1];
      let imgTypes = ["png", "gif", "jpg", "jpeg"];
      if (imgTypes.indexOf(type) === -1) {
        this.$notify({
          message: "图片类型只支持" + imgTypes.join(","),
          color: "#fff",
          background: "#0C34BA"
        });

        return;
      }

      //大小
      if (this.maxSize < file.file.size) {
        this.$notify({
          message: "上传文件大小不能超过" + this.maxSize / 1024 + "KB",
          color: "#fff",
          background: "#0C34BA"
        });
        return;
      }

      //

      //获取base64
      let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64,/, "");

      //参数序列化
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        imgType: type,
        serverBase64Img: base64
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });

      this.axios({
        method: "POST",
        url: "/updateUserBg",
        data
      }).then(result => {
        this.$toast.clear();

        if (result.data.code == "I001") {
          this.userInfo.userBg = result.data.userBg;
        }
      });
    }
  }
};
</script>

