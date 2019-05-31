<template>
  <div class="createPost-container">
    <el-form ref="formData" :model="formData" :rules="rules" class="form-container" label-width="150px">
      <div class="createPost-main-container">
        <el-row :gutter="24">
          <el-col :span="10">
            <el-form-item prop="title" label="标题">
              <el-input v-model="formData.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="部门">
              <DeptSelect :deptId.sync="formData.department" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="10">
            <el-form-item label="图标:">
              <el-upload class="upload-demo" action="v1/api/Files/UploadService/UploadFile" :headers="Header"
                :show-file-list="false" :on-success="handleSuccess0">
                <el-button v-if="!imageUrl" size="small" type="primary">点击上传</el-button>
                <el-image v-if="imageUrl" :src="'/v1/'+imageUrl" fit="fill" style="width: 100px; height: 100px"></el-image>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="标签:">
              <div class="article-textarea">
                <el-tag v-for="(tag,index) in tagsList" :key="index" :disable-transitions="false" closable @close="handleClose(tag)">
                  {{ tag }}
                </el-tag>
                <el-input v-if="inputVisible" ref="saveTagInput" v-model="inputValue" size="small" class="input-new-tag"
                  @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加新标签</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="10">
            <el-form-item label="附件上传">
              <el-upload class="upload-demo" action="v1/api/Files/UploadFile" :headers="Header" multiple :on-success="handleSuccess1"
                :file-list="fileList" :on-remove="removeFile" :on-preview="showFile">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="业务类型">
              <el-select v-model="formData.type">
                <el-option :value="1" label="学生业务"></el-option>
                <el-option :value="2" label="教师业务"></el-option>
                <el-option :value="3" label="一般业务"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-form-item label="详细内容:"></el-form-item>
      <el-form-item prop="content" style="height:310px;margin-bottom: 30px;">
        <Editor :editorContent.sync="formData.description" style="height:200px" />
      </el-form-item>
      <el-row>
        <el-col :span="8" :offset="8" style="text-align:center">
          <el-button type="primary" :loading="loading" @click="onSubmitAsync()">{{ id?"保 存":"提 交" }}</el-button>
        </el-col>
        <el-col :span="8" style="text-align:right">
          <el-button v-if="id" type="primary" :loading="loading" @click="addProcess()">添加流程</el-button>
        </el-col>
      </el-row>
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
/** 办事详情编辑 */
@Component({
  components: {
    Editor, DeptSelect
  }
})
export default class ServiceEdit extends Vue {
  @Prop({ default: 0 }) id?: number;

  private inputVisible = false;
  private loading = false;
  private imageUrl = '';
  private fileList: object[] = [];
  private formData: models.Service = {
    id: 0,
    title: '',
    description: '',
    type: 1,
    creator: 0,
    icon: '',
    department: 0,
    createAt: 0,
    tags: '',
    fileGUID: ''
  };
  private inputValue = '';
  private rules = {
    title:
      [{ required: true, message: '请输入标题名称', trigger: 'blur' }]
  };

  mounted() {
    this.getServiceAsync();
  }

  get tagsList() {
    return this.formData.tags ? this.formData.tags.split(' ').filter((e: string) => e) : [];
  }
  get serviceId() {
    return this.id;
  }
  get Header() {
    return { Authorization: 'Bearer ' + UserModule.token };
  }

  @Watch('serviceId')
  onserviceIdChange(val: number) {
    if (val) {
      this.getServiceAsync();
    }
  }

  async getServiceAsync() {
    if (this.serviceId) {
      const { data } = await api.GetService({ id: this.serviceId });
      this.formData = data!;
      this.imageUrl = data!.icon;
      this.fileList = data!.fileGUID ? [{ name: data!.fileGUID, url: 'http://118.89.50.76:9466/api/Files/' + data!.fileGUID }] : [];
    }
  }

  async onSubmitAsync() {
    (this.$refs.formData as ElForm).validate(async (valid: any) => {
      if (valid) {
        const { data } = this.serviceId ? await api.PutService({ value: this.formData, id: this.serviceId as any }) : await api.PostService({ value: this.formData });
        if (data) {
          this.$message.success('操作成功！');
          if (!this.serviceId) {
            this.$emit('update:id', data);
            ServiceModule.SetServiceId(data as any);
          }
        }
      }
    });
  }

  addProcess() {
    this.$router.push({ name: 'Editprocess' })
  }

  handleClose(tag: string) {
    this.formData.tags = this.formData.tags.replace(tag, '');
    console.log(tag, this.formData.tags);
  }

  showInput() {
    this.inputVisible = true;
    this.$nextTick(() => {
      (this.$refs.saveTagInput as any).$refs.input.focus();
    });
  }

  handleInputConfirm() {
    let inputValue = this.inputValue;
    if (inputValue) {
      this.formData.tags = this.formData.tags ? this.formData.tags + ' ' + inputValue : inputValue;
    }
    this.inputVisible = false;
    this.inputValue = '';
  }

  handleSuccess0(res: any, file: any) {
    this.imageUrl = res.data;
    console.log(res)
    this.formData.icon = res.data;
  }

  handleSuccess1(res: any, file: any) {
    this.formData.fileGUID = res.data;
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
