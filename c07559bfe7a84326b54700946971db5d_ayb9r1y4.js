let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var sum = 0;
    //获取所有主表id
    var zid = param.data[0].id;
    //根据主表id查询子表id和变更金额
    var sql3 = "select productionWorkNumber,additionAmount from GT102917AT3.GT102917AT3.additionalConditionDetails where additionalDetails_id='" + zid + "' and dr = 0";
    var list = ObjectStore.queryByYonQL(sql3);
    for (var i = 0; i < list.length; i++) {
      //获取生产工号
      let id = list[i].productionWorkNumber;
      //获取变更金额
      let additionAmount = list[i].additionAmount;
      //查询所有生产工号id为id的变更明细情况详情的变更金额并累加
      var sql =
        "select additionAmount,productionWorkNumber.amountOfChange,productionWorkNumber.theTotalPackageCombined from GT102917AT3.GT102917AT3.additionalConditionDetails where productionWorkNumber='" +
        id +
        "'and dr = 0";
      var res = ObjectStore.queryByYonQL(sql);
      //获取本条单据变更金额,并赋给sum
      sum = -additionAmount; //list[i].additionAmount;
      for (var j = 0; j < res.length; j++) {
        sum = sum + res[j].additionAmount;
      }
      //获取分包合同子表变更合计金额
      var additionalAmount = res[0].productionWorkNumber_amountOfChange;
      //获取总包合计
      var theTotalPackageCombined = res[0].productionWorkNumber_theTotalPackageCombined;
      //计算合计金额
      var amountOfJobNo = additionalAmount + theTotalPackageCombined + sum;
      //更新分包合同
      var updateWrapper = new Wrapper();
      // 更新条件
      updateWrapper.eq("id", id);
      // 待更新字段内容
      var toUpdate = { additionalAmount: sum, amountOfJobNo: amountOfJobNo };
      var res1 = ObjectStore.update("GT102917AT3.GT102917AT3.subcontractDetails", toUpdate, updateWrapper, "82884516");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });