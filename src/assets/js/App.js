export default {
    baseURL: 'http://hdwx.museum-edu.cn/', // 图片路径
    baseURL_dev: 'http://hdwx.museum-edu.cn/', // 开发环境接口url
    baseURL_pro: 'http://hdwx.museum-edu.cn/', // 生产环境接口url
    getUrlKey: function(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null
    },
    checkIDCard: function(idcode) {
        // 加权因子
        var weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
            // 校验码
        var check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

        var code = idcode + '';
        var last = idcode[17] //最后一个

        var seventeen = code.substring(0, 17)

        var arr = seventeen.split('')
        var len = arr.length
        var num = 0
        for (var i = 0; i < len; i++) {
            num = num + arr[i] * weight_factor[i]
        }

        // 获取余数
        var resisue = num % 11
        var last_no = check_code[resisue]

        var idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/

        // 判断格式是否正确
        var format = idcard_patter.test(idcode)

        // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
        return !!(last === last_no && format);
    },
    isTWCard: function(card) {
        // 台湾居民来往大陆通行证
        // 规则： 新版8位或18位数字， 旧版10位数字 + 英文字母
        // 样本： 12345678 或 1234567890B
        var reg = /^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/
        if (reg.test(card) === false) {
            return false
        } else {
            return true
        }
    },
    isHKCard: function(card) {
        // 港澳居民来往内地通行证
        // 规则： H/M + 10位或6位数字
        // 样本： H1234567890
        var reg = /^([a-zA-Z]\d{6,10}(\(\w{1}\))?)$/
        if (reg.test(card) === false) {
            return false
        } else {
            return true
        }
    },
    isPassPortCard: function(card) {
        // 护照
        // 规则： 14/15开头 + 7位数字, G + 8位数字, P + 7位数字, S/D + 7或8位数字,等
        // 样本： 141234567, G12345678, P1234567
        var reg = /^([a-zA-z]|[0-9]){5,17}$/
        if (reg.test(card) === false) {
            return false
        } else {
            return true
        }
    },
    /*获取cookie */
    getCookie: function(name) {
        var arr
        var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2])
        } else {
            return null
        }
    }
}