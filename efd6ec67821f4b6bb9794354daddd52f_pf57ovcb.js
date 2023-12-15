let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let param1 = request.ids;
    //公共变量定义
    let sql = ""; //待执行的SQL语句
    let url = ""; //待调用接口地址
    let body = ""; //接口调用入参
    let httpURL = "https://c2.yonyoucloud.com"; //域名公共变量
    //根据时间日期查询收款信息，找出最近审批时间为30天（暂定）的收款数据，查询其对应的销售订单编码、金额、审批时间；
    sql = "select orderno,sum(oriSum) as pOriSum, max(mainid.auditTime) as pTime from arap.receivebill.ReceiveBill_b";
    sql += " and mainidid= '" + param1 + "'"; // 根据收款单的id查询
    let res = ObjectStore.queryByYonQL(sql, "udinghuo");
    let sqlid = "select id from voucher.order.Order";
    sqlid += " where code='" + res[0].orderno + "'"; // 根据收款单的订单编号去查询销售订单id
    let resid = ObjectStore.queryByYonQL(sqlid, "udinghuo");
    sql = "select orderno,sum(oriSum) as pOriSum2, max(mainid.auditTime) as pTime2 from arap.receivebill.ReceiveBill_b";
    sql += " and orderno= '" + res[0].orderno + "'"; // 根据收款单的id查询
    let resP = ObjectStore.queryByYonQL(sql, "udinghuo");
    if (resSign.length > 0) {
      //调用更新自定义项接口
      url = httpURL + "/iuap-api-gateway/yonbip/sd/api/updateDefinesInfo";
      body = {
        billnum: "voucher_order",
        datas: [
          {
            id: resid[0].id,
            code: res[0].orderno,
            definesInfo: [
              {
                define18: resP[0].pTime2,
                define17: resP[0].pOriSum2,
                isHead: true,
                isFree: true,
                _status: "Update"
              }
            ]
          }
        ]
      };
      let apiResponse = openLinker("POST", url, "AT176AE5641C400003", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
    } else {
      url = "https://www.example.com/";
      body = {
        billnum: "voucher_order",
        datas: [
          {
            id: resid[0].id,
            code: res[0].orderno,
            definesInfo: [
              {
                define18: "",
                define17: "",
                isHead: true,
                isFree: true,
                _status: "Update"
              }
            ]
          }
        ]
      };
      let apiResponse = openLinker("POST", url, "AT17C47D1409580006", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });