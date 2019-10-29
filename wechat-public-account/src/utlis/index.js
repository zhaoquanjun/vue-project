//去左右空格;
export function trim(s) {
    return s.replace(/(^\s*)|(\s*$)/g, "");
}
/**
 * 是否是图片格式
 * @param {*} type 文件类型
 */
export function isImgFile(type) {
    let result = type.startsWith("image/");
    return result;
}

//校验域名
export const regDomain = new RegExp(/^([a-z0-9\-\u4E00-\u9FA5]*[\.])+([a-z\u4E00-\u9FA5]{2,10})$/)

// 校验邮件
export const reg = new RegExp(/((http|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/)
/**
 * 图片大小是否超出限制
 * @param {*} size 图片大小
 * @param {*} maxMb 图片大小显示 单位M
 */
export function imgSize(size, maxMb) {
    let maxSize = maxMb || 10;
    const isSizeOk = size / 1024 / 1024 < maxSize;
    return isSizeOk;
}

//消息提示
export const notify = (that,mag, type) => {
    that.$notify({
        customClass: `notify-${type}`,
        message: mag,
        showClose: false,
        duration: 1500
    });
}

//转换链接
//转换规则
// 网址：url
// 页面:http://域名/页面id
// 文章:http://域名/news/文章详情页id/文章id.html
// 产品:http://域名/product/产品详情页id/产品id.html
export const transformationUrl = (type, domian, id, detailId) => {
    // type: Url; Page; Product; News
    // domian: 域名
    // id：页面，文章，产品id 网址url；
    // detailId：详情页id
    let url = '无效链接'
    if (type == 'Url'){
        url = id;
    } else if(type == 'Page') {
        url = `http://${domian}/${id}`;
    } else if(type == 'Product' || type == 'News') {
        url = `http://${domian}/${detailId}/${id}.html`;
    }
    return url
}
