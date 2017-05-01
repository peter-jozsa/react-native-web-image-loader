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
        loaders: [
            {
                test: /\.(png|jpe?g|gif)$/,
                loader: 'react-native-web-image-loader?name=[hash].[ext]'
            }
        ]
    }
}
```

You're done.

## Configuration

The following configuration variables can be defined:
* `name` The name template of the output files. (default: `[hash].[ext]`) You can use the following placeholders:
  * `[ext]` the extension of the resource
  * `[name]` the basename of the resource
  * `[path]` the path of the resource relative to the `context` query parameter or option.
  * `[hash]` the hash of the content, `hex`-encoded `md5` by default
* `imageClassPath` the path of image class that should be used instead of AdaptiveImage. This gives you the possibility to use your own image class representation.
* `scalings` is an object where the keys are the possible filename suffixes and values are the amount of scale. (Default is `{"@2x": 2, "@3x": 3}`, which means filenames ending with "@2x" will be used on devices where the pixel-ratio is 2)

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
    loaders: [
        {
            test: /\.(png|jpe?g|gif)$/,
            loader: 'react-native-web-image-loader?name=[name].[ext]&scalings[@2x]=2&scalings[-3x]=3'
        }
    ]
}
```

index.js
```javascript
import React from 'react'
import { Image } from 'react-native-web'

export default class Picture extends React.Component {
    render() {
        return (
            <Image source={require( './assets/pic1.png' )} />
        )
    }
}
```
Value of source property looks like this:
```javascript
AdaptiveImage {
    "data": {
        "uri": "pic1.png",
        "uri@2x": "pic1@2x.png",
        "uri@3x": "pic1-3x.png",
        "width": 128,
        "height": 64
    },
    get uri(),       // returns uri based on pixel ratio
    get width(),     // returns this.data.width
    get height(),    // returns this.data.height
}
```

So when Image component resolves source it will treat it as a normal object. But value of uri is dynamically returned according to current device pixel ratio.
