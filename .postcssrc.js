// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {
      "browsers": [
        "> 1%",
        "iOS >= 7",
        "Android >= 4.1",
        "not ie <= 8"
      ]
    }
  }
}
