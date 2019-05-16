<template>
  <div class="board-column">
    <div class="board-column-header">
      {{ headerText }}
    </div>
    <div v-for="element in listData" :key="element.id" class="board-item">
      {{ element.name }} {{ element.id }}
    </div>
  </div>
</template>

<script  lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import * as api from '@/api';
import * as models from '@/api/models';
import Sortable from 'sortablejs';

/** 流程列表组件 */
@Component({})
export default class ProcesstList extends Vue {
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

<style lang="scss" scoped>
.board-column {
  min-width: 300px;
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
    background: #333;
    color: #fff;
    border-radius: 3px 3px 0 0;
  }
  .board-column-content {
    height: auto;
    overflow: hidden;
    border: 10px solid transparent;
    min-height: 60px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    .board-item {
      cursor: pointer;
      width: 100%;
      height: 64px;
      margin: 5px 0;
      background-color: #fff;
      text-align: left;
      line-height: 54px;
      padding: 5px 10px;
      box-sizing: border-box;
      box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
