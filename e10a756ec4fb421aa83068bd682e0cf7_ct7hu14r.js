viewModel.on("customInit", function (data) {
  // 智能货位列表--页面初始化
  var viewModel = this;
  var userInfo = viewModel.getAppContext().user;
  console.log(viewModel.getAppContext());
  var sysId = userInfo.sysId;
  var tenantID = viewModel.getAppContext().tenant.tenantId;
  var searchFlag = false;
  let referModel = null;
  viewModel.selectedHuowei = [];
  viewModel.getParams().autoAddRow = false;
  console.log("========[智能货位列表]");
  let flagDebug = false;
  viewModel.flagBack = false;
  var orgid = null;
  //获取access_token
  var myToken = "";
  //获取查询区模型
  var gridModel = viewModel.get("dxq_location_1547152489668673543");
  gridModel._set_data("forbiddenDblClick", true);
  gridModel.setState("showRowNo", true);
  gridModel.setState("showCheckBox", false);
  //页面DOM加载完成
  viewModel.on("afterMount", function () {
    // 获取查询区模型
    const filtervm = viewModel.getCache("FilterViewModel");
    //查询区模型DOM初始化后
    filtervm.on("afterInit", function () {
      const orgIdForm = filtervm.get("org_id").getFromModel();
      //监听选中“仓库” afterValueChange afterSelect
      orgIdForm.on("afterInitVm", function (argument) {
        if (flagDebug) console.log("[afterInitVm]");
        if (flagDebug) console.log(argument);
        var orgIdModel = orgIdForm.getCache("vm").get("tree");
        console.log(orgIdModel);
        orgIdModel.on("afterValueChange", function (data) {
          if (flagDebug) console.log("[afterValueChange]");
          if (flagDebug) console.log(data);
          if (flagDebug) console.log(viewModel.flagBack);
          if (!viewModel.flagBack) {
            filtervm.get("parent").getFromModel().getCache("vm").get("tree").select("");
            if (data.value.length > 0) {
              orgid = data.value[0].orgid;
            }
            if (flagDebug) console.log(orgid);
            if (flagDebug) console.log("[afterValueChange]end");
            var treeData1 = [];
            const res = getTreeData(orgid, myToken);
            if (res.error) {
              cb.utils.alert(res.error.message);
              return false;
            }
            if (res.status === 1) {
              treeData1 = res.dataList;
            } else {
              cb.utils.alert("数据加载异常,请刷新后重试!");
              return false;
            }
            filtervm.get("parent").getFromModel().getCache("vm").get("tree").setDataSource(treeData1);
            viewModel.selectedHuowei = [];
            searchFlag = true;
          } else viewModel.flagBack = false;
        });
      });
      referModel = filtervm.get("parent").getFromModel();
      referModel.on("afterInitVm", function (args) {
        if (flagDebug) console.log("[referModel-Init]");
        //请求脚手架接口给参照树赋值
        var treereferModel = referModel.getCache("vm").get("tree");
        if (flagDebug) console.log("[referModel]");
        var treeData = [];
        if (flagDebug) console.log(viewModel.get("org_id"));
        const result = getTreeData(null, myToken);
        if (result.error) {
          cb.utils.alert(result.error.message);
          return false;
        }
        if (result.status === 1) {
          treeData = result.dataList;
        } else {
          cb.utils.alert("数据加载异常,请刷新后重试!");
          return false;
        }
        // 货位树 数据渲染
        var flag = true;
        treereferModel.on("beforeSetDataSource", function (arg) {
          if (flagDebug) console.log("[referModel]" + flag);
          if (flag) {
            arg.length = 0;
            for (var i = 0; i < treeData.length; i++) {
              arg.push(treeData[i]);
            }
          }
        });
        treereferModel.on("afterSetDataSource", function (arg) {
          flag = false;
        });
        let referViewModelInfo = args.vm;
        referViewModelInfo.on("afterOkClick", function (okData) {
          if (flagDebug) console.log("[afterOkClick]");
          if (flagDebug) console.log(okData);
          if (flagDebug) console.log("[afterOkClick]end");
          viewModel.selectedHuowei = okData;
        });
      });
    });
  });
  viewModel.on("beforeSearch", function (args) {
    if (searchFlag) {
      args.isExtend = true;
      var commonVOs = args.params.condition.commonVOs;
      console.log(args);
      console.log(commonVOs);
      for (var i = 0; i < commonVOs.length; i++) {
        if (commonVOs[i].itemName === "parent") {
          commonVOs.splice(i, 1);
        }
      }
      console.log(commonVOs);
      searchFlag = false;
    }
  });
  gridModel.on("afterSetDataSource", () => {
    //获取列表所有数据
    const rows = gridModel.getRows();
    //从缓存区获取按钮
    const actions = gridModel.getCache("actions");
    if (!actions) return;
    const actionsStates = [];
    rows.forEach((data) => {
      const level = data.level;
      const actionState = {};
      actions.forEach((action) => {
        //设置按钮可用不可用
        if (level === 0) {
          actionState[action.cItemName] = { visible: false };
        } else if (action.cItemName == "btnDelete") {
          actionState[action.cItemName] = { visible: true };
        } else if (action.cItemName == "btnEdit") {
          actionState[action.cItemName] = { visible: true };
        } else {
          actionState[action.cItemName] = { visible: true };
        }
        actionState["btnCopy"] = { visible: false };
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
  });
  function getTreeData(orgid, accessToken) {
    //创建同步接口请求对象
    const proxy = viewModel.setProxy({
      queryData: {
        url: "/location/GetLocationTree",
        method: "GET",
        tenant_id: tenantID
      }
    });
    //传参
    const param = {
      orgid: orgid,
      access_token: accessToken,
      userId: userInfo.userId,
      tenant_id: tenantID
    };
    const data = proxy.queryDataSync(param);
    return data;
  }
  viewModel.on("beforeBatchdelete", function (params) {
    var domainKey = params.params.domainKey;
    var deldata = JSON.parse(params.data.data);
    console.log(deldata);
    var locationId = deldata[0].id;
    //创建异步接口请求对象
    const proxy = viewModel.setProxy({
      queryData: {
        url: "/location/CheckLocationDel",
        method: "GET"
      }
    });
    //传参
    const param = {
      locationId: locationId,
      domainKey: domainKey,
      access_token: myToken,
      tenant_id: tenantID
    };
    console.log(param);
    //核心代码：proxy对象里面有两个函数，queryDataSync(a):同步请求 queryData(a,b)：异步请求，result为服务端返回的数据
    const result = proxy.queryDataSync(param);
    if (flagDebug) console.log(result);
    if (result.status === "1" || result.status === 1) {
      if (result.data === false) {
        cb.utils.alert("该位置存在数据关联,不能删除！");
        return false;
      } else {
        console.log("success");
      }
    } else {
      cb.utils.alert("数据加载异常,请刷新后重试!");
      return false;
    }
  });
  viewModel.on("afterBatchdelete", function (params) {
    if (flagDebug) console.log("afterBatchdelete");
    if (flagDebug) console.log(params);
    var data = params.res.infos;
    var id = data[0].id;
    viewModel.getCache("FilterViewModel").get("parent").getFromModel().getCache("vm").get("tree").deleteNode(id);
  });
  //搜索表格数据之前，可以修改params参数
  gridModel.on("beforeLoad", function (params) {
    //一般主要修改默认查询的过滤条件
  });
});