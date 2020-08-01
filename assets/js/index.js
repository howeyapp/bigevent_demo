$(function(){
    //1.调用getUserInfo 获取用户基本信息
    getUserInfo()

    //3.退出登录
    // var layer = layui.layer
    $('#btnLogout').on('click',function () {
        layer.confirm('是否确认退出?', {icon: 3, title:'提示'}, function(index){
            //do something
            //关闭提示框
            layer.close(index);

            //清空本地存储中的 token
            localStorage.removeItem('token')

            //重新跳转到登录页面
            location.href = '/login.html'
          });
    })
})

//获取用户信息
function getUserInfo() {
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        // 注意: headers属性区分大小写
        // headers :{
        //     Authorization:localStorage.getItem('token') || ''
        // },
        success:function(res){
            //token可能失效,所以有时需要重新登录
            // console.log(res);
            if(res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            //调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        }
    })
}

//2.渲染用户头像信息函数
function renderAvatar(user) {
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;'+ name)

    if(user.user_pic !== null){
        //渲染图片头像
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avatar').hide()
    }else {
        //渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}