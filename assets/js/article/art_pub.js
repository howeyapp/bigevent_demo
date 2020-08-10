$(function () {
  var layer = layui.layer
  var form = layui.form

  //1.渲染文章分类
  initCate()

  //2.初始化富文本编辑器
  initEditor()

  // 定义加载文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败！')
        }
        // 调用模板引擎，渲染分类的下拉菜单
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 一定要记得调用 form.render() 方法 重新渲染一下表单结构
        form.render()
      }
    })
  }

  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  //为选择封面的按钮 绑定点击事件处理函数
  $('#btnChooseImage').on('click', function () {
    $('#coverFile').click()
  })

  //监听 coverFile 的change 事件 获取用户选择的文件列表
  $('#coverFile').on('change', function (e) {
    // 获取到文件的列表数组
    var file = e.target.files[0]
    //判断用户是否选择了文件
    if (file.length === 0) {
      return layer.msg('请上传图片!')
    }
    //根据文件 创建对应的URL地址
    var newImgURL = URL.createObjectURL(file)
    // 为裁剪区域重新设置图片
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })

  //确定发布状态
  var state = "已发布"
  $('#btnSave2').click(function () {
    state = '草稿'
  })


  // 添加文章(上面的两个按钮,点击哪个都会触发)
  $('#form-add').on('submit',function (e) {
    e.preventDefault()
    // FormData() 原生js 内置的方法
    var fd = new FormData(this)
    fd.append('state',state)
    // console.log(...fd);
    //base64是字符串
    //生成二进制图片  
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作  
        //ajax请求需要写在回调函数里面
        // 因为生成文件是耗时操作,异步的,所以必须保证发送ajax的时候图片已经生成,所以必须写到回调函数里面
        fd.append("cover_img",blob)
        // console.log(...fd);
        //发起ajax请求
        publishArticle(fd) 
        

      })
  })
      //定义一个发布文章的方法
      function publishArticle(fd)  {
        $.ajax({
          method:'POST',    
          url:'/my/article/add',
          data:fd,
          // 注意：如果向服务器提交的是 FormData 格式的数据，
          // 必须添加以下两个配置项
          contentType:false,
          processData:false,
          success:function(res){
            if(res.status !== 0 ){
              return layer.msg('发布文章失败')
            }
            layer.msg('发布文章成功')
            //发布成功后跳转到文章列表页
            location.href = '/article/art_list.html'
            window.parent.document.getElementById('a2').className = "layui-this"
            window.parent.document.getElementById('a3').className = ""
          }
        })
      }


})

