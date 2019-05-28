<template>
  <el-container>
    <el-main>
      <h3>问题列表</h3>
      <div class="filter-container">
        <el-select v-model="status" clearable @change="getQuestionAsync(1,'',status)">
          <el-option :value="-1" label="点击筛选回复状态" disabled></el-option>
          <el-option :value="0" label="未回复"></el-option>
          <el-option :value="1" label="已回复"></el-option>
        </el-select>
        &nbsp;
        <el-input v-model="search" placeholder="标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        &nbsp;
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getQuestionAsync(1,search)">搜索</el-button>
      </div>
      <br>
      <el-table v-loading="listLoading" :data="listData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        element-loading-text="正在加载..." border fit highlight-current-row>
        <el-table-column label="id" width="55" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="留言咨询标题" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="showReplayDialog(scope.row)">{{ scope.row.title }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="用户名" align="center" prop="name"></el-table-column>
        <el-table-column label="联系电话" align="center" prop="phone"></el-table-column>
        <el-table-column label="咨询项目" align="center" prop="serviceName"></el-table-column>
        <el-table-column label="留言时间" align="center" prop="time" width="150">
          <template slot-scope="scope">
            {{ scope.row.time | parseTime }}
          </template>
        </el-table-column>
        <el-table-column label="答复状态" align="center" prop="status" width="150">
          <template slot-scope="scope">
            {{ scope.row.status | answerFilter }}
          </template>
        </el-table-column>
      </el-table>
      <br>
      <div style="text-align:center">
        <el-pagination background layout="prev, pager, next" :current-page.sync="page" :page-size="20" :total="total"
          align="center" />
      </div>
    </el-main>
    <ReplayDialog :id="editId" :showDialog.sync="showDialog" @reflash="getQuestionAsync()" />
  </el-container>
</template>

<script  lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import * as api from '@/api';
import * as models from '@/api/models';
import ReplayDialog from './components/ReplayDialog.vue';
import { parseTime } from '@/utils'
/** 流程管理 */
@Component({
  components: {
    ReplayDialog
  },
  filters: {
    answerFilter(val: number) {
      return val ? '已答复' : '未答复';
    },
    parseTime
  }
})
export default class Questions extends Vue {
  listLoading: boolean = false;
  listData: models.QuestionView[] = [];
  search = '';
  editId = 0;
  status = -1;
  showDialog = false;
  page = 1;
  total = 0;
  list: any[] = [];
  mounted() {
    this.getQuestionAsync();
  }

  @Watch('page')
  async onPageChangeASync(val: number) {
    this.getQuestionAsync(val, this.search, this.status);
  }

  async getQuestionAsync(page: number = 1, name?: string, status?: number) {
    this.listLoading = true;
    const serviceId = this.$route.query.serviceId as string;
    const { data, total } = await api.GetQuestionList({ page: page, pageSize: 20, name: name, status: status });
    console.log(data);
    this.listData = data!;
    this.total = total!;
    this.listLoading = false;
  }
  showReplayDialog(row: any) {
    this.showDialog = true;
    this.editId = row.id;
  }
}
</script>

<style scoped>
</style>
