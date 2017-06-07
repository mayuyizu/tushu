var requests = require('../../requests/request.js');
var utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tmpFlag:0,//6.2-6.9
    //star
    stars: [2, 4, 6, 8, 10],
    normalSrc: '../../images/starG.png',
    selectedSrc: '../../images/star.png',
    halfSrc: '../../images/starH.png',
    scrollHeight: 0, //scroll-view高度
    pageIndex: 0, //页码
    totalRecord: 0, //图书总数
    isInit: true, //是否第一次进入应用
    loadingMore: false, //是否正在加载更多
    btnLoading:false,//按钮上的loading效果
    pageData: [],//图书数据
    recommendIndex: 0,//parseInt((Math.random() * 90 + 1), 10),//1-90随机数
    recommendedData:[]//推荐图书
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var str = '2017-06-13 23:13:15';
    str = str.replace(/-/g, "/");
    var date = utils.formatTime(new Date(str));
    var curDate = utils.formatTime(new Date());
    if(curDate < date){
      this.tmpFlag = 1;
    }else{
      this.tmpFlag = 0;
    }
    this.setData({
      tmpFlag: this.tmpFlag
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (!this.tmpFlag){
      this.setData({ btnLoading: true, recommendIndex: parseInt((Math.random() * 90 + 1), 10), recommendedData: [], pageIndex: 0, pageData: [] });
      requestData.call(this);
      requestRecommendedData.call(this);
    }
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  
  /**
   * 跳转到详细页面
   */
  toDetailPage: function (e) {
    var bid = e.currentTarget.dataset.bid; //图书id [data-bid]
    wx.navigateTo({
      url: '../detail/detail?id=' + bid
    });
  },

  /**
   * 换一换（推荐）
   */
  changeBook:function(e){
    this.setData({ btnLoading: true, recommendedData: []});
    requestRecommendedData.call(this);
  }

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
});

/**
 * 热门
 */
function requestData() {
  var _this = this;
  var start = this.data.pageIndex;
  var _pageData = [];
  //随机数1-90
  var num = Math.random()*90 + 1;
  num = parseInt(num, 10);//参数二：进制
  console.log("radom:" + num);

  this.setData({ loadingMore: true, isInit: false });
  updateRefresh.call(this);
  requests.requestSearchBook({ tag: '热门', start: num, count: 10}, (data) => {
    if (data.total == 0) {
      //没有记录
      _this.setData({ totalRecord: 0 });
    } else {
      var i;
      for (i = 0; i < data.books.length; i++) {
        if ("0.0" != data.books[i].rating.average) {
          data.books[i].rating.average = parseFloat(data.books[i].rating.average);
          _pageData = _pageData.concat(data.books[i]);
        }

      }
      _this.setData({
        pageData: _pageData,//_this.data.pageData.concat(data.books),
        pageIndex: start + 10,
        totalRecord: data.total
      });
      wx.hideLoading();
    }
  }, () => {
    _this.setData({ totalRecord: 0 });
  }, () => {
    _this.setData({ loadingMore: false });
  });
}
/**
 * 推荐
 */
function requestRecommendedData() {
  var _this = this;
  var _pageData = [];
  requests.requestSearchBook({ tag: '推荐', start: _this.data.recommendIndex, count: 3 }, (data) => {
    if (data.total == 0) {
      //没有记录
    } else {
      var i;
      for (i = 0; i < data.books.length; i++) {
        if ("0.0" != data.books[i].rating.average) {
          // data.books[i].rating.average = parseFloat(data.books[i].rating.average);
          _pageData = _pageData.concat(data.books[i]);
        }

      }
      _this.setData({
        recommendIndex: _this.data.recommendIndex+3,
        recommendedData: _pageData
      });
    }
    console.log(_this.data.recommendedData);
  }, () => {
    _this.setData({ totalRecord: 0 });
  }, () => {
    _this.setData({ btnLoading: false });
  });
}

/**
 * 刷新
 */
function updateRefresh() {
  wx.showLoading({
    title: '加载中',
  })
  setTimeout(function () {
    wx.hideLoading()
  }, 10000)
}