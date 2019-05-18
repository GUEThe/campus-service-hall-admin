<template>
  <div>
    <el-dialog :title="dialogTitle" :visible="showDialog" @close="$emit('update:showDialog',false)">
      <el-form :model="formData" label-width="100px" :disabled="loading">
        <el-form-item label="用户名">
          <el-input v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formData.password"></el-input>
        </el-form-item>
        <el-form-item label="学号/学工号">
          <el-input v-model="formData.identify"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.mail"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formData.phone"></el-input>
        </el-form-item>
        <el-form-item label="角色">
<el-select v-model="formData.role" class="filter-item" placeholder="请选择">
            <el-option v-for="item in roleOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门">
          <DeptSelect :deptId.sync="formData.departmentId" />
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
import DeptSelect from '@/components/DeptSelect/index.vue';

@Component({
  components: {
    DeptSelect
  }
})
export default class UserDialog extends Vue {
  @Prop() showDialog!: boolean;
  @Prop() type!: number;
  @Prop() id!: number | string;

  private dialogTitle: string = '';
  private roleOptions = [
    { key: 'admin', display_name: 'admin' },
    { key: 'student', display_name: 'student' },
    { key: 'teacher', display_name: 'teacher' },
    { key: 'manager', display_name: 'manager' }
  ]
  private loading = false;
  private formData: models.User = {
    id: 0,
    name: '',
    username: '',
    password: '',
    identify: '',
    mail: '',
    phone: '',
    role: '',
    departmentId: 0
  }

  mounted() {
    //
  }

  @Watch('showDialog')
  async onshowDialogChangeAsync(val: boolean, old: boolean) {
    if (this.type) {
      this.dialogTitle = '编辑用户信息';
      const { data } = await api.GetUser({ id: this.id as number });
      this.formData = data!;
    } else {
      this.dialogTitle = '增加用户信息';
    }
    if (!val) {
      this.formData = {
        id: 0,
        name: '',
        username: '',
        password: '',
        identify: '',
        mail: '',
        phone: '',
        role: '',
        departmentId: 0
      }
    }
  }

  async onSubmitAsync() {
    const { data } = this.type ? await api.PutUser({ value: this.formData, id: this.id as string }) : await api.PostUser({ value: this.formData });
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
