viewModel.on("customInit", function (data) {
  // 退社登记--页面初始化
  var gridModel = viewModel.getGridModel();
  gridModel.on("afterSetDataSource", () => {
    //获取列表所有数据
    const rows = gridModel.getRows();
    //从缓存区获取按钮
    const actions = gridModel.getCache("actions");
    if (!actions) return;
    const actionsStates = [];
    rows.forEach((data) => {
      const actionState = {};
      actions.forEach((action) => {
        //设置按钮可用不可用
        actionState[action.cItemName] = { visible: true };
        if (data.verifystate === 2) {
          if (action.cItemName === "button10ii") {
            actionState[action.cItemName] = { visible: false };
          }
        }
        if (data.verifystate === 0) {
          if (action.cItemName === "button13wc") {
            actionState[action.cItemName] = { visible: false };
          }
        }
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
  });
});