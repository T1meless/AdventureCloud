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
  res.render('hello');
});

function addFriendTest(req, res) {
  var fromUserId = '53f0d534e4b0c1ae470ca958';
  var toUserId = '540939e4e4b02b98df61ccb6';
  muser.addFriendForBoth(fromUserId, toUserId).then(function () {
    res.send('ok');
  }, mutil.renderErrorFn(res));
}

function removeFriendTest(req, res) {
  var fromUserId = '53f0d534e4b0c1ae470ca958';
  var toUserId = '540939e4e4b02b98df61ccb6';
  muser.removeFriendForBoth(fromUserId, toUserId).then(function () {
    res.send('ok');
  }, mutil.renderErrorFn(res));
}

function findUserTest(req, res) {
  muser.findUserById('53f0d534e4b0c1ae470ca958').then(function (user) {
    res.send(user);
  }, mutil.renderErrorFn(res));
}

function renderFriends(req, res) {
  var name = req.params.name;
  muser.findFriends(name).then(function (friends) {
    res.send(friends);
  }, mutil.renderErrorFn(res))
}


app.get('/addFriend', addFriendTest);
app.get('/removeFriend', removeFriendTest);
app.get('/user', findUserTest);
app.get('/:name/friends', renderFriends);
app.listen();