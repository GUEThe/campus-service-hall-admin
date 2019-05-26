<template>
  <el-container>
    <el-container>
      <el-main>
        <EditService :id.sync="serviceId" />
      </el-main>
    </el-container>
    <el-footer>
      <ProcessList :serviceId="serviceId" />
    </el-footer>
  </el-container>
</template>

<script  lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import * as api from '@/api';
import * as models from '@/api/models';
import EditProcess from './components/EditProcess.vue';
import EditService from './components/EditService.vue';
import ProcessList from './components/ProcessList.vue';
import { UserModule } from '@/store/modules/user';
import { ServiceModule } from '@/store/modules/service';

/** 办事详情 */
@Component({
  components: {
    EditProcess, EditService, ProcessList
  }
})
export default class ServicetDetail extends Vue {
  listLoading: boolean = false;
  listData: models.Service[] = [];
  search = '';
  page = 1;
  total = 0;
  serviceId = 0;
  step = 0;
  mounted() {
    this.serviceId = parseInt(this.$route.query.id as string, 10);
    ServiceModule.SetServiceId(this.serviceId);
    console.log(this.serviceId, ServiceModule.id);
    this.$on('global:add-service', () => { this.step = 1 });
    this.$on('global:add-process', () => { this.step = 1 });
    this.$on('global:back', () => { this.step = 0 });
  }
}

</script>

<style scoped>
</style>
