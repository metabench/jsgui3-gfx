const Virtual_Float_Pixel = require('../virtual-float-pixel');

// Read in one place, transform, write in another place.






const read_merged_vfpx_write_24bipp = (ta_source, colorspace, vfpx, ta_dest, byi_dest_write) => {
    //const [width, height, bypp, bypr, bipp, bipr] = colorspace;

    

    const bypr = colorspace[3];
    const {weights, i_any_coverage_bounds} = vfpx;
    // 
    const xy = new Int16Array(2);
    let byi_read = 3 * i_any_coverage_bounds[0] + bypr * i_any_coverage_bounds[1];
    let byi_weight = 0;
    // 

    //const iw = ;

    const bytes_read_row_end_jump = bypr - (i_any_coverage_bounds[2] - i_any_coverage_bounds[0]) * 3;
    const acc_rgb = new Float32Array(3);
    // Probably a problem at this merging stage.

    //console.log('colorspace: [width, height, bypp, bypr, bipp, bipr]', [width, height, bypp, bypr, bipp, bipr]);
    //console.log('vfpx.i_size', vfpx.i_size);
    //console.log('vfpx.i_any_coverage_bounds', vfpx.i_any_coverage_bounds);

    //console.log('weights', weights);

    for (xy[1] = i_any_coverage_bounds[1]; xy[1] < i_any_coverage_bounds[3]; xy[1]++) {
        for (xy[0] = i_any_coverage_bounds[0]; xy[0] < i_any_coverage_bounds[2]; xy[0]++) {

            //const ui8_px_value = ta[byte_idx_pb_read];
            //ui8_px_value = ta[byte_idx_pb_read];

            //console.log('byte_idx_pb_read')

            acc_rgb[0] += ta_source[byi_read++] * weights[byi_weight];
            acc_rgb[1] += ta_source[byi_read++] * weights[byi_weight];
            acc_rgb[2] += ta_source[byi_read++] * weights[byi_weight++];
            //ta_res[ta_byte_indexes[1]++] = ta[byi_read[0]++];
            //ta_res[ta_byte_indexes[1]++] = ta[byi_read[0]++];

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
        byi_read += bytes_read_row_end_jump;
    }
    ta_dest.set(acc_rgb, byi_dest_write);
}




// Work on 8 and 32 bipp as well...


// also worth considering x100 or x1000 virtual resolution while still using integers (int32)



// A few different optimized way to do this...

// Source px iteration
//  Would read and hold the neighbouring pixel values so they don't need to be re-looked-up.
//  From each source pixel, calculate and write each dest pixel that has its tl in that cell.
//   Would iterate over write position / byte index

// Could have smaller algorithm for writing from a single given ipx.



// Lets make a working algo implementation...
//  Not with every optimization.




// direct write functions using byte indexes would be of use too.
//  dont know how much functions will be inlined during compilaion though.


// $1000xint_scale_mapping

// Would be interesting to read from an input virtual pixel space, still using ints, but 1000 times the size.




const resize_ta_colorspace_24bipp_subpixels$source_ipos_iterate = (ta_source, source_colorspace, dest_size, opt_ta_dest) => {
    // Calculate every dest position that has its tl (ie pos) within this source pixel.




}

/*
for (dest_iy = 0; dest_iy < dest_iheight; dest_iy++) {
    
}





let source_iy_bottom, source_ix_right;


for (dest_iy = 0, source_fy = 0; dest_iy < dest_iheight; dest_iy++, source_fy += fpx_h, source_fy_bottom += fpx_h) {
    //console.log('[dest_iy, source_fy]', [dest_iy, source_fy]);
    

    //prev_source_fx_bottom = source_fx_bottom;
    source_iy_bottom = Math.floor(source_fy_bottom);   //still fast!
}




// Both loops together < 5ms.
let source_iy_bottom, source_ix_right;


for (dest_iy = 0, source_fy = 0; dest_iy < dest_iheight; dest_iy++, source_fy += fpx_h, source_fy_bottom += fpx_h) {
    //console.log('[dest_iy, source_fy]', [dest_iy, source_fy]);


    for (dest_ix = 0, source_fx = 0; dest_ix < dest_iwidth; dest_ix++, source_fx += fpx_w, source_fy_bottom += fpx_w) {
        //console.log('[dest_iy, source_fy]', [dest_iy, source_fy]);
        

        //prev_source_fx_bottom = source_fx_bottom;
        //source_iy_bottom = Math.floor(source_fy_bottom);   //still fast!
    }

    

    //prev_source_fx_bottom = source_fx_bottom;
    source_iy_bottom = Math.floor(source_fy_bottom);   //still fast!
}



// 5.2ms with further x floor assignment.
for (dest_iy = 0, source_fy = 0; dest_iy < dest_iheight; dest_iy++, source_fy += fpx_h, source_fy_bottom += fpx_h) {
    //console.log('[dest_iy, source_fy]', [dest_iy, source_fy]);
    source_iy_bottom = Math.floor(source_fy_bottom);   //still fast!
    for (dest_ix = 0, source_fx = 0; dest_ix < dest_iwidth; dest_ix++, source_fx += fpx_w, source_fy_bottom += fpx_w) {
        //console.log('[dest_iy, source_fy]', [dest_iy, source_fy]);

        source_ix_right = Math.floor(source_fx_right);   //still fast!
        

        //prev_source_fx_bottom = source_fx_bottom;
        //source_iy_bottom = Math.floor(source_fy_bottom);   //still fast!
    }

    //prev_source_fx_bottom = source_fx_bottom;
    
}

// Still more complex loop itself. <5 to <7 ms, doing well.
for (dest_iy = 0, source_fy = 0; dest_iy < dest_iheight; dest_iy++, source_fy += fpx_h, source_fy_bottom += fpx_h, source_iy_bottom = Math.floor(source_fy_bottom)) {
    
    for (dest_ix = 0, source_fx = 0; dest_ix < dest_iwidth; dest_ix++, source_fx += fpx_w, source_fy_bottom += fpx_w, source_ix_right = Math.floor(source_fx_right)) {
        
    }

    //prev_source_fx_bottom = source_fx_bottom;
    
}


// now approx 5.5 to 8 ms:

let prev_source_ix_right, prev_source_iy_bottom;

// then the integer-only (floored) source bottom and source right.

let source_iy_bottom, source_ix_right;

// Change checking, to update tai_2x2_byte_indexes?

for (dest_iy = 0, source_fy = 0; dest_iy < dest_iheight; dest_iy++, source_fy += fpx_h, source_fy_bottom += fpx_h, source_iy_bottom = Math.floor(source_fy_bottom)) {
    
    for (dest_ix = 0, source_fx = 0; dest_ix < dest_iwidth; dest_ix++, source_fx += fpx_w, source_fy_bottom += fpx_w, source_ix_right = Math.floor(source_fx_right)) {
        

        prev_source_ix_right = source_ix_right;
    }

    //prev_source_fx_bottom = source_fx_bottom;
    prev_source_iy_bottom = source_iy_bottom;
}



for (dest_iy = 0, source_fy = 0; dest_iy < dest_iheight; dest_iy++, source_fy += fpx_h, source_fy_bottom += fpx_h, source_iy_bottom = Math.floor(source_fy_bottom)) {
    
    for (dest_ix = 0, source_fx = 0; dest_ix < dest_iwidth; dest_ix++, source_fx += fpx_w, source_fy_bottom += fpx_w, source_ix_right = Math.floor(source_fx_right)) {

        if (source_ix_right != prev_source_ix_right) {
            
        }
        

        prev_source_ix_right = source_ix_right;
    }

    //prev_source_fx_bottom = source_fx_bottom;
    prev_source_iy_bottom = source_iy_bottom;
}


*/


// Another implementation using only int math, but having a virtual scale of 1000x would be of some use.

// read_i1000scale_merged_px(source_ta, colorspace, i1000pos, i1000size);

//  Then can have the maths restricted to int maths, and iterate / move through the color space.





const resize_ta_colorspace_24bipp_subpixels$dest_ipos_iterate = (ta_source, source_colorspace, dest_size, opt_ta_dest) => {

    // Read from the source pixel(s).
    //  Has its own subiteration of the source pixel space?

    // Should know when it moves into a new source pixel (considering the tl space)
    //  Hold 4 cached pixel values in one array?
    //  Hold the positions and offsets of them?

    const ta_dest = opt_ta_dest;

    // That would make a lot of sense.
    const source_size = source_colorspace.subarray(0, 2);

    // const [width, height, bypp, bypr, bipp, bipr] = source_colorspace;
    const source_bypr = source_colorspace[3];

    //Float64

    const dest_to_source_x_ratio = source_size[0] / dest_size[0];
    const dest_to_source_y_ratio = source_size[1] / dest_size[1];

    const dest_to_source_ratio = new Float32Array([dest_to_source_x_ratio, dest_to_source_y_ratio]);


    const source_vfpixel_size = dest_to_source_ratio;

    //const [fpx_w, fpx_h] = source_vfpixel_size;

    const [dest_iwidth, dest_iheight] = dest_size;

    const bytes_per_pixel = 3;

    const tai_2x2_byte_indexes = new Int32Array(4);
    //  will be fast enough to keep these updated / incremented.

    // Need to know when the source position changes.

    // ta old source position, ta new source position?
    //  reference swapping / nullifying?

    


    // the i dest position gets updated by the for loop.
    //  the f source posiion gets incremented.

    // Could use / try a double for loop.
    //  Local variables may indeed be faster for these loops, makes for simpler code too. Worth testing...


    let source_ix, source_iy, source_fx, source_fy, dest_ix, dest_iy;


    //let [source_fx_right, source_fy_bottom] = source_vfpixel_size;

    // then the right and the bottom of these source fpx...?
    //  need to have some things efficiently detected, ie show up through the normal iteration.
    //   may be able to get it SO much faster in js

    // So the iteration for loop keep track of 3 positions now.

    // previous ix, iy?
    //  whenever it changes, can read a new 4 pixel block.
    //   or only read the 4 pixel block if it extends downward?
    //   otherwise make use of the 2 pixel block?

    // Possibly good usage of byte indexes (for read pos) would make reading the pixel block unnecessary.
    //  Maintaining byte indexes looks best for the moment.
    //  Each read pixel advance, update the byte index.


    let byi_read_tl = 0, byi_read_tr = bytes_per_pixel, byi_read_bl = source_bypr, byi_read_br = source_bypr + bytes_per_pixel;
    // And increment these by bytes_per_pixel whenever it moves to the next pixel.
    //  Careful about row ends...?

    let prev_source_ix, prev_source_iy;

    // then the integer-only (floored) source bottom and source right.

    //let source_fy_bottom, source_fx_right;
    //  Seems like it would be quicker too to interate these rather than calculate.

    let [source_fy_bottom, source_fx_right] = [dest_to_source_x_ratio, dest_to_source_y_ratio];
    //  Keep this using 64? bit number system to avoid / lessen rounding errors.

    let source_iy_bottom, source_ix_right;
    let extends_down = false, extends_right = false;


    let proportion_top = 0, proportion_left = 0;

    let source_fx_left_of_crossover, source_fx_right_of_crossover, source_fy_above_crossover, source_fy_below_crossover;


    let byi_write = 0;

    // Change checking, to update tai_2x2_byte_indexes?

    for (dest_iy = 0, source_fy = 0; dest_iy < dest_iheight; dest_iy++, source_fy += dest_to_source_y_ratio, source_fy_bottom += dest_to_source_y_ratio) {
        //console.log('source_fy_bottom', source_fy_bottom);


        // worth calculating crossover proportions - as if it extends below by 0.000001 px then it's a rounding error.




        // May falsely detect it crossing down because of accuracy loss.

        source_iy = Math.floor(source_fy);
        source_iy_bottom = Math.floor(source_fy_bottom);

        source_fy_above_crossover = (source_iy + 1) - source_fy;
        source_fy_below_crossover = source_fy_bottom - (source_iy + 1);

        //console.log('');
        //console.log('source_fy_above_crossover', source_fy_above_crossover);
        //console.log('source_fy_below_crossover', source_fy_below_crossover);
        // Can be negative at this stage.

        extends_down = source_fy_below_crossover >= 0.000001;

        if (extends_down) {
            proportion_top = source_fy_above_crossover / source_fy_below_crossover;
        } else {
            proportion_top = 1;
        }
        //console.log('extends_down', extends_down);
        // and only when it extends down does the crossover amount matter.


        //extends_down = source_iy !== source_iy_bottom;
        //console.log('extends_down', extends_down);

        // the floating point bottom of the pixel....



        // calculate the extends_down value for the whole row.

        // Then a different inner loop depending on if it extends down or not.
        
        if (extends_down) {

            // Calculate the up/down ratio.
            //  proportion_in_tl...?

            // How far down does it start?

            // float top offset from crossover y

            //proportion_top = 1 - (source_fy - source_iy);
            //console.log('proportion_top', proportion_top);

            for (dest_ix = 0, source_fx = 0; dest_ix < dest_iwidth; dest_ix++, source_fx += dest_to_source_x_ratio, source_fx_right += dest_to_source_x_ratio) {
                source_ix = Math.floor(source_fx)
                source_ix_right = Math.floor(source_fx_right);

                source_fx_left_of_crossover = (source_ix + 1) - source_fx;
                source_fx_right_of_crossover = source_fx_right - (source_iy + 1);


                // Calc the amount it extends right, then account for rounding errors.





                //extends_right = source_iy !== source_iy_bottom;


                // and check if it's enclosed in the same subpixel as b4?
    
                //console.log('source_ix', source_ix);
                //console.log('prev_source_ix', prev_source_ix);
                if (source_ix !== prev_source_ix) {
                    byi_read_tl += bytes_per_pixel;
                    byi_read_tr += bytes_per_pixel;
                    byi_read_bl += bytes_per_pixel;
                    byi_read_br += bytes_per_pixel;
                }

                if (extends_right) {
                    // 2x2
                    // proportions...


                    byi_write += 3;
                } else {
                    // 1x2
                    byi_write += 3;
                }

                //throw 'stop';
    
                //console.log('[byi_read_tl, byi_read_tr, byi_read_bl, byi_read_br]', [byi_read_tl, byi_read_tr, byi_read_bl, byi_read_br]);
    
    
    
    
                
    
                prev_source_ix = source_ix;
            }


        } else {


            for (dest_ix = 0, source_fx = 0; dest_ix < dest_iwidth; dest_ix++, source_fx += dest_to_source_x_ratio, source_fx_right += dest_to_source_x_ratio) {
                source_ix = Math.floor(source_fx)
                source_ix_right = Math.floor(source_fx_right);
                extends_right = source_iy !== source_iy_bottom;
                // and check if it's enclosed in the same subpixel as b4?
    
                //console.log('source_ix', source_ix);
                //console.log('prev_source_ix', prev_source_ix);
                if (source_ix !== prev_source_ix) {
                    byi_read_tl += bytes_per_pixel;
                    byi_read_tr += bytes_per_pixel;
                    byi_read_bl += bytes_per_pixel;
                    byi_read_br += bytes_per_pixel;
                }

                if (extends_right) {
                    // 2x1
                    byi_write += 3;
                } else {
                    // 1x1 direct px copy
                    ta_dest[byi_write++] = ta_source[byi_read_tl];
                    ta_dest[byi_write++] = ta_source[byi_read_tl + 1];
                    ta_dest[byi_write++] = ta_source[byi_read_tl + 2];

                }
                //throw 'stop';
    
                //console.log('[byi_read_tl, byi_read_tr, byi_read_bl, byi_read_br]', [byi_read_tl, byi_read_tr, byi_read_bl, byi_read_br]);
    
    
    
    
                
    
                prev_source_ix = source_ix;
            }

        }

        
        

        //prev_source_fx_bottom = source_fx_bottom;
        prev_source_iy = source_iy;
    }
}

const resize_ta_colorspace_24bipp_subpixels = resize_ta_colorspace_24bipp_subpixels$dest_ipos_iterate;


const _attempt1_resize_ta_colorspace_24bipp_subpixels = (ta_source, source_colorspace, dest_size, opt_ta_dest) => {

    // More optimized algo here...

    // check opt_ta_dest is the right size.
    //  could use info.js or other new file such as validate.js.



    const source_size = source_colorspace.subarray(0, 2);

    const dest_to_source_ratio = new Float32Array([source_size[0] / dest_size[0], source_size[1] / dest_size[1]]);
    //console.log('dest_to_source_ratio', dest_to_source_ratio);
    const source_vfpixel_size = dest_to_source_ratio;

    console.log('source_vfpixel_size', source_vfpixel_size);

    const source_fpos = new Float32Array(2);
    const source_ipos = new Int32Array(2);

    // source byte index of the ipos...

    let b_read_ipos = 0;
    // Yes, would definitely be worth having this, and using it in an optimized way.
    //  Knowing when to increment this is important.


    // Having the system know when the ipx pos and therefore the index, advances, would be very useful.
    //  Will read up to 4 pixels based on this index value and offsets from it.

    // b_read_below_offset
    // b_read_right_offset
    // b_read_below_right_offset

    // maintining and incrementing the b_read value makes a lot of sense.
    //  can have a loop where we go through this, noticing that the x of ipx has increased. Don't want to recalculate the byte index value each time.

    // Increment over the write byte indexes?
    //  The write position xy loop strucure is OK but maybe not best.
    
    // Increment over read positions...
    //  Will output all dest pixels tha start (read heir tl) from within that ipx.




    let extends_right = false, extends_down = false;

    const dest_xy = new Int16Array([0, 0]);
    let prop_below, prop_right;

    let b_write = 0;


    // prop_below, prop_right
    //  prop_below_right = prop_below * prop_right

    // 


    // dont use / need to use VFPX for calculations...

    for (dest_xy[1] = 0; dest_xy[1] < dest_size[1]; dest_xy[1]++) {
        // set extends_down for the whole row - an optimization!
        // could move the vfp to a new row here...?
        source_fpos[1] = dest_xy[1] * source_vfpixel_size[1];
        if (source_fpos[1] >= source_ipos[1] +1) {
            // moving downwards in this case in terms of pixel coverage...
            //  do we need to know this?


        }
        

        // Distance below...?




        extends_down = Math.floor(source_fpos[1]) !== Math.floor(source_fpos[1] + source_vfpixel_size[1]);
        console.log('extends_down', extends_down);

        //console.trace();
        //throw 'stop';
        

        // different inner loop if it does extend down...?
        //  if it doesn't extend down we can make use of getting single pixels or 1x2 pixels for subpixel read&merge.
        if (extends_down) {
            // precompute vertical proportions...?
            //  p_top, p_bottom

            for (dest_xy[0] = 0; dest_xy[0] < dest_size[0]; dest_xy[0]++) {

                extends_right = Math.floor(source_fpos[0]) !== Math.floor(source_fpos[0] + source_vfpixel_size[0]);

                // no right extension, we can calculate based on the up and down proportions...

                // is the pixel totally enclosed within 1px?
                //  extends right, extends down?
                
                //vfp.pos = source_fpos;
                //read_merged_vfpx_write_24bipp(ta_source, source_colorspace, vfp, opt_ta_dest, b_write);
                //opt_ta_dest.set(read_merged_vfpx(ta_source, source_colorspace, vfp), b_write);
                b_write += 3;
                source_fpos[0] += source_vfpixel_size[0];
            }
        } else {
            for (dest_xy[0] = 0; dest_xy[0] < dest_size[0]; dest_xy[0]++) {
                extends_right = Math.floor(source_fpos[0]) !== Math.floor(source_fpos[0] + source_vfpixel_size[0]);
                console.log('extends_right', extends_right);

                if (extends_right) {

                } else {
                    // it's just a one pixel read and write...

                    // for the moment, do the copy_pixel function.
                    //  copy pixels between different colorspace...?




                }

                // is the pixel totally enclosed within 1px?
                //  extends right, extends down?
                
                //vfp.pos = source_fpos;
                //read_merged_vfpx_write_24bipp(ta_source, source_colorspace, vfp, opt_ta_dest, b_write);
                //opt_ta_dest.set(read_merged_vfpx(ta_source, source_colorspace, vfp), b_write);
                b_write += 3;
                source_fpos[0] += source_vfpixel_size[0];
                source_ipos[0] = source_fpos[0];
            }
        }
        
        source_fpos[1] += source_vfpixel_size[1];
        source_ipos[1] = source_fpos[1];
        source_fpos[0] = source_fpos[0] = 0; //(fixed bug)
    }


    // or go through the int space?
    //  work out which pixels overlap to left, above. do them this time...
    



    // then iterate through the floating point space...

    throw 'stop';


    // iterate through the floating point pixel space


    // simpler to do the loop...
    //  be able to ge the value from where it was previously set?
    //   be able to quickly read the color from source quickly?

    // iteration over the source pixels?
    //  may be better with caching / storing results but different / more complex in other ways.

    // iterate through the dest positions...
    //  no coverage area will be greater than 2x2.





}


const resize_ta_colorspace_24bipp = (ta_source, source_colorspace, dest_size, opt_ta_dest) => {
    // Could be harder to optimize in V++ because of VFPX usage.
    //  Could implement that class in C++
    //  Could make a non-oo more pure algo version.


    // Will optimize it for expanding images.
    //  Only need the smaller subpixed reads in this case.
    const source_size = source_colorspace.subarray(0, 2);

    const dest_to_source_ratio = new Float32Array([source_size[0] / dest_size[0], source_size[1] / dest_size[1]]);
    //console.log('dest_to_source_ratio', dest_to_source_ratio);
    const source_vfpixel_size = dest_to_source_ratio;

    console.log('source_vfpixel_size', source_vfpixel_size);

    if (source_vfpixel_size[0] < 1 && source_vfpixel_size[1] < 1) {
        //console.trace();
        //throw 'stop - use subpixels sepecific algo';
        return resize_ta_colorspace_24bipp_subpixels(ta_source, source_colorspace, dest_size, opt_ta_dest);
    } else {

        //const [width, height, bypp, bypr, bipp, bipr] = source_colorspace;
        //const 3 = source_colorspace[2];
        //const bipp = source_colorspace[4];

        // Different versions for different bipp? yes!

        const dest_num_pixels = dest_size[0] * dest_size[1];
        const dest_num_bytes = dest_num_pixels * 3;
        

        if (opt_ta_dest) {
            if (opt_ta_dest.length !== dest_num_bytes) {
                console.trace();
                throw 'opt_ta_dest.length error';
            }
        } else {
            opt_ta_dest = new Uint8ClampedArray(dest_num_bytes);
        }

        
        let b_write = 0;
        // looping through the dest int positions makes sense.
        //let x = 0, y = 0;


        // Pre-prediction of the possible weights sizes?
        // Pre-allocation?

        // Current slowness comes from complex way of doing subpixel reads.
        //  Possibly some small read-weight-merge operations, for set number of sizes of pixels, can be rewritten.

        // Rescaling to large images will use size 1, 2 and 4(square) any fpx cover sized areas.

        //console.log('source_vfpixel_size', source_vfpixel_size);
        //  if it's smaller than 1x1 we can run a shrink function.
        //   in this case, it can only ever cover subpixel areas.
        //    first do it in a way that isn't completely inline...

        //  calling more efficient functions that don't allocate their own variables, and directly write to the output ta.
        //   small subpixels completely enclosed won't require much at all.

        // highly optimized function with inline shrinking...
        /// incrementation of the x position...





        const dest_xy = new Int16Array([0, 0]);
        const source_fpos = new Float32Array(2);


        // Probably only need the vfp when shrinking images.
        //  Likely will separate out some code as well.


        // depending on source_vfpixel_size...
        ///   if it's subpixel...

        

        






        const vfp = new Virtual_Float_Pixel(source_fpos, source_vfpixel_size);
        // a lot faster this way, updating the virtual px.

        // just the 24bipp loop here...



        // Would be nice if the functionality in the loop were changed / rewritted so it doesnt create any new variables.

        // Pre-prepared weights array? Is that caching working well?

        // Maybe have a mode for image enlarging that uses a different algo, not using Virtual_Float_Pixel.
        //  VFP was made to enable image shrinking, but it's slow for enlargement (or big scale englargement)



        // If it's reading in subpixel space we don't need the complexity of VFPX.
        //  Worth looking at speeding up VFPX when operating in sibpixel space.
        //   Could calculate them very quickly outside of the large algorithm.
        //    Large algorithm could be made to only operate / run only on larger pixel spaces?
        //     Splitting that algo could help a lot.
        //     Getting it to run a _subpixel version.
        //      Also, bypassing weights array generation makes a lot of sense when dealing with subpixels.
        //       Direct read and write. More inlining. Fewer function calls. No new variable creation (easier to have more local vars in a larger function).









        for (dest_xy[1] = 0; dest_xy[1] < dest_size[1]; dest_xy[1]++) {
            // could move the vfp to a new row here...?
            //source_fpos[1] = dest_xy[1] * source_vfpixel_size[1];

            for (dest_xy[0] = 0; dest_xy[0] < dest_size[0]; dest_xy[0]++) {
                //console.log('');
                //console.log('dest_xy', dest_xy);
                //const source_fpos = new Float32Array([dest_xy[0] * source_vfpixel_size[0], dest_xy[1] * source_vfpixel_size[1]]);


                //source_fpos[0] = dest_xy[0] * source_vfpixel_size[0];
                
                vfp.pos = source_fpos;

                //vfp.pos = new Float32Array([dest_xy[0] * source_vfpixel_size[0], dest_xy[1] * source_vfpixel_size[1]]);
                //console.log('source_fpos', source_fpos);
                //console.log('source_vfpixel_size', source_vfpixel_size);
                //const vfp = new Virtual_Float_Pixel(source_fpos, source_vfpixel_size);

                

                //console.log('vfp.bounds', vfp.bounds);
                //const merged_rbg = read_merged_vfpx(ta_source, source_colorspace, vfp);
                //console.log('merged_rbg', merged_rbg);
                //opt_ta_dest[b_write++] = merged_rbg[0];
                //opt_ta_dest[b_write++] = merged_rbg[1];
                //opt_ta_dest[b_write++] = merged_rbg[2];

                //opt_ta_dest.set(read_merged_vfpx(ta_source, source_colorspace, vfp), b_write += 3);

                // read_merged_vfpx_write that does a direct write...
                //  


                // read_merged_vfpx_write_24bipp in this case...

                //  May be just a little faster this way.

                // Speed up the algo here for smaller (subpixel) reads...

                read_merged_vfpx_write_24bipp(ta_source, source_colorspace, vfp, opt_ta_dest, b_write);
                //opt_ta_dest.set(read_merged_vfpx(ta_source, source_colorspace, vfp), b_write);
                b_write += 3;
                source_fpos[0] += source_vfpixel_size[0];
                // new vfpx each time for the moment. then will work on optimized adjustments / better integrating it with other functionality.
                //  Virtual_Float_Rect?
                //   For rectangularly expressed regions, and then VFPX can iterate inside it.
                //   A tool for helping with iteration of VFPX, and treating a float window into an int coord space as an object that is readable by its transformed values.

                // Integrating resize transformation with window_to?
                //  With the pb itself handling copy / update iterations involving resizing as well as other processes / transformations.
            }
            source_fpos[1] += source_vfpixel_size[1];
            source_fpos[0] = 0; //(fixed bug)
        }
        return opt_ta_dest;



    }











    
}


const resize_ta_colorspace = (ta_source, source_colorspace, dest_size, opt_ta_dest) => {

    //const [width, height, bypp, bypr, bipp, bipr] = source_colorspace;
    //const bypp = source_colorspace[2];
    const bipp = source_colorspace[4];

    if (bipp === 1) {
        console.trace(); throw 'NYI';
    } else if (bipp === 8) {
        console.trace(); throw 'NYI';
    } else if (bipp === 24) {
        return resize_ta_colorspace_24bipp(ta_source, source_colorspace, dest_size, opt_ta_dest);
        //return read_merged_vfpx_24bipp(ta_source, colorspace, vfpx)
    } else if (bipp === 32) {
        console.trace(); throw 'NYI';
    } else {
        console.trace();
        throw 'unsupported bipp: ' + bipp;
    }
}


module.exports = {
    resize_ta_colorspace: resize_ta_colorspace,
    resize_ta_colorspace_24bipp: resize_ta_colorspace_24bipp,
    read_merged_vfpx_write_24bipp: read_merged_vfpx_write_24bipp
}


