<template>
  <el-container>
    <el-main>
      <h3>办事列表管理</h3>
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="onEditService('',false)">新增办事列表</el-button>
      <el-table v-loading="listLoading" :data="listData.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
        element-loading-text="正在加载..." border fit highlight-current-row>
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="序号" width="55" align="center">
          <template slot-scope="scope">
            {{ scope.$index }}
          </template>
        </el-table-column>
        <el-table-column label="标题" align="center" prop="title"></el-table-column>
        <el-table-column label="说明" align="center" prop="description"></el-table-column>
        <el-table-column label="类型" align="center" prop="type"></el-table-column>
        <el-table-column label="创建者" align="center" prop="creator"></el-table-column>
        <el-table-column label="图标" align="center" prop="icon"></el-table-column>
        <el-table-column label="部门" align="center" prop="department"></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createAt"></el-table-column>
        <el-table-column label="标签" align="center" prop="tags"></el-table-column>
        <el-table-column align="center">
          <template slot="header">
            <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
          </template>
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" size="mini" @click="onEditService(scope.row.id,true)">编辑</el-button>
              <el-button type="danger" size="mini" @click="onDeleteAsync(scope.row.id)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <br>
      <div style="text-align:center">
        <el-pagination background layout="prev, pager, next" :current-page.sync="page" :page-size="20" :total="total"
          align="center" />
      </div>
    </el-main>
  </el-container>
</template>

<script  lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import * as api from '@/api';
import * as models from '@/api/models';

/** 办事列表管理 */
@Component({})
export default class ServicetManaged extends Vue {
  listLoading: boolean = false;
  listData: models.Service[] = [];
  search = '';
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
    const { data, total } = await api.GetServiceList({ page, pageSize: 20 });
    console.log(data);
    this.listData = data!;
    this.total = total!;
    this.listLoading = false;
  }

  onEditService(id: number, type: boolean) {
    this.$router.push({
      name: 'Editservice',
      query: { id: `${id}`, isEdit: `${type}` }
    })
  }

  async onDeleteAsync(id: number) {
    this.$confirm('确定删除该办事列表信息？', '提示', {
      type: 'warning'
    }).then(async () => {
      const { data } = await api.DeleteService({ id })
      console.log('del', data);
      this.$message({
        type: 'success',
        message: '删除成功!'
      });
      this.listData = this.listData.filter((e: models.Service) => e.id !== id);
    }).catch(() => {
      //
    });
  }
}
</script>

<style scoped>
</style>
