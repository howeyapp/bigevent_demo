//设置路径(测试)
var baseURL = "http://ajax.frontend.itheima.net"
//设置路径(生产)
// var baseURL = "http://www.baidu.com"

// 1.拦截每次ajax 请求配置的参数
$.ajaxPrefilter(function (options) {
    options.url = baseURL + options.url;

    //2.统一为有权限的接口,设置 headers 请求头 是否包含 /my/
    if(options.url.indexOf('/my/') !== -1 ) {
        options.headers = {
            Authorization:localStorage.getItem('token') || ''
        }
    }

    
    //3.所有的请求完成后都要进行身份认证(全局统一挂载 complete 回调函数)
    options.complete = function (res) {
        // 在complete 回调函数中,可以使用 res.responseJSON 拿到服务器响应回来的数据
        var data = res.responseJSON;
        if(data.status === 1 && data.message === '身份认证失败！') {
            //强制清空token
            localStorage.removeItem('token')
            //跳转到登录页面
            location.href = '/login.html'
        }
    }
})