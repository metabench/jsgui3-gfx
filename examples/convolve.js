/*
    Best to use generated images for tests to avoid IO / file existance / location reliability???
        Allows tests / examples to be run without downloading / installing so much.

    


*/

// Multiple example runner function.

// And best not to save within this function.
//  Maybe an observable would be best.


const {obs} = require('fnl');


/*  Future
    ------

Convolve 24bipp (channels done separately)

// references / params done by typed array and index inside it?

// ta_access_info object?
//  info on how to access the info within a ta?





*/


const run_convolve_examples = obs((next, complete, error) => {


    // Initialise sample objects...

    // and examples in an array, with names.

    // All examples are sync.
    //  Saving them won't be.


    const examples = [
        ['sharpen_8bipp_patch', () => {
            // Worth cloning the object before using it?



        }]
    ]




});



if (require.main === module) {
    const obs_run_examples = run_convolve_examples();

    obs_run_examples.on('next', e_example => {
        // Example results probably?
        //  Or examples can give named output to save?

        // Probably best if each example can raise different output events.



    })



}