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

const Pixel_Pos_List = require('./pixel-pos-list');



// All operations will be in place.
//  If it's at all possible.
//  Can do .clone and then do the operation on that if we want another object.




//const inspect = Symbol.for('nodejs.util.inspect.custom');

// Core
// Mixins
//  Could make them for functions of some categories, and larger functions.
//   Would help to make it replacable with more optimized functions.

// Advanced / Enh

// A color data type could be useful.
//  Contains a typed array of a particular length

// A few fast OO structures / classes?
// Will make use of some functions, but not that many.
// ta(1, 2, 3);
// ta function
//  returns a typed array that fits the numbers
//  will check to see if they are integers
// load it from a pixel-pos-list too.
// More clarity / specifying whether to do it in place, not producing a res option?
//  and use clone where appropriate.

//const oext = require('obext')();

const oext = require('obext')();

const {ro, prop} = oext;
console.log('oext', oext);
//throw 'stop';

console.log('ro', ro);

// Make this extend evented class?

class Pixel_Buffer_Core {
    // Setting bits per pixel to 8
    //  greyscale 256

    // Bits per pixel and bytes per pixel.
    //  May be worth having the normal change events in operation.
    //   But a single defined change function would make sense.
    //    Raising change events may be unnecessary.
    //     Or some of them?
    //    Could be useful in some ways.


    constructor(spec) {
        // The prop silent_update function

        // Access to silent update functions would be very useful

        // prop setup callback?


        let silent_update_bits_per_pixel;
        let silent_update_bytes_per_pixel;

        // prop obext needs improving - will raise 'ready' function with a silent set fn as well.

        prop(this, ['bits_per_pixel', 'bipp'], {
            default: spec.bits_per_pixel || spec.bytes_per_pixel * 8,
            change: (e_change) => {
                const {old, value} = e_change;

                // this.set('bits_per_pixel', x, {silent: true})
                silent_update_bytes_per_pixel(value / 8);

                // this.realloc_change_bpp(value)
            },
            ready: (e_ready) => {
                silent_update_bits_per_pixel = e_ready.silent_set;
            }
        })

        prop(this, ['bytes_per_pixel', 'bypp'], {
            default: spec.bytes_per_pixel || spec.bits_per_pixel / 8,
            change: (e_change) => {
                const {old, value} = e_change;
                silent_update_bits_per_pixel(value * 8);

                // will need to go through all of the pixels, putting them into the new bpp format.

                // will use get pixel and set pixel that work with 1 bit per pixel images.
                // then may need to do various transformations?
                //  update_bpp
                //   takes both bits and bytes per pixel. checks that they match
                //    most likely this will have to reallocate memory.
            },
            ready: (e_ready) => {
                silent_update_bytes_per_pixel = e_ready.silent_set;
            }
        })

        if (spec instanceof Pixel_Pos_List) {
            // load it as a buffer.
            const ppl = spec;
            //console.log('ppl.length', ppl.length);
            // find out its bounds.

            // probably best loading this as a smaller pixel buffer with just the part of the image.
            //  will set a .pos attribute
            const bounds = ppl.bounds;
            //const [l, t, r, b] = bounds;
            //console.log('Pixel_Buffer_Core bounds', bounds);

            const ppl_size = new Uint16Array(2);
            ppl_size[0] = bounds[2] - bounds[0];
            ppl_size[1] = bounds[3] - bounds[1];

            //console.log('Pixel_Buffer_Core ppl_size', ppl_size);
            //  Can have bits or bytes per pixel set in spec, otherwise.
            //   Pixel pos list to produce 1 bit per pixel in the near future anyway.

            this.bits_per_pixel = 8;
            const bpp = this.bytes_per_pixel = 1;
            // Not clear why the extra space is needed, but it solves a subtle sizing error.
            //  Maybe the ppl size registers wrong.
            // not sure why the +1 size is needed - it prevents an overflow???
            this.size = new Uint16Array([ppl_size[0] + 4, ppl_size[1] + 4]);
            this.pos = new Uint16Array([bounds[0], bounds[1]]);
            const bpr = this.bytes_per_row = bpp * this.size[0];
            //console.log('Pixel_Buffer_Core this.pos', this.pos);

            const buf = this.ta = this.buffer = new Uint8ClampedArray(this.size[0] * this.size[1]);
            const l = buf.length;
            for (var c = 0; c < l; c++) buf[c] = 255;

            ppl.each_pixel(pixel_pos => {
                // seems like some errant pixels got set - maybe in the flood fill.
                // not sure why we need -1 for some things...
                //buf[(bpr * (pixel_pos[1] - bounds[1]) - bpp) + (pixel_pos[0] - bounds[0] - bpp)] = 0;
                buf[(bpr * (pixel_pos[1] - bounds[1])) + (pixel_pos[0] - bounds[0])] = 0;
                //this.
            });
            //console.log(JSON.stringify(buf));
            //each(buf, console.log);
        } else {
            //spec.__type_name = spec.__type_name || 'pixel_buffer';
            //super(spec);
            if (spec.buffer) {
                if (spec.buffer instanceof Buffer) {
                    this.ta = this.buffer = new Uint8ClampedArray(spec.buffer.buffer);
                } else {
                    // check its uint8array either clamped or not.??
                    this.ta = this.buffer = spec.buffer;
                }
            }
            // Size could more logically be its dimensions.

            if (spec.size) {
                //this.size = spec.size;
                this.size = new Uint16Array(spec.size); // using the size it was given, which was given as an array.
            } else {
                throw 'Expected: size [x, y] property in the Pixel_Buffer_Core specification';
            }

            // bit-depth - could follow PNG.
            //  rgba color mode.

            if (spec.bytes_per_pixel && !spec.bits_per_pixel) spec.bits_per_pixel = spec.bytes_per_pixel * 8;
            spec.bits_per_pixel = spec.bits_per_pixel || 32;

            if (spec.bits_per_pixel) {
                //console.log('spec.bits_per_pixel', spec.bits_per_pixel);
                //console.trace();
                if (spec.bits_per_pixel != 1 && spec.bits_per_pixel != 8 && spec.bits_per_pixel != 24 && spec.bits_per_pixel != 32) {
                    throw 'Invalid bits_per_pixel value of ' + spec.bits_per_pixel + ', must be 8, 24 or 32, default is 32.';
                } else {
                    this.bits_per_pixel = spec.bits_per_pixel;
                }
            }
            // then initialize the buffer itself.
            const bytes_per_pixel = this.bytes_per_pixel = this.bits_per_pixel / 8;
            this.bytes_per_row = bytes_per_pixel * this.size[0];
            if (this.size && !this.buffer) {
                //console.log('this.size', this.size);
                this.ta = this.buffer = new Uint8ClampedArray(bytes_per_pixel * this.size[0] * this.size[1]);
                //this.buffer = Buffer.alloc(bytes_per_pixel * this.size[0] * this.size[1]);
            }
            if (spec.color) {
                this.color_whole(spec.color);
            }
            //console.log('this.ta', this.ta);
        }

        ro(this, 'meta', () => {
            return {
                size: this.size,
                bits_per_pixel: this.bits_per_pixel,
                bytes_per_pixel: this.bytes_per_pixel,
                bytes_per_row: this.bytes_per_row
            }
        });
    }

    to_24bipp() {
        const bipp = this.bits_per_pixel;
        const bypp = this.bytes_per_pixel;
        let i_px = 0;
        const num_px = this.size[0] * this.size[1];
        console.log('to_24bipp bipp', bipp);
        if (bipp === 1) {
            const res = new this.constructor({
                size: this.size,
                bits_per_pixel: 24
            })
            let i_byte = 0;
            const num_bytes = this.ta.length;
            // iterate through the bits?
            // could have a fast processing algorithm that's written out a bit longer, using &.
            // go through it byte by byte makes sense in a way.

            while (i_byte < num_bytes) {
                // iterate through pixel numbers too...
                // need to set the result points.
                // do this 8 times...
                for (var b = 0; b < 8; b++) {
                    const color = this.get_pixel_by_idx_1bipp(i_px) === 1 ? new Uint8ClampedArray([255, 255, 255]) : new Uint8ClampedArray([0, 0, 0]);
                    res.set_pixel_by_idx_24bipp(i_px++, color);
                }
                i_byte++;
                // pixel by pixel... not as efficient this way.
            }
            return res;
        } else if (bipp === 8) {
            const res = new this.constructor({
                size: this.size,
                bits_per_pixel: 24
            })
            return res;

        } else if (bipp === 24) {
            return this.clone();
        } else if (bipp === 32) {
            const res = new this.constructor({
                size: this.size,
                bits_per_pixel: 24
            })
            // will remove the channel.
            // iterate through each pixel?

            while (i_px < num_px) {
                const col_32 = this.get_pixel_by_idx_32bipp(i_px)
                i_px += bypp;
            }

            return res;

        }

    }

    toString() {
        /*
        size: Uint32Array [ 1024, 576 ],
        bits_per_pixel: 32,
        bytes_per_pixel: 4,
        bytes_per_row: 4096 }
        */
        return JSON.stringify({
            buffer: 'Uint8ClampedArray length ' + this.buffer.length,
            size: this.size,
            bits_per_pixel: this.bits_per_pixel,
            bytes_per_pixel: this.bytes_per_pixel,
            bytes_per_row: this.bytes_per_row
        });
    }
    /*
    [inspect]() {
        return 'Pixel_Buffer_Core ' + this.toString();
    }
    */

    get bounds() {
        const res = new Float32Array(4);
        const size = this.size;
        const pos = this.pos;
        res[0] = pos[0];
        res[1] = pos[1];
        res[2] = pos[0] + size[0];
        res[3] = pos[1] + size[1];
        return res;
    }

    // index_to_pos function...
    // buffer index - posin buffer - could be called pixel_buffer_index
    // pixel index - could be called pixel number

    /*
    index_to_pos(idx) {
        // idx = bpp * (x + (y * w))
        // idx / bpp = x + (y * w)
        // (idx / pbb) - (y * w) = x
        // x = (idx / pbb) - (y * w)

        // x = (idx / pbb) - (y * w)
        // x - (idx / pbb) = -(y * w)
        // -x + (idx / pbb) = y * w
        // -x + (idx / pbb) / w = y
        // y = ((idx / pbb) / w ) - x
        // above looks wrong.
    }
    */

    // Could call more specific addon functions?
    // More general addon functions?

    color_whole(color) {
        // if color a number or typed array?
        //throw 'stop';
        //console.log('this.bytes_per_pixel', this.bytes_per_pixel);

        // 0.125 - 1/8 bytes per pixel

        if (this.bytes_per_pixel === 1) {
            // expect a value

            const ta_32_scratch = new Uint32Array(12);
            //console.log('this.size', this.size);
            ta_32_scratch[0] = this.size[0] * this.size[1];
            const buf = this.buffer;
            let i;
            for (i = 0; i < ta_32_scratch[0]; i++) {
                buf[i] = color;
            }
            //console.log('ta_32_scratch[0]', ta_32_scratch[0]);
        } else if (this.bytes_per_pixel === 3) {
            const ta_32_scratch = new Uint32Array(12);
            ta_32_scratch[0] = this.size[0] * this.size[1] * 3;
            const buf = this.buffer;
            let i, c = 0;
            for (i = 0; i < ta_32_scratch[0]; i++) {
                buf[c++] = color[0];
                buf[c++] = color[1];
                buf[c++] = color[2];
            }

        } else if (this.bytes_per_pixel === 4) {
            const ta_32_scratch = new Uint32Array(12);
            ta_32_scratch[0] = this.size[0] * this.size[1] * 4;
            const buf = this.buffer;
            let i, c = 0;
            for (i = 0; i < ta_32_scratch[0]; i++) {
                buf[c++] = color[0];
                buf[c++] = color[1];
                buf[c++] = color[2];
                buf[c++] = color[3];
            }
        } else {
            throw 'Unsupported this.bytes_per_pixel: ' + this.bytes_per_pixel;
        }
        return this;
    }

    crop(size) {
        let new_size = new Uint16Array([this.size[0] - size * 2, this.size[1] - size * 2]);
        let res = new this.constructor({
            bytes_per_pixel: this.bytes_per_pixel,
            size: new_size
        });
        if (this.pos) {
            res.pos = new Uint16Array([this.pos[0] - size, this.pos[1] - size])
        }
        //if (this.pos) res.pos = this.pos;
        this.each_pixel_ta((pos, color) => {
            const new_pos = new Uint16Array([pos[0] - size, pos[1] - size]);
            if (new_pos[0] >= 0 && new_pos[0] < new_size[0] && new_pos[1] >= 0 && new_pos[1] < new_size[1]) {
                //res.set_pixel_ta(new_pos, color);
                res.set_pixel_ta(new_pos, color);
            }
        });
        return res;
    }

    uncrop(size, color) {
        let res = new this.constructor({
            bytes_per_pixel: this.bytes_per_pixel,
            size: new Uint16Array([this.size[0] + size * 2, this.size[1] + size * 2])
        })
        if (this.pos) res.pos = this.pos;
        if (this.pos) {
            //res.pos = new Uint16Array([this.pos[0] + size, this.pos[1] + size])
        }
        res.color_whole(color);
        console.log('size', size);
        this.each_pixel_ta((pos, color) => {
            //console.log('pos', pos);
            res.set_pixel_ta(new Uint16Array([pos[0] + size, pos[1] + size]), color);
            //res.set_pixel_ta(new Uint16Array([pos[0], pos[1]]), color);
        })
        return res;
    }

    // define the bounds, expect UInt16 array

    // bounds ltrb
    // pos and size?

    color_rect(bounds, color) {
        // ltrb
    }
    // couldn't we do a simpler for loop throughout the length.

    // Could use a for loop looping through pixel indexes elsewhere.

    each_pixel_index(cb) {
        const buf = this.buffer, l = buf.length, bpp = this.bytes_per_pixel;
        for (let c = 0; c < l; c += bpp) {
            cb(c);
        }
    }

    // then will want to do translations on pixel indexes.
    //  can have a translation list.
    //  pixel pos list used as offsets
    //  index array rather than pixel pos list too.

    // Could make shorter and more general version.
    padded_each_pixel_index(padding, cb) {
        const ta_32_scratch = new Uint32Array(9);
        ta_32_scratch[0] = this.bytes_per_pixel;
        ta_32_scratch[1] = 0; // i
        ta_32_scratch[2] = this.size[0] - padding;
        ta_32_scratch[3] = this.size[1] - padding;

        ta_32_scratch[7] = this.size[0];
        //ta_32_scratch[8] = 
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
                for (ta_32_scratch[5] = padding; ta_32_scratch[5] < ta_32_scratch[3]; ta_32_scratch[5]++) {
                    for (ta_32_scratch[4] = 0; ta_32_scratch[4] < ta_32_scratch[2]; ta_32_scratch[4]++) {
                        //ta_32_scratch[1] = (ta_32_scratch[5] * this.size[0] + ta_32_scratch[4]) * ta_32_scratch[0];
                        cb((ta_32_scratch[5] * ta_32_scratch[7] + ta_32_scratch[4]) * ta_32_scratch[0]);
                        //ta_32_scratch[1] += 4;
                    }
                }
            })(cb);
        }
        if (bpp === 24) {
            ((cb) => {
                for (ta_32_scratch[5] = padding; ta_32_scratch[5] < ta_32_scratch[3]; ta_32_scratch[5]++) {
                    for (ta_32_scratch[4] = 0; ta_32_scratch[4] < ta_32_scratch[2]; ta_32_scratch[4]++) {
                        //ta_32_scratch[1] = (ta_32_scratch[5] * this.size[0] + ta_32_scratch[4]) * ta_32_scratch[0];
                        cb((ta_32_scratch[5] * ta_32_scratch[7] + ta_32_scratch[4]) * ta_32_scratch[0]);
                        //ta_32_scratch[1] += 3;
                    }
                }
            })(cb);
        } else if (bpp === 8) {
            ((cb) => {
                for (ta_32_scratch[5] = padding; ta_32_scratch[5] < ta_32_scratch[3]; ta_32_scratch[5]++) {
                    for (ta_32_scratch[4] = 0; ta_32_scratch[4] < ta_32_scratch[2]; ta_32_scratch[4]++) {
                        cb((ta_32_scratch[5] * ta_32_scratch[7] + ta_32_scratch[4]) * ta_32_scratch[0]);
                        //ta_32_scratch[1] += 1;
                    }
                }
            })(cb);
        }
    }


    // Efficient Tensor processing could be used for this, in another version.

    // pos and subpos with 1bipp? or have intervals on 0.125.???

    each_pixel_pos(cb) {
        //const bpp = this.bytes_per_pixel;
        const b = this.size;
        const pos = new Uint16Array(2);
        for (pos[1] = 0; pos[1] < b[1]; pos[1]++) {
            for (pos[0] = 0; pos[0] < b[0]; pos[0]++) {
                // and the color value
                cb(pos);
            }
        }
    }


    // each_pixel_ta
    //  will return a typed array for each pixel.

    /*
    each_pixel_ta(cb) {


        // will use bipp

        // Be able to quickly go through 1bipp images.



        const bpp = this.bytes_per_pixel;
        if (bpp === 1) {
            (() => {
                const pos = new Uint16Array(2);
                const a = new Uint32Array(2);
                const b = new Uint16Array(2);
                const sc = new Uint32Array(4);
                const buf = this.buffer;

                // Would be better to use an underlying typed array.

                //const buf = this.buffer;
                b[0] = this.size[0];
                b[1] = this.size[1];

                // the index as well...
                a[0] = 0;
                sc[0] = 0; // index
                for (pos[1] = 0; pos[1] < b[1]; pos[1]++) {
                    for (pos[0] = 0; pos[0] < b[0]; pos[0]++) {
                        // and the color value
                        cb(pos, buf[sc[0]++]);
                    }
                }
            })();

        } else if (bpp === 4) {
            (() => {
                const pos = new Uint16Array(2);
                const a = new Uint32Array(2);
                const b = new Uint16Array(2);
                const sc = new Uint32Array(4);
                const buf = this.buffer;
                // Would be better to use an underlying typed array.

                //const buf = this.buffer;
                b[0] = this.size[0];
                b[1] = this.size[1];
                // the index as well...
                a[0] = 0;
                sc[0] = 0; // index

                // Recycle the result typed array for each pixel???

                for (pos[1] = 0; pos[1] < b[1]; pos[1]++) {
                    for (pos[0] = 0; pos[0] < b[0]; pos[0]++) {
                        // and the color value
                        cb(pos, new Uint8Array([buf[sc[0]++], buf[sc[0]++], buf[sc[0]++], buf[sc[0]++]]));
                    }
                }
            })();

        } else {
            throw 'Unsupported bpp ' + bpp;
        }
    }
    */

    // Maybe redo for conciseness and generalised principles? Inner functions for optimization?
    // ta_pixel

    // Will return a ta by default when appropriate for the color.

    /*
    each_pixel(cb) {
        // y loop
        // x loop

        const ta_32_scratch = new Uint32Array(6);
        ta_32_scratch[0] = this.bytes_per_pixel;
        ta_32_scratch[1] = 0; // i
        ta_32_scratch[2] = this.size[0];
        ta_32_scratch[3] = this.size[1];
        // 4 = x
        // 5 = y
        //let y, x, i;
        // a px typed array... could give actual access to that typed array / view.
        //const w = this.size[0],
        //    h = this.size[1];
        const buf = this.buffer;
        const bpp = this.bits_per_pixel;

        if (bpp === 32) {
            for (ta_32_scratch[5] = 0; ta_32_scratch[5] < ta_32_scratch[3]; ta_32_scratch[5]++) {
                for (ta_32_scratch[4] = 0; ta_32_scratch[4] < ta_32_scratch[2]; ta_32_scratch[4]++) {
                    cb(ta_32_scratch[4], ta_32_scratch[5], buf[ta_32_scratch[1]++], buf[ta_32_scratch[1]++], buf[ta_32_scratch[1]++], buf[ta_32_scratch[1]++]);
                }
            }
        }
        if (bpp === 24) {
            for (ta_32_scratch[5] = 0; ta_32_scratch[5] < ta_32_scratch[3]; ta_32_scratch[5]++) {
                for (ta_32_scratch[4] = 0; ta_32_scratch[4] < ta_32_scratch[2]; ta_32_scratch[4]++) {
                    cb(ta_32_scratch[4], ta_32_scratch[5], buf[ta_32_scratch[1]++], buf[ta_32_scratch[1]++], buf[ta_32_scratch[1]++]);
                }
            }
        } else if (bpp === 8) {
            for (ta_32_scratch[5] = 0; ta_32_scratch[5] < ta_32_scratch[3]; ta_32_scratch[5]++) {
                for (ta_32_scratch[4] = 0; ta_32_scratch[4] < ta_32_scratch[2]; ta_32_scratch[4]++) {
                    cb(ta_32_scratch[4], ta_32_scratch[5], buf[ta_32_scratch[1]++]);
                }
            }
        }
    }

    */

    /*
    padded_each_pixel(padding, cb) {
        // y loop
        // x loop

        const ta_32_scratch = new Uint32Array(7);
        ta_32_scratch[0] = this.bytes_per_pixel;
        ta_32_scratch[1] = 0; // i
        ta_32_scratch[2] = this.size[0] - padding;
        ta_32_scratch[3] = this.size[1] - padding;

        // 4 = x
        // 5 = y
        //let y, x, i;
        // a px typed array... could give actual access to that typed array / view.
        //const w = this.size[0],
        //    h = this.size[1];
        const buf = this.buffer;
        //console.log('buf', buf);
        //console.log('this.bytes_per_pixel', this.bytes_per_pixel);
        //console.log('ta_32_scratch[0]', ta_32_scratch[0]);

        if (ta_32_scratch[0] === 3) {
            for (ta_32_scratch[5] = padding; ta_32_scratch[5] < ta_32_scratch[3]; ta_32_scratch[5]++) {
                for (ta_32_scratch[4] = padding; ta_32_scratch[4] < ta_32_scratch[2]; ta_32_scratch[4]++) {
                    ta_32_scratch[1] = ta_32_scratch[6] = (ta_32_scratch[5] * this.size[0] + ta_32_scratch[4]) * ta_32_scratch[0];
                    cb(ta_32_scratch[4], ta_32_scratch[5], buf[ta_32_scratch[1]++], buf[ta_32_scratch[1]++], buf[ta_32_scratch[1]++], ta_32_scratch[6]);
                }
            }
        } else if (ta_32_scratch[0] === 4) {
            for (ta_32_scratch[5] = padding; ta_32_scratch[5] < ta_32_scratch[3]; ta_32_scratch[5]++) {
                for (ta_32_scratch[4] = padding; ta_32_scratch[4] < ta_32_scratch[2]; ta_32_scratch[4]++) {
                    ta_32_scratch[1] = ta_32_scratch[6] = (ta_32_scratch[5] * this.size[0] + ta_32_scratch[4]) * ta_32_scratch[0];
                    cb(ta_32_scratch[4], ta_32_scratch[5], buf[ta_32_scratch[1]++], buf[ta_32_scratch[1]++], buf[ta_32_scratch[1]++], buf[ta_32_scratch[1]++], ta_32_scratch[6]);
                }
            }
        } else {
            throw 'Not supported: ' + ta_32_scratch[0] + ' bytes per pixel';
        }
    }
    */
    paint_pixel_list(pixel_pos_list, color) {
        pixel_pos_list.each_pixel(pos => {
            //console.log('typeof pos', typeof pos);
            //console.log('pos', pos);
            //console.log('color', color);
            //console.log('pos, color', pos, color);
            this.set_pixel_ta(pos, color);
        });
    }

    // Will have more advances get_pixel too.
    //  get_pixel_by_idx


    // set_pixel_1bipp, set_pixel_8bipp, set_pixel_24bipp, set_pixel_32bipp

    'set_pixel_1bipp'(pos, color) {
        // color should be 1 or 0
        // on or off.
        
        //console.log('set_pixel_1bipp');
        //console.log('pos', pos);

        const val = !!color;
        // get the pixel index....

        const idx = pos[1] * this.size[0] + pos[0];
        const byte = Math.floor(idx / 8);
        const bit = idx % 8;

        //console.log('byte, bit', [byte, bit]);

        // use roots of some sort?

        const pow = Math.pow(2, bit);
        //console.log('pow', pow);

        const byte_val = this.ta[byte];
        //console.log('byte_val', byte_val);


        /*
        if (byte_val < pow) {
            //this.ta[byte] += pow;
        } else {
            //this.ta[byte] -= pow;
        }
        */

        if (val) {
            this.ta[byte] = this.ta[byte] | pow;
        } else {
            this.ta[byte] = this.ta[byte] & pow;
        }
        //console.log('this.ta[byte]', this.ta[byte]);

        // 0: 
        // Think this works now :)
    }
    // this.buffer[this.bytes_per_pixel * (pos[0] + pos[1] * this.size[0])] = color;
    'set_pixel_8bipp'(pos, color) {
        // color should be 1 or 0
        // on or off.

        //const val = !!color;
        // get the pixel index....

        const idx = pos[1] * this.size[0] + pos[0];
        //const byte = Math.floor(idx / 8);
        //const bit = idx % 8;

        //console.log('byte, bit', [byte, bit]);

        this.ta[idx] = color;
    }

    'set_pixel_24bipp'(pos, color) {
        // color should be 1 or 0
        // on or off.

        //const val = !!color;
        // get the pixel index....

        const idx = pos[1] * this.size[0] + pos[0];
        const byte = idx * 3;
        //const bit = idx % 8;

        //console.log('byte, bit', [byte, bit]);

        this.ta[idx] = color[0];
        this.ta[idx + 1] = color[1];
        this.ta[idx + 2] = color[2];
    }

    'set_pixel_32bipp'(pos, color) {
        // color should be 1 or 0
        // on or off.

        //const val = !!color;
        // get the pixel index....

        const idx = pos[1] * this.size[0] + pos[0];
        const byte = idx * 4;
        //const bit = idx % 8;

        //console.log('byte, bit', [byte, bit]);

        this.ta[idx] = color[0];
        this.ta[idx + 1] = color[1];
        this.ta[idx + 2] = color[2];
        this.ta[idx + 2] = color[3];
    }

    'set_pixel_by_idx_1bipp'(idx, color) {
        const byte = Math.floor(idx / 8);
        const bit = idx % 8;
        const val = !!color;
        const pow = Math.pow(2, bit);

        //console.log('color', color);
        //console.log('val', val);

        //console.log('bit', bit);

        //console.log('1) this.ta[byte]', this.ta[byte]);
        //console.log('val', val);
        if (val) {
            this.ta[byte] = this.ta[byte] | pow;
        } else {
            //this.ta[byte] = this.ta[byte]~pow;
            // need to remove the component of that pow.
            //  xor?

            // 

            // Unset it...?
            //  how to do that?



            this.ta[byte] = this.ta[byte] & pow;
        }
        //console.log('2) this.ta[byte]', this.ta[byte]);

    }

    'set_pixel_by_idx_8bipp'(idx, color) {
        const byte = idx;
        this.ta[byte] = color;

        //console.log('color', color);

        //console.trace();
        //throw 'NYI';
    }

    'set_pixel_by_idx_24bipp'(idx, color) {
        const byte = idx * 3;
        this.ta[byte] = color[0];
        this.ta[byte + 1] = color[1];
        this.ta[byte + 2] = color[2];

        //console.log('color', color);

        //console.trace();
        //throw 'NYI';

    }

    'set_pixel_by_idx_32bipp'(idx, color) {
        const byte = idx * 4;
        //this.ta[byte] = color;

        this.ta[byte] = color[0];
        this.ta[byte + 1] = color[1];
        this.ta[byte + 2] = color[2];
        this.ta[byte + 3] = color[3];

        //console.trace();
        //throw 'NYI';
    }

    'set_pixel_by_idx'(idx, color) {
        const a = arguments;
        const l = a.length;

        //let t0, t1, t2, t3;

        const bipp = this.bipp;
        //console.log('bipp', bipp);

        if (bipp === 1) {
            return this.set_pixel_by_idx_1bipp(a[0], a[1]);
        } else if (bipp === 8) {
            // check args length

            if (l === 2) {
                return(this.set_pixel_by_idx_8bipp(a[0], a[1]));
            }

        } else if (bipp === 24) {
            if (l === 2) {
                return(this.set_pixel_by_idx_24bipp(a[0], a[1]));
            }
            
        } else if (bipp === 32) {
            if (l === 2) {
                return(this.set_pixel_by_idx_32bipp(a[0], a[1]));
            }
        }
    }


    'set_pixel'(pos, color) {

        // May be quite a long function.
        //  Better to use inner functions for better optimization? Could be worth checking that.

        // Lets get setting pixels working in all cases.

        // Not sure if this function should be polymorphic / have checking.
        //  Would it be slowed down too much?

        // A quick typed test at the beginning could help.
        //  Not sure how much perf would be lost through doing any kind of polymorphism here.
        //  However, want to make this flexible and work in all possible cases.
        //  Could look into typescript too.

        let ta_pos, ta_color, grey_color;

        const a = arguments;
        const l = a.length;

        //let t0, t1, t2, t3;

        const bipp = this.bipp;
        //console.log('bipp', bipp);

        if (bipp === 1) {
            return(this.set_pixel_1bipp(a[0], a[1]));
        } else if (bipp === 8) {

            // check args length

            if (l === 2) {
                return(this.set_pixel_8bipp(a[0], a[1]));
            }

        } else if (bipp === 24) {
            if (l === 2) {
                return(this.set_pixel_24bipp(a[0], a[1]));
            }
            
        } else if (bipp === 32) {
            if (l === 2) {
                return(this.set_pixel_32bipp(a[0], a[1]));
            }
        }

        // Or would dealing with a string sig be best here?
        //  Or even using mfp?
        //  That would be a good thing to test.

        // And a set pixel function that only uses typed arrays could work best as well.
        //  though may need to deal with greyscale / 1 bit images.

        // specific functions for 1 bpp and greyscale modes.

        // Will use a bunch of more specific functions for modes.
        //  Could have a function the returns the appropriate function.
        //   That would be an efficient way of doing polymorphism.

        /*

        if (l === 2) {

            // Maybe best not to call tf function?

            let t1 = tf(a[1]);
            console.log('t1', t1);

        } else if (l === 3) {
            // l === 3 : x, y, color

            // color as number or typed array



        }
        */

        







        // May be best to perf benchmark this function.


        // May be worth using mfp here?
        //  Not so sure about js speed but it could help compilation / porting.


        // 0.125 bytes per pixel.



        //console.log('pixel_buffer_pos', pixel_buffer_pos);

        /*

        if (this.bytes_per_pixel === 1) {
            //const pixel_buffer_pos = this.bytes_per_pixel * (pos[0] + pos[1] * this.size[0]);
            this.buffer[this.bytes_per_pixel * (pos[0] + pos[1] * this.size[0])] = color;
        } else if (this.bytes_per_pixel === 3) {
            let pixel_buffer_pos = this.bytes_per_pixel * (pos[0] + pos[1] * this.size[0]);
            this.buffer[pixel_buffer_pos++] = color[0];
            this.buffer[pixel_buffer_pos++] = color[1];
            this.buffer[pixel_buffer_pos++] = color[2];
        } else if (this.bytes_per_pixel === 4) {
            let pixel_buffer_pos = this.bytes_per_pixel * (pos[0] + pos[1] * this.size[0]);
            this.buffer[pixel_buffer_pos++] = color[0];
            this.buffer[pixel_buffer_pos++] = color[1];
            this.buffer[pixel_buffer_pos++] = color[2];
            this.buffer[pixel_buffer_pos++] = color[3];
        }
        */
    }

    /*

    '_set_pixel'() {
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

        // check the types of the args / the sig of the function call.
        // deep sig where it gets typed array lengths too?

        // or avoid making another function call?
        //  Maybe move more towards always using a typed array to describe a position.

        let x, y, r, g, b, alpha;

        // Maybe separate inner functions for different sigs would work well.

        // x and y could be given as a typed array.



        x = a[0];
        y = a[1];
        const w = this.size[0];

        console.log('x', x);
        console.log('y', y);
        console.log('w', w);

        console.log('bytes_per_pixel', bytes_per_pixel);

        var pixel_buffer_pos = bytes_per_pixel * (x + y * w);

        console.log('pixel_buffer_pos', pixel_buffer_pos);

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

        // 1 bit per pixel...
        //  a more complicated calculation.

        


        if (this.bits_per_pixel === 1) {
            //buffer[pixel_buffer_pos] = r;
            //buffer[pixel_buffer_pos + 1] = g;
            //buffer[pixel_buffer_pos + 2] = b;

            // get the pixel number
            //  pixel index
            //   sub-byte-index

            // then use that to calculate its bit position within the byte.
            //  then do the appropriate measurement and add or subtract of a number 2^idx (I think)









        } else if (this.bits_per_pixel === 24) {
            buffer[pixel_buffer_pos] = r;
            buffer[pixel_buffer_pos + 1] = g;
            buffer[pixel_buffer_pos + 2] = b;

        } else if (this.bits_per_pixel === 32) {

            buffer[pixel_buffer_pos] = r;
            buffer[pixel_buffer_pos + 1] = g;
            buffer[pixel_buffer_pos + 2] = b;
            buffer[pixel_buffer_pos + 3] = alpha;
        } else if (this.bits_per_pixel === 8) {
            buffer[pixel_buffer_pos] = a[2];
        } else {
            var stack = new Error().stack;
            //console.log(stack);
            throw '1) Must have bits_per_pixel set to 24 or 32';
        }
    }
    */

    // Maybe compiling using let would work ok?
    //  gta(6, 'uint32');
    //   a get typed array function could be very successful.
    //   could save on code size too.
    //    in lang-mini.
    
    // Could have a module level scratch for general purpose use.
    //  Would save having to redefine it.

    // Then specific ones.

    'get_pixel_by_idx_1bipp'(idx) {
        const byte = Math.floor(idx / 8);
        const bit = idx % 8;
        const pow = Math.pow(2, bit);

        //const tas1 = new Uint32Array(6);

        //tas1[0] = pow;
        //tas1[1] = this.ta[byte] & pow;

        //console.log('tas1[0] === tas1[1]', (tas1[0] === tas1[1]));
        //console.log('(this.ta[byte] & pow) === pow', (this.ta[byte] & pow) === pow);

        //console.log('[byte, bit, pow]', [byte, bit, pow]);

        //console.log('this.ta[byte]', this.ta[byte]);
        //console.log('this.ta[byte] & pow', this.ta[byte] & pow);

        // set a ta with values of the same type to the values to compare?

        //console.log('get_pixel_by_idx_1bipp 1 ? 0 : (this.ta[byte] & pow) == pow', 1 ? 0 : (this.ta[byte] & pow) == pow);

        return ((this.ta[byte] & pow) === pow) ? 1 : 0;

        //return 1 ? 0 : (this.ta[byte] & pow) === pow;
    }
    'get_pixel_by_idx_8bipp'(idx) {
        const byte = idx;
        return this.ta[byte];
    }
    'get_pixel_by_idx_24bipp'(idx) {
        const byte = idx * 3;
        return this.ta.slice(byte, byte + 3);
    }
    'get_pixel_by_idx_32bipp'(idx) {
        const byte = idx * 4;
        return this.ta.slice(byte, byte + 4);
    }

    'get_pixel_by_idx'(idx) {
        const bipp = this.bits_per_pixel;

        if (bipp === 1) {
            return this.get_pixel_by_idx_1bipp(idx);
        } else if (bipp === 8) {
            return this.get_pixel_by_idx_8bipp(idx);
        } else if (bipp === 24) {
            return this.get_pixel_by_idx_24bipp(idx);
        } else if (bipp === 32) {
            return this.get_pixel_by_idx_32bipp(idx);
        } else {
            throw 'Unsupported bipp'
        }
    }



    // Will redo get_pixel.
    //  likely to use tas by default, and built in type checking within minimal calling of any other functions.

    'get_pixel_1bipp'(pos) {
        // work out the pixel index...

        const idx = pos[1] * this.size[0] + pos[0];
        const byte = Math.floor(idx / 8);
        const bit = idx % 8;

        //console.log('byte, bit', [byte, bit]);

        // use roots of some sort?
        const pow = Math.pow(2, bit);
        // use AND with POW
        //console.log('get_pixel_1bipp 1 ? 0 : (this.ta[byte] & pow) === pow', 1 ? 0 : (this.ta[byte] & pow) === pow);
        return ((this.ta[byte] & pow) === pow) ? 1 : 0;
        //return 1 ? 0 : (this.ta[byte] & pow) === pow;
    }
    'get_pixel_8bipp'(pos) {
        const idx = pos[1] * this.size[0] + pos[0];
        const byte = idx;
        return this.ta[byte];
    }
    'get_pixel_24bipp'(pos) {
        const idx = pos[1] * this.size[0] + pos[0];
        const byte = idx * 3;

        return this.ta.slice(byte, byte + 3);
    }
    'get_pixel_32bipp'(pos) {
        
        const idx = pos[1] * this.size[0] + pos[0];
        const byte = idx * 4;

        return this.ta.slice(byte, byte + 4);
    }

    'get_pixel'(pos) {
        const bipp = this.bits_per_pixel;
        if (bipp === 1) {
            return this.get_pixel_1bipp(pos);
        } else if (bipp === 8) {
            return this.get_pixel_8bipp(pos);
        } else if (bipp === 24) {
            return this.get_pixel_24bipp(pos);
        } else if (bipp === 32) {
            return this.get_pixel_32bipp(pos);
        } else {
            console.trace();
            throw 'bits per pixels error';
        }
    }

    get num_px() {
        return this.size[0] * this.size[1];
    }


    /*

    get_pixel_ta(pos) {
        const ta_32_scratch = new Uint32Array(6);
        ta_32_scratch[0] = this.bytes_per_pixel;



        ta_32_scratch[1] = 0; // i
        ta_32_scratch[2] = this.size[0];
        ta_32_scratch[3] = this.size[1];

        ta_32_scratch[1] = ta_32_scratch[0] * (pos[0] + pos[1] * ta_32_scratch[2]);
        const buffer = this.buffer;
        //var r, g, b, a;
        //console.log('pixel_buffer_pos', pixel_buffer_pos);
        //console.log('x, y', x, y);
        //console.log('ta_32_scratch[1]', ta_32_scratch[1]);

        //const check = this.check_rect_bounds(x, y);
        if (this.check_rect_bounds(pos[0], pos[1])) {
            if (ta_32_scratch[0] === 1) {
                return buffer[ta_32_scratch[1]];
            } else if (ta_32_scratch[0] === 3) {
                return [buffer[ta_32_scratch[1]++], buffer[ta_32_scratch[1]++], buffer[ta_32_scratch[1]++]];
            } else if (ta_32_scratch[0] === 4) {
                return [buffer[ta_32_scratch[1]++], buffer[ta_32_scratch[1]++], buffer[ta_32_scratch[1]++], buffer[ta_32_scratch[1]++]];
            } else {
                //var stack = new Error().stack;
                //console.log(stack);
                throw '2) Must have bits_per_pixel set to 24 or 32';
            }
        }
    }

    // Return it as a typed array by default?

    'get_pixel'(x, y) {

        // (ta_pos, int_color || ta_color)

        // Could asess the param sig...
        //  Want to identify typed arrays in the sigs as well.
        //   and the typed array type. ...   ta_ui32 type...?
        //    but the abbreviations?
        //     maybe i
        //     maybe d
        //     




        const ta_32_scratch = new Uint32Array(6);
        ta_32_scratch[0] = this.bytes_per_pixel;
        ta_32_scratch[1] = 0; // i
        ta_32_scratch[2] = this.size[0];
        ta_32_scratch[3] = this.size[1];
        ta_32_scratch[4] = x;
        ta_32_scratch[5] = y;
        // 4 = x
        // 5 = y

        //const bytes_per_pixel = this.bits_per_pixel / 8;
        // will return [r, g, b] or [r, g, b, a];
        ta_32_scratch[1] = ta_32_scratch[0] * (ta_32_scratch[4] + ta_32_scratch[5] * ta_32_scratch[2]);
        const buffer = this.buffer;
        //var r, g, b, a;
        //console.log('pixel_buffer_pos', pixel_buffer_pos);
        //console.log('x, y', x, y);

        //const check = this.check_rect_bounds(x, y);
        if (this.check_rect_bounds(ta_32_scratch[4], ta_32_scratch[5])) {
            if (ta_32_scratch[0] === 3) {
                return [buffer[ta_32_scratch[1]++], buffer[ta_32_scratch[1]++], buffer[ta_32_scratch[1]++]];
            } else if (ta_32_scratch[0] === 4) {
                return [buffer[ta_32_scratch[1]++], buffer[ta_32_scratch[1]++], buffer[ta_32_scratch[1]++], buffer[ta_32_scratch[1]++]];
            } else if (ta_32_scratch[0] === 1) {
                return [buffer[ta_32_scratch[1]++]];
            } else {
                //var stack = new Error().stack;
                //console.log(stack);
                throw '3) Must have bits_per_pixel set to 24 or 32';
            }
        }
    }
    */



    // Will use a ta instead.
    //  or two....

    /*
    check_rect_bounds(x, y, w = 0, h = 0) {

        //console.log('x, y, w, h', x, y, w, h);
        //console.trace();

        if (x < 0) return false;
        if (y < 0) return false;
        if (x + w > this.size[0]) return false;
        if (y + h > this.size[1]) return false;
        return true;
    }
    */
    // Custom convolution not working here.
    // Iterating pixels for the line joining convolution sounds best.
    // Custom convolution seems like the way to go, but it's hard to implement.

    process(fn) {
        let res = this.clone();
        return fn(this, res);
    }

    /*
    function typedArraysAreEqual(a, b) {
  if (a.byteLength !== b.byteLength) return false;
  return a.every((val, i) => val === b[i]);
}

    */
    equals(other_pixel_buffer) {
        let buf1 = this.buffer;
        let buf2 = other_pixel_buffer.buffer;
        if (buf1.length === buf2.length) {
            return buf1.every((val, i) => val === buf2[i]);
        } else {
            return false;
        }
    }
    // get (rectangle) view
    //  A rectangular square of pixels.

    copy_pixel_pos_list_region(pixel_pos_list, bg_color) {
        // find the bounds of that pixel pos list.
        //  would help if the returned bounds included size.

        let bounds = pixel_pos_list.bounds;
        // not sure why the +1 is needed / helps
        let size = new Uint16Array([bounds[2] - bounds[0] + 1, bounds[3] - bounds[1] + 1]);
        //console.log('size', size);
        //console.log('bounds', bounds);

        // make a new pb

        const res = new this.constructor({
            size: size,
            bytes_per_pixel: this.bytes_per_pixel
        });
        if (this.pos) res.pos = this.pos;
        if (bg_color) {
            res.color_whole(bg_color);
        }
        res.pos = new Uint16Array([bounds[0], bounds[1]]);

        // each_pixel_rebounded?
        pixel_pos_list.each_pixel((pos) => {
            // then we copy pixels from the current image to the result.
            // set the result...
            let color = this.get_pixel_ta(pos);
            //console.log('color', color);
            //if (typeof color !== 'number') {
            //    console.log('color', color);
            //}
            const target_pos = new Uint16Array([(pos[0] - bounds[0]), (pos[1] - bounds[1])]);
            //const target_pos = new Uint16Array([(pos[0]), (pos[1])]);
            //const target_pos = pos;
            //console.log('target_pos, color', target_pos, color);
            res.set_pixel_ta(target_pos, color);
            //res.set_pixel()
        });
        return res;
    }
    // copy_rect_to
    //  copies it to another Pixel_Buffer

    // positions as UInt16Array?

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
            // The position of the copied rect...
            if (this.pos) {
                //res.pos = new Uint16Array([this.pos[0] + x, this.pos[1] + y]);
                res.pos = this.pos;
            } else {
                //res.pos = new Uint16Array([x, y]);
            }
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
                    buf_res[i_res++] = buf[i++];
                    buf_res[i_res++] = buf[i++];
                    buf_res[i_res++] = buf[i++];
                    buf_res[i_res++] = buf[i++];
                    //buf_res.writeUInt32BE(buf.readUInt32BE(i), i_res);
                    //i += 4;
                    //i_res += 4;
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
        if (this.pos) res.pos = this.pos;
        return res;
    }
    'clone'() {
        //console.log('1) this.bits_per_pixel', this.bits_per_pixel);
        var res = new this.constructor({
            'size': this.size,
            'bits_per_pixel': this.bits_per_pixel,
            'buffer': this.buffer.slice()
        });
        if (this.pos) res.pos = this.pos;
        //this.buffer.copy(res.buffer);
        //res.buffer.fill(0);
        return res;
    }

    // Want tests and examples to do with 1 bit per pixel images.
    //  Will be nice to use them quickly, especially with C++ and wasm plugins.


    // transform-to-new style functions.
    //  means a new object gets made.

    // Maybe better to use to_xbipp functions.
    //  As its clearer that it creates and outputs a new object.

    'change_bits_per_pixel'(new_bipp) {
        const old_bipp = this.bits_per_pixel;

        // could make a temporary bixel buffer to work with.
        //  ie, clone, reallocate own ta, read from clone, write to this.
        
        // Or may be easier to write / use functions that apply directly to the typed arrays.
        //  May be easier to port them over to C++.

        console.log('change_bits_per_pixel [old_bipp, new_bipp]', [old_bipp, new_bipp])

        if (old_bipp !== new_bipp) {

            if (old_bipp === 1) {

                if (new_bipp === 8) {

                } else if (new_bipp === 24) {

                } else if (new_bipp === 32) {

                }

            } else if (old_bipp === 8) {
                
            } else if (old_bipp === 24) {
                
            } else if (old_bipp === 32) {
                
            }


        }

    }



    // Will be done by changing the .bytes_per_pixel or .bits_per_pixel
    //  Though possibly they could call functions like this when needed.
    //  Would result in the original typed array being reallocated.

    'add_alpha_channel'() {
        console.log('add_alpha_channel this.bytes_per_pixel', this.bytes_per_pixel);
        if (this.bytes_per_pixel === 3) {
            var res = new this.constructor({
                'size': this.size,
                'bytes_per_pixel': 4
            });
            if (this.pos) res.pos = this.pos;
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



    // 

    

    //  again, change .bipp or .bypp. make aliases with those names? .bi .by even more abbreviated. Allow more abbreviated code, support aliases for that.
    // then need to be able to save as 8 bit bitmaps too.
    'to_8bit_greyscale'() {
        if (this.bytes_per_pixel === 1) {
            return this;
        }
        if (this.bytes_per_pixel === 3) {
            var res = new this.constructor({
                'size': this.size,
                'bits_per_pixel': 8
            });
            if (this.pos) res.pos = this.pos;
            const bres = res.buffer;
            // Then go over each of this pixel
            //  take average rgb values
            let i = 0;
            this.each_pixel((x, y, r, g, b, a) => {
                bres[i++] = Math.round((r + g + b) / 3);
                //i++;
            });
            return res;
        }
        if (this.bytes_per_pixel === 4) {
            var res = new this.constructor({
                'size': this.size,
                'bits_per_pixel': 8
            });
            if (this.pos) res.pos = this.pos;
            const bres = res.buffer;
            // Then go over each of this pixel
            //  take average rgb values
            let i = 0;
            this.each_pixel((x, y, r, g, b, a) => {
                bres[i++] = Math.round((r + g + b) / 3);
                //i++;
            });
            return res;
        }
    }

    'to_32bit_rgba'() {
        var res = new this.constructor({
            'size': this.size,
            'bits_per_pixel': 32
        });
        if (this.pos) res.pos = this.pos;
        const bres = res.buffer;
        if (this.bytes_per_pixel === 1) {
            // Then go over each of this pixel
            //  take average rgb values
            let i = 0;
            this.each_pixel((x, y, v) => {
                bres[i++] = v;
                bres[i++] = v;
                bres[i++] = v;
                bres[i++] = 255;
                //i++;
            });
        }
        return res;
    }

    'invert_greyscale_self'() {
        const bres = this.buffer;
        // Then go over each of this pixel
        //  take average rgb values
        let i = 0;
        this.each_pixel((x, y, v) => {
            bres[i++] = 255 - v;
        });
        return this;
    }
    
    // .invert
    //   and when it's on a greyscale image
    //   and do it in place.
    'invert_greyscale'() {
        let res = new this.constructor({
            'size': this.size,
            'bits_per_pixel': 8
        });
        if (this.pos) res.pos = this.pos;
        const bres = res.buffer;
        // Then go over each of this pixel
        //  take average rgb values
        let i = 0;
        this.each_pixel((x, y, v) => {
            bres[i++] = 255 - v;
        });
        return res;
    }

    // moving_pixels_indexes_window
    //  so it gives back the pixel indexes
    //  including index of central pixel

    // Would create a list of pixel offsets, then apply them to the lists of pixels generated.
    //  In some cases though, it would need to create a smaller result typed array.



    'moving_pixels_window'(offset_bounds, cb) {
        const [offset_l, offset_t, offset_r, offset_b] = offset_bounds;

        const check = (pos) => {
            if (pos[0] < 0) return false;
            if (pos[1] < 0) return false;
            if (pos[0] >= this.size[0]) return false;
            if (pos[1] >= this.size[1]) return false;
            return true;
        }

        // then for each pixel ta
        //  we then run through the pixels defined by the offsets

        this.each_pixel_pos((pos) => {
            //console.log('pos', pos);
            let ppl = new Pixel_Pos_List();

            let ymax = pos[1] + offset_b;
            let xmax = pos[0] + offset_r;
            let pos2 = new Int16Array(2);
            const s = this.size;
            for (pos2[1] = pos[1] + offset_t; pos2[1] <= ymax; pos2[1]++) {
                //console.log('pos2[1]', pos2[1]);
                for (pos2[0] = pos[0] + offset_l; pos2[0] <= xmax; pos2[0]++) {
                    
                    //let ok = check(pos2);
                    //console.log('ok', ok);

                    if (!(pos2[0] < 0 || pos2[1] < 0 || pos2[0] >= s[0] || pos2[1] >= s[1])) ppl.add(pos2);


                    //if (check(pos2)) ppl.add(pos2);
                }
                //throw 'stop';
            }
            ppl.fix();
            //console.log('ppl.ta', ppl.ta);
            cb(pos, ppl);
            //console.log('ppl.length', ppl.length);

            //console.log('ppl', ppl);
        });
    }
    // This could be used to make a function that will despeckle larger areas of an image.
    //  Could even have a fairly large speckle in the centre, but detect it's not corrected around the edges.
    //   Even an 11x11 window size. 

    // Moving pixels pixel setter
    //  And provide a 'set' function too?

    'moving_pixels_ppl_selector'(offset_bounds, fn_selector) {
        let res = new Pixel_Pos_List();
        this.moving_pixels_window(offset_bounds, (pos, ppl) => {
            if (fn_selector(pos, ppl) === true) {
                res.add(pos);
            }
        });
        res.fix();
        return res;
    }
    // Could reconstruct a new image from that ppl.

}


// Some more functionality and testing

// Moving pixel windows look important.

// Return a ppl of pixels within the bounds, for each pixel.
// 

module.exports = Pixel_Buffer_Core;

if (require.main === module) {
    const lg = console.log;

    (async() => {
        const run_examples = async() => {
            lg('Begin run examples');

            // A list of example functions. array.

            const examples = [
                async() => {
                    // just lg for log???
                    lg('Begin example 0');

                    // Change it to 1 bit per pixel.

                    // Maybe make a new 1 bit per pixel pixel buffer, and do some manipulations on it.

                    // Could make them small, such as 8 * 8, meaning 8 bytes. That would be a good starting point because each row is
                    //  1 byte.

                    // Can also try and test some set pixel and get pixel methods. See that it works with code on a small scale.
                    //  Then could work on expanding the scale once some maths has been better implemented and understood.

                    const pb = new Pixel_Buffer_Core({
                        bits_per_pixel: 1,
                        size: [8, 8]
                    });

                    // set_pixel(3, 3, 1);  // This could actually be faster though?
                    // set_pixel([3, 3], 1);
                    // set_pixel(ta_pos, 1);

                    const ta_pos = new Uint16Array(2);

                    ta_pos[0] = 3;
                    ta_pos[1] = 3;

                    // Adding or subtracting the significance of the bit would be a good way to do it.
                    //  Reference an array of bit signigicances. Modify the number. Don't try to directly access the bits.
                    //  Will have simpler JS code this way. Could then maybe make bit manipulation system.




                    pb.set_pixel(ta_pos, 1);



                    // Will do individual set pixel and get pixel functions.
                    //  Treat input using truthy or falsy.

                    // if ... == true.







                    lg('End example 0');

                }
            ]

            const l = examples.length;
            for (var c = 0; c < l; c++) {
                const res_eg = await examples[c]();
                console.log('res_eg ' + c + ':', res_eg);
            }


            lg('End run examples');

        }

        await run_examples();
    })();


    const __test1 = () => {


        // Will make various examples in the examples directory, and use them as the basis for tests in the future.
        //  Stabilise the version numbers in which example results are saved to use as tests.

        // Want to do some work on 1 bit per pixel images.

        // Make a few example functions that do some things.
        //  Could run examples written and from here, then move them to the examples directory.


        


        





        


        let pb = new Pixel_Buffer_Core({
            size: [1000, 1000],
            bytes_per_pixel: 1
        });
        console.log('pb.size', pb.size);



        // a moving pixels window with a set current pixel function.

        // a moving pixels window boolean pixel list selector function.
        //  it itself will create a pixel_pos list based on the inner / convolution-type function results.

        // moving_pixels_pixel_selector
        //  returns the moving pixels ppl window to a callback, adds that pixel to a ppl if the callback returns true.
        //  and it puts the selected pixels into a pixel pos list.
        

        //pos, color, ppl
        // and the ppls by offset?
        // also interested in the indexes and index offsets.

        // An array of pixel indexes would do the job.

        // Moving Pixel Indexes


        pb.moving_pixels_window(new Uint16Array([-2, -2, 2, 2]), (pos, ppl) => {
            //console.log('pos', pos);
            //console.log('ppl.length', ppl.length);

            // are all the border pixels white?


        });
    }
    //test1();

}
