let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let businessIdArr = processStateChangeMessage.businessKey.split("_");
    let businessId = businessIdArr[1];
    let sql = "select verifystate,id,code,attach,contno  from GT89699AT3.GT89699AT3.schemnconfirm   where id = '" + businessId + "'";
    let res = ObjectStore.queryByYonQL(sql);
    var attach = res[0].attach;
    var contcode = res[0].contno;
    var code = res[0].code;
    var audit = res[0].verifystate;
    if (audit == 2) {
      //获取用户token
      var appContextString = AppContext();
      var appContext = JSON.parse(appContextString);
      var token = appContext.token;
      var tenantId = appContext.currentUser.tenantId;
      let url = `https://c2.yonyoucloud.com/iuap-apcom-file/rest/v1/file/mdf/${attach}/files?includeChild=false&ts=1655781730750&pageSize=10`;
      let header = { "Content-Type": "application/json;charset=UTF-8", cookie: `yht_access_token=${token}` };
      let body = {};
      let apiResponse = postman("get", url, JSON.stringify(header), JSON.stringify(body));
      var apiResponsetext = JSON.parse(apiResponse);
      var resarray = apiResponsetext.data;
      for (let i in resarray) {
        var filePath = resarray[i].filePath;
        var filenames = resarray[i].fileName;
        var fileExtension = resarray[i].fileExtension;
        //调用u8c接口
        let body1 = { contnum: contcode, code: code, url: filePath, filename: filenames, fileExtension: fileExtension };
        let header1 = { "Content-Type": "application/json;charset=UTF-8" };
        let apiResponse1 = postman("post", "http://222.90.97.2:2105/service/operod?dataType=Archivesfile", JSON.stringify(header1), JSON.stringify(body1));
      }
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });