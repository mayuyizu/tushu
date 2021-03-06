var requests = require('../../requests/request.js');
var utils = require('../../utils/util.js');

//刷新动态球颜色
var iconColor = [
  '#42BD56', '#31A040'
];

Page({
  data: {
    //star
    stars: [2, 4, 6, 8, 10],
    normalSrc: '../../images/starG.png',
    selectedSrc: '../../images/star.png',
    halfSrc: '../../images/starH.png',
    key: 0,//评分
    jan:'',//条形码
    flagDel:0,//控制clear按钮显示与隐藏
    flagScan:1,
    scrollHeight: 0, //scroll-view高度
    pageIndex: 0, //页码
    totalRecord: 0, //图书总数
    isInit: true, //是否第一次进入应用
    loadingMore: false, //是否正在加载更多
    footerIconColor: iconColor[0], //下拉刷新球初始颜色
    pageData: [], //图书数据
    searchKey: null, //搜索关键字
    nickName:''
  },

  onLoad:function(){
    wx.getUserInfo({
      success: (res) => {
        var userInfo = res.userInfo //用户基本信息
        var nickName1 = userInfo.nickName //用户名
        this.setData({
          nickName: nickName1
        });
        // var avatarUrl = userInfo.avatarUrl //头像链接
        // var gender = userInfo.gender //性别 0：未知、1：男、2：女
        // var province = userInfo.province //所在省
        // var city = userInfo.city //所在市
        // var country = userInfo.country //所在国家
      }
    })
  },

  //页面显示获取设备屏幕高度，以适配scroll-view组件高度
  onShow: function () {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollHeight: res.windowHeight - (100 * res.windowWidth / 750) //80为顶部搜索框区域高度 rpx转px 屏幕宽度/750
        });
      }
    })
  },

  //搜索输入框输入取值
  searchInputEvent: function (e) {
    console.log(e.detail.value);
    var _flagDel=0;
    var _flagScan=1;
    if ("" == e.detail.value){
      _flagDel=0;
      _flagScan=1;
    }else{
      _flagDel=1;
      _flagScan=0;
    }
    this.setData(
      {
        searchKey: e.detail.value,
        flagDel: _flagDel,
        flagScan: _flagScan
      }
    );
  },

  clearBtn:function(e){
    this.setData({
      searchKey:"",
      flagDel:0,
      flagScan:1,
      isInit:true,
      pageIndex: 0,
      pageData: []
    });
  },

  //搜索按钮点击事件
  searchClickEvent: function (e) {
    if (!this.data.searchKey) {
      return;
    }
    this.setData({ pageIndex: 0, pageData: [] });
    requestData.call(this);
  },

  searchScanEvent:function(e){
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        console.log(res.result);
        this.setData({jan:res.result, pageIndex: 0, pageData: [] });
        requestDataByScan.call(this);
      }
    })
  },

  //下拉请求数据
  scrollLowerEvent: function (e) {
    if (this.data.loadingMore)
      return;
    requestData.call(this);
  },

  //跳转到详细页面
  toDetailPage: function (e) {
    var bid = e.currentTarget.dataset.bid; //图书id [data-bid]
    wx.navigateTo({
      url: '../detail/detail?id=' + bid
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '随时随地帮您查询图书信息',
      // path: '/page/user?id=123',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
});

/**
 * 请求图书信息
 */
function requestData() {
  var q = this.data.searchKey;
  var start = this.data.pageIndex;

  this.setData({ loadingMore: true, isInit: false });
  updateRefreshBall.call(this);
  requests.requestSearchBook({ q: q, start: start }, (data) => {
    if (data.total == 0) {
      //没有记录
      this.setData({ totalRecord: 0 });
    } else {
      var i;
      console.log(typeof (data.books[0].rating.average));
      for (i = 0; i < data.books.length; i++) {
        data.books[i].rating.average = parseFloat(data.books[i].rating.average);
      }
      this.setData({
        pageData: this.data.pageData.concat(data.books),
        pageIndex: start + 20,
        totalRecord: data.total
      });
      console.log(typeof (this.data.pageData[0].rating.average));
      wx.hideLoading();
    }
  }, () => {
    this.setData({ totalRecord: 0 });
  }, () => {
    this.setData({ loadingMore: false });
  });
}

/**
 * 扫码获取图书信息
 */
function requestDataByScan() {
  this.setData({ loadingMore: true, isInit: false });
  updateRefreshBall.call(this);
  requests.requestSearchBookByScan(this.data.jan, {}, (data) => {
    if (""==data) {
      this.setData({ totalRecord: 0 });
    } else {
      data.rating.average = parseFloat(data.rating.average);
      this.setData({
        pageData: this.data.pageData.concat(data),
        pageIndex: 0,
        totalRecord: data==""?0:1
      });
      wx.hideLoading();
    }
  }, () => {
    this.setData({ totalRecord: 0 });
  }, () => {
    this.setData({ loadingMore: false });
  });
}

/**
 * 刷新下拉效果变色球
 */
function updateRefreshBall() {
  wx.showLoading({
    title: '加载中',
  })

  setTimeout(function () {
    wx.hideLoading()
  }, 5000)
}

/**
 * test
 */
function test() {
  wx.request({
    url: "https://read.douban.com/j/article_v2/get_reader_data",
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST",
    data:{ aid: "32890883", reader_data_version: "v13" },
    // data: Util.json2Form({ aid: "32890883", reader_data_version: v13  }),
    complete: function (res) {
      console.log(res);
      if (res == null || res.data == null) {
        console.error('网络请求失败');
        return;
      }
    }
  })
}