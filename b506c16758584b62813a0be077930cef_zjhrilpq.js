let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var object = request.data;
    var time = request.time;
    //删除当天的数据
    var currentTimeObj = { time: time };
    var res = ObjectStore.deleteByMap("GT8954AT173.GT8954AT173.pro_active_user", currentTimeObj);
    //插入数据
    var res = ObjectStore.insertBatch("GT8954AT173.GT8954AT173.pro_active_user", object, "bcddba47");
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });