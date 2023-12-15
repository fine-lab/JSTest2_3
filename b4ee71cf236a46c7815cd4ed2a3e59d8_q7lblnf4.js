let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let jsonStringList = JSON.parse(param.requestData);
    var object = { id: jsonStringList[0].id };
    //实体查询
    var res = ObjectStore.selectById("GT71136AT14.GT71136AT14.neibuyewufapiao", object);
    var sql = "select hanshuijine,jine,mingxi from GT71136AT14.GT71136AT14.neibuyewufapiaozb where neibuyewufapiao_id = '" + jsonStringList[0].id + "'";
    var res1 = ObjectStore.queryByYonQL(sql);
    var payBillbArray = [];
    for (var i = 0; i < res1.length; i++) {
      var map = {};
      let base_path1 = "https://www.example.com/" + res1[i].mingxi + "&orgId=2560416346283008";
      let apiResponse1 = openLinker("get", base_path1, "GT71136AT14", JSON.stringify({}));
      var wuliaoObject = JSON.parse(apiResponse1).data;
      map.material_code = wuliaoObject.code;
      map.material_name = wuliaoObject.name;
      map.taxRate = res.shuilv;
      map.natSum = res1[i].hanshuijine;
      map.natMoney = res1[i].jine;
      map.oriSum = res1[i].hanshuijine;
      map.oriMoney = res1[i].jine;
      map.oriTax = ((res1[i].hanshuijine * res.shuilv) / 100).toFixed(2);
      map.supplier_name = "测试";
      map._status = "Insert";
      payBillbArray.push(map);
    }
    payBillbArray = distinctArrObj(payBillbArray);
    let body = {
      data: [
        {
          vouchdate: res.riqi,
          accentity_code: "A01",
          period: "2566292723995904",
          exchangeRateType_code: "01",
          supplier_code: res.gongyingshangbianma,
          currency: "2560400749976320",
          natCurrency: "2560400749976320",
          exchRate: 1,
          tradetype_code: "01",
          project_code: res.xiangmubianma,
          project_name: res.xiangmu,
          _status: "Insert",
          oapDetail: payBillbArray,
          "headItem!define1": "人工",
          "headItem!id": 2645578107736320,
          "headfree!define1": "2596876309093120",
          "headfree!define1_null": "人工",
          "headfree!id": 2645578107736320
        }
      ]
    };
    //请求数据
    let base_path = "https://www.example.com/";
    let apiResponse = openLinker("post", base_path, "GT68603AT4", JSON.stringify(body));
    return { apiResponse };
    function distinctArrObj(arr) {
      var MyShow = typeof arr != "object" ? [arr] : arr; //确保参数总是数组
      for (let i = 0; i < MyShow.length; i++) {
        if (MyShow[i] === null || MyShow[i] === "" || JSON.stringify(MyShow[i]) === "{}") {
          MyShow.splice(i, 1);
          i = i - 1;
        }
      }
      return MyShow;
    }
  }
}
exports({ entryPoint: MyTrigger });