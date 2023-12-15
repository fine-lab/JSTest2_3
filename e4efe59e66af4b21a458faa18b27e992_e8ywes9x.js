let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    var { isdefault, supplier, id } = data;
    var sql = "select id from GT4066AT1.GT4066AT1.supplierbankacc where supplier='" + supplier + "' and isdefault='Y' and id!='" + id + "'";
    //如果当前设置了 default
    if (isdefault == "Y") {
      let resp = ObjectStore.queryByYonQL(sql);
      resp.map((v) => {
        if (v.id !== null) {
          throw new Error("当前供应商唯一默认账户已存在，请检查！");
        }
      });
    }
    varsql = "select.form online0205.treeucfbase Treetable";
    return {};
  }
}
exports({ entryPoint: MyTrigger });