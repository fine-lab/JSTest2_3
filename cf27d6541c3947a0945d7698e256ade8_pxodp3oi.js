viewModel.get("button18pb") &&
  viewModel.get("button18pb").on("click", function (data) {
    // 业务员更新--单击
    let dataBody = {
      billtype: "Voucher",
      domainKey: "yourKeyHere",
      billno: "3b6f887d",
      params: {
        mode: "add", // (编辑态edit、新增态add、浏览态browse)
        isBrowse: false,
        orgName: "游乐事业部",
        readOnly: false
      }
    };
    cb.loader.runCommandLine("bill", dataBody, viewModel);
  });