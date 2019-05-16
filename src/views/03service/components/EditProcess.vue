<template>
  <div class="createPost-container">
    <el-form ref="formData" :model="formData" class="form-container" label-width="150px">
      <div class="createPost-main-container">
        <el-form-item style="margin-bottom: 40px;" prop="title" label="标题">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <div class="postInfo-container">
<el-form-item label-width="90px" label="类型:">
            <el-select v-model="formData.type" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label-width="60px" label="部门">
            <DeptSelect :deptId.sync="formData.department" />
          </el-form-item>

          <el-form-item label-width="120px" label="图标:">
            <el-button>点击上传</el-button>
          </el-form-item>

          <el-form-item label-width="90px" label="标签:">
            <el-tag v-for="(tag,index) in formData.tags" :key="index" :disable-transitions="false" closable @close="handleClose(tag)">
              {{ tag }}
            </el-tag>
            <el-input v-if="inputVisible" ref="saveTagInput" v-model="inputValue" size="small" class="input-new-tag"
              @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </el-form-item>
</div>

        <p>详细内容:</p>
        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Editor :editorContent.sync="formData.description" />
        </el-form-item>
        <el-button type="primary" :loading="loading" @click="onSubmitAsync()">下一步</el-button>
        <!-- <el-upload class="upload-demo" drag action="http://118.89.50.76:9466/v1/api/ServiceFile/UploadFile" multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload> -->
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
/** 办事详情编辑 */
@Component({
  components: {
    Editor, DeptSelect
  }
})
export default class ServiceEdit extends Vue {
  @Prop({ default: true }) isEdit?: boolean;

  private id: string = '';
  private inputVisible = false;
  private loading = false;
  private formData: models.Service = {
    id: 0,
    title: '',
    description: '',
    type: 0,
    creator: 0,
    icon: '',
    department: 0,
    createAt: 0,
    tags: '',
    fileGUID: ''
  };
  private options = [{
    value: 0,
    label: '黄金糕'
  }, {
    value: 1,
    label: '双皮奶'
  }, {
    value: 2,
    label: '蚵仔煎'
  }, {
    value: 3,
    label: '龙须面'
  }, {
    value: 4,
    label: '北京烤鸭'
  }];
  private dynamicTags: string[] = [];
  private inputValue = '';

  mounted() {
    this.getServiceAsync();
  }

  async getServiceAsync() {
    this.id = this.$route.query.id ? this.$route.query.id as string : '';
    if (this.id) {
      const { data } = await api.GetService({ id: parseInt(this.id, 10) });
      this.formData = data!;
    }
  }

  async onSubmitAsync() {
    this.loading = true;
    this.id = this.$route.query.id ? this.$route.query.id as string : '';
    const routerEdit = this.$route.query.isEdit as string === 'true';
    const { data } = routerEdit && this.isEdit ? await api.PutService({ value: this.formData, id: this.id }) : await api.PostService({ value: this.formData });
    this.loading = false;
    if (data) {
      this.$message.success('操作成功！');
      this.$router.push({ name: 'Process', query: { serviceId: `${data}` } });
    }
  }

  handleClose(tag: string) {
    this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
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
      this.dynamicTags.push(inputValue);
    }
    this.inputVisible = false;
    this.inputValue = '';
  }
}
</script>

<style lang="scss" scoped>
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
