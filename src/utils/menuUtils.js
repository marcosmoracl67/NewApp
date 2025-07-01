export const buildMenuTree = (items = []) => {
  const itemMap = {};
  const tree = [];

  items.forEach((item) => {
    const id = item.opcion_id ?? item.id;
    const parentId = item.padre_id ?? item.parent_id ?? item.padre ?? item.parentId;
    itemMap[id] = { ...item, id, parentId, children: [] };
  });

  Object.values(itemMap).forEach((item) => {
    if (item.parentId && itemMap[item.parentId]) {
      itemMap[item.parentId].children.push(item);
    } else {
      tree.push(item);
    }
  });

  return tree;
};
