let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let func1 = extrequire("ST.api001.getToken");
    let res = func1.execute(require);
    let token = res.access_token;
    let headers = { "Content-Type": "application/json;charset=UTF-8" };
    // 调出组织id
    var outorg = param.OutOrg;
    // 调入组织id
    var inorg = param.InOrg;
    // 调入组织单元详情查询
    let inOrgResponse = postman("get", "https://www.example.com/" + token + "&id=" + inorg, JSON.stringify(headers), null);
    let inOrgObject = JSON.parse(inOrgResponse);
    if (inOrgObject.code == 200) {
      var inorgCode = inOrgObject.data.code;
      // 调出组织单元详情查询
      let outOrgResponse = postman("get", "https://www.example.com/" + token + "&id=" + outorg, JSON.stringify(headers), null);
      let outOrgObject = JSON.parse(outOrgResponse);
      if (outOrgObject.code == 200) {
        var outorgCode = outOrgObject.data.code;
      }
    }
    return { OutInReturn: { inorgCode: inorgCode, outorgCode: outorgCode } };
  }
}
exports({ entryPoint: MyTrigger });