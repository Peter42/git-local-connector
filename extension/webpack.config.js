
module.exports = {
    "mode": "development",
    "entry": {
        "github": "./src/github.ts",
        "gitlab": "./src/gitlab.ts"
    },
    "output": {
        "path": __dirname + '/dist',
        "filename": "[name].js"
    },
    "devtool": "source-map",
    "module": {
        "rules": [
            {
                "test": /\.tsx?$/,
                "exclude": /node_modules/,
                "use": {
                    "loader": "ts-loader",
                    "options": {
                        "transpileOnly": true
                    }
                }
            }
        ]
    },
    "resolve": {
        "extensions": ['.ts', '.d.ts', '.js', '.json']
    }
}