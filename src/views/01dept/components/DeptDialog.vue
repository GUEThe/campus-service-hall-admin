<template>
  <div>
    <el-dialog :title="dialogTitle" :visible="showDialog" @close="$emit('update:showDialog',false)">
      <el-form :model="formData" label-width="100px" :disabled="loading">
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
      <div slot="footer" class="dialog-footer">
        <el-button-group>
          <el-button type="button" icon="el-icon-close" @click="$emit('update:showDialog',false)">取消</el-button>
          <el-button type="primary" icon="el-icon-check" @click="onSubmitAsync()">提交</el-button>
        </el-button-group>
      </div>
    </el-dialog>
  </div>
</template>

<script  lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import * as api from '@/api';
import * as models from '@/api/models';

@Component({})
export default class DialogDeptEdit extends Vue {
  @Prop() showDialog!: boolean;
  @Prop() type!: number;
  @Prop() id!: number;

  private dialogTitle: string = '';

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

  @Watch('showDialog')
  async onshowDialogChangeAsync(val: boolean, old: boolean) {
    if (this.type) {
      this.dialogTitle = '编辑部门信息';
      const { data } = await api.GetDepartment({ id: this.id });
      this.formData = data!;
    } else {
      this.dialogTitle = '增加部门';
    }
    if (!val) {
      this.formData = {
        id: 0,
        name: '',
        description: '',
        order: 0,
        parentId: 0
      }
    }
  }

  async onSubmitAsync() {
    const { data } = this.type ? await api.PutDepartment({ id: this.id, value: this.formData }) : await api.PostDepartment({ value: this.formData });
    if (data) {
      this.$message.success('操作成功！');
      this.$emit('refresh');
      this.$emit('update:showDialog', false);
    }
  }
}
</script>

<style scoped>
</style>
