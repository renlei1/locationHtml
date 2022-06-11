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

    
    <el-form-item label="邮箱" prop="email">
        <el-input
        prefix-icon="el-icon-message"
        v-model="ruleForm.email"
      ></el-input>
    </el-form-item>

    <el-form-item label="密码" prop="password" >
      <el-input type="password"
        prefix-icon="el-icon-lock"
        v-model="ruleForm.password"
      ></el-input>
    </el-form-item>
    <el-form-item label="重复密码" prop="repeatPassword" >
      <el-input type="password"
        prefix-icon="el-icon-lock"
        v-model="ruleForm.repeatPassword"
      ></el-input>
    </el-form-item>

    <el-form-item>
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="11">
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
            style="width: 100%"
            >注&nbsp;&nbsp;册</el-button
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
import request from '@/utils/request'
export default {
  name: "RegisterComponent",
  data() {
    var checkPass1 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('repeatPassword');
          }
          callback();
        }
      };  
    var checkPass2 = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
            callback(new Error('两次输入密码不一致!'));
        } else {
            callback();
        }
    };
    var checkUsr = (rule, value, callback) => {       
        if (value === '') {
            callback(new Error('请输入用户名'));
        } else {
            request.get('user/checkUser?username='+value, {username: value}).then((response) => {
               console.log(response.data.data);
               if (response.data.data==true) callback(new Error('用户名已存在!'));
               else callback();
            })         
        }
    };
    return {
      ruleForm: {
        username: "",
        password: "",
        email: "",
        repeatPassword: ""
      },
      rules: {
        username: [
          { validator: checkUsr, trigger: "blur" }
        ],
        password: [           
            { validator: checkPass1, trigger: "blur" }
        ],      
        email: [
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        repeatPassword: [          
            { validator: checkPass2, trigger: "blur" }
        ]
      },
    };   
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          request.post('user/register', this.ruleForm).then((response) => {
              console.log(response)
              this.$message({
                message: '注册成功,请登录',
                type: 'success'
              });
              this.$emit('change-tab')
            }).catch((error) => {
              console.log(error)
              console.log(error.response.data['username'][0])
              console.log(error.response.data['password'][0])
            })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    
  },
};
</script>