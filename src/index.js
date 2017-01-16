// @flow

import path from 'path'
import fs from 'fs'
import ImageSizeResolver from './modules/imageSizeResolver'
import resolveScaledImages from './modules/scaledImageResolver'
import { readFileAsync } from './modules/asyncFs'
import { createImageWrapper } from './modules/imageWrapper'
import loaderUtils from 'loader-utils'

const DEFAULT_IMAGE_CLASS_PATH = require.resolve( './modules/adaptiveImage' )
const DEFAULT_IMAGE_NAME_FORMAT = '[hash].[ext]'
const DEFAULT_SCALINGS = { '@2x': 2, '@3x': 3 }

module.exports = async function( content: Buffer ) {
    const callback = this.async();
    if( this.cacheable ) this.cacheable()

    const query = loaderUtils.parseQuery( this.query )
    const wrapper = createImageWrapper( loaderUtils.stringifyRequest( this, query.imageClassPath || DEFAULT_IMAGE_CLASS_PATH ) )
    const nameFormat = query.name || DEFAULT_IMAGE_NAME_FORMAT
    const scalings = query.scalings || DEFAULT_SCALINGS
    const size = ImageSizeResolver( this.resourcePath )
    const url = loaderUtils.interpolateName( this, nameFormat, {
        context: this.context,
        content
    })
    const result = {
        '@1x': `__webpack_public_path__ + ${JSON.stringify( url )}`
    }

    this.emitFile( url, content )

    try {
        const resolvedFiles = await resolveScaledImages( this.resourcePath, scalings )

        for( let key in resolvedFiles ) {
            try {
                const fileContent = await readFileAsync( resolvedFiles[key] )
                const fileName = loaderUtils.interpolateName( this, nameFormat, {
            		context: this.context,
            		content: fileContent
            	})
                const publicPath = `__webpack_public_path__ + ${JSON.stringify( fileName )}`

                this.emitFile( fileName, fileContent )
                result[`@${scalings[key]}x`] = publicPath
            } catch( e ) {
                console.error( e )
            }
        }
    } catch( e ) {
        console.error( e )
    }

    callback( null, wrapper( size, result ) )
}

module.exports.raw = true
