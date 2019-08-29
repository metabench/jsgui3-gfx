



const {
    prom_or_cb
} = require('fnl');

// could stream it.
const fnlfs = require('fnlfs');
const {
    file_type
} = fnlfs;

const {
    extname
} = require('path');

const { PerformanceObserver, performance } = require('perf_hooks');

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].duration, 'ms');
  performance.clearMarks();
});
obs.observe({ entryTypes: ['measure'] });

// options
// max size
// reorient

const formats = require('jsgui3-gfx-formats');
const {
    jpeg
} = formats;

console.log('pre load gfx_server');
const gfx_server = require('jsgui3-gfx-server');
console.log('post load gfx_server');

// Copy the data over to and from a standard pixel buffer (non-server version)?

const gfx = require('../gfx');

const {Pixel_Buffer} = gfx;

const Server_Pixel_Buffer = gfx_server.Pixel_Buffer;


// seems to be working / fixed now :)
const copy_from_server_pb = (server_pb) => {
    const res_pb = new Pixel_Buffer({
        size: server_pb.size,
        bits_per_pixel: server_pb.bits_per_pixel
    });
    //res_pb.buffer = res_pb.ta = server_pb.ta;
    res_pb.ta.set(server_pb.ta);
    return res_pb;
}

const copy_to_server_pb = (standard_pb) => {
    const res_pb = new Server_Pixel_Buffer({
        size: standard_pb.size,
        bits_per_pixel: standard_pb.bits_per_pixel
    });
    // Setting the buffer... does not work...?
    res_pb.ta.set(standard_pb.ta);
    //res_pb.buffer = res_pb.ta = standard_pb.ta;
    return res_pb;
}

const old = () => {
    const eg_pb_window_to_pb = async() => {

        const pb_source = new Pixel_Buffer({
            size: [256, 256],
            bits_per_pixel: 24
        });

        // Could create an initial image here.
        //  varying red and green, same amount of blue?

        


        // then iterate over the pixel positions...
        //  how fast can this type of each pixel function be?
        //   probably worth making optimized versions depending on the number of bpp.

        // updating the position in a typed array that's given as a param?
        //  updating a color typed array (not sending it as a param / creating a new one?)

        // worth having some different means of doing these basic operations, some could be more convenient, some more optimized.
        //  also worth being able to copy and paste some of their code to use inline.

        // pb.each_px_pos
        //  .each_px
        //    includes the pos of each px?

        // .each_px(ta_pos, ta_color)

















        const res = 'res eg_pb_window_to_pb';
        console.log('res eg_pb_window_to_pb', res);


        return res;
    }



    if (require.main === module) {
        (async() => {
            // Set file paths here...?
            let res = await eg_pb_window_to_pb();
            console.log('main: res eg_pb_window_to_pb', res);
        })();
    }



    // Should probably write some smaller example to do with 1bpp masks and various operations with much smaller pixel buffers.



}



const eg_win_to = async() => {
    console.log('Generating 255x255 example');
    //const spb = await Server_Pixel_Buffer.load('../source_images/Erte Ale Volcano.jpg');
    // Load JPEG as 24 bipp by default?


    //const pb = copy_from_server_pb(spb);

    //pb.bipp = 24;
    //  cool inner coding should make that work.
    //   change_bits_per_pixel
    //    and likely a variety of change_from_1bipp_to_32bipp type functions.
    //     could be a bunch of them with fast and specific internal implementations.
    //     I think this style will make good use of the JS compiler's own polymorphism and monomorphism.







    // then run each_px
    //console.log('pb.bits_per_pixel', pb.bits_per_pixel);
    //pb.bits_per_pixel = 24;
    //console.log('pb.bits_per_pixel', pb.bits_per_pixel);


    // Will generate the image colors using the each pixel system...

    const pb_source = new Pixel_Buffer({
        size: [256, 256],
        bits_per_pixel: 24
    });



    const ta_pos = new Int16Array(2);
    const ta_px_value = new Uint8ClampedArray(3);


    // make general int info array support +-? Better able to hold (memory) offsets that way.
    const ta_info = new Uint32Array(4);

    // And that should be enough to do a fast iteration over the whole image in terms of data allocation.
    //  Could do multiple iterations without needing to reallocate, by reusing these structures.

    // Let's see about using this to get really high perf in both JavaScript and C++.


    // Well this works quickly too :).
    //  Lets see about convolutions....


    const setup_colors = () => {
        performance.mark('A');
        // Seems quite fast so far...
        //  Copying values over though, to look at them...

        // Yes it's fast with the bit copying too.
        //  But what about modification?
        //   can we call a function that sends the update over?
        //    eg invert it?
        //     fast enough?
        //      an update function could work quickly.
        //       not sure. seems that calling functions without giving params helps it to be fast.

        // Working to make each_px as efficient as possible.
        //  If its really fast it could work as a good platform for other really fast functions.

        // Could try to get the average color...?
        //const avg = new Float64Array(3);

        // Yes, this is really fast now. Lets see about convolution windows and moving them.

        console.log('pb_source.size', pb_source.size);
        console.log('pb_source.bipp', pb_source.bipp);
        console.log('pb_source.bypp', pb_source.bypp);

        //throw 'stop';




        pb_source.each_px(ta_pos, ta_px_value, ta_info, (update) => {
            // Here we use direct reference to the various typed arrays.

            //console.log('ta_pos', ta_pos);

            // ta_info: w, h, idx_px, bipp

            // Can we do some color conversion?
            //  Edit in place?
            //   Could use this to make a mask / 1bipp image of selected pixels.
            //    Have a pixel selection function.

            // Explore ways of fast access.
            //  Queued operations? Take place after the convolution?
            //   Maybe would take more space.... Takes place after the convolution has completely passed that space as input?

            ta_px_value[0] = ta_pos[0];
            ta_px_value[1] = ta_pos[1];
            ta_px_value[2] = 255;
            update();
        });

        

        //avg[0] = avg[0] / px_count;
        //avg[1] = avg[1] / px_count;
        //avg[2] = avg[2] / px_count;

        performance.mark('B');
        //console.log('avg', avg);
        //console.log('px_count', px_count);
        performance.measure('A to B', 'A', 'B');
        //console.log('pb_source.ta', pb_source.ta);



        // Blur wont be so good as a convolution here.
        //  Could make different patterns to start with....
        //   Or try with different source images?

        // Can see the values proceeding OK with this image at least.
        //  Thats whats needed as a test / example.

        // will automatically use the same color depth as the source.

        // centre_pos...? center_pos?
        //  so that the position given is in the central position.
        //   useful for convolution windows, and moving them around.

        // pos: ['center', [0, 0]]???

        // a center_pos / pos_center property would make a lot of sense.
        //  also be able to change this pos? set it easily, have the window update its data from the relevant typed array???




        // nice hack: set the pos_center to an existing pos typed array.
        //  then the values get looped over.
        //   call the update_from_source function....
        //  This is likely to be able to run very quickly. Will be nice to use it in-browser / get some stats.


        ta_pos[0] = 0;
        ta_pos[1] = 0;



        // Special window_to handling in the constructor.
        //  will set the bits_per_pixel value.

        // Need to change / improve Pixel_Buffer to handle window_to

        // pos_center would make a lot of sense.
        //  maybe hold off from implementing it?

        // half-size properties?
        //  i_half_size properties?

        // storing half the size as an integer?
        //  or really the offset from the centre... expansion from centre size in that dimension.

        // offsets of the corners / edges from the center.
        //  Need to be very precise with this type of positional maths.

        // pos_center definitly seems like it would be of use.
        //  especially with it being a typed_array.
        //   do want to keep the pos property up-to-date
        //    working off edge bounds offsets from the size...

        // would be worth having them calculated / stored / available in a ta variable.

        // Dealing with precise pixel maths.

        // Define how the centering works for even image sizes? Assume a default?
        //  Binding position???
        //   And other types of windows?
        
        // binding_pos [2,2]???

        // central pos certainly makes sense.
        //  updating the window, using the central pos and offsets from it, would work very well.
        //  however, may be most efficient to move a bounds (4 values) that have already been set

        // by updating each of the bounds with the movements (window_bounds ta ui16) we can most reasonably get and set the Pixel_Buffer's definitive position.
        //  then carry out source-to-window updates using these bounds.

        // May be worth making specific Convolution data structures?
        //  Worth getting on with making the convolution window and loop work quickly, soon, and with the right syntax.





        // Centered on 0,0.

        // Should make the pos_center property, make it work well.
        //  Setting its center pixel sets its position so that that central specified position is central within the pb.
        //   (should be useful)


        // So need to upgrade Pixel_Buffer to fully support pos_center


        const pb_window = new Pixel_Buffer({
            size: [5, 5],
            window_to: pb_source,  // (source??)
            pos_center: ta_pos
        });

        // sort out the pos_center getter.

        // its the pos center within the coordinate space of the source.
        console.log('pb_window.pos_center', pb_window.pos_center);

        // Then can update / move / translate the whole the window.
        //  Adjusting its position / pos property.

        // maybe worth perf testing this single copy operation...

        performance.mark('A');
        //const [r, g, b] = pb.split_rgb_channels;
        


        // Should automatically do that when it starts?
        pb_window.copy_from_source();
        // 0.53 ms, not bad.
        //  maybe faster with next ops too, as this time it initialised values???
        //   see about fastest optimizations.

        performance.mark('B');
        performance.measure('A to B', 'A', 'B');

        // maybe updating and moving the pos property with .move(2dvector) is the best way?
        //  or setting the pos would be fine....

        // moving the pos_center does make most sense in some ways though.





        //  use a scratch pos / movement vector.  2d_vector type???
        // then can pb_window.move(new Int16Array(1, 0));





        // Just moving the window (call update function?) should result in its internal data being updated to match the data it is viewing.

        // moving its pos to cover a different space in the window_to source will cause / enable a fast data update.
        //  copy algorithm will run quckly.
        //   also need to be able to copy back to the source.

        //  direct access to the source / its typed array...
        //   would need more code to map between pixels in the window and pixels in the original ta.








        // pos_center should set the pos value...
        //  the pos value of a target will apply to a view of the source...?


        // will work with some lower level and medium level functions for the moment to do this.
        //  could try pre-implementations here....



        // ending at 3, 3 means includes px 2, 2 up to the imaginary edge of 3, 3. By convention.

        // Offsets from central pixel....? More engineering!

        // Yes, this part needs some more engineering so that the copying and bounds functions can work smoothly and easily.


        // pos_center could become a read-and-write facade.
        //  getter, setter, all refers to other props / fields.




        const strange_setup = () => {
            const eo = pb_window.edge_offsets = new Int16Array([-2, -2, 3, 3]);


            // Probably don't need to set bounds like these.
            //  Can set 'pos', and that will be negative.
            //   Meaning when it's a window to another pb, some of the source pb will be out of bounds, therefore not copied over.



            const window_bounds = pb_window.window_bounds = new Int16Array([ta_pos[0] + eo[0], ta_pos[1] + eo[1], ta_pos[0] + eo[2], ta_pos[1] + eo[3]]);

            console.log('window_bounds', window_bounds);
        }

        //pb_source.copy_rect_by_bounds_to(window_bounds, pb_window);

        // Set the position of the pb_window.
        //  then that position gets used as a position to read from the pb it's using as a source.

        // Think we will have rapid and safe copy soon.
        //  More functions for bounds calculations?

        // Think pos_center property needs some work.








        



        // then use the window bounds to read from the original?
        //  copy from the source into the window?

        // low level function that's worth having make optimized usage of both structures.

        //pb_window.copy_rect_by_bounds_to_pb(window_bounds, pb_window);

        // supply the funtion with a working position typed array for its own iteration?
        //  possibly other typed arrays?

        // The Pixel_Buffer could have more in terms of its own conventions / getters / facades to efficiently access its own typed arrays.
        //  For positions, such as in iterations.

        // Scratch tas in order to reuse them and save memory. Save time in allocating them as well.
        //  


        // ta_pos_scratch and give it to the function?
        //  would make sense to avoid having it need to make any further JS objects.

        // or could use some other ta, the center pos ta as the iterator?
        //  can't do that though.

        // a scratch ta provided by the pb_source would make sense for operations that involve iteration.
        //  could make it a read-only property. would make sense.
        //   then copying functions would be more optimized.


        // pos of a pb makes sense when it's referring to space in another pb.
        //  Can adjust that pos to adjust a view window.
        //   Want some copy functions to work very quickly when doing this kind of operation.

        // Lets get copying a rectangular region working well....



        







        

        // pb_window.copy_rect_to_pb_by_bounds(pb_target, source_bounds)
        //  and run a more optimized mode when the target is of the same size as the bounds / the image section being copied?

        // .copy_rect_by_bounds_to (assuming another pb)
        //  then most likely will have optimized / specific internal versions for different bpps.










        // bounds read-only property?
        //  facade property?

        // facade properties could be of great use.



        // copy from source...?
        //  can an implementation of the source's copy to?

        // source.copy_rect_by_bounds_to()

        // copy from the source.




        // Then should read a default pixel value for undefined / out of bounds.
        //  Going to need to put bounds checking in some functions / make bounds checked versions of them.

        // loop and update does make sense.
        //  running convolutions on localised data could work best too.
        //  possibly with more matching data structures.


        // Could try each_px again.
        //  Give it the same typed array that pb_window uses as its center.
        //   move the bounds around.
        //    set the ta_bounds of Pixel_Buffer. then move these...
        //     set them each time according to edge distance from center...?
        //      or use a defined centre_relative_bounds ta?
        //       [-2, -2, 2, 2] edge offsets from center are defined that way.
        //       will need to efficiently loop through the source image pixel space.

        // edge_offsets_from_center = new Int16Array([-2, -2, 2, 2]);
        
        // will of course use different (internal) functions for different bipps.
        //  then will calculate the bounds values.

        // do want to be able to hold negative positions, in fact
        //  if only to say they are out of bounds once checked.




    







        console.log('pb_window.ta', pb_window.ta);
        //console.log('pb_window', pb_window);
        //console.log('pb_window.bounds', pb_window.bounds);


        // Pos should be negative if we say its centered at 0, 0.
        //  Start of a convolution.

        // Minimum copy of data will lead to the best perf.

        // Can use this pos (-2, -2) as well as the size be determine the copy size when we use another pb as the source.




        
        console.log('pb_window.pos', pb_window.pos);
        console.log('pb_window.pos_center', pb_window.pos_center);
        // pos refers to its position within another space.

        const move_vector = pb_window.ta_move_vector;
        console.log('move_vector', move_vector);
        move_vector[0] = 1;
        move_vector[1] = 0;

        console.log('move_vector', move_vector);

        performance.mark('C');
        //const [r, g, b] = pb.split_rgb_channels;
        

        /*



        pb_window.move(move_vector);
        pb_window.move(move_vector);
        pb_window.move(move_vector);
        pb_window.move(move_vector);
        pb_window.move(move_vector);

        move_vector[0] = 0;
        move_vector[1] = 1;

        pb_window.move(move_vector);
        pb_window.move(move_vector);
        pb_window.move(move_vector);
        */

        // well yes, this is still nicely fast.
        //  likely to be able to speed it up some more, just in js.

        // worth writing the convolution code.
        //  better to test it on another image though.


        // while(pb_window.move_next_pixel) {...}  move_next_pixel will return undefined when there isnt a next pixel within the target bounds.

        // pb_window.move_next_pixel

        let pos;

        // moves to the next px in the source!!!
        pos = pb_window.move_next_px();

        //(() => {
            while (pos !== false) {
                //console.log('pos', pos);
    
                pos = pb_window.move_next_px();
            }
        //})();

        

        // Not sure the point of a blur conv on an already smooth image.
        //  Though pixel averaging (very simple conv) would show the border around the image.





        // quite fast at 10ms!
        //  good going so far!



        


        // Would be worth trying a convolution function.
        //  Moving this pixel window around.
        //  Want a convolution matrix as well.
        //   Same size grids, will have very fast ta convolve.

        // Would be worth seeing how long it takes to move the copy window over every pixel.
        //  Then can use that copy window as a convolution source window / pb.









        //pb_window.copy_from_source();
        // 0.53 ms, not bad.
        //  maybe faster with next ops too, as this time it initialised values???
        //   see about fastest optimizations.

        performance.mark('D');
        performance.measure('C to D', 'C', 'D');

        // 0.3ms, nicely fast here.
        //  but need to consider it 1000s + of times.
        //   maybe not so fast.
        console.log('pb_window.pos_center', pb_window.pos_center);

        console.log('pb_window.ta', pb_window.ta);

        console.log('pb_window.pos', pb_window.pos);
        console.log('pb_window.pos_center', pb_window.pos_center);


        // Maybe trying a convolution on Erte Ale would be best?
        //  Could try a pixel averaging shrinkage method. Would shrink by int_n times.

        // Convolving a shrunken version of Erte Ale would be best.
        
        // Though want to get into image resizing as well.
        







        // this.move_next_px
        //  would deal with rows. would return the movement vector used.


        //console.log('pb_window.size', pb_window.size);


        // then run a function to update / copy from source.



        //console.trace();

        //throw 'stop';
        // Need more API to enable the central position.
        //  Would be very useful for convolutions.
        //  Seems like we will have the lower level image processing tasks very nicely done, high speed, and useful for higher level tasks.
        //   Then even faster still using possible available acceleration (GPU / SIMD / C++).










        // then can set the pos_center to a pos?


        // and it constructs the necessary typed arrays?
        //  having a pos_center typed array could make sense.
        //  or it's in a ta_info?









        // Yes, this direct / more direct method is very quick. Even/especially with the update callback.
        //  Have each_px as the basis for a moving convolution window?
        //   Could update the window's Pixel_Buffer pos according to which pixel.
        //    Could also make use of the pixel update function based on the data that is copied from pre-convolution.

        // Have Pixel_Buffer reference and use the memory of a Canvas in the browser?
        //  Would likely be useful.

        // Methods for image composition / compositing as well.
        //  Should get into 3D acceleration and objects too.





        (async() => {
            // Save the inverted volcano file.

            // Soon worth doing some experiments with C++.
            //  Probably worth getting optimized convolutions working in JS first though.

            await gfx.save_pixel_buffer('./output/window_to-generated_256x256.png', pb_source, {
                format: 'png'
            });

        })();


    }
    setup_colors();

    
    // should probably have each_px_8bipp for example.
    //  would make sense to do that to work most efficiently.

    // Could do some things that will rely on each px.
    //  Beginning of code that goes into core, enh, or some kind og plugin / mixin / addon system.

    // Worth looking into node worker threads too.
    //  Relatively simple algorithm / kernel / function processing.



    // will call specific function depending on the bipp.

    // A function that involves updates would be nice as well.
    //  Not so sure about direct access to the pixel...?
    //   An update function could be OK.
    //    Maybe not the best style but it's logical when necessary.
    //     Could compare with direct access. Or even delay the update???






    const calc_avg = () => {
        let px_count = 0;
        const avg = new Float64Array(3);

        performance.mark('A');

        // Seems quite fast so far...
        //  Copying values over though, to look at them...


        // Yes it's fast with the bit copying too.
        //  But what about modification?
        //   can we call a function that sends the update over?
        //    eg invert it?
        //     fast enough?
        //      an update function could work quickly.
        //       not sure. seems that calling functions without giving params helps it to be fast.


        // Working to make each_px as efficient as possible.
        //  If its really fast it could work as a good platform for other really fast functions.

        // Could try to get the average color...?

        

        pb.each_px(ta_pos, ta_px_value, ta_info, () => {
            // Here we use direct reference to the various typed arrays.

            // ta_info: w, h, idx_px, bipp

            // Can we do some color conversion?
            //  Edit in place?
            //   Could use this to make a mask / 1bipp image of selected pixels.
            //    Have a pixel selection function.

            // Explore ways of fast access.
            //  Queued operations? Take place after the convolution?
            //   Maybe would take more space.... Takes place after the convolution has completely passed that space as input?


            //console.log('ta_pos', ta_pos);
            //console.log('ta_px_value', ta_px_value);

            // Want to try some kind of pixel modification.
            //  Perhaps this could work as part os a very fast custom thresholding system?

            avg[0] += ta_px_value[0];
            avg[1] += ta_px_value[1];
            avg[2] += ta_px_value[2];

            // Also want some kind of examples concerning (quickly) setting pixel values.
            //  see about getting an 'update' function in the callback.

            // This is a good sign for fast convolutions.
            //  Other image operations too....


            px_count++;

        });

        avg[0] = avg[0] / px_count;
        avg[1] = avg[1] / px_count;
        avg[2] = avg[2] / px_count;

        performance.mark('B');
        console.log('avg', avg);
        console.log('px_count', px_count);
        performance.measure('A to B', 'A', 'B');

    }

    //calc_avg();

    // Identifying separate color clusters would be useful too.
    //  Consider quantization.
    //   Consider cluster number and 4? bit offset encoding?
    //    8 bit offset encoding? optional offset encoding? Cluster adherence and offsets may be an efficient method of encoding.
    //     3 bit? 6 bit?

    // Could still work on the window to the original system from within each_px.
    //  each_px does iterate quickly over the pixels.
    //   possibly moving a convolution window would not be so slow either.
    //    there will be some relatively fast means of copying between the different data structures.
    //    Operations should work really quickly on typed arrays.

    // Defining Pixel_Buffers with predefined typed arrays?
    //  That way the initialization of new Pixel_Buffers can be done in such a way that reuses memory objects where appropriate.


    // Code specific to Pixel_Buffer to enable it to be efficiently used as a window to another pixel_buffer

    // Fast copy functions between typed arrays are necessary.
    //  Going value by value in a loop works out plenty fast in many cases.



    // pb_copy_rect_to_pb
    // pb_24bipp_copy_rect_to_pb_24bipp
    ///  including copying between pbs with the same number of bit per pixel.

    // Copying a rectangular region needs to work especially quickly.
    //  Will see about variety of optimizations.
    //   May be more possibilities in the future concerning moving references / positions around.
    // A JS array of rows, each a sub-view?
    //  That could be fairly efficient.



    //  will have some fairly optimized ways of doing this.
    //   want it to proceed quickly and directly copy values / data.

    // will have some underlying lower level functionality that will support pixel buffer windows, but is not specific to them.
    //  so far, getting surprisingly fast JS functionality.









    const invert = () => {
        performance.mark('A');
        // Seems quite fast so far...
        //  Copying values over though, to look at them...

        // Yes it's fast with the bit copying too.
        //  But what about modification?
        //   can we call a function that sends the update over?
        //    eg invert it?
        //     fast enough?
        //      an update function could work quickly.
        //       not sure. seems that calling functions without giving params helps it to be fast.

        // Working to make each_px as efficient as possible.
        //  If its really fast it could work as a good platform for other really fast functions.

        // Could try to get the average color...?
        //const avg = new Float64Array(3);

        pb.each_px(ta_pos, ta_px_value, ta_info, (update) => {
            // Here we use direct reference to the various typed arrays.

            // ta_info: w, h, idx_px, bipp

            // Can we do some color conversion?
            //  Edit in place?
            //   Could use this to make a mask / 1bipp image of selected pixels.
            //    Have a pixel selection function.

            // Explore ways of fast access.
            //  Queued operations? Take place after the convolution?
            //   Maybe would take more space.... Takes place after the convolution has completely passed that space as input?

            ta_px_value[0] = 255 - ta_px_value[0];
            ta_px_value[1] = 255 - ta_px_value[1];
            ta_px_value[2] = 255 - ta_px_value[2];
            update();

            // Update does indeed work (very) quickly!
            //  Would likely need to do it somewhat differently in C++. JS compiler inlining maybe will make this work very quickly too.

            //console.log('ta_pos', ta_pos);
            //console.log('ta_px_value', ta_px_value);

            // Want to try some kind of pixel modification.
            //  Perhaps this could work as part os a very fast custom thresholding system?

            //avg[0] += ta_px_value[0];
            //avg[1] += ta_px_value[1];
            //avg[2] += ta_px_value[2];

            // Also want some kind of examples concerning (quickly) setting pixel values.
            //  see about getting an 'update' function in the callback.

            // This is a good sign for fast convolutions.
            //  Other image operations too....
            //px_count++;
        });

        //avg[0] = avg[0] / px_count;
        //avg[1] = avg[1] / px_count;
        //avg[2] = avg[2] / px_count;

        performance.mark('B');
        //console.log('avg', avg);
        //console.log('px_count', px_count);
        performance.measure('A to B', 'A', 'B');

        // Yes, this direct / more direct method is very quick. Even/especially with the update callback.
        //  Have each_px as the basis for a moving convolution window?
        //   Could update the window's Pixel_Buffer pos according to which pixel.
        //    Could also make use of the pixel update function based on the data that is copied from pre-convolution.

        // Have Pixel_Buffer reference and use the memory of a Canvas in the browser?
        //  Would likely be useful.

        // Methods for image composition / compositing as well.
        //  Should get into 3D acceleration and objects too.









        (async() => {
            // Save the inverted volcano file.

            // Soon worth doing some experiments with C++.
            //  Probably worth getting optimized convolutions working in JS first though.

            await gfx.save_pixel_buffer('./output/each_px_inverted-erte_ale.png', pb, {
                format: 'png'
            });



        })();


    }
    //invert();


    

    // 14 ms - its still fast even with adding up an average.



    
    const eg_split_thresh = () => {
        performance.mark('A');

        const [r, g, b] = pb.split_rgb_channels;
        performance.mark('B');
        performance.measure('A to B', 'A', 'B');
        const rthresh = r.get_1bipp_threshold_8bipp(210);
        const thresh_24bipp = rthresh.to_24bipp();
    }


    const save_egs = async() => {
        await gfx.save_pixel_buffer('./output/test_r_channel-erte_ale.png', r, {
            format: 'png'
        });
        await gfx.save_pixel_buffer('./output/test_g_channel-erte_ale.png', g, {
            format: 'png'
        });
        await gfx.save_pixel_buffer('./output/test_b_channel-erte_ale.png', b, {
            format: 'png'
        });
        await gfx.save_pixel_buffer('./output/thresh_24bipp_210-erte_ale.png', thresh_24bipp, {
            format: 'png'
        });
    }

    

    // Could come up with multiple thresholded versions for the different channels.
    //  Want a more efficient and specific thresholding function.

    // The channel splitting function is very fast for JS.

    // threshold function for just one single channel.
    //  or just for 8 bpp for the moment right now.

    // get_mask_threshold_8bipp
    //  maybe better to call them mono or 1bipp.

    // get_threshold_8bipp
    //  would be simple enough to make it only run on 8bipp pixel buffers.

    const general_px_mask_eg = async() => {
        // Lamda function a little slower??
        performance.mark('C');
        const pb_1bipp_mask = pb.mask_each_pixel(pixel_color => pixel_color[0] >= 225);
        performance.mark('D');
        
        
        performance.measure('C to D', 'C', 'D');

        /*
        let l2 = pb_1bipp_mask.ta.length;
        for (let c2 = 0; c2 < l2; c2 ++) {
            //console.log('pb_1bipp_mask.ta[c2]', pb_1bipp_mask.ta[c2]);
        }
        */

        // See about saving this as a 1bpp image...
        // Or turn it into a 24bpp image, save it as a jpeg.

        // .to_24bipp()  - creates a new object and returns it.
        // .to_bipp()

        // Far more functions will operate internally on the Pixel_Buffer.

        // Can use some relatively simple pixel read and write functions.
        //  Not sure quite how well optimized the calls will wind up.
        //   Should be quite fast for JS at least.

        const res_pb_24bipp = pb_1bipp_mask.to_24bipp();

        //console.log('res_pb_24bipp', res_pb_24bipp);

        // Go through the pixels...
        //console.log('res_pb_24bipp.ta', res_pb_24bipp.ta);

        let c_on = 0;
        let tal = res_pb_24bipp.ta.length;

        let i_px = 0;
        const px_count = res_pb_24bipp.size[0] * res_pb_24bipp.size[1];
        

        const save = async() => {
            await gfx.save_pixel_buffer('./output/test_thresh-erte_ale.png', res_pb_24bipp, {
                format: 'png'
            });
        }

        
    }




    
}

if (require.main === module) {
    (async() => {
        // Set file paths here...?

        // The inversion is really fast even just in JS at about 15ms.
        //  Likely to be able to perform a load more functions in high speed.
        //  Then look into doing them faster still.

        


        let res = await eg_win_to();
        console.log('res eg_each_px', res);
    })();
}
