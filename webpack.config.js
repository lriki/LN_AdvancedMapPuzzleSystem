
const webpack = require('webpack');
const fs = require('fs');

module.exports = {
    //mode: 'production',
    mode: 'development',
    entry: './ts/index.ts', //ファイルをまとめる際のエントリーポイント
    output: {
        path: __dirname,
        filename: './js/plugins/LN_AdvancedMapPuzzleSystem.js' //まとめた結果出力されるファイル名
    },
    resolve: {
        extensions: ['.ts', '.js'] //拡張子がtsだったらTypescirptでコンパイルする
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader' //ts-loader使うよ
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin(
            {
                banner: fs.readFileSync("./header.txt").toString(),
                //(v) => {
                 //   let text = fs.readFileSync("./header.txt");
                 //   console.log(text);
                 //   return;
                //},
                raw: true,
                entryOnly: true
            }
        )
    ]
}
