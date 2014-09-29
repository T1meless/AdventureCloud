require("cloud/app.js");
// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
var mlog = require('cloud/mlog');
var mutil = require('cloud/mutil');
var muser = require('cloud/muser');

AV.Cloud.define("hello", function (request, response) {
  response.success("Hello world!");
});

AV.Cloud.define("addFriend", function (req, res) {
  var params = req.params;
  //var toUserId = params.toUserId;
  var fromUserId = params.fromUserId;
  var toUserId = params.toUserId;
  muser.addFriendForBoth(fromUserId, toUserId).then(function () {
    res.success();
  }, mutil.cloudErrorFn(res));
});
