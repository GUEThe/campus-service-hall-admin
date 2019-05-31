<template>
  <el-container>
    <el-main>
      <h3>用户办事列表</h3>
      <el-table v-loading="listLoading" :data="listData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        element-loading-text="正在加载..." border fit highlight-current-row>
        <el-table-column label="id" width="55" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="showAuditDialog(scope.row)">{{ scope.row.name }}</el-button>
          </template>
        </el-table-column>

        <el-table-column label="办事项目" align="center" prop="serviceName" width="250"></el-table-column>

        <el-table-column label="所属部门" align="center" prop="department">
          <template slot-scope="scope">
            {{ scope.row.servcieDepartmentId | deptFilter }}
          </template>
        </el-table-column>

        <el-table-column label="类型" align="center" width="150">
          <template slot-scope="scope">
            {{ scope.row.type | serviceTypeFilter }}
          </template>
        </el-table-column>
        <el-table-column label="申请时间" align="center" prop="time" width="150">
          <template slot-scope="scope">
            {{ scope.row.time | parseTime }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="当前流程" align="center" prop="currentProcess"></el-table-column> -->

        <el-table-column label="当前部门" align="center" prop="department">
          <template slot-scope="scope">
            {{ scope.row.currentDepartment | deptFilter }}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status" width="150">
          <template slot-scope="scope">
            {{ scope.row.status | userServiceStatusFilter }}
          </template>
        </el-table-column>
      </el-table>
      <br>
      <div style="text-align:center">
        <el-pagination background layout="prev, pager, next" :current-page.sync="page" :page-size="20" :total="total"
          align="center" />
      </div>
    </el-main>
    <!-- <AuditDialog :id="editId" :feedback.sync="feedback" :showDialog.sync="showDialog" @audit="auditProcessAsync($event)" /> -->
  </el-container>
</template>

<script  lang="ts">

import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import * as api from '@/api';
import * as models from '@/api/models';
// import AuditDialog from './components/AuditDialog.vue';
import { parseTime } from '@/utils'

@Component({
  components: {
    // AuditDialog
  },
  filters: {
    parseTime
  }
})
export default class UserService extends Vue {
  listLoading: boolean = false;
  listData: models.UserServiceView[] = [];
  editData: any = {};
  search = '';
  editId = 0;
  feedback = '';
  showDialog = false;
  page = 1;
  total = 0;
  sortable = '';
  list: any[] = [];

  mounted() {
    this.loadData();
  }

  @Watch('page')
  async onPageChangeASync(val: number) {
    this.loadData(val);
  }

  async loadData(page: number = 1) {
    this.listLoading = true;
    const serviceId = this.$route.query.serviceId as string;
    const { data, total } = await api.GetUserServiceList({ page: page, pageSize: 20 });
    console.log(data);
    this.listData = data!;
    this.total = total!;
    this.listLoading = false;
  }
}
</script>

<style scoped>
</style>
