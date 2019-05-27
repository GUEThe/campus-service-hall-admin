<template>
  <el-container>
    <el-main>
      <h3>办事流程处理</h3>
      <el-table v-loading="listLoading" :data="listData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        element-loading-text="正在加载..." border fit highlight-current-row>
        <el-table-column label="id" width="55" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="showAuditDialog(scope.row)">{{ scope.row.name }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="用户名" align="center" prop="userName"></el-table-column>
        <el-table-column label="办事项目" align="center" prop="serviceTitle" width="250"></el-table-column>
        <el-table-column label="申请时间" align="center" prop="time" width="150">
          <template slot-scope="scope">
            {{ scope.row.time | parseTime }}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status" width="150">
          <template slot-scope="scope">
            {{ scope.row.status | stateFilter }}
          </template>
        </el-table-column>
      </el-table>
      <br>
      <div style="text-align:center">
        <el-pagination background layout="prev, pager, next" :current-page.sync="page" :page-size="20" :total="total"
          align="center" />
      </div>
    </el-main>
    <AuditDialog :id="editId" :feedback.sync="feedback" :showDialog.sync="showDialog" @audit="auditProcessAsync($event)" />
  </el-container>
</template>

<script  lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import * as api from '@/api';
import * as models from '@/api/models';
import AuditDialog from './components/AuditDialog.vue';
import { parseTime } from '@/utils'
/** 流程管理 */
@Component({
  components: {
    AuditDialog
  },
  filters: {

    parseTime
  }
})
export default class UserProcessAudit extends Vue {
  listLoading: boolean = false;
  listData: models.UserProcessView[] = [];
  editData: any = {};
  search = '';
  editId = 0;
  feedback = '';
  showDialog = false;
  page = 1;
  total = 0;
  sortable = '';
  list: any[] = [];
  newList = [];
  oldList = [];
  mounted() {
    this.getUserProcessAsync();
  }

  @Watch('page')
  async onPageChangeASync(val: number) {
    this.getUserProcessAsync(val);
  }

  async getUserProcessAsync(page: number = 1) {
    this.listLoading = true;
    const serviceId = this.$route.query.serviceId as string;
    const { data, total } = await api.GetUserProcessViewList({ page: page, pageSize: 20 });
    console.log(data);
    this.listData = data!;
    this.total = total!;
    this.listLoading = false;
  }
  async auditProcessAsync(audit: number) {
    this.editData.status = audit;
    this.editData.feedback = this.feedback;
    const { data } = await api.PutUserProcess({ id: this.editData.id, value: this.editData });
    if (data) {
      this.$message.success('操作成功');
    }
  }
  showAuditDialog(row: any) {
    this.showDialog = true;
    this.editId = row.id;
    this.feedback = row.feedback;
    this.editData = row;
  }
}
</script>

<style scoped>
</style>
