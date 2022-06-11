<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column prop="coneId" label="信息编号" width="130"> </el-table-column>
      <el-table-column prop="coneName" label="锥桶编号" width="120"> </el-table-column>
      <el-table-column
        prop="userFlag"
        
        label="预警消息类别"
        width="120"
        show-overflow-tooltip
        :formatter="formatBoolean"
      ></el-table-column>
      <el-table-column prop="location" label="发生位置" width="160">
      </el-table-column>
      <el-table-column prop="batteryLeft" :formatter="formatscrapFlag" label="当前状态" width="80">
      </el-table-column>
      
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!--<el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
            ><i class="el-icon-edit"></i>处理</el-button
          >-->
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            ><i class="el-icon-delete"></i>删除</el-button
          >
          <!--<el-button
            size="mini"
            type="success"
            @click="downloadFile(scope.$index, scope.row)"
            ><i class="el-icon-view"></i>详细信息查看</el-button
          >-->
          
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="total"
        :current-page.sync="currentPage"
        @current-change="CurrentChange"
        :hide-on-single-page="hidePage"
        style="text-align: right"
      >
      </el-pagination>
    </div>
    <el-dialog title="修改数据信息" :visible.sync="dialogTableVisible">
      <div style="width: 90%; margin-left: auto; margin-right: auto">
        <div style="text-align: center">
          <span style="font-size: 20px">修改数据集</span>
        </div>
        <el-row style="margin-top: 25px">
          <el-col :span="24">
            <el-form
              :label-position="labelPosition"
              label-width="120px"
              :model="dataForm"
              :rules="rules"
              ref="dataForm"
            >
              <el-form-item label="数据集名称" prop="name">
                <el-input v-model="dataForm.name"></el-input>
              </el-form-item>
              <el-form-item label="数据集详细信息" prop="detail">
                <el-input type="textarea" v-model="dataForm.detail"></el-input>
              </el-form-item>
              <el-form-item label="数据集标签" prop="tab">
                <el-input v-model="dataForm.tab"></el-input>
              </el-form-item>
              <el-form-item label="数据集公开类型" prop="publicType">
                <el-radio-group v-model="dataForm.publicType">
                  <el-radio label="0" name="publicType">私有类型</el-radio>
                  <el-radio label="1" name="publicType">同组成员</el-radio>
                  <el-radio label="2" name="publicType">公开</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="权限设置" prop="permission">
                <el-checkbox-group v-model="dataForm.permission">
                  <el-checkbox label="0" name="permission"
                    >详细信息</el-checkbox
                  >
                  <el-checkbox label="1" name="permission"
                    >聚合查询</el-checkbox
                  >
                  <el-checkbox label="2" name="permission"
                    >直方图发布</el-checkbox
                  >
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="上传文件" prop="dataSet" style="height: 50%">
                <el-upload
                  accept=".csv"
                  action=""
                  :before-remove="beforeRemove"
                  :on-remove="handleRemove"
                  :on-change="handleChange"
                  multiple
                  :limit="1"
                  :on-exceed="handleExceed"
                  :file-list="fileList"
                  :auto-upload="false"
                >
                  <el-button size="small" type="success"
                    ><i class="el-icon-upload el-icon--right"></i
                    >&nbsp;点击上传</el-button
                  >
                  <div slot="tip" class="el-upload__tip">只能上传csv文件</div>
                </el-upload>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit('dataForm')"
                  >修改</el-button
                >
                <el-button @click="resetForm('dataForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  data() {

    return {
      tableData: [],
      multipleSelection: [],
      total: 0,
      pageSize: 9,
      currentPage: 1,
      dialogTableVisible: false,
      hidePage: true,
      labelPosition: "right",
      dataForm: {
        coneId:"",
        coneName: "",

        userFlag:"",
        tab: "",
        publicType: "",
        permission: [],
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
      },
    };
  },

  methods: {
    downloadFile(index, row) {
      window.location.href = row.dataSet;
    },
    handleDelete(index, row) {
      request
        .delete("/api/data/" + row.id)
        .then(() => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.CurrentChange(this.currentPage);
        })
        .catch((error) => {
          console.log(error);
          this.$message({
            message: "删除失败",
            type: "error",
          });
        });
    },
     formatBoolean(row, column, cellValue) {
       let value;
       switch(cellValue){
         case 1 : value = "锥桶跌倒"; break;
         case 2: value = "异常碰撞";break;
         default:value = "交通事故";break;
       }
     return value;
    },
    formatscrapFlag(row, column, cellValue) {
       let value;
       switch(cellValue){
         case 0 : value = "尚未处理"; break;
         case 1: value = "已处理";break;
         default:value = "待确认";break;
       }
      return value;
     },


    CurrentChange(page) {
      this.currentPage = page;
      request
        .get("api/data?page=" + page + "&size=" + this.pageSize)
        .then((response) => {
          this.tableData = response.data.results;
          this.total = response.data.count;
        });
    },
    handleEdit(index, row) {
      this.dialogTableVisible = true;
      this.fileList = [
        { name: row.dataSet.split("/").pop(), url: row.dataSet },
      ];
      this.dataForm.id = row.id;
      this.dataForm.name = row.name;
      this.dataForm.detail = row.detail;
      this.dataForm.tab = row.tab;
      let publicType = ["私有类型", "同组成员", "公开"];
      let permission = ["详细信息", "聚合查询", "直方图发布"];
      let rowPermissionArr = row.permission.split(", ");
      let arr = [];
      for (let item in rowPermissionArr) {
        arr.push(String(permission.indexOf(rowPermissionArr[item])));
      }
      this.dataForm.permission = arr;
      this.dataForm.publicType = String(publicType.indexOf(row.publicType));
    },
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
      this.$refs[formName].resetFields();
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let formData = new FormData();
          for (let key in this.dataForm) {
            if (key === "permission" && this.dataForm[key].length != 1) {
              for (let item in this.dataForm[key]) {
                formData.append(key, item);
              }
            } else {
              formData.append(key, this.dataForm[key]);
            }
          }
          request
            .patch("/api/data/" + this.dataForm.id + "/", formData)
            .then((response) => {
              console.log(response);
              this.$message({
                message: "修改成功",
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
        this.tableData = response.data.data;
        this.total = response.data.count;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>