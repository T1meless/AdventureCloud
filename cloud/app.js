// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();
var muser = require('cloud/muser');
var mutil = require('cloud/mutil');
// App 全局配置
app.set('views', 'cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(express.bodyParser());    // 读取请求 body 的中间件

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.get('/hello', function (req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});

app.get('/test', function (req, res) {
  var fromUserId = '5427ce8be4b0e9d9a645c9c7';
  var toUserId = '53f0d534e4b0c1ae470ca958';
  muser.addFriendForBoth(fromUserId, toUserId).then(function () {
    res.send('ok');
  }, mutil.renderErrorFn(res));
});

// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();