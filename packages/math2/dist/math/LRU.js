class Entry {
  value;
  key;
  next;
  prev;
  constructor(val) {
    this.value = val;
  }
}
class LinkedList {
  head;
  tail;
  _len = 0;
  /**
   * Insert a new value at the tail
   */
  insert(val) {
    const entry = new Entry(val);
    this.insertEntry(entry);
    return entry;
  }
  /**
   * Insert an entry at the tail
   */
  insertEntry(entry) {
    if (!this.head) {
      this.head = this.tail = entry;
    } else {
      this.tail.next = entry;
      entry.prev = this.tail;
      entry.next = null;
      this.tail = entry;
    }
    this._len++;
  }
  /**
   * Remove entry.
   */
  remove(entry) {
    const prev = entry.prev;
    const next = entry.next;
    if (prev) {
      prev.next = next;
    } else {
      this.head = next;
    }
    if (next) {
      next.prev = prev;
    } else {
      this.tail = prev;
    }
    entry.next = entry.prev = null;
    this._len--;
  }
  /**
   * Get length
   */
  len() {
    return this._len;
  }
  /**
   * Clear list
   */
  clear() {
    this.head = this.tail = null;
    this._len = 0;
  }
}
class LRU {
  _list = new LinkedList();
  _maxSize = 10;
  _lastRemovedEntry;
  _map = {};
  constructor(maxSize) {
    this._maxSize = maxSize;
  }
  /**
   * @return Removed value
   */
  put(key, value) {
    const list = this._list;
    const map = this._map;
    let removed = null;
    if (map[key] == null) {
      const len = list.len();
      let entry = this._lastRemovedEntry;
      if (len >= this._maxSize && len > 0) {
        const leastUsedEntry = list.head;
        list.remove(leastUsedEntry);
        delete map[leastUsedEntry.key];
        removed = leastUsedEntry.value;
        this._lastRemovedEntry = leastUsedEntry;
      }
      if (entry) {
        entry.value = value;
      } else {
        entry = new Entry(value);
      }
      entry.key = key;
      list.insertEntry(entry);
      map[key] = entry;
    }
    return removed;
  }
  get(key) {
    const entry = this._map[key];
    const list = this._list;
    if (entry != null) {
      if (entry !== list.tail) {
        list.remove(entry);
        list.insertEntry(entry);
      }
      return entry.value;
    }
  }
  /**
   * Clear the cache
   */
  clear() {
    this._list.clear();
    this._map = {};
  }
  len() {
    return this._list.len();
  }
}
export {
  Entry,
  LinkedList,
  LRU as default
};
