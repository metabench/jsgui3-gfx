// So far it appears to be faster to have the local variables and the iteration of them all inline.


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
const copy_rect_8bipp = (xy, bounds, ta, ta_res, ta_byte_indexes, bytes_read_row_end_jump) => {
        // bytes_read_row_end_jump : ta_op_further_info[0]
    //const bytes_read_row_end_jump = ta_op_further_info[0];
    // Safety checking to begin with?
    for (xy[1] = bounds[1]; xy[1] < bounds[3]; xy[1]++) {
        for (xy[0] = bounds[0]; xy[0] < bounds[2]; xy[0]++) {
            ta_res[ta_byte_indexes[1]++] = ta[ta_byte_indexes[0]++];
        }
        // then row jump increase.
        ta_byte_indexes[0] += bytes_read_row_end_jump;
    }
}


const copy_rect_24bipp = (xy, bounds, ta, ta_res, ta_byte_indexes, bytes_read_row_end_jump) => {
    
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


const fill_solid_rect_by_bounds = (ta_dest, bypr_dest, ta_bounds, bipp, color) => {
    // Polymorphism with color being a number or a typed array?
    

    // Call a different specific function depending on curcumstances?

    if (bipp === 8) {
        return fill_solid_rect_by_bounds_8bipp(ta_dest, bypr_dest, ta_bounds, color);
    } else if (bipp === 24) {
        return fill_solid_rect_by_bounds_24bipp(ta_dest, bypr_dest, ta_bounds, color);
    } else if (bipp === 32) {

    } else {
        console.trace();
        
        throw 'Unsupported bipp: ' + bipp;
    }




}







//const unaligned_copy_rect_1to4bypp


module.exports = {
    copy_rect_8bipp: copy_rect_8bipp,
    copy_rect_24bipp: copy_rect_24bipp,
    copy_ta_byte_range: copy_ta_byte_range,
    unaligned_copy_rect_1to4bypp: unaligned_copy_rect_1to4bypp,
    unaligned_copy_rect_1bypp_to_3bypp: unaligned_copy_rect_1bypp_to_3bypp,
    fill_solid_rect_by_bounds: fill_solid_rect_by_bounds
}