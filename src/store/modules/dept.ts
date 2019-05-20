import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import { GetDepartmentList } from "@/api";

import store from "@/store";
import { Department } from "@/api/models";

@Module({ dynamic: true, store, name: "dept" })
class Dept extends VuexModule {
  public dept: Department[] = [];

  @Mutation
  private SET_DEPT(dept: Department[]) {
    this.dept = dept;
  }

  @Action
  public async GetDeptList() {
    const { data } = await GetDepartmentList();
    this.SET_DEPT(data!);
  }

  get getDept() {
    return this.dept;
  }
}

export const DeptModule = getModule(Dept);
