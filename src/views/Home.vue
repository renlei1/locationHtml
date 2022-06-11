<template>
  <el-container>
    <el-aside
      width="auto"
      style="background-color: rgb(238, 241, 246); height: 100vh"
    >
      <el-menu
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelect"
        :collapse="isCollapse"
        :router="true"
      >
        <el-submenu v-for="menu in menus" :key="menu.name" :index="menu.path">
          <template slot="title">
            <i :class="menu.icon"></i>
            <span>{{ menu.name }}</span>
          </template>
          <el-menu-item
            v-for="submenu in menu.child"
            :key="submenu.name"
            :index="submenu.path"
            >{{ submenu.name }}</el-menu-item
          >
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="collapse-btn" @click="handleCollapse">
          <i
            v-bind:class="{
              'el-icon-s-unfold': isCollapse,
              'el-icon-s-fold': !isCollapse,
            }"
            style="font-size: 24px"
          ></i>
        </div>
        <el-col :span="20">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in breadcrumb" :key="item.index">{{
              item
            }}</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
        <el-col :span="2" :offset="4">
          <el-dropdown @command="handleCommand">
            <div class="user-btn">
              <span class="el-dropdown-link">
                <i class="el-icon-s-custom"></i>&nbsp;&nbsp;{{
                  this.$store.state.username
                }}
              </span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="personcen"
                ><i class="el-icon-s-custom"></i>个人中心</el-dropdown-item
              >
              <el-dropdown-item
                ><i class="el-icon-s-tools"></i>设置</el-dropdown-item
              >
              <el-dropdown-item command="logout" divided
                ><i class="el-icon-s-promotion"></i>退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-header>
      <el-main >
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {},
  data() {
    return {
      isCollapse: false,
      indexBreadcrumbs: [],
      menus: [

 {
          name: "锥桶数据管理",
          icon: "el-icon-coin",
          path: "#2",
          child: [
            {
              name: "锥桶库管理",
              path: "/ConesList",
            },
             {
              name: "添加锥桶",
              path: "/ConesAdd",
            },
          ],
        },


        {
          name: "交通锥桶调度",
          icon: "el-icon-s-data",
          path: "#1",
          child: [
            {
              name: "所有调度信息",
              path: "/DispatchList",
            },
           
             {
              name: "锥桶位置展示",
              path: "/LocationShow",
              
            },
           
          ],
        },
       

{
          name: "预警信息处理",
          icon: "el-icon-user",
          path: "#3",
          child: [
            {
              name: "预警信息",
              path: "/WarningInfo",
            },
            {
              name: "添加预警信息",
              path: "/AccountManager",
            },
          ],
        },

        {
          name: "锥桶管理人员",
          icon: "el-icon-user",
          path: "#4",
          child: [
            {
              name: "分组管理",
              path: "/GroupManager",
            },
            {
              name: "用户管理",
              path: "/AccountManager",
            },
          ],
        },

 {
          name: "账号设置",
          icon: "el-icon-user",
          path: "#5",
          child: [
            {
              name: "分组管理",
              path: "/GroupManager",
            },
            {
              name: "用户管理",
              path: "/AccountManager",
            },
          ],
        },

      ],
    };
  },
  methods: {
    handleOpen() {
      console.log("open");
    },
    handleClose() {
      console.log("close");
    },
    handleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    handleCommand(command) {
      console.log(command);
      if (command === "logout") {
        this.$store.commit("removeUserInfo");
        this.$router.push({ name: "Login" });
      } else if (command === "personcen") {
        this.breadcrumb.splice(0, 10, "个人中心");
        this.$router.push({ name: "PersonalCenter" });
      }
    },
    handleSelect(index, indexPath) {
      this.indexBreadcrumbs = indexPath;
    },
  },
  computed: {
    breadcrumb() {
      let breadcrumbs = [];
      let menuList = this.menus;
      this.indexBreadcrumbs.map((item) => {
        for (let i = 0; i < menuList.length; i++) {
          if (item === menuList[i].path) {
            breadcrumbs.push(menuList[i].name);
            if (menuList[i].child) {
              menuList = menuList[i].child;
            }
            break;
          }
        }
      });
      return breadcrumbs;
    },
  },
};
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
.collapse-btn {
  height: 100%;
  width: 60px;
  align-items: center;
  justify-content: center;
  display: inline-flex;
  margin-right: 12px;
}
.collapse-btn:hover {
  cursor: pointer;
  background-color: rgb(245, 244, 247);
}

.el-header {
  padding-left: 0;
  display: flex;
  align-items: center;
}
.user-btn {
  box-sizing: border-box;
  line-height: 60px;
  width: 75px;
  text-align: center;
}
.user-btn:hover {
  cursor: pointer;
  background-color: rgb(245, 244, 247);
}
</style>
