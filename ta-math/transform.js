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




// Could see about making an optimized subpixels helper loop.
//  But don't want to pass around too much data.


// Iterating through the source pixels, working out which target pixels are made out of pixels starting with the source one.
//  Some calculations of pixel space ranges within the loop here.




/*
    Constant
        f px size


    Multiple things to iterate / calculate / increment at once
    Source
        f px pos
            its bounds?
                bounds could be particularly useful.
            i px covered in the source (any coverage?)
            distance f px extended to the right of i px pos
                distance f px extended to the right of i px pos / f px width
            distance f px extended below i px pos
                distance f px extended below i px pos / f px height
    Dest
        i px pos
        write pos of single pixel


*/







// May need to retry the below algorithm :)

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


    // Direct copy would likely be faster?
    //  Maintain byte indexes instead.


    //const tai_2x2_byte_indexes = new Int32Array(4);
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

    let prev_source_ix = 0, prev_source_iy = -1;

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
        //source_fx_right = dest_to_source_y_ratio;

        //console.log('dest_iy', dest_iy);
        //console.log('byi_write', byi_write);

        // Any need to see if the y position has advanced / changed?
        //  Any read position to update?

        // worth calculating crossover proportions - as if it extends below by 0.000001 px then it's a rounding error.


        // May falsely detect it crossing down because of accuracy loss.

        source_iy = Math.floor(source_fy);
        source_iy_bottom = Math.floor(source_fy_bottom);

        source_fy_above_crossover = (source_iy + 1) - source_fy;
        source_fy_below_crossover = source_fy_bottom - (source_iy + 1);

        if (source_iy > prev_source_iy) {
            byi_read_tl += bytes_per_pixel;
            byi_read_tr += bytes_per_pixel;
            byi_read_bl += bytes_per_pixel;
            byi_read_br += bytes_per_pixel;
        } else {
            byi_read_tl -= source_bypr;
            byi_read_tr -= source_bypr;
            byi_read_bl -= source_bypr;
            byi_read_br -= source_bypr;
        }

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

            for (dest_ix = 0, source_fx = 0, source_fx_right = dest_to_source_x_ratio; dest_ix < dest_iwidth; dest_ix++, source_fx += dest_to_source_x_ratio, source_fx_right += dest_to_source_x_ratio) {
                source_ix = Math.floor(source_fx)
                source_ix_right = Math.floor(source_fx_right);
                source_fx_left_of_crossover = (source_ix + 1) - source_fx;
                source_fx_right_of_crossover = source_fx_right - (source_ix + 1);
                extends_right = source_fx_left_of_crossover >= 0.000001;

                //extends_right = source_ix !== source_ix_right;

                // Calc the amount it extends right, then account for rounding errors.


                //extends_right = source_iy !== source_iy_bottom;


                // and check if it's enclosed in the same subpixel as b4?
                //console.log('');
    
                //console.log('source_ix', source_ix);
                //console.log('prev_source_ix', prev_source_ix);
                //throw 'stop';
                if (source_ix > prev_source_ix) {
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


            for (dest_ix = 0, source_fx = 0, source_fx_right = dest_to_source_x_ratio; dest_ix < dest_iwidth; dest_ix++, source_fx += dest_to_source_x_ratio, source_fx_right += dest_to_source_x_ratio) {
                source_ix = Math.floor(source_fx)
                source_ix_right = Math.floor(source_fx_right);
                source_fx_left_of_crossover = (source_ix + 1) - source_fx;
                source_fx_right_of_crossover = source_fx_right - (source_ix + 1);
                extends_right = source_fx_right_of_crossover >= 0.000001;
                

                //console.log('');
    
                //console.log('source_ix', source_ix);
                //console.log('prev_source_ix', prev_source_ix);
                //throw 'stop';
                // and check if it's enclosed in the same subpixel as b4?
    
                //console.log('source_ix', source_ix);
                //console.log('prev_source_ix', prev_source_ix);


                if (source_ix > prev_source_ix) {

                    byi_read_tl += bytes_per_pixel;
                    byi_read_tr += bytes_per_pixel;
                    byi_read_bl += bytes_per_pixel;
                    byi_read_br += bytes_per_pixel;


                    /*

                    if (source_iy !== prev_source_iy) {
                        // it's already been reset?
                    } else {
                        
                    }
                    */



                    //  includes going to a new row.
                    //   ???
                    //  need to change it / reset it when going back to the same source row on a new dest row.
                    
                }

                if (extends_right) {
                    // 2x1
                    byi_write += 3;
                } else {
                    //console.log('byi_read_tl', byi_read_tl);
                    // 1x1 direct px copy
                    ta_dest[byi_write++] = ta_source[byi_read_tl];
                    ta_dest[byi_write++] = ta_source[byi_read_tl + 1];
                    ta_dest[byi_write++] = ta_source[byi_read_tl + 2];
                }
                //throw 'stop';
    
                //console.log('[byi_read_tl, byi_read_tr, byi_read_bl, byi_read_br]', [byi_read_tl, byi_read_tr, byi_read_bl, byi_read_br]);
    
                
    
                prev_source_ix = source_ix;
            }

            // Send byi_read_tl etc back to the beginning of a new row, if y doesn't change.
            //  So far, the read pos if not properly staying in sync.

            



        }

        
        

        //prev_source_fx_bottom = source_fx_bottom;
        prev_source_iy = source_iy;
    }
}

//const resize_ta_colorspace_24bipp_subpixels = resize_ta_colorspace_24bipp_subpixels$dest_ipos_iterate;


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


// Main algo below could maybe be optimized for extracting smaller subpixels?
//  Moving the vfp pos and doing the read_merged_vfpx_write_24bipp take the time.
//   Could look into optimizing both for better subpixel handling.
//    Fast subpixel handling is important for upscaling an image.

// Optimizing VFP could be very useful in general...
//  Other fn call uses vfp anyway.
//   vfp.pos = source_fpos is very time-consuming.
//    it updates quite a lot within itself.
//    worth optimizing that where possible.
//     it automatically updates / sets quite a lot of its values.



// Optimized subpixels version is def worth doing.

// Could division remainders help for fast calcs?


// A more efficient iteration function, that gives info on proportions / weights when dealing with subpixels.
//  Calculating distance left, up, right, down from the crossover point.

//  Crossover point? Crossover x value? Crossover y value?

// Determining pixel crossover amounts, and using them, makes a lot of sense.

// OK, so callback functions don't make it drastically slow.
//  Better not to focus as much on inlining? Reuse loop code with specialised loop functions?
//   Makes sense for clarity. Maybe difficulties porting?



// Time for another attempt at it...
//  Will use int x and y values for the reading / writing operations?
//   Keep the yte index for the destination pixel.
//   Use int x y for lookup from the source - quick to calculate the byte index from x and y anyway.


// Seems most reliable to start with to go through the destination integer x y space.


//  and would provide the byte index position in the callback too. (xy, byi)
// each_pixel_in_colorspace(colorspace)



// Let's make an fpx iteration within other colorspace system.
//  Have this calculate the weighting values.
//   And return the edge and corner distances / areas.






// Use above function to go through the transform dest colorspace.




const __each_subpixel_within_colorspace = (subpixel_size, colorspace, callback) => {
    const [width, height, bypp, bypr, bipp, bipr] = colorspace;
    // This is indeed iterating through the source, based on the subpixel_size
    //  Will not need to pay attention to a destination at present.

    // and work by using subpixel bounds.
    //  (ltrb ta for the moment)
    const taf_subpixel_bounds = new Float32Array([0, 0, subpixel_size[0], subpixel_size[1]]);
    // Then these bounds, but rounded / floored to integers?
    const tai_subpixel_bounds = new Int16Array(4);

    // Proportion within top, proportion within left...
    // Distance each side of the crossover point.
    //  Crossover point as null or undefined?

    // i_size
    //  when mapped to the original space.

    const i_size = new Int16Array(2);
    // Advance i_row var?
    // Asvance i_column var?

    let bytes_advance = 0;
    // prev i pos...
    const prev_ixy = new Int16Array(2);

    // // Consider ends of rows...

    

    for (taf_subpixel_bounds[1] = 0; taf_subpixel_bounds[1] < height; taf_subpixel_bounds[1] += subpixel_size[1], taf_subpixel_bounds[3] += subpixel_size[1]) {
        taf_subpixel_bounds[2] = subpixel_size[0];
        tai_subpixel_bounds[1] = taf_subpixel_bounds[1];
        tai_subpixel_bounds[3] = Math.ceil(taf_subpixel_bounds[3]);
        i_size[1] = tai_subpixel_bounds[3] - tai_subpixel_bounds[1];

        for (taf_subpixel_bounds[0] = 0; taf_subpixel_bounds[0] < width; taf_subpixel_bounds[0] += subpixel_size[0], taf_subpixel_bounds[2] += subpixel_size[0]) {
            tai_subpixel_bounds[0] = taf_subpixel_bounds[0];
            tai_subpixel_bounds[2] = Math.ceil(taf_subpixel_bounds[2]);
            i_size[0] = tai_subpixel_bounds[2] - tai_subpixel_bounds[0];
            
            /*
            if (tai_subpixel_bounds[0] !== prev_ixy[0] || tai_subpixel_bounds[1] !== prev_ixy[1]) {
                bytes_advance = 3;
            } else {
                bytes_advance = 0;
            }
            */

            // It may well need to 'advance' back to the beginning of the row, is negative changes in the read position.
            //  that could be where I went wrong before.


            bytes_advance = (tai_subpixel_bounds[0] - prev_ixy[0]) * bypp + (tai_subpixel_bounds[1] - prev_ixy[1]) * bypr;
            callback(taf_subpixel_bounds, tai_subpixel_bounds, i_size, bytes_advance);
            prev_ixy[0] = tai_subpixel_bounds[0];
        }
        //throw 'stop';
        prev_ixy[1] = tai_subpixel_bounds[1];
    }

    



    // function to get the crossover information...?
    //  


    // then a y and x for loops...




}

// Worth putting back that old algorithm I wrote that only handles upscaling, in _old_subpixels.js???



// Could relying on byte indexes be an attempted optimization too far?
//  Would be more reliable to call functions involving x, y, and have them recalculated.

// Byte index logic at this level isn't working right now.
//  Maybe we can calculate it very quickly anyway.

const copy_px_to_ta_dest_byi = (ta_source, source_colorspace, source_xy, ta_dest, byi_dest) => {
    const [width, height, bypp, bypr, bipp, bipr] = source_colorspace;

    if (bipp === 24) {
        let byi_read = source_xy[0] * bypp + source_xy[1] * bypr;
        ta_dest[byi_dest] = ta_source[byi_read++];
        ta_dest[byi_dest + 1] = ta_source[byi_read++];
        ta_dest[byi_dest + 2] = ta_source[byi_read++];

    } else {
        console.trace();
        throw 'NYI';
    }
}





const each_pixel_in_colorspace = (colorspace, callback) => {
    const [width, height, bypp, bypr, bipp, bipr] = colorspace;
    let byi = 0;
    const xy = new Int16Array(2);
    for (xy[1] = 0; xy[1] < height; xy[1]++) {
        for (xy[0] = 0; xy[0] < width; xy[0]++) {
            callback(xy, byi);

            byi += bypp;
        }
    }
}

// an iteration function would be more efficient than VFPX I think.

// each_dest_source_pixel

// each_dest_pixel_mapped_source_pixels_in_resized_colorspace



// Could make one or more versions of this that add further info?

// Get this function to actually calculate weights (up to 8 of them) here?


// Could also make a simpler remapped colorspace function.





// Longer version here with some weightings calculations.
//  This function does extra... lets simplify it to

// each_source_dest_pixels_resized

const each_source_dest_pixels_resized = (source_colorspace, dest_size, callback) => {
    // Includes both partial and any (total and partial) pixel coverage areas in the source.

    const [width, height, bypp, bypr, bipp, bipr] = source_colorspace;
    const dest_colorspace = new Int32Array([dest_size[0], dest_size[1], bypp, bypp * dest_size[0], bipp, bipp * dest_size[0]]);
    const dest_to_source_ratio = new Float32Array([source_colorspace[0] / dest_size[0], source_colorspace[1] / dest_size[1]]);
    const source_fbounds = new Float32Array(4);
    const source_ibounds = new Int16Array(4);
    const source_i_any_coverage_size = new Int16Array(2);
    const source_total_coverage_ibounds = new Int16Array(4);
    let byi_read;

    // no calculation of edge distance and corner areas / weights in this one.

    each_pixel_in_colorspace(dest_colorspace, (dest_xy, dest_byi) => {

        source_fbounds[0] = dest_xy[0] * dest_to_source_ratio[0];
        source_fbounds[1] = dest_xy[1] * dest_to_source_ratio[1];
        source_fbounds[2] = source_fbounds[0] + dest_to_source_ratio[0];
        source_fbounds[3] = source_fbounds[1] + dest_to_source_ratio[1];

        // And the total coverage bounds.
        //  will be useful for some things...
        // Total coverage size as well

        //source_farea = (source_fbounds[2] - )


        // Scale down the pixel location...
        source_ibounds[0] = source_fbounds[0];
        source_ibounds[1] = source_fbounds[1];
        source_ibounds[2] = Math.ceil(source_fbounds[2]);
        source_ibounds[3] = Math.ceil(source_fbounds[3]);

        // then the any coverage area...

        // does it cover other pixels / proportions in those other pixels?

        // Still reasonably fast - yet slowing down from before....
        source_i_any_coverage_size[0] = source_ibounds[2] - source_ibounds[0];
        source_i_any_coverage_size[1] = source_ibounds[3] - source_ibounds[1];

        byi_read = source_ibounds[0] * bypp + source_ibounds[1] * bypr;

        source_total_coverage_ibounds[0] = Math.ceil(source_fbounds[0]);
        source_total_coverage_ibounds[1] = Math.ceil(source_fbounds[1]);
        source_total_coverage_ibounds[2] = source_fbounds[2];
        source_total_coverage_ibounds[3] = source_fbounds[3];

        callback(dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, source_total_coverage_ibounds, byi_read);
    });
}

const each_source_dest_pixels_resized_further_info = (source_colorspace, dest_size, callback) => {
    const [width, height, bypp, bypr, bipp, bipr] = source_colorspace;
    const dest_colorspace = new Int32Array([dest_size[0], dest_size[1], bypp, bypp * dest_size[0], bipp, bipp * dest_size[0]]);
    const dest_to_source_ratio = new Float32Array([source_colorspace[0] / dest_size[0], source_colorspace[1] / dest_size[1]]);

    const source_edge_distances = new Float32Array(4);
    const source_corner_areas = new Float32Array(4);

    // almost the weights... call them proportions_of_total

    const edge_distances_proportions_of_total = new Float32Array(4);
    const corner_areas_proportions_of_total = new Float32Array(4);

    // source_fsize is the size of the pixel.

    const fpx_area = dest_to_source_ratio[0] * dest_to_source_ratio[1];



    each_source_dest_pixels_resized(source_colorspace, dest_size, (dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, source_total_coverage_ibounds, byi_read) => {
        source_edge_distances[0] = source_total_coverage_ibounds[0] - source_fbounds[0];
        source_edge_distances[1] = source_total_coverage_ibounds[1] - source_fbounds[1];
        source_edge_distances[2] = source_fbounds[2] - source_total_coverage_ibounds[2];
        source_edge_distances[3] = source_fbounds[3] - source_total_coverage_ibounds[3];

        edge_distances_proportions_of_total[0] = source_edge_distances[0] / dest_to_source_ratio[0];
        edge_distances_proportions_of_total[1] = source_edge_distances[1] / dest_to_source_ratio[1];
        edge_distances_proportions_of_total[2] = source_edge_distances[2] / dest_to_source_ratio[0];
        edge_distances_proportions_of_total[3] = source_edge_distances[3] / dest_to_source_ratio[1];

        // Distances divided by the width or height.

        // then calculate the corner areas?
        //  makes sense for 2x2 or greater...

        source_corner_areas[0] = source_edge_distances[0] * source_edge_distances[1];
        source_corner_areas[1] = source_edge_distances[2] * source_edge_distances[1];
        source_corner_areas[2] = source_edge_distances[0] * source_edge_distances[3];
        source_corner_areas[3] = source_edge_distances[2] * source_edge_distances[3];

        corner_areas_proportions_of_total[0] = source_corner_areas[0] / fpx_area;
        corner_areas_proportions_of_total[1] = source_corner_areas[1] / fpx_area;
        corner_areas_proportions_of_total[2] = source_corner_areas[2] / fpx_area;
        corner_areas_proportions_of_total[3] = source_corner_areas[3] / fpx_area;

        //console.log('corner_areas_proportions_of_total', corner_areas_proportions_of_total);

        // corner areas divided by the pixel area...

        //console.log('1) byi_read', byi_read);

        callback(dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, source_total_coverage_ibounds, source_edge_distances, source_corner_areas, edge_distances_proportions_of_total, corner_areas_proportions_of_total, byi_read);

    });
}

// and with weightings calculations...



// then a version that provides further / advanded info
//  edge distances?
//  calculated weights? 
const each_dest_pixel_mapped_source_pixels_in_resized_colorspace = each_source_dest_pixels_resized_further_info;


const ___each_dest_pixel_mapped_source_pixels_in_resized_colorspace = (source_colorspace, dest_size, callback) => {
    const [width, height, bypp, bypr, bipp, bipr] = source_colorspace;
    const dest_colorspace = new Int32Array([dest_size[0], dest_size[1], bypp, bypp * dest_size[0], bipp, bipp * dest_size[0]]);
    const dest_to_source_ratio = new Float32Array([source_colorspace[0] / dest_size[0], source_colorspace[1] / dest_size[1]]);
    const source_edge_distances = new Float32Array(4);
    const source_corner_areas = new Float32Array(4);



    each_source_dest_pixels_resized(source_colorspace, dest_size, (dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, source_total_coverage_ibounds, edge_distances_proportions_of_total, corner_areas_proportions_of_total, byi_read) => {
        if (source_i_any_coverage_size[0] === 1 && source_i_any_coverage_size === 1) {
            callback(dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, undefined, undefined, undefined, byi_read);
        } else {

            if (source_i_any_coverage_size[0] === 2 && source_i_any_coverage_size[1] === 1) {
                //source_total_coverage_ibounds[0] = Math.ceil(source_fbounds[0]);
                //source_total_coverage_ibounds[2] = source_fbounds[2];
                source_edge_distances[0] = source_total_coverage_ibounds[0] - source_fbounds[0];
                source_edge_distances[1] = 0;
                source_edge_distances[2] = source_fbounds[2] - source_total_coverage_ibounds[2];
                source_edge_distances[3] = 0;

                callback(dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, source_total_coverage_ibounds, source_edge_distances, undefined, byi_read);


            } else if (source_i_any_coverage_size[0] === 1 && source_i_any_coverage_size[1] === 2) {
                //throw 'stop';

                //source_total_coverage_ibounds[1] = Math.ceil(source_fbounds[1]);
                //source_total_coverage_ibounds[3] = source_fbounds[3];
                source_edge_distances[0] = 0;
                source_edge_distances[1] = source_total_coverage_ibounds[1] - source_fbounds[1];
                source_edge_distances[2] = 0;
                source_edge_distances[3] = source_fbounds[3] - source_total_coverage_ibounds[3];
                

                callback(dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, source_total_coverage_ibounds, source_edge_distances, undefined, byi_read);


            } else {

                // 2x2, maybe more... can calculate the corner weights / proportions of the full fpx.

                // Can work out the edge weights and the corner weights.



                //source_total_coverage_ibounds[0] = Math.ceil(source_fbounds[0]);
                //source_total_coverage_ibounds[1] = Math.ceil(source_fbounds[1]);
                //source_total_coverage_ibounds[2] = source_fbounds[2];
                //source_total_coverage_ibounds[3] = source_fbounds[3];


                source_edge_distances[0] = source_total_coverage_ibounds[0] - source_fbounds[0];
                source_edge_distances[1] = source_total_coverage_ibounds[1] - source_fbounds[1];
                source_edge_distances[2] = source_fbounds[2] - source_total_coverage_ibounds[2];
                source_edge_distances[3] = source_fbounds[3] - source_total_coverage_ibounds[3];

                // then calculate the corner areas?
                //  makes sense for 2x2 or greater...

                source_corner_areas[0] = source_edge_distances[0] * source_edge_distances[1];
                source_corner_areas[1] = source_edge_distances[2] * source_edge_distances[1];
                source_corner_areas[2] = source_edge_distances[0] * source_edge_distances[3];
                source_corner_areas[3] = source_edge_distances[2] * source_edge_distances[3];

                // working out the distances of source_fbounds from total coverage bounds.

                // four distances outside total coverage bounds.
                //  edge_distances_from_total_coverage_bounds



                //opt_ta_dest[dest_byi] = 255;
                // then depending on the size....
                //console.log('source_i_any_coverage_size', source_i_any_coverage_size);
                // consts elsewhere even speeding things up?

                

                callback(dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, source_total_coverage_ibounds, source_edge_distances, source_corner_areas, byi_read);

            }

            // 1x2 and 2x1 and 2x2...
            //  where we need the edge distances.



            
        }
    });

}

const _old_each_dest_pixel_mapped_source_pixels_in_resized_colorspace = (source_colorspace, dest_size, callback) => {

    const [width, height, bypp, bypr, bipp, bipr] = source_colorspace;
    const dest_colorspace = new Int32Array([dest_size[0], dest_size[1], bypp, bypp * dest_size[0], bipp, bipp * dest_size[0]]);
    const dest_to_source_ratio = new Float32Array([source_colorspace[0] / dest_size[0], source_colorspace[1] / dest_size[1]]);

    // floating point location in source


    // Bounds calc could be more appropriate?
    //  or keep using + dest_to_source_ratio

    // the bounds are most important for the various calculations...

    //const source_fxy = new Float32Array(2);
    // Maybe source bounds will be more useful?
    //const source_ixy = new Int16Array(2);

    const source_fbounds = new Float32Array(4);
    const source_ibounds = new Int16Array(4);
    const source_i_any_coverage_size = new Int16Array(2);

    const source_total_coverage_ibounds = new Int16Array(4);
    const source_total_coverage_size = new Int16Array(2);


    let byi_read;

    //const source_xy_crossover = new Int16Array(2);
    // not sure that the crossover point is needed?

    // Will instead calculate the corner and edge proportions. here...
    //  ???
    const source_edge_distances = new Float32Array(4);
    const source_corner_areas = new Float32Array(4);

    //let source_farea;


    each_pixel_in_colorspace(dest_colorspace, (dest_xy, dest_byi) => {

        source_fbounds[0] = dest_xy[0] * dest_to_source_ratio[0];
        source_fbounds[1] = dest_xy[1] * dest_to_source_ratio[1];
        source_fbounds[2] = source_fbounds[0] + dest_to_source_ratio[0];
        source_fbounds[3] = source_fbounds[1] + dest_to_source_ratio[1];

        // And the total coverage bounds.
        //  will be useful for some things...
        // Total coverage size as well

        //source_farea = (source_fbounds[2] - )


        // Scale down the pixel location...
        source_ibounds[0] = source_fbounds[0];
        source_ibounds[1] = source_fbounds[1];
        source_ibounds[2] = Math.ceil(source_fbounds[2]);
        source_ibounds[3] = Math.ceil(source_fbounds[3]);

        // then the any coverage area...

        // does it cover other pixels / proportions in those other pixels?

        // Still reasonably fast - yet slowing down from before....
        source_i_any_coverage_size[0] = source_ibounds[2] - source_ibounds[0];
        source_i_any_coverage_size[1] = source_ibounds[3] - source_ibounds[1];

        byi_read = source_ibounds[0] * bypp + source_ibounds[1] * bypr;

        if (source_i_any_coverage_size[0] === 1 && source_i_any_coverage_size === 1) {
            callback(dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, undefined, undefined, undefined, byi_read);
        } else {

            if (source_i_any_coverage_size[0] === 2 && source_i_any_coverage_size[1] === 1) {
                source_total_coverage_ibounds[0] = Math.ceil(source_fbounds[0]);
                source_total_coverage_ibounds[2] = source_fbounds[2];
                source_edge_distances[0] = source_total_coverage_ibounds[0] - source_fbounds[0];
                source_edge_distances[1] = 0;
                source_edge_distances[2] = source_fbounds[2] - source_total_coverage_ibounds[2];
                source_edge_distances[3] = 0;

                callback(dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, source_total_coverage_ibounds, source_edge_distances, undefined, byi_read);


            } else if (source_i_any_coverage_size[0] === 1 && source_i_any_coverage_size[1] === 2) {
                //throw 'stop';

                source_total_coverage_ibounds[1] = Math.ceil(source_fbounds[1]);
                source_total_coverage_ibounds[3] = source_fbounds[3];
                source_edge_distances[0] = 0;
                source_edge_distances[1] = source_total_coverage_ibounds[1] - source_fbounds[1];
                source_edge_distances[2] = 0;
                source_edge_distances[3] = source_fbounds[3] - source_total_coverage_ibounds[3];
                

                callback(dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, source_total_coverage_ibounds, source_edge_distances, undefined, byi_read);


            } else {

                // 2x2, maybe more... can calculate the corner weights / proportions of the full fpx.

                // Can work out the edge weights and the corner weights.



                source_total_coverage_ibounds[0] = Math.ceil(source_fbounds[0]);
                source_total_coverage_ibounds[1] = Math.ceil(source_fbounds[1]);
                source_total_coverage_ibounds[2] = source_fbounds[2];
                source_total_coverage_ibounds[3] = source_fbounds[3];


                source_edge_distances[0] = source_total_coverage_ibounds[0] - source_fbounds[0];
                source_edge_distances[1] = source_total_coverage_ibounds[1] - source_fbounds[1];
                source_edge_distances[2] = source_fbounds[2] - source_total_coverage_ibounds[2];
                source_edge_distances[3] = source_fbounds[3] - source_total_coverage_ibounds[3];

                // then calculate the corner areas?
                //  makes sense for 2x2 or greater...

                source_corner_areas[0] = source_edge_distances[0] * source_edge_distances[1];
                source_corner_areas[1] = source_edge_distances[2] * source_edge_distances[1];
                source_corner_areas[2] = source_edge_distances[0] * source_edge_distances[3];
                source_corner_areas[3] = source_edge_distances[2] * source_edge_distances[3];

                // working out the distances of source_fbounds from total coverage bounds.

                // four distances outside total coverage bounds.
                //  edge_distances_from_total_coverage_bounds



                //opt_ta_dest[dest_byi] = 255;
                // then depending on the size....
                //console.log('source_i_any_coverage_size', source_i_any_coverage_size);
                // consts elsewhere even speeding things up?

                

                callback(dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, source_total_coverage_ibounds, source_edge_distances, source_corner_areas, byi_read);

            }

            // 1x2 and 2x1 and 2x2...
            //  where we need the edge distances.



            
        }
    });
}

// A version that sends back the weights...
//  1D weights that are for left/right or above/below



const each_dest_pixel_mapped_source_pixels_weights_in_resized_colorspace = (source_colorspace, dest_size, callback) => {

    // run the above function and also calculate the weights
    //  however, won't calculate all of the weights for each pixel.

    // proportions left etc...

    // but if there is only one pixel?
    //  or two...?

    // only gets the weightings / edges proportions in some cases?

    // 
    const [width, height, bypp, bypr, bipp, bipr] = source_colorspace;
    //const dest_colorspace = new Int32Array([dest_size[0], dest_size[1], bypp, bypp * dest_size[0], bipp, bipp * dest_size[0]]);
    const dest_to_source_ratio = new Float32Array([source_colorspace[0] / dest_size[0], source_colorspace[1] / dest_size[1]]);
    // Is the pixel size too in the source.


    each_dest_pixel_mapped_source_pixels_in_resized_colorspace(source_colorspace, dest_size, (dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, source_total_coverage_ibounds, source_edge_distances, source_corner_areas, edge_distances_proportions_of_total, corner_areas_proportions_of_total, byi_read) => {

        // Then different info needs to be calculated and sent in the callback depending on source_i_any_coverage_size
        console.log('source_i_any_coverage_size', source_i_any_coverage_size);

        if (source_i_any_coverage_size[0] === 1) {
            if (source_i_any_coverage_size[1] === 1) {

                // Indeed is faster with this inlined.

                // read xy pixel value from ta & colorspace, write it to dest at dest_byi(++);
                //copy_px_to_ta_dest_byi(ta_source, source_colorspace, source_ibounds, opt_ta_dest, dest_byi);
                //byi_read = source_ibounds[0] * bypp + source_ibounds[1] * bypr;
                opt_ta_dest[dest_byi] = ta_source[byi_read++];
                opt_ta_dest[dest_byi + 1] = ta_source[byi_read++];
                opt_ta_dest[dest_byi + 2] = ta_source[byi_read++];

            } else {
                source_xy_crossover[1] = source_ibounds[1] + 1;
                // 1x2
                // work out proportions of each...
                // proportion above, proportion below.

                // Direct calculation would be cool...

                //const extension_above = source_xy_crossover[1] - source_fbounds[1];
                //const extension_below = source_fbounds[3] - source_xy_crossover[1];
                const weight_above = source_edge_distances[1] / dest_to_source_ratio[1];
                const weight_below = source_edge_distances[3] / dest_to_source_ratio[1];


                
                //console.log('');

                //console.log('extension_above', extension_above);
                //console.log('extension_below', extension_below);
                //console.log('weight_above', weight_above);
                //console.log('weight_below', weight_below);

                //console.log('source_edge_distances', source_edge_distances);

                // could now try function that does the reading of both and writing to dest_byi

                // then inline later?

                // byi_read_top
                //  that's byi_read

                //byi_read = source_ibounds[0] * bypp + source_ibounds[1] * bypr;
                byi_read_below = byi_read + bypr;

                opt_ta_dest[dest_byi] = weight_above * ta_source[byi_read++] + weight_below * ta_source[byi_read_below++];
                opt_ta_dest[dest_byi + 1] = weight_above * ta_source[byi_read++] + weight_below * ta_source[byi_read_below++];
                opt_ta_dest[dest_byi + 2] = weight_above * ta_source[byi_read++] + weight_below * ta_source[byi_read_below++];

            }
        } else {
            if (source_i_any_coverage_size[1] === 1) {
                // 2x1
                //source_xy_crossover[0] = source_ibounds[0] + 1;

                /*
                const extension_left = source_xy_crossover[0] - source_fbounds[0];
                const extension_right = source_fbounds[2] - source_xy_crossover[0];
                const weight_left = extension_left / dest_to_source_ratio[0];
                const weight_right = extension_right / dest_to_source_ratio[0];
                */
                const weight_left = (source_edge_distances[0]) / dest_to_source_ratio[0];
                const weight_right = (source_edge_distances[2]) / dest_to_source_ratio[0];

                //byi_read = source_ibounds[0] * bypp + source_ibounds[1] * bypr;
                byi_read_right = byi_read + bypp;

                opt_ta_dest[dest_byi] = weight_left * ta_source[byi_read++] + weight_right * ta_source[byi_read_right++];
                opt_ta_dest[dest_byi + 1] = weight_left * ta_source[byi_read++] + weight_right * ta_source[byi_read_right++];
                opt_ta_dest[dest_byi + 2] = weight_left * ta_source[byi_read++] + weight_right * ta_source[byi_read_right++];

            } else {


                // can check for 2x2 here,
                //  and some others such as 2x3, 3x2, 3x3


                //source_xy_crossover[0] = source_ibounds[0] + 1;
                //source_xy_crossover[1] = source_ibounds[1] + 1;
                // 2x2
                //console.trace();
                //throw 'stop';
                //const extension_left = source_xy_crossover[0] - source_fbounds[0];
                //const extension_right = source_fbounds[2] - source_xy_crossover[0];
                //const extension_above = source_xy_crossover[1] - source_fbounds[1];
                //const extension_below = source_fbounds[3] - source_xy_crossover[1];

                // source_corner_areas

                /*
                
                const weight_left = source_edge_distances[0] / dest_to_source_ratio[0];
                const weight_right = source_edge_distances[2] / dest_to_source_ratio[0];
                const weight_above = source_edge_distances[1] / dest_to_source_ratio[1];
                const weight_below = source_edge_distances[3] / dest_to_source_ratio[1];

                const weight_tl = weight_left * weight_above;
                const weight_tr = weight_right * weight_above;
                const weight_bl = weight_left * weight_below;
                const weight_br = weight_right * weight_below;
                */

                const weight_tl = source_corner_areas[0] / source_px_area;
                const weight_tr = source_corner_areas[1] / source_px_area;
                const weight_bl = source_corner_areas[2] / source_px_area;
                const weight_br = source_corner_areas[3] / source_px_area;

                //console.log('[weight_tl, weight_tr, weight_bl, weight_br]', [weight_tl, weight_tr, weight_bl, weight_br]);
                //byi_read = source_ibounds[0] * bypp + source_ibounds[1] * bypr;
                byi_read_right = byi_read + bypp;
                byi_read_below = byi_read + bypr;
                byi_read_below_right = byi_read_below + bypp;

                opt_ta_dest[dest_byi] = weight_tl * ta_source[byi_read++] + weight_tr * ta_source[byi_read_right++] + weight_bl * ta_source[byi_read_below++] + weight_br * ta_source[byi_read_below_right++];
                opt_ta_dest[dest_byi + 1] = weight_tl * ta_source[byi_read++] + weight_tr * ta_source[byi_read_right++] + weight_bl * ta_source[byi_read_below++] + weight_br * ta_source[byi_read_below_right++];
                opt_ta_dest[dest_byi + 2] = weight_tl * ta_source[byi_read++] + weight_tr * ta_source[byi_read_right++] + weight_bl * ta_source[byi_read_below++] + weight_br * ta_source[byi_read_below_right++];
            }
        }
    });
}

// A version not just for subpixels...

const resize_ta_colorspace_24bipp_subpixels = (ta_source, source_colorspace, dest_size, opt_ta_dest) => {

    // Simplified this function.
    //  Seems like a small perf cost with the extra function calls used.
    //   Could optimize - not setting any weights when its 1x1, not doing the measurements.


    const [width, height, bypp, bypr, bipp, bipr] = source_colorspace;


    //const dest_colorspace = new Int32Array([dest_size[0], dest_size[1], bypp, bypp * dest_size[0], bipp, bipp * dest_size[0]]);
    const dest_to_source_ratio = new Float32Array([source_colorspace[0] / dest_size[0], source_colorspace[1] / dest_size[1]]);

    // floating point location in source



    // Bounds calc could be more appropriate?
    //  or keep using + dest_to_source_ratio

    // the bounds are most important for the various calculations...

    //const source_fxy = new Float32Array(2);
    // Maybe source bounds will be more useful?
    //const source_ixy = new Int16Array(2);

    

    //let byi_read;
    let byi_read_below, byi_read_right, byi_read_below_right;


    //let extension_above, extension_below, extension_left, extension_right;


    // reply consts with lets in this scope?
    //  or use typed arrays to hold the info?

    // also a crossover_x?

    const source_px_area = dest_to_source_ratio[0] * dest_to_source_ratio[1];
    // potential crossover point - keep it updated?
    const source_xy_crossover = new Int16Array(2);

    // dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, source_total_coverage_ibounds, source_edge_distances, source_corner_areas, edge_distances_proportions_of_total, corner_areas_proportions_of_total, byi_read

    each_source_dest_pixels_resized_further_info(source_colorspace, dest_size, (dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, source_total_coverage_ibounds, source_edge_distances, source_corner_areas, edge_distances_proportions_of_total, corner_areas_proportions_of_total, byi_read) => {
        //console.log('byi_read', byi_read);
        if (source_i_any_coverage_size[0] === 1) {
            if (source_i_any_coverage_size[1] === 1) {

                // Indeed is faster with this inlined.

                // read xy pixel value from ta & colorspace, write it to dest at dest_byi(++);
                //copy_px_to_ta_dest_byi(ta_source, source_colorspace, source_ibounds, opt_ta_dest, dest_byi);
                //byi_read = source_ibounds[0] * bypp + source_ibounds[1] * bypr;
                opt_ta_dest[dest_byi] = ta_source[byi_read++];
                opt_ta_dest[dest_byi + 1] = ta_source[byi_read++];
                opt_ta_dest[dest_byi + 2] = ta_source[byi_read++];

            } else {
                //source_xy_crossover[1] = source_ibounds[1] + 1;
                // 1x2
                // work out proportions of each...
                // proportion above, proportion below.

                // Direct calculation would be cool...

                byi_read_below = byi_read + bypr;

                //const extension_above = source_xy_crossover[1] - source_fbounds[1];
                //const extension_below = source_fbounds[3] - source_xy_crossover[1];

                /*

                const weight_above = edge_distances_proportions_of_total[1];
                const weight_below = edge_distances_proportions_of_total[3];
                opt_ta_dest[dest_byi] = weight_above * ta_source[byi_read++] + weight_below * ta_source[byi_read_below++];
                opt_ta_dest[dest_byi + 1] = weight_above * ta_source[byi_read++] + weight_below * ta_source[byi_read_below++];
                opt_ta_dest[dest_byi + 2] = weight_above * ta_source[byi_read++] + weight_below * ta_source[byi_read_below++];

                */

                opt_ta_dest[dest_byi] = edge_distances_proportions_of_total[1] * ta_source[byi_read++] + edge_distances_proportions_of_total[3] * ta_source[byi_read_below++];
                opt_ta_dest[dest_byi + 1] = edge_distances_proportions_of_total[1] * ta_source[byi_read++] + edge_distances_proportions_of_total[3] * ta_source[byi_read_below++];
                opt_ta_dest[dest_byi + 2] = edge_distances_proportions_of_total[1] * ta_source[byi_read++] + edge_distances_proportions_of_total[3] * ta_source[byi_read_below++];
                


                
                //console.log('');

                //console.log('extension_above', extension_above);
                //console.log('extension_below', extension_below);
                //console.log('weight_above', weight_above);
                //console.log('weight_below', weight_below);

                //console.log('source_edge_distances', source_edge_distances);

                // could now try function that does the reading of both and writing to dest_byi

                // then inline later?

                // byi_read_top
                //  that's byi_read

                //byi_read = source_ibounds[0] * bypp + source_ibounds[1] * bypr;
                
                

            }
        } else {
            if (source_i_any_coverage_size[1] === 1) {
                // 2x1
                //source_xy_crossover[0] = source_ibounds[0] + 1;

                /*
                const extension_left = source_xy_crossover[0] - source_fbounds[0];
                const extension_right = source_fbounds[2] - source_xy_crossover[0];
                const weight_left = extension_left / dest_to_source_ratio[0];
                const weight_right = extension_right / dest_to_source_ratio[0];
                */

                byi_read_right = byi_read + bypp;
                //const weight_left = (source_edge_distances[0]) / dest_to_source_ratio[0];
                //const weight_right = (source_edge_distances[2]) / dest_to_source_ratio[0];

                //byi_read = source_ibounds[0] * bypp + source_ibounds[1] * bypr;
                

                opt_ta_dest[dest_byi] = edge_distances_proportions_of_total[0] * ta_source[byi_read++] + edge_distances_proportions_of_total[2] * ta_source[byi_read_right++];
                opt_ta_dest[dest_byi + 1] = edge_distances_proportions_of_total[0] * ta_source[byi_read++] + edge_distances_proportions_of_total[2] * ta_source[byi_read_right++];
                opt_ta_dest[dest_byi + 2] = edge_distances_proportions_of_total[0] * ta_source[byi_read++] + edge_distances_proportions_of_total[2] * ta_source[byi_read_right++];

            } else {
                //source_xy_crossover[0] = source_ibounds[0] + 1;
                //source_xy_crossover[1] = source_ibounds[1] + 1;
                // 2x2
                //console.trace();
                //throw 'stop';
                //const extension_left = source_xy_crossover[0] - source_fbounds[0];
                //const extension_right = source_fbounds[2] - source_xy_crossover[0];
                //const extension_above = source_xy_crossover[1] - source_fbounds[1];
                //const extension_below = source_fbounds[3] - source_xy_crossover[1];

                // source_corner_areas

                /*
                
                const weight_left = source_edge_distances[0] / dest_to_source_ratio[0];
                const weight_right = source_edge_distances[2] / dest_to_source_ratio[0];
                const weight_above = source_edge_distances[1] / dest_to_source_ratio[1];
                const weight_below = source_edge_distances[3] / dest_to_source_ratio[1];

                const weight_tl = weight_left * weight_above;
                const weight_tr = weight_right * weight_above;
                const weight_bl = weight_left * weight_below;
                const weight_br = weight_right * weight_below;
                */

                //const weight_tl = source_corner_areas[0] / source_px_area;
                //const weight_tr = source_corner_areas[1] / source_px_area;
                //const weight_bl = source_corner_areas[2] / source_px_area;
                //const weight_br = source_corner_areas[3] / source_px_area;

                //console.log('[weight_tl, weight_tr, weight_bl, weight_br]', [weight_tl, weight_tr, weight_bl, weight_br]);
                //byi_read = source_ibounds[0] * bypp + source_ibounds[1] * bypr;
                byi_read_right = byi_read + bypp;
                byi_read_below = byi_read + bypr;
                byi_read_below_right = byi_read_below + bypp;

                opt_ta_dest[dest_byi] = corner_areas_proportions_of_total[0] * ta_source[byi_read++] + corner_areas_proportions_of_total[1] * ta_source[byi_read_right++] + corner_areas_proportions_of_total[2] * ta_source[byi_read_below++] + corner_areas_proportions_of_total[3] * ta_source[byi_read_below_right++];
                opt_ta_dest[dest_byi + 1] = corner_areas_proportions_of_total[0] * ta_source[byi_read++] + corner_areas_proportions_of_total[1] * ta_source[byi_read_right++] + corner_areas_proportions_of_total[2] * ta_source[byi_read_below++] + corner_areas_proportions_of_total[3] * ta_source[byi_read_below_right++];
                opt_ta_dest[dest_byi + 2] = corner_areas_proportions_of_total[0] * ta_source[byi_read++] + corner_areas_proportions_of_total[1] * ta_source[byi_read_right++] + corner_areas_proportions_of_total[2] * ta_source[byi_read_below++] + corner_areas_proportions_of_total[3] * ta_source[byi_read_below_right++];
            }
        }
    })
}



// This optimized version works much faster than before.
//  Does not seem like the callback pattern creates much overhead.

const _fast_resize_ta_colorspace_24bipp_subpixels = (ta_source, source_colorspace, dest_size, opt_ta_dest) => { 

    const [width, height, bypp, bypr, bipp, bipr] = source_colorspace;
    const dest_colorspace = new Int32Array([dest_size[0], dest_size[1], bypp, bypp * dest_size[0], bipp, bipp * dest_size[0]]);
    const dest_to_source_ratio = new Float32Array([source_colorspace[0] / dest_size[0], source_colorspace[1] / dest_size[1]]);

    // floating point location in source


    // Bounds calc could be more appropriate?
    //  or keep using + dest_to_source_ratio

    // the bounds are most important for the various calculations...

    //const source_fxy = new Float32Array(2);
    // Maybe source bounds will be more useful?
    //const source_ixy = new Int16Array(2);

    const source_fbounds = new Float32Array(4);
    const source_ibounds = new Int16Array(4);

    const source_i_any_coverage_size = new Int16Array(2);

    let byi_read;
    let byi_read_below, byi_read_right, byi_read_below_right;


    //let extension_above, extension_below, extension_left, extension_right;


    // reply consts with lets in this scope?
    //  or use typed arrays to hold the info?

    // also a crossover_x?


    // potential crossover point - keep it updated?


    const source_xy_crossover = new Int16Array(2);

    each_pixel_in_colorspace(dest_colorspace, (dest_xy, dest_byi) => {
        //console.log('[dest_xy, dest_byi]', [dest_xy, dest_byi]);

        // Easy enough now...
        source_fbounds[0] = dest_xy[0] * dest_to_source_ratio[0];
        source_fbounds[1] = dest_xy[1] * dest_to_source_ratio[1];
        source_fbounds[2] = source_fbounds[0] + dest_to_source_ratio[0];
        source_fbounds[3] = source_fbounds[1] + dest_to_source_ratio[1];

        // Scale down the pixel location...
        source_ibounds[0] = source_fbounds[0];
        source_ibounds[1] = source_fbounds[1];
        source_ibounds[2] = Math.ceil(source_fbounds[2]);
        source_ibounds[3] = Math.ceil(source_fbounds[3]);

        // does it cover other pixels / proportions in those other pixels?

        // Still reasonably fast - yet slowing down from before....
        source_i_any_coverage_size[0] = source_ibounds[2] - source_ibounds[0];
        source_i_any_coverage_size[1] = source_ibounds[3] - source_ibounds[1];

        //opt_ta_dest[dest_byi] = 255;
        // then depending on the size....
        //console.log('source_i_any_coverage_size', source_i_any_coverage_size);
        // consts elsewhere even speeding things up?

        byi_read = source_ibounds[0] * bypp + source_ibounds[1] * bypr;


        if (source_i_any_coverage_size[0] === 1) {
            if (source_i_any_coverage_size[1] === 1) {

                // Indeed is faster with this inlined.

                // read xy pixel value from ta & colorspace, write it to dest at dest_byi(++);
                //copy_px_to_ta_dest_byi(ta_source, source_colorspace, source_ibounds, opt_ta_dest, dest_byi);
                byi_read = source_ibounds[0] * bypp + source_ibounds[1] * bypr;
                opt_ta_dest[dest_byi] = ta_source[byi_read++];
                opt_ta_dest[dest_byi + 1] = ta_source[byi_read++];
                opt_ta_dest[dest_byi + 2] = ta_source[byi_read++];

            } else {

                source_xy_crossover[1] = source_ibounds[1] + 1;
                // 1x2
                // work out proportions of each...
                // proportion above, proportion below.

                // Direct calculation would be cool...

                const extension_above = source_xy_crossover[1] - source_fbounds[1];
                const extension_below = source_fbounds[3] - source_xy_crossover[1];
                const weight_above = extension_above / dest_to_source_ratio[1];
                const weight_below = extension_below / dest_to_source_ratio[1];


                
                //console.log('');
                //console.log('extension_above', extension_above);
                //console.log('extension_below', extension_below);
                //console.log('weight_above', weight_above);
                //console.log('weight_below', weight_below);

                // could now try function that does the reading of both and writing to dest_byi

                // then inline later?

                // byi_read_top
                //  that's byi_read

                //byi_read = source_ibounds[0] * bypp + source_ibounds[1] * bypr;
                byi_read_below = byi_read + bypr;

                opt_ta_dest[dest_byi] = weight_above * ta_source[byi_read++] + weight_below * ta_source[byi_read_below++];
                opt_ta_dest[dest_byi + 1] = weight_above * ta_source[byi_read++] + weight_below * ta_source[byi_read_below++];
                opt_ta_dest[dest_byi + 2] = weight_above * ta_source[byi_read++] + weight_below * ta_source[byi_read_below++];

            }
        } else {

            if (source_i_any_coverage_size[1] === 1) {
                // 2x1
                source_xy_crossover[0] = source_ibounds[0] + 1;

                /*
                const extension_left = source_xy_crossover[0] - source_fbounds[0];
                const extension_right = source_fbounds[2] - source_xy_crossover[0];
                const weight_left = extension_left / dest_to_source_ratio[0];
                const weight_right = extension_right / dest_to_source_ratio[0];
                */
                const weight_left = (source_xy_crossover[0] - source_fbounds[0]) / dest_to_source_ratio[0];
                const weight_right = (source_fbounds[2] - source_xy_crossover[0]) / dest_to_source_ratio[0];

                //byi_read = source_ibounds[0] * bypp + source_ibounds[1] * bypr;
                byi_read_right = byi_read + bypp;

                opt_ta_dest[dest_byi] = weight_left * ta_source[byi_read++] + weight_right * ta_source[byi_read_right++];
                opt_ta_dest[dest_byi + 1] = weight_left * ta_source[byi_read++] + weight_right * ta_source[byi_read_right++];
                opt_ta_dest[dest_byi + 2] = weight_left * ta_source[byi_read++] + weight_right * ta_source[byi_read_right++];



            } else {
                source_xy_crossover[0] = source_ibounds[0] + 1;
                source_xy_crossover[1] = source_ibounds[1] + 1;
                // 2x2
                //console.trace();
                //throw 'stop';
                const extension_left = source_xy_crossover[0] - source_fbounds[0];
                const extension_right = source_fbounds[2] - source_xy_crossover[0];
                const extension_above = source_xy_crossover[1] - source_fbounds[1];
                const extension_below = source_fbounds[3] - source_xy_crossover[1];


                const weight_left = extension_left / dest_to_source_ratio[0];
                const weight_right = extension_right / dest_to_source_ratio[0];
                const weight_above = extension_above / dest_to_source_ratio[1];
                const weight_below = extension_below / dest_to_source_ratio[1];

                const weight_tl = weight_left * weight_above;
                const weight_tr = weight_right * weight_above;
                const weight_bl = weight_left * weight_below;
                const weight_br = weight_right * weight_below;

                //console.log('[weight_tl, weight_tr, weight_bl, weight_br]', [weight_tl, weight_tr, weight_bl, weight_br]);
                //byi_read = source_ibounds[0] * bypp + source_ibounds[1] * bypr;
                byi_read_right = byi_read + bypp;
                byi_read_below = byi_read + bypr;
                byi_read_below_right = byi_read_below + bypp;

                opt_ta_dest[dest_byi] = weight_tl * ta_source[byi_read++] + weight_tr * ta_source[byi_read_right++] + weight_bl * ta_source[byi_read_below++] + weight_br * ta_source[byi_read_below_right++];
                opt_ta_dest[dest_byi + 1] = weight_tl * ta_source[byi_read++] + weight_tr * ta_source[byi_read_right++] + weight_bl * ta_source[byi_read_below++] + weight_br * ta_source[byi_read_below_right++];
                opt_ta_dest[dest_byi + 2] = weight_tl * ta_source[byi_read++] + weight_tr * ta_source[byi_read_right++] + weight_bl * ta_source[byi_read_below++] + weight_br * ta_source[byi_read_below_right++];
            }
        }
    })
}



const ______resize_ta_colorspace_24bipp_subpixels = (ta_source, source_colorspace, dest_size, opt_ta_dest) => {


    //
    const source_size = source_colorspace.subarray(0, 2);
    const dest_to_source_ratio = new Float32Array([source_size[0] / dest_size[0], source_size[1] / dest_size[1]]);

    // could compare to previous position to update the read position?

    // Could detect changes in tai_subpixel_bounds?
    //  But getting advance row or advance column info would def help.
    //   Or even a source bytes advance?

    // byi read

    // and can advance byi write with every pixel.

    let byi_read = 0, byi_write = 0;

    each_subpixel_within_colorspace(dest_to_source_ratio, source_colorspace, (taf_subpixel_bounds, tai_subpixel_bounds, i_size, bytes_advance) => {
        //console.log('');
        //console.log('taf_subpixel_bounds, tai_subpixel_bounds, i_size', [taf_subpixel_bounds, tai_subpixel_bounds, i_size]);

        //console.log('i_size', i_size);
        // 
        if (i_size[0] === 1) {
            if (i_size[1] === 1) {
                // direct copy px
                opt_ta_dest[byi_write++] = ta_source[byi_read];
                opt_ta_dest[byi_write++] = ta_source[byi_read + 1];
                opt_ta_dest[byi_write++] = ta_source[byi_read + 2];
                
            } else {
                // its 2
                byi_write += 3;
            }
        } else {
            // its 2
            if (i_size[1] === 1) {
                byi_write += 3;
            } else {
                // its 2

                // 2x2 read and write.
                byi_write += 3;
            }
        }
        // console.log('byi_write', byi_write);

        //console.log('bytes_advance', bytes_advance);

        byi_read += bytes_advance;

    });
}




const resize_ta_colorspace_24bipp = (ta_source, source_colorspace, dest_size, opt_ta_dest) => {
    const source_size = source_colorspace.subarray(0, 2);
    const dest_to_source_ratio = new Float32Array([source_size[0] / dest_size[0], source_size[1] / dest_size[1]]);
    const source_vfpixel_size = dest_to_source_ratio;
    console.log('source_vfpixel_size', source_vfpixel_size);
    if (source_vfpixel_size[0] < 1 && source_vfpixel_size[1] < 1) {
        //console.trace();
        //throw 'stop - use subpixels sepecific algo';
        return resize_ta_colorspace_24bipp_subpixels(ta_source, source_colorspace, dest_size, opt_ta_dest);
    } else {

        // New iteration algorithm needed...
        //  Won't rely on a weights object being created.




        // Other possible optimized version - can have pixel coverage up to 3x3.
        //  Could be worth doing further optimization on vfp etc.

        // May be worth making / trying a loop that doesn't use vfp.
        //  Direct copying using references.
        //   Not creating the weights as a separate array.

        // resize_ta_colorspace_24bipp_3x3_any_coverage

        // A specialised upscaling algorithm for upscaling pixels that would span 2x2, 2x3, 3x2, 3x3;
        //  Looks like there would only be 4 specific sizes of coverage for and rescale operation.
        //   And handle the smaller sizes too?






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
        const dest_xy = new Int16Array([0, 0]);
        const source_fpos = new Float32Array(2);
        const vfp = new Virtual_Float_Pixel(source_fpos, source_vfpixel_size);
        for (dest_xy[1] = 0; dest_xy[1] < dest_size[1]; dest_xy[1]++) {
            for (dest_xy[0] = 0; dest_xy[0] < dest_size[0]; dest_xy[0]++) {
                vfp.pos = source_fpos;
                read_merged_vfpx_write_24bipp(ta_source, source_colorspace, vfp, opt_ta_dest, b_write);
                b_write += 3;
                source_fpos[0] += source_vfpixel_size[0];
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


