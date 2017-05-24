const API_BASE = "https://api.douban.com/v2/book";

module.exports = {
  API_BOOK_SEARCH: API_BASE + "/search",
  API_BOOK_DETAIL: API_BASE + "/:id",
  API_BOOK_ISBN: API_BASE + "/isbn/:name",
  API_BOOK_TAG: API_BASE + "/search?tag=:tag&count=:count"
}

//https://api.douban.com/v2/book/search?tag=热门&count=5
//https://api.douban.com/v2/book/search?tag=推荐&count=5
