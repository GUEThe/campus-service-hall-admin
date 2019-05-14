<template>
  <div>
    <EditService :isEidt="false" />
  </div>
</template>

<script  lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import EditService from './EditService.vue';

/** 创建办事 */
@Component({
  components: {
    EditService
  }
})
export default class CreateService extends Vue {
  //
}
</script>

<style scoped>
</style>
