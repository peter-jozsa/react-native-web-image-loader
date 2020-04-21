# React Native Web Image Loader

Using this loader will automatically bundle scaled counterparts too. Since Image component of react-native-web accepts objects as value of its source property it is possible to display scaled images based on device pixel ratio.

This loader will inject an AdaptiveImage class into your bundle. Everywhere you require an image an instance of AdaptiveImage will be returned.

This is my first node.js package so every recommendation is welcome. :smile:

## Installation

Install it via npm:

```terminal
$ npm install --save-dev react-native-web-image-loader
```

## Usage

In your webpack config use it as a loader for images:

```javascript
{
  ...,
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/,
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
          // publicPath: 'https://cdn.example.com/', // uncomment to override webpack public path
          // esModule: true
          scalings: { '@2x': 2, '@3x': 3 },
        },
        loader: 'react-native-web-image-loader',
      },
    ]
  }
}
```

You're done.

## Configuration

The following configuration variables can be defined in the `options` object:

- `name` The name template of the output files. (default: `[hash].[ext]`) You can use the following placeholders:
  - `[ext]` the extension of the resource
  - `[name]` the basename of the resource
  - `[path]` the path of the resource relative to the `context` query parameter or option.
  - `[hash]` the hash of the content, `hex`-encoded `md5` by default
- `scalings` is an object where the keys are the possible filename suffixes and values are the amount of scale. (Default is `{"@2x": 2, "@3x": 3}`, which means filenames ending with "@2x" will be used on devices where the pixel-ratio is 2)
- `imageClassPath` the path of image class that should be used instead of AdaptiveImage. This gives you the possibility to use your own image class representation.
- `publicPath` Specifies a custom public path for the target file(s). Default: `__webpack_public_path__ + outputPath`. You dynamically set custom public path by passing a function.
- `outputPath` Specify a filesystem path where the target file(s) will be placed.
- `esModule` By default, `react-native-web-image-loader` generates JS modules that use the ES modules syntax. You can disable it by setting its value to `false`.

## Examples

We have the following files:

```
|--assets/
   |-- pic1.png
   |-- pic1@2x.png
   |-- pic1-3x.png
|--index.js
```

webpack.config.js

```javascript
module.exports = {
    ...,
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif)$/,
          options: {
            name: 'static/media/[name].[hash:8].[ext]',
            scalings: { '@2x': 2, '@3x': 3 },
          },
          loader: 'react-native-web-image-loader',
        },
      ]
    }
}
```

index.js

```javascript
import React from 'react'
import { Image } from 'react-native-web'

export default class Picture extends React.Component {
  render() {
    return <Image source={require('./assets/pic1.png')} />
  }
}
```

Value of source property looks like this:

```javascript
AdaptiveImage {
    "data": {
        "uri": "static/media/pic1.abcd1234.png",
        "uri@2x": "static/media/pic1@2x.4321dcba.png",
        "uri@3x": "static/media/pic1-3x.efgh5678.png",
        "width": 128,
        "height": 64
    },
    get uri(),       // returns uri based on pixel ratio
    get width(),     // returns this.data.width
    get height(),    // returns this.data.height
}
```

So when Image component resolves source it will treat it as a normal object. But value of uri is dynamically returned according to current device pixel ratio.
