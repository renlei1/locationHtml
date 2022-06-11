<template>
  <div style="width: 50%; margin-left: 45px">
    <el-row type="flex" justify="center">
      <el-col :span="6">
        <span style="font-size: 20px">调度信息添加</span>
      </el-col>
    </el-row>
    <el-row style="margin-top: 25px">
      <el-col :span="24">
        <el-form
          :label-position="labelPosition"
          label-width="120px"
          :model="dataForm"
          :rules="rules"
          ref="dataForm"
        >
         <el-form-item label="选择调用的锥桶" prop="coneId">
            <el-select v-model="dataForm.coneId" placeholder="请选择">
              <el-option
                v-for="idKey in conesId"
                :key="idKey.coneId"
                :label="idKey.coneName"
                :value="idKey.coneId"
              >
              </el-option>
            </el-select>
          </el-form-item>

         <el-form-item label="事故类别" prop="accidentType">
            <el-radio-group v-model="dataForm.accidentType">
              <el-radio label="0" name="accidentType">交通事故</el-radio>
              <el-radio label="1" name="accidentType">道路导流</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="调度位置" prop="location">
            <el-input v-model="dataForm.location"></el-input>
          </el-form-item>

          <el-form-item label="调度状态" prop="status">
            <el-radio-group v-model="dataForm.status">
              <el-radio label="0" name="status">正在使用中</el-radio>
              <el-radio label="1" name="status">调度已完成</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="调度时间" prop="createtime">
            <el-date-picker v-model="createtime" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        
          <el-form-item>
            <el-button type="primary" @click="onSubmit('dataForm')"
              >立即创建</el-button
            >
            <el-button @click="resetForm('dataForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  data() {
    return {
       conesId: [],
      labelPosition: "right",
      dataForm: {
        coneId: "",
        location: "",
        accidentType: "",
        createtime: "",
        status: "",
      },
      fileList: [],

  
    };
  },
  methods: {
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleRemove() {
      this.dataForm.dataSet = null;
    },
    handleExceed() {
      this.$message.warning(`只能选择一个文件`);
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
      this.dataForm.dataSet = file.raw;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields("dataSet");
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let formData = new FormData();
           for (let key in this.dataForm) {
            formData.append(key, this.dataForm[key]);
          }
          formData.append("userId", this.$store.state.id);
          request
            .post("/dispatch/addDispatch/", formData)
            .then((response) => {
              console.log(response);
              this.$message({
                message: "创建成功",
                type: "success",
              });
            })
            .catch((err) => {
              let errMsg = err.response.data;
              let errMsgs = "";
              for (let key in errMsg) {
                errMsgs += errMsg[key];
              }
              this.$message({
                message: errMsgs,
                type: "error",
              });
              console.log(err.response.data);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },


mounted() {
    request
      .get("cones/getConesList")
      .then((response) => {
        console.log(response.data.data);
        this.conesId = response.data.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },


};
</script>