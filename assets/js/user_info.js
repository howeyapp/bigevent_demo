$(function () {
    // 1.定义校验规则
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        nickname:function (vaule) {
            if(vaule.trim().length > 6){
                return "昵称应该输入 1~6 位之间"
            }
        }
    })

    initUserInfo()
    //2.初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取用户信息失败!')
                }
                // console.log(res);
                // 调用from.val() 快速为表单赋值
                form.val('formUserInfo',res.data)
            }
        })
    }

    //3.重置表单数据
    $('#btnReset').on('click',function(e){
        //阻止表单的默认重置行为
        e.preventDefault()
        initUserInfo()
    })

    //4.监听表单提交事件
    $('.layui-form').on('submit',function(e) {
        //阻止表单默认提交行为
        e.preventDefault()
        //发起ajax请求
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('恭喜您 , 信息成功!')
                //调用父页面中的方法(父框架),重新渲染用户的信息
                window.parent.getUserInfo()

            }
        })
    })
})