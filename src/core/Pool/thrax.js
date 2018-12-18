const POOL_ID = '_poolId';

export default class Pool {
  create(factory, minItems = 10) {
    this.factory = factory;
    this.minItems = minItems;
    this.items = [];
    this.usedCount = 0;

    for (let i = 0; i < minItems; i++) {
      this.items.push(factory());
    }
  }

  use() {
    if (this.usedCount == this.items.length) {
      this.items.push(this.factory());
    }

    const item = this.items[this.usedCount];

    item[POOL_ID] = this.usedCount;
    this.usedCount++;

    return item;
  }

  recycle(item) {
    if (item[POOL_ID] == this.usedCount - 1) {
      this.usedCount--;

      return false;
    }

    this.usedCount--;
    this.items[item[POOL_ID]] = this.items[this.usedCount];
    this.items[this.usedCount] = item;

    return true;
  }

  size() {
    return this.items.length;
  }
}
