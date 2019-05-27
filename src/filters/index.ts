// set function parseTime to filter
import { DeptModule } from '@/store/modules/dept'
export { parseTime } from '@/utils'

export function DeptFilter(value: number) {
  const deptList = DeptModule.getDept
  let str = '未知'
  deptList.forEach(item => {
    if (item.id === value) {
      str = item.name
    }
  })
  return str
}
