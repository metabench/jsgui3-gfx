// not sure about having this hold indexed color.
//  by its name it seems as though it should be able to.
//  using indexed color mode.
//   rgba, rgb, indexed rgb, indexed rgba
//              irgb, irgba
//  and then there is bit_depth.
//              bits_per_pixel may make sense.

// Will just have this as a pixel value buffer.
//  Can have an image-buffer if its more advanced.
// Will be used to hold, and as the basis for basic processing on PNG images.
//  Also want to make some pixel buffer manipulation modules.
// jsgui-node-pixel-buffer-manipulate (maybe not manipulate - could imply it changes data when it does not always?)
//  filters
//  masks? feature detection?
// jsgui-node-pixel-buffer-filter
// jsgui-node-pixel-buffer-processing
// want to do convolutions on the pixel buffer

const lang = require('lang-mini');

const {
    each,
    fp,
    tof,
    get_a_sig
} = lang;


const Core = require('./pixel-buffer-core');

// Core


// Mixins
//  Could make them for functions of some categories, and larger functions.
//   Would help to make it replacable with more optimized functions.

// Advanced / Enh




class Pixel_Buffer_Enh extends Core {

    // Setting bits per pixel to 8
    //  greyscale 256

    constructor(spec) {
        //spec.__type_name = spec.__type_name || 'pixel_buffer';
        super(spec);
        
    }
    // each_pixel((x, y, r, g, b, a, set, get_pixel_by_offset)


    // Custom convolution not working here.
    // Iterating pixels for the line joining convolution sounds best.
    // Custom convolution seems like the way to go, but it's hard to implement.

    _custom_convolve(dimension_size, cb) {
        if (dimension_size % 2 !== 1) {
            throw 'dimension_size must be an odd integer';
        }
        const px = new Uint16Array(2);
        const ta16 = new Int16Array(12);

        // pixel x
        // pixel y

        // w
        // h
        [ta16[2], ta16[3]] = this.size;

        // bytes per pixel
        ta16[4] = this.bytes_per_pixel;
        ta16[5] = ta16[2] * ta16[4] // bytes per row

        // 6 - x convolution point
        // 7 - y convolution point
        ta16[8] = dimension_size;
        ta16[9] = (ta16[8] - 1) / 2 // distance in direction.;

        ta16[10] = 0; // the write position of the convolution.
        // conve bytes per row
        ta16[11] = ta16[8] * ta16[4];

        // 32 bit
        // pixel_component_index i

        let ta32 = new Uint32Array(4);
        ta32[0] = 0; // central pixel component index
        ta32[1] = 0; // convolution pixel component index

        ta32[2] = ta16[2] * ta16[3] * ta16[4] // image length in bytes


        // a result object that is just declared once...

        // conv pixel component write position

        let conv_pixels = new Uint8Array(ta16[8] * ta16[8] * ta16[8]);
        const buffer = this.buffer;
        // an x, y iteration would be better still...

        for (px[1] = 0; px[1] < ta16[3]; px[1]++) {
            for (px[0] = 0; px[0] < ta16[2]; px[0]++) {

                // check if its within bounds...
                ta16[6] = px[0] - ta16[8];

                //console.log('ta16[6]', ta16[6]);

                if (ta16[6] > 0 && ta16[6] < ta16[2] - ta16[8]) {
                    ta16[7] = px[1] - ta16[8];
                    //console.log('ta16[7]', ta16[7]);
                    if (ta16[7] > 0 && ta16[7] < ta16[3] - ta16[8]) {

                        // doing ok, convolution matrix is within bounds.
                        //  copy by providing a reference to the underlying data?

                        // move to the start of the convolution.
                        //  loop by convolution row length would be best.

                        //console.log('');
                        //console.log('ta16[9]', ta16[9]);
                        //console.log('ta16[4]', ta16[4]);
                        //console.log('ta16[5]', ta16[5]);

                        ta32[1] = ta32[0] - /* w */ ta16[9] * ta16[4] - /* h */ ta16[9] * ta16[5];
                        //console.log('ta32[0]', ta32[0]);
                        //console.log('ta32[1]', ta32[1]);
                        ta16[10] = 0;

                        // Need to loop on the right variable - the convolution y point


                        for (ta16[7] = ta16[1]; ta16[7] < ta16[1] + ta16[8]; ta16[7]++) {
                            // then copy the row to the typed array
                            //console.log('ta32[1]', ta32[1]);
                            //console.log('ta16[7]', ta16[7]);
                            //console.log('ta16[8]', ta16[8]);
                            //console.log('ta16[10]', ta16[10]);
                            //console.log('ta16[11]', ta16[11]);

                            // 
                            //buffer.copy(conv_pixels, ta32[1], ta16[10], ta16[10] + ta16[11]);

                            let sl = buffer.slice(ta32[1], ta32[1] + ta16[11]);

                            // then copy the slice...

                            // convolution write index

                            console.log('px', px);

                            for (let c = 0; c < ta16[11]; c++) {
                                conv_pixels[ta16[10] + c] = sl.readUInt8(c);
                            }

                            ta16[10] += ta16[11];
                            ta32[1] += ta16[5];

                            // ta32[1] = 

                        }
                        cb(px, conv_pixels);
                    }
                }
                ta32[0] += ta16[4];
            }
        }
        // iterate through the pixels...

        // get pixel index
        // start a loop 
    }


    get_first_pixel_matching_color(r, g, b, a) {
        let px = 0, py = 0;
        let [w, h] = this.size;
        let found = false;
        let buf = this.buffer;
        let pos_buf = 0;

        for (py = 0; !found && py < h; py++) {
            for (px = 0; !found && px < w; px++) {
                //console.log('buf[pos_buf]', buf[pos_buf]);
                //console.log('buf[pos_buf + 1]', buf[pos_buf + 1]);
                //console.log('buf[pos_buf + 2]', buf[pos_buf + 2]);
                //console.log('buf[pos_buf + 3]', buf[pos_buf + 3]);
                if (buf[pos_buf] === r && buf[pos_buf + 1] === g && buf[pos_buf + 2] === b && buf[pos_buf + 3] === a) {
                    found = true;
                }
                pos_buf += 4;
            }
        }
        //console.log('found', found);
        if (found) {
            return [px, py];
        }
    }

    apply_mask(pb_mask, mr, mg, mb, ma) {
        let res = this.blank_copy();
        res.flood_fill(0, 0, 255, 255, 255, 255);
        let px;
        pb_mask.each_pixel((x, y, r, g, b, a) => {
            if (r === mr && g === mg && b === mb && a === ma) {
                px = this.get_pixel(x, y);
                res.set_pixel(x, y, px[0], px[1], px[2], px[3])
            }
        })
        return res;
    }


    'flood_fill_small_color_blocks'(max_size, r, g, b, a) {
        // scans the whole document
        //  like despeckle.
        // Could do much faster iteration here,
        //  will test the size of a color block before flood filling
        // Could make a map of color block sizes
        // This is quite useful for despeckling.

        this.each_pixel((x, y, pr, pg, pb, pa) => {
            if ((r !== pr || g !== pg || b !== pb || a !== pa)) {
                let s = this.measure_color_region_size(x, y, max_size);
                if (s < max_size) {
                    this.flood_fill(x, y, r, g, b, a);
                }
            }
            //if ((r === 255 && g === 255 && b === 255 && a === 255)) {

            // find out the color region size

            // is colour region size at least ...
            // measure_colour_region_size...


            //  can't do that for each pixel!

            //console.log('s', s);


            //}
        })

        // iterate the x, y

        // find the color block 


    }

    'replace_color'(r, g, b, a, tr, tg, tb, ta) {
        // Iterate over all pixels

        // any pixels matching the given color, replace it with the target colors.

        // iterate through all pixels

        const buf_read = this.buffer;

        let ta_u8 = new Uint8Array(8);
        ta_u8[0] = r;
        ta_u8[1] = g;
        ta_u8[2] = b;
        ta_u8[3] = a;
        ta_u8[4] = tr;
        ta_u8[5] = tg;
        ta_u8[6] = tb;
        ta_u8[7] = ta;

        //console.log('ta_u8', ta_u8);
        //throw 'stop';

        const ta_16_scratch = new Uint32Array(8);
        ta_16_scratch[0] = 0; // read pos
        ta_16_scratch[2] = buf_read.length;

        while (ta_16_scratch[0] < ta_16_scratch[2]) {
            //console.log('ta_u8', ta_u8);


            if (buf_read[ta_16_scratch[0]] === ta_u8[0] && buf_read[ta_16_scratch[0] + 1] === ta_u8[1] && buf_read[ta_16_scratch[0] + 2] === ta_u8[2] && buf_read[ta_16_scratch[0] + 3] === ta_u8[3]) {
                buf_read[ta_16_scratch[0]] = ta_u8[4];
                buf_read[ta_16_scratch[0] + 1] = ta_u8[5];
                buf_read[ta_16_scratch[0] + 2] = ta_u8[6];
                buf_read[ta_16_scratch[0] + 3] = ta_u8[7];
                //console.log('written');

                //console.log('buf_read[ta_16_scratch[0]]', buf_read[ta_16_scratch[0]]);
                //console.log('buf_read[ta_16_scratch[0] + 1]', buf_read[ta_16_scratch[0] + 1]);
                ///console.log('buf_read[ta_16_scratch[0] + 2]', buf_read[ta_16_scratch[0] + 2]);
                //console.log('buf_read[ta_16_scratch[0] + 3]', buf_read[ta_16_scratch[0] + 3]);
                //buf_write[ta_16_scratch[1]++] = 0;
                //buf_write[ta_16_scratch[1]++] = 0;
                //buf_write[ta_16_scratch[1]++] = 0;
                //buf_write[ta_16_scratch[1]++] = 255;
            } else {
                //buf_write[ta_16_scratch[1]++] = 255;
                //buf_write[ta_16_scratch[1]++] = 255;
                //buf_write[ta_16_scratch[1]++] = 255;
                //buf_write[ta_16_scratch[1]++] = 255;
                //ta_16_scratch[1] += 4;
            }
            ta_16_scratch[0] += 4;
        }
    }

    'get_single_color_mask_32'(r, g, b, a) {
        // Less effiient still - want 1 bit image, not using 8 bit, using 32 bit.

        // read pixel index
        // write pixel index
        //console.log('get_single_color_mask_32');
        //console.log('this.buffer.length', this.buffer.length);

        // Create 8 bit result image. 1 bit would be preferable but unsure about it.


        var res = new this.constructor({
            'size': this.size,
            'bits_per_pixel': 32
        });
        res.buffer.fill(0);

        const buf_read = this.buffer;
        const buf_write = res.buffer;

        const ta_16_scratch = new Uint32Array(8);
        ta_16_scratch[0] = 0; // read pos
        ta_16_scratch[1] = 0; // write pos
        ta_16_scratch[2] = buf_read.length;
        ta_16_scratch[3] = buf_write.length;

        let ta_u8 = new Uint8Array(4);
        ta_u8[0] = r;
        ta_u8[1] = g;
        ta_u8[2] = b;
        ta_u8[3] = a;

        //console.log('ta_16_scratch[0]', ta_16_scratch[0]);
        //console.log('ta_16_scratch[2]', ta_16_scratch[2]);

        while (ta_16_scratch[0] < ta_16_scratch[2]) {
            //console.log('ta_u8', ta_u8);
            if (buf_read[ta_16_scratch[0]] === ta_u8[0] && buf_read[ta_16_scratch[0] + 1] === ta_u8[1] && buf_read[ta_16_scratch[0] + 2] === ta_u8[2] && buf_read[ta_16_scratch[0] + 3] === ta_u8[3]) {
                buf_write[ta_16_scratch[1]++] = 0;
                buf_write[ta_16_scratch[1]++] = 0;
                buf_write[ta_16_scratch[1]++] = 0;
                buf_write[ta_16_scratch[1]++] = 255;
            } else {


                buf_write[ta_16_scratch[1]++] = 255;
                buf_write[ta_16_scratch[1]++] = 255;
                buf_write[ta_16_scratch[1]++] = 255;
                buf_write[ta_16_scratch[1]++] = 255;
                //ta_16_scratch[1] += 4;
            }
            ta_16_scratch[0] += 4;

        }
        // Traverse the image quickly
        return res;


    }

    count_pixels_with_color(r, g, b, a) {
        // This will be a somewhat optimized function.

        // Try a few function calls within this.

        // just iterate through the pixels.
        const buf_read = this.buffer;
        const scratch_32 = new Uint32Array(5);
        //scratch_32[0] = 0;
        scratch_32[0] = 0; // read pos
        //scratch_32[1] = 0; // write pos
        scratch_32[2] = buf_read.length;
        //scratch_32[3] = buf_write.length;
        scratch_32[4] = 0;
        //scratch_32[0] = 0; // read pos
        //scratch_32[1] = 0; // write pos


        //const buf_write = res.buffer;

        const ta_16_scratch = new Uint16Array(8);
        //ta_16_scratch[0] = 0; // read pos
        //ta_16_scratch[1] = 0; // write pos
        //ta_16_scratch[2] = buf_read.length;
        //ta_16_scratch[3] = buf_write.length;

        let ta_u8 = new Uint8Array(4);
        ta_u8[0] = r;
        ta_u8[1] = g;
        ta_u8[2] = b;
        ta_u8[3] = a;

        while (scratch_32[0] < scratch_32[2]) {
            if (buf_read[scratch_32[0]++] === ta_u8[0] && buf_read[scratch_32[0]++] === ta_u8[1] && buf_read[scratch_32[0]++] === ta_u8[2] && buf_read[scratch_32[0]++] === ta_u8[3]) {
                //buf_write[ta_16_scratch[1]] = 255;
                scratch_32[4]++;
            }
            //scratch_32[1]++;
        }
        // Traverse the image quickly

        return scratch_32[4];

    }

    // Get as 32 bit bitmap... inefficient.
    'get_single_color_mask'(r, g, b, a) {
        // read pixel index
        // write pixel index

        // Create 8 bit result image. 1 bit would be preferable but unsure about it.
        var res = new this.constructor({
            'size': this.size,
            'bits_per_pixel': 8
        });
        res.buffer.fill(0);

        const buf_read = this.buffer;
        const buf_write = res.buffer;

        const ta_16_scratch = new Uint16Array(8);
        ta_16_scratch[0] = 0; // read pos
        ta_16_scratch[1] = 0; // write pos
        ta_16_scratch[2] = buf_read.length;
        ta_16_scratch[3] = buf_write.length;

        let ta_u8 = new Uint8Array(4);
        ta_u8[0] = r;
        ta_u8[1] = g;
        ta_u8[2] = b;
        ta_u8[3] = a;

        while (ta_16_scratch[0] < ta_16_scratch[2]) {
            if (buf_read[ta_16_scratch[0]++] === ta_u8[0] && buf_read[ta_16_scratch[0]++] === ta_u8[1] && buf_read[ta_16_scratch[0]++] === ta_u8[2] && buf_read[ta_16_scratch[0]++] === ta_u8[3]) {
                buf_write[ta_16_scratch[1]] = 255;
            }
            ta_16_scratch[1]++;
        }
        // Traverse the image quickly
        return res;
    }

    // get mask by color

    // greyscale pixel buffer would help a lot
    //  discard alpha

    'measure_color_region_size'(x, y, max) {
        const buffer = this.buffer;
        //let pixel_buffer_pos = this.bytes_per_pixel * (x + y * this.size[0]);


        // Could make a large typed array buffer of pixels to visit

        // An already visited typed array.

        const scratch_32 = new Uint32Array(16);
        // w, h
        scratch_32[0] = this.size[0]; // w
        scratch_32[1] = this.size[1]; // h
        scratch_32[2] = scratch_32[0] * scratch_32[1];
        scratch_32[3] = this.bytes_per_pixel;
        // 4 x, 5 y

        scratch_32[6] = 0 // position within visiting pixels
        scratch_32[7] = 0 // Maximum pixel pos starting index
        scratch_32[8] = 0 // pixel_buffer_pos
        scratch_32[9] = max;
        const ta8_pixels = new Uint8Array(12);
        scratch_32[10] = 0 // count pix3els visited

        // 0, 1, 2, 3    start color
        // 4, 5, 6, 7    px color
        // 8, 9, 10, 11  fill color

        //ta8_pixels[8] = r;
        //ta8_pixels[9] = g;
        //ta8_pixels[10] = b;
        //ta8_pixels[11] = a;

        const ta16_pixels = new Uint8Array(4);
        const ta_pixels_visited = new Uint8Array(scratch_32[2]);
        // Initialise a sequence position buffer that's as long as the whole image

        const ta_visiting_pixels = new Uint16Array(scratch_32[2] * 2);
        // x y coords

        scratch_32[8] = scratch_32[3] * (x + (y * scratch_32[0]));

        //const c_start = new Uint8Array([buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++)]);
        ta8_pixels[0] = buffer.readUInt8(scratch_32[8]++);
        ta8_pixels[1] = buffer.readUInt8(scratch_32[8]++);
        ta8_pixels[2] = buffer.readUInt8(scratch_32[8]++);
        ta8_pixels[3] = buffer.readUInt8(scratch_32[8]++);

        //console.log('c_start', c_start);

        // add the first pixel
        ta_visiting_pixels[0] = x;
        ta_visiting_pixels[1] = y;
        scratch_32[7] = 2;

        //console.log('scratch_32[6]', scratch_32[6]);
        //console.log('scratch_32[7]', scratch_32[7]);

        while (scratch_32[6] < scratch_32[7] && scratch_32[10] < scratch_32[9]) {
            // 
            //console.log('scratch_32[6]', scratch_32[6]);
            //[x, y] = arr_pixels_to_visit[c_visited];
            scratch_32[4] = ta_visiting_pixels[scratch_32[6]++]; // x
            scratch_32[5] = ta_visiting_pixels[scratch_32[6]++]; // y

            // x + (w * y)
            //ta_pixels_visited[scratch_32[4] + (scratch_32[0] * scratch_32[5])] = 255;

            //console.log('c_visited', c_visited);
            //map_pixels_visited[[x, y]] = true;
            //console.log('[x, y]', [x, y]);

            // Check this pixel...
            //let pixel_buffer_pos = this.bytes_per_pixel * (x + y * this.size[0]);
            scratch_32[8] = scratch_32[3] * (scratch_32[4] + (scratch_32[5] * scratch_32[0]));

            //const [pr, pg, pb, pa] = 
            //const c_px = new Uint8Array([buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++)]);
            ta8_pixels[4] = buffer.readUInt8(scratch_32[8]++);
            ta8_pixels[5] = buffer.readUInt8(scratch_32[8]++);
            ta8_pixels[6] = buffer.readUInt8(scratch_32[8]++);
            ta8_pixels[7] = buffer.readUInt8(scratch_32[8]++);

            //console.log('c_px', c_px);
            // then the difference from the start colors

            //const c_diff = new Uint8Array([c_start[0] - c_px[0], c_start[1] - c_px[1], c_start[2] - c_px[2], c_start[3] - c_px[3]]);
            ta16_pixels[0] = ta8_pixels[4] - ta8_pixels[0];
            ta16_pixels[1] = ta8_pixels[5] - ta8_pixels[1];
            ta16_pixels[2] = ta8_pixels[6] - ta8_pixels[2];
            ta16_pixels[3] = ta8_pixels[7] - ta8_pixels[3];

            // The differences between this and the starting pixel.

            //console.log('c_diff', c_diff);
            if (ta16_pixels[0] === 0 && ta16_pixels[1] === 0 && ta16_pixels[2] === 0 && ta16_pixels[3] === 0) {
                // No color change
                //  So change the color
                //scratch_32[8] -= 4;
                //buffer.writeUInt8(ta8_pixels[8], scratch_32[8]++);
                //buffer.writeUInt8(ta8_pixels[9], scratch_32[8]++);
                //buffer.writeUInt8(ta8_pixels[10], scratch_32[8]++);
                //buffer.writeUInt8(ta8_pixels[11], scratch_32[8]++);

                // Add adjacent pixels to the queue
                //  if they've not been visited before.

                // ta_pixels_visited[scratch_32[4] + (scratch_32[0] * scratch_32[5])]

                if (scratch_32[4] - 1 >= 0 && scratch_32[4] - 1 < scratch_32[0] && ta_pixels_visited[scratch_32[4] - 1 + (scratch_32[0] * scratch_32[5])] === 0) {
                    ta_visiting_pixels[scratch_32[7]++] = scratch_32[4] - 1;
                    ta_visiting_pixels[scratch_32[7]++] = scratch_32[5];

                    ta_pixels_visited[scratch_32[4] - 1 + (scratch_32[0] * scratch_32[5])] = 255;

                    //scratch_32[10]++;
                    //arr_pixels_to_visit.push([scratch_32[4] - 1, scratch_32[5]]);
                }

                if (scratch_32[5] - 1 >= 0 && scratch_32[5] - 1 < scratch_32[1] && ta_pixels_visited[scratch_32[4] + (scratch_32[0] * (scratch_32[5] - 1))] === 0) {
                    ta_visiting_pixels[scratch_32[7]++] = scratch_32[4];
                    ta_visiting_pixels[scratch_32[7]++] = scratch_32[5] - 1;
                    //scratch_32[10]++;
                    //arr_pixels_to_visit.push([scratch_32[4], scratch_32[5] - 1]);

                    ta_pixels_visited[scratch_32[4] + (scratch_32[0] * (scratch_32[5] - 1))] = 255;
                }
                if (scratch_32[4] + 1 >= 0 && scratch_32[4] + 1 < scratch_32[0] && ta_pixels_visited[scratch_32[4] + 1 + (scratch_32[0] * scratch_32[5])] === 0) {
                    ta_visiting_pixels[scratch_32[7]++] = scratch_32[4] + 1;
                    ta_visiting_pixels[scratch_32[7]++] = scratch_32[5];
                    //scratch_32[10]++;
                    //arr_pixels_to_visit.push([scratch_32[4] + 1, scratch_32[5]]);

                    ta_pixels_visited[scratch_32[4] + 1 + (scratch_32[0] * scratch_32[5])] = 255
                }
                if (scratch_32[5] + 1 >= 0 && scratch_32[5] + 1 < scratch_32[1] && ta_pixels_visited[scratch_32[4] + (scratch_32[0] * (scratch_32[5] + 1))] === 0) {
                    ta_visiting_pixels[scratch_32[7]++] = scratch_32[4];
                    ta_visiting_pixels[scratch_32[7]++] = scratch_32[5] + 1;
                    //scratch_32[10]++;
                    //arr_pixels_to_visit.push([scratch_32[4], scratch_32[5] + 1]);

                    ta_pixels_visited[scratch_32[4] + (scratch_32[0] * (scratch_32[5] + 1))] = 255
                }
            }

            scratch_32[10]++;

            // compare these arrays

            // Add adjacent pixels to the stack?
            //c_visited++;
            //scratch_32[7] += 2;
        }
        return scratch_32[10]; //scratch_32[10];

        //console.log('scratch_32[6]', scratch_32[6]);
        //console.log('c_visited', c_visited);
    }


    // flood fill
    // No toloerance for the moment
    'flood_fill'(x, y, r, g, b, a) {

        // stack of pixels to visit
        // map of pixels visited
        // Could optimize this with typed arrays


        //const [w, h] = this.size;

        const [w, h] = this.size;

        let fast_stacked_mapped_flood_fill = () => {
            //const map_pixels_visited = {};
            //const arr_pixels_to_visit = [[x, y]];
            //let c_visited = 0;
            const buffer = this.buffer;

            //let pixel_buffer_pos = this.bytes_per_pixel * (x + y * this.size[0]);


            // Could make a large typed array buffer of pixels to visit

            // An already visited typed array.

            const scratch_32 = new Uint32Array(16);
            // w, h
            scratch_32[0] = this.size[0]; // w
            scratch_32[1] = this.size[1]; // h
            scratch_32[2] = scratch_32[0] * scratch_32[1];
            scratch_32[3] = this.bytes_per_pixel;
            // 4 x, 5 y

            scratch_32[6] = 0 // position within visiting pixels
            scratch_32[7] = 0 // Maximum pixel pos starting index
            scratch_32[8] = 0 // pixel_buffer_pos
            scratch_32[9] = 0 // c_visited

            const ta8_pixels = new Uint8Array(12);

            // 0, 1, 2, 3    start color
            // 4, 5, 6, 7    px color
            // 8, 9, 10, 11  fill color

            ta8_pixels[8] = r;
            ta8_pixels[9] = g;
            ta8_pixels[10] = b;
            ta8_pixels[11] = a;

            //const ta16_pixels = new Uint8Array(4);
            //console.log('scratch_32[2]', scratch_32[2]);
            const ta_pixels_visited = new Uint8Array(scratch_32[2]);
            // Initialise a sequence position buffer that's as long as the whole image
            const ta_visiting_pixels = new Uint16Array(scratch_32[2] * 2);
            // x y coords

            scratch_32[8] = scratch_32[3] * (x + (y * scratch_32[0]));

            //const c_start = new Uint8Array([buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++)]);
            ta8_pixels[0] = buffer[scratch_32[8]++];
            ta8_pixels[1] = buffer[scratch_32[8]++];
            ta8_pixels[2] = buffer[scratch_32[8]++];
            ta8_pixels[3] = buffer[scratch_32[8]++];

            //console.log('c_start', c_start);


            // add the first pixel
            ta_visiting_pixels[0] = x;
            ta_visiting_pixels[1] = y;
            scratch_32[7] = 2;

            //console.log('scratch_32[6]', scratch_32[6]);
            //console.log('scratch_32[7]', scratch_32[7]);

            //c_visited < 

            while (scratch_32[9] <= scratch_32[2]) {
                // 
                //console.log('scratch_32[6]', scratch_32[6]);
                //[x, y] = arr_pixels_to_visit[c_visited];
                scratch_32[4] = ta_visiting_pixels[scratch_32[6]++]; // x
                scratch_32[5] = ta_visiting_pixels[scratch_32[6]++]; // y

                // x + (w * y)
                //ta_pixels_visited[scratch_32[4] + (scratch_32[0] * scratch_32[5])] = 255;

                //console.log('c_visited', c_visited);
                //map_pixels_visited[[x, y]] = true;
                //console.log('[x, y]', [x, y]);

                // Check this pixel...
                //let pixel_buffer_pos = this.bytes_per_pixel * (x + y * this.size[0]);
                scratch_32[8] = scratch_32[3] * (scratch_32[4] + (scratch_32[5] * scratch_32[0]));


                //const [pr, pg, pb, pa] = 
                //const c_px = new Uint8Array([buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++)]);
                //ta8_pixels[4] = buffer.readUInt8(scratch_32[8]++);
                //ta8_pixels[5] = buffer.readUInt8(scratch_32[8]++);
                //ta8_pixels[6] = buffer.readUInt8(scratch_32[8]++);
                //ta8_pixels[7] = buffer.readUInt8(scratch_32[8]++);

                //ta8_pixels[4] = buffer[scratch_32[8]++];
                //ta8_pixels[5] = buffer[scratch_32[8]++];
                //ta8_pixels[6] = buffer[scratch_32[8]++];
                //ta8_pixels[7] = buffer[scratch_32[8]++];

                //console.log('c_px', c_px);
                // then the difference from the start colors

                //const c_diff = new Uint8Array([c_start[0] - c_px[0], c_start[1] - c_px[1], c_start[2] - c_px[2], c_start[3] - c_px[3]]);
                //ta16_pixels[0] = buffer[scratch_32[8]++] - ta8_pixels[0];
                //ta16_pixels[1] = buffer[scratch_32[8]++] - ta8_pixels[1];
                //ta16_pixels[2] = buffer[scratch_32[8]++] - ta8_pixels[2];
                //ta16_pixels[3] = buffer[scratch_32[8]++] - ta8_pixels[3];



                //console.log('c_diff', c_diff);
                //if (ta16_pixels[0] === 0 && ta16_pixels[1] === 0 && ta16_pixels[2] === 0 && ta16_pixels[3] === 0) {
                if (buffer[scratch_32[8]++] - ta8_pixels[0] === 0 && buffer[scratch_32[8]++] - ta8_pixels[1] === 0 && buffer[scratch_32[8]++] - ta8_pixels[2] === 0 && buffer[scratch_32[8]++] - ta8_pixels[3] === 0) {
                    // No color change
                    //  So change the color
                    scratch_32[8] -= 4;
                    //buffer.writeUInt8(ta8_pixels[8], scratch_32[8]++);
                    //buffer.writeUInt8(ta8_pixels[9], scratch_32[8]++);
                    //buffer.writeUInt8(ta8_pixels[10], scratch_32[8]++);
                    //buffer.writeUInt8(ta8_pixels[11], scratch_32[8]++);
                    buffer[scratch_32[8]++] = ta8_pixels[8];
                    buffer[scratch_32[8]++] = ta8_pixels[9];
                    buffer[scratch_32[8]++] = ta8_pixels[10];
                    buffer[scratch_32[8]++] = ta8_pixels[11];

                    // Add adjacent pixels to the queue
                    //  if they've not been visited before.

                    // ta_pixels_visited[scratch_32[4] + (scratch_32[0] * scratch_32[5])]

                    if (scratch_32[4] - 1 >= 0 && ta_pixels_visited[scratch_32[4] - 1 + (scratch_32[0] * scratch_32[5])] === 0) {
                        ta_visiting_pixels[scratch_32[7]++] = scratch_32[4] - 1;
                        ta_visiting_pixels[scratch_32[7]++] = scratch_32[5];

                        ta_pixels_visited[scratch_32[4] - 1 + (scratch_32[0] * scratch_32[5])] = 255;

                        //arr_pixels_to_visit.push([scratch_32[4] - 1, scratch_32[5]]);
                    }
                    if (scratch_32[5] - 1 >= 0 && ta_pixels_visited[scratch_32[4] + (scratch_32[0] * (scratch_32[5] - 1))] === 0) {
                        ta_visiting_pixels[scratch_32[7]++] = scratch_32[4];
                        ta_visiting_pixels[scratch_32[7]++] = scratch_32[5] - 1;
                        //arr_pixels_to_visit.push([scratch_32[4], scratch_32[5] - 1]);
                        ta_pixels_visited[scratch_32[4] + (scratch_32[0] * (scratch_32[5] - 1))] = 255;
                    }
                    if (scratch_32[4] + 1 < scratch_32[0] && ta_pixels_visited[scratch_32[4] + 1 + (scratch_32[0] * scratch_32[5])] === 0) {
                        ta_visiting_pixels[scratch_32[7]++] = scratch_32[4] + 1;
                        ta_visiting_pixels[scratch_32[7]++] = scratch_32[5];
                        //arr_pixels_to_visit.push([scratch_32[4] + 1, scratch_32[5]]);
                        ta_pixels_visited[scratch_32[4] + 1 + (scratch_32[0] * scratch_32[5])] = 255;
                    }
                    if (scratch_32[5] + 1 < scratch_32[1] && ta_pixels_visited[scratch_32[4] + (scratch_32[0] * (scratch_32[5] + 1))] === 0) {
                        ta_visiting_pixels[scratch_32[7]++] = scratch_32[4];
                        ta_visiting_pixels[scratch_32[7]++] = scratch_32[5] + 1;
                        //arr_pixels_to_visit.push([scratch_32[4], scratch_32[5] + 1]);
                        ta_pixels_visited[scratch_32[4] + (scratch_32[0] * (scratch_32[5] + 1))] = 255;
                    }
                }
                scratch_32[9]++;
                // compare these arrays

                // Add adjacent pixels to the stack?
                //c_visited++;
                //scratch_32[7] += 2;
            }

            //console.log('scratch_32[6]', scratch_32[6]);
            //console.log('scratch_32[6] / 2', scratch_32[6] / 2);
            // 787812
            //console.log('c_visited', c_visited);
        }
        fast_stacked_mapped_flood_fill();
    }
    // regional flood fill

}

module.exports = Pixel_Buffer_Enh;