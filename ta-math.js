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


module.exports = {
    copy_rect_8bipp: copy_rect_8bipp,
    copy_rect_24bipp: copy_rect_24bipp,
    copy_ta_byte_range: copy_ta_byte_range
}