import * as deepmerge from 'deepmerge'

const defaultValues: any = {
  apiVersion: 'v1'
}

export default class {
  _values;

  constructor(values: any = {}) {
    this._values = values
  }

  get values() {
    return deepmerge(defaultValues, this._values)
  }

  render() {
    return {
      apiVersion: this.values.apiVersion,
      kind: this.values.kind,
      metadata: this.values.metadata,
    }
  }

  toJSON() {
    return this.render()  
  }
}