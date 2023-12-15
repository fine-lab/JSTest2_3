let invokeFunction1 = function (id, data, callback, options) {
  var proxy = cb.rest.DynamicProxy.create({
    doProxy: {
      url: "/web/function/invoke/" + id,
      method: "POST",
      options: options
    }
  });
  proxy.doProxy(data, callback);
};
viewModel.on("customInit", function (data) {
});
var gridModel = viewModel.get("UDITrackv2List");
//表格动态设置行颜色、列颜色  column:列名 index:行号
//设置表格列CSS样式
gridModel.setColumnState("billNo", "style", { color: "blue" });
gridModel.setColumnState("giftstype", "className", "highlight-red");
//设置表格行CSS样式
gridModel.setRowState(0, "className", "highlight-red");
viewModel.get("button17jf") &&
  viewModel.get("button17jf").on("click", function (data) {
    // 按钮--单击
    // 生成UDI--单击
    let row = gridModel.getRow(data.index);
    if (typeof row.billNo == "undefined" || row.billNo == null || row.billNo === "") {
      cb.utils.alert("单据信息有误！", "error");
      return;
    }
    //根据不同单据类型 进入不同单据详情中
    let billType = row.billName;
    if ("采购入库" === billType) {
      let page = {
        billtype: "voucherList", // 单据类型
        billno: "e2df54c5", // 单据号
        params: {
          mode: "add", // (编辑态、新增态、浏览态)
          billCode: row.billNo,
          billId: row.id,
          billType: "11"
        }
      };
      cb.loader.runCommandLine("bill", page, viewModel);
    }
  });