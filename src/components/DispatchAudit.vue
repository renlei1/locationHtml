<!--</template><template>
  <div style="width: 50%; margin-left: 45px">
    <el-row type="flex" justify="center">
      <el-col :span="4">
        <span style="font-size: 20px">创建锥桶数据</span>
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
              <el-radio label="0" name="coneType">高速交通</el-radio>
              <el-radio label="1" name="coneType">普通道路</el-radio>
              <el-radio label="2" name="coneType">街道</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="入库时间" prop="inTime">
            <el-date-picker v-model="inTime" type="date" placeholder="选择日期">
            </el-date-picker>
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
              <el-checkbox label="0" name="permission">详细信息</el-checkbox>
              <el-checkbox label="1" name="permission">聚合查询</el-checkbox>
              <el-checkbox label="2" name="permission">直方图发布</el-checkbox>
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
      labelPosition: "right",
      dataForm: {
        name: "",
        detail: "",
        tab: "",
        publicType: "",
        permission: [],
        dataSet: "",
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
            if (key === "permission" && this.dataForm[key].length != 1) {
              for (let item in this.dataForm[key]) {
                formData.append(key, item);
              }
            } else {
              formData.append(key, this.dataForm[key]);
            }
          }
          formData.append("owner", this.$store.state.id);
          request
            .post("/api/data/", formData)
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
};
</script>
-->