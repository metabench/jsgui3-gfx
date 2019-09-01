/*
    More in-depth examples of copy methods
    Copying between different bipp pbs?
        Or throwing error if attempted
    Copying bounds defined rect from source to pos in dest
        Need to accoung for different ta row byte length.

    Byte copy, Pixel copy, Row copy, Byte Range copy (could be used when both source and the target have the same size)
        Byte Range copy:
            Could have checked the next_row_byte_skip on both the source and the dest (a and b), seen that it's 0, meaning it's aligned in a way which makes the full copy possible, directly copying a large amount of the ta at once.

    More 1bipp support?
        Less optimized version first (try them?)

    Copying greyscale images to within the space of color images at least makes sense.

    Need a nice variety of optimized js copy algorithms.
    Different optimized pixel writing too?

    Differentiate between bounds size alignment or not?

    Will have simpler / possibly faster copy algorithm when it can be specified as a single copy between 2 bounds of source ta space.


    // function copy_range_from_ta_source(ta_source, ta_dest, )
    //  copy_ta_range(ta_source, ta_dest, byte_idx_source_start, byte_idx_dest_start, length);
    //   could be a useful lower level ta_math function.

    // Possibly could put together ta of range parameters to copy.
    //  Then copy them with one function call.

    // color and greyscale 'patch' images


    


    





    


*/

const {obs} = require('fnl');



const ta_math = require('../ta-math');


// Then the examples will use a proper example runner structure. Won't be all that complex, will allow observation of examples.
//  





const run_examples = obs((next, complete, error) => {

        
    const pb_24bipp_color_square = create.generate_color_square();
    const pb_8bipp_patch = (() => {
        const res = create.patch_1();
        res.bipp = 8;
        return res;
    })();
    console.log('pb_8bipp_patch.bipp', pb_8bipp_patch.bipp);

    const pb_24bipp_patch = create.patch_1();



    // Initialise sample objects...

    // and examples in an array, with names.

    // All examples are sync.
    //  Saving them won't be.


    const examples = [
        ['math_copy_between', () => {
            // Worth cloning the object before using it?



        }]
    ];



});



if (require.main === module) {
    const obs_run_examples = run_examples();

    obs_run_examples.on('next', e_example => {
        // Example results probably?
        //  Or examples can give named output to save?

        // Probably best if each example can raise different output events.



    })

}