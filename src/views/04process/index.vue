<template>
  <el-container>
    <el-main>
      <h3>流程管理</h3>
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="onEditProcess('',false)">新增流程</el-button>
      <el-table ref="dragTable" v-loading="listLoading" :data="listData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        element-loading-text="正在加载..." border fit highlight-current-row>
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="序号" width="55" align="center">
          <template slot-scope="scope">
            {{ scope.$index }}
          </template>
        </el-table-column>
        <el-table-column label="服务id" align="center" prop="serviceId"></el-table-column>
        <el-table-column label="名称" align="center" prop="name"></el-table-column>
        <el-table-column label="说明" align="center" prop="description"></el-table-column>
        <el-table-column label="附件" align="center" prop="fileTemplate"></el-table-column>
        <el-table-column label="次序" align="center" prop="order"></el-table-column>
        <el-table-column label="类型" align="center" prop="type"></el-table-column>
        <el-table-column label="创建者" align="center" prop="creator"></el-table-column>
        <el-table-column label="创建时间" align="center" prop="time"></el-table-column>
        <el-table-column label="部门id" align="center" prop="departmentId"></el-table-column>
        <el-table-column align="center">
          <template slot="header">
            <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
          </template>
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" size="mini" @click="onEditProcess(scope.row.id,true)">编辑</el-button>
              <el-button type="danger" size="mini" @click="onDeleteAsync(scope.row.id)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <br>
      <!-- <div style="text-align:center">
        <el-pagination background layout="prev, pager, next" :current-page.sync="page" :page-size="20" :total="total"
          align="center" />
      </div> -->
      排序 {{ list }}
    </el-main>
  </el-container>
</template>

<script  lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import * as api from '@/api';
import * as models from '@/api/models';
import Sortable from 'sortablejs';

/** 流程管理 */
@Component({})
export default class ProcesstManaged extends Vue {
  listLoading: boolean = false;
  listData: models.Process[] = [];
  search = '';
  editId = 0;
  showDialog = false;
  page = 1;
  total = 0;
  sortable = '';
  list: any[] = [];
  newList = [];
  oldList = [];
  mounted() {
    this.getProcessAsync();
    this.$nextTick(() => {
      this.setSort();
    })
  }

  setSort() {
    const el = (this.$refs.dragTable as any).$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
    this.sortable = Sortable.create(el, {
      ghostClass: 'sortable-ghost',
      setData: function (dataTransfer: any) {
        dataTransfer.setData('Text', '');
      },
      onEnd: (evt: any) => {
        const targetRow = this.list.splice(evt.oldIndex, 1)[0];
        this.list.splice(evt.newIndex, 0, targetRow);
      }
    })
  }

  async getProcessAsync() {
    this.listLoading = true;
    const serviceId = this.$route.query.serviceId as string;
    const { data, total } = await api.GetProcessList({ serviceId: parseInt(serviceId, 10) });
    console.log(data);
    this.listData = data!;
    this.list = data!.map((e: models.Process) => {
      return e.order;
    });
    this.total = total!;
    this.listLoading = false;
  }

  onEditProcess(id: number, type: boolean) {
    this.$router.push({
      name: 'Editprocess',
      query: { id: `${id}`, isEdit: `${type}` }
    })
  }

  async onDeleteAsync(id: number) {
    this.$confirm('确定删除该流程信息？', '提示', {
      type: 'warning'
    }).then(async () => {
      const { data } = await api.DeleteProcess({ id })
      console.log('del', data);
      this.$message({
        type: 'success',
        message: '删除成功!'
      });
      this.listData = this.listData.filter((e: models.Process) => e.id !== id);
    }).catch(() => {
      //
    });
  }
}
</script>

<style scoped>
</style>
