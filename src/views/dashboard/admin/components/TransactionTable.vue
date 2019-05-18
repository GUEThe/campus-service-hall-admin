<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="业务名称" min-width="200">
      <template slot-scope="scope">
        {{ scope.row.service }}
      </template>
    </el-table-column>

    <el-table-column label="办理进度" width="100" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { transactionList } from '@/api/remote-search'

@Component({
  filters: {
    statusFilter: (status: string) => {
      const statusMap: { [key: string]: string } = {
        已完成: 'success',
        办理中: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter: (str: string) => str.substring(0, 30),
    // Input 10000 => Output "10,000"
    toThousandFilter: (num: number) => {
      return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
    }
  }
})
export default class TransactionTable extends Vue {
  private list = [
    { service: '陈晓明打印英文成绩单', status: '已完成' },
    { service: '陈晓明打印英文成绩单', status: '已完成' },
    { service: '陈晓明打印英文成绩单', status: '办理中' },
    { service: '陈晓明打印英文成绩单', status: '已完成' },
    { service: '陈晓明打印英文成绩单', status: '已完成' },
    { service: '张三请假五天', status: '办理中' }]

  created() {
    this.fetchData()
  }

  private fetchData() {
    // this.list.push(, 'success')
    // transactionList({}).then(response => {
    //   this.list = response.data.items.slice(0, 8)
    // })
  }
}
</script>
