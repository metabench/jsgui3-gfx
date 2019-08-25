// Should probably write some smaller example to do with 1bpp masks and various operations with much smaller pixel buffers.





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

const copy_from_server_pb = (server_pb) => {
    const res_pb = new Pixel_Buffer({
        size: server_pb.size,
        bits_per_pixel: server_pb.bits_per_pixel
    });
    res_pb.buffer = res_pb.ta = server_pb.ta;
    return res_pb;
}

const copy_to_server_pb = (standard_pb) => {
    const res_pb = new Server_Pixel_Buffer({
        size: standard_pb.size,
        bits_per_pixel: standard_pb.bits_per_pixel
    });
    res_pb.buffer = res_pb.ta = standard_pb.ta;
    return res_pb;
}



const thresh = async() => {
    console.log('Erte Ale thresh example');
    const spb = await Server_Pixel_Buffer.load('../source_images/Erte Ale Volcano.jpg');
    const pb = copy_from_server_pb(spb);
    //console.log('pb', pb);
    //console.log('pb.bipp', pb.bipp);

    // Worth extracting the alpha channel.

    // pb.extract_channel(3)
    //  will help to inspect the alpha channel in this case.

    //const pb_alpha_channel = pb.extract_channel(3);
    //console.log('pb_alpha_channel.bipp', pb_alpha_channel.bipp);

    // Not really working right now....







    // then get the thresholded msk pb.
    // get_threshold_mask

    // get_fn_mask
    // function that operates on each pixel to make a mask. 

    // mask_each_px

    // allow the mask function to be provided.

    // So the mask getting and setting is not working correctly right now.
    //  Seems like it's worth trying with some smaller 1bipp images.

    // Could measure the threshold speed.
    //  Want to do more operations too.
    //  Set them up so that they are fast.
    //  It seems that some functions get optimized very well now.

    // How about splitting the rgb channels into 3 8 bit Pixel Buffers?
    //  Then could run separate thresholding on each of them.
    //   maybe even 0 to 255 on each of them.



    // const [pb_red, pb_green, pb_blue] = pb.get_split_rgb_channels();
    //  as 8 bits per pixel each.
    // could even see about class creation in c++?

    // Applying a convolution in C++ would be much faster too.
    //  It's worth building up to that type of functionality.




    // And could try functions in C++ that accelerate these.
    //  Also subset of js to C++ (kernel) compilation.
    performance.mark('A');

    const [r, g, b] = pb.split_rgb_channels;
    //console.log('post split_rgb_channels');

    // Save the split channels in a simple way together?
    // maybe would need to await their saving.


    performance.mark('B');
    performance.measure('A to B', 'A', 'B');

    // Then would be nice to get some thresholded 1bipp images from these channels.

    // Boolean Convolutions?
    //  Get a view of the pixels in the vacinity (maybe larger vacinity), mark each pixel as true or false.
    //   A form of information reduction, could take a fairly large amount of information into account.
    //    Some uses for feature detection.



    // A fast enough function for viewing a convolution window would be of use.
    //  Maybe best to have an array of the different slices of all the rows?
    //   Would not involve copying typed array data.

    // Also, the convolution_window function should present data that has not been modified from the convolution itself.

    // ta_self_scratch worth having a getter.

    






    // Splitting the channels is nicely fast.
    //  Simple operation done in JS with simple and efficient code.

    await gfx.save_pixel_buffer('./output/test_r_channel-erte_ale.png', r, {
        format: 'png'
    });
    await gfx.save_pixel_buffer('./output/test_g_channel-erte_ale.png', g, {
        format: 'png'
    });
    await gfx.save_pixel_buffer('./output/test_b_channel-erte_ale.png', b, {
        format: 'png'
    });

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

        /*

        for (let i_px = 0; i_px < px_count; i_px++) {
            // read the result pixel...?

            const px_res = res_pb_24bipp.get_pixel_by_idx(i_px);
            //console.log('px_res', px_res);

            //i_px += 1;

        }
        */



        //throw 'stop';






        // Try saving the mask?
        //  Iterating through it....

        // read the pixels by index...?
        //  as in by pixel index.





        //console.log('pb_1bipp_mask', pb_1bipp_mask);




        // Change the bits_per_pixel
        //  would automatically add the alpha channel with each of them as 255.

        // to greyscle could be done by setting the bits_per_pixel to 8

        // and could also have bits_per_pixel as 1.
        //  1 bit per pixel, should be done with operations that set a single bit.
        //  underlying clamped uint8 array.


        //(path, size_or_opts)
        //const pb = await Server_Pixel_Buffer.load('./source_images/Swiss Alps.jpg');
        //await pb.save('./source_images/saved-Swiss Alps.jpg');

        await gfx.save_pixel_buffer('./output/test_thresh-erte_ale.png', res_pb_24bipp, {
            format: 'png'
        });
        //pb.color_whole(124);
        //await gfx.save_pixel_buffer('./source_images/Swiss Alps.jpg', pb, {
        //    format: 'jpg'
        //});
    }




    
}

if (require.main === module) {
    (async() => {
        // Set file paths here...?
        let res = await thresh();
        console.log('res thresh', res);
    })();
}