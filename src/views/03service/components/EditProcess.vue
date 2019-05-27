<template>
  <div class="createPost-container">
    <el-form ref="formData" :model="formData" :rules="rules" class="form-container" label-width="150px">
      <div class="createPost-main-container">
        <el-row :gutter="24">
          <el-col :span="10">
            <el-form-item prop="name" label="名称">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="部门">
              <DeptSelect :deptId.sync="formData.departmentId" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="10">
            <el-form-item label="次序">
              <el-input v-model="formData.order" type="number" :min="0"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="附件上传">
              <el-upload class="upload-demo" action="v1/api/Files/UploadFile" :headers="Header" multiple :on-success="handleSuccess1"
                :file-list="fileList" :on-remove="removeFile" :on-preview="showFile">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="详细内容">
        </el-form-item>
        <el-form-item prop="content" style="height:300px;margin-bottom: 30px;">
          <Editor :editorContent.sync="formData.description" />
        </el-form-item>
        <el-row>
          <el-col :span="8" :offset="8" style="text-align:center">
            <el-button type="primary" :loading="loading" @click="onSubmitAsync()">
              {{ id?'保 存':'添 加' }}
            </el-button>
          </el-col>
          <el-col :span="8" style="text-align:right">
            <el-button type="primary" :loading="loading" @click="backToService()">
              返回编辑事项
            </el-button>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script  lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import * as api from '@/api';
import * as models from '@/api/models';
import Editor from '@/components/Tinymce/index.vue';
import DeptSelect from '@/components/DeptSelect/index.vue';
import { ElForm } from 'element-ui/types/form';
import { UserModule } from '@/store/modules/user';
import { ServiceModule } from '@/store/modules/service';
/** 流程详情编辑 */
@Component({
  components: {
    Editor, DeptSelect
  }
})
export default class ProcessEdit extends Vue {
  private fileList: object[] = [];
  private inputVisible = false;
  private loading = false;
  private imageUrl = '';
  private id = 0;
  private formData: models.Process = {
    id: 0,
    serviceId: 0,
    description: '',
    name: '',
    type: 0,
    creator: 0,
    order: 0,
    fileGUID: '',
    departmentId: 0,
    time: 0
  };
  private inputValue = '';
  private rules = {
    name:
      [{ required: true, message: '请输入标题名称', trigger: 'blur' }]
  };

  mounted() {
    this.$on('global:get-process', (id: number) => {
      this.id = id;
      this.getProcessAsync(id)
    });
    this.id = parseInt(this.$route.query.id as string, 10);
    console.log('pidddddd', this.id);
    if (this.id) {
      this.getProcessAsync(this.id)
    }
  }

  get Header() {
    return { Authorization: 'Bearer ' + UserModule.token };
  }

  async getProcessAsync(id: number) {
    const { data } = await api.GetProcess({ id });
    this.formData = Object.assign(this.formData, data!);
    this.fileList = data!.fileGUID ? [{ name: data!.fileGUID, url: 'http://118.89.50.76:9466/api/Files/' + data!.fileGUID }] : [];
  }

  async onSubmitAsync() {
    this.formData.serviceId = ServiceModule.id;
    console.log('sssssss', this.formData.serviceId);
    (this.$refs.formData as ElForm).validate(async (valid: any) => {
      if (valid) {
        const { data } = this.id ? await api.PutProcess({ value: this.formData, id: this.id as any }) : await api.PostProcess({ value: this.formData });
        if (data) {
          this.$message.success('操作成功！');
          this.$emit('global:updateList');
        }
      }
    });
  }

  handleSuccess1(res: any, file: any) {
    this.formData.fileGUID = res.data;
  }

  addNewProcess() {
    this.id = 0;
    this.formData = {
      id: 0,
      serviceId: 0,
      description: '',
      name: '',
      type: 0,
      creator: 0,
      order: 0,
      fileGUID: '',
      departmentId: 0,
      time: 0
    };
  }
  backToService() {
    this.$router.go(-1);
  }
  removeFile() {
    this.formData.fileGUID = ''
  }
  showFile(e: any) {
    window.open(e.url);
  }
}
</script>

<style lang="scss" scoped>
.createPost-container {
  padding: 5px;
}
.article-textarea {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>
