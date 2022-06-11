<template>
  <div style="width: 50%; margin-left: 45px">
    <el-row type="flex" justify="center">
      <el-col :span="8">
        <span style="font-size: 20px; color: #303133; font-weight: bold"
          >添加锥桶库存数据</span
        >
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
          <el-form-item label="锥桶名称" prop="coneName">
            <el-input v-model="dataForm.coneName"></el-input>
          </el-form-item>

          <el-form-item label="锥桶类别" prop="coneType">
            <el-radio-group v-model="dataForm.coneType">
              <el-radio label="1" name="coneType">高速交通</el-radio>
              <el-radio label="2" name="coneType">普通道路</el-radio>
              <el-radio label="3" name="coneType">街道</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="入库时间" prop="inTime">
            <el-date-picker
              v-model="dataForm.inTime"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="使用状态" prop="userFlag">
            <el-radio-group v-model="dataForm.userFlag">
              <el-radio label="1" name="userFlag">正在使用中</el-radio>
              <el-radio label="2" name="userFlag">库存保存中</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="当前所处位置" prop="location">
            <el-input v-model="dataForm.location"></el-input>
          </el-form-item>
          <el-form-item label="剩余电量" prop="batteryLeft">
            <el-input-number
              v-model="dataForm.batteryLeft"
              @change="handleChange"
              :min="1"
              :max="100"
              label="%"
            ></el-input-number>
            <label>(1-100)%</label>
          </el-form-item>

          <el-form-item label="报废状态" prop="scrapFlag">
            <el-radio-group v-model="dataForm.scrapFlag">
              <el-radio label="1" name="scrapFlag">未报废</el-radio>
              <el-radio label="2" name="scrapFlag">已报废</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="添加时间" prop="createtime">
            <el-date-picker
              v-model="dataForm.createtime"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>

         <el-form-item label="锥桶负责人" prop="userId">
            <el-select v-model="dataForm.userId" placeholder="请选择">
              <el-option
                v-for="idKey in userIds"
                :key="idKey.userId"
                :label="idKey.userName"
                :value="idKey.userId"
              >
              </el-option>
            </el-select>
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
      userIds: [],
      labelPosition: "right",
      dataForm: {
        coneName: "",
        coneType: "",
        inTime: "",
        userFlag: "",
        location: "",
        batteryLeft: "",
        scrapFlag: "",
        userId: "",
      },
      fileList: [],

      rules: {
        name: [
          { required: true, message: "请输入数据集名称", trigger: "blur" },
        ],
        detail: [
          { required: true, message: "请输入数据集详细信息", trigger: "blur" },
        ],
        tab: [{ required: true, message: "请输入数据集标签", trigger: "blur" }],
        publicType: [
          { required: true, message: "请选择公开类型", trigger: "blur" },
        ],
        permission: [
          { required: true, message: "请选至少一个权限", trigger: "blur" },
        ],
        dataSet: [{ required: true, message: "请选择文件", trigger: "blur" }],
      },
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

          console.log(formData.toString());

          request
            .post("/cones/addCones", formData)
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
      .get("user/userList")
      .then((response) => {
        console.log(response.data.data);
        this.userIds = response.data.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>