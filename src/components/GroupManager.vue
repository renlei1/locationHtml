<template>
  <div>
    <el-row type="flex" justify="space-around">
      <el-col :span="9" style="display: flex; align-items: center">
        <el-button
          type="primary"
          size="mini"
          @click="
            dialogVisible = true;
            dialogName = '创建分组';
            ruleForm.groupName = '';
          "
          >新建分组</el-button
        >
      </el-col>
      <el-col :span="12">
        <h4>该组用户</h4>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-around">
      <el-col :span="9">
        <div style="width: auto">
          <el-table
            :data="tableData"
            style="width: 100%"
            @current-change="handleCurrentChange"
          >
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column
              prop="name"
              label="组名"
              width="120"
            ></el-table-column>
            <el-table-column label="操作" width="auto">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="editGroup(scope.$index, scope.row)"
                  ><i class="el-icon-edit"></i>编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="removeGroup(scope.$index, scope.row)"
                  ><i class="el-icon-delete"></i>删除</el-button
                >
                <el-button
                  size="mini"
                  type="success"
                  @click="showGroupUser(scope.$index, scope.row)"
                  ><i class="el-icon-view"></i>查看用户</el-button
                >
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
        </div>
      </el-col>
      <el-col :span="12">
        <el-table :data="groupUsertableData" style="width: 90%">
          <el-table-column prop="id" label="ID" width="80"> </el-table-column>
          <el-table-column prop="username" label="用户名" width="120">
          </el-table-column>
          <el-table-column prop="email" label="邮箱" width="200">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="warning"
                @click="removeGroupUser(scope.$index, scope.row)"
                ><i class="el-icon-remove-outline"></i>移出分组</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          layout="prev, pager, next"
          :page-size="groupUserPage.pageSize"
          :total="groupUserPage.total"
          :current-page.sync="groupUserPage.currentPage"
          @current-change="groupUserCurrentChange"
          :hide-on-single-page="hidePage"
          style="text-align: right"
        >
        </el-pagination>
      </el-col>
    </el-row>

    <el-dialog :title="dialogName" :visible.sync="dialogVisible" width="35%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分组名称" prop="groupName">
          <el-input v-model="ruleForm.groupName"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="comfirmGroup" size="mini"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  name: "GroupManager",
  data() {
    var validateGroupName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入分组名称"));
      } else {
        request
          .get("/api/groups/" + value)
          .then(() => {
            callback(new Error("名称已存在"));
          })
          .catch(() => {
            callback();
          });
      }
    };

    return {
      tableData: [],
      currentRow: {},
      groupUsertableData: [],
      hidePage: true,
      groupUserPage: {
        total: 0,
        pageSize: 9,
        currentPage: 1,
      },
      ruleForm: {
        groupName: "",
      },
      rules: {
        groupName: [{ validator: validateGroupName, trigger: "blur" }],
      },
      total: 0,
      pageSize: 9,
      currentPage: 1,
      dialogVisible: false,
      dialogName: "创建分组",
    };
  },
  methods: {
    comfirmGroup() {
      console.log("confirm");
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          if (this.dialogName == "创建分组") {
            request
              .post("/api/groups?action=createGroup", {
                groupName: this.ruleForm.groupName,
              })
              .then(() => {
                this.$message({
                  message: "添加成功",
                  type: "success",
                });
                this.CurrentChange(Math.ceil((this.total + 1) / this.pageSize));
                this.dialogVisible = false;
              })
              .catch((response) => {
                console.log(response);
              });
          } else if (this.dialogName == "修改分组") {
            request
              .patch(
                "/api/groups/" + this.currentRow.name + "?action=editName",
                {
                  id: this.currentRow.id,
                  name: this.ruleForm.groupName,
                }
              )
              .then(() => {
                this.CurrentChange(this.currentPage);
                this, (this.dialogVisible = false);
              });
          }
        } else {
          console.log("error submit");
          return false;
        }
      });
    },
    editGroup(index, row) {
      console.log(index, row);
      this.dialogName = "修改分组";
      this.ruleForm.groupName = row.name;
      this.dialogVisible = true;
    },
    initData() {
      request
        .get("/api/groups?page=1&size=" + this.pageSize)
        .then((response) => {
          this.tableData = response.data.results;
          this.total = response.data.count;
          console.log(response);
        });
    },
    CurrentChange(page) {
      this.currentPage = page;
      request
        .get("api/groups?page=" + page + "&size=" + this.pageSize)
        .then((response) => {
          this.tableData = response.data.results;
          this.total = response.data.count;
        });
    },
    groupUserCurrentChange(page) {
      this.groupUserPage.currentPage = page;
      request
        .get(
          "/api/groups/" +
            this.currentRow.name +
            "?page=" +
            this.groupUserPage.currentPage +
            "&size=" +
            this.groupUserPage.pageSize
        )
        .then((response) => {
          this.groupUsertableData = response.data.results;
          this.groupUserPage.total = response.data.count;
        });
    },
    showGroupUser(index, row) {
      this.currentRow = row;
      console.log(this.currentRow);
      request
        .get(
          "/api/groups/" +
            this.currentRow.name +
            "?size=" +
            this.groupUserPage.pageSize
        )
        .then((response) => {
          this.groupUsertableData = response.data.results;
          this.groupUserPage.total = response.data.count;
        });
    },
    removeGroup(index, row) {
      console.log(row.name);
      request.delete("/api/groups/" + row.name).then(() => {
        this.CurrentChange(this.currentPage);
        this.$message({
          message: "删除成功",
          type: "success",
        });
      });
    },
    removeGroupUser(index, row) {
      console.log(index, row);
      request
        .patch("/api/groups/" + this.currentRow.name + "?action=editUser", {
          username: row.username,
        })
        .then(() => {
          this.groupUserCurrentChange(this.groupUserPage.currentPage);
          this.$message({
            message: "移出成功",
            type: "success",
          });
        });
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
  },
  mounted() {
    this.initData();
  },
};
</script>