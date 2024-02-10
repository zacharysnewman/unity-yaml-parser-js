class UnityScalarRegister {
  constructor() {
    this.map = new Map();
  }

  pop(value) {
    let ptr_id = value;
    let style = this.map.get(ptr_id);
    if (style !== undefined) {
      style = style[1];
      this.map.delete(ptr_id);
    }
    return style;
  }

  set(value, style) {
    let ptr_id = value;
    if (this.map.has(ptr_id)) {
      throw new Error(`Duplicated ptr_id (${ptr_id}) in UnityScalarRegister`);
    }
    this.map.set(ptr_id, [value, style]);
  }
}
