

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


/*

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
*/


module.exports = {
    
    unaligned_copy_rect_1to4bypp: unaligned_copy_rect_1to4bypp,
    dest_aligned_copy_rect_1to4bypp: dest_aligned_copy_rect_1to4bypp,
    copy_rect_to_same_size_24bipp: copy_rect_to_same_size_24bipp,
    copy_rect_to_same_size_8bipp: copy_rect_to_same_size_8bipp,
    copy_ta_byte_range: copy_ta_byte_range
}