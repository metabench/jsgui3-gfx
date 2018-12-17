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

class Pixel_Buffer {

    // Setting bits per pixel to 8
    //  greyscale 256


    constructor(spec) {
        //spec.__type_name = spec.__type_name || 'pixel_buffer';
        //super(spec);
        if (spec.buffer) {
            this.buffer = spec.buffer;
            // Need to give it the size / num rows.
            //this.size = spec.buffer.length;
        }
        if (spec.size) {
            this.size = spec.size;
        } else {
            throw 'Expected: size [x, y] property in the Pixel_Buffer specification';
        }

        // bit-depth - could follow PNG.
        //  rgba color mode.
        spec.bits_per_pixel = spec.bits_per_pixel || 32;

        if (spec.bits_per_pixel) {
            if (spec.bits_per_pixel != 8 && spec.bits_per_pixel != 24 && spec.bits_per_pixel != 32) {
                throw 'Invalid bits_per_pixel value of ' + spec.bits_per_pixel + ', must be 8, 24 or 32, default is 32.';
            } else {
                this.bits_per_pixel = spec.bits_per_pixel;
            }
        }
        // then initialize the buffer itself.
        const bytes_per_pixel = this.bytes_per_pixel = this.bits_per_pixel / 8;
        if (this.size && !this.buffer) {
            this.buffer = new Buffer(bytes_per_pixel * this.size[0] * this.size[1]);
        }
    }
    // each_pixel((x, y, r, g, b, a, set, get_pixel_by_offset)

    

    each_pixel(cb) {
        // y loop
        // x loop

        let y, x, r, g, b, a, i;
        const w = this.size[0],
            h = this.size[1];
        const buf = this.buffer;
        for (y = 0; y < h; y++) {
            for (x = 0; x < w; x++) {
                i = this.bytes_per_pixel * (x + y * w);
                cb(x, y, buf.readUInt8(i), buf.readUInt8(i + 1), buf.readUInt8(i + 2), buf.readUInt8(i + 3),
                    /*(r, g, b, a) => {
                                       buf.writeUInt8(r, i), buf.writeUInt8(g, i + 1), buf.writeUInt8(b, i + 2), buf.writeUInt8(a, i + 3)
                                   }, */
                    (vx, vy) => {
                        //console.log('x, y, ', x, y, vx, vy);
                        return this.get_pixel(x + vx, y + vy);
                    })
            }
        }
    }

    'set_pixel'() {
        // Could this whole thing be sped up with C++?
        const a = arguments,
            l = a.length;
        const bytes_per_pixel = this.bits_per_pixel / 8;
        // x, y, r, g, b, a  l = 6
        // x, y, r, g, b     l = 5

        // [x, y], r, g, b, a
        // [x, y], r, g, b
        //console.log('set_pixel sig ' + sig);
        //console.log('set_pixel a ' + stringify(a));

        let x, y, r, g, b, alpha;
        const w = this.size[0];
        // x, y, [r, g, b, a] l = 3
        // x, y, [r, g, b]    l = 3
        if (l === 3) {
            x = a[0];
            y = a[1];
            var arr_pixel = a[2];
            if (this.bits_per_pixel === 24) {
                if (arr_pixel.length != 3) {
                    var stack = new Error().stack;
                    //console.log(stack);
                    throw 'Expected pixel value in format [r, g, b] for 24 bits_per_pixel.';
                }
                //r = arr_pixel[0];
                //g = arr_pixel[1];
                //b = arr_pixel[2];
                [r, g, b] = arr_pixel;
            }
            if (this.bits_per_pixel === 32) {
                //console.log('arr_pixel ' + stringify(arr_pixel));
                if (arr_pixel.length != 4) {
                    //console.log('arr_pixel.length ' + arr_pixel.length);
                    var stack = new Error().stack;
                    //console.log(stack);
                    throw 'Expected pixel value in format [r, g, b, a] for 32 bits_per_pixel.';
                }
                //r = arr_pixel[0];
                //g = arr_pixel[1];
                //b = arr_pixel[2];
                //a = arr_pixel[3];
                [r, g, b, alpha] = arr_pixel;
            }
        }

        if (l == 5) {
            if (this.bits_per_pixel != 24) {
                throw 'Must specify the pixel as r, g, b with bits_per_pixel of 24';
            }
            //x = a[0];
            //y = a[1];
            //r = a[2];
            //g = a[3];
            //b = a[4];
            [x, y, r, g, b] = a;
        }

        if (l == 6) {
            if (this.bits_per_pixel != 32) {
                throw 'Must specify the pixel as r, g, b, a with bits_per_pixel of 32';
            }
            //x = a[0];
            //y = a[1];
            //r = a[2];
            //g = a[3];
            //b = a[4];
            //a = a[5];
            [x, y, r, g, b, alpha] = a;
            //console.log('[x, y, r, g, b, alpha]', [x, y, r, g, b, alpha]);
        }

        var pixel_buffer_pos = bytes_per_pixel * (x + y * w);
        var buffer = this.buffer;

        if (this.bits_per_pixel === 24) {
            buffer.writeUInt8(r, pixel_buffer_pos);
            buffer.writeUInt8(g, pixel_buffer_pos + 1);
            buffer.writeUInt8(b, pixel_buffer_pos + 2);

        } else if (this.bits_per_pixel === 32) {
            buffer.writeUInt8(r, pixel_buffer_pos);
            buffer.writeUInt8(g, pixel_buffer_pos + 1);
            buffer.writeUInt8(b, pixel_buffer_pos + 2);
            buffer.writeUInt8(alpha, pixel_buffer_pos + 3);
        } else {
            var stack = new Error().stack;
            //console.log(stack);
            throw 'Must have bits_per_pixel set to 24 or 32';
        }
    }
    'get_pixel'(x, y) {
        const bytes_per_pixel = this.bits_per_pixel / 8;
        // will return [r, g, b] or [r, g, b, a];
        let pixel_buffer_pos = bytes_per_pixel * (x + y * this.size[0]);
        const buffer = this.buffer;
        //var r, g, b, a;
        //console.log('pixel_buffer_pos', pixel_buffer_pos);
        //console.log('x, y', x, y);

        //const check = this.check_rect_bounds(x, y);
        if (this.check_rect_bounds(x, y)) {
            if (this.bits_per_pixel == 24) {
                return [buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++)];
            } else if (this.bits_per_pixel == 32) {
                return [buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++)];
            } else {
                var stack = new Error().stack;
                //console.log(stack);
                throw 'Must have bits_per_pixel set to 24 or 32';
            }
        }
    }

    check_rect_bounds(x, y, w = 0, h = 0) {
        if (x < 0) return false;
        if (y < 0) return false;
        if (x + w >= this.size[0]) return false;
        if (y + h >= this.size[1]) return false;
        return true;
    }
    // get (rectangle) view
    //  A rectangular square of pixels.

    // x, y, w, h
    copy_rect(x, y, w, h, clip = false) {
        // check within bounds
        //console.log('copy_rect w, h', w, h)

        // Allow clipping?
        //  So would get a smaller rect if it's outside bounds
        let central_pos = [Math.floor(w / 2), Math.floor(h / 2)];
        let check = true;
        if (clip) {
            clip = {};
            if (x < 0) {
                w = w + x;
                clip.l = -1 * x;
                x = 0;
                central_pos[0] -= clip.l;
            };
            if (y < 0) {
                h = h + y;
                clip.t = -1 * y;
                y = 0;
                central_pos[1] -= clip.t;
            }
            if (x + w > this.size[0]) {
                clip.r = (x + w) - this.size[0];
                //\w = w - ((x + w) - this.size[0]);
                x = x - clip.r;
                w = w - clip.r;
                central_pos[0] -= clip.r;
            }
            if (y + h > this.size[1]) {
                clip.b = (y + h) - this.size[1];
                //console.log('this.size[1]', this.size[1]);
                //console.log('h', h);
                //console.log('y', y);
                y = y - clip.b;
                h = h - clip.b;
                central_pos[1] -= clip.b;
            }
            if (Object.keys(clip).length === 0) {
                clip = undefined;
            }
        } else {
            check = this.check_rect_bounds(x, y, w, h);
        }


        //let check = check_rect_bounds(x, y, w, h);
        if (!check) {
            throw 'Out of bounds error';
        } else {
            const r = x + w,
                b = y + h;
            let i;
            //var pixel_buffer_pos = 
            //let bb = this.buffer.buffer;
            let cr, cg, cb, ca;

            let buf = this.buffer;

            //console.log('[w, h]', [w, h]);


            let res = new Pixel_Buffer({
                size: [w, h],
                bits_per_pixel: this.bits_per_pixel
            });
            if (clip) {
                res.clip = clip;

            }
            res.central_pos = central_pos;
            const right = x + w;
            const bottom = y + h;

            const Bpp = this.bytes_per_pixel,
                my_w = this.size[0];

            //console.log('[right, bottom]', [right, bottom]);

            let i_res = 0;
            let buf_res = res.buffer;
            //let bbres = res.buffer.buffer;
            for (let y2 = y; y2 < bottom; y2++) {
                //console.log('y', y);

                //console.log('x < right', x < right);

                //console.log('this.bytes_per_pixel', this.bytes_per_pixel);
                i = Bpp * (x + y2 * my_w);;
                for (let x2 = x; x2 < right; x2++) {
                    //console.log('i', i);
                    //console.log('x2, y2', x2, y2);
                    //console.log('i_res', i_res);
                    //[cr, cg, cb, ca] = bb.slice(i, i = i + this.bytes_per_pixel);
                    //[bbres[i++], bbres[i++], bbres[i++], bbres[i++]] = bb.slice(i - 4, i);
                    //console.log('i_res', i_res);
                    buf_res.writeUInt32BE(buf.readUInt32BE(i), i_res);
                    i += 4;
                    i_res += 4;
                    // let res_i = res.this.bytes_per_pixel * 
                }
            }
            return res;
        }
    }

    'place_image_from_pixel_buffer'(pixel_buffer, dest_pos) {
        // can do a fast copy.
        //  or can do pixel iteration.

        // function to get a line from a buffer?
        // will want to copy directly between them.

        // so for each line in the source, need to copy the line directly into the buffer.
        //  that's if they are the same bits_per_pixel.

        // copying rgba to rgba or rgb to rgb should be fast.
        //  direct copying is fastest.
        const dest_buffer = this.buffer;
        const source_buffer = pixel_buffer.buffer;

        //console.log('dest_pos ' + stringify(dest_pos));
        // It's also worth making RGB->RGBA and RGBA->RGB
        if (this.bits_per_pixel === 32 && pixel_buffer.bits_per_pixel === 32) {
            const dest_w = this.size[0];
            const dest_h = this.size[1];

            const dest_buffer_line_length = dest_w * 4;
            const source_w = pixel_buffer.size[0];
            const source_h = pixel_buffer.size[1];
            const source_buffer_line_length = source_w * 4;

            //console.log('source_w ' + source_w);
            //console.log('source_h ' + source_h);
            let source_buffer_line_start_pos, source_buffer_line_end_pos, dest_buffer_subline_start_pos, dest_buffer_start_offset;
            dest_buffer_start_offset = dest_pos[0] * 4;

            // This algorithm could be sped up with C.
            //cpp_mod.copy_rgba_pixel_buffer_to_rgba_pixel_buffer_region(source_buffer, source_buffer_line_length, dest_buffer, dest_buffer_line_length, dest_pos[0], dest_pos[1]);
            //throw 'stop';
            for (var y = 0; y < source_h; y++) {
                source_buffer_line_start_pos = y * source_buffer_line_length;
                source_buffer_line_end_pos = source_buffer_line_start_pos + source_buffer_line_length;
                dest_buffer_subline_start_pos = (y + dest_pos[1]) * dest_buffer_line_length;
                //var dest_buffer_subline_end_pos = dest_buffer_subline_start_pos + source_buffer_line_length;
                // buf.copy(targetBuffer, [targetStart], [sourceStart], [sourceEnd])
                source_buffer.copy(dest_buffer, dest_buffer_subline_start_pos + dest_buffer_start_offset, source_buffer_line_start_pos, source_buffer_line_end_pos);
            }
        } else {
            throw 'not currently supported';
        }
    }
    'blank_copy'() {
        var res = new Pixel_Buffer({
            'size': this.size,
            'bits_per_pixel': this.bits_per_pixel
        });
        res.buffer.fill(0);
        return res;
    }
    'clone'() {
        console.log('1) this.bits_per_pixel', this.bits_per_pixel);
        var res = new Pixel_Buffer({
            'size': this.size,
            'bits_per_pixel': this.bits_per_pixel
        });
        this.buffer.copy(res.buffer);
        //res.buffer.fill(0);
        return res;
    }

    // Get mask of single color as a bit pixel_buffer



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


        var res = new Pixel_Buffer({
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


        var res = new Pixel_Buffer({
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

        let stacked_mapped_flood_fill = () => {
            const map_pixels_visited = {};
            const arr_pixels_to_visit = [
                [x, y]
            ];
            let c_visited = 0;
            const buffer = this.buffer;

            let pixel_buffer_pos = this.bytes_per_pixel * (x + y * this.size[0]);

            const c_start = new Uint8Array([buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++)]);
            //console.log('c_start', c_start);
            while (c_visited < arr_pixels_to_visit.length) {
                // 
                [x, y] = arr_pixels_to_visit[c_visited];
                //console.log('c_visited', c_visited);
                map_pixels_visited[[x, y]] = true;
                //console.log('[x, y]', [x, y]);

                // Check this pixel...
                let pixel_buffer_pos = this.bytes_per_pixel * (x + y * this.size[0]);
                //const [pr, pg, pb, pa] = 
                const c_px = new Uint8Array([buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++)]);
                //console.log('c_px', c_px);
                // then the difference from the start colors

                const c_diff = new Uint8Array([c_start[0] - c_px[0], c_start[1] - c_px[1], c_start[2] - c_px[2], c_start[3] - c_px[3]]);
                //console.log('c_diff', c_diff);
                if (c_diff[0] === 0 && c_diff[1] === 0 && c_diff[2] === 0 && c_diff[3] === 0) {
                    // No color change
                    //  So change the color
                    pixel_buffer_pos -= 4;
                    buffer.writeUInt8(r, pixel_buffer_pos++);
                    buffer.writeUInt8(g, pixel_buffer_pos++);
                    buffer.writeUInt8(b, pixel_buffer_pos++);
                    buffer.writeUInt8(a, pixel_buffer_pos++);

                    // Add adjacent pixels to the queue
                    //  if they've not been visited before.

                    if (x - 1 > 0 && x - 1 < w && !map_pixels_visited[[x - 1, y]]) {
                        arr_pixels_to_visit.push([x - 1, y]);
                    }
                    if (y - 1 > 0 && y - 1 < h && !map_pixels_visited[[x, y - 1]]) {
                        arr_pixels_to_visit.push([x, y - 1]);
                    }
                    if (x + 1 > 0 && x + 1 < w && !map_pixels_visited[[x + 1, y]]) {
                        arr_pixels_to_visit.push([x + 1, y]);
                    }
                    if (y + 1 > 0 && y + 1 < h && !map_pixels_visited[[x, y + 1]]) {
                        arr_pixels_to_visit.push([x, y + 1]);
                    }
                }
                // compare these arrays

                // Add adjacent pixels to the stack?
                c_visited++;
            }
            //console.log('c_visited', c_visited);
        }
        //stacked_mapped_flood_fill();

    }


    // regional flood fill





}
/*
//var Pixel_Buffer = Class.extend({

            // want to be able to load the values into this rapidly?

            'init': function (spec) {
                // size [width, height]
                //var bytes_per_pixel;

                

            },
            'new_blank_same_size': function () {
                var res = new Pixel_Buffer({
                    'size': this.size,
                    'bits_per_pixel': this.bits_per_pixel
                });
                res.buffer.fill(0);
                return res;
            },
            'get_pixel': function (x, y) {
                var bytes_per_pixel = this.bits_per_pixel / 8;
                // will return [r, g, b] or [r, g, b, a];
                var pixel_buffer_pos = bytes_per_pixel * (x + y * this.size[0]);
                var buffer = this.buffer;
                var r, g, b, a;


                if (this.bits_per_pixel == 24) {
                    r = buffer.readUInt8(pixel_buffer_pos);
                    g = buffer.readUInt8(pixel_buffer_pos + 1);
                    b = buffer.readUInt8(pixel_buffer_pos + 2);
                    return [r, g, b];
                } else if (this.bits_per_pixel == 32) {
                    r = buffer.readUInt8(pixel_buffer_pos);
                    g = buffer.readUInt8(pixel_buffer_pos + 1);
                    b = buffer.readUInt8(pixel_buffer_pos + 2);
                    a = buffer.readUInt8(pixel_buffer_pos + 3);
                    return [r, g, b, a];
                } else {
                    var stack = new Error().stack;
                    //console.log(stack);
                    throw 'Must have bits_per_pixel set to 24 or 32';
                }
            },

            // Would be faster without fp.
            //  this could slow this down a lot in terms of V8 speed.
            // will take the r,g,b(,a) in params.
            ,

            'place_image_from_pixel_buffer': function (pixel_buffer, dest_pos) {
                // can do a fast copy.
                //  or can do pixel iteration.

                // function to get a line from a buffer?
                // will want to copy directly between them.

                // so for each line in the source, need to copy the line directly into the buffer.
                //  that's if they are the same bits_per_pixel.

                // copying rgba to rgba or rgb to rgb should be fast.
                //  direct copying is fastest.
                var dest_buffer = this.buffer;
                var source_buffer = pixel_buffer.buffer;

                //console.log('dest_pos ' + stringify(dest_pos));
                // It's also worth making RGB->RGBA and RGBA->RGB
                if (this.bits_per_pixel == 32 && pixel_buffer.bits_per_pixel == 32) {

                    var dest_w = this.size[0];
                    var dest_h = this.size[1];

                    var dest_buffer_line_length = dest_w * 4;

                    var source_w = pixel_buffer.size[0];
                    var source_h = pixel_buffer.size[1];

                    var source_buffer_line_length = source_w * 4;

                    //console.log('source_w ' + source_w);
                    //console.log('source_h ' + source_h);
                    var source_buffer_line_start_pos, source_buffer_line_end_pos, dest_buffer_subline_start_pos, dest_buffer_start_offset;

                    dest_buffer_start_offset = dest_pos[0] * 4;

                    // This algorithm could be sped up with C.

                    cpp_mod.copy_rgba_pixel_buffer_to_rgba_pixel_buffer_region(source_buffer, source_buffer_line_length, dest_buffer, dest_buffer_line_length, dest_pos[0], dest_pos[1]);

                    //throw 'stop';
                    /*
                    for (var y = 0; y < source_h; y++) {
                        source_buffer_line_start_pos = y * source_buffer_line_length;
                        source_buffer_line_end_pos = source_buffer_line_start_pos + source_buffer_line_length;
                        
                        dest_buffer_subline_start_pos = (y + dest_pos[1]) * dest_buffer_line_length;
                        //var dest_buffer_subline_end_pos = dest_buffer_subline_start_pos + source_buffer_line_length;
                        // buf.copy(targetBuffer, [targetStart], [sourceStart], [sourceEnd])
                        
                        source_buffer.copy(dest_buffer, dest_buffer_subline_start_pos + dest_buffer_start_offset, source_buffer_line_start_pos, source_buffer_line_end_pos);
                        
                    }
                    * /
                } else {
                    throw 'not currently supported';
                }
            }
*/

module.exports = Pixel_Buffer;