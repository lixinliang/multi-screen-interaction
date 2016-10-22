/**
 * 获取url中指定参数的值
 * @param {string} name 需要获取的参数名
 * @param {string} url 需要被处理的url，默认为当前url
 * @return {string} 对应的参数值
 */
let getUrlParam = function(name, url) {
    var re = new RegExp("[\\?&#]" + name + "=([^&#]+)","gi");
    var ma = (url || location.href).match(re);
    var strArr;

    if (ma && ma.length > 0) {
        strArr = (ma[ma.length-1]).split("=");
        if (strArr && strArr.length > 1) {
            return strArr[1];
        }
        return ''
    }
    return '';
};

module.exports = getUrlParam;
