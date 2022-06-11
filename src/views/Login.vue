<template >
  <div class="login-container">
    <div class="main">
      <div class="login-box-header">
        <img src="../assets/zt.svg" alt="" height="70" width="70" />
        <div style="margin-top: 12px">
          基于NB-IoT和IPv6的智能锥桶管理系统
        </div>
      </div>
      <div style="margin-top: 24px">
        <el-tabs v-model="activeName" type="card" :stretch=true>
          <el-tab-pane label="登 录" name="login">
            <LoginComponent></LoginComponent>
          </el-tab-pane>
          <el-tab-pane label="注册" name="register">
            <RegisterComponent v-on:change-tab="activeName='login'"></RegisterComponent>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import LoginComponent from '@/components/LoginComponent.vue'
import RegisterComponent from '@/components/RegisterComponent.vue'

export default {
  name: "Login",
  components: {
    LoginComponent,
    RegisterComponent
  },
  data() {
    return {
      activeName: 'login'
    };
  },
  methods: {
    
  },
};
</script>

<style scoped>
.login-container {
  background-image: url("../assets/bg.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  min-height: 100vh;
  min-width: 100%;
  overflow: hidden;
  position: fixed;
}
.main {
  width: 380px;
  margin-top: 70px;
  margin-left: auto;
  margin-right: auto;
  background-color: white;
  border: 1px solid #f0f0f0;
  padding: 10px 30px 30px 30px;
  -webkit-box-shadow: 5px 10px 10px rgba(0, 0, 0, 0.05);
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
}
.login-box-header {
  text-align: center;
  font-size: 18px;
  color: #909399;
}
</style>