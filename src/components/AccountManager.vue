<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="id" label="ID" width="80"> </el-table-column>
      <el-table-column prop="username" label="用户名" width="120">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="220"> </el-table-column>
      <el-table-column prop="last_login" label="上次登录时间" width="160">
      </el-table-column>
      <el-table-column prop="date_joined" label="账号创建时间" width="160">
      </el-table-column>
      <el-table-column
        prop="is_active"
        label="是否激活"
        width="100"
        :formatter="formatBoolean"
      >
      </el-table-column>
      <el-table-column
        prop="groups"
        label="所属分组"
        :formatter="formatterGroup"
      >
      </el-table-column>

      <el-table-column label="操作">
        <template slot="header">
          <el-button size="mini" type="primary" @click="addGroupBtn"
            >添加至分组</el-button
          >
        </template>
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.is_active"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            ><i class="el-icon-warning"></i>&nbsp;停用</el-button
          >
          <el-button
            v-else
            type="success"
            size="mini"
            @click="handleActive(scope.$index, scope.row)"
            >激活</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="total"
        :current-page="currentPage"
        @current-change="current_change"
        style="text-align: right"
      >
      </el-pagination>
    </div>

    <el-dialog title="分组信息" :visible.sync="dialogVisible" width="30%">
      <el-row type="flex" justify="center">
        <el-col :span="19">
          <el-table :data="groupData" tooltip-effect="dark" style="width: 100%" @selection-change="handleGroupSelectionChange">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="ID" prop="id" width="100">
            </el-table-column>
            <el-table-column prop="name" label="分组名称"> </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-pagination
            small
            layout="prev, pager, next"
            :page-size="groupDataPage.pageSize"
            :total="groupDataPage.total"
            :current-page.sync="groupDataPage.currentPage"
            @current-change="GroupData_current_change"
            style="text-align: right"
          >
          </el-pagination>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="addPersionGroup" size="mini"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "AccountManager",
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 9,
      currentPage: 1,
      multipleSelection: [],
      multipleGroupSelection: [],
      dialogVisible: false,
      groupData: [],
      groupDataPage: {
        total: 0,
        pageSize: 6,
        currentPage: 1,
      },
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    formatBoolean(row, column, cellValue) {
      return cellValue ? "是" : "否";
    },
    formatterGroup(row, column, cellValue) {
      if (cellValue.length == 0) {
          return "无";
      } else {
          let rtval = []
          cellValue.forEach(function (item) {
              rtval.push(item.name)
          })
        return rtval.join()  
      }
      
    },
    current_change(page) {
        this.currentPage = page
      request
        .get("api/users?page=" + page + "&size=" + this.pageSize)
        .then((response) => {
          this.tableData = response.data.results;
          this.total = response.data.count;
        });
    },

    GroupData_current_change(page) {
      request
        .get("api/groups?page=" + page + "&size=" + this.groupDataPage.pageSize)
        .then((response) => {
          this.groupData = response.data.results;
          this.groupDataPage.total = response.data.count;
        });
    },
    handleActive(index, row) {
      request
        .patch("api/users/" + row.username, row)
        .then(() => {
          row.is_active = true;
          this.$message({
            message: "激活成功",
            type: "success",
          });
        })
        .catch((response) => {
          console.log(response.data);
        });
    },
    handleDelete(index, row) {
      request
        .delete("api/users/" + row.username)
        .then(() => {
          this.$message({
            message: "停用成功",
            type: "success",
          });
          row.is_active = false;
        })
        .catch((response) => {
          console.log(response.data);
        });
    },
    addGroupBtn() {
      if (this.multipleSelection.length == 0) {
        this.$alert("未选中用户", "添加错误", {
          confirmButtonText: "确定",
          type: "warning",
        });
      } else {
        this.dialogVisible = true;
        request
          .get("/api/groups?page=1&size=" + this.groupDataPage.pageSize)
          .then((response) => {
            this.groupData = response.data.results;
            this.groupDataPage.total = response.data.count;
            console.log(this.groupData);
          });
      }
    },
    handleGroupSelectionChange(val) {
        this.multipleGroupSelection =  val
    },
    addPersionGroup() {
        request.post('/api/groups?action=addpersion', {'users': this.multipleSelection, 'groups': this.multipleGroupSelection}).then(() => {
            console.log(this.currentPage)
            this.current_change(this.currentPage)
        })
        this.dialogVisible = false
    }
  },
  mounted() {
    request.get("api/users?page=1&size=" + this.pageSize).then((response) => {
      this.tableData = response.data.results;
      console.log(this.tableData);
      this.total = response.data.count;
    });
  },
};
</script>