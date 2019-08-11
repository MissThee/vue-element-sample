export function getNodesInTree(id, dataArr) {//遍历获取指定节点在树种，从根节点到该节点的所有节点集合，从根节点开始。可有多个根节点。
    let temp = [];
    for (let i = 0; i < dataArr.length; i++) {
        //定义变量保存当前结果路径
        let data = dataArr[i];
        try {
            function getPath(node) {
                temp.push(node);
                //找到符合条件的节点，通过throw终止掉递归
                if (node.id === parseInt(id)) {
                    // self.currentNodePath = temp;
                    throw ("GOT IT!");
                }
                if (node.children && node.children.length > 0) {
                    for (let i = 0; i < node.children.length; i++) {
                        getPath(node.children[i]);
                    }
                    //当前节点的子节点遍历完依旧没找到，则删除路径中的该节点
                    temp.pop();
                } else {
                    //找到叶子节点时，删除路径当中的该叶子节点
                    temp.pop();
                }
            }

            getPath(data);
        } catch (e) {
        }
    }
    return temp;
}

import {Notification} from 'element-ui'

export function showNotify(response, operationName) {
    if (response.data.result) {
        Notification({
            message: operationName + '成功',
            type: 'success',
            duration: 1500,
        });
    } else {
        Notification({
            message: operationName + '失败',
            type: 'error',
            duration: 1500,
        });
    }
}
