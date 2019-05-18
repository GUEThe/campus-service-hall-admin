<template>
  <div>
    <el-dialog title="问题详情" :visible="showDialog" @close="$emit('update:showDialog',false)">
      <el-form :model="formData" label-width="100px" :disabled="loading" class="demo-table-expand">
        <el-form-item label="标题">
          <span> {{ formData.title }}</span>
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="formData.content" type="textarea" :rows="3" readonly></el-input>
        </el-form-item>
        <el-form-item label="提问时间">
          {{ formData.time | parseTime }}
        </el-form-item>
        <el-form-item label="回复内容">
          <el-input v-model="formData.replyContent" type="textarea" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button-group>
          <el-button type="button" icon="el-icon-close" @click="$emit('update:showDialog',false)">取消</el-button>
          <el-button type="primary" @click="replayAsync()">回复</el-button>
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
export default class QuestionDialog extends Vue {
  @Prop() showDialog!: boolean;
  @Prop() type!: number;
  @Prop() id!: number;

  private dialogTitle: string = '';
  private loading = false;
  private formData: models.Question = {
    id: 0,
    userId: 0,
    title: '',
    serviceId: 0,
    content: '',
    name: '',
    phone: '',
    mail: '',
    time: 0,
    replyContent: '',
    replyUserId: 0,
    relpyTime: 0,
    status: 0
  }

  mounted() {
    //
  }

  @Watch('showDialog')
  async onshowDialogChangeAsync(val: boolean, old: boolean) {
    if (val) {
      const { data } = await api.GetQuestion({ id: this.id });
      this.formData = data!;
    } else {
      this.formData = {
        id: 0,
        userId: 0,
        title: '',
        serviceId: 0,
        content: '',
        name: '',
        phone: '',
        mail: '',
        time: 0,
        replyContent: '',
        replyUserId: 0,
        relpyTime: 0,
        status: 0
      }
    }
  }
  async replayAsync(type: number) {
    this.$emit('update:showDialog', false);
    const { data } = await api.PutQuestion({ id: this.formData.id, value: this.formData });
    if (data) {
      this.$message.success('操作成功');
      this.$emit('reflash')
    }
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
