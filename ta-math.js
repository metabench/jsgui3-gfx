// So far it appears to be faster to have the local variables and the iteration of them all inline.


// This could also be a place for maths concerning floating-point-based sub-pixel mapping.
//  Maybe will have algorithms that process many of these in sequence.




// Could give all params as single ta? But that's trickier to code.


// make bytes_read_row_end_jump typed?
//  put more into a single typed array, be specific about indexing?

// ta_rect_copy_info?


// ta_rect_copy_info would be of use, or ta_2_rects_op_info?
//  ta_op_info?
//   could contain the read and write byte pointers.
//    also bytes_read_row_end_jump
//    also bypp, bipp
//    source bypr
//    target bypr
//    num_channels


// different ta_op_info for:
//  2 bounds of same size
//  Whether or not there are different bipps in the different ta spaces.


// Yes, need to work a bit more on bounds overlap maths.

const roadmap = {
    '0.0.23': ['Calculation of bounds overlaps for better / more optimized convolutions',
        'Further integrate this into the ta_math system? More and more will go into ta_math when the logic gets abstracted away from the pbs more towards maths.',
        'Could even have ta_math apply convolutions with params given from the existing OO classes.'
    ]
}





// calculate intersecting bounds on 2 given bounds (given as tas)

const overlapping_bounds = (bounds_1, bounds_2, res_bounds = new Int16Array(4)) => {
    // the area of intersection between both bounds.

    //console.log('overlapping_bounds', overlapping_bounds);
    //console.log('bounds_1', bounds_1);
    //console.log('bounds_2', bounds_2);

    //console.trace();


    // Ensure the result is within the bounds of another...
    //  Need to find the range at which they overlap, if any.

    // A bit more than just ajusting one so it fits within the other?
    //  Maybe not? Could be based on that. Then check that it's not negative?

    // If bounds 1 were to fit within bounds 2, what would those new bounds be?

    // the max value of the lower bounds (x and y)
    // the min value of the higher bounds (x and y)

    //  see if it's positive
    //   otherwise return undefined? false?
    //   false could work well.



    // math.max and min? which would be faster?

    res_bounds[0] = bounds_1[0] < bounds_2[0] ? bounds_2[0] : bounds_1[0];
    res_bounds[1] = bounds_1[1] < bounds_2[1] ? bounds_2[1] : bounds_1[1];
    res_bounds[2] = bounds_1[2] > bounds_2[2] ? bounds_2[2] : bounds_1[2];
    res_bounds[3] = bounds_1[3] > bounds_2[3] ? bounds_2[3] : bounds_1[3];

    //throw 'stop';




    return res_bounds;
}




// could have a ta of [bytes_per_pixel, bytes_per_row]

// bytes per pixel may be better as a float, allowing for 1/8. Could try 3 bits per pixel - on or off, 3 color channels.
// width, bytes per pixel (allow 0.125?), bits per pixel, 

// pixels_per_row... source_width?
// source size?

// may indeed be worth passing on a ta_colorspace_description or similar... maybe a ta_colorspace or a Colorspace object.

const _colorspace_fields = ['width', 'height', 'bits_per_pixel', 'bytes_per_pixel', 'bits_per_row', 'bytes_per_row']
const __color_space_fields = ['size', 'ta_bpp', 'ta_bpr']
const ___colorspace_fields = ['width', 'height', 'bytes_per_pixel', 'bytes_per_row', 'bits_per_pixel', 'bits_per_row']

// could set the bytes_per to 0 (or -1) if it's in 1bipp mode.
//  only use the bipp and bipr values in these cases.
//  would allow the colorspace_fields to be Int16 or UInt16? 0 bypp and 0 bypr combined with bipp and bipr will indicate sub-bit pixel sizes.

// Could even try 12 bit pixels! 16 possible values each for r, g, b.







// Maybe keeping colorspace as a simple array would work best.
//  Using consts to get the value from the colorspace... would that work well?
// const [...] = _colorspace_fields



const byi_from_cs_pos = (colorspace, pos) => {
    const [width, height, bypp, bypr, bipp, bipr] = colorspace;
    //console.log('bypp, bypr', [bypp, bypr]);

    //console.log('pos', pos)
    //console.trace();

    return pos[0] * bypp + pos[1] * bypr;

}


// pb.color_space


// Could read it as a subarray.
//  Could then be writable too.

// Optionally set the res into an existing ta.
//  Benchmarks...

const read_px = (ta_source, ta_colorspace, ta_pos) => {

    // calculate byte index from pos and colorspace

    const bipp = ta_colorspace[4];

    //console.log('read_px bipp', bipp);

    if (bipp === 1) {
        // 1bipp
        console.trace();
        throw 'NYI';
    } else if (bipp === 8) {
        const byi = byi_from_cs_pos(ta_colorspace, ta_pos);
        return ta_source[byi];
    } else if (bipp === 24) {
        const byi = byi_from_cs_pos(ta_colorspace, ta_pos);

        //console.log('byi', byi);

        //console.log('ta_source.subarray(byi, byi + 3)', ta_source.subarray(byi, byi + 3));

        return ta_source.subarray(byi, byi + 3);
    } else if (bipp === 32) {
        const byi = byi_from_cs_pos(ta_colorspace, ta_pos);
        return ta_source.subarray(byi, byi + 4);
    }

    

}

//const read_4_px_rect = (ta_source, source_width, bytes_per_pixel, bytes_per_row, pos) => {


const read_2x1_rect = (ta_source, ta_colorspace, ta_pos) => {
    // will just return the values of these 2 px in a single ta.


    const [x, y] = ta_pos;
    const [width, height, bypp, bypr, bipp, bipr] = ta_colorspace;

    if (x < 0) {
        throw 'x position must be between 0 and (width - 1)'
    }
    if (x > width - 1) {
        throw 'x position must be between 0 and (width - 1)'
    }
    if (y < 0) {
        throw 'y position must be between 0 and height'
    }
    if (y > height) {
        throw 'y position must be between 0 and height'
    }

    let byi_read = (x * bypp) + (y * bypr);

    if (bipp === 1) {
        console.trace();
        throw 'NYI';
    } else if (bipp === 8) {
        // different result sizes... maybe return a specific version of this.
        // unsafe_read_4px_rect(different params?)
        
        // lets do the work here... not so much to do.
        const res = new Uint8ClampedArray(2);
        res[0] = ta_source[byi_read];
        res[1] = ta_source[byi_read + 1];
        //res[2] = ta_source[byi_read + bypr];
        //res[3] = ta_source[byi_read + bypr + 1];

        //res[0] = 


        return res;

    } else if (bipp === 24) {
        const res = new Uint8ClampedArray(6);
        //res[0] = 

        // best to read 2 rows of pixels. 6 bytes per row of the copy space.
        res.set(ta_source.subarray(byi_read, byi_read + 6), 0);
        //byi_read += bypr;
        //res.set(ta_source.subarray(byi_read, byi_read + 6), 6);



        return res;
        
    } else if (bipp === 32) {
        //console.trace();
        //throw 'NYI';
        const res = new Uint8ClampedArray(8);
        //res[0] = 

        res.set(ta_source.subarray(byi_read, byi_read + 8), 0);
        //byi_read += bypr;
        //res.set(ta_source.subarray(byi_read, byi_read + 8), 8);


        return res;
    }

}


const read_1x2_rect = (ta_source, ta_colorspace, ta_pos) => {
    // will just return the values of these 2 px in a single ta.


    const [x, y] = ta_pos;
    const [width, height, bypp, bypr, bipp, bipr] = ta_colorspace;

    if (x < 0) {
        throw 'x position must be between 0 and (width - 1)'
    }
    if (x > width - 1) {
        throw 'x position must be between 0 and (width - 1)'
    }
    if (y < 0) {
        throw 'y position must be between 0 and height'
    }
    if (y > height) {
        throw 'y position must be between 0 and height'
    }

    let byi_read = (x * bypp) + (y * bypr);

    if (bipp === 1) {
        console.trace();
        throw 'NYI';
    } else if (bipp === 8) {
        // different result sizes... maybe return a specific version of this.
        // unsafe_read_4px_rect(different params?)
        
        // lets do the work here... not so much to do.
        const res = new Uint8ClampedArray(2);
        res[0] = ta_source[byi_read];
        res[1] = ta_source[byi_read + bypr];
        //res[2] = ta_source[byi_read + bypr];
        //res[3] = ta_source[byi_read + bypr + 1];

        //res[0] = 


        return res;

    } else if (bipp === 24) {
        const res = new Uint8ClampedArray(6);
        //res[0] = 

        // best to read 2 rows of pixels. 6 bytes per row of the copy space.
        res.set(ta_source.subarray(byi_read, byi_read + 3), 0);
        byi_read += bypr;

        res.set(ta_source.subarray(byi_read, byi_read + 3), 3);
        //byi_read += bypr;
        //res.set(ta_source.subarray(byi_read, byi_read + 6), 6);



        return res;
        
    } else if (bipp === 32) {
        //console.trace();
        //throw 'NYI';
        const res = new Uint8ClampedArray(8);
        //res[0] = 

        res.set(ta_source.subarray(byi_read, byi_read + 4), 0);
        byi_read += bypr;
        res.set(ta_source.subarray(byi_read, byi_read + 4), 4);
        //res.set(ta_source.subarray(byi_read, byi_read + 8), 8);


        return res;
    }

}



// Hopefully will be v fast!
//  Consider C++ optimization too - but likely will be implemented and called in C++ because its very low level for some operations.
const read_4px_rect = (ta_source, ta_colorspace, ta_pos) => {

    const [x, y] = ta_pos;

    const [width, height, bypp, bypr, bipp, bipr] = ta_colorspace;

    //console.log('read_4_px_rect [width, height, bypp, bypr, bipp, bipr]', [width, height, bypp, bypr, bipp, bipr]);

    // Worth using pixel index / necessary to do so.
    //  Seems to come down to that at the lowest levels.





    // can not read an out of bounds 4px block
    //  should raise an error if it's attempted. it should not be attempted.

    // check it's within bounds...
    //  maybe better not to. see about speed increase when this is commented out.

    if (x < 0) {
        throw 'x position must be between 0 and (width - 1)'
    }
    if (x > width - 1) {
        throw 'x position must be between 0 and (width - 1)'
    }
    if (y < 0) {
        throw 'y position must be between 0 and (height - 1)'
    }
    if (y > height - 1) {
        throw 'y position must be between 0 and (height - 1)'
    }

    let byi_read = (x * bypp) + (y * bypr);

    if (bipp === 1) {
        console.trace();
        throw 'NYI';
    } else if (bipp === 8) {
        // different result sizes... maybe return a specific version of this.
        // unsafe_read_4px_rect(different params?)
        
        // lets do the work here... not so much to do.
        const res = new Uint8ClampedArray(4);
        res[0] = ta_source[byi_read];
        res[1] = ta_source[byi_read + 1];
        res[2] = ta_source[byi_read + bypr];
        res[3] = ta_source[byi_read + bypr + 1];

        //res[0] = 


        return res;

    } else if (bipp === 24) {
        const res = new Uint8ClampedArray(12);
        //res[0] = 

        // best to read 2 rows of pixels. 6 bytes per row of the copy space.
        res.set(ta_source.subarray(byi_read, byi_read + 6), 0);
        byi_read += bypr;
        res.set(ta_source.subarray(byi_read, byi_read + 6), 6);



        return res;
        
    } else if (bipp === 32) {
        //console.trace();
        //throw 'NYI';
        const res = new Uint8ClampedArray(16);
        //res[0] = 

        res.set(ta_source.subarray(byi_read, byi_read + 8), 0);
        byi_read += bypr;
        res.set(ta_source.subarray(byi_read, byi_read + 8), 8);


        return res;
    }






}







//  Could work out somewhat faster? Harder to program though???
//   May be simpler for C++ and making and using wrappers.
//   Could use consts to refer to positions in arrays?
//    Would be worth doing speed comparisons.





// (source, dest, ta_op_info)



// Or maybe it's worth providing existing tas? Supporting that at least.
//  The bounds etc are likely to be given as tas.



// This is really about:  *** Syncronised iteration of an xy position bounds within 2 typed arrays that share the same bits_per_pixel ***



// Wonder if the end jump value not in a ta slows it down? Compiler needs to guess / support multiple types.
//  Maybe calling it with numeric types is good?

// ta_op_further_info seems unnecessary...


// Try a version with a callback?


// Compacted param tas could be of use.

// all in one ta:?
//  xy, bounds, ta_byte_indexes, bytes_read_row_end_jump


// Maybe this will be fastest?

// Maybe make / make standard an Int32Array(16) or so
//  Could contain other info...


// Not using this kind of system for the moment. Going with variable names.
//  Will help porting too.


const idx_ta_vars = {
    0: ['xy', 0],
    1: ['xy', 1],
    2: ['bounds', 0],
    3: ['bounds', 1],
    4: ['bounds', 2],
    5: ['bounds', 3],
    6: 'byte_idx_read',
    7: 'byte_idx_write',
    8: 'bytes_read_row_end_jump'

    // Other...?
    /*
    9?  bytes_per_pixel
    10? bytes_per_read_row
    11? bytes_per_write_row

    */


}


// ta_math.unaligned_copy_rect_8to32bipp(source, dest, bounds_source, pos_dest, ... arguments that are needed for the iteration)
//  row end jump values for both read and write. that's the difference here. it's not that complex at all when programmed in great detail.

// could use own iterator local numbers?
//  probably not too strenuous for a JS fn call, also likely to already be well optimized.
//   maybe faster than using a ta?
//   worth investigating.
//    put specific benchmark questions in the roadmap.




// Move away from source and dest terminology?


// copy_rect_8bipp_compacted_args(ta_source, ta_dest, ta_vars)




//const copy_rect_8bipp = (xy, bounds, ta, ta_res, ta_byte_indexes, ta_op_further_info) => {




// Only copies / sync iterates when the write ta is the same size as the read bounds.
//  Mark this as specialised in some way...

// Probably worth doing more work on optimizing convolution?
//  Image resizing?
//  View / window coords remapping.


// A lot of the remapping is theoretical and could be best expressed in a functional way.

// Reading between 4 pixels in specified ratios, and merging them.
//  Could use a moving 4 pixel window that's remapped to the larger pixel window.

// Pixel_Buffer and its operations already involves some form of pixel remapping.
//  Could make a pixel remapping function.

// Virtual Super Resolution / Float resolution?
//  Using float resolution for reading could be cool.
//  Read a region defined by floats. Special cases for thwn it covers 4 pixels (or less)
//   All fits within one pixel, it's relatively easy.

// Probably best to make separate pixel_remapping file. Don't make Pixel_Buffer_Core that much more complex iright now.



// More flexible copy rect?
//  Only dealing with byte indexes in the iteration?
//  Not dealing with x and y
//  Would have the read and write byte positions.
//   have last_read_byte_in_row value?
//        last_write_byte_in row?
//   is worth counting y? easy enough.
//  let's stick with y x looping for the moment.


// js numbers have to be fast anyway. probably best not to go overboard with typed arrays (overuse in params)
//  copy_ta_byte_range(ta_source, ta_dest, byte_idx_source_start, byte_idx_dest_start, length);


// a function for the set subarray method?


const copy_ta_byte_range = (ta_source, ta_dest, byte_idx_source_start, byte_idx_dest_start, length) => {

    // Try the system from row copy.

    // Could try version with inner loop?

    ta_dest.set(ta_source.subarray(byte_idx_source_start, byte_idx_source_start + length), byte_idx_dest_start);

}


// Need more general version of this.

// Some more work on copying aligned / non-aligned tas.
//  Different mathematical operations needed for different image operations specifics.


// Should rename this to be more specific about it writing into the full ta space.
//  dest is the same size as the bounds.

// copy to same bounds size.

const copy_rect_to_same_size_8bipp = (xy, bounds, ta, ta_res, ta_byte_indexes, bytes_read_row_end_jump) => {
        // bytes_read_row_end_jump : ta_op_further_info[0]
    //const bytes_read_row_end_jump = ta_op_further_info[0];
    // Safety checking to begin with?

    // May as well use local variables for loop...
    


    for (xy[1] = bounds[1]; xy[1] < bounds[3]; xy[1]++) {
        for (xy[0] = bounds[0]; xy[0] < bounds[2]; xy[0]++) {
            ta_res[ta_byte_indexes[1]++] = ta[ta_byte_indexes[0]++];
        }
        // then row jump increase.
        ta_byte_indexes[0] += bytes_read_row_end_jump;
    }
}


const copy_rect_to_same_size_24bipp = (xy, bounds, ta, ta_res, ta_byte_indexes, bytes_read_row_end_jump) => {
    
    // Safety checking to begin with?
    for (xy[1] = bounds[1]; xy[1] < bounds[3]; xy[1]++) {
        for (xy[0] = bounds[0]; xy[0] < bounds[2]; xy[0]++) {

            //const ui8_px_value = ta[byte_idx_pb_read];
            //ui8_px_value = ta[byte_idx_pb_read];

            //console.log('byte_idx_pb_read')

            ta_res[ta_byte_indexes[1]++] = ta[ta_byte_indexes[0]++];
            ta_res[ta_byte_indexes[1]++] = ta[ta_byte_indexes[0]++];
            ta_res[ta_byte_indexes[1]++] = ta[ta_byte_indexes[0]++];

            // But don't need to copy the px value in many cases.

            //  Maybe have / use lower level fuctions for copying between different pbs / tas.
            //  Iterating spaces.
            //   Iterating spaces defined by a function / equation?
            //    Eg could functionally / mathematically define a circle and draw it.
            
            // got the xy iteration pos set correctly here :)

            // could copy px values?
            //  reading and using them directly may work best....

            //byte_idx_pb_read += bytes_per_pixel;

        }
        // then row jump increase.
        ta_byte_indexes[0] += bytes_read_row_end_jump;
    }
}

// pre-running functions to uptimize them?


// Worth writing and trying / exemplifying fast copy algorithms.

// copy from 8bipp to 24 bipp as well.
//   likely should read and write by pixel?
//   should be easy to make synced algorithm for this.


// for the moment, likely to use many function parameters...

// Will use byte index iteration?
//  Will do xy iteration having been given the source bounds and the dest pos?




// Use byte indexes?

// bytes_pre_row source
// bytes_per_row_dest

// bypr_source


// dest_pos is alway [0, 0]. For when the size of the copied area = the size of the dest.

const dest_aligned_copy_rect_1to4bypp = (ta_source, ta_dest, bypr_source, bytes_per_pixel, ta_source_bounds) => {
    let y;



    // check ta_dest.length meets expectation?


    //console.log('ta_source_bounds', ta_source_bounds);
    //console.log('bytes_per_pixel', bytes_per_pixel);


    // Uses copy ta byte range function underneith.

    // need to calculate initial read and write byte idxs

    // calculate the start index for both the source and the dest.

    


    const bounds_row_width = ta_source_bounds[2] - ta_source_bounds[0];
    const bypr_dest = bounds_row_width * bytes_per_pixel;
    //console.log('bounds_row_width', bounds_row_width);
    const bytes_per_bounds_row = bytes_per_pixel * bounds_row_width;


    const byi_read_start = (ta_source_bounds[0] * bytes_per_pixel) + (ta_source_bounds[1] * bypr_source);
    //const byi_dest_start = (bytes_per_pixel) + (ta_dest_pos[1] * bypr_dest);
    const byi_dest_start = 0;

    let byi_read = byi_read_start, byi_write = byi_dest_start;
    //const bytes_source_row_jump = bypr_source - bytes_per_bounds_row, bytes_dest_row_jump = bypr_dest - bytes_per_bounds_row;

    //console.log('bytes_source_row_jump', bytes_source_row_jump);
    //console.log('bytes_dest_row_jump', bytes_dest_row_jump);

    //console.log('bytes_per_bounds_row', bytes_per_bounds_row);


    for (y = ta_source_bounds[1]; y < ta_source_bounds[3]; y++) {
        //console.log('byi_read, byi_write', [byi_read, byi_write]);
        copy_ta_byte_range(ta_source, ta_dest, byi_read, byi_write, bytes_per_bounds_row);

        byi_read += bypr_source;
        byi_write += bypr_dest;

        // use the sopy row function?
        //  worth giving it a try.

        // Can use the full row copy procedure.
        //copy_ta_byte_range
    }
}


// Worth writing and using some copy algorithms. Further work on supporting abstractions / data.

const unaligned_copy_rect_1to4bypp = (ta_source, ta_dest, bypr_source, bypr_dest, bytes_per_pixel, ta_source_bounds, ta_dest_pos) => {
    // try own local y and x...

    let y;

    //console.log('ta_source_bounds', ta_source_bounds);
    //console.log('bytes_per_pixel', bytes_per_pixel);


    // Uses copy ta byte range function underneith.

    // need to calculate initial read and write byte idxs

    // calculate the start index for both the source and the dest.

    const bounds_row_width = ta_source_bounds[2] - ta_source_bounds[0];
    //console.log('bounds_row_width', bounds_row_width);
    const bytes_per_bounds_row = bytes_per_pixel * bounds_row_width;

    //console.log('bypr_source', bypr_source);
    //console.log('bypr_dest', bypr_dest);


    const byi_read_start = (ta_source_bounds[0] * bytes_per_pixel) + (ta_source_bounds[1] * bypr_source);
    const byi_dest_start = (ta_dest_pos[0] * bytes_per_pixel) + (ta_dest_pos[1] * bypr_dest);

    //console.log('byi_read_start', byi_read_start);
    //console.log('byi_dest_start', byi_dest_start);

    let byi_read = byi_read_start, byi_write = byi_dest_start;


    // Use this 'jump' method when dealing with advancing the position to the end of the r/w row.
    //  Copying whole rows, need to advance the whole row position.
    //const bytes_source_row_jump = bypr_source - bytes_per_bounds_row, bytes_dest_row_jump = bypr_dest - bytes_per_bounds_row;

    //console.log('bytes_source_row_jump', bytes_source_row_jump);
    //console.log('bytes_dest_row_jump', bytes_dest_row_jump);

    //console.log('bytes_per_bounds_row', bytes_per_bounds_row);



    for (y = ta_source_bounds[1]; y < ta_source_bounds[3]; y++) {
        //console.log('byi_read, byi_write', [byi_read, byi_write]);
        copy_ta_byte_range(ta_source, ta_dest, byi_read, byi_write, bytes_per_bounds_row);

        byi_read += bypr_source;
        byi_write += bypr_dest;

        // use the sopy row function?
        //  worth giving it a try.

        // Can use the full row copy procedure.

        //copy_ta_byte_range
    }
}

// dest_aligned_copy_rect_1to4bypp
//  the destination size is aligned with the ta_source_bounds
//   could check that previously in a more generalised copy_rect function.











// Somewhat slower than copying whole rows like above.
const _direct_unaligned_copy_rect_1bypp_to_3bypp = (ta_source, ta_dest, bypr_source, bypr_dest, ta_source_bounds, ta_dest_pos) => {
    // x and y iteration.

    let x, y;
    const source_bytes_per_pixel = 1;
    const dest_bytes_per_pixel = 3;

    const bounds_row_width = ta_source_bounds[2] - ta_source_bounds[0];

    //const bytes_per_bounds_row = bytes_per_pixel * bounds_row_width;

    //console.log('bypr_source', bypr_source);
    //console.log('bypr_dest', bypr_dest);

    



    const byi_read_start = (ta_source_bounds[0] * source_bytes_per_pixel) + (ta_source_bounds[1] * bypr_source);
    const byi_dest_start = (ta_dest_pos[0] * dest_bytes_per_pixel) + (ta_dest_pos[1] * bypr_dest);

    //console.log('byi_read_start', byi_read_start);
    //console.log('byi_dest_start', byi_dest_start);

    let byi_read = byi_read_start, byi_write = byi_dest_start;

    const bytes_source_row_jump = bypr_source - (bounds_row_width * source_bytes_per_pixel);
    const bytes_dest_row_jump = bypr_dest - (bounds_row_width * dest_bytes_per_pixel);


    for (y = ta_source_bounds[1]; y < ta_source_bounds[3]; y++) {
        //console.log('byi_read, byi_write', [byi_read, byi_write]);
        for (x = ta_source_bounds[1]; x < ta_source_bounds[3]; x++) {
            //console.log('byi_read, byi_write', [byi_read, byi_write]);

            // set the pixel.
            ta_dest[byi_write++] = ta_source[byi_read];
            ta_dest[byi_write++] = ta_source[byi_read];
            ta_dest[byi_write++] = ta_source[byi_read++];

            //copy_ta_byte_range(ta_source, ta_dest, byi_read, byi_write, bytes_per_bounds_row);

            // use row jumping?

            //byi_read += bypr_source;
            //byi_write += bypr_dest;
    
            // use the sopy row function?
            //  worth giving it a try.
    
            // Can use the full row copy procedure.
    
            //copy_ta_byte_range
        }
        // use row jump numbers here.

        byi_read += bytes_source_row_jump;
        byi_write += bytes_dest_row_jump;

    }

}

const unaligned_copy_rect_1bypp_to_3bypp = _direct_unaligned_copy_rect_1bypp_to_3bypp

// unaligned_copy_rect_1bypp_to_3bypp

//  Possibly even use a row conversion function?


const fill_solid_rect_by_bounds_8bipp = (ta_dest, bypr_dest, ta_bounds, ui8_color) => {
    // create a row filled with that color.

    // need the bypr of dest.

    const row_width = ta_bounds[2] - ta_bounds[0];
    const bytes_per_row = row_width;
    const ta_write_row = (new Uint8ClampedArray(bytes_per_row)).fill(ui8_color);
    // iterate through you values...

    const byi_dest_start = (ta_bounds[0]) + (ta_bounds[1] * bypr_dest);
    let byi_write = byi_dest_start;

    for (let y = ta_bounds[1]; y < ta_bounds[3]; y++) {
        //console.log('byi_read, byi_write', [byi_read, byi_write]);
        ta_dest.set(ta_write_row, byi_write);
        //byi_read += bytes_source_row_jump;
        byi_write += bypr_dest;
    }
}

// And make the 24 bipp version.
//  Setting up the initial row would take longer.
//   Worth having the function written in a ta-access more purely mathematical way.
//    May make more functions for the pb classes that wrap these in a cool / efficient way.




const fill_solid_rect_by_bounds_24bipp = (ta_dest, bypr_dest, ta_bounds, ta_rgb) => {
    // create a row filled with that color.

    // need the bypr of dest.

    const row_width = ta_bounds[2] - ta_bounds[0];
    const bytes_per_row = row_width * 3;
    const ta_write_row = (new Uint8ClampedArray(bytes_per_row));

    //const l = 

    let cc = 0, c = 0;
    while (c < bytes_per_row) {
        ta_write_row[c++] = ta_rgb[cc++];
        //cc++;
        if (cc === 3) cc = 0;
        //c++;
    }
    // iterate through you values...

    const byi_dest_start = (ta_bounds[0] * 3) + (ta_bounds[1] * bypr_dest);
    let byi_write = byi_dest_start;

    for (let y = ta_bounds[1]; y < ta_bounds[3]; y++) {
        //console.log('byi_read, byi_write', [byi_read, byi_write]);
        ta_dest.set(ta_write_row, byi_write);
        //byi_read += bytes_source_row_jump;
        byi_write += bypr_dest;
    }
}


// A ta-math directory may be better.
//  directories:
//  read
//  copy
//  write / paint




// paint_rect
//  maybe have paint functions separate
//  copy functions separate




const fill_solid_rect_by_bounds = (ta_dest, bypr_dest, ta_bounds, bipp, color) => {
    // Polymorphism with color being a number or a typed array?
    

    // Call a different specific function depending on curcumstances?

    if (bipp === 8) {
        return fill_solid_rect_by_bounds_8bipp(ta_dest, bypr_dest, ta_bounds, color);
    } else if (bipp === 24) {
        return fill_solid_rect_by_bounds_24bipp(ta_dest, bypr_dest, ta_bounds, color);
    } else if (bipp === 32) {
        console.trace();
        throw 'NYI';
    } else {
        console.trace();
        
        throw 'Unsupported bipp: ' + bipp;
    }




}







//const unaligned_copy_rect_1to4bypp


module.exports = {
    overlapping_bounds: overlapping_bounds,
    copy_rect_to_same_size_8bipp: copy_rect_to_same_size_8bipp,
    copy_rect_to_same_size_24bipp: copy_rect_to_same_size_24bipp,
    copy_ta_byte_range: copy_ta_byte_range,
    unaligned_copy_rect_1to4bypp: unaligned_copy_rect_1to4bypp,
    unaligned_copy_rect_1bypp_to_3bypp: unaligned_copy_rect_1bypp_to_3bypp,
    dest_aligned_copy_rect_1to4bypp: dest_aligned_copy_rect_1to4bypp,
    fill_solid_rect_by_bounds: fill_solid_rect_by_bounds,
    read_1x2_rect: read_1x2_rect,
    read_2x1_rect: read_2x1_rect,
    read_4px_rect: read_4px_rect,
    read_px: read_px,
    read_pixel: read_px
}