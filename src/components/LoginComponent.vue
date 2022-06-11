<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="80px"
    class="demo-ruleForm"
  >
    <el-form-item label="用户名" prop="username">
      <el-input
        prefix-icon="el-icon-user-solid"
        v-model="ruleForm.username"
      ></el-input>
    </el-form-item>

    <el-form-item label="密码" prop="password">
      <el-input
        prefix-icon="el-icon-lock" type="password"
        v-model="ruleForm.password"
      ></el-input>
    </el-form-item>

    <!-- <el-form-item label="验证码" prop="captcha">
        <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="11">
                <el-input
                prefix-icon="el-icon-view"
                v-model="ruleForm.captcha"
                ></el-input>
            </el-col>
            <el-col :span="11" style="line-height: 100%">
                <img :src="captcha_url" alt="" @click="refresh_captcha()" style=" cursor:pointer;" />
                <el-input type="hidden" name="captcha_key" v-model="ruleForm.captcha_key" style="display: none;" ></el-input>
            </el-col>
      </el-row>
    </el-form-item> -->

    <el-form-item>
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="11">
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
            style="width: 100%"
            >登&nbsp;&nbsp;录</el-button
          >
        </el-col>
        <el-col :span="11">
          <el-button @click="resetForm('ruleForm')" style="width: 100%"
            >重&nbsp;&nbsp;置</el-button
          >
        </el-col>
      </el-row>
    </el-form-item>
  </el-form>
</template>

<script>
import request from "@/utils/request";
export default {
    name: "LoginComponent",
    data() {
        return {
           // captcha_url: "",
            ruleForm: {
                //captcha_key: "",
                //captcha: "",
                username: "",
                password: "",
            },
            rules: {
                username: [
                { required: true, message: "请输入用户名", trigger: "blur" },
                ],
                password: [{ required: true, message: "请输入密码", trigger: "blur" }],
               // captcha: [{ required: false, message: "请输入验证码", trigger: "blur" }],
            },
        };
    },
    methods: {
        submitForm(formName) {
          console.log(this.ruleForm);
            this.$refs[formName].validate((valid) => {
                if (valid) {
                   request.get('user/login?username='+this.ruleForm.username +'&password='+this.ruleForm.password).then((response) => {
						if(response.data.ret ==0){
							this.refresh_captcha();
							this.$message.error(response.data.msg);    
						}else{
							let token = response.data.token
							let id = response.data.id
							this.$store.commit('saveUserInfo', {'username': this.ruleForm.username, 'token': token, 'id': id})
							this.$router.push({name: 'Home'})
						}
                        
                    }).catch((error) => {
                        this.refresh_captcha()
                        this.$message.error(error.response.data.detail);                        
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        refresh_captcha() {
            this.axios.get('captcha/refresh/', { headers : {'X-Requested-With': 'XMLHttpRequest'} }).then((response) => {
                this.captcha_url = response.data.image_url;
                this.ruleForm.captcha_key = response.data.key;
            })  
        }     
  },
  mounted() {
   this.refresh_captcha()
  },
  
 
}
</script>