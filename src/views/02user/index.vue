<template>
  <el-container>
    <el-main>
      <!-- <el-button type="primary" icon="el-icon-plus" size="mini" @click="onEditUser(0)">新增用户</el-button>
      <el-input v-model="search" size="mini" placeholder="输入关键字搜索" /> -->

      <div class="filter-container">
        <el-input v-model="search" placeholder="名字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="onEditUser(0)">新增</el-button>
      </div>
      <el-table v-loading="listLoading" :data="listData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        element-loading-text="正在加载..." border fit highlight-current-row>
        <el-table-column label="序号" width="55" align="center">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="用户昵称" align="center" prop="name"></el-table-column>
        <el-table-column label="登录名" align="center" prop="username"></el-table-column>
        <el-table-column label="密码" align="center" prop="password"></el-table-column>
        <el-table-column label="用户编号" align="center" prop="identify"></el-table-column>
        <el-table-column label="邮箱" align="center" prop="mail"></el-table-column>
        <el-table-column label="电话" align="center" prop="phone"></el-table-column>
        <el-table-column label="角色" align="center" prop="role"></el-table-column>
        <el-table-column label="部门" align="center" prop="departmentId">
          <template slot-scope="scope">
            <span>{{ scope.row.departmentId|DeptFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column width="300px" align="center">
          <template slot="header">
            操作
          </template>
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="onEditUser(scope.row.id,1)">编辑</el-button>
            <el-button type="danger" size="mini" @click="onDeleteAsync(scope.row.id)">删除</el-button>
            <el-button type="warning" size="mini" @click="onEditUser(scope.row.id,1)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <br>
      <div style="text-align:center">
        <el-pagination background layout="prev, pager, next" :current-page.sync="page" :page-size="20" :total="total"
          align="center" />
      </div>
    </el-main>
    <UserDialog :id="editId" :showDialog.sync="showDialog" :type="editType" @refresh="getPayAsync()" />
  </el-container>
</template>

<script  lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import * as api from '@/api';
import * as models from '@/api/models';
import UserDialog from './components/UserDialog.vue';
import { DeptFilter } from '@/filters'
/** 用户管理 */
@Component({
  components: {
    UserDialog
  },
  filters: { DeptFilter }
})
export default class UsertManaged extends Vue {
  listLoading: boolean = false;
  listData: models.User[] = [];
  search = '';
  editId = 0;
  editType = 0;
  showDialog = false;
  page = 1;
  total = 0;
  mounted() {
    this.getPayAsync();
  }

  @Watch('page')
  async onPageChangeASync(val: number) {
    this.getPayAsync(val);
  }

  async getPayAsync(page: number = 1) {
    this.listLoading = true;
    const { data, total } = await api.GetUserList({ page, pageSize: 20 });
    console.log(data);
    this.listData = data!;
    this.total = total!;
    this.listLoading = false;
  }

  onEditUser(id: number = 0, type: number) {
    this.editId = id;
    this.editType = type;
    this.showDialog = true;
  }

  async onDeleteAsync(id: number) {
    this.$confirm('确定删除该用户信息？', '提示', {
      type: 'warning'
    }).then(async () => {
      const { data } = await api.DeleteUser({ id })
      console.log('del', data);
      this.$message({
        type: 'success',
        message: '删除成功!'
      });
      this.listData = this.listData.filter((e: models.User) => e.id !== id);
    }).catch(() => {
      //
    });
  }
}
</script>

<style scoped>
</style>
