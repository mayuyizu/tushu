var requests = require( '../../requests/request.js' );
var utils = require( '../../utils/util.js' );

Page( {
  data: {
    //star
    stars: [2, 4, 6, 8, 10],
    normalSrc: '../../images/starG.png',
    selectedSrc: '../../images/star.png',
    halfSrc: '../../images/starH.png',
    
    id: null,
    loadidngHidden: false,
    bookData: null
  },
  onLoad: function( option ) {
    this.setData({
      id: option.id
    });
  },

  //share
  onShareAppMessage: function () {
    return {
      title: '随时随地查阅你感兴趣的图书',
      // path: '/page/user?id=123',

      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  
  onReady: function() {
    var id = this.data.id;
    var _this = this;
    requests.requestBookDokDetail(
      id, 
      {fields: 'image,summary,publisher,title,rating,pubdate,author,author_intro,catalog'}, 
      ( data ) => {

        data.rating.average = parseFloat(data.rating.average);

        _this.setData({
          bookData: data
        });
        console.log(typeof (_this.data.bookData.rating.average));
    }, () => {
      wx.navigateBack();
    }, () => {
      _this.setData( {
        loadidngHidden: true
      });
    });
  }
});