import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface ServiceState {
    id: number
}

@Module({ dynamic: true, store, name: 'serviceId' })
class ServiceId extends VuexModule implements ServiceState {
    public id: number = 0;
    @Mutation
    private SetService(id: number) {
        this.id = id;
    }

    @Action
    public SetServiceId(id: number) {
        this.SetService(id)
    }
}

export const ServiceModule = getModule(ServiceId)
