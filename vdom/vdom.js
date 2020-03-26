const VNodeType = {
    HTML: 'HTML',
    TEXT: 'TEXT'
}

const ChildTyps = {
    EMPTY: 'EMPTY',
    SINGLE: 'SINGLE',
    MULTIPLE: 'MULTIPLE'
}

function createElement(tag, data = 'null', children = 'null') {
    let flg
    let childFlg
    // 判断 节点为标签节点或者文本节点
    if (typeof tag === 'string') {
        flg = VNodeType.HTML
    }
    else {
        flg = VNodeType.TEXT
    }
    // 判断 子节点的数量
    if (Array.isArray(children)) {
        if (children.length === 1) {
            childFlg = ChildTyps.SINGLE
            children = createTextVNode(children[0])
        }
        else {
            childFlg = ChildTyps.MULTIPLE
        }
    }
    else {
        childFlg = ChildTyps.EMPTY
    }
    return {
        flg,
        tag,
        data,
        key: data && data.key,
        children,
        childFlg,
        // el属性指向自身的DOM节点，用于删除和更新
        el: null
    }
}

function createTextVNode(text) {
    return {
        flg: VNodeType.TEXT,
        tag: null,
        data: null,
        children: text,
        childFlg: ChildTyps.EMPTY
    }
}

function render(vnode, container) {
    const preVNode = container.VNode
    if (preVNode) {
        patch(vnode, container, preVNode)
    }
    else {
        mount(vnode, container)
    }
    container.VNode = vnode
}

function patchData(key, el, preValue, newValue) {
    switch (key) {
        case "style":
            for (k in newValue) {
                el.style[k] = newValue[k]
            }
            for (k in preValue) {
                preValue[k] = ''
            }
            break
        case "class":
            el.className = newValue
            break
        default:
            // data属性中为绑定事件时，先删除原来的方法，再添加新的方法
            if (key[0] === '@') {
                if (preValue) {
                    // slice(1)过滤掉前面的@符号
                    el.removeEventListener(key.slice(1), preValue)
                }
                if (newValue) {
                    el.addEventListener(key.slice(1), newValue)
                }
            }
            else {
                el.setAttribute(key, newValue)
            }
            break
    }
}

function mount(vnode, container, refVNode) {
    const { flg } = vnode
    if (flg === VNodeType.HTML) {
        mountElement(vnode, container, refVNode)
    }
    else if (flg === VNodeType.TEXT) {
        mountText(vnode, container)
    }
}

function mountElement(vnode, container, refVNode) {
    const { tag, data } = vnode
    const tagNode = document.createElement(tag)
    vnode.el = tagNode
    if (data != "null") {
        for (let i in data) {
            patchData(i, tagNode, null, data[i])
        }
    }
    const { childFlg, children } = vnode
    if (childFlg != ChildTyps.EMPTY) {
        if (childFlg === ChildTyps.SINGLE) {
            mount(children, tagNode)
        }
        else if (childFlg === ChildTyps.MULTIPLE) {
            for (let i in children) {
                mount(children[i], tagNode)
            }
        }
    }
    refVNode ? container.insertBefore(tagNode, refVNode) : container.appendChild(tagNode)
}

function mountText(vnode, container) {
    const { children } = vnode
    const textNode = document.createTextNode(children)
    vnode.el = textNode
    container.appendChild(textNode)
}

// 根据新的VDOM来更新DOM
function patch(newVNode, container, preVNode) {
    const newFlg = newVNode.flg
    const preFlg = preVNode.flg
    if (newFlg != preFlg) {
        replaceVNode(newVNode, container, preVNode)
    }
    else if (newFlg === VNodeType.HTML) {
        patchElement(newVNode, container, preVNode)
    }
    else if (newFlg === VNodeType.TEXT) {
        patchText(newVNode, preVNode)
    }
}

function replaceVNode(newVNode, container, preVNode) {
    container.removeChild(preVNode.el)
    mount(newVNode, container)
}

function patchElement(newVNode, container, preVNode) {
    // 标签名称不同，也是直接替换VNode
    const newTag = newVNode.tag
    const preTag = preVNode.tag
    if (newTag != preTag) {
        replaceVNode(newVNode, container, preVNode)
        return
    }
    // 对于data属性直接添加新属性,旧属性检查新属性中是否存在该值，有就不删除，没有就删除
    const newData = newVNode.data
    const preData = preVNode.data
    const el = (newVNode.el = preVNode.el)
    if (newData) {
        for (let i in newData) {
            patchData(i, el, preData[i], newData[i])
        }
    }
    if (preData) {
        for (let i in preData) {
            if (preData[i] && !newData.hasOwnProperty(i)) {
                patchData(i, el, preData, null)
            }
        }
    }
    patchChildren(
        preVNode.childFlg,
        preVNode.children,
        newVNode.childFlg,
        newVNode.children,
        el
    )
}

function patchChildren(preCFlg, preChildren, newCFlg, newChildren, container) {
    switch (newCFlg) {
        case ChildTyps.EMPTY: {
            switch (preCFlg) {
                case ChildTyps.EMPTY:
                    break
                case ChildTyps.SINGLE:
                    container.removeChild(preChildren.el)
                    break
                default:
                    for (let i in preChildren)
                        container.removeChild(preChildren[i].el)
                    break
            }
            break
        }
        case ChildTyps.SINGLE: {
            switch (preCFlg) {
                case ChildTyps.EMPTY:
                    mount(newChildren, container)
                    break
                case ChildTyps.SINGLE:
                    patch(newChildren, container, preChildren)
                    break
                default:
                    for (let i in preChildren)
                        container.removeChild(preChildren[i].el)
                    mount(newChildren, el)
                    break
            }
            break
        }
        default: {
            switch (preCFlg) {
                case ChildTyps.EMPTY:
                    for (let i in newChildren)
                        mount(newChildren[i], container)
                    break
                case ChildTyps.SINGLE:
                    container.removeChild(preChildren.el)
                    for (let i in newChildren)
                        mount(newChildren[i], container)
                    break
                default:
                    // 实现多个子节点和多个子节点之间的替换
                    let lastindex = 0
                    for (let i = 0; i < newChildren.length; i++) {
                        const newVNode = newChildren[i]
                        let j = 0,
                            find = false
                        for (j; j < preChildren.length; j++) {
                            const preVNode = preChildren[j]
                            if (newVNode.key === preVNode.key) {
                                find = true
                                patch(newVNode, container, preVNode)
                                if (j < lastindex) {
                                    const refVNode = newChildren[i - 1].el.nextSibling
                                    container.insertBefore(preVNode.el, refVNode)
                                    break
                                }
                                else {
                                    lastindex = j
                                }
                            }
                        }
                        if (!find) {
                            const refVNode = i - 1 < 0 ? preChildren[0].el : newChildren[i - 1].el.nextSibling
                            mount(newVNode, container, refVNode)
                        }
                    }
                    for (let i in preChildren) {
                        const preVNode = preChildren[i]
                        let has = newChildren.find(newVNode => preVNode.key === newVNode.key)
                        if (!has) {
                            container.removeChild(preVNode.el)
                        }
                    }
                    break
            }
            break
        }
    }

}

function patchText(newVNode, preVNode) {
    // 拿到文本节点 el，同时让 newVNode.el 指向该文本节点
    const el = (newVNode.el = preVNode.el)
    if (preVNode.children != newVNode.children) {
        el.nodeValue = newVNode.children
    }
}