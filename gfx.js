
//const gm = require('gm');
// That would mean server side only
// gfx is both for client and server.

const {Pixel_Pos_List, Pixel_Buffer, convolution_kernels, ta_math} = require('jsgui3-gfx-core');

// And will do something that makes use of the formats before long.

// And functions like save_pixel_buffer too...?
//  They are only on the server version (for the moment).
//  Need to see if we can put the file together, then save with fnl.







const gfx = {
    Pixel_Pos_List,
    Pixel_Buffer,
    convolution_kernels,
    ta_math,
}

module.exports = gfx;