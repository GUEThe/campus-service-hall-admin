<template>
  <div style="padding:5px">
    <el-row>
      <el-input v-model="searchDept" clearable placeholder="输入部门名称搜索" style="margin:20px 0;width:200px" />
      <el-button-group>
        <el-button type="button" icon="el-icon-search" size="mini" style="margin-left:10px;" @click="search()">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="onEditDept(0)">新增部门</el-button>
        <el-button type="success" :disabled="editId<1" icon="el-icon-edit" size="mini" @click="onEditDept(1)">编辑部门</el-button>
        <el-button type="warning" :disabled="editId<1" icon="el-icon-delete" size="mini" @click="onDeleteDeptAsync()">删除</el-button>
      </el-button-group>
    </el-row>
    <el-container>
      <el-aside width="400px">
        <el-tree ref="elTreeDept" v-loading="treeLoading" :data="deptTree" highlight-current node-key="key"
          :default-expanded-keys="['00']" :props="{label: 'name'}" check-on-click-node @current-change="OnTreeNodeCurrentChange">
          <span slot-scope="{node}">
            <span class="underline">
              <svg-icon name="folder" class="dept-folder" />
              {{ node.label }}
            </span>
          </span>
        </el-tree>
      </el-aside>
      <el-main>
        <el-tabs type="border-card">
          <el-tab-pane label="部门信息">
            <DeptInfo :id="editId" />
          </el-tab-pane>
          <el-tab-pane label="部门人员">部门人员</el-tab-pane>
          <el-tab-pane label="角色管理">角色管理</el-tab-pane>
          <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
    <DeptDialog :id="editId" :showDialog.sync="showDialog" :type="editType" @refresh="getDeptAsync()" />
  </div>
</template>

<script  lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import * as api from '@/api';
import * as models from '@/api/models';
import DeptDialog from './components/DeptDialog.vue';
import DeptInfo from './components/DeptInfo.vue';

/** 部门管理 */
@Component({
  components: {
    DeptDialog,
    DeptInfo
  }
})
export default class DeptManaged extends Vue {
  listLoading: boolean = false;
  listData: any = [{
    name: ''
  }];
  deptTree: models.Department[] = [];
  deptTreeBU: models.Department[] = [];
  searchDept = '';
  editId = 0;
  editType = 0;
  showDialog = false;
  treeLoading = false;

  mounted() {
    this.getDeptAsync();
  }

  @Watch('searchDept')
  onSearchDeptChange(val: string) {
    val && (this.deptTree = this.deptTreeBU.filter((e: models.Department) => e.name.includes(val)));
    !val && (this.deptTree = this.deptTreeBU);
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

  /** 树节点点击 */
  OnTreeNodeCurrentChange(e: any) {
    this.editId = e.id;
  }

  /** 编辑部门 */
  onEditDept(type: number) {
    this.editType = type;
    this.showDialog = true;
  }

  /** 搜索按钮点击 */
  search() {
    if (this.searchDept) {
      this.deptTree = this.deptTree.filter((e: models.Department) => e.name.includes(this.searchDept));
    }
  }

  /** 删除 */
  onDeleteDeptAsync() {
    this.$confirm('确定删除该部门？', '提示', {
      type: 'warning'
    }).then(async () => {
      const { data } = await api.DeleteDepartment({ id: this.editId });
      console.log('del', data);
      this.$message({
        type: 'success',
        message: '删除成功!'
      });
      this.deptTree = this.deptTree.filter((e: models.Department) => e.id !== this.editId);
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
