export function saveToLocal (id, key, value) {
    // 在node.js里运行环境里没localStorage，必须要在window空间下
    // 在客户端缓存数据，没有时间限制
    let seller = window.localStorage.__seller__
    if (!seller) {
        seller = {}
        seller[id] = {}
    } else {
        // 解析JSON字符串成JS对象或键值对
        seller = JSON.parse(seller)
        if (!seller[id]) {
            seller[id] = {}
        }
    }
    // 方括号语法 seller.id.key
    seller[id][key] = value
    // 将一个JS对象解析成JSON字符串
    window.localStorage.__seller__ = JSON.stringify(seller)
}

export function loadFromLocal (id, key, def) {
    let seller = window.localStorage.__seller__
    // seller不存在
    if (!seller) {
        return def
    }
    // seller.id不存在
    seller = JSON.parse(seller)[id]
    if (!seller) {
        return def
    }
    // key不存在或key存在
    let ret = seller[key]
    return ret || def
}
