<template>
  <div>
    <Editor id="tinyMce" v-model="content" :init="editorInit" @onChange="onChangeHandler">
    </Editor>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Model, Watch, Prop } from 'vue-property-decorator';
import 'tinymce/themes/modern/theme';
import Editor from '@tinymce/tinymce-vue';

@Component({
  components: { Editor }
})

/** 富文本组件 */
export default class TinymceEditor extends Vue {
  @Prop() editorContent!: string;

  content = '';
  // 初始值
  editorInit: any = {
    language_url: './static/zh_CN.js',
    language: 'zh_CN',
    selector: 'textarea',
    skin_url: './static/skins/lightgray',
    height: 200,
    branding: false,
    // width:600,
    plugins: 'link lists code table colorpicker textcolor wordcount contextmenu',
    toolbar: `bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat`
  };

  @Watch('editorContent')
  onEditorContentChange(val: string) {
    this.content = val;
  }

  /** 监听文本变化 */
  onChangeHandler(res: any, index: any, tag: any) {
    let html = res.level.content.replace('width', 'xxx');
    html = html.replace('height', 'yyy');
    console.log('********', html);
    this.$emit('update:editorContent', html);
  }
}
</script>
<style scoped lang="scss">
#mceu_228 {
  display: none !important;
}
</style>
