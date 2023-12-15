let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var flag = false;
    var address = request.address;
    var apply = request.apply;
    let apiResponse1;
    var regionId = "",
      regionPath = "";
    //循环地址
    address.forEach((data) => {
      debugger;
      var regionCode = data["regionCode"];
      //客户地址-----------
      let base_path = "https://www.example.com/";
      var hmd_contenttype = "application/json;charset=UTF-8";
      let header = {
        "Content-Type": hmd_contenttype
      };
      var simple = {
        code: regionCode
      };
      var body = {
        pageIndex: "1",
        pageSize: "10",
        simple: simple
      };
      let func1 = extrequire("productcenter.backDefaultGroup.getOpenApiToken");
      let res = func1.execute(request);
      var token = res.access_token;
      //请求数据
      let apiResponse = postman("post", base_path.concat("?access_token=" + token), JSON.stringify(header), JSON.stringify(body));
      var obj = JSON.parse(apiResponse);
      var data = obj.data;
      var recordList = data.recordList;
      if (recordList != null && recordList.length > 0) {
        regionPath = recordList[0].path; //"2177117994820096|2177117994820097|2177117994820098|"
      }
      if (regionPath.length > 0) {
        apply.forEach((action) => {
          var orgCode = action["orgCode"];
          var orgid = action["orgId"];
          if (regionPath.length > 0) {
            //然后根据组织id得到仓库配送范围
            var sql =
              "select id,orgid,orgcode,cangku,sheng,shengcode,shengpath,qu,qucode,qucode,qupath,xian,xiancode,xianpath from GT18216AT3.GT18216AT3.warehousegivearea where orgid='" + orgid + "'";
            var res3 = ObjectStore.queryByYonQL(sql, "developplatform");
            if (res3 != null && res3.length > 0) {
              res3.forEach((wrange) => {
                var shengpath = "",
                  qupath = "",
                  xianpath = "";
                if (wrange.shengpath != undefined) {
                  shengpath = wrange.shengpath;
                }
                if (wrange.qupath != undefined) {
                  qupath = wrange.qupath;
                }
                if (wrange.xianpath != undefined) {
                  xianpath = wrange.xianpath;
                }
                //仅仅选择了省
                if (shengpath.length > 0 && qupath.length == 0 && xianpath.length == 0) {
                  if (regionPath.indexOf(shengpath) != -1) {
                    flag = true;
                  }
                }
                //仅仅选择了区
                if (qupath.length > 0 && xianpath.length == 0) {
                  if (regionPath.indexOf(qupath) != -1) {
                    flag = true;
                  }
                }
                //选择了县
                if (xianpath.length > 0) {
                  if (regionPath.indexOf(xianpath) != -1) {
                    flag = true;
                  }
                }
              });
            }
          }
        });
      }
    });
    return { flag: flag };
  }
}
exports({ entryPoint: MyAPIHandler });