export function getNodePath(id, dataArr) {
  let tempPath = [];
  for (let i = 0; i < dataArr.length; i++) {
    //定义变量保存当前结果路径
    let data = dataArr[i];
    try {
      getPath(tempPath, id, data);
    } catch (e) {
    }
  }
  return tempPath;
}

function getPath(tempPath, id, node) {
  tempPath.push(node.id);
  //找到符合条件的节点，通过throw终止掉递归
  if (node.id === parseInt(id)) {
    // self.currentNodePath = tempPath;
    throw ("GOT IT!");
  }
  if (node.children && node.children.length > 0) {
    for (let i = 0; i < node.children.length; i++) {
      getPath(tempPath, id, node.children[i]);
    }
    //当前节点的子节点遍历完依旧没找到，则删除路径中的该节点
    tempPath.pop();
  } else {
    //找到叶子节点时，删除路径当中的该叶子节点
    tempPath.pop();
  }
}

import { Notification } from 'element-ui'
export function showNotify (response,operationName) {
  if (response.data.result) {
    Notification({
      message: operationName+'成功',
      type: 'success',
      duration: 1500,
    });
  } else {
    Notification({
      message: operationName+'失败',
      type: 'error',
      duration: 1500,
    });
  }
}
