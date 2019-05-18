<template>
  <div>
    <el-dialog title="办事流程详情" :visible="showDialog" @close="$emit('update:showDialog',false)">
      <el-form :model="formData" label-width="100px" :disabled="loading" class="demo-table-expand">
        <el-form-item label="用户名">
          <span> {{ formData.userName }}</span>
        </el-form-item>
        <el-form-item label="名称">
          <span> {{ formData.name }}</span>
        </el-form-item>
        <el-form-item label="办事项目">
          <span> {{ formData.serviceName }}</span>
        </el-form-item>
        <el-form-item label="情况说明">
          <div style="border:1px solid #eee">
            <div v-html="formData.description">
            </div>
          </div>
        </el-form-item>
        <el-form-item label="附件">
          {{ formData.fileName }} {{ formData.fileGUID }}
        </el-form-item>

        <el-form-item label="审核部门">
          {{ formData.departmentName }}
        </el-form-item>
        <el-form-item label="办理时间">
          {{ formData.time | parseTime }}
        </el-form-item>
        <el-form-item label="反馈意见">
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
import { parseTime } from '@/utils'
@Component({
  filters: { parseTime }
})
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
  width: 80%;
}
</style>
