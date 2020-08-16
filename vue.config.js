const path = require('path');

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  "publicPath": process.env.VUE_APP_PUBLIC_PATH,
  "transpileDependencies": [
    "vuetify"
  ],
};

