import deepool from 'deepool';

export default class Pool {
  create(factory) {
    this.pool = deepool.create(factory);
  }

  use() {
    return this.pool.use();
  }

  recycle(o) {
    return this.pool.recycle(o);
  }

  size() {
    return this.pool.size();
  }
}
