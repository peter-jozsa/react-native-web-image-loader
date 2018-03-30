// @flow

export const createImageWrapper = ( classPath: string ) => ( size: { width: number, height: number }, images: { '@1x': string, '@2x'?: string, '@3x'?: string } ) => {
    const uri = `${images['@1x']}`

    delete images['@1x']

    let scalings = []

    for( let scaling in images ) {
        scalings.push( `"uri${scaling}": ${images[scaling]},` )
    }

    return `var AdaptiveImage = require( ${classPath} );

module.exports = new AdaptiveImage({
    uri: ${uri},${scalings.join('')}
    width: ${size.width},
    height: ${size.height},
    scales: [1]
});`
}
