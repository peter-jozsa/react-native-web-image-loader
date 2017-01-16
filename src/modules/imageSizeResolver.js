// @flow

import sizeOf from 'image-size'

module.exports = function( path: string ): { width: number, height: number } {
    return sizeOf( path )
}
