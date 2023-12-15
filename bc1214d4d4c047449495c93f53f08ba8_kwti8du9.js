let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let Data = JSON.parse(request.data);
    let insertorUpdate = request.insertorUpdate;
    console.log(JSON.stringify(insertorUpdate));
    if (insertorUpdate == "Update") {
      let headers = { "Content-Type": "application/json;charset=UTF-8" };
      let body = {
        appCode: "beiwei-ys",
        schemeCode: "bw47",
        appApiCode: "ys.cancel.qtck.interface",
        jsonBody: { outBizOrderCode: Data.code }
      };
      let strResponse = postman("post", "https://www.example.com/", JSON.stringify(headers), JSON.stringify(body));
      console.log(JSON.stringify(strResponse));
      let str = JSON.parse(strResponse);
      if (str.success != true) {
        if (str.errorCode != "A1000") {
          throw new Error("调用OMS其他出库单取消API失败，失败原因：" + str.errorMessage);
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });