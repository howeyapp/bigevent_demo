$(function() {
    //1.文章分类列表渲染
    initArtCateList()
    var form = layui.form
    var layer = layui.layer

    //2.添加文章分类
    var index = null;
    $('#btnAddCate').on('click',function () {
     index =  layer.open({
            type: 1,
            area : ["500px","250px"],
            title: '添加文章分类',
            content: $('#dialong-add').html()
          });   
    })

    //3.添加文章分类显示(通过代理的形式,为 form-add表单绑定submit事件)
    $("body").on('submit','#boxAddCate',function(e){
        e.preventDefault();
        // console.log($(this).serialize());
        $.ajax({
            method:'POST',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !==0){
                    return layer.msg('新增文章分类失败!')
                }
                initArtCateList();
                layer.msg('恭喜您,新增文章分类成功!')
                layer.close(index)
            }
        })
    })

    //4.文章分类修改(通过代理的形式,为 btn-edit 按钮绑定事件)
    var indexEdit = null;
    $('tbody').on('click','.btn-edit',function () {
        indexEdit =  layer.open({
            type: 1,
            area : ["500px","250px"],
            title: '修改文章分类',
            content: $('#dialong-edit').html()
          });  
          
          var id = $(this).attr('data-id')
          //发起请求 获取对应数据
          $.ajax({
              method:'GET',
              url:'/my/article/cates/' + id,
              success:function(res){
                //   console.log(res);
                  form.val('form-edit',res.data)
              }
          })
    })

    //通过代理的形式 为修改分类的表单绑定 submit 事件
    $('body').on('submit','#form-edit',function (e) {
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('更新分类数据失败!')
                }
                layer.msg('更新分类数据成功!')
                layer.close(indexEdit)
                initArtCateList();
            }   
        })
    })

    //通过代理的形式 为删除按钮绑定点击事件
    $('tbody').on('click',".btn-delete",function() {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/' + id,
                success:function(res){
                    if(res.status !== 0){
                        return layer.msg('删除分类失败!')
                    }
                    layer.msg('删除分类成功!')
                    layer.close(index);
                    initArtCateList()
                }
            })
            
            
          })
    })




   


    // 文章分类列表封装
    function initArtCateList() {
        $.ajax({
            url:'/my/article/cates',
            success:function(res){
                // console.log(res);
                // 模板引擎渲染(传递对象,使用属性)
                var htmlStr =  template("tpl-table",res)
                $('tbody').html(htmlStr)
            }
        })
    }

    
})