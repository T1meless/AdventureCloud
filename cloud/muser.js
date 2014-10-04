/**
 * Created by lzw on 14-9-29.
 */
var mutil = require('cloud/mutil');
var mlog = require('cloud/mlog');

function findUserById(userId) {
  var q = new AV.Query('_User');
  return q.get(userId);
}

function findUser(modifyQueryFn) {
  return mutil.findOne('_User', modifyQueryFn);
}

function findUserByName(name) {
  return findUser(function (q) {
    q.equalTo('username', name);
  });
}

function findFriends(name) {
  var p = new AV.Promise();
  findUserByName(name).then(function (user) {
    user.relation('friends').query().find().then(function (results) {
      p.resolve(results);
    }, mutil.rejectFn(p));
  }, mutil.rejectFn(p));
  return p;
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

function findBothUser(fromUserId, toUserId) {
  var p = new AV.Promise();
  findUserById(fromUserId).then(function (fromUser) {
    mlog.log('fromUser found');
    findUserById(toUserId).then(function (toUser) {
      mlog.log('find user and resolve');
      p.resolve(fromUser, toUser);
    }, mutil.rejectFn(p));
  }, mutil.rejectFn(p));
  return p;
}

function doRelationForBoth(fromUserId, toUserId, relationFn) {
  var p = new AV.Promise();
  mlog.log('doRelationForBoth');
  findBothUser(fromUserId, toUserId).then(function (fromUser, toUser) {
    mlog.log('find users');
    relationFn(fromUser, toUser).then(function () {
      mlog.log('relationFn once');
      relationFn(toUser, fromUser).then(function () {
        p.resolve();
      }, mutil.rejectFn(p))
    }, mutil.rejectFn(p));
  }, mutil.rejectFn(p));
  return p;
}

function addFriendForBoth(fromUserId, toUserId) {
  return doRelationForBoth(fromUserId, toUserId, addFriend);
}

function removeFriendForBoth(fromUserId, toUserId) {
  return doRelationForBoth(fromUserId, toUserId, removeFriend);
}


exports.findUser = findUser;
exports.findUserById = findUserById;
exports.addFriend = addFriend;
exports.removeFriend = removeFriend;
exports.addFriendForBoth = addFriendForBoth;
exports.removeFriendForBoth = removeFriendForBoth;
exports.findFriends = findFriends;
