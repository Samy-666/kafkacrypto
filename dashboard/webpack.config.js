module.exports = {
    module: {
      rules: [
        {
          test: /\.csv$/,
          use: [
            {
              loader: 'csv-loader',
              options: {
                header: true,
                skipEmptyLines: true
              }
            }
          ]
        }
      ]
    }
  };