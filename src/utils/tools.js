export function getNodesInTree(id, dataArr) {//遍历获取指定节点在树种，从根节点到该节点的所有节点集合，目标节点开始。可有多个根节点。
    let temp = [];
    for (let i = 0; i < dataArr.length; i++) {
        let rootNode = dataArr[i];
        const getPath = function getPathFun(node) {
            //找到符合条件的节点，添加进结果集temp，返回true
            if (node.id === parseInt(id)) {
                temp.push(node);
                return true;
            }
            //当前节点不匹配则查询其child
            if (node.children && node.children.length > 0) {
                //有child节点，遍历其child，进行匹配
                for (let i = 0; i < node.children.length; i++) {
                    let result = getPath(node.children[i]);
                    //当本次遍历中的子节点中找到了指定节点，则当前节点也加入到结果集
                    if (result) {
                        temp.push(node);
                    }
                }
            }
            return false;
        };

        try {
            getPath(rootNode);
        } catch {
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
