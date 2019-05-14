<template>
  <div class="createPost-container">
    <el-form ref="formData" :model="formData" class="form-container">
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title" label="标题">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="60px" label="创建者:" class="postInfo-container-item">
                    <el-select v-model="formData.creator" placeholder="请选择">
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item label-width="120px" label="创建时间:" class="postInfo-container-item">
                    <el-date-picker v-model="formData.createAt" type="datetime" format="yyyy-MM-dd HH:mm:ss"
                      placeholder="Select date and time" />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label-width="90px" label="类型:" class="postInfo-container-item">
                    <el-select v-model="formData.type" placeholder="请选择">
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="60px" label="部门" class="postInfo-container-item">
                    <el-select v-model="formData.department" placeholder="请选择">
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item label-width="120px" label="次序:" class="postInfo-container-item">
                    <el-input v-model="formData.order" type="number"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <p>详细内容:</p>
        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Editor :editorContent.sync="formData.description" />
        </el-form-item>
        <el-button type="primary" :loading="loading" @click="onSubmitAsync()">提 交</el-button>
        <!-- <el-upload class="upload-demo" drag action="http://118.89.50.76:9466/v1/api/ProcessFile/UploadFile" multiple>
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
/** 流程编辑 */
@Component({
  components: {
    Editor
  }
})
export default class ProcessEdit extends Vue {
  private id: string = '';
  private inputVisible = false;
  private loading = false;
  private formData: models.Process = {
    id: 0,
    serviceId: 0,
    name: '',
    description: '',
    fileGUID: '',
    order: 0,
    type: 0,
    creator: 0,
    time: 0,
    departmentId: 0
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

  mounted() {
    this.getProcessAsync();
  }

  async getProcessAsync() {
    this.id = this.$route.query.id ? this.$route.query.id as string : '';
    if (this.id) {
      const { data } = await api.GetProcess({ id: parseInt(this.id, 10) });
      this.formData = data!;
      console.log('fffffffffff', this.formData);
    }
  }

  async onSubmitAsync() {
    this.loading = true;
    console.log('sssss', this.formData);
    this.id = this.$route.query.id ? this.$route.query.id as string : '';
    const isEdit = this.$route.query.isEdit as string !== 'false';
    console.log('isss', isEdit);
    const { data } = isEdit ? await api.PutProcess({ value: this.formData, id: this.id }) : await api.PostProcess({ value: this.formData });
    this.loading = false;
    if (data) {
      this.$message.success('操作成功！');
    }
  }
}
</script>

<style lang="scss" scoped>
.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;

      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
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
