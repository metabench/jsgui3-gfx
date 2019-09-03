/*
    Best to use generated images for tests to avoid IO / file existance / location reliability???
        Allows tests / examples to be run without downloading / installing so much.

    


*/

// Multiple example runner function.

// And best not to save within this function.
//  Maybe an observable would be best.



const eg_mod_name = 'convolve';
const fnlfs = require('fnlfs');
const {obs} = require('fnl');
const create = require('./create_eg_pbs');
const { PerformanceObserver, performance } = require('perf_hooks');

const ta_math = require('../ta-math');
const Convolution = require('../convolution');

// Then the examples will use a proper example runner structure. Won't be all that complex, will allow observation of examples.
//  
const {Pixel_Buffer} = require('../gfx');


const new_gauss_conv_kernel = require('../own_ver/gaussian-convolution-kernel/gck');

const run_examples = (gfx_server) => obs((next, complete, error) => {
    const pb_24bipp_color_square = create.generate_color_square();
    const pb_8bipp_patch = (() => {
        const res = create.patch_1();
        res.bipp = 8;
        return res;
    })();
    //console.log('pb_8bipp_patch.bipp', pb_8bipp_patch.bipp);

    const pb_24bipp_patch = create.patch_1();



    const conv_s3_sharpen = new Convolution({
        size: [3, 3],
        value: [0, -1, 0, -1, 5, -1, 0, -1, 0]
    });


    const gkernel = new_gauss_conv_kernel(3, 1.6);
    //console.log('gkernel', gkernel);

    const conv_gauss_3_sigma_1p6 = new Convolution({
        size: [3, 3],
        value: gkernel
    });

    // Initialise sample objects...

    // and examples in an array, with names.

    // All examples are sync.
    //  Saving them won't be.


    // math copy between 24bipp

    const examples = [
        ['blur_24bipp', () => {
            //return pb_dest;
            // Setup of the pb could take a while... not sure.


            // It's quite fast still. No noticible slowdown with calling from a pb.
            performance.mark('A');
            const res = pb_24bipp_patch.new_convolved(conv_gauss_3_sigma_1p6);
            performance.mark('B');
            performance.measure('A to B', 'A', 'B');
            return res;

        }],
        ['eg_2', () => {
            //return pb_dest;
        }],
        ['eg_3', () => {
            //return pb_dest;
        }]
    ];

    const l_examples = examples.length;
    let eg_name, fn_example, res_eg;


    (async() => {
        for (let c = 0; c < l_examples; c++) {
            [eg_name, fn_example] = examples[c];
            res_eg = fn_example();
            if (res_eg instanceof Pixel_Buffer) {
                await fnlfs.ensure_directory_exists('./output/' + eg_mod_name + '/');
                await gfx_server.save_pixel_buffer('./output/' + eg_mod_name + '/' + eg_name + '.png', res_eg, {
                    format: 'png'
                });
            }
        }
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