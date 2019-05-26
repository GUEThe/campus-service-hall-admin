<template>
  <div>
    <el-dialog title="查看事项" :visible="showDialog" @close="$emit('update:showDialog',false)">
      <el-form ref="formData" :model="formData" class="form-container" label-width="100px">
        <div class="createPost-main-container">
          <el-form-item prop="title" label="事项名称">
            {{ formData.title }}
          </el-form-item>
          <el-form-item label="描述">
            <div style="border:1px solid #eee" v-html="formData.description"></div>
          </el-form-item>
        </div>
      </el-form>
      <el-divider content-position="left">流程:</el-divider>
      <span v-if="listData.length===0">暂无流程</span>
      <div class="step">
        <el-steps direction="vertical" :active="listData.length">
          <el-step v-for="(item) in listData" :key="item.id" :title="item.name">
            <template slot="description">
              <div v-html="item.description"></div>
            </template>
          </el-step>
        </el-steps>
      </div>
    </el-dialog>
  </div>
</template>

<script  lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import * as api from '@/api';
import * as models from '@/api/models';

@Component
export default class UserDialog extends Vue {
  @Prop() showDialog!: boolean;
  @Prop() serviceId!: number;

  listLoading = false;
  listData: models.ProcessView[] = [];
  formData: models.Service = {
    title: '',
    description: ''
  } as models.Service;
  private roleOptions = [
    { key: 'admin', display_name: 'admin' },
    { key: 'student', display_name: 'student' },
    { key: 'teacher', display_name: 'teacher' },
    { key: 'manager', display_name: 'manager' }
  ];

  mounted() {
    //
  }

  @Watch('serviceId')
  onServiceIdChange(val: number) {
    console.log('fuckyou', val);
    if (val) {
      this.getServiceAsync();
      this.getProcessAsync();
    }
  }

  async getServiceAsync() {
    const { data } = await api.GetService({ id: this.serviceId });
    this.formData = data!;
  }
  async getProcessAsync() {
    this.listLoading = true;
    if (this.serviceId) {
      const { data, total } = await api.GetProcessList({ serviceId: this.serviceId });
      console.log(data);
      this.listData = data!.sort((a: models.ProcessView, b: models.ProcessView) => a.order - b.order);
      this.listLoading = false;
    }
  }
}
</script>

<style scoped>
.step {
  padding: 5px 25px;
  text-align: center;
}
</style>
