

const eg_mod_name = 'subpixels';


const {each} = require('lang-mini');

const fnlfs = require('fnlfs');
const {obs} = require('fnl');
const create = require('./create_eg_pbs');
const { PerformanceObserver, performance } = require('perf_hooks');

const ta_math = require('../ta-math');

// Then the examples will use a proper example runner structure. Won't be all that complex, will allow observation of examples.
//  
const {Pixel_Buffer} = require('../gfx');




// Could make into separate module as it seems generally useful. It would also help progress towards jsgui4, which will use more external references (still to my ecosystem).
const Virtual_Float_Pixel = require('../virtual-float-pixel');


// So, subpixel based resizing works now.
//  Want to do float-defined superpixel based resizing next.
//   This will be useful for shrinking images

// Also, need to extract any given float defined virtual pixel from a pb.
//  This could be written as a newer version / improvement of subpixel.
//   Will have the ability to deal with any virtual pixel coords, and get the merged value (by overlap weightings) of all the pixels together.
//    Would need to iterate each pixel within this virtual pixel space.



// float_virtual_pixels
//   so not superpixels.

// read_virtual_pixel(taf_pos)


// maybe is worth keeping in this file for the moment.
//  or moving some of it to ta_math...


const read_merged_subpixel = (ta_source, ta_colorspace, taf_subpixel_pos, taf_subpixel_size) => {

    // Defnitely need more work and specific tests / examples for this.





    // Detect if it's wholly enclosed by a single pixel.

    //let console = {
    //    'log': () => {}
    //}

    // work out the subpixel bounds
    //  easy to see from them if it's all within one pixel
    //  

    

    const [width, height, bypp, bypr, bipp, bipr] = ta_colorspace;

    const taf_subpixel_bounds = new Float32Array([taf_subpixel_pos[0], taf_subpixel_pos[1], taf_subpixel_pos[0] + taf_subpixel_size[0], taf_subpixel_pos[1] + taf_subpixel_size[1]]);


    //console.log('taf_subpixel_bounds', taf_subpixel_bounds);

    // detect if they are all within a single pixel.
    // crosses_right, crosses_down

    // get the floored parts of the bounds 2 and 3, compared to floored parts of bounds 0 and 1.

    const i_subpixel_bounds = new Int16Array(taf_subpixel_bounds);
    //console.log('i_subpixel_bounds', i_subpixel_bounds);
    const ita_px_pos = i_subpixel_bounds.subarray(0, 2);
    //console.log('ita_px_pos', ita_px_pos);

    const crosses_right = i_subpixel_bounds[0] !== i_subpixel_bounds[2];
    const crosses_down = i_subpixel_bounds[1] !== i_subpixel_bounds[3];

    //console.log('crosses_right', crosses_right);
    //console.log('crosses_down', crosses_down);

    // handle the 4 different cases...

    if (crosses_right && crosses_down) {

        // 4px block read required.
        //  first, calculate the weightings.

        // The proportion it's in any of the 4 pixels.

        // ta proportions?
        
        const subpixel_area = taf_subpixel_size[0] * taf_subpixel_size[1];
        //console.log('subpixel_area', subpixel_area);

        // and find the area within each of the 4 pixels.
        //  find size within each of the 4 pixels.

        // measure the difference of the tl of the subpixel to the br of the tl pixel...

        // px_overlap_pos.
        //  that may be useful to have in the normal int pixel space.

        // px_cross_pos

        // below can be optimized... but do speed comparisons.

        const px_cross_pos = i_subpixel_bounds.subarray(2, 4);
        //console.log('px_cross_pos', px_cross_pos);

        // Separately calculate the expanse into various quadrants.
        //  Don't need these size tas with their area calculations.

        // center to the top of the pixel
        const dist_left = px_cross_pos[0] - taf_subpixel_bounds[0];
        const dist_up = px_cross_pos[1] - taf_subpixel_bounds[1];

        const dist_right = taf_subpixel_bounds[2] - px_cross_pos[0];
        const dist_down = taf_subpixel_bounds[3] - px_cross_pos[1];

        


        //console.log('[dist_left, dist_up, dist_right, dist_down]', [dist_left, dist_up, dist_right, dist_down]);

        // so can work out the areas of the subpixel that overlaps each quadrant.

        const area_tl = dist_left * dist_up;
        const area_tr = dist_right * dist_up;
        const area_bl = dist_left * dist_down;
        const area_br = dist_right * dist_down;

        const weight_tl = area_tl / subpixel_area;
        const weight_tr = area_tr / subpixel_area;
        const weight_bl = area_bl / subpixel_area;
        const weight_br = area_br / subpixel_area;

        //console.log('[weight_tl, weight_tr, weight_bl, weight_br]', [weight_tl, weight_tr, weight_bl, weight_br]);

        //console.log('weight_tl + weight_tr + weight_bl + weight_br', weight_tl + weight_tr + weight_bl + weight_br);







        /*


        const size_in_tl = new Float32Array([(px_cross_pos[0] - taf_subpixel_bounds[0]), (px_cross_pos[1] - taf_subpixel_bounds[1])]);
        console.log('size_in_tl', size_in_tl);
        const area_in_tl = size_in_tl[0] * size_in_tl[1];
        console.log('area_in_tl', area_in_tl);


        // and the areas in each of the other quadrants.

        const size_in_tr = new Float32Array([(taf_subpixel_bounds[2] - px_cross_pos[0]), -1 * (px_cross_pos[1] - taf_subpixel_bounds[1])]);
        console.log('size_in_tr', size_in_tr);
        const area_in_tr = size_in_tr[0] * size_in_tr[1];
        console.log('area_in_tr', area_in_tr);


        const size_in_bl = new Float32Array([-1 * (px_cross_pos[0] - taf_subpixel_bounds[0]), (taf_subpixel_bounds[3] - px_cross_pos[1])]);
        console.log('size_in_bl', size_in_bl);
        const area_in_bl = size_in_bl[0] * size_in_bl[1];
        console.log('area_in_bl', area_in_bl);


        const size_in_br = new Float32Array([(taf_subpixel_bounds[2] - px_cross_pos[0]), (taf_subpixel_bounds[3] - px_cross_pos[1])]);
        console.log('size_in_br', size_in_br);
        const area_in_br = size_in_br[0] * size_in_br[1];
        console.log('area_in_br', area_in_br);


        // then the weights for each are a proportion of the total area of the subpixel.

        const weight_tl = area_in_tl / subpixel_area;
        const weight_tr = area_in_tr / subpixel_area;
        const weight_bl = area_in_bl / subpixel_area;
        const weight_br = area_in_br / subpixel_area;



        console.log('[weight_tl, weight_tr, weight_bl, weight_br]', [weight_tl, weight_tr, weight_bl, weight_br]);

        console.log('weight_tl + weight_tr + weight_bl + weight_br', weight_tl + weight_tr + weight_bl + weight_br);
        // not exactly 1 with float maths. close enough.

        // Then read the 4 pixels square, and return the weighted result.

        // Maybe have / use a weighted merge 4 px function?

        // This part depends on the bipp number too.
        //  The weighting calc didn't.

        // can optimize later. want to avoid code repetition now.

        */

        const weights = new Float32Array([weight_tl, weight_tr, weight_bl, weight_br]);


        // read_weight_merged_2x2_as_px ...?
        const res_merged = read_weight_merged_2x2(ta_source, ta_colorspace, ita_px_pos, weights);


        //console.log('2x2 res_merged', res_merged);

        return res_merged;
        









    } else {
        if (crosses_right) {
            // how far to the left of the cross_x?

            const x_cross = i_subpixel_bounds[2];
            //console.log('x_cross', x_cross);


            // Need to calculate weightings.
            //  Proportion left vs proportion right.

            const dist_left = x_cross - taf_subpixel_bounds[0];
            const dist_right = taf_subpixel_bounds[2] - x_cross;

            //console.log('dist_left', dist_left);
            //console.log('dist_right', dist_right);

            // and need the subpixel width.
            const subpixel_width = taf_subpixel_size[0];

            const prop_left = dist_left / subpixel_width;
            const prop_right = dist_right / subpixel_width;

            //console.log('prop_left', prop_left);
            //console.log('prop_right', prop_right);

            //console.log('prop_left + prop_right', prop_left + prop_right);


            // so the proportions are the weights.

            //  weights need to be in a ta?
            //   would make sense...

            const weights = new Float32Array([prop_left, prop_right]);

            const res_merged = read_weight_merged_2x1(ta_source, ta_colorspace, ita_px_pos, weights);


            //console.log('res_merged', res_merged);

            return res_merged;



            // do some kind of weighted 2x1px read and merge?
            //  for the moment, makes for clearer code? Better perf to inline?
            //   doing this makes sense for reasons of polymorphic perf (maybe?)










            // 2x1 block / set of pixels to read.

            //const px_val = 
            // get the values of the 2 pixels...







            

            // probably worth having this specific function for logical clarity.
            //  maybe inline it...
            //  likely to make this more efficient when moved to ta_math.

            // can re-use some variables / do less math overall to do the resize.




            // read_2x1_rect(pos)
            //  and this gets a typed array back.




            //console.trace();
            //throw 'NYI'

        } else if (crosses_down) {

            // read_1x2_rect

            const y_cross = i_subpixel_bounds[3];
            //console.log('y_cross', y_cross);


            // Need to calculate weightings.
            //  Proportion left vs proportion right.

            const dist_up = y_cross - taf_subpixel_bounds[1];
            const dist_down = taf_subpixel_bounds[3] - y_cross;

            //console.log('dist_up', dist_up);
            //console.log('dist_right', dist_down);

            // and need the subpixel width.
            const subpixel_height = taf_subpixel_size[1];

            const prop_up = dist_up / subpixel_height;
            const prop_down = dist_down / subpixel_height;

            //console.log('prop_up', prop_up);
            //console.log('prop_down', prop_down);

            //console.log('prop_up + prop_down', prop_up + prop_down);


            // so the proportions are the weights.

            //  weights need to be in a ta?
            //   would make sense...

            const weights = new Float32Array([prop_up, prop_down]);

            const res_merged = read_weight_merged_1x2(ta_source, ta_colorspace, ita_px_pos, weights);


            //console.log('res_merged', res_merged);

            return res_merged;



            

            //console.trace();
            //throw 'NYI'
        } else {
            // it's just the value of the pixel it's totally enclosed by.

            // ta_math read_pixel?
            //  would use the ta, colorspace and pos.

            // direct read would be faster, but read_px or read_pixel would be clearer code.
            //  Uncertain optimization question.



            return ta_math.read_pixel(ta_source, ta_colorspace, ita_px_pos);


        }
    }

    // All within one pixel?
    // All within one row?
    // All within one column?






}


// const read_merged_fbounds
//  would need to calculate the amount that any single pixel in the source space is covered.




// And weight merged 1x2.



// pixel size must be 1 or less in each dimension...

const read_weight_merged_1x2 = (ta_source, colorspace, pos, taf_2weights) => {
    // read the 2x2 block.

    const [width, height, bypp, bypr, bipp, bipr] = colorspace;

    if (bipp === 1) {
        console.trace();
        throw 'NYI';
    } else if (bipp === 8) {
        console.trace();
        throw 'NYI';

    } else if (bipp === 24) {


        const ta_1x2_block = ta_math.read_1x2_rect(ta_source, colorspace, pos);

        //console.log('ta_2x1_block', ta_2x1_block);

        //throw 'stop';

        // Could be simple enough to do it all by formula, no loop.
        //  faster?

        const rgb_res = new Uint8ClampedArray(3);
        rgb_res[0] = ta_1x2_block[0] * taf_2weights[0] + ta_1x2_block[3] * taf_2weights[1];
        rgb_res[1] = ta_1x2_block[1] * taf_2weights[0] + ta_1x2_block[4] * taf_2weights[1];
        rgb_res[2] = ta_1x2_block[2] * taf_2weights[0] + ta_1x2_block[5] * taf_2weights[1];
        return rgb_res;


    } else if (bipp === 32) {
        console.trace();
        throw 'NYI';

    } else {

        throw 'Unsupported bipp ' + bipp;
        //let b = pos[0] * bypr + pos[1] * bypr;

        // Read the px block...

        

        // depending on bipp...

        // Use an accumulator?
        //  Sum it all at once?

        // different return formats depending on bipp.




    }

    

}


const read_weight_merged_2x1 = (ta_source, colorspace, pos, taf_2weights) => {
    // read the 2x2 block.

    const [width, height, bypp, bypr, bipp, bipr] = colorspace;

    if (bipp === 1) {
        console.trace();
        throw 'NYI';
    } else if (bipp === 8) {
        console.trace();
        throw 'NYI';

    } else if (bipp === 24) {


        const ta_2x1_block = ta_math.read_2x1_rect(ta_source, colorspace, pos);

        //console.log('ta_2x1_block', ta_2x1_block);

        //throw 'stop';

        // Could be simple enough to do it all by formula, no loop.
        //  faster?

        const rgb_res = new Uint8ClampedArray(3);
        rgb_res[0] = ta_2x1_block[0] * taf_2weights[0] + ta_2x1_block[3] * taf_2weights[1];
        rgb_res[1] = ta_2x1_block[1] * taf_2weights[0] + ta_2x1_block[4] * taf_2weights[1];
        rgb_res[2] = ta_2x1_block[2] * taf_2weights[0] + ta_2x1_block[5] * taf_2weights[1];
        return rgb_res;


    } else if (bipp === 32) {
        console.trace();
        throw 'NYI';

    } else {

        throw 'Unsupported bipp ' + bipp;
        //let b = pos[0] * bypr + pos[1] * bypr;

        // Read the px block...

        

        // depending on bipp...

        // Use an accumulator?
        //  Sum it all at once?

        // different return formats depending on bipp.




    }

    

}


const read_weight_merged_2x2 = (ta_source, colorspace, pos, taf_4weights) => {
    // read the 2x2 block.

    const [width, height, bypp, bypr, bipp, bipr] = colorspace;

    if (bipp === 1) {
        console.trace();
        throw 'NYI';
    } else if (bipp === 8) {
        console.trace();
        throw 'NYI';

    } else if (bipp === 24) {

        const ta_4px_block = ta_math.read_4px_rect(ta_source, colorspace, pos);

        //console.log('ta_4px_block', ta_4px_block);

        // Could be simple enough to do it all by formula, no loop.
        //  faster?

        const rgb_res = new Uint8ClampedArray(3);
        rgb_res[0] = ta_4px_block[0] * taf_4weights[0] + ta_4px_block[3] * taf_4weights[1] + ta_4px_block[6] * taf_4weights[2] + ta_4px_block[9] * taf_4weights[3];
        rgb_res[1] = ta_4px_block[1] * taf_4weights[0] + ta_4px_block[4] * taf_4weights[1] + ta_4px_block[7] * taf_4weights[2] + ta_4px_block[10] * taf_4weights[3];
        rgb_res[2] = ta_4px_block[2] * taf_4weights[0] + ta_4px_block[5] * taf_4weights[1] + ta_4px_block[8] * taf_4weights[2] + ta_4px_block[11] * taf_4weights[3];

        return rgb_res;


    } else if (bipp === 32) {
        console.trace();
        throw 'NYI';

    } else {

        throw 'Unsupported bipp ' + bipp;
        //let b = pos[0] * bypr + pos[1] * bypr;

        // Read the px block...

        

        // depending on bipp...

        // Use an accumulator?
        //  Sum it all at once?

        // different return formats depending on bipp.




    }

    

}


// read_weight_merged_2x2(ta_source, colorspace, pos, taf_4weights)
//  reads the 4px rect.
//   applies the weights to each of the 4 pixels and does the merge.






// Want version of function below that takes pixel_size param too...
//  Will be more based on the subpixel code though.



// different version for different bipp modes?
//  same initial calculations...?
//  overlap info may be best precalculated?
//   or use function virtual_fpx_overlaps()
//    may be best for the moment...
//     will return a map of the overlap percentages per pixel.
//      each as a float (for the moment)
//      arranged as its own grid / ta / object of sorts.

// pixel-weightings-buffer?
//  or use pixel-buffer to store weightings?
//   though the ta would need to be a float.

// and could get the pixel weightings buffer from the virtual pixel.

// iterate_virtual_fpx_space_in_ipx
//  so would have a callback (or use loop when inlined) to go over every pixel covered by the virtual float pixel.

// class Virtual_Float_Pixel
//  then can iterate over its pixel_space, with the weighting for each pixel.

// Ability to change / set the Virtual_Float_Pixel properties?
//  it move it accross the source...
//   more rapid recalculation because it already knows some info about the proportions?
//    or these are very fast to calculate anyway...?

// May have simple formula for weightings.
//  px_is_on_top_edge etc

// quickly calculate which edges a pixel is on.
//  or define i_px_left_edge etc.

// do need to iterate through the px in the virtual space to read their colors and accumulate the result.


// More versitile pixel resizing system will use this.

// Seems likely this will actually be used for pixel remapping.
//  may make / try non-oo version for some operations too.

// Moving around a vfpx within a colorspace will be very useful for image resizing / rescaling.


// Seems like its worth putting VFPX into its own file now.
//  Or soon...



//  px_is_on_edge = new Uint8Array(4)




// new Virtual_Float_Pixel(taf_pos, taf_size)
// new Virtual_Float_Pixel(taf_bounds)
//  .each_pixel - iterates over the normal pixel space, giving weightings







// ta_vfpx?

// Virtual Floating-Point Pixels would make a nice ta specific module.





// Get a grid of the overlap proportions.
const virtual_fpx_overlaps = (ta_source, ta_colorspace, taf_pos, taf_size) => {

}

// Function to calculate weightings.


// Will move this code... trying it here for the moment.

// Old? New version being made is much more comprehensive, covering virtual pixels of any size (not just 1x1 floating point size!)
const read_merged_fpx = (ta_source, ta_colorspace, taf_pos) => {
    // Maybe not the function we (most) need. Want to read subpixel sized subpixels!

    // This uses the subpixel float position, but only will read it as a size 1 pixel.
    //  Maybe useful in an algorithm that uses pixel centering for the subpixels, reads a 1 px space from there - (0.5 * subpixel size)
    
    



    const [width, height, bypp, bypr, bipp, bipr] = ta_colorspace;

    const [fx, fy] = taf_pos;

    // ix, iy

    const ix = Math.floor(fx);
    const iy = Math.floor(fx);

    console.log('[fx, fy]', [fx, fy]);
    console.log('[ix, iy]', [ix, iy]);

    // work out the proportions / weightings it's within each of the 4 regular integer spedified pixels.
    //  offsets / distances etc...

    // proportion down the whole 4 px grid?
    //  as in proportion between the top and the bottom of the first px / row...

    const prop_r = fx - ix;
    const prop_b = fy - iy;
    const prop_l = 1 - prop_r;
    const prop_t = 1 - prop_b;

    console.log('[prop_l, prop_t, prop_r, prop_b]', [prop_l, prop_t, prop_r, prop_b]);

    // But getting from these to the pixel proportions?

    //const prop_tl = ???

    const prop_tl = prop_l * prop_t;
    const prop_tr = prop_r * prop_t;
    const prop_bl = prop_l * prop_b;
    const prop_br = prop_r * prop_b;

    const prop_totals = prop_tl + prop_tr + prop_bl + prop_br;

    console.log('[prop_tl, prop_tr, prop_bl, prop_br]', [prop_tl, prop_tr, prop_bl, prop_br]);
    console.log('prop_totals', prop_totals);

    


    // Probably best to build up the results using floating point arithmatic...
    //  or a formula for each pixel within a single assignment.




    // then depending on the bipp value, will return a different ta as the result.
    //  better to use an existing ta than to create a new one?

    const ta_pos = new Int16Array([ix, iy]);

    if (bipp === 1) {
        console.trace();
        throw 'NYI';
    } else if (bipp === 8) {

        // will return a single value, not a typed array.
        //  maybe make a more monomorpic version? does it matter?

        // return a number - all merged together.

        // read the px values.

        const ta_4px = ta_math.read_4px_rect(ta_source, ta_colorspace, ta_pos);
        console.log('ta_4px', ta_4px);

        // Should be able to calculate the result component values all at once.

        





        //if (ta_res) {
        //    if (ta_res.length !== )
        //}

    } else if (bipp === 24) {

        // return ta rgb.

        const ta_4px = ta_math.read_4px_rect(ta_source, ta_colorspace, ta_pos);
        console.log('ta_4px', ta_4px);

        const rgb_res = new Uint8ClampedArray(3);
        rgb_res[0] = ta_4px[0] * prop_tl + ta_4px[3] * prop_tr + ta_4px[6] * prop_bl + ta_4px[9] * prop_br;
        rgb_res[1] = ta_4px[1] * prop_tl + ta_4px[4] * prop_tr + ta_4px[7] * prop_bl + ta_4px[10] * prop_br;
        rgb_res[2] = ta_4px[2] * prop_tl + ta_4px[5] * prop_tr + ta_4px[8] * prop_bl + ta_4px[11] * prop_br;

        //return 

        return rgb_res;



        
    } else if (bipp === 32) {
        console.trace();
        throw 'NYI';
    }

    
    // proportion in left row
    // proportion in top row
    // proportion in right row
    // proportion in bottom row

    // prop_l, prop_t etc...



}




const run_examples = (gfx_server) => obs((next, complete, error) => {
    const pb_24bipp_color_square = create.generate_color_square();
    const pb_8bipp_patch = (() => {
        const res = create.patch_1();
        res.bipp = 8;
        return res;
    })();
    //console.log('pb_8bipp_patch.bipp', pb_8bipp_patch.bipp);

    const pb_24bipp_patch = create.patch_1();


    const pastel = create.generate_32x32_24bipp_pastel();
    // The pastel image will be a good one to begin working on resizing with
    //  (enlarging in particular, using floating point pixel reference and weighted merging)


    //let console = {
    //    log: () => {}
    //}



    // Some examples of creating a new image from subpixel reads...


    // iterate over a different pixel range

    // so, come up with a larger pixel space, eg 100x100 (same ar)
    

    // maybe we need more than taf_pos.
    //  the pixels / subpixels could be of a sifferent size.
    //  if so, do similar calculations...?

    // Or... use the larger pixel space, and calculate a pixel ratio so we can do 1px sized reads on specific places in the source image?

    // Think we need some more maths...
    //  Want to be able to read a subpixel area which may not be a 1x1 square.

    // Scaling back from a pixel in the dest to a pixel in the source.

    // Possibly correctly centered pixel-sized reads on the source would work?
    //  as an approximation?
    // we could use the dest to source mapping to work out the positions of centers of the virtual pixels we want to read from.

    // seems like it's worth trying that reading / sampling method. Can compare results with other methods.
    //  this could be really fast and accurate.


    








    







    






    // Initialise sample objects...

    // and examples in an array, with names.

    // All examples are sync.
    //  Saving them won't be.


    // math copy between 24bipp

    // then want a function that reads a pixel based on floating point position.
    //  read all (4) pixels it overlaps
    //  calculate the relative proportion it's within each (should add up to 1), will use as weightings
    //  create a merged pixel color from the colors extracted and the weightings.
    //  this is a step to facilitate image resizing using a smooth and fast algorithm.


    // may go into ta_math.


    // optional result ta?
    //  and would set it if we need to create it.

    // Won't pass in the result ta for the moment.
    //  May be OK to allocate a bit of memory for the fn call?
    //   Investigate optimizatins but no need to optimize absolutely everything (yet).
    //    Need to compare optimized implementations to more basic ones.


    // const read_merged_subpixel(ta_source, ta_colorspace, taf_subpixel_pos, taf_subpixel_size)

    //const calc_bounds = ()

    //  reading subpixels will be useful for image upscaling.

    // May be worth doing area calculations...
    //  Area within each of the 2 or 4 possible pixels.

    // Could also read non-square subpixels.


    const calc_ipx_coverage_areas = (vfp) => {
        const arr_ipx = [
            [0, 0]
        ];
        const res = arr_ipx.map(area => [area, vfp.get_ipx_coverage(area)]);
        return res;
    }

    const eg_vfpx_info = vfp => {

        // .only_total_coverage?
        //  no edges?

        // want to be able to get the edge thicknesses using floating point.
        //  need to consider corner cases too...


        // Edge proportions being 1
        //  meaning corner proportions are also 1.
        //  Makes sense at least...
        //   But seems better to bypass these calculations.
        //   some kind of no_partial_edges property would be of use.

        //  and only if it knows there are partial edges does it calculate / provide? their values.


        // Corner proportions also work out to be 1 when they don't matter.
        //  A usable corner proportion value anyway.

        // Could more quickly set these all to 1 when we see that there are no partial edges
        //  tai any coverage matches tai full coverages.
        // f_size, i_size?

        // more precision in the names makes a lot of sense,
        // f_area too.

        // num_any_coverage_px can be used for some special cases, eg 1, 2(, 4?)

        // .weights?
        // .ipx_weights
        //   that would make a lot of sense
        // .i_width (any coverage)
        //  makes sense in some ways, as we'll need the width the most when looping through these weights.
        //   the returned ta could also have a .width property?

        // i_any_coverage_width is definitely clearer what it means.








        return {
            size: vfp.size,
            i_size: vfp.i_size,
            pos: vfp.pos,
            bounds: vfp.bounds,
            area: vfp.area,
            num_any_coverage_px: vfp.num_any_coverage_px,
            i_any_coverage_width: vfp.i_any_coverage_width,
            i_any_coverage_bounds: vfp.i_any_coverage_bounds,
            i_total_coverage_bounds: vfp.i_total_coverage_bounds,
            no_partial_edges: vfp.no_partial_edges,
            f_ltrb_edge_proportions: vfp.f_ltrb_edge_proportions,
            f_tl_tr_bl_br_corner_proportions: vfp.f_tl_tr_bl_br_corner_proportions,
            ipx_coverage_areas: calc_ipx_coverage_areas(vfp),
            weights: vfp.weights
        }
    }

    const examples = [

        // Ask the Pixel_Buffer which iteration algorithm to use?
        //  Want to present a simple API... will eventually have a resize_ta(ta_source, colorspace_source, dest_size), and won't use the Virtual_Pixel class their either.


        // Get the weightings matrix from the VFP?
        //  Would be useful in variety of situations, perhaps not most optimal?
        //  Could be easy to use, ie read_merged_pixel_using_weight_matrix(i_pos, i_row_width, ta_weights)
        //   Later on, could calculate individual pixel weights on-the-fly.

        // .weighting_matrix
        //  read it as a property.
        //   clear it upon move / update tier 2.
        //   write it, set it and return it when its requested and it doesn't already exist.



        // .get_ipx_weight(i_pos);
        // .get_pixel_weight(i_pos)
        //  should have quick algorithm to get the weight based on the tier2 variables.

        // .each_ipx

        // maybe make ES Iterator of the pixels / pixel weights?





        ['vfpx_0c0_1x1', () => {
            // Experiment / example using the Virtual_Float_Pixel class
            //  This carries out calculations concerning weightings, will be used elsewhere...

            // may have function to read merged pixel from a ta, likely to have the functionality / some of it in ta_math.

            // Will need to ensure a variety of cases are covered.
            //  Literally edge and corner cases.


            // Also getting the weights matrix as a ta would be useful.



            // colorspace operates like the tensor dimension definition.
            //  color components can be treated like the lowest / highest dimension in the tensor.



            // consider ta_matrix(width) ta_tensor(all_dimensions_except_the_last) ta_matrix(size) ta_tensor(all_dimensions)


            // ta_tensor(dimensions)
            //  could be a typed array with extra methods added.
            //   and could look to C++ acceleration including modifying the V8 typed array (likely adding extra methods / properties).







            const vfp = new Virtual_Float_Pixel([0, 0], [1, 1]);






            //console.log('vfp', vfp);
            //console.log('vfp.pos', vfp.pos);
            //console.log('vfp.size', vfp.size);

            // i_size...
            //console.log('vfp.i_size', vfp.i_size);
            //console.log('vfp.bounds', vfp.bounds);

            // floating point area covered...

            // integer totally or partially covered area
            // integer totally covered area

            // i_any_coverage_area
            // i_total_coverage_area
            // i_any_coverage_bounds
            //  i_bounds?
            // i_total_coverage_bounds

            // These will be useful for rapid calculation of weightings.
            
            // Possibly algo:
            //  Quickly determine which of various bounds the pixel is in.
            //   calc_ipx_region(i_pos)
            //    if it's on a corner, if it's on an edge...

            // Need to make use of different calculated values depending on the size / characteristics of grid of int pixels underlying the virtual pixel space.


            // calculate the coverage of different int pixels.
            //  need to work it out quickly...

            //  is it totally outside of the bounds...?

            //  does the given px location fall exactly on the bounds...?

            // .no_edges property?
            //  could look at the edge proportions...?

            // a read_only property to get f_edge_proportions?
            //  f_edge_coverage?
            //  f_edge_coverage_of_ipx_edges?

            // getting a lot of / enough of these in advance will help algorithm selection, and to run the algorithm in an optimal way.
            return eg_vfpx_info(vfp);
            

        }],

        //false, 



        ['vfpx_10p4c10p4_3p5x0p2', () => {
            // Experiment / example using the Virtual_Float_Pixel class
            //  This carries out calculations concerning weightings, will be used elsewhere...

            // may have function to read merged pixel from a ta, likely to have the functionality / some of it in ta_math.

            // Will need to ensure a variety of cases are covered.
            //  Literally edge and corner cases.

            const vfp = new Virtual_Float_Pixel([10.4, 10.4], [3.5, 0.2]);



            //console.log('vfp', vfp);
            //console.log('vfp.pos', vfp.pos);
            //console.log('vfp.size', vfp.size);

            // i_size...
            //console.log('vfp.i_size', vfp.i_size);
            //console.log('vfp.bounds', vfp.bounds);

            return eg_vfpx_info(vfp);


            

        }],

        //false, 

        // vfpx_10p4c10p4_3p4x1p1
        ['vfpx_10p4c10p4_3p5x1p1', () => {
            // Experiment / example using the Virtual_Float_Pixel class
            //  This carries out calculations concerning weightings, will be used elsewhere...

            // may have function to read merged pixel from a ta, likely to have the functionality / some of it in ta_math.

            // Will need to ensure a variety of cases are covered.
            //  Literally edge and corner cases.

            const vfp = new Virtual_Float_Pixel([10.4, 10.4], [3.5, 1.1]);
            //console.log('vfp', vfp);
            //console.log('vfp.pos', vfp.pos);
            //console.log('vfp.size', vfp.size);
            // i_size...
            //console.log('vfp.i_size', vfp.i_size);
            //console.log('vfp.bounds', vfp.bounds);

            return eg_vfpx_info(vfp);

        }],


        // vfpx_


        // vfpx_10p4c10p4_3p4x1p8
        ['vfpx_10p4c10p4_3p5x1p8', () => {
            // Experiment / example using the Virtual_Float_Pixel class
            //  This carries out calculations concerning weightings, will be used elsewhere...
            // may have function to read merged pixel from a ta, likely to have the functionality / some of it in ta_math.
            // Will need to ensure a variety of cases are covered.
            //  Literally edge and corner cases.
            const vfp = new Virtual_Float_Pixel([10.4, 10.4], [3.5, 1.8]);
            //console.log('vfp', vfp);
            //console.log('vfp.pos', vfp.pos);
            //console.log('vfp.size', vfp.size);
            // i_size...
            //console.log('vfp.i_size', vfp.i_size);
            //console.log('vfp.bounds', vfp.bounds);

            // getting back a ta of the pixel weights would be very useful.
            //  Maybe more useful than a callback on each?
            //   Callbacks would provide intermediate results immediately - optimization there.

            // Inline iteration - more code, more complex.
            //  Worth trying in some cases. Worth benchmarking.
            return eg_vfpx_info(vfp);

        }],

        // vfpx_10p4c10p4_3p4x2p4

        ['vfpx_10p4c10p4_3p5x2p4', () => {
            // Experiment / example using the Virtual_Float_Pixel class
            //  This carries out calculations concerning weightings, will be used elsewhere...
            // may have function to read merged pixel from a ta, likely to have the functionality / some of it in ta_math.
            // Will need to ensure a variety of cases are covered.
            //  Literally edge and corner cases.
            const vfp = new Virtual_Float_Pixel([10.4, 10.4], [3.5, 2.4]);
            //console.log('vfp', vfp);
            //console.log('vfp.pos', vfp.pos);
            //console.log('vfp.size', vfp.size);
            // i_size...
            //console.log('vfp.i_size', vfp.i_size);
            //console.log('vfp.bounds', vfp.bounds);

            // getting back a ta of the pixel weights would be very useful.
            //  Maybe more useful than a callback on each?
            //   Callbacks would provide intermediate results immediately - optimization there.

            // Inline iteration - more code, more complex.
            //  Worth trying in some cases. Worth benchmarking.

            return eg_vfpx_info(vfp);


        }],

        ['vfpx_10p4c10p4_3p5x2p6', () => {
            // Experiment / example using the Virtual_Float_Pixel class
            //  This carries out calculations concerning weightings, will be used elsewhere...
            // may have function to read merged pixel from a ta, likely to have the functionality / some of it in ta_math.
            // Will need to ensure a variety of cases are covered.
            //  Literally edge and corner cases.
            const vfp = new Virtual_Float_Pixel([10.4, 10.4], [3.5, 2.6]);
            //console.log('vfp', vfp);
            //console.log('vfp.pos', vfp.pos);
            //console.log('vfp.size', vfp.size);
            // i_size...
            //console.log('vfp.i_size', vfp.i_size);
            //console.log('vfp.bounds', vfp.bounds);

            // getting back a ta of the pixel weights would be very useful.
            //  Maybe more useful than a callback on each?
            //   Callbacks would provide intermediate results immediately - optimization there.

            // Inline iteration - more code, more complex.
            //  Worth trying in some cases. Worth benchmarking.

            return eg_vfpx_info(vfp);


        }],
        ['vfpx_10p4c10p4_3p5x2p7', () => {
            // Experiment / example using the Virtual_Float_Pixel class
            //  This carries out calculations concerning weightings, will be used elsewhere...
            // may have function to read merged pixel from a ta, likely to have the functionality / some of it in ta_math.
            // Will need to ensure a variety of cases are covered.
            //  Literally edge and corner cases.
            const vfp = new Virtual_Float_Pixel([10.4, 10.4], [3.5, 2.7]);
            //console.log('vfp', vfp);
            //console.log('vfp.pos', vfp.pos);
            //console.log('vfp.size', vfp.size);
            // i_size...
            //console.log('vfp.i_size', vfp.i_size);
            //console.log('vfp.bounds', vfp.bounds);

            // getting back a ta of the pixel weights would be very useful.
            //  Maybe more useful than a callback on each?
            //   Callbacks would provide intermediate results immediately - optimization there.

            // Inline iteration - more code, more complex.
            //  Worth trying in some cases. Worth benchmarking.

            return eg_vfpx_info(vfp);


        }],

        // Now let's try taller virtual pixels...

        // 0.2, 0.8, 1.1, 1.8, 2.4, 2.6, 2.7

        ['vfpx_10p4c10p4_0p2x3p5', () => {
            // Experiment / example using the Virtual_Float_Pixel class
            //  This carries out calculations concerning weightings, will be used elsewhere...
            // may have function to read merged pixel from a ta, likely to have the functionality / some of it in ta_math.
            // Will need to ensure a variety of cases are covered.
            //  Literally edge and corner cases.
            const vfp = new Virtual_Float_Pixel([10.4, 10.4], [0.2, 3.5]);
            //console.log('vfp', vfp);
            //console.log('vfp.pos', vfp.pos);
            //console.log('vfp.size', vfp.size);
            // i_size...
            //console.log('vfp.i_size', vfp.i_size);
            //console.log('vfp.bounds', vfp.bounds);

            // getting back a ta of the pixel weights would be very useful.
            //  Maybe more useful than a callback on each?
            //   Callbacks would provide intermediate results immediately - optimization there.

            // Inline iteration - more code, more complex.
            //  Worth trying in some cases. Worth benchmarking.

            return eg_vfpx_info(vfp);

        }],
        ['vfpx_10p4c10p4_0p8x3p5', () => {
            // Experiment / example using the Virtual_Float_Pixel class
            //  This carries out calculations concerning weightings, will be used elsewhere...
            // may have function to read merged pixel from a ta, likely to have the functionality / some of it in ta_math.
            // Will need to ensure a variety of cases are covered.
            //  Literally edge and corner cases.
            const vfp = new Virtual_Float_Pixel([10.4, 10.4], [0.8, 3.5]);
            //console.log('vfp', vfp);
            //console.log('vfp.pos', vfp.pos);
            //console.log('vfp.size', vfp.size);
            // i_size...
            //console.log('vfp.i_size', vfp.i_size);
            //console.log('vfp.bounds', vfp.bounds);

            // getting back a ta of the pixel weights would be very useful.
            //  Maybe more useful than a callback on each?
            //   Callbacks would provide intermediate results immediately - optimization there.

            // Inline iteration - more code, more complex.
            //  Worth trying in some cases. Worth benchmarking.

            return eg_vfpx_info(vfp);

        }],
        ['vfpx_10p4c10p4_1p1x3p5', () => {
            // Experiment / example using the Virtual_Float_Pixel class
            //  This carries out calculations concerning weightings, will be used elsewhere...
            // may have function to read merged pixel from a ta, likely to have the functionality / some of it in ta_math.
            // Will need to ensure a variety of cases are covered.
            //  Literally edge and corner cases.
            const vfp = new Virtual_Float_Pixel([10.4, 10.4], [1.1, 3.5]);
            //console.log('vfp', vfp);
            //console.log('vfp.pos', vfp.pos);
            //console.log('vfp.size', vfp.size);
            // i_size...
            //console.log('vfp.i_size', vfp.i_size);
            //console.log('vfp.bounds', vfp.bounds);

            // getting back a ta of the pixel weights would be very useful.
            //  Maybe more useful than a callback on each?
            //   Callbacks would provide intermediate results immediately - optimization there.

            // Inline iteration - more code, more complex.
            //  Worth trying in some cases. Worth benchmarking.

            return eg_vfpx_info(vfp);

        }],
        ['vfpx_10p4c10p4_1p8x3p5', () => {
            // Experiment / example using the Virtual_Float_Pixel class
            //  This carries out calculations concerning weightings, will be used elsewhere...
            // may have function to read merged pixel from a ta, likely to have the functionality / some of it in ta_math.
            // Will need to ensure a variety of cases are covered.
            //  Literally edge and corner cases.
            const vfp = new Virtual_Float_Pixel([10.4, 10.4], [1.8, 3.5]);
            //console.log('vfp', vfp);
            //console.log('vfp.pos', vfp.pos);
            //console.log('vfp.size', vfp.size);
            // i_size...
            //console.log('vfp.i_size', vfp.i_size);
            //console.log('vfp.bounds', vfp.bounds);

            // getting back a ta of the pixel weights would be very useful.
            //  Maybe more useful than a callback on each?
            //   Callbacks would provide intermediate results immediately - optimization there.

            // Inline iteration - more code, more complex.
            //  Worth trying in some cases. Worth benchmarking.

            return eg_vfpx_info(vfp);

        }],
        ['vfpx_10p4c10p4_2p4x3p5', () => {
            // Experiment / example using the Virtual_Float_Pixel class
            //  This carries out calculations concerning weightings, will be used elsewhere...
            // may have function to read merged pixel from a ta, likely to have the functionality / some of it in ta_math.
            // Will need to ensure a variety of cases are covered.
            //  Literally edge and corner cases.
            const vfp = new Virtual_Float_Pixel([10.4, 10.4], [2.4, 3.5]);
            //console.log('vfp', vfp);
            //console.log('vfp.pos', vfp.pos);
            //console.log('vfp.size', vfp.size);
            // i_size...
            //console.log('vfp.i_size', vfp.i_size);
            //console.log('vfp.bounds', vfp.bounds);

            // getting back a ta of the pixel weights would be very useful.
            //  Maybe more useful than a callback on each?
            //   Callbacks would provide intermediate results immediately - optimization there.

            // Inline iteration - more code, more complex.
            //  Worth trying in some cases. Worth benchmarking.

            return eg_vfpx_info(vfp);

        }],
        ['vfpx_10p4c10p4_2p6x3p5', () => {
            // Experiment / example using the Virtual_Float_Pixel class
            //  This carries out calculations concerning weightings, will be used elsewhere...
            // may have function to read merged pixel from a ta, likely to have the functionality / some of it in ta_math.
            // Will need to ensure a variety of cases are covered.
            //  Literally edge and corner cases.
            const vfp = new Virtual_Float_Pixel([10.4, 10.4], [2.6, 3.5]);
            //console.log('vfp', vfp);
            //console.log('vfp.pos', vfp.pos);
            //console.log('vfp.size', vfp.size);
            // i_size...
            //console.log('vfp.i_size', vfp.i_size);
            //console.log('vfp.bounds', vfp.bounds);

            // getting back a ta of the pixel weights would be very useful.
            //  Maybe more useful than a callback on each?
            //   Callbacks would provide intermediate results immediately - optimization there.

            // Inline iteration - more code, more complex.
            //  Worth trying in some cases. Worth benchmarking.

            return eg_vfpx_info(vfp);

        }],
        ['vfpx_10p4c10p4_2p7x3p5', () => {
            // Experiment / example using the Virtual_Float_Pixel class
            //  This carries out calculations concerning weightings, will be used elsewhere...
            // may have function to read merged pixel from a ta, likely to have the functionality / some of it in ta_math.
            // Will need to ensure a variety of cases are covered.
            //  Literally edge and corner cases.
            const vfp = new Virtual_Float_Pixel([10.4, 10.4], [2.7, 3.5]);
            //console.log('vfp', vfp);
            //console.log('vfp.pos', vfp.pos);
            //console.log('vfp.size', vfp.size);
            // i_size...
            //console.log('vfp.i_size', vfp.i_size);
            //console.log('vfp.bounds', vfp.bounds);

            // getting back a ta of the pixel weights would be very useful.
            //  Maybe more useful than a callback on each?
            //   Callbacks would provide intermediate results immediately - optimization there.

            // Inline iteration - more code, more complex.
            //  Worth trying in some cases. Worth benchmarking.

            return eg_vfpx_info(vfp);

        }]

        

        



        // 

    ]





    const _examples = [
        ['read_4_pixels', () => {

            // read from pb_24bipp_color_square
            const pos = new Int16Array([10, 10]);

            const ta_4px = ta_math.read_4px_rect(pb_24bipp_color_square.ta, pb_24bipp_color_square.ta_colorspace, pos);
            console.log('ta_4px', ta_4px);

            // will return a ta - need to save this as output too.
            //  all text output from examples will be saved in a text file.

            return ta_4px;
            //return pb_dest;
        }],
        ['read_merged_fpx', () => {

            const fpos = new Float32Array([10.3333, 10.3333]);

            const rgb_merged = read_merged_fpx(pb_24bipp_color_square.ta, pb_24bipp_color_square.ta_colorspace, fpos);

            console.log('rgb_merged', rgb_merged);

        }],
        ['read_subpixels', () => {
            const fpos = new Float32Array([10.3333, 10.3333]);
            const fsize = new Float32Array([0.4, 0.4]);

            const res = [
                //['read_from_within_px', read_merged_subpixel(pastel.ta, pastel.ta_colorspace, fpos, fsize)]
            ];

            res.push(['read_from_within_px', read_merged_subpixel(pastel.ta, pastel.ta_colorspace, fpos, fsize)]);


            fpos[0] = 7.33;
            fpos[1] = 7.33;

            fsize[0] = 0.8;
            fsize[1] = 0.8;
            //const fsize = new Float32Array([0.8, 0.8]);
            res.push(['read_from_4px_block', read_merged_subpixel(pastel.ta, pastel.ta_colorspace, fpos, fsize)]);


            //fpos[0] = 7.33;
            fpos[1] = 7.05;

            console.log('fpos', fpos);

            //fsize[0] = 0.8;
            //fsize[1] = 0.8;
            //const fsize = new Float32Array([0.8, 0.8]);
            res.push(['subpixel_reads_from_2x1x_block', read_merged_subpixel(pastel.ta, pastel.ta_colorspace, fpos, fsize)]);

            fpos[0] = 7.05;
            fpos[1] = 7.33;
            res.push(['subpixel_reads_from_1x2x_block', read_merged_subpixel(pastel.ta, pastel.ta_colorspace, fpos, fsize)]);




            return res;

        }],
        


        // seems like we could do iterative subpixel resampling now / very soon.
        //  would be good to know the perf!!!
        //   then can bring more inline, through use of ta_math functions.
        //    would make the whole system more optimized, and can test against non-inlined versions.


        




        // Could try other subpixel function here.
        //  A few subpixel tests / reading attempts will be useful here.

        



        ['upscale_pastel', () => {

            // later will have pb.get_rescaled
            //  or pb.create.rescaled(size? factor? factor vector?)

            // loop through virtual float pixels within the source coord space.

            // source x y
            // dest x y
            const source = pastel;


            const source_ta = source.ta;

            const dest_size = new Int16Array([100, 100]);
            const dest = new Pixel_Buffer({
                size: dest_size,
                bits_per_pixel: 24
            })

            //console.log('dest.size', dest.size);

            //throw 'stop';

            const source_size = source.size;
            
            const dest_to_source_ratio = new Float32Array([source_size[0] / dest_size[0], source_size[1] / dest_size[1]]);

            //console.log('dest_to_source_ratio', dest_to_source_ratio);

            const source_subpixel_size = dest_to_source_ratio;



            //const size_ratio = new Float32Array([])

            //console.log('dest.size', dest.size);

            //console.log('source_subpixel_size', source_subpixel_size);

            // Now able to read subpixels (still need to 2 the 2 pixel crossovers!)
            //  This would work well with a loop based on virtual float xy coords.

            // Maybe could do more optimization with subpixel movement iteration.


            //let i_dest_x, i_dest_y;

            const ita_dest_xy = new Int32Array(2);

            // maybe tas for xy coords are easier to pass around anyway...

            // then work out the subpixel by ratio each time?
            //  would work by adding the subpixel dimensions too.

            //let f_source_x, f_source_y;

            const taf_source_xy = new Float32Array(2);
            // first pixel would still be 0

            // seems likely to work...

            //const taf_


            // Need to fix this algo...

            // direct write to the dest ta may work better (may work) and be faster.

            const ta_dest = dest.ta;

            let b_write = 0;

            for (ita_dest_xy[1] = 0; ita_dest_xy[1] < dest_size[1]; ita_dest_xy[1]++) {
                taf_source_xy[1] = ita_dest_xy[1] * dest_to_source_ratio[1];
                for (ita_dest_xy[0] = 0; ita_dest_xy[0] < dest_size[0]; ita_dest_xy[0]++) {
                    
                    taf_source_xy[0] = ita_dest_xy[0] * dest_to_source_ratio[0];
                    //console.log('');

                    // and the float subpixel source xy

                    //console.log('ita_dest_xy', ita_dest_xy);
                    //console.log('taf_source_xy', taf_source_xy);

                    // then get the subpixel value.

                    // read_merged_subpixel(pastel.ta, pastel.ta_colorspace, fpos, fsize)]);

                    // read_merged_subpixel may need more work / fixing / debugging.


                    // do more work on read_merged_subpixel.
                    //  test in more cases.
                    //  handle 2x1 and 1x2.


                    const subpixel_val = read_merged_subpixel(source_ta, source.ta_colorspace, taf_source_xy, source_subpixel_size);
                    //console.log('sp_val', sp_val);
                    //console.log('subpixel_val', subpixel_val);

                    ta_dest[b_write++] = subpixel_val[0];
                    ta_dest[b_write++] = subpixel_val[1];
                    ta_dest[b_write++] = subpixel_val[2];
                    // OK, problem found with set_pixel.
                    // set_pixel needs work?

                    // direct ta_math set_pixel?
                    
                    //dest.set_pixel(ita_dest_xy, subpixel_val);
                }

            }

            return dest;


            // Try resizing here...


            // opping the int px of the dest




            // iterate over the dest pixels.
            //  calculate the corresponding source subpixels.





            // then do a loop through the dest space.


            // pos to byte index translation using a colorspace ta?
            //  colorspace could be convenient to be passed around.


            // get the subpixel color....





            // so, could do integer iteration through the dest bounds.
            //  calculate the corresponding source pixel (but would need to use centering!)
            //  don't want a pixel of the same size.

            // not treating the pixel that gets read as size 1.
            //  size of pixel will be given (it's the dest_to_source_ratio)

            // Only need to do the reading and weighting when the subpixel overlaps pixel boundaries.
            //  Also handle vertical 2 pixel boundaries and horizontal 2 pixel boundaries.





            // read_subpixel_from_ixy

            



            




        }] /*,
        ['eg_2', () => {
            //return pb_dest;
        }],
        ['eg_3', () => {
            //return pb_dest;
        }] */
    ];

    const l_examples = examples.length;
    let eg_name, fn_example, res_eg;


    (async() => {
        const res_all_egs = {};

        for (let c = 0; c < l_examples; c++) {
            //console.log('examples[c]', examples[c]);
            if (examples[c] === false) {
                // means stop all running of examples.
                break;
            }

            [eg_name, fn_example] = examples[c];

            if (eg_name) {
                res_eg = fn_example();
                if (res_eg instanceof Pixel_Buffer) {
                    await fnlfs.ensure_directory_exists('./output/' + eg_mod_name + '/');
                    await gfx_server.save_pixel_buffer('./output/' + eg_mod_name + '/' + eg_name + '.png', res_eg, {
                        format: 'png'
                    });
                } else {
                    /*
                    console.log('NYI - need to save non-pb results from examples / tests.');
                    console.log('');
                    console.log(eg_name);
                    console.log('-'.repeat(eg_name.length));
                    console.log('');
                    console.log(res_eg);
                    */
                    res_all_egs[eg_name] = res_eg;
                }
            }
        }
        // console.log(JSON.stringify(myObject, null, 4));

        const json_res = JSON.stringify(res_all_egs, null, 4);
        console.log('res_all_egs', json_res);

        // Then processing for the examples...
        //  Want to compute the total weights for each of them.
        //   They should add up to 1.



        // Also, corners shouldn't have heigher 

        each(res_all_egs, (res, name) => {
            const {weights, pos, size} = res;

            console.log('[pos, size]', [pos, size]);
            console.log('name', name);
            //console.log('t_weight', t_weight);
            console.log('weights', weights);

            let t_weight = 0;
            each(weights, weight => t_weight += weight);

            console.log('t_weight', t_weight);

        })

    })();
});

if (require.main === module) {

    const obs = new PerformanceObserver((items) => {
        console.log(items.getEntries()[0].duration, 'ms');
        performance.clearMarks();
    });
    obs.observe({ entryTypes: ['measure'] });

    const gfx_server = require('jsgui3-gfx-server')
    const obs_run_examples = run_examples(gfx_server);

    obs_run_examples.on('next', e_example => {

    })

}