const API_BASE = "https://api.douban.com/v2/book";

module.exports = {
  API_BOOK_SEARCH: API_BASE + "/search",
  API_BOOK_DETAIL: API_BASE + "/:id",
  API_BOOK_ISBN: API_BASE + "/isbn/:name",
  API_BOOK_TAG: API_BASE + "/search?tag=:tag&count=:count",
  API_BOOK_COMMENT: API_BASE + "/:id/comments?count=:count",

  test:"https://read.douban.com/j/article_v2/get_reader_data"
  /**
   * 以下为test post请求时的参数
   * aid:32890883
     reader_data_version:v13
   */
}

//https://api.douban.com/v2/book/search?tag=热门&count=5
//https://api.douban.com/v2/book/search?tag=推荐&count=5
