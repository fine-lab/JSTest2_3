function getDate() {
  var date = new Date();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentDate = date.getFullYear() + "-" + month + "-" + strDate;
  return currentDate;
}
viewModel.on("beforeSearch", (args) => {
  let startDate = viewModel.getCache("FilterViewModel").get("cdrq").getFromModel().getValue();
  let endDate = viewModel.getCache("FilterViewModel").get("cdrq").getToModel().getValue();
  if (startDate) {
    if (!endDate) {
      endDate = getDate();
    }
    //删除commonvos中的cdrq
    let commonVOs = args.params.condition.commonVOs;
    let newCommonVOs = commonVOs.filter((item, index) => {
      return item.itemName !== "cdrq";
    });
    args.params.condition.commonVOs = newCommonVOs;
    args.params.condition.simpleVOs = [];
    args.params.condition.simpleVOs.push({
      logicOp: "and",
      conditions: [
        {
          field: "cdrq",
          op: "egt",
          value1: startDate
        },
        {
          field: "cdrq",
          op: "elt",
          value1: endDate
        }
      ]
    });
  }
});