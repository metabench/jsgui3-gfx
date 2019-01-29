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


// Core


// Mixins
//  Could make them for functions of some categories, and larger functions.
//   Would help to make it replacable with more optimized functions.

// Advanced / Enh


class Pixel_Buffer_Core {

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
            //this.size = spec.size;
            this.size = new Uint32Array(spec.size);
        } else {
            throw 'Expected: size [x, y] property in the Pixel_Buffer_Core specification';
        }

        // bit-depth - could follow PNG.
        //  rgba color mode.

        if (spec.bytes_per_pixel && !spec.bits_per_pixel) spec.bits_per_pixel = spec.bytes_per_pixel * 8;

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
        this.bytes_per_row = bytes_per_pixel * this.size[0];
        if (this.size && !this.buffer) {
            this.buffer = new Buffer(bytes_per_pixel * this.size[0] * this.size[1]);
        }
    }



    // each_pixel((x, y, r, g, b, a, set, get_pixel_by_offset)

    each_pixel_index(cb) {
        const ta_16_scratch = new Uint32Array(6);
        ta_16_scratch[0] = this.bytes_per_pixel;
        ta_16_scratch[1] = 0; // i
        ta_16_scratch[2] = this.size[0];
        ta_16_scratch[3] = this.size[1];
        // 4 = x
        // 5 = y
        //let y, x, i;
        // a px typed array... could give actual access to that typed array / view.
        //const w = this.size[0],
        //    h = this.size[1];
        //const buf = this.buffer;
        const bpp = this.bits_per_pixel;

        if (bpp === 32) {
            (() => {
                for (ta_16_scratch[5] = 0; ta_16_scratch[5] < ta_16_scratch[3]; ta_16_scratch[5]++) {
                    for (ta_16_scratch[4] = 0; ta_16_scratch[4] < ta_16_scratch[2]; ta_16_scratch[4]++) {
                        cb(ta_16_scratch[1]);
                        ta_16_scratch[1] += 4;
                    }
                }
            })();
        }
        if (bpp === 24) {
            (() => {
                for (ta_16_scratch[5] = 0; ta_16_scratch[5] < ta_16_scratch[3]; ta_16_scratch[5]++) {
                    for (ta_16_scratch[4] = 0; ta_16_scratch[4] < ta_16_scratch[2]; ta_16_scratch[4]++) {
                        cb(ta_16_scratch[1]);
                        ta_16_scratch[1] += 3;
                    }
                }
            })();
        } else if (bpp === 8) {
            (() => {
                for (ta_16_scratch[5] = 0; ta_16_scratch[5] < ta_16_scratch[3]; ta_16_scratch[5]++) {
                    for (ta_16_scratch[4] = 0; ta_16_scratch[4] < ta_16_scratch[2]; ta_16_scratch[4]++) {
                        cb(ta_16_scratch[1]);
                        ta_16_scratch[1] += 1;
                    }
                }
            })();
        }
    }

    padded_each_pixel_index(padding, cb) {
        const ta_16_scratch = new Uint32Array(9);
        ta_16_scratch[0] = this.bytes_per_pixel;
        ta_16_scratch[1] = 0; // i
        ta_16_scratch[2] = this.size[0] - padding;
        ta_16_scratch[3] = this.size[1] - padding;

        ta_16_scratch[7] = this.size[0];
        //ta_16_scratch[8] = 

        // 4 = x
        // 5 = y
        //let y, x, i;
        // a px typed array... could give actual access to that typed array / view.
        //const w = this.size[0],
        //    h = this.size[1];
        //const buf = this.buffer;
        const bpp = this.bits_per_pixel;

        if (bpp === 32) {
            ((cb) => {
                for (ta_16_scratch[5] = padding; ta_16_scratch[5] < ta_16_scratch[3]; ta_16_scratch[5]++) {
                    for (ta_16_scratch[4] = 0; ta_16_scratch[4] < ta_16_scratch[2]; ta_16_scratch[4]++) {
                        //ta_16_scratch[1] = (ta_16_scratch[5] * this.size[0] + ta_16_scratch[4]) * ta_16_scratch[0];
                        cb((ta_16_scratch[5] * ta_16_scratch[7] + ta_16_scratch[4]) * ta_16_scratch[0]);
                        //ta_16_scratch[1] += 4;
                    }
                }
            })(cb);
        }
        if (bpp === 24) {
            ((cb) => {
                for (ta_16_scratch[5] = padding; ta_16_scratch[5] < ta_16_scratch[3]; ta_16_scratch[5]++) {
                    for (ta_16_scratch[4] = 0; ta_16_scratch[4] < ta_16_scratch[2]; ta_16_scratch[4]++) {
                        //ta_16_scratch[1] = (ta_16_scratch[5] * this.size[0] + ta_16_scratch[4]) * ta_16_scratch[0];
                        cb((ta_16_scratch[5] * ta_16_scratch[7] + ta_16_scratch[4]) * ta_16_scratch[0]);
                        //ta_16_scratch[1] += 3;
                    }
                }
            })(cb);
        } else if (bpp === 8) {
            ((cb) => {
                for (ta_16_scratch[5] = padding; ta_16_scratch[5] < ta_16_scratch[3]; ta_16_scratch[5]++) {
                    for (ta_16_scratch[4] = 0; ta_16_scratch[4] < ta_16_scratch[2]; ta_16_scratch[4]++) {
                        cb((ta_16_scratch[5] * ta_16_scratch[7] + ta_16_scratch[4]) * ta_16_scratch[0]);
                        //ta_16_scratch[1] += 1;
                    }
                }
            })(cb);
        }
    }

    each_pixel(cb) {
        // y loop
        // x loop

        const ta_16_scratch = new Uint32Array(6);
        ta_16_scratch[0] = this.bytes_per_pixel;
        ta_16_scratch[1] = 0; // i
        ta_16_scratch[2] = this.size[0];
        ta_16_scratch[3] = this.size[1];
        // 4 = x
        // 5 = y
        //let y, x, i;
        // a px typed array... could give actual access to that typed array / view.
        //const w = this.size[0],
        //    h = this.size[1];
        const buf = this.buffer;

        const bpp = this.bits_per_pixel;

        if (bpp === 32) {
            for (ta_16_scratch[5] = 0; ta_16_scratch[5] < ta_16_scratch[3]; ta_16_scratch[5]++) {
                for (ta_16_scratch[4] = 0; ta_16_scratch[4] < ta_16_scratch[2]; ta_16_scratch[4]++) {
                    //ta_16_scratch[1] = ta_16_scratch[0] * (ta_16_scratch[4] + ta_16_scratch[5] * ta_16_scratch[2]);
                    //cb(ta_16_scratch[4], ta_16_scratch[5], buf.readUInt8(ta_16_scratch[1]), buf.readUInt8(ta_16_scratch[1] + 1), buf.readUInt8(ta_16_scratch[1] + 2), buf.readUInt8(ta_16_scratch[1] + 3));
                    //ta_16_scratch[1] = ta_16_scratch[0] * (ta_16_scratch[4] + ta_16_scratch[5] * ta_16_scratch[2]);
                    cb(ta_16_scratch[4], ta_16_scratch[5], buf.readUInt8(ta_16_scratch[1]++), buf.readUInt8(ta_16_scratch[1]++), buf.readUInt8(ta_16_scratch[1]++), buf.readUInt8(ta_16_scratch[1]++));

                    /*
                    cb(x, y, buf.readUInt8(i), buf.readUInt8(i + 1), buf.readUInt8(i + 2), buf.readUInt8(i + 3),
                        / *(r, g, b, a) => {
                                           buf.writeUInt8(r, i), buf.writeUInt8(g, i + 1), buf.writeUInt8(b, i + 2), buf.writeUInt8(a, i + 3)
                                       }, * /
                        (vx, vy) => {
                            //console.log('x, y, ', x, y, vx, vy);
                            // Maybe too slow.
                            // Vectored pixel.
    
                            return this.get_pixel(x + vx, y + vy);
                        })
                        */
                }
            }
        }
        if (bpp === 24) {
            for (ta_16_scratch[5] = 0; ta_16_scratch[5] < ta_16_scratch[3]; ta_16_scratch[5]++) {
                for (ta_16_scratch[4] = 0; ta_16_scratch[4] < ta_16_scratch[2]; ta_16_scratch[4]++) {
                    //ta_16_scratch[1] = ta_16_scratch[0] * (ta_16_scratch[4] + ta_16_scratch[5] * ta_16_scratch[2]);
                    //cb(ta_16_scratch[4], ta_16_scratch[5], buf.readUInt8(ta_16_scratch[1]), buf.readUInt8(ta_16_scratch[1] + 1), buf.readUInt8(ta_16_scratch[1] + 2), buf.readUInt8(ta_16_scratch[1] + 3));
                    //ta_16_scratch[1] = ta_16_scratch[0] * (ta_16_scratch[4] + ta_16_scratch[5] * ta_16_scratch[2]);
                    cb(ta_16_scratch[4], ta_16_scratch[5], buf.readUInt8(ta_16_scratch[1]++), buf.readUInt8(ta_16_scratch[1]++), buf.readUInt8(ta_16_scratch[1]++));
                    /*
                    cb(x, y, buf.readUInt8(i), buf.readUInt8(i + 1), buf.readUInt8(i + 2), buf.readUInt8(i + 3),
                        / *(r, g, b, a) => {
                                           buf.writeUInt8(r, i), buf.writeUInt8(g, i + 1), buf.writeUInt8(b, i + 2), buf.writeUInt8(a, i + 3)
                                       }, * /
                        (vx, vy) => {
                            //console.log('x, y, ', x, y, vx, vy);
                            // Maybe too slow.
                            // Vectored pixel.
    
                            return this.get_pixel(x + vx, y + vy);
                        })
                        */
                }
            }
        } else if (bpp === 8) {
            for (ta_16_scratch[5] = 0; ta_16_scratch[5] < ta_16_scratch[3]; ta_16_scratch[5]++) {
                for (ta_16_scratch[4] = 0; ta_16_scratch[4] < ta_16_scratch[2]; ta_16_scratch[4]++) {
                    //ta_16_scratch[1] = ta_16_scratch[0] * (ta_16_scratch[4] + ta_16_scratch[5] * ta_16_scratch[2]);
                    //cb(ta_16_scratch[4], ta_16_scratch[5], buf.readUInt8(ta_16_scratch[1]), buf.readUInt8(ta_16_scratch[1] + 1), buf.readUInt8(ta_16_scratch[1] + 2), buf.readUInt8(ta_16_scratch[1] + 3));
                    //ta_16_scratch[1] = ta_16_scratch[0] * (ta_16_scratch[4] + ta_16_scratch[5] * ta_16_scratch[2]);
                    cb(ta_16_scratch[4], ta_16_scratch[5], buf.readUInt8(ta_16_scratch[1]++));

                    /*
                    cb(x, y, buf.readUInt8(i), buf.readUInt8(i + 1), buf.readUInt8(i + 2), buf.readUInt8(i + 3),
                        / *(r, g, b, a) => {
                                           buf.writeUInt8(r, i), buf.writeUInt8(g, i + 1), buf.writeUInt8(b, i + 2), buf.writeUInt8(a, i + 3)
                                       }, * /
                        (vx, vy) => {
                            //console.log('x, y, ', x, y, vx, vy);
                            // Maybe too slow.
                            // Vectored pixel.
    
                            return this.get_pixel(x + vx, y + vy);
                        })
                        */
                }
            }
        }



    }
    padded_each_pixel(padding, cb) {
        // y loop
        // x loop

        const ta_16_scratch = new Uint32Array(7);
        ta_16_scratch[0] = this.bytes_per_pixel;
        ta_16_scratch[1] = 0; // i
        ta_16_scratch[2] = this.size[0] - padding;
        ta_16_scratch[3] = this.size[1] - padding;
        // 4 = x
        // 5 = y
        //let y, x, i;
        // a px typed array... could give actual access to that typed array / view.
        //const w = this.size[0],
        //    h = this.size[1];
        const buf = this.buffer;
        console.log('buf', buf);

        console.log('this.bytes_per_pixel', this.bytes_per_pixel);

        if (ta_16_scratch[0] === 3) {

            // need to work out the index?

            for (ta_16_scratch[5] = padding; ta_16_scratch[5] < ta_16_scratch[3]; ta_16_scratch[5]++) {
                for (ta_16_scratch[4] = padding; ta_16_scratch[4] < ta_16_scratch[2]; ta_16_scratch[4]++) {
                    //ta_16_scratch[1] = ta_16_scratch[0] * (ta_16_scratch[4] + ta_16_scratch[5] * ta_16_scratch[2]);
                    //ta_16_scratch[6] = ta_16_scratch[1];

                    ta_16_scratch[1] = ta_16_scratch[6] = (ta_16_scratch[5] * this.size[0] + ta_16_scratch[4]) * ta_16_scratch[0];
                    


                    cb(ta_16_scratch[4], ta_16_scratch[5], buf.readUInt8(ta_16_scratch[1]++), buf.readUInt8(ta_16_scratch[1]++), buf.readUInt8(ta_16_scratch[1]++), ta_16_scratch[6]);
                }
            }
        } else if (ta_16_scratch[0] === 4) {
            for (ta_16_scratch[5] = padding; ta_16_scratch[5] < ta_16_scratch[3]; ta_16_scratch[5]++) {
                for (ta_16_scratch[4] = padding; ta_16_scratch[4] < ta_16_scratch[2]; ta_16_scratch[4]++) {
                    //ta_16_scratch[1] = ta_16_scratch[0] * (ta_16_scratch[4] + ta_16_scratch[5] * ta_16_scratch[2]);
                    //ta_16_scratch[6] = ta_16_scratch[1];
                    ta_16_scratch[1] = ta_16_scratch[6] = (ta_16_scratch[5] * this.size[0] + ta_16_scratch[4]) * ta_16_scratch[0];
                    //ta_16_scratch[6] = ta_16_scratch[5] * (this.size[0] + ta_16_scratch[4]) * ta_16_scratch[0];
                    cb(ta_16_scratch[4], ta_16_scratch[5], buf.readUInt8(ta_16_scratch[1]++), buf.readUInt8(ta_16_scratch[1]++), buf.readUInt8(ta_16_scratch[1]++), buf.readUInt8(ta_16_scratch[1]++), ta_16_scratch[6]);

                    /*
                    cb(x, y, buf.readUInt8(i), buf.readUInt8(i + 1), buf.readUInt8(i + 2), buf.readUInt8(i + 3),
                        / *(r, g, b, a) => {
                                           buf.writeUInt8(r, i), buf.writeUInt8(g, i + 1), buf.writeUInt8(b, i + 2), buf.writeUInt8(a, i + 3)
                                       }, * /
                        (vx, vy) => {
                            //console.log('x, y, ', x, y, vx, vy);
                            // Maybe too slow.
                            // Vectored pixel.
    
                            return this.get_pixel(x + vx, y + vy);
                        })
                        */
                }
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

        x = a[0];
        y = a[1];

        const w = this.size[0];

        var pixel_buffer_pos = bytes_per_pixel * (x + y * w);
        var buffer = this.buffer;

        // x, y, [r, g, b, a] l = 3
        // x, y, [r, g, b]    l = 3
        if (l === 3) {


            // pixel

            if (this.bits_per_pixel === 24) {
                var arr_pixel = a[2];
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
                var arr_pixel = a[2];
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


        if (this.bits_per_pixel === 24) {
            buffer.writeUInt8(r, pixel_buffer_pos);
            buffer.writeUInt8(g, pixel_buffer_pos + 1);
            buffer.writeUInt8(b, pixel_buffer_pos + 2);

        } else if (this.bits_per_pixel === 32) {
            buffer.writeUInt8(r, pixel_buffer_pos);
            buffer.writeUInt8(g, pixel_buffer_pos + 1);
            buffer.writeUInt8(b, pixel_buffer_pos + 2);
            buffer.writeUInt8(alpha, pixel_buffer_pos + 3);
        } else if (this.bits_per_pixel === 8) {
            buffer.writeUInt8(a[2], pixel_buffer_pos);
        } else {
            var stack = new Error().stack;
            //console.log(stack);
            throw 'Must have bits_per_pixel set to 24 or 32';
        }
    }
    'get_pixel'(x, y) {
        const ta_16_scratch = new Uint32Array(6);
        ta_16_scratch[0] = this.bytes_per_pixel;
        ta_16_scratch[1] = 0; // i
        ta_16_scratch[2] = this.size[0];
        ta_16_scratch[3] = this.size[1];
        ta_16_scratch[4] = x;
        ta_16_scratch[5] = y;
        // 4 = x
        // 5 = y

        //const bytes_per_pixel = this.bits_per_pixel / 8;
        // will return [r, g, b] or [r, g, b, a];
        ta_16_scratch[1] = ta_16_scratch[0] * (ta_16_scratch[4] + ta_16_scratch[5] * ta_16_scratch[2]);
        const buffer = this.buffer;
        //var r, g, b, a;
        //console.log('pixel_buffer_pos', pixel_buffer_pos);
        //console.log('x, y', x, y);

        //const check = this.check_rect_bounds(x, y);
        if (this.check_rect_bounds(ta_16_scratch[4], ta_16_scratch[5])) {
            if (ta_16_scratch[0] === 3) {
                return [buffer.readUInt8(ta_16_scratch[1]++), buffer.readUInt8(ta_16_scratch[1]++), buffer.readUInt8(ta_16_scratch[1]++)];
            } else if (ta_16_scratch[0] === 4) {
                return [buffer.readUInt8(ta_16_scratch[1]++), buffer.readUInt8(ta_16_scratch[1]++), buffer.readUInt8(ta_16_scratch[1]++), buffer.readUInt8(ta_16_scratch[1]++)];
            } else {
                //var stack = new Error().stack;
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



    // Custom convolution not working here.
    // Iterating pixels for the line joining convolution sounds best.
    // Custom convolution seems like the way to go, but it's hard to implement.


    
    process(fn) {
        let res = this.clone();
        return fn(this, res);
    }



    equals(other_pixel_buffer) {
        let buf1 = this.buffer;
        let buf2 = other_pixel_buffer.buffer;
        if (buf1.length === buf2.length) {
            return buf1.compare(buf2) === 0;
        } else {
            return false;
        }
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

            let res = new this.constructor({
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
        var res = new this.constructor({
            'size': this.size,
            'bits_per_pixel': this.bits_per_pixel
        });
        res.buffer.fill(0);
        return res;
    }
    'clone'() {
        //console.log('1) this.bits_per_pixel', this.bits_per_pixel);
        var res = new this.constructor({
            'size': this.size,
            'bits_per_pixel': this.bits_per_pixel
        });
        this.buffer.copy(res.buffer);
        //res.buffer.fill(0);
        return res;
    }
    'add_alpha_channel'() {
        console.log('add_alpha_channel this.bytes_per_pixel', this.bytes_per_pixel);
        if (this.bytes_per_pixel === 3) {


            var res = new this.constructor({
                'size': this.size,
                'bytes_per_pixel': 4
            });

            /*
            this.each_pixel((x, y, r, g, b) => {
                //console.log('x, y, r, g, b', x, y, r, g, b);
                res.set_pixel(x, y, r, g, b, 255);
            });
            */
            const buf = this.buffer,
                res_buf = res.buffer;
            const px_count = this.size[0] * this.size[1];
            let i = 0,
                ir = 0;
            for (let p = 0; p < px_count; p++) {
                res_buf[ir++] = buf[i++];
                res_buf[ir++] = buf[i++];
                res_buf[ir++] = buf[i++];
                res_buf[ir++] = 255;
            }

            return res;


        }
        if (this.bytes_per_pixel === 4) {
            return this;
        }
    }

    // then need to be able to save as 8 bit bitmaps too.
    'to_8bit_greyscale'() {
        var res = new this.constructor({
            'size': this.size,
            'bits_per_pixel': 8
        });

        const bres = res.buffer;
        // Then go over each of this pixel
        //  take average rgb values
        let i = 0;
        this.each_pixel((x, y, r, g, b, a) => {
            bres[i++] = Math.round((r + g + b) / 3);
            //i++;
        });
        // 
        return res;
    }

    'invert_greyscale'() {
        var res = new this.constructor({
            'size': this.size,
            'bits_per_pixel': 8
        });
        const bres = res.buffer;
        // Then go over each of this pixel
        //  take average rgb values
        let i = 0;
        this.each_pixel((x, y, v) => {
            bres[i++] = 255 - v;
        });
        return res;

    }

}

module.exports = Pixel_Buffer_Core;