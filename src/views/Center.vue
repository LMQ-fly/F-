<template>
  <div class="center">
    <van-nav-bar
      title="安全中心"
      left-text="返回"
      left-arrow
      :fixed="true"
      @click-left="back"
      right-text="退出登陆"
      @click-right="loginout"
    />
    <div class="center-box">
      <div>
        <van-cell title="修改密码" @click="ChangePassword" />
        <van-cell title="注销账号" @click="cancelanaccount " />
      </div>
      <van-popup v-model="show" position="bottom" :style="{ height: '30%' }" closeable round>
        <div class="popup-item">
          <div class="password-text">修改密码</div>
          <van-form>
            <van-field
              v-for="(item, index) in passwords"
              :key="index"
              :type="item.isPassword ? 'password' : 'text'"
              :label="item.title"
              placeholder="6-16位密码且以字母开头"
              v-model="item.password"
              :right-icon="item.isPassword ? 'closed-eye' : 'eye-o'"
              @click-right-icon="viewPassword(item)"
            />
            <div class="login-btn">
              <van-button
                round
                block
                color="#0C34BA"
                native-type="submit"
                @click="confirmPassword"
              >确认修改</van-button>
            </div>
          </van-form>
        </div>
      </van-popup>
    </div>
    <!-- <div class="btn-box">
      <van-button round block color="#0C34BA" @click="logout">退出登录</van-button>
    </div>-->
  </div>
</template>

<script>
import "../assets/less/center.less";
import { utils } from "../assets/js/utils";
import { validForm } from "../assets/js/validForm";

export default {
  data() {
    return {
      show: false,
      passwords: {
        old: {
          password: "",
          isPassword: true,
          title: "旧密码"
        },
        new: {
          password: "",
          isPassword: true,
          title: "新密码"
        }
      }
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    // 修改密码
    ChangePassword() {
      this.show = true;
      
     
    },
    //注销账号
    cancelanaccount() {
      this.$dialog
        .confirm({
          title: "注销账号",
          message: "是否确认注销号，一旦确认无法恢复！",
          confirmButtonColor: "#0C34BA",
          overlayClass: "over",
          overlayStyle: { backgroundColor: "rgba(26, 46, 119, 0.7)" }
        })
        .then(() => {
          //获取token字符串
          let tokenString = localStorage.getItem("CSTK");
          if (!tokenString) {
            return this.$router.push({ name: "Login" });
          }

          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0,
            loadingType: "spinner"
          });

          //参数序列化
          let data = utils.queryString({
            appkey: this.appkey,
            tokenString
          });

          this.axios({
            method: "POST",
            url: "/destroyAccount",
            data
          }).then(result => {
            this.$toast.clear();

            this.$toast(result.data.msg);
            if (result.data.code == "G001") {
              localStorage.removeItem("CSTK");
              setTimeout(() => {
                this.$router.push({ name: "Login" });
              }, 600);
            }
          });
          // .catch(err => {
          //   this.$toast.clear();
          // });
        })
        .catch(() => {});
    },
    // 查看密码
    viewPassword(item) {
      item.isPassword = !item.isPassword;
    },
    //确认修改密码
    confirmPassword() {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      let o = {
        oldPassword: {
          value: this.passwords.old.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "旧密码支持字母数字_组合"
        },
        password: {
          value: this.passwords.new.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "新密码支持字母数字_组合"
        }
      };

      //验证表单
      if (!validForm.valid(o)) {
        //验证不通过
        return;
      }

      //发起修改密码请求
      //验证通过
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });

      //参数序列化
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        oldPassword: this.passwords.old.password,
        password: this.passwords.new.password
      });

      this.axios({
        method: "POST",
        url: "/updatePassword",
        data
      }).then(result => {
        this.$toast.clear();

        if (result.data.code == "E001") {
          localStorage.removeItem("CSTK");
          this.$router.push({ name: "Login" });
        } else {
          this.$notify({
            type: "warning",
            message: result.data.msg
          });
        }
      });
    },
    //退出登陆
    loginout() {
      this.$dialog.confirm({
        title: "退出登录",
        message: "是否确认退出登录！",
        confirmButtonColor: "#0C34BA",
        overlayClass: "over",
        overlayStyle: { backgroundColor: "rgba(26, 46, 119, 0.7)" }
      });
      localStorage.removeItem('CSTK');
      
      setTimeout(() => {
        this.$toast.clear();
        this.$router.push({
          name:'Login'
        });
      }, 1000);
    }
  }
};
</script>

