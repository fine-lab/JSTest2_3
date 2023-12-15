viewModel.on("customInit", function (data) {
  // 零售收款记录详情--页面初始化
  //列表过滤
  viewModel.on("beforeSearch", function (args) {
    var promise = new cb.promise();
    cb.rest.invokeFunction("GT5AT34.public.getUser", {}, function (err, res) {
      let userId = JSON.parse(res.res).currentUser.id;
      let orgid = res.res;
      args.isExtend = true;
      args.params.condition.simpleVOs = [];
      args.params.condition.simpleVOs.push({
        field: "saleuseruuid",
        op: "eq",
        value1: userId
      });
      promise.resolve();
    });
    return promise;
  });
});