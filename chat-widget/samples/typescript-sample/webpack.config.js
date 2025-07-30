
const path = require("path");

const disableFullyQualifiedNameResolutions = {
    test: /\.m?js/,
    resolve: {
        fullySpecified: false,
    },
};

const babelLoaderConfiguration = {
    test: /\.(ts|js)x?$/,
    exclude: /node_modules/,
    use: {
        loader: "babel-loader",
        options: {
            presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
            ],
        },
    }
};

const config = {
    entry: "./src/index.tsx",
    mode: "development",
    devServer: {
        client: {
            overlay: false, // Disable the error overlay
        },
    },
    module: {
        rules: [
            babelLoaderConfiguration,
            disableFullyQualifiedNameResolutions
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            "react-native$": "react-native-web",
            "react-native": "react-native-web",
            // Force all React imports to use the same version
            "react": path.resolve(__dirname, "node_modules/react"),
            "react-dom": path.resolve(__dirname, "node_modules/react-dom")
        },
        fallback: {
            assert: "assert",
            crypto: "crypto-browserify",
            stream: "stream-browserify"
        },
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    // plugins: [
    //     new CopyWebpackPlugin({
    //         patterns: [
    //             {
    //                 from: path.resolve(__dirname, "public"),
    //                 to: path.resolve(__dirname, "dist"),
    //             },
    //         ],
    //     }),
    // ]
};

module.exports = config;
