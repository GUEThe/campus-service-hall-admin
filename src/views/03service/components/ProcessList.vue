<template>
  <div class="board-column">
    <div class="board-column-header">
      {{ headerText }}
    </div>
    <div class="board-column-content">
      <div v-for="(element,index) in listData" :key="index" class="board-item" @click="handleItemClick(element.id)">
        {{ element.name }}
        <el-button type="text" icon="el-icon-delete" @click="onDeleteAsync(element.id)">
        </el-button>
      </div>
      <p v-if="!listData.length">暂无数据，请添加流程</p>
    </div>
  </div>
</template>

<script  lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import * as api from '@/api';
import * as models from '@/api/models';

/** 流程列表组件 */
@Component({})
export default class ProcesstList extends Vue {
  @Prop({ default: 0 }) serviceId?: number;
  listLoading: boolean = false;
  listData: models.Process[] = [];
  search = '';
  headerText = '办事流程'
  editId = 0;
  showDialog = false;
  page = 1;
  total = 0;
  sortable = '';
  list: any[] = [];

  mounted() {
    this.getProcessAsync();
    this.$on('global:updateList', () => { this.getProcessAsync() });
  }

  @Watch('serviceId')
  onserviceIdChange(val: number) {
    if (val) {
      this.getProcessAsync();
    }
  }

  async getProcessAsync() {
    this.listLoading = true;
    if (this.serviceId) {
      const { data, total } = await api.GetProcessList({ serviceId: this.serviceId });
      console.log(data);
      this.listData = data!;
      this.list = data!.map((e: models.Process) => {
        return e.order;
      });
      this.total = total!;
      this.listLoading = false;
    }
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

  handleItemClick(id: number) {
    this.$emit('global:add-process');
    setTimeout(() => {
      this.$emit('global:get-process', id);
    }, 500);
  }
}
</script>

<style lang="scss" scoped>
.board-column {
  width: 200px;
  min-height: 100px;
  height: auto;
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 3px;
  .board-column-header {
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    padding: 0 20px;
    text-align: center;
    background: rgb(93, 195, 212);
    color: #fff;
    border-radius: 3px 3px 0 0;
  }
  .board-column-content {
    height: auto;
    overflow: hidden;
    border: 10px solid transparent;
    min-height: 60px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .board-item {
      cursor: pointer;
      width: 100%;
      height: 64px;
      margin: 5px 0;
      background-color: #fff;
      text-align: center;
      line-height: 54px;
      padding: 5px 10px;
      box-sizing: border-box;
      box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
