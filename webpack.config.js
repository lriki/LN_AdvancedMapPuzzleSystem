
const webpack = require('webpack');
const fs = require('fs');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const METADATA = fs.readFileSync("./header.txt").toString();

module.exports = {
    mode: 'production',
    //mode: 'development',
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
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    output: {
                        beautify: false,
                        preamble: METADATA,
                    },
                },
            }),
        ],
    },
    plugins: [
        new webpack.BannerPlugin(
            {
                banner: METADATA,
                raw: true,
                entryOnly: true
            }
        )
    ]
}
