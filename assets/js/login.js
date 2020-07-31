$(function () {
    // 1.点击按钮切换登录和注册页面
    $('#link_reg').on('click',function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })

    $('#link_login').on('click',function(){
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //2.点击layui表单校验规则
    var form = layui.form;
    //利用form这个对象创建规则
    form.verify({
        //属性的值可以是数组,也可以是函数
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ] ,
        //校验两次密码是否一致
        repwd: function (value) {
            var pwd = $('.reg-box [name=password]').val()
            if(value !== pwd) {
                return '两次密码不一致'
            }
        }
    })

    //3.注册功能
    var layer = layui.layer;
    $('#form_reg').on('submit',function (e) {
        e.preventDefault();
        // console.log($('#form_reg').serialize());
        //发送ajax异步请求
        $.ajax({
            type:'post',
            url:'/api/reguser',
            data:{
                username: $("#form_reg [name=username]").val(),
                password: $("#form_reg [name=password]").val(),
            },
            success:function(res){
                //注册失败校验
                if(res.status !== 0){
                    return layer.msg(res.message);
                }
                //注册成功提示
                layer.msg(res.message)
                //注册成功后切换到登录页面
                $('#link_login').click()
                //清空表单 reset()是dom方法,所以用[0]来转换
                $('#form_reg')[0].reset();
            }
        })
    })

    //4.登录功能
    $('#form_login').on("submit",function (e) {
        e.preventDefault();
        $.ajax({
            type:'post',
            url:'/api/login',
            data:$(this).serialize(),
            success:function(res){
                //登录失败校验
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                //登录成功提示
                layer.msg(res.message)
                //将登录成功后得到的 token 字符串保存到localStorage中
                localStorage.setItem('token',res.token)
                //页面跳转
                location.href = "/index.html"
            }
        })
    })

})