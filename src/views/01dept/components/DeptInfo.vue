<template>
  <div>
    <el-form v-loading="loading" :model="formData" label-width="100px" :disabled="loading">
      <el-form-item label="部门名称">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>

      <el-form-item label="部门介绍">
        <el-input v-model="formData.description" type="textarea" :rows="3"></el-input>
      </el-form-item>

      <el-form-item label="显示次序">
        <el-input v-model="formData.order"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" icon="el-icon-check" @click="onSubmitAsync()">保 存</el-button>
  </div>
</template>

<script  lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import * as api from '@/api';
import * as models from '@/api/models';

@Component({})
export default class FormDeptEdit extends Vue {
  @Prop() id!: number;

  private loading = false;
  private formData: models.Department = {
    id: 0,
    name: '',
    description: '',
    order: 0,
    parentId: 0
  }

  mounted() {
    //
  }

  @Watch('id')
  async onIdChangeAsync(val: number, old: number) {
    if (val) {
      this.loading = true;
      const { data } = await api.GetDepartment({ id: val });
      this.formData = data!;
      this.loading = false;
    }
  }

  async onSubmitAsync() {
    const { data } = await api.PutDepartment({ id: this.id, value: this.formData });
    if (data) {
      this.$message.success('操作成功！');
    }
  }
}
</script>

<style scoped>
</style>
