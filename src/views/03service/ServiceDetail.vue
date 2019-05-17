<template>
  <el-container>
    <el-aside width="250px">
      <ProcessList :serviceId="serviceId" />
    </el-aside>
    <el-container>
      <el-header>
        <el-steps :active="step" align-center finish-status="success">
          <el-step title="编辑事项"></el-step>
          <el-step title="编辑流程"></el-step>
        </el-steps>
      </el-header>
      <el-main>
        <EditService v-if="step<1" :id.sync="serviceId" />
        <EditProcess v-if="step===1" />
      </el-main>
    </el-container>
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
