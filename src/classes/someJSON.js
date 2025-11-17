import {reactive} from 'vue'
import treeData from '../moc/jsMind-MRYA-01.json'

class someJSON {
  setOfData = undefined
  maxNdx = 0;

  constructor(initData) {
    if (initData) {
      this.setOfData = initData
    } else {
      this.setOfData = reactive(treeData)
    }

  }

  get all() {
    return this.setOfData
  }
  get meta() {
    return this.setOfData.meta
  }
  get data() {
  return this.setOfData.data
  }

  set slideNew(id) {
    const strOld = JSON.stringify(this.setOfData)

    const ndxStart = strOld.indexOf(id,0)
    if (ndxStart>=0) {
      const delta = id.length+2
      const partFirst = strOld.slice(0,ndxStart+delta)
      const partLast = strOld.slice(ndxStart+delta, strOld.length)
      this.maxNdx+=1;
      const strNew = partFirst+'"slideNdx":"'+this.maxNdx+'",' + partLast
      this.setOfData = JSON.parse(strNew)
    }
  }

  searchByID(branch, id) {
    if (branch?.children) {
      const answer = branch.children.find((item) => item.id === id)
      if (answer !== undefined) {
        return answer
      } else {
        for (let ndx = 0; ndx < branch.children.length; ndx++) {
          const answer = this.searchByID(branch.children[ndx], id)
          if (answer !== undefined) {
            return answer
          }
        }
      // return null;
      }
    }
  }

}
export default someJSON
