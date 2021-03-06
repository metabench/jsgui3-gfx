
//const gm = require('gm');
// That would mean server side only
// gfx is both for client and server.

const gfx = {
    Pixel_Pos_List: require('./pixel-pos-list'),
    Pixel_Buffer: require('./pixel-buffer'),
    convolution_kernels: require('./convolution-kernels/kernels'),
    ta_math: require('./ta-math')
}

module.exports = gfx;