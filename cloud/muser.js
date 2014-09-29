/**
 * Created by lzw on 14-9-29.
 */
var mutil = require('cloud/mutil');

function findUser(userId) {
  var q = new AV.Query('_User');
  return q.get(userId);
}

function addFriend(user, friend) {
  var friends = user.relation('friends');
  friends.add(friend);
  return user.save();
}

function removeFriend(user, friend) {
  var friends = user.relation('friends');
  friends.remove(friend);
  return user.save();
}

function addFriendForBoth(fromUserId, toUserId) {
  var p = new AV.Promise();
  findUser(fromUserId).then(function (fromUser) {
    findUser(toUserId).then(function (toUser) {
      addFriend(fromUser, toUser).then(function () {
        addFriend(toUser, fromUser).then(function () {
          p.resolve();
        }, mutil.rejectFn(p))
      }, mutil.rejectFn(p))
    }, mutil.rejectFn(p));
  }, mutil.rejectFn(p));
  return p;
}

exports.findUser = findUser;
exports.addFriend = addFriend;
exports.removeFriend = removeFriend;
exports.addFriendForBoth = addFriendForBoth;
