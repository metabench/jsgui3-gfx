// Simple enough... can add pixels, can iterate through the pixels.
//  Would be good to .to_pixel_buffer?

// Getting lists of pixel positions when extracting regions would be a nice optimization over bit masks that use 8 bpp.
//  While this is 32bpp, it's only specific pixels.

class Pixel_Pos_List {
    // Good for mapping smaller/medium regons within larger images. Different to a mask.

    constructor(spec) {
        // needs to be able to have more pixels added.
        //  For the moment, will be able to hold 10 million pixels

        const capacity = 2 * 1024 * 1024;
        let i = 0;
        //let num_pixels = 0;


        let ta_pixels = new Uint16Array(capacity * 2);
        //const ab = 
        // want to be able to iterate through the pixels.
        // want to be able to add pixels.
        this.ta = ta_pixels;
        this.add = (pos) => {
            //console.log('pos', pos);


            ta_pixels[i++] = pos[0];
            ta_pixels[i++] = pos[1];
        }
        this.each_pixel = (cb) => {
            //;
            for (let i2 = 0; i2 < i; i2 += 2) {
                cb(ta_pixels.slice(i2, i2 + 2));
            }
        }
        this.fix = () => {
            this.ta = ta_pixels = ta_pixels.slice(0, i);
        }

        this.equals = (pixel_pos_list) => {
            const other_ta = pixel_pos_list.ta,
                otal = other_ta.length,
                l = ta_pixels.length;
            if (otal === l) {
                for (c = 0; c < l; c++) {
                    if (other_ta[c] !== ta_pixels[c]) {
                        return false;
                    }
                }
                return true;
            } else {
                return false;
            }

        }

        Object.defineProperty(this, 'length', {
            // Using shorthand method names (ES2015 feature).
            // This is equivalent to:
            // get: function() { return bValue; },
            // set: function(newValue) { bValue = newValue; },
            get: () => ((i - 2) / 2),
            enumerable: true,
            configurable: false
        });

        let _bounds;
        Object.defineProperty(this, 'bounds', {
            // Using shorthand method names (ES2015 feature).
            // This is equivalent to:
            // get: function() { return bValue; },
            // set: function(newValue) { bValue = newValue; },
            get: () => {

                if (!_bounds) {
                    _bounds = new Uint16Array(4);
                    _bounds[0] = 1000000;
                    _bounds[1] = 1000000;
                    _bounds[2] = 0;
                    _bounds[3] = 0;
                    this.each_pixel(pos => {
                        //console.log('pos', pos);
                        if (pos[0] < _bounds[0]) _bounds[0] = pos[0];
                        if (pos[0] > _bounds[2]) _bounds[2] = pos[0];
                        if (pos[1] < _bounds[1]) _bounds[1] = pos[1];
                        if (pos[1] > _bounds[3]) _bounds[3] = pos[1];
                    })
                }
                return _bounds;
            },
            enumerable: true,
            configurable: false
        });
        let _pos;
        Object.defineProperty(this, 'pos', {
            // Using shorthand method names (ES2015 feature).
            // This is equivalent to:
            // get: function() { return bValue; },
            // set: function(newValue) { bValue = newValue; },
            get: () => {

                if (!_pos) {
                    _pos = new Uint16Array(2);
                    _pos[0] = 1000000;
                    _pos[1] = 1000000;
                    //res[2] = 0;
                    //res[3] = 0;
                    this.each_pixel(pos => {
                        //console.log('pos', pos);
                        if (pos[0] < _pos[0]) _pos[0] = pos[0];
                        //if (pos[0] > res[2]) res[2] = pos[0];
                        if (pos[1] < _pos[1]) _pos[1] = pos[1];
                        //if (pos[1] > res[3]) res[3] = pos[1];
                    })
                }
                return _pos;
            },
            enumerable: true,
            configurable: false
        });
    }
}

module.exports = Pixel_Pos_List;