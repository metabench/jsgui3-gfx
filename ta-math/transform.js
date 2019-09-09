

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


// Make an inline version?
let each_source_dest_pixels_resized = (source_colorspace, dest_size, callback) => {
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

let each_source_dest_pixels_resized$inline = (source_colorspace, dest_size, callback) => {
    let [width, height, bypp, bypr, bipp, bipr] = source_colorspace;
    const source_bypr = bypr;
    const dest_colorspace = new Int32Array([dest_size[0], dest_size[1], bypp, bypp * dest_size[0], bipp, bipp * dest_size[0]]);


    const dest_to_source_ratio = new Float32Array([source_colorspace[0] / dest_size[0], source_colorspace[1] / dest_size[1]]);
    const source_fbounds = new Float32Array(4);
    const source_ibounds = new Int16Array(4);
    const source_i_any_coverage_size = new Int16Array(2);
    const source_total_coverage_ibounds = new Int16Array(4);
    let byi_read;



    let dest_byi = 0;
    const dest_xy = new Int16Array(2);
    [width, height, bypp, bypr, bipp, bipr] = dest_colorspace;
    for (dest_xy[1] = 0; dest_xy[1] < height; dest_xy[1]++) {
        for (dest_xy[0] = 0; dest_xy[0] < width; dest_xy[0]++) {


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

            byi_read = source_ibounds[0] * bypp + source_ibounds[1] * source_bypr;

            source_total_coverage_ibounds[0] = Math.ceil(source_fbounds[0]);
            source_total_coverage_ibounds[1] = Math.ceil(source_fbounds[1]);
            source_total_coverage_ibounds[2] = source_fbounds[2];
            source_total_coverage_ibounds[3] = source_fbounds[3];

            callback(dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, source_total_coverage_ibounds, byi_read);

            
            dest_byi += bypp;
        }
    }



}

each_source_dest_pixels_resized = each_source_dest_pixels_resized$inline;

// each_source_dest_pixels_resized_limited_further_info in C++, with callbacks (using function pointers I suppose on the C++ level)



let each_source_dest_pixels_resized_limited_further_info = (source_colorspace, dest_size, callback) => {
    // This actually calculates the weights.

    // dest_byi, source_i_any_coverage_size, edge_distances_proportions_of_total, corner_areas_proportions_of_total, byi_read

    //const [width, height, bypp, bypr, bipp, bipr] = source_colorspace;
    //const dest_colorspace = new Int32Array([dest_size[0], dest_size[1], bypp, bypp * dest_size[0], bipp, bipp * dest_size[0]]);
    const dest_to_source_ratio = new Float32Array([source_colorspace[0] / dest_size[0], source_colorspace[1] / dest_size[1]]);
    const source_edge_distances = new Float32Array(4);
    //const source_corner_areas = new Float32Array(4);
    const edge_distances_proportions_of_total = new Float32Array(4);
    const edge_segment_areas_proportion_of_total_area = new Float32Array(4);
    const corner_areas_proportions_of_total = new Float32Array(4);
    const fpx_area = dest_to_source_ratio[0] * dest_to_source_ratio[1];

    each_source_dest_pixels_resized(source_colorspace, dest_size, (dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, source_total_coverage_ibounds, byi_read) => {
        if (source_i_any_coverage_size[0] === 1 && source_i_any_coverage_size[1] === 1) {
            callback(dest_byi, source_i_any_coverage_size, undefined, undefined, byi_read);
        } else if (source_i_any_coverage_size[0] === 1 && source_i_any_coverage_size[1] === 2) {
            // 1x2 - won't need to provide as much info back.

            // only the top and bottom proportions matter here.
            source_edge_distances[1] = source_total_coverage_ibounds[1] - source_fbounds[1];
            source_edge_distances[3] = source_fbounds[3] - source_total_coverage_ibounds[3];

            if (source_edge_distances[1] === 0) source_edge_distances[1] = 1;
            if (source_edge_distances[3] === 0) source_edge_distances[3] = 1;

            edge_distances_proportions_of_total[1] = source_edge_distances[1] / dest_to_source_ratio[1];
            edge_distances_proportions_of_total[3] = source_edge_distances[3] / dest_to_source_ratio[1];

            // dest_byi, source_i_any_coverage_size, edge_distances_proportions_of_total, corner_areas_proportions_of_total, byi_read
            callback(dest_byi, source_i_any_coverage_size, edge_distances_proportions_of_total, undefined, byi_read);
            //callback(dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, source_total_coverage_ibounds, source_edge_distances, undefined, edge_distances_proportions_of_total, undefined, byi_read);
        } else if (source_i_any_coverage_size[0] === 2 && source_i_any_coverage_size[1] === 1) {
            source_edge_distances[0] = source_total_coverage_ibounds[0] - source_fbounds[0];
            source_edge_distances[2] = source_fbounds[2] - source_total_coverage_ibounds[2];

            if (source_edge_distances[0] === 0) source_edge_distances[0] = 1;
            if (source_edge_distances[2] === 0) source_edge_distances[2] = 1;

            edge_distances_proportions_of_total[0] = source_edge_distances[0] / dest_to_source_ratio[0];
            edge_distances_proportions_of_total[2] = source_edge_distances[2] / dest_to_source_ratio[0];

            callback(dest_byi, source_i_any_coverage_size, edge_distances_proportions_of_total, undefined, byi_read);
        } else if (source_i_any_coverage_size[0] === 2 && source_i_any_coverage_size[1] === 2) {
            source_edge_distances[0] = source_total_coverage_ibounds[0] - source_fbounds[0];
            source_edge_distances[1] = source_total_coverage_ibounds[1] - source_fbounds[1];
            source_edge_distances[2] = source_fbounds[2] - source_total_coverage_ibounds[2];
            source_edge_distances[3] = source_fbounds[3] - source_total_coverage_ibounds[3];

            if (source_edge_distances[0] === 0) source_edge_distances[0] = 1;
            if (source_edge_distances[1] === 0) source_edge_distances[1] = 1;
            if (source_edge_distances[2] === 0) source_edge_distances[2] = 1;
            if (source_edge_distances[3] === 0) source_edge_distances[3] = 1;

            corner_areas_proportions_of_total[0] = source_edge_distances[0] * source_edge_distances[1] / fpx_area;
            corner_areas_proportions_of_total[1] = source_edge_distances[2] * source_edge_distances[1] / fpx_area;
            corner_areas_proportions_of_total[2] = source_edge_distances[0] * source_edge_distances[3] / fpx_area;
            corner_areas_proportions_of_total[3] = source_edge_distances[2] * source_edge_distances[3] / fpx_area;

            callback(dest_byi, source_i_any_coverage_size, undefined, corner_areas_proportions_of_total, byi_read);
            //callback(dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, source_total_coverage_ibounds, source_edge_distances, undefined, undefined, corner_areas_proportions_of_total, byi_read);
        } else {

            source_edge_distances[0] = source_total_coverage_ibounds[0] - source_fbounds[0];
            source_edge_distances[1] = source_total_coverage_ibounds[1] - source_fbounds[1];
            source_edge_distances[2] = source_fbounds[2] - source_total_coverage_ibounds[2];
            source_edge_distances[3] = source_fbounds[3] - source_total_coverage_ibounds[3];

            if (source_edge_distances[0] === 0) source_edge_distances[0] = 1;
            if (source_edge_distances[1] === 0) source_edge_distances[1] = 1;
            if (source_edge_distances[2] === 0) source_edge_distances[2] = 1;
            if (source_edge_distances[3] === 0) source_edge_distances[3] = 1;

            edge_distances_proportions_of_total[0] = source_edge_distances[0] / fpx_area;
            edge_distances_proportions_of_total[1] = source_edge_distances[1] / fpx_area;
            edge_distances_proportions_of_total[2] = source_edge_distances[2] / fpx_area;
            edge_distances_proportions_of_total[3] = source_edge_distances[3] / fpx_area;

            edge_segment_areas_proportion_of_total_area[0] = source_edge_distances[0] * source_edge_distances[1] / fpx_area;
            edge_segment_areas_proportion_of_total_area[1] = source_edge_distances[2] * source_edge_distances[1] / fpx_area;
            edge_segment_areas_proportion_of_total_area[2] = source_edge_distances[0] * source_edge_distances[3] / fpx_area;
            edge_segment_areas_proportion_of_total_area[3] = source_edge_distances[2] * source_edge_distances[3] / fpx_area;

            callback(dest_byi, source_i_any_coverage_size, edge_distances_proportions_of_total, edge_segment_areas_proportion_of_total_area, byi_read);
        }
    });
}

// Then can make $inline version of above function.



let each_source_dest_pixels_resized_limited_further_info$inline = (source_colorspace, dest_size, callback) => {
    // This actually calculates the weights.

    // dest_byi, source_i_any_coverage_size, edge_distances_proportions_of_total, corner_areas_proportions_of_total, byi_read

    //const [width, height, bypp, bypr, bipp, bipr] = source_colorspace;
    //const dest_colorspace = new Int32Array([dest_size[0], dest_size[1], bypp, bypp * dest_size[0], bipp, bipp * dest_size[0]]);
    const dest_to_source_ratio = new Float32Array([source_colorspace[0] / dest_size[0], source_colorspace[1] / dest_size[1]]);
    const source_edge_distances = new Float32Array(4);
    //const source_corner_areas = new Float32Array(4);
    const edge_distances_proportions_of_total = new Float32Array(4);
    const edge_segment_areas_proportion_of_total_area = new Float32Array(4);
    const corner_areas_proportions_of_total = new Float32Array(4);
    const fpx_area = dest_to_source_ratio[0] * dest_to_source_ratio[1];


    //  ------------


    let [width, height, bypp, bypr, bipp, bipr] = source_colorspace;
    const source_bypr = bypr;
    const dest_colorspace = new Int32Array([dest_size[0], dest_size[1], bypp, bypp * dest_size[0], bipp, bipp * dest_size[0]]);


    //const dest_to_source_ratio = new Float32Array([source_colorspace[0] / dest_size[0], source_colorspace[1] / dest_size[1]]);
    const source_fbounds = new Float32Array(4);
    const source_ibounds = new Int16Array(4);
    const source_i_any_coverage_size = new Int16Array(2);
    const source_total_coverage_ibounds = new Int16Array(4);
    let byi_read;



    let dest_byi = 0;
    const dest_xy = new Int16Array(2);
    [width, height, bypp, bypr, bipp, bipr] = dest_colorspace;


    // Storing calculated values from the previous x?
    //  Precalculating an array of different variables for all x values.
    //  Then all y values are iterated so no benefit from precalc.
    //   edges etc

    // A lot more could be precalculated and then referenced.

    // Read a set of values from a larger ta for each x?
    //  Or refer to it.
    //  



    for (dest_xy[1] = 0; dest_xy[1] < height; dest_xy[1]++) {

        // Can optimize with calculations done just using y.


        source_fbounds[1] = dest_xy[1] * dest_to_source_ratio[1];
        source_fbounds[3] = source_fbounds[1] + dest_to_source_ratio[1];
        source_ibounds[1] = source_fbounds[1];
        source_ibounds[3] = Math.ceil(source_fbounds[3]);
        source_i_any_coverage_size[1] = source_ibounds[3] - source_ibounds[1];
        source_total_coverage_ibounds[1] = Math.ceil(source_fbounds[1]);
        source_total_coverage_ibounds[3] = source_fbounds[3];


        for (dest_xy[0] = 0; dest_xy[0] < width; dest_xy[0]++) {
            source_fbounds[0] = dest_xy[0] * dest_to_source_ratio[0];
            source_fbounds[2] = source_fbounds[0] + dest_to_source_ratio[0];
            

            // And the total coverage bounds.
            //  will be useful for some things...
            // Total coverage size as well

            //source_farea = (source_fbounds[2] - )


            // Scale down the pixel location...
            source_ibounds[0] = source_fbounds[0];
            
            source_ibounds[2] = Math.ceil(source_fbounds[2]);
            

            // then the any coverage area...

            // does it cover other pixels / proportions in those other pixels?

            // Still reasonably fast - yet slowing down from before....
            source_i_any_coverage_size[0] = source_ibounds[2] - source_ibounds[0];
            

            byi_read = source_ibounds[0] * bypp + source_ibounds[1] * source_bypr;

            source_total_coverage_ibounds[0] = Math.ceil(source_fbounds[0]);
            
            source_total_coverage_ibounds[2] = source_fbounds[2];

            //callback(dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, source_total_coverage_ibounds, byi_read);

            if (source_i_any_coverage_size[0] === 1 && source_i_any_coverage_size[1] === 1) {
                callback(dest_byi, source_i_any_coverage_size, undefined, undefined, byi_read);
            } else if (source_i_any_coverage_size[0] === 1 && source_i_any_coverage_size[1] === 2) {
                // 1x2 - won't need to provide as much info back.
    
                // only the top and bottom proportions matter here.
                source_edge_distances[1] = source_total_coverage_ibounds[1] - source_fbounds[1];
                source_edge_distances[3] = source_fbounds[3] - source_total_coverage_ibounds[3];
    
                if (source_edge_distances[1] === 0) source_edge_distances[1] = 1;
                if (source_edge_distances[3] === 0) source_edge_distances[3] = 1;
    
                edge_distances_proportions_of_total[1] = source_edge_distances[1] / dest_to_source_ratio[1];
                edge_distances_proportions_of_total[3] = source_edge_distances[3] / dest_to_source_ratio[1];
    
                // dest_byi, source_i_any_coverage_size, edge_distances_proportions_of_total, corner_areas_proportions_of_total, byi_read
                callback(dest_byi, source_i_any_coverage_size, edge_distances_proportions_of_total, undefined, byi_read);
                //callback(dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, source_total_coverage_ibounds, source_edge_distances, undefined, edge_distances_proportions_of_total, undefined, byi_read);
            } else if (source_i_any_coverage_size[0] === 2 && source_i_any_coverage_size[1] === 1) {
                source_edge_distances[0] = source_total_coverage_ibounds[0] - source_fbounds[0];
                source_edge_distances[2] = source_fbounds[2] - source_total_coverage_ibounds[2];
    
                if (source_edge_distances[0] === 0) source_edge_distances[0] = 1;
                if (source_edge_distances[2] === 0) source_edge_distances[2] = 1;
    
                edge_distances_proportions_of_total[0] = source_edge_distances[0] / dest_to_source_ratio[0];
                edge_distances_proportions_of_total[2] = source_edge_distances[2] / dest_to_source_ratio[0];
    
                callback(dest_byi, source_i_any_coverage_size, edge_distances_proportions_of_total, undefined, byi_read);
            } else if (source_i_any_coverage_size[0] === 2 && source_i_any_coverage_size[1] === 2) {
                source_edge_distances[0] = source_total_coverage_ibounds[0] - source_fbounds[0];
                source_edge_distances[1] = source_total_coverage_ibounds[1] - source_fbounds[1];
                source_edge_distances[2] = source_fbounds[2] - source_total_coverage_ibounds[2];
                source_edge_distances[3] = source_fbounds[3] - source_total_coverage_ibounds[3];
    
                if (source_edge_distances[0] === 0) source_edge_distances[0] = 1;
                if (source_edge_distances[1] === 0) source_edge_distances[1] = 1;
                if (source_edge_distances[2] === 0) source_edge_distances[2] = 1;
                if (source_edge_distances[3] === 0) source_edge_distances[3] = 1;
    
                corner_areas_proportions_of_total[0] = source_edge_distances[0] * source_edge_distances[1] / fpx_area;
                corner_areas_proportions_of_total[1] = source_edge_distances[2] * source_edge_distances[1] / fpx_area;
                corner_areas_proportions_of_total[2] = source_edge_distances[0] * source_edge_distances[3] / fpx_area;
                corner_areas_proportions_of_total[3] = source_edge_distances[2] * source_edge_distances[3] / fpx_area;
    
                callback(dest_byi, source_i_any_coverage_size, undefined, corner_areas_proportions_of_total, byi_read);
                //callback(dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, source_total_coverage_ibounds, source_edge_distances, undefined, undefined, corner_areas_proportions_of_total, byi_read);
            } else {
    
                source_edge_distances[0] = source_total_coverage_ibounds[0] - source_fbounds[0];
                source_edge_distances[1] = source_total_coverage_ibounds[1] - source_fbounds[1];
                source_edge_distances[2] = source_fbounds[2] - source_total_coverage_ibounds[2];
                source_edge_distances[3] = source_fbounds[3] - source_total_coverage_ibounds[3];
    
                if (source_edge_distances[0] === 0) source_edge_distances[0] = 1;
                if (source_edge_distances[1] === 0) source_edge_distances[1] = 1;
                if (source_edge_distances[2] === 0) source_edge_distances[2] = 1;
                if (source_edge_distances[3] === 0) source_edge_distances[3] = 1;
    
                edge_distances_proportions_of_total[0] = source_edge_distances[0] / fpx_area;
                edge_distances_proportions_of_total[1] = source_edge_distances[1] / fpx_area;
                edge_distances_proportions_of_total[2] = source_edge_distances[2] / fpx_area;
                edge_distances_proportions_of_total[3] = source_edge_distances[3] / fpx_area;
    
                edge_segment_areas_proportion_of_total_area[0] = source_edge_distances[0] * source_edge_distances[1] / fpx_area;
                edge_segment_areas_proportion_of_total_area[1] = source_edge_distances[2] * source_edge_distances[1] / fpx_area;
                edge_segment_areas_proportion_of_total_area[2] = source_edge_distances[0] * source_edge_distances[3] / fpx_area;
                edge_segment_areas_proportion_of_total_area[3] = source_edge_distances[2] * source_edge_distances[3] / fpx_area;
    
                callback(dest_byi, source_i_any_coverage_size, edge_distances_proportions_of_total, edge_segment_areas_proportion_of_total_area, byi_read);
            }
            dest_byi += bypp;
        }
    }


    /*


    each_source_dest_pixels_resized(source_colorspace, dest_size, (dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, source_total_coverage_ibounds, byi_read) => {
        if (source_i_any_coverage_size[0] === 1 && source_i_any_coverage_size[1] === 1) {
            callback(dest_byi, source_i_any_coverage_size, undefined, undefined, byi_read);
        } else if (source_i_any_coverage_size[0] === 1 && source_i_any_coverage_size[1] === 2) {
            // 1x2 - won't need to provide as much info back.

            // only the top and bottom proportions matter here.
            source_edge_distances[1] = source_total_coverage_ibounds[1] - source_fbounds[1];
            source_edge_distances[3] = source_fbounds[3] - source_total_coverage_ibounds[3];

            if (source_edge_distances[1] === 0) source_edge_distances[1] = 1;
            if (source_edge_distances[3] === 0) source_edge_distances[3] = 1;

            edge_distances_proportions_of_total[1] = source_edge_distances[1] / dest_to_source_ratio[1];
            edge_distances_proportions_of_total[3] = source_edge_distances[3] / dest_to_source_ratio[1];

            // dest_byi, source_i_any_coverage_size, edge_distances_proportions_of_total, corner_areas_proportions_of_total, byi_read
            callback(dest_byi, source_i_any_coverage_size, edge_distances_proportions_of_total, undefined, byi_read);
            //callback(dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, source_total_coverage_ibounds, source_edge_distances, undefined, edge_distances_proportions_of_total, undefined, byi_read);
        } else if (source_i_any_coverage_size[0] === 2 && source_i_any_coverage_size[1] === 1) {
            source_edge_distances[0] = source_total_coverage_ibounds[0] - source_fbounds[0];
            source_edge_distances[2] = source_fbounds[2] - source_total_coverage_ibounds[2];

            if (source_edge_distances[0] === 0) source_edge_distances[0] = 1;
            if (source_edge_distances[2] === 0) source_edge_distances[2] = 1;

            edge_distances_proportions_of_total[0] = source_edge_distances[0] / dest_to_source_ratio[0];
            edge_distances_proportions_of_total[2] = source_edge_distances[2] / dest_to_source_ratio[0];

            callback(dest_byi, source_i_any_coverage_size, edge_distances_proportions_of_total, undefined, byi_read);
        } else if (source_i_any_coverage_size[0] === 2 && source_i_any_coverage_size[1] === 2) {
            source_edge_distances[0] = source_total_coverage_ibounds[0] - source_fbounds[0];
            source_edge_distances[1] = source_total_coverage_ibounds[1] - source_fbounds[1];
            source_edge_distances[2] = source_fbounds[2] - source_total_coverage_ibounds[2];
            source_edge_distances[3] = source_fbounds[3] - source_total_coverage_ibounds[3];

            if (source_edge_distances[0] === 0) source_edge_distances[0] = 1;
            if (source_edge_distances[1] === 0) source_edge_distances[1] = 1;
            if (source_edge_distances[2] === 0) source_edge_distances[2] = 1;
            if (source_edge_distances[3] === 0) source_edge_distances[3] = 1;

            corner_areas_proportions_of_total[0] = source_edge_distances[0] * source_edge_distances[1] / fpx_area;
            corner_areas_proportions_of_total[1] = source_edge_distances[2] * source_edge_distances[1] / fpx_area;
            corner_areas_proportions_of_total[2] = source_edge_distances[0] * source_edge_distances[3] / fpx_area;
            corner_areas_proportions_of_total[3] = source_edge_distances[2] * source_edge_distances[3] / fpx_area;

            callback(dest_byi, source_i_any_coverage_size, undefined, corner_areas_proportions_of_total, byi_read);
            //callback(dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, source_total_coverage_ibounds, source_edge_distances, undefined, undefined, corner_areas_proportions_of_total, byi_read);
        } else {

            source_edge_distances[0] = source_total_coverage_ibounds[0] - source_fbounds[0];
            source_edge_distances[1] = source_total_coverage_ibounds[1] - source_fbounds[1];
            source_edge_distances[2] = source_fbounds[2] - source_total_coverage_ibounds[2];
            source_edge_distances[3] = source_fbounds[3] - source_total_coverage_ibounds[3];

            if (source_edge_distances[0] === 0) source_edge_distances[0] = 1;
            if (source_edge_distances[1] === 0) source_edge_distances[1] = 1;
            if (source_edge_distances[2] === 0) source_edge_distances[2] = 1;
            if (source_edge_distances[3] === 0) source_edge_distances[3] = 1;

            edge_distances_proportions_of_total[0] = source_edge_distances[0] / fpx_area;
            edge_distances_proportions_of_total[1] = source_edge_distances[1] / fpx_area;
            edge_distances_proportions_of_total[2] = source_edge_distances[2] / fpx_area;
            edge_distances_proportions_of_total[3] = source_edge_distances[3] / fpx_area;

            edge_segment_areas_proportion_of_total_area[0] = source_edge_distances[0] * source_edge_distances[1] / fpx_area;
            edge_segment_areas_proportion_of_total_area[1] = source_edge_distances[2] * source_edge_distances[1] / fpx_area;
            edge_segment_areas_proportion_of_total_area[2] = source_edge_distances[0] * source_edge_distances[3] / fpx_area;
            edge_segment_areas_proportion_of_total_area[3] = source_edge_distances[2] * source_edge_distances[3] / fpx_area;

            callback(dest_byi, source_i_any_coverage_size, edge_distances_proportions_of_total, edge_segment_areas_proportion_of_total_area, byi_read);
        }
    });

    */
}


//each_source_dest_pixels_resized_limited_further_info = each_source_dest_pixels_resized_limited_further_info$inline;
//  Seems like it varies performance depending on circumstances.

// Could try more inlining...?
//  Not keen on inlining that slows it down.
//   Seeing that in some cases now.



// A fully inline subpixels only version.

// A fully inline superpixels only version.
//  Enlarging would mean that at least 2x2 would always be covered.


// Definitely worth going for subpixel optimized version.
//  Up to 2x2. 

// When doing the loop for the row, know in advance what height the row is, and therefor the lower bounds of all pixels there.
//  Don't need to calculate this stuff for each pixel.










// Maybe its worth porting some of these low level functions to C++.
//  They could then be used in more complete C++ function implementations.
//  They could also speed up some resizing in JS, but consider JS<->C++ overhead.



// In JS, could make more optimized version for smaller pixels / subpixels.
//  An inline loops, max js efficiency version...?






// As an experiment could make a C++ version of this and expose it through NAPI.
//  Longer inline function probably won't have same performance hit in C++, as it's already compiled.


let copy_px_24bipp = (ta_source, byi_read, ta_dest, byi_write) => {
    ta_dest[byi_write] = ta_source[byi_read++];
    ta_dest[byi_write + 1] = ta_source[byi_read++];
    ta_dest[byi_write + 2] = ta_source[byi_read++];
}

// C++ overhead could make these functions too slow.

let read_1x2_weight_write_24bipp = (ta_source, byi_read, bypr, ta_dest, byi_write, weight_t, weight_b) => {
    let byi_read_below = byi_read + bypr;
    ta_dest[byi_write] = weight_t * ta_source[byi_read++] + weight_b * ta_source[byi_read_below++];
    ta_dest[byi_write + 1] = weight_t * ta_source[byi_read++] + weight_b * ta_source[byi_read_below++];
    ta_dest[byi_write + 2] = weight_t * ta_source[byi_read++] + weight_b * ta_source[byi_read_below++];
}

let read_2x1_weight_write_24bipp = (ta_source, byi_read, ta_dest, byi_write, weight_l, weight_r) => {
    let byi_read_right = byi_read + 3;
    ta_dest[byi_write] = weight_l * ta_source[byi_read++] + weight_r * ta_source[byi_read_right++];
    ta_dest[byi_write + 1] = weight_l * ta_source[byi_read++] + weight_r * ta_source[byi_read_right++];
    ta_dest[byi_write + 2] = weight_l * ta_source[byi_read++] + weight_r * ta_source[byi_read_right++];
}

let read_2x2_weight_write_24bipp = (ta_source, byi_read, bypr, ta_dest, byi_write, corner_weights_ltrb) => {

    let byi_read_right = byi_read + 3;
    let byi_read_below = byi_read + bypr;
    let byi_read_below_right = byi_read_below + 3;
    ta_dest[byi_write] = corner_weights_ltrb[0] * ta_source[byi_read++] + corner_weights_ltrb[1] * ta_source[byi_read_right++] + corner_weights_ltrb[2] * ta_source[byi_read_below++] + corner_weights_ltrb[3] * ta_source[byi_read_below_right++];
    ta_dest[byi_write + 1] = corner_weights_ltrb[0] * ta_source[byi_read++] + corner_weights_ltrb[1] * ta_source[byi_read_right++] + corner_weights_ltrb[2] * ta_source[byi_read_below++] + corner_weights_ltrb[3] * ta_source[byi_read_below_right++];
    ta_dest[byi_write + 2] = corner_weights_ltrb[0] * ta_source[byi_read++] + corner_weights_ltrb[1] * ta_source[byi_read_right++] + corner_weights_ltrb[2] * ta_source[byi_read_below++] + corner_weights_ltrb[3] * ta_source[byi_read_below_right++];
}


const read_3x2_weight_write_24bipp = (ta_source, bypr, byi_read, edge_distances_proportions_of_total, corner_weights_ltrb, ta_dest, dest_byi) => {
    const bypp = 3;

    let byi_tl = byi_read;

    // will get summed up by reading 6 separate pixels, merging them together.
    //  18 (6*3) value components.


    // 6 weights:
    // corner_weights_ltrb[0], edge_distances_proportions_of_total[1], corner_weights_ltrb[1]
    // corner_weights_ltrb[2], edge_distances_proportions_of_total[2], corner_weights_ltrb[3]

    // write a merged color component with 1 function?

    // get array of 6 different read byte indexes / inputs?

    // byi_tl, byi_tm, byi_tr
    // byi_bl, byi_bm, byi_br

    let byi_tm = byi_tl + bypp, byi_tr = byi_tm + bypp;
    let byi_bl = byi_tm + bypr, byi_bm = byi_bl + bypp, byi_br = byi_bm + bypp;

    // r component
    ta_dest[dest_byi] =     ta_source[byi_tl++] * corner_weights_ltrb[0] + ta_source[byi_tm++] * edge_distances_proportions_of_total[1] + ta_source[byi_tr++] * corner_weights_ltrb[1] +
                            ta_source[byi_bl++] * corner_weights_ltrb[2] + ta_source[byi_bm++] * edge_distances_proportions_of_total[3] + ta_source[byi_br++] * corner_weights_ltrb[3];

    ta_dest[dest_byi + 1] = ta_source[byi_tl++] * corner_weights_ltrb[0] + ta_source[byi_tm++] * edge_distances_proportions_of_total[1] + ta_source[byi_tr++] * corner_weights_ltrb[1] +
                            ta_source[byi_bl++] * corner_weights_ltrb[2] + ta_source[byi_bm++] * edge_distances_proportions_of_total[3] + ta_source[byi_br++] * corner_weights_ltrb[3];
                            
    ta_dest[dest_byi + 2] = ta_source[byi_tl++] * corner_weights_ltrb[0] + ta_source[byi_tm++] * edge_distances_proportions_of_total[1] + ta_source[byi_tr++] * corner_weights_ltrb[1] +
                            ta_source[byi_bl++] * corner_weights_ltrb[2] + ta_source[byi_bm++] * edge_distances_proportions_of_total[3] + ta_source[byi_br++] * corner_weights_ltrb[3];
                            

}


const read_2x3_weight_write_24bipp = (ta_source, bypr, byi_read, edge_distances_proportions_of_total, corner_weights_ltrb, ta_dest, dest_byi) => {
    const bypp = 3;

    let byi_tl = byi_read, byi_tr = byi_tl + bypp;
    let byi_ml = byi_tl + bypr, byi_mr = byi_ml + bypp;
    let byi_bl = byi_ml + bypr, byi_br = byi_bl + bypp;

    ta_dest[dest_byi] =     ta_source[byi_tl++] * corner_weights_ltrb[0] + ta_source[byi_tr++] * corner_weights_ltrb[1] +
                            ta_source[byi_ml++] * edge_distances_proportions_of_total[0] + ta_source[byi_mr++] * edge_distances_proportions_of_total[2] +
                            ta_source[byi_bl++] * corner_weights_ltrb[2] + ta_source[byi_br++] * corner_weights_ltrb[3]


    ta_dest[dest_byi + 1] = ta_source[byi_tl++] * corner_weights_ltrb[0] + ta_source[byi_tr++] * corner_weights_ltrb[1] +
                            ta_source[byi_ml++] * edge_distances_proportions_of_total[0] + ta_source[byi_mr++] * edge_distances_proportions_of_total[2] +
                            ta_source[byi_bl++] * corner_weights_ltrb[2] + ta_source[byi_br++] * corner_weights_ltrb[3]


    ta_dest[dest_byi + 2] = ta_source[byi_tl++] * corner_weights_ltrb[0] + ta_source[byi_tr++] * corner_weights_ltrb[1] +
                            ta_source[byi_ml++] * edge_distances_proportions_of_total[0] + ta_source[byi_mr++] * edge_distances_proportions_of_total[2] +
                            ta_source[byi_bl++] * corner_weights_ltrb[2] + ta_source[byi_br++] * corner_weights_ltrb[3]


}

// read_3x3_weight_write_24bipp
const read_3x3_weight_write_24bipp = (ta_source, bypr, byi_read, edge_weights, corner_weights_ltrb, fpx_area_recip, ta_dest, dest_byi) => {
    const bypp = 3;

    // middle weight - need to know the area, or 1/area.

    //console.log('read_3x3_weight_write_24bipp');
    //console.log('edge_distances_proportions_of_total, corner_weights_ltrb, fpx_area_recip', [edge_distances_proportions_of_total, corner_weights_ltrb, fpx_area_recip]);


    // fpx_area_recip


    let byi_tl = byi_read, byi_tm = byi_tl + bypp, byi_tr = byi_tm + bypp;
    let byi_ml = byi_tl + bypr, byi_mm = byi_ml + bypp, byi_mr = byi_mm + bypp;
    let byi_bl = byi_ml + bypr, byi_bm = byi_bl + bypp, byi_br = byi_bm + bypp;

    // Doing it component by component.

    ta_dest[dest_byi] =     ta_source[byi_tl++] * corner_weights_ltrb[0] + ta_source[byi_tm++] * edge_weights[1] + ta_source[byi_tr++] * corner_weights_ltrb[1] +
                            ta_source[byi_ml++] * edge_weights[0] + ta_source[byi_mm++] * fpx_area_recip + ta_source[byi_mr++] * edge_weights[2] +
                            ta_source[byi_bl++] * corner_weights_ltrb[2] + ta_source[byi_bm++] * edge_weights[3] + ta_source[byi_br++] * corner_weights_ltrb[3]


    ta_dest[dest_byi + 1] = ta_source[byi_tl++] * corner_weights_ltrb[0] + ta_source[byi_tm++] * edge_weights[1] + ta_source[byi_tr++] * corner_weights_ltrb[1] +
                            ta_source[byi_ml++] * edge_weights[0] + ta_source[byi_mm++] * fpx_area_recip + ta_source[byi_mr++] * edge_weights[2] +
                            ta_source[byi_bl++] * corner_weights_ltrb[2] + ta_source[byi_bm++] * edge_weights[3] + ta_source[byi_br++] * corner_weights_ltrb[3]


    ta_dest[dest_byi + 2] = ta_source[byi_tl++] * corner_weights_ltrb[0] + ta_source[byi_tm++] * edge_weights[1] + ta_source[byi_tr++] * corner_weights_ltrb[1] +
                            ta_source[byi_ml++] * edge_weights[0] + ta_source[byi_mm++] * fpx_area_recip + ta_source[byi_mr++] * edge_weights[2] +
                            ta_source[byi_bl++] * corner_weights_ltrb[2] + ta_source[byi_bm++] * edge_weights[3] + ta_source[byi_br++] * corner_weights_ltrb[3]


    //console.trace();
    //throw 'stop';
}


// 3x4 and 4x3 special cases?


// This may be a very good candidate for porting to C++.
//  C++ to wasm could work in both node and browser.

/*


    // edge_segment_areas_proportion_of_total_area

    // Looks like we need to fix handling for when a pixel is directly touching an edge.
    //  The edge distance in that case is 0.
    //   However, we need the full weight of that edge - or this merging algo to be bypassed.

    // May need to trace and stop the cases earlier when the fpos =equals= matches the ipos.
    //  And ensure total and partial coverage numbers are correct.

    // edge_distances_proportions_of_total
    // edge_distances_proportions_of_total_distance
    // edge_segment_areas_proportion_of_total_area

    // Need to fix this elsewhere in the resize stack.
    //  Should not try to make use of these values here - they are basically computed weights for smaller (1 or 2 px in a dimension?) pixels.
    //  Should have area-divided values provided here.





    //  this is not giving the proper weightings for usage in this grid.
    //   these distances are a proportion of total distance.
    //    we need coverage of that pixel proportional to the area of the fpx.

    // These are useful when it's a thin item and we don't use the corners measurements.



    // will do an xy loop.

    // could use local x and y variables.

    // Use an accumularor / 3 variables.

    //console.log('read_gt3x3_weight_write_24bipp source_i_any_coverage_size', source_i_any_coverage_size);
    //console.log('edge_distances_proportions_of_total, corner_weights_ltrb, fpx_area_recip', [edge_distances_proportions_of_total, corner_weights_ltrb, fpx_area_recip]);


    // Need to deal with row reading properly.

*/

// give it a scratch rgb accumulator?

let read_gt3x3_weight_write_24bipp = (ta_source, bypr, byi_read, source_i_any_coverage_size, edge_distances_proportions_of_total, corner_weights_ltrb, fpx_area_recip, ta_dest, dest_byi) => {
    const byi_tl = byi_read;
    //byi_read = byi_tl;
    let r = 0, g = 0, b = 0;
    // Separate loops...
    //  Worth having an inner row loop too.
    let x, y;
    const end_hmiddle = source_i_any_coverage_size[0] - 1, end_vmiddle = source_i_any_coverage_size[1] - 1;

    //const [w, h] = source_i_any_coverage_size;

    r += ta_source[byi_read++] * corner_weights_ltrb[0];
    g += ta_source[byi_read++] * corner_weights_ltrb[0];
    b += ta_source[byi_read++] * corner_weights_ltrb[0];

    // loop through the middle section of the top row.

    //x = 1;

    

    for (x = 1; x < end_hmiddle; x++) {
        r += ta_source[byi_read++] * edge_distances_proportions_of_total[1];
        g += ta_source[byi_read++] * edge_distances_proportions_of_total[1];
        b += ta_source[byi_read++] * edge_distances_proportions_of_total[1];
    }

    r += ta_source[byi_read++] * corner_weights_ltrb[1];
    g += ta_source[byi_read++] * corner_weights_ltrb[1];
    b += ta_source[byi_read++] * corner_weights_ltrb[1];

    // then loop through the v middle rows.

    for (y = 1; y < end_vmiddle; y++) {
        byi_read = byi_tl + y * bypr;

        r += ta_source[byi_read++] * edge_distances_proportions_of_total[0];
        g += ta_source[byi_read++] * edge_distances_proportions_of_total[0];
        b += ta_source[byi_read++] * edge_distances_proportions_of_total[0];

        for (x = 1; x < end_hmiddle; x++) {
            r += ta_source[byi_read++] * fpx_area_recip;
            g += ta_source[byi_read++] * fpx_area_recip;
            b += ta_source[byi_read++] * fpx_area_recip;
        }

        r += ta_source[byi_read++] * edge_distances_proportions_of_total[2];
        g += ta_source[byi_read++] * edge_distances_proportions_of_total[2];
        b += ta_source[byi_read++] * edge_distances_proportions_of_total[2];
    }


    byi_read = byi_tl + end_vmiddle * bypr;
    // then the bottom vrow

    r += ta_source[byi_read++] * corner_weights_ltrb[2];
    g += ta_source[byi_read++] * corner_weights_ltrb[2];
    b += ta_source[byi_read++] * corner_weights_ltrb[2];

    // loop through the middle section of the top row.
    //x = 1;

    //const end_hmiddle = w - 1, end_vmiddle = h - 1;

    for (x = 1; x < end_hmiddle; x++) {
        r += ta_source[byi_read++] * edge_distances_proportions_of_total[3];
        g += ta_source[byi_read++] * edge_distances_proportions_of_total[3];
        b += ta_source[byi_read++] * edge_distances_proportions_of_total[3];
    }

    r += ta_source[byi_read++] * corner_weights_ltrb[3];
    g += ta_source[byi_read++] * corner_weights_ltrb[3];
    b += ta_source[byi_read++] * corner_weights_ltrb[3];

    ta_dest[dest_byi] = Math.round(r);
    ta_dest[dest_byi + 1] = Math.round(g);
    ta_dest[dest_byi + 2] = Math.round(b);
}


// And the 2x3 function.
//  Made out of different pixels from the source.

// Will need 3x3 as well for various transformations.
//  Also, need to write general algorithm that reads and applies weights from a space.
//  Smaller read / merge (probably) work faster without a loop. Can investigate though...


// A version not just for subpixels...
//  Though I wrote this to be optimized for subpixels, with more work it can handle superpixel size.
//   Now I'm considering making a subpixel specific optimized version.
// 
// Also a version that will handle smaller upscales...
//  with the covered pixel size no larger than 3x3.

// A version with faster iteration would help - not using these layered callbacks.
//  That version would be easier to port to C++ too.



// the optimized loop for 1x1, 1x2, 2x1?
//  This would be for image shrinking.

// Then 2x2, 2x3, 3x2 for upscaling by not so large amounts.

// Working out the potential full coverage areas for any pixel.
//  [ceil(fw) + 1]. 1.1 width could have partial coverage over 3 pixels width.

// Want a boilerplate / bare bones inline loop of the positions.
//  Optimized versions depending on the size of the fpixel makes a lot of sense.
//   And using a loop system without callbacks that prob will be faster, and then will be easier to port to C++.

// Want to incorporate building wasm into the npm install / gyp? build.
//  gyp for wasm?


// The read and merge functions seem fairly optimal at the moment.
//  If they didn't declare their own variables, but took a scratch / working typed array?








// resize_ta_colorspace_24bipp$shrink
// resize_ta_colorspace_24bipp$enlarge
//  enlargement will only use subpixels size [<1, <1] so the coverage area will vary from 1x1 to 2x2.
//   a few cases can be handled efficiently.

//  Also, precalculate various values (perhaps arranged in a single ta) for variables that apply to any dest x value.
//   boolean values - extends right and extends down
//    or integer values of how many millipixels it extends...

// A mostly int arithmatic version would be of use when dealing with subpixels. Maybe in other cases too.

//  Int32 millipixels? impx - integer millipixels
//   Suitable for fine scales.

// 2x1 Precalculate l-r weights for x values for rows that don't extend below the pixel boundary.
// Precalculate l-r proportions for all x values.
//  (subpixels only so far)
//  It would work with any values that depend just on x.
//   Proportions of various parts / named measurements of horizontal edges can be procomputed for x values.

// Precompute some valued for how for down the int pixel they start?




// Later, could have 













resize_ta_colorspace_24bipp$subpixel = (ta_source, source_colorspace, dest_size, ta_dest) => {

    // Simplified this function.
    //  Seems like a small perf cost with the extra function calls used.
    //   Could optimize - not setting any weights when its 1x1, not doing the measurements.

    // C++ versions of the functions that run in here would be of use.
    //  May also be better to use functions for single pixel , 2x1 etc read-merge-write operations.
    //   Would make this function significantly shorter overall, and act more as a function dispatcher.




    //const [width, height, bypp, bypr, bipp, bipr] = source_colorspace;

    const source_bypp = source_colorspace[2];
    const source_bypr = source_colorspace[3];


    //const dest_colorspace = new Int32Array([dest_size[0], dest_size[1], bypp, bypp * dest_size[0], bipp, bipp * dest_size[0]]);
    const dest_to_source_ratio = new Float32Array([source_colorspace[0] / dest_size[0], source_colorspace[1] / dest_size[1]]);


    // Could work well precalculating y values, then looking them up.
    //  Meaning values that depend on y.

    // Then only when it's corners do we need to do a calculation with them.

    //  The proportions could even be in integer thousanths...?

    // So the total area of 1 px would be 1000000
    //  Floating point fractions seem easiest here.
    //  and always just calculate the other proportion as 1-a?







    


    // Calculations suh as 1-x may be faster than looking up from memory / array.

    const [f_px_w, f_px_h] = [source_colorspace[0] / dest_size[0], source_colorspace[1] / dest_size[1]];


    let f_source_x, f_source_r;
    let i_source_l, i_source_lr_crossover;

    let f_source_y, f_source_b;
    let i_source_t, i_source_tb_crossover;

    let i_dest_x, i_dest_y;


    // Typed arrays of the corresponding source(tl) positions / byte offsets?
    //  Storing / caching calculated byte offsets for x and y source reads could speed things up...?
    const ta_left_proportions = new Float32Array(dest_size[0]);
    const ta_top_proportions = new Float32Array(dest_size[1]);

    const ta_source_x = new Int16Array(dest_size[0]);
    const ta_source_y = new Int16Array(dest_size[1]);

    const ta_source_x_byi_component = new Int32Array(dest_size[0]);
    const ta_source_y_byi_component = new Int32Array(dest_size[1]);


    for (i_dest_x = 0; i_dest_x < dest_size[0]; i_dest_x++) {

        // Calc proportion l and proportion r.
        //  Maybe that's all we need.

        f_source_x = i_dest_x * f_px_w;
        f_source_r = f_source_x + f_px_w;
        i_source_l = Math.floor(f_source_x);
        i_source_lr_crossover = i_source_l + 1;

        ta_source_x[i_dest_x] = i_source_l;
        ta_source_x_byi_component[i_dest_x] = i_source_l * source_bypp;


        if (f_source_r < i_source_lr_crossover || i_source_l === f_source_x) {
            ta_left_proportions[i_dest_x] = 1;
        } else {
            //1 - (f_source_r - i_source_lr_crossover) / f_px_w;

            ta_left_proportions[i_dest_x] = (i_source_lr_crossover - f_source_x) / f_px_w;
        }
        //ta_left_proportions[x] = 
    }


    // we only really need to values to calculate all corner weightings as well.
    //  left edge proportion, top edge proportion. multiply the proportions, it should work...

    for (i_dest_y = 0; i_dest_y < dest_size[0]; i_dest_y++) {

        // Calc proportion l and proportion r.
        //  Maybe that's all we need.

        f_source_y = i_dest_y * f_px_h;
        f_source_b = f_source_y + f_px_h;
        i_source_t = Math.floor(f_source_y);
        i_source_tb_crossover = i_source_t + 1;

        ta_source_y[i_dest_y] = i_source_t;
        ta_source_y_byi_component[i_dest_y] = i_source_t * source_bypr;


        if (f_source_b < i_source_tb_crossover || i_source_t === f_source_y) {
            ta_top_proportions[i_dest_y] = 1;
        } else {
            //1 - (f_source_r - i_source_lr_crossover) / f_px_w;

            ta_top_proportions[i_dest_y] = (i_source_tb_crossover - f_source_y) / f_px_h;
        }
        //ta_left_proportions[x] = 
    }
    // then do the normal nested loop yx iteration
    //  will look up values to calculate...

    //  then will write inline directly?
    //   may be best to use copy-weight-write functions first.
    //    ones that take number params for weights, done simply?

    let l_prop, t_prop;

    // //const [width, height, bypp, bypr, bipp, bipr] = source_colorspace;

    // keep recalculating the source byte index?

    let byi_source;
    let byi_write = 0;

    for (i_dest_y = 0; i_dest_y < dest_size[0]; i_dest_y++) {
        t_prop = ta_top_proportions[i_dest_y];
        for (i_dest_x = 0; i_dest_x < dest_size[0]; i_dest_x++) {
            l_prop = ta_left_proportions[i_dest_x];
            byi_source = ta_source_x_byi_component[i_dest_x] + ta_source_y_byi_component[i_dest_y];
            if (l_prop === 1) {
                if (t_prop === 1) {
                    copy_px_24bipp(ta_source, byi_source, ta_dest, byi_write);
                } else {
                    
                }
            } else {
                if (t_prop === 1) {

                } else {
                    
                }
            }

            byi_write += 3;



        }
    }






    // having the top proportions precomputed won't be quite so useful.
    //  Will be able to do other weights precomputation on other iterations for larger source pixel sizes.


    // A few typed arrays for different stored values at each x?


    //  Or a single one, spaced...

    // Left and right weights at each x.

    // so just iterate the dest x values...


    //console.log('resize_ta_colorspace_24bipp$subpixel', resize_ta_colorspace_24bipp$subpixel);

    //console.trace();
    //throw 'stop';
}


// resize_ta_colorspace_24bipp$general


const resize_ta_colorspace_24bipp = (ta_source, source_colorspace, dest_size, opt_ta_dest) => {

    // Simplified this function.
    //  Seems like a small perf cost with the extra function calls used.
    //   Could optimize - not setting any weights when its 1x1, not doing the measurements.

    // C++ versions of the functions that run in here would be of use.
    //  May also be better to use functions for single pixel , 2x1 etc read-merge-write operations.
    //   Would make this function significantly shorter overall, and act more as a function dispatcher.




    


    //const dest_colorspace = new Int32Array([dest_size[0], dest_size[1], bypp, bypp * dest_size[0], bipp, bipp * dest_size[0]]);
    const dest_to_source_ratio = new Float32Array([source_colorspace[0] / dest_size[0], source_colorspace[1] / dest_size[1]]);
    // floating point location in source
    

    if (dest_to_source_ratio[0] < 1 && dest_to_source_ratio[1] < 1) {
        return resize_ta_colorspace_24bipp$subpixel(ta_source, source_colorspace, dest_size, opt_ta_dest);


    } else {
        const [width, height, bypp, bypr, bipp, bipr] = source_colorspace;
        const fpx_area_recip = 1 / (dest_to_source_ratio[0] * dest_to_source_ratio[1]);
        each_source_dest_pixels_resized_limited_further_info(source_colorspace, dest_size, (dest_byi, source_i_any_coverage_size, edge_distances_proportions_of_total, corner_areas_proportions_of_total, byi_read) => {

            if (source_i_any_coverage_size[0] === 1) {
                if (source_i_any_coverage_size[1] === 1) {
        
                    // copy_px_24bipp
                    /*
                    opt_ta_dest[dest_byi] = ta_source[byi_read++];
                    opt_ta_dest[dest_byi + 1] = ta_source[byi_read++];
                    opt_ta_dest[dest_byi + 2] = ta_source[byi_read++];
                    */
        
                    copy_px_24bipp(ta_source, byi_read, opt_ta_dest, dest_byi);
        
                } else if (source_i_any_coverage_size[1] === 2) {
        
                    // read_1x2_weight_write_24bipp
                    //  weight_l, weight_r params?
                    //   Could make sense here rather than giving the array.
                    //    Maybe splitting code will lead to better function optimization.
        
                    read_1x2_weight_write_24bipp(ta_source, byi_read, bypr, opt_ta_dest, dest_byi, edge_distances_proportions_of_total[1], edge_distances_proportions_of_total[3]);
        
        
                    /*
                    byi_read_below = byi_read + bypr;
                    opt_ta_dest[dest_byi] = edge_distances_proportions_of_total[1] * ta_source[byi_read++] + edge_distances_proportions_of_total[3] * ta_source[byi_read_below++];
                    opt_ta_dest[dest_byi + 1] = edge_distances_proportions_of_total[1] * ta_source[byi_read++] + edge_distances_proportions_of_total[3] * ta_source[byi_read_below++];
                    opt_ta_dest[dest_byi + 2] = edge_distances_proportions_of_total[1] * ta_source[byi_read++] + edge_distances_proportions_of_total[3] * ta_source[byi_read_below++];
                    */
                } else {
                    console.log('source_i_any_coverage_size', source_i_any_coverage_size);
                    console.trace();
                    throw 'NYI';
                }
            } else if (source_i_any_coverage_size[0] === 2) {
                if (source_i_any_coverage_size[1] === 1) {
        
                    
        
        
                    //byi_read_right = byi_read + bypp;
                    //opt_ta_dest[dest_byi] = edge_distances_proportions_of_total[0] * ta_source[byi_read++] + edge_distances_proportions_of_total[2] * ta_source[byi_read_right++];
                    //opt_ta_dest[dest_byi + 1] = edge_distances_proportions_of_total[0] * ta_source[byi_read++] + edge_distances_proportions_of_total[2] * ta_source[byi_read_right++];
                    //opt_ta_dest[dest_byi + 2] = edge_distances_proportions_of_total[0] * ta_source[byi_read++] + edge_distances_proportions_of_total[2] * ta_source[byi_read_right++];
        
                    
                    read_2x1_weight_write_24bipp(ta_source, byi_read, opt_ta_dest, dest_byi, edge_distances_proportions_of_total[0], edge_distances_proportions_of_total[2]);
        
                } else if (source_i_any_coverage_size[1] === 2) {
        
                    /*
        
                    byi_read_right = byi_read + bypp;
                    byi_read_below = byi_read + bypr;
                    byi_read_below_right = byi_read_below + bypp;
                    opt_ta_dest[dest_byi] = corner_areas_proportions_of_total[0] * ta_source[byi_read++] + corner_areas_proportions_of_total[1] * ta_source[byi_read_right++] + corner_areas_proportions_of_total[2] * ta_source[byi_read_below++] + corner_areas_proportions_of_total[3] * ta_source[byi_read_below_right++];
                    opt_ta_dest[dest_byi + 1] = corner_areas_proportions_of_total[0] * ta_source[byi_read++] + corner_areas_proportions_of_total[1] * ta_source[byi_read_right++] + corner_areas_proportions_of_total[2] * ta_source[byi_read_below++] + corner_areas_proportions_of_total[3] * ta_source[byi_read_below_right++];
                    opt_ta_dest[dest_byi + 2] = corner_areas_proportions_of_total[0] * ta_source[byi_read++] + corner_areas_proportions_of_total[1] * ta_source[byi_read_right++] + corner_areas_proportions_of_total[2] * ta_source[byi_read_below++] + corner_areas_proportions_of_total[3] * ta_source[byi_read_below_right++];
                    */
        
                    read_2x2_weight_write_24bipp(ta_source, byi_read, bypr, opt_ta_dest, dest_byi, corner_areas_proportions_of_total);
                
                } else {
        
                    // 2x3 case too...
        
                    read_2x3_weight_write_24bipp(ta_source, bypr, byi_read, edge_distances_proportions_of_total, corner_areas_proportions_of_total, opt_ta_dest, dest_byi);
        
                    //console.log('source_i_any_coverage_size', source_i_any_coverage_size);
                    //console.trace();
                    //throw 'NYI';
                }
            } else if (source_i_any_coverage_size[0] === 3) {
        
                if (source_i_any_coverage_size[1] === 1) {
        
                    console.log('source_i_any_coverage_size', source_i_any_coverage_size);
                    console.trace();
                    throw 'NYI';
                    
        
                } else if (source_i_any_coverage_size[1] === 2) {
                    //console.log('3x2 case');
        
                    // Seems like making a separate optimized function makes sense...
                    //  Maybe separate functions like this will even run faster? Could make / try some others too.
        
                    // read_weight_write_3x2_24bipp(ta_source, source_bypr, byi_read, edge_distances_proportions_of_total, corner_areas_proportions_of_total, dest_byi);
        
                    // Specific read-merge-write merge function of specific size.
                    read_3x2_weight_write_24bipp(ta_source, bypr, byi_read, edge_distances_proportions_of_total, corner_areas_proportions_of_total, opt_ta_dest, dest_byi);
        
                } else if (source_i_any_coverage_size[1] === 3) {
                    //console.log('3x3 case');
        
                    // Seems like making a separate optimized function makes sense...
                    //  Maybe separate functions like this will even run faster? Could make / try some others too.
        
        
                    //console.log('source_i_any_coverage_size', source_i_any_coverage_size);
                    //console.trace();
                    //throw 'NYI';
                    // read_weight_write_3x2_24bipp(ta_source, source_bypr, byi_read, edge_distances_proportions_of_total, corner_areas_proportions_of_total, dest_byi);
        
                    // Specific read-merge-write merge function of specific size.
                    read_3x3_weight_write_24bipp(ta_source, bypr, byi_read, edge_distances_proportions_of_total, corner_areas_proportions_of_total, fpx_area_recip, opt_ta_dest, dest_byi);
        
                } else {
                    // general case, not covered by the smaller and specific read-merge-write functions.
                    // source_i_any_coverage_size
                    // Could make more of a special case here.
                    //  This function now has a C++ accelerated version.
        
                    read_gt3x3_weight_write_24bipp(ta_source, bypr, byi_read, source_i_any_coverage_size, edge_distances_proportions_of_total, corner_areas_proportions_of_total, fpx_area_recip, opt_ta_dest, dest_byi);
        
                    //console.log('source_i_any_coverage_size', source_i_any_coverage_size);
                    //console.trace();
        
                    //console.log('source_i_any_coverage_size', source_i_any_coverage_size);
                    //console.trace();
                    //throw 'NYI';
        
                }
            } else {
                //console.log('source_i_any_coverage_size', source_i_any_coverage_size);
        
                // Would be good to be able to swap these functions for accelerated versions?
                //  Have the functions stored as local (let) variables instead...
        
                //  ta_math.override_fn('read_gt3x3_weight_write_24bipp', accelerated_read_gt3x3_weight_write_24bipp);
        
                read_gt3x3_weight_write_24bipp(ta_source, bypr, byi_read, source_i_any_coverage_size, edge_distances_proportions_of_total, corner_areas_proportions_of_total, fpx_area_recip, opt_ta_dest, dest_byi);
            }
        });


    }

    // Bounds calc could be more appropriate?
    //  or keep using + dest_to_source_ratio

    // the bounds are most important for the various calculations...

    //const source_fxy = new Float32Array(2);
    // Maybe source bounds will be more useful?
    //const source_ixy = new Int16Array(2);

    

    //let byi_read;
    //let byi_read_below, byi_read_right, byi_read_below_right;


    //let extension_above, extension_below, extension_left, extension_right;


    // reply consts with lets in this scope?
    //  or use typed arrays to hold the info?

    // also a crossover_x?

    //const source_px_area = dest_to_source_ratio[0] * dest_to_source_ratio[1];
    // potential crossover point - keep it updated?
    //const source_xy_crossover = new Int16Array(2);

    // dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, source_total_coverage_ibounds, source_edge_distances, source_corner_areas, edge_distances_proportions_of_total, corner_areas_proportions_of_total, byi_read

    // limited_further_info - won't return as much in the callback.

    // each_source_dest_pixels_resized_further_info(source_colorspace, dest_size, (dest_xy, dest_byi, source_fbounds, source_ibounds, source_i_any_coverage_size, source_total_coverage_ibounds, source_edge_distances, source_corner_areas, edge_distances_proportions_of_total, corner_areas_proportions_of_total, byi_read)


    // (dest_byi, source_i_any_coverage_size, edge_distances_proportions_of_total, corner_areas_proportions_of_total, byi_read)

    // Could call some other internal function to do the weighted read over area (give weight values, not indicidual weights, it reads, weights, and writes)


    // May need to fix each_source_dest_pixels_resized_limited_further_info if it doesnt properly process superpixels whose pos matches their fpos.
    //each_source_dest_pixels_resized_limited_further_info(source_colorspace, dest_size, read_fpx_weight_write_24bipp);

    // Only need to get as in-depth with weightings on larger fpx sizes.



    
}


let read_fpx_weight_write_24bipp = (dest_byi, source_i_any_coverage_size, edge_distances_proportions_of_total, corner_areas_proportions_of_total, byi_read) => {



    
    if (source_i_any_coverage_size[0] === 1) {
        if (source_i_any_coverage_size[1] === 1) {

            // copy_px_24bipp
            
            opt_ta_dest[dest_byi] = ta_source[byi_read++];
            opt_ta_dest[dest_byi + 1] = ta_source[byi_read++];
            opt_ta_dest[dest_byi + 2] = ta_source[byi_read++];
            

            //copy_px_24bipp(ta_source, byi_read, opt_ta_dest, dest_byi);

        } else if (source_i_any_coverage_size[1] === 2) {

            // read_1x2_weight_write_24bipp
            //  weight_l, weight_r params?
            //   Could make sense here rather than giving the array.
            //    Maybe splitting code will lead to better function optimization.

            //read_1x2_weight_write_24bipp(ta_source, byi_read, bypr, opt_ta_dest, dest_byi, edge_distances_proportions_of_total[1], edge_distances_proportions_of_total[3]);


            
            byi_read_below = byi_read + bypr;
            opt_ta_dest[dest_byi] = edge_distances_proportions_of_total[1] * ta_source[byi_read++] + edge_distances_proportions_of_total[3] * ta_source[byi_read_below++];
            opt_ta_dest[dest_byi + 1] = edge_distances_proportions_of_total[1] * ta_source[byi_read++] + edge_distances_proportions_of_total[3] * ta_source[byi_read_below++];
            opt_ta_dest[dest_byi + 2] = edge_distances_proportions_of_total[1] * ta_source[byi_read++] + edge_distances_proportions_of_total[3] * ta_source[byi_read_below++];
            
        } else {
            console.log('source_i_any_coverage_size', source_i_any_coverage_size);
            console.trace();
            throw 'NYI';
        }
    } else if (source_i_any_coverage_size[0] === 2) {
        if (source_i_any_coverage_size[1] === 1) {

            


            byi_read_right = byi_read + bypp;
            opt_ta_dest[dest_byi] = edge_distances_proportions_of_total[0] * ta_source[byi_read++] + edge_distances_proportions_of_total[2] * ta_source[byi_read_right++];
            opt_ta_dest[dest_byi + 1] = edge_distances_proportions_of_total[0] * ta_source[byi_read++] + edge_distances_proportions_of_total[2] * ta_source[byi_read_right++];
            opt_ta_dest[dest_byi + 2] = edge_distances_proportions_of_total[0] * ta_source[byi_read++] + edge_distances_proportions_of_total[2] * ta_source[byi_read_right++];

            
            //read_2x1_weight_write_24bipp(ta_source, byi_read, opt_ta_dest, dest_byi, edge_distances_proportions_of_total[0], edge_distances_proportions_of_total[2]);

        } else if (source_i_any_coverage_size[1] === 2) {

            

            byi_read_right = byi_read + bypp;
            byi_read_below = byi_read + bypr;
            byi_read_below_right = byi_read_below + bypp;
            opt_ta_dest[dest_byi] = corner_areas_proportions_of_total[0] * ta_source[byi_read++] + corner_areas_proportions_of_total[1] * ta_source[byi_read_right++] + corner_areas_proportions_of_total[2] * ta_source[byi_read_below++] + corner_areas_proportions_of_total[3] * ta_source[byi_read_below_right++];
            opt_ta_dest[dest_byi + 1] = corner_areas_proportions_of_total[0] * ta_source[byi_read++] + corner_areas_proportions_of_total[1] * ta_source[byi_read_right++] + corner_areas_proportions_of_total[2] * ta_source[byi_read_below++] + corner_areas_proportions_of_total[3] * ta_source[byi_read_below_right++];
            opt_ta_dest[dest_byi + 2] = corner_areas_proportions_of_total[0] * ta_source[byi_read++] + corner_areas_proportions_of_total[1] * ta_source[byi_read_right++] + corner_areas_proportions_of_total[2] * ta_source[byi_read_below++] + corner_areas_proportions_of_total[3] * ta_source[byi_read_below_right++];
            

            //console.log('corner_areas_proportions_of_total', corner_areas_proportions_of_total);

            //read_2x2_weight_write_24bipp(ta_source, byi_read, bypr, opt_ta_dest, dest_byi, corner_areas_proportions_of_total);
        
        } else {

            // 2x3 case too...

            read_2x3_weight_write_24bipp(ta_source, bypr, byi_read, edge_distances_proportions_of_total, corner_areas_proportions_of_total, opt_ta_dest, dest_byi);

            //console.log('source_i_any_coverage_size', source_i_any_coverage_size);
            //console.trace();
            //throw 'NYI';
        }
    } else if (source_i_any_coverage_size[0] === 3) {

        if (source_i_any_coverage_size[1] === 1) {

            console.log('source_i_any_coverage_size', source_i_any_coverage_size);
            console.trace();
            throw 'NYI';
            

        } else if (source_i_any_coverage_size[1] === 2) {
            //console.log('3x2 case');

            // Seems like making a separate optimized function makes sense...
            //  Maybe separate functions like this will even run faster? Could make / try some others too.

            // read_weight_write_3x2_24bipp(ta_source, source_bypr, byi_read, edge_distances_proportions_of_total, corner_areas_proportions_of_total, dest_byi);

            // Specific read-merge-write merge function of specific size.
            read_3x2_weight_write_24bipp(ta_source, bypr, byi_read, edge_distances_proportions_of_total, corner_areas_proportions_of_total, opt_ta_dest, dest_byi);

        } else if (source_i_any_coverage_size[1] === 3) {
            //console.log('3x3 case');

            // Seems like making a separate optimized function makes sense...
            //  Maybe separate functions like this will even run faster? Could make / try some others too.


            //console.log('source_i_any_coverage_size', source_i_any_coverage_size);
            //console.trace();
            //throw 'NYI';
            // read_weight_write_3x2_24bipp(ta_source, source_bypr, byi_read, edge_distances_proportions_of_total, corner_areas_proportions_of_total, dest_byi);

            // Specific read-merge-write merge function of specific size.
            read_3x3_weight_write_24bipp(ta_source, bypr, byi_read, edge_distances_proportions_of_total, corner_areas_proportions_of_total, fpx_area_recip, opt_ta_dest, dest_byi);

        } else {

            // general case, not covered by the smaller and specific read-merge-write functions.

            // source_i_any_coverage_size


            // Could make more of a special case here.
            //  This function now has a C++ accelerated version.


            read_gt3x3_weight_write_24bipp(ta_source, bypr, byi_read, source_i_any_coverage_size, edge_distances_proportions_of_total, corner_areas_proportions_of_total, fpx_area_recip, opt_ta_dest, dest_byi);

            //console.log('source_i_any_coverage_size', source_i_any_coverage_size);
            //console.trace();

            //console.log('source_i_any_coverage_size', source_i_any_coverage_size);
            //console.trace();
            //throw 'NYI';

        }
    } else {
        //console.log('source_i_any_coverage_size', source_i_any_coverage_size);

        // Would be good to be able to swap these functions for accelerated versions?
        //  Have the functions stored as local (let) variables instead...

        //  ta_math.override_fn('read_gt3x3_weight_write_24bipp', accelerated_read_gt3x3_weight_write_24bipp);

        read_gt3x3_weight_write_24bipp(ta_source, bypr, byi_read, source_i_any_coverage_size, edge_distances_proportions_of_total, corner_areas_proportions_of_total, fpx_area_recip, opt_ta_dest, dest_byi);
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

const override = (fn_name, fn) => {

    if (fn_name === 'read_gt3x3_weight_write_24bipp') {
        read_gt3x3_weight_write_24bipp = fn;
    }

}


module.exports = {
    resize_ta_colorspace: resize_ta_colorspace,
    resize_ta_colorspace_24bipp: resize_ta_colorspace_24bipp,
    override: override
}


