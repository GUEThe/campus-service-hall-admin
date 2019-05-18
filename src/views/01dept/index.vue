<template>
  <div style="padding:5px">
    <h3>部门管理</h3>
    <el-button type="primary" icon="el-icon-plus" size="mini" @click="onEditDept(0)">新增部门</el-button>
    <el-table v-loading="listLoading" :data="deptTree.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      element-loading-text="正在加载..." border fit highlight-current-row>
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column label="序号" width="55" align="center">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="部门名称" align="center" prop="name"></el-table-column>
      <el-table-column label="描述" align="center" prop="description"></el-table-column>
      <el-table-column label="上级部门id" align="center" prop="parentId"></el-table-column>
      <el-table-column label="次序" align="center" prop="order"></el-table-column>
      <el-table-column label="部门电话" align="center" prop="phone"></el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
        </template>
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" size="mini" @click="onEditDept(scope.row.id,1)">编辑</el-button>
            <el-button type="danger" size="mini" @click="onDeleteDeptAsync(scope.row.id)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <DeptDialog :id="editId" :showDialog.sync="showDialog" :type="editType" @refresh="getDeptAsync()" />
  </div>
</template>

<script  lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import * as api from '@/api';
import * as models from '@/api/models';
import DeptDialog from './components/DeptDialog.vue';
/** 部门管理 */
@Component({
  components: {
    DeptDialog
  }
})
export default class DeptManaged extends Vue {
  listLoading: boolean = false;
  listData: any = [{
    name: ''
  }];
  deptTree: models.Department[] = [];
  deptTreeBU: models.Department[] = [];
  search = '';
  editId = 0;
  editType = 0;
  showDialog = false;
  treeLoading = false;

  mounted() {
    this.getDeptAsync();
  }

  /** 获取所有部门 */
  async getDeptAsync() {
    this.treeLoading = true;
    const { data } = await api.GetDepartmentList();
    console.log('dadada', data!);
    this.deptTree = data!;
    this.deptTreeBU = data!;
    this.treeLoading = false;
  }

  /** 编辑部门 */
  onEditDept(id: number, type: number) {
    this.editId = id;
    this.editType = type;
    this.showDialog = true;
  }

  /** 删除 */
  onDeleteDeptAsync(id: number) {
    this.$confirm('确定删除该部门？', '提示', {
      type: 'warning'
    }).then(async () => {
      const { data } = await api.DeleteDepartment({ id });
      console.log('del', data);
      this.$message({
        type: 'success',
        message: '删除成功!'
      });
      this.deptTree = this.deptTree.filter((e: models.Department) => e.id !== id);
    }).catch(() => {
      //
    });
  }
}
</script>

<style scoped>
.underline {
  text-decoration: underline;
}
.dept-folder {
  font-size: 18px;
  color: rgb(223, 236, 104);
}
</style>
