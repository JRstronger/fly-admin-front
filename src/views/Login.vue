<template>
  <div class="login">
    <!--  顶部  -->
    <div class="el-login-header">
      <span>飞流工作室</span>
    </div>
    <el-form
      ref="loginRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <h1 class="title">安全登录通道</h1>

      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          size="large"
          auto-complete="on"
          placeholder="账号"
        >
          <template #prefix><svg-icon icon-class="user" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          size="large"
          auto-complete="on"
          placeholder="密码"
          @keyup.enter="handleLogin"
        >
          <template #prefix><svg-icon icon-class="password" /></template>
        </el-input>
      </el-form-item>

      <el-checkbox
        v-model="loginForm.rememberMe"
        style="margin: 0px 0px 25px 0px"
        >记住密码</el-checkbox
      >
      <el-form-item style="width: 100%">
        <el-button
          size="large"
          type="primary"
          style="width: 100%"
          @click.prevent="handleLogin"
        >
          <span>登 录</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span
        >Copyright © 2013-2023
        <a href="#">飞流工作室</a>
        版权所有.</span
      >
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import requestUtil from "@/util/request";
import store from "@/store";
import { ElMessage } from "element-plus";
import qs from "qs";
import router from "@/router";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/util/jsencrypt";

const loginRef = ref(null);
const loginForm = ref({
  username: "",
  password: "",
  rememberMe: false,
});

const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
};
const handleLogin = () => {
  loginRef.value.validate(async (valid) => {
    if (valid) {
      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        console.log("loginForm.value.rememberMe=", loginForm.value.rememberMe);
        Cookies.set("username", loginForm.value.username, { expires: 30 });
        Cookies.set("password", encrypt(loginForm.value.password), {
          expires: 30,
        });
        Cookies.set("rememberMe", loginForm.value.rememberMe, { expires: 30 });
      } else {
        // 否则移除
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }
      try {
        let result = await requestUtil.post(
          "login?" + qs.stringify(loginForm.value)
        );
        console.log("login?" + qs.stringify(loginForm.value));
        let data = result.data;
        console.log("login-data", data);
        if (data.code == 200) {
          //将token放到session中
          const token = data.authorization;
          const menuList = data.menuList;
          const currentUser = data.currentUser;
          console.log("currentUser=", currentUser);

          console.log("menuList=", menuList);
          store.commit("SET_MENULIST", menuList);
          store.commit("SET_TOKEN", token);
          store.commit("SET_USERINFO", currentUser);

          //跳转到后端首页
          // router.replace("/");
          console.log("跳转到/index");
          window.location.href = "/";
          ElMessage.success("登录成功！");
        } else {
          ElMessage.error(data.msg);
        }
      } catch (err) {
        console.log("error:" + error);
        ElMessage.error("服务器出错，请联系管理员！");
      }
    } else {
      console.log("验证失败");
    }
  });
};

function getCookie() {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  const rememberMe = Cookies.get("rememberMe");
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password:
      password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
  };
  console.log("getCookie().loginForm.value=", qs.stringify(loginForm.value));
}
getCookie();
</script>

<style lang="scss" scoped>
@import "@/assets/font/font_f.css";
body,
html {
  font-family: DingTalkJinBuTi;
}
a {
  color: white;
}
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
  font-family: DingTalkJinBuTi;
}
.studio-title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
  font-family: DingTalkJinBuTi;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
  font-family: DingTalkJinBuTi;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  font-family: DingTalkJinBuTi;

  .el-input {
    height: 40px;
    font-family: DingTalkJinBuTi;
    input {
      display: inline-block;
      height: 40px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 40px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-header {
  font-family: DingTalkSans;
  height: 40px;
  line-height: 40px;
  position: absolute;
  bottom: 650px;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 50px;
  letter-spacing: 1px;
  font-family: DingTalkJinBuTi;
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>