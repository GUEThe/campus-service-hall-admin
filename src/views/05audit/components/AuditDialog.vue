<template>
  <div>
    <el-dialog title="流程详情" :visible="showDialog" @close="$emit('update:showDialog',false)">
      <el-form :model="formData" label-width="100px" :disabled="loading" class="demo-table-expand">
        <el-form-item label="名称">
          <span> {{ formData.name }}</span>
        </el-form-item>
        <el-form-item label="事件名">
          <span> {{ formData.serviceName }}</span>
        </el-form-item>
        <el-form-item label="描述">
          <div style="width:50%">
            <div v-html="formData.description">
            </div>
          </div>
        </el-form-item>
        <el-form-item label="附件">
          {{ formData.fileGUID }}
        </el-form-item>
        <el-form-item label="排列顺序">
          {{ formData.order }}
        </el-form-item>
        <el-form-item label="部门名称">
          {{ formData.departmentName }}
        </el-form-item>
        <el-form-item label="文件名称">
          {{ formData.fileName }}
        </el-form-item>
        <el-form-item label="回执">
          <el-input v-model="myFeedBack" type="textarea" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button-group>
          <el-button type="button" icon="el-icon-close" @click="$emit('update:showDialog',false)">取消</el-button>
          <el-button type="primary" @click="audit(1)">审核通过</el-button>
          <el-button type="danger" @click="audit(0)">审核不通过</el-button>
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
export default class UserProcessDialog extends Vue {
  @Prop() showDialog!: boolean;
  @Prop() type!: number;
  @Prop() feedback!: string;
  @Prop() id!: number;

  private dialogTitle: string = '';
  private myFeedBack: string = '';
  private loading = false;
  private formData: models.ProcessView = {
    id: 0,
    name: '',
    serviceId: 0,
    serviceName: '',
    description: '',
    fileGUID: '',
    order: 0,
    type: 0,
    creator: 0,
    time: 0,
    departmentId: 0,
    departmentName: '',
    fileName: ''
  }

  mounted() {
    //
  }

  @Watch('showDialog')
  async onshowDialogChangeAsync(val: boolean, old: boolean) {
    if (val) {
      this.myFeedBack = this.feedback;
      const { data } = await api.GetUserProcessView({ id: this.id });
      this.formData = data!;
    } else {
      this.formData = {
        id: 0,
        name: '',
        serviceId: 0,
        serviceName: '',
        description: '',
        fileGUID: '',
        order: 0,
        type: 0,
        creator: 0,
        time: 0,
        departmentId: 0,
        departmentName: '',
        fileName: ''
      }
    }
  }
  audit(type: number) {
    this.$emit('update:showDialog', false);
    this.$emit('update:feedback', this.myFeedBack);
    this.$emit('audit', type);
  }
}
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
