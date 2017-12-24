var requests = require( '../../requests/request.js' );
var utils = require( '../../utils/util.js' );

Page( {
  data: {
    //star
    stars: [2, 4, 6, 8, 10],
    normalSrc: '../../images/starG.png',
    selectedSrc: '../../images/star.png',
    halfSrc: '../../images/starH.png',
    tName: '',//控制footer
    id: null,
    loadidngHidden: false,
    bookData: null,
    totalComments:0,
    commentsData: [],
    commentsRating: []
  },
  onLoad: function( option ) {
    this.setData({
      id: option.id
    });
  },

  //share
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
  },
  
  onReady: function() {
    var id = this.data.id;
    var _this = this;
    requests.requestBookDokDetail(
      id, 
      { fields: 'image,images,summary,publisher,title,rating,pubdate,author,author_intro,catalog,price'}, 
      ( data ) => {

        data.rating.average = parseFloat(data.rating.average);

        _this.setData({
          bookData: data
        });
        console.log(typeof (_this.data.bookData.rating.average));
        getComments.call(this);
    }, () => {
      wx.navigateBack();
    }, () => {
      _this.setData( {
        loadidngHidden: true
      });

      setTimeout(
        _this.setData({
          tName: 'foot'
        }), 1000);

    });
  }
});

function getComments() {
  requests.requestBookComments(this.data.id, { count: 10 }, (data) => {
    if (data.total == 0) {
      //没有记录
      this.setData({ totalComments: 0 });
    } else {
      var rating = [];
      for (var i = 0; i < data.comments.length; i++) {
        if(undefined!=data.comments[i].rating){
          rating[i] = parseInt(data.comments[i].rating.value);
        }else{
          rating[i] = -1;
        }
        // data.comments[i].rating.value = parseInt(data.comments[i].rating.value);
      }
      this.setData({ 
        totalComments: data.total,
        commentsData : data.comments,
        commentsRating: rating
      });
      console.log(commentsRating);
    }
  }, () => {
    // wx.navigateBack();
    console.log('e');
  }, () => {
    console.log('c');
  });
}