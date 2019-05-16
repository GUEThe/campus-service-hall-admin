<template>
  <div>
    <el-select v-model="selectItem" placeholder="请选择" @change="handleSelectChange">
      <el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import * as api from '@/api';
import * as models from '@/api/models';

/** 办事详情编辑 */
@Component({})
export default class DeptSelect extends Vue {
  @Prop() deptId!: number;

  deptList: models.Department[] = [];
  selectItem = 0;
  mounted() {
    this.getDeptAsync();
  }

  /** 获取所有部门 */
  async getDeptAsync() {
    const { data } = await api.GetDepartmentList();
    console.log('dadada', data!);
    this.deptList = data!;
  }

  handleSelectChange() {
    this.$emit('updated:deptId', this.selectItem);
  }
}
</script>

<style>
</style>
