
// How done it is



// Importance scale as well.
//  Worth using this in the matrix.





// Size of the task

/*
    1 Small / trivial change
       2 mins going on 10 mins
    2  Small change
       5 mins going on 30 mins
    3  Medium-Small task
       15 mins going on 1.5h
       could be an easier version of a 4 - needs an optimized algorithm to be written and tested, it doesnt require further R&D.
    4
       45 mins going on 4.5(+)h
        as in could be an underestimated 5?
        may require thinking about maths & optimization

    5 Moderate - a few hours
        2 hours if it turns out to be relatively easy
        going on a day
    6
        0.5 days to 3 days
    7   (some level of overhaul or new API design involved)
        1.5 days to 1 week
    8  
        1 week to 3 weeks
    9 Programming / API overhaul
        3 weeks to 6 weeks
    10 Huge overhaul / major rewrite / a medium-large project of its own
        1 month to 3 months

    

*/



// progress (0 to 9), task_size on above scale

const _roadmap = {
    '0.0.22': [
        ['pb.bypp = 1 convert to greyscale', 'done', 3, 'Medium small task requiring writing of optimized algorithm']
    ],


    // Looks like level 6 or 7 for doing a lot of the convolution stuff.
    //  May require new Convolution object / class / function / combination thereof.

    '0.0.23': [


        `
        Task Size and Complexity Measure: 5 changed to 6.5
            Going into a larger properties overhaul - new size 6 or 7



        Rethinking and implementing pos_bounds
            pos_within_source_bounds

        Rename pos
            pos_within_source

        
        // Positions only really make sense when they are relative to something.
            In this case, can't assume all positions are relative to the self pb, so need to be extra explicit in the variable names regarding what they relate to.



        Consider other pos type variables. Explicit names for what they do.
            pos_iteration_within_self
            pos_cursor_within_self







        Better to have more API-based centering, and adjust the central position?
            Possibly not best for convolution, for perf reasons.
            Don't want more calculations done during iteration...?
            Maybe don't need to deal with centering as directly right now?
                Seems useful for convolutions, centering the window of the px is a core part of the convolution logic. Worth having the platform support it as easily as possible.

            

        new_window
            implemented
        


        new_centered_window() ???
            NOT doing this for the moment. done new_window

            centered on 0,0.
            center of that window corresponds to a pixel in this window.
            bounds determined...
                does make sense for the moment.
                implement this fn, makes sense for convs right now.

            



            get_conv_window?








        
        
        `

        // Needing to reconsider / rethink a few things.
        //  Size 4 or 5 task. Thinking about bounds, and different types of them.
        //   Movement bounds - allowed positions of the window.
        //    Think about not being able to move any part of the window outside of those set bounds.
        //     Will be a lower level value set by some other things in some cases.


        // Operation bounds?
        //  px iteration bounds?

        // Will think in terms of operating over ranges, doing iterations.
        //  Some inner functions or simple loops using the values will handle the necessary iterations.


        // Will have window_to_bounds?
        //  window_to_pos_bounds?

        // or it would be its own pos_bounds?
        //  or just .bounds?
        //   .bounds is based on the size.

        // .pos_bounds makes sense.

        // .pos.bounds?




        // Write down important functions to implement
        //  Can update progress here.










        

        ['window view into specific channel?'],
        ['run convolution on 8bipp image?', 'maybe', 'not yet'],
        ['Convolution Class', ],
        ['Bug fix move_next_px, need to use boundary ranges for proper movement of the window within a source', 4, [

            // Proposed solutions / features required to get this working:

            // 

            // seems like it should be a new Int16Array.
            ['cancelled - doing pb.pos_bounds', 'pb.window_movement_bounds', `

                Need to make / finish function
                Considering different types of bounds


                



            
            
            
            `],


            ['pos_bounds', `
                consider iterate_pos_within_bounds
                just each_pos_px?

                As well as positions, need to properly calculate iteration values and indexes.
                Put these into a typed array, access them through use of a function






            
            `]


            // pb.window_connection object?
            //  .pb, .movement_bounds
        ]]


        //  Allowing for some out-of bounds movement, useful for convolution.
        //  Movement boundary being difficulty 3 or 4.
        //   Need to consider the overall API.
        //   Movement boundary range likely to be useful for iterations generally.
        //    Seems like a useful feature to have and optimize.

        // movement_bounds

        // .ta_movement_bounds

        // Setting movement bounds (or removing it / setting it to 0) would help to define iteration movement.
        ///  Of a / the pos value while iterating either within self or within source.

        // movement self offset bounds - ie [-1, -1, 1, 1] where it adds the self size to values 2 and 3.

        // movement offset bounds does seem like a fairly useful low level property
        //  more work on movement and iteration.

        // iteration through self space, source space or target space.
        //  not really used target space. may me useful for writing to...?


        // self_movement_bounds
        //  may be useful for some restricted pixel iterations
        //   could calculate the byte jump values from this as well...?


        // window_movement_bounds seems most appropriate for convolution iteration.



















        // Task breakdown...

        //  Convolution class

        // 8bipp window to other 8bipp
        // 8bipp window to single channel of 24bipp

        // Same convolution applying to multiple channels?
        //  so have it work on a multi-channel window.

        // Float16Convolution would hold the convolution.
        //  could specify convo by size and formula?


        // A convolution Class / function system does seem like the best way.



    ],
    '0.0.24': [
        'Cursors'
    ]
}

// Operating convolutions as / on windows to other pixel buffers makes the most sense to me.




// Having a window as a view into a specific channel would make a lot of sense.
//  Would need to work on the copying algorithm.
//   Could be a simple offset-read-advance system.

// Applying convolutions to images would make a lot of sense.


// Float16Convolution
//  Would make sense, with various needed properties for compatibility with Pixel_Buffer

// Have it so that the convolution can be automatically applied for one pb's window into another.
//  Meaning the full image convolution could use the moving convolution window.
//   Hopefully things will be optimized very well.












// not sure about having this hold indexed color.
//  by its name it seems as though it should be able to.
//  using indexed color mode.
//   rgba, rgb, indexed rgb, indexed rgba
//              irgb, irgba
//  and then there is bit_depth.
//              bits_per_pixel may make sense.

// Will just have this as a pixel value buffer.
//  Can have an image-buffer if its more advanced.
// Will be used to hold, and as the basis for basic processing on PNG images.
//  Also want to make some pixel buffer manipulation modules.
// jsgui-node-pixel-buffer-manipulate (maybe not manipulate - could imply it changes data when it does not always?)
//  filters
//  masks? feature detection?
// jsgui-node-pixel-buffer-filter
// jsgui-node-pixel-buffer-processing
// want to do convolutions on the pixel buffer

// Also want to use Vulkan before all that long.
//  But in the gfx-server version.



// Now work on the conversion to greyscale.






const lang = require('lang-mini');

const {
    each,
    fp,
    tof,
    get_a_sig,
    are_equal,
    tf
} = lang;

const Pixel_Pos_List = require('./pixel-pos-list');



// All operations will be in place.
//  If it's at all possible.
//  Can do .clone and then do the operation on that if we want another object.




//const inspect = Symbol.for('nodejs.util.inspect.custom');

// Core
// Mixins
//  Could make them for functions of some categories, and larger functions.
//   Would help to make it replacable with more optimized functions.

// Advanced / Enh

// A color data type could be useful.
//  Contains a typed array of a particular length

// A few fast OO structures / classes?
// Will make use of some functions, but not that many.
// ta(1, 2, 3);
// ta function
//  returns a typed array that fits the numbers
//  will check to see if they are integers
// load it from a pixel-pos-list too.
// More clarity / specifying whether to do it in place, not producing a res option?
//  and use clone where appropriate.

//const oext = require('obext')();

const oext = require('obext')();

const {ro, prop} = oext;
//console.log('oext', oext);
//throw 'stop';

//console.log('ro', ro);

// Make this extend evented class?



// Convolution kernel reading?
//  Maintain the small pixel buffer or convolution buffer for enough time to do the convolution.



// Looks like the scratch typed array would be very useful for the convolution.
//  May be worth trying the more optimized convolution that only needs to store data in its buffer (or somewhere else???)

// Should try a few different convolution window functions...
//  With copy, without.

// Using a temporary convolution typed array or two would help.


// Also, a way to set the pixel color value outside of the bounds, as input to the convolution (window).

// Would be nice to see how quickly a convolution could run in js using different types of memory access / efficiency techniques.




// Recent changes have broken it for some reasons.
// Lower level tests to see what works?













class Pixel_Buffer_Core {
    // Setting bits per pixel to 8
    //  greyscale 256

    // Bits per pixel and bytes per pixel.
    //  May be worth having the normal change events in operation.
    //   But a single defined change function would make sense.
    //    Raising change events may be unnecessary.
    //     Or some of them?
    //    Could be useful in some ways.

    // ta_scratch would make a lot of sense for some operations.
    //  possibly loading / copying too?
    // A way to avoid unnecessary memory allocation and deallocation.



    // Get the ta_scratch as a copy.
    //  It would be useful for viewing the convolution window while applying the convolution internally.

    // Convolutions need both an input and output typed array.
    //  (or some optimization could use a smaller temporary buffer)







    constructor(spec) {



        // ta_bpp would be useful.
        //  UInt8 x 2
        //   then the getters and setters refer to values from them.
        //    not sure how much faster it would be. try it later.



        // defining bounds functionality?
        //  then calculating indexes from that easily?
        
        



        




        // The prop silent_update function

        // Access to silent update functions would be very useful

        // prop setup callback?

        // window_to in the spec.
        //  could also try a direct access mode to its ta. Not to start with.
        //   will have a cached version which gets read from the ta that this is a window_to

        // update_from_main
        // update_to_main

        // Will need to operate somewhat differently when its a window to another pixel buffer.

        // Direct reference would help sync updates really well / perfectly.



        // window_to in operation
        //  on startup, will copy_from_main

        //this.pos = new Int16Array([0, 0]);

        // if it's got window_to, set some things up (extra functionality) in the constructor.

        // Being able to set the window_to property?
        //  Being able to use the same window on multiple input pixel buffers makes sense.

        // will include the change_bipp function in the constructor.
        //  it gets used internally anyway.















        let silent_update_bits_per_pixel;
        let silent_update_bytes_per_pixel;

        if (spec.window_to) {
            spec.bits_per_pixel = spec.window_to.bits_per_pixel;
        }

        // pos_centre?
        //  can use that, along with the size, to set the normal pos.

        // a pos_centre property with getters and setters would be nice.




        // prop obext needs improving - will raise 'ready' function with a silent set fn as well.

        // Change event given in the opts...
        //console.log('Pixel_Buffer_Core spec', spec);
        //console.trace();
        // Default bits per pixel?

        // default.. should properly set the variable at the beginning. not doing so right now for some reason.


        // window_to property
        //  can setup window to upon initialization.

        // has to have the same bpp?
        //  could still have optimized functions that handle the differences.

        // sgs simple_getter_setter_prop?

        // sgsp?

        // more like a facade / overlay property.
        //  would do translation / transformation both ways.

        //  and causes changes to the pos property.
        //   integer only?
        //   will need to work out the rounding mode here.
        //    see how to keep it integer only...?

        // facade_prop(this, 'pos_center', getter, setter)

        // a facade prop that only interacts with other properties would make sense.
        //  using facade_prop could make code clearer to read as well.
        //   but when it's a typed array that gets changed?

        // it's just a value that gets changed.
        //  for the moment, will do less fancy stuff with the center_pos property.
        //   would be useful to refer to it though.

        // need to keep Pixel_Buffer as simple and efficient where possible.
        








        // then can change the pos_center property of the window pixel_buffer.
        //  copy_from_source()
        //   see about a lower level and fast copy_rect function?
        //    many of these functions will run in small / very small number of ms.


        // Further properties
        //  more developed as properties.

        // Conventional get and set style makes sense.
        //  In the constructor.

        // Better local access to tas in the constructor too.

        /*
            All appropriate Typed Arrays
            ----------------------------

            1) pos
            2) size
            3) pos_center
        */


        const pos = new Int16Array(2);
        const size = new Int16Array(2);


        // Position of the central pixel within this.
        //  May be best to have a local variable for it, and other things that get used.
        //   Better than having to create another object when returning a result in functions / getters.

        // pos_center_within_source?
        // pos_within_source?
        //  or part of a Source_Reference???



        // Should make this read-only?
        //  call it pos_center?
        
        // pos_center is the position of the central px within this pb.




        



        // Also ta | buffer property.
        //  May be better using defineProperty and a local typed array variable here?
        //   ta as a const, not being able to overwrite it?
        //    or if we do, it copies the values over?

        // An overhaul of the properties makes sense.

        let ta; // flexible, can be redefined? Can still make read-only in userland.


        // Will be able to reassign the ta....



        //  will have a ta prop.
        //   alias to buffer as well...

        // read-only for the moment?
        //  worth not allowing overwriting it I suppose?
        //   but then shared typed arrays could be used?
        //    would need to be careful about that as well.

        ro(this, 'ta', () => {
            return ta;
        });
        ro(this, 'buffer', () => {
            return ta;
        });





        // or bytes per pixel cant always be ui8.

        const ta_bpp = new Uint8ClampedArray(2);
        ta_bpp[1] = 8; // byte to bit multiplier. will stay as 8.

        // getter and setters for bypp and bipp... interact with ta_bpp[0]







        /*


        'change_bits_per_pixel'(old_bipp, new_bipp)

        */

        // Works very well now :) 0.0.22 ready.

        const _24bipp_to_8bipp = () => {

            //console.log('_24bipp_to_8bipp');

            const old_ta = ta;
            //console.log('old_ta', old_ta);
            //console.log('old_ta.length', old_ta.length);



            //console.log('this.num_px', this.num_px);

            //const new_bypp = 1;

            const new_ta = ta = new Uint8ClampedArray(this.num_px);

            // read byte idx
            // write byte idx

            // read byte color (3 components)
            // write byte color ui8

            const l_read = old_ta.length;

            // could be in a ta scratch of some sort.
            //  Consider benchmarking for this in the near future.

            // Could make a whole version number exploring that difference.




            let iby_read = 0, iby_write = 0;

            //const inc_qty_read = 3, inc_qty_write = 1;

            //let ui8_write;

            // not so sure we need these inc qtys.

            // Maybe this will be very fast, faster than row copy.
            //  Could investigate direct copy as alternative to row copy.
            //   May be faster in many cases...?


            while (iby_read < l_read) {

                //ui8_write = Math.round((old_ta[iby_read++] + old_ta[iby_read++] + old_ta[iby_read++]) / 3);
                //new_ta[iby_write++] = ui8_write;

                new_ta[iby_write++] = Math.round((old_ta[iby_read++] + old_ta[iby_read++] + old_ta[iby_read++]) / 3);
                // Consider other formula with different weightings.

            }







            // num_pixels property...
            //  bring into constructor?


            //const new_ta = ta = new Uint8ClampedArray()



            // Clone / copy the old ta?
            //  Use the scratch ta.
            //   And update the scratch from the ta?


        }

        const _change_bipp_inner_update = (old_bipp, new_bipp) => {

            //console.log('_change_bipp_inner_update [old_bipp, new_bipp]', [old_bipp, new_bipp]);


            if (old_bipp === 24) {


                if (new_bipp === 8) {

                    _24bipp_to_8bipp();


                    // specific fn call...?
                    //  probably most optimized to do a specific fn call....



                } else {

                    console.trace();
                    throw 'NYI';
                }


            } else {

                console.trace();
                throw 'NYI';

            }

            // will do some low level stuff here.





        }





        // the get / set bytes per pixel and bits per pixel will both use this.

        // move away from prop for the moment...




        // default...?
        //  bits per pixel, bytes per pixel...?

        // only hold the number of bits per pixel internally.
        //  

        // shorthand method names???? interesting.

        const def_bipp = {
            // Using shorthand method names (ES2015 feature).
            // This is equivalent to:
            // get: function() { return bValue; },
            // set: function(newValue) { bValue = newValue; },
            get() { return ta_bpp[0]; },
            set(value) { 

                const old_bipp = ta_bpp[0];

                ta_bpp[0] = value;

                // And then need to run the change_bipp function.
                //  give it the old value too?

                // It would recreate the typed array.
                //  Maybe a different size.

                _change_bipp_inner_update(old_bipp, ta_bpp[0]);






            },
            enumerable: true,
            configurable: false
          }

        Object.defineProperty(this, 'bits_per_pixel', def_bipp);
        Object.defineProperty(this, 'bipp', def_bipp);

        const def_bypp = {
            // Using shorthand method names (ES2015 feature).
            // This is equivalent to:
            // get: function() { return bValue; },
            // set: function(newValue) { bValue = newValue; },
            get() { return ta_bpp[0] / 8; },
            set(value) { 

                const old_bipp = ta_bpp[0];

                ta_bpp[0] = value * 8;

                _change_bipp_inner_update(old_bipp, ta_bpp[0]);


                // changing from 24 bipp to 8 bipp...




            },
            enumerable: true,
            configurable: false
          }

        Object.defineProperty(this, 'bytes_per_pixel', def_bypp);
        Object.defineProperty(this, 'bypp', def_bypp);

        // bytes_per_row

        // bits_per_row could be useful as well.
        //  maybe the rows don't need to subdivide into bytes.
        //   that would be most efficient for 1 bipp images of course, eg sized 3x300.
        //    dont want to limit it to integer number of bytes per row in this case. that's a case for only using bits_per_row.

        const def_bypr = {
            get() {
                //console.log('size[0]', size[0]);
                //console.log('ta_bpp[0]', ta_bpp[0]);
                return size[0] * ta_bpp[0] / 8;
            }
        }
        Object.defineProperty(this, 'bytes_per_row', def_bypr);
        Object.defineProperty(this, 'bypr', def_bypr);











        








          // a get minus_pos function.
        // would also have its own local ta.

        

        // const pos_center_within_this = new Int16Array(2);



        // and pos_center is a facade property with no local variable.


        // pos within other coord space?
        //  iteration pos within this?



        // 


        // pos_within_source?

        Object.defineProperty(this, 'pos', {
            // Using shorthand method names (ES2015 feature).
            // This is equivalent to:
            // get: function() { return bValue; },
            // set: function(newValue) { bValue = newValue; },
            get() { return pos; },
            set(value) {
                // Were we given a Int16Array? Similar?
                //  set own pos ta values from the value.

                if (value instanceof Int16Array) {
                    if (value.length === 2) {
                        pos[0] = value[0];
                        pos[1] = value[1];
                    }
                }


                //pos = value; 
            },
            enumerable: true,
            configurable: false
        });


        // And different movement / position boundaries:

        // window_movement_bounds
        //  the positions that can be moved into within (or outside) the source window.
        //  will help with position iteration based on the position within the source window.



        // really its pos_bounds
        //  because we can not move the pos outside of these bounds.
        //  iteration functions move the pos within these bounds.
        //  will be useful for moving convolution windows.

        // const pos_center_within_this = new Int16Array(2);

        // 







        

        // be able to set the window movement bounds as well.
        //  will set the values.

        // window_movement_bounds will be very useful for moving a pb window around a source for doing a convolution.


        // pos_center makes a lot of sense as a read-only property
        //  could update it whenever the size is set.

        // both read-only properties.
        const pos_bounds = new Int16Array(4);
        //  pos_within_source / pos_within_container / pos_within_parent / pos_within






        const pos_center = new Int16Array(2);
        const edge_offsets_from_center = new Int16Array(4);


        ro(this, 'pos_center', () => pos_center);
        ro(this, 'edge_offsets_from_center', () => edge_offsets_from_center);



        // have edge offsets from center in terms of bytes too?


        // Differentiate between pos_within_source and an internal pos_iterator or pos of operations to be done.
        // new_centered_window will make use of this.

        // Better to have it existing already.

        // pos_within_parent_bounds

        // or more full positioning property and system?


        Object.defineProperty(this, 'pos_bounds', {
            // Using shorthand method names (ES2015 feature).
            // This is equivalent to:
            // get: function() { return bValue; },
            // set: function(newValue) { bValue = newValue; },
            get() {
                //if (!pos_bounds) {
                //    pos_bounds = new Int16Array(4);
                //}
                return pos_bounds; 
            },
            set(value) {

                // look at type of value... maybe its an array.
                const tv = tf(value);
                //console.log('pos_bounds set tv', tv);

                // if tv is an array...

                if (tv === 'a') {

                    if (value.length === 4) {
                        pos_bounds.set(value);
                    } else {
                        throw 'Expected Array with .length 4, value.length: ' + value.length;
                    }
                    
                } else {
                    console.trace();
                    console.log('pos_bounds set tv', tv);
                    throw 'Expected Array';
                }

                //console.log('have set pos_bounds', pos_bounds);

                // Were we given a Int16Array? Similar?
                //  set own pos ta values from the value.

                /*

                if (value instanceof Int16Array) {
                    if (value.length === 2) {
                        pos[0] = value[0];
                        pos[1] = value[1];
                    }
                }
                */


                //pos = value; 
            },
            enumerable: true,
            configurable: false
        });










        const minus_pos = new Int16Array(2);

        Object.defineProperty(this, 'minus_pos', {
            // Using shorthand method names (ES2015 feature).
            // This is equivalent to:
            // get: function() { return bValue; },
            // set: function(newValue) { bValue = newValue; },
            get() {
                if (pos) {
                    minus_pos[0] = pos[0] * -1;
                    minus_pos[1] = pos[1] * -1;
                    return minus_pos;
                }
            },
            enumerable: true,
            configurable: false
        });


        Object.defineProperty(this, 'size', {
            // Using shorthand method names (ES2015 feature).
            // This is equivalent to:
            // get: function() { return bValue; },
            // set: function(newValue) { bValue = newValue; },
            get() { return size; },
            set(value) {
                // Were we given a Int16Array? Similar?
                //  set own pos ta values from the value.

                if (value instanceof Int16Array) {
                    if (value.length === 2) {
                        size[0] = value[0];
                        size[1] = value[1];
                    }
                } else {
                    console.trace();
                    throw 'NYI';
                }
                //pos = value; 
            },
            enumerable: true,
            configurable: false
        });







        // Size bounds?
        //  May be better made more specific like that.



        // Seems mis-named? Not specific? What does this have to do with the pos? Rename....


        // size_bounds?
        //  self_size_bounds?


        // or by setting up / creating a window_to, a few iteration properties will be set up to begin with....

        // rethink the 'bounds' property?
        //  to self_bounds?




        // .own_bounds? .self_bounds?



        // pos_allowed_bounds?

        // bounds of this shape within the space of target...?


        // bounds_within_target / source?




        const bounds_within_source = new Int16Array(4);
        // Using shorthand method names (ES2015 feature).
        Object.defineProperty(this, 'bounds_within_source', {
            // This is equivalent to:
            // get: function() { return bValue; },
            // set: function(newValue) { bValue = newValue; },

            // Refer to pos_center_within_this...
            //  

            get() {

                //console.trace();
                //throw 'rename this function to something more specific.'

                const size = this.size;
                const pos = this.pos;
                bounds_within_source[0] = pos[0];
                bounds_within_source[1] = pos[1];
                bounds_within_source[2] = pos[0] + size[0];
                bounds_within_source[3] = pos[1] + size[1];
                return bounds_within_source;
            },
            /*
            set(value) {

                
            },*/
            enumerable: true,
            configurable: false
        });

        //  Use the size and pos to calculate this.

        const size_bounds = new Int16Array(4);
        Object.defineProperty(this, 'size_bounds', {
            get() {
                const size = this.size;
                //console.log('size', size);
                size_bounds[0] = 0;
                size_bounds[1] = 0;
                size_bounds[2] = size[0];
                size_bounds[3] = size[1];
                return size_bounds;
            },
            enumerable: true,
            configurable: false
        });

    


        let pb_source;
        // use window_movement_bounds
        //  understand the positioning (restrictions?) of the movement of the window within the source.

        Object.defineProperty(this, 'source', {
            // Using shorthand method names (ES2015 feature).
            // This is equivalent to:
            // get: function() { return bValue; },
            // set: function(newValue) { bValue = newValue; },
            get() { return pb_source; },
            set(value) {
                // Were we given a Int16Array? Similar?
                //  set own pos ta values from the value.

                pb_source = value;


                // Pixel_Buffer_Core or any subclass?

                /*

                if (value instanceof Int16Array) {
                    if (value.length === 2) {
                        size[0] = value[0];
                        size[1] = value[1];
                    }
                }
                */


                //pos = value; 
            },
            enumerable: true,
            configurable: false
        });



        // And the pos_center facade to provide access to that variable.
        //  It could have its own pos typed array though.

        //  Would make sense if the ta pos_center were created and maintained...
        //   But always update it when getting it?

        // have a centre_offset typed array?

        //  the offset of the center pixel from the top left pixel...?

        // center_pixel_offset_from_tl
        //  where the tl maybe won't be 0, 0, because of the pos.



        // internal, non-scratch ta.
        //  don't expose it (directly) for the moment.

        // Maybe have safe API to deal with fast internal objects?

        //const ta_central_px_offset = new Int16Array(2);

        // pos_central_position_within_this


        // Making it so that Pixel_Buffer can deal with multiple coordinate spaces at once.

        //  This may be a useful start to pixel-remap based resizing.
        //   Iterate through each pixel. Do a variety of calculations. Load the relevant pixels in the source quickly (maybe 4 or 9 of them?)
        //   

        // Anyway, more work on pos_center.



        // set this when we set pos_center.




        // The iteration for pixels, convolutions etc will be set up with some function(s) to get the iterations values into some tas.
        //  Iteration / copying should be very fast.



        // pos_center_within_source???

        // pos_my_center_within_this?
        // pos_my_center_within_source?

        // More specifically named pos_center variable?
        //  


        // pos_my_center_within_source...?
        //  .window_to_source(target???)

        // pos_my_center_within_source would be a useful property....
        //  basically calculate it, and return a typed array.

        // Want a few precise, useful and fast functions that calculate / retrieve data and put it in a TA.
        //  Calculated data in a ta would work nicely.



        // local ta pos_my_center_within_source variable?

        // definitely useful for returning it.


        // pos_center will be read-only.

        // normal pos_center referring to own coords space.

        //  will use local ta, read only, will depend on the size.
        //  Math.ceil((w - 1) / 2)
        //   deals with even w or h.




        // width 6:

        // xxxxxx
        // xxxxxx
        // xxxxxx
        // xxxxxx
        // xxxxxx
        // xxxxxx

        // Seems like the fairly large changes to the properties will make this work well.
        //  A PB acting as a window to another PB will be very useful.

        // Many functions will work quickly with good preparatory values set up.

        

        // central px offset within this.
        //  set this whenever we set the size?
        //   or just upon getting makes most sense...



        // ta px_count_left_of_central_px, px_count_above_central_px




        // Maybe will allow negative positions...?



        // round_central_px_down = true?


        // Need to replace systems concerning self to source bounds positions / (translations?)
        //  No translations yet - need to successfully deal with out-of-bounds copy attempts (not copy those pixels)

        // Just correctly set the bounds postions for iterations of this within a source window.


        const old_def_pos_central_and_associated = () => {
            const pos_central_px = new Int16Array(2);

            //  Use the size and pos to calculate this.


            // Better not to calculate it each time....

            const def_pos_center = {
                // Using shorthand method names (ES2015 feature).
                // This is equivalent to:
                // get: function() { return bValue; },
                // set: function(newValue) { bValue = newValue; },


                // Refer to pos_center_within_this...
                //  

                get() {


                    // setup the window_movement_bounds?

                    console.log('get pb.pos_center');


                    pos_central_px[0] = Math.ceil((size[0] - 1) / 2) + this.pos[0];
                    pos_central_px[1] = Math.ceil((size[1] - 1) / 2) + this.pos[1];

                    // need to work out the w / 2...

                    console.log('pre return pos_central_px');


                    return pos_central_px;
                    // Get the value based on the pos as well as the size.
                    //  Half the size, rounded down?
                    //   (w - 1) / 2?

                    // use a typed array that represents the value.

                    // A single const typed array would make sense.




                    // Having and returning a local typed array would make a lot of sense.
                    //  

                    console.log('getting pos_my_center_within_source');
                    console.log('pos', pos);

                    console.trace();
                    throw 'stop';
                    //return size;
                },
                /*
                set(value) {

                    
                },*/
                enumerable: true,
                configurable: false
            }



            // pos_central_px may be a better, more specific name.



            Object.defineProperty(this, 'pos_central_px', def_pos_center);
            Object.defineProperty(this, 'pos_center', def_pos_center);


            // Will imply what the acceptable range outside of the source is?
            //  Make that explicit?


            // Not so sure this is the right API...?

            // Maybe have a self_to_source_offset?
            // source_to_self_offset?

            // offset_self_to_source.




            // Seems like a bit of a dodgy api...?


            //  offsets / translates between source and window.
            //   



            Object.defineProperty(this, 'pos_my_center_within_source', {
                // Using shorthand method names (ES2015 feature).
                // This is equivalent to:
                // get: function() { return bValue; },
                // set: function(newValue) { bValue = newValue; },


                // Refer to pos_center_within_this...
                //  



                get() {
                    // Get the value based on the pos as well as the size.
                    //  Half the size, rounded down?
                    //   (w - 1) / 2?


                    // Having and returning a local typed array would make a lot of sense.

                    //  

                    //console.log('getting pos_my_center_within_source');

                    //console.log('pos', pos);

                    // need to use pos_central_px






                    //console.trace();
                    //throw 'stop';

                    return pos;



                    //return size; 
                },
                set(value) {


                    // Maybe need more clarity about coordinate space mapping.
                    //  Coords / pixels will need to be mapped to and from a variety of coordinate spaces.

                    



                    console.log('seting pos_my_center_within_source', value);
                    // The pos_center value represents the central position in this image and it possibly corresponding with another position
                    //  in another coordinate space.

                    // More explicit definition of the acceptable pos range of a window within its source.



                    //console.trace();
                    //throw 'stop';

                    // Were we given a Int16Array? Similar?
                    //  set own pos ta values from the value.
                    if (value instanceof Int16Array) {
                        if (value.length === 2) {

                            //console.log('set pos_center going ok...');
                            // need pos_central_px
                            //  position within this.
                            //   then reverse that to get our pos offset....

                            // set the pos....
                            //  update the pos?

                            // A typed array that listens to its own changes???

                            const cpx = this.pos_central_px;
                            //console.log('cpx', cpx);

                            // fastest way to set / update own pos???
                            //  could directly set the ta....

                            pos[0] = -1 * cpx[0] + value[0];
                            pos[1] = -1 * cpx[1] + value[1];
                            





                            // set a local variable....
                            //  


                            // Work out the pos of the central pixel within this coordinate space...

                            // pos_center represents the central positon within another coordinate space... clarify naming?

                            // pos_central_pixel_in_this...
                            //  maybe should be a ta to store its value as well?
                            //  




                            //size[0] = value[0];
                            //size[1] = value[1];

                            // don't change the pos.
                        }
                    } else {
                        console.trace();
                        throw 'pos_my_center_within_source unsupported value type';
                    }


                    //pos = value; 
                },
                enumerable: true,
                configurable: false
            });






        }
        



        // getter and setter for bipp, bits_per_pixel, bypp, bytes_per_pixel referring to the two members of a ta_ui8
        //  again, the facade pattern.







        // define getters and setters here instead, using prop?


        // Do want to define the properties for the alias as well.
        //  could wrap with ofp.


        

        // another prop?
        //  ta_scratch
        // copies over the data from own ta
        //  will be useful with the convolution system, maybe other things.

        // a getter?


        

        // Would be just 1 bit per pixel...
        if (spec instanceof Pixel_Pos_List) {
            // load it as a buffer.

            throw 'NYI - change to 1bipp';

            const ppl = spec;
            //console.log('ppl.length', ppl.length);
            // find out its bounds.

            // probably best loading this as a smaller pixel buffer with just the part of the image.
            //  will set a .pos attribute
            const bounds = ppl.bounds;
            //const [l, t, r, b] = bounds;
            //console.log('Pixel_Buffer_Core bounds', bounds);

            const ppl_size = new Uint16Array(2);
            ppl_size[0] = bounds[2] - bounds[0];
            ppl_size[1] = bounds[3] - bounds[1];

            //console.log('Pixel_Buffer_Core ppl_size', ppl_size);
            //  Can have bits or bytes per pixel set in spec, otherwise.
            //   Pixel pos list to produce 1 bit per pixel in the near future anyway.

            this.bits_per_pixel = 8;

            const bpp = this.bytes_per_pixel = 1;

            // Not clear why the extra space is needed, but it solves a subtle sizing error.
            //  Maybe the ppl size registers wrong.
            // not sure why the +1 size is needed - it prevents an overflow???
            this.size = new Uint16Array([ppl_size[0] + 4, ppl_size[1] + 4]);
            this.pos = new Int16Array([bounds[0], bounds[1]]);


            // .bypr and .bytes_per row as read-only facade properties.



            // property .length as the ta length?


            const bpr = this.bytes_per_row = bpp * this.size[0];
            //console.log('Pixel_Buffer_Core this.pos', this.pos);

            const buf = this.ta = this.buffer = new Uint8ClampedArray(this.size[0] * this.size[1]);
            const l = buf.length;
            for (var c = 0; c < l; c++) buf[c] = 255;

            ppl.each_pixel(pixel_pos => {
                // seems like some errant pixels got set - maybe in the flood fill.
                // not sure why we need -1 for some things...
                //buf[(bpr * (pixel_pos[1] - bounds[1]) - bpp) + (pixel_pos[0] - bounds[0] - bpp)] = 0;
                buf[(bpr * (pixel_pos[1] - bounds[1])) + (pixel_pos[0] - bounds[0])] = 0;
                //this.
            });
            //console.log(JSON.stringify(buf));
            //each(buf, console.log);
        } else {
            //spec.__type_name = spec.__type_name || 'pixel_buffer';
            //super(spec);
            if (spec.buffer) {
                if (spec.buffer instanceof Buffer) {
                    //this.ta = this.buffer = new Uint8ClampedArray(spec.buffer.buffer);
                    ta = new Uint8ClampedArray(spec.buffer.buffer);
                } else {
                    // check its uint8array either clamped or not.??
                    //this.ta = this.buffer = spec.buffer;
                    ta = spec.buffer;

                }
            }
            // Size could more logically be its dimensions.

            if (spec.size) {
                //this.size = spec.size;
                //this.size = new Uint16Array(spec.size); // using the size it was given, which was given as an array.

                size[0] = spec.size[0];
                size[1] = spec.size[1];

            } else {
                throw 'Expected: size [x, y] property in the Pixel_Buffer_Core specification';
            }

            // bit-depth - could follow PNG.
            //  rgba color mode.

            if (spec.bytes_per_pixel && !spec.bits_per_pixel) spec.bits_per_pixel = spec.bytes_per_pixel * 8;
            spec.bits_per_pixel = spec.bits_per_pixel || 32;

            if (spec.bits_per_pixel) {
                if (spec.bits_per_pixel != 1 && spec.bits_per_pixel != 8 && spec.bits_per_pixel != 24 && spec.bits_per_pixel != 32) {
                    console.log('spec.bits_per_pixel', spec.bits_per_pixel);
                    console.trace();
                    throw 'Invalid bits_per_pixel value of ' + spec.bits_per_pixel + ', must be 8, 24 or 32, default is 32.';
                } else {
                    //this.bits_per_pixel = spec.bits_per_pixel;
                    ta_bpp[0] = spec.bits_per_pixel;
                }
            }
            // then initialize the buffer itself.

            /*
            const bytes_per_pixel = this.bytes_per_pixel = this.bits_per_pixel / 8;


            this.bytes_per_row = bytes_per_pixel * this.size[0];
            */

            // should have size property already?


            if (this.size && !this.buffer) {
                //console.log('this.size', this.size);
                //this.ta = this.buffer = new Uint8ClampedArray(bytes_per_pixel * this.size[0] * this.size[1]);
                //console.log('ta_bpp[0]', ta_bpp[0]);

                ta = new Uint8ClampedArray((ta_bpp[0] / 8) * this.size[0] * this.size[1]);



                //this.buffer = Buffer.alloc(bytes_per_pixel * this.size[0] * this.size[1]);
            }
            if (spec.color) {
                this.color_whole(spec.color);
            }
            //console.log('this.ta', this.ta);
        }

        ro(this, 'meta', () => {
            return {
                size: this.size,
                bits_per_pixel: this.bits_per_pixel,
                bytes_per_pixel: this.bytes_per_pixel,
                bytes_per_row: this.bytes_per_row
            }
        });

        //if ()

        if (spec.window_to || spec.source || spec.window_to_source) {

            // Need to understand the pos boundaries within the source.
            

            // set the .source property.

            pb_source = spec.window_to || spec.source || spec.window_to_source;


            

            // 

            // pos centre of this image within the source image.
            //  

            //if (spec.pos_center || spec.pos_my_center_within_source) {
            //    this.pos_my_center_within_source = spec.pos_center || spec.pos_my_center_within_source;
           // }

            const log_info = () => {
                console.log('Pixel_Buffer_Core (or subclass) needs to act as a window to another Pixel Buffer.')
                console.log('pb_source', pb_source);
                console.log('pb_source.size', pb_source.size);
                

                // Should be able to get various useful pieces of info on a pb quickly in ta format.





                // The pos should have been set when given the pos_center.

                console.log('spec.pos', spec.pos);
                console.log('spec.pos_center', spec.pos_center);
                // pos could have extra centering value / flag???



                console.log('this.pos', this.pos);
                console.log('this.pos_my_center_within_source', this.pos_my_center_within_source);

                console.log('spec', spec);
            }
            //log_info();

           

        }

        if (spec.pos_bounds) {
            this.pos_bounds = spec.pos_bounds;
        }

        


        // 
        let ta_scratch;
        let ta_pos_scratch;        // Int16Array(2)

        // ta_pos_iterator ???


        // makes a lot of sense to have another ta pos specifically for iteration.

        let ta_pos_iterator;        // Int16Array(2)

        // ta_move_vector


        // maybe defining them as constants to start with would be more efficient?
        //  could test that.
        let ta_move_vector;

        /*
        const ta_bounds = pb.ta_bounds;
        console.log('ta_bounds', ta_bounds);
        const ta_rgb = pb.ta_rgb;
        */

        let ta_bounds;
        let ta_rgb;
        let ta_rgb2;
        let ta_rgba;
        let ta_row_scratch;

        let ta_bounds_scratch;     // Int16Array(4);
        let ta_bounds2_scratch;    // Int16Array(4);
        let ta_bounds3_scratch;    // Int16Array(4);
        let ta_bounds4_scratch;    // Int16Array(4);
        let ta_size_scratch;       // Uint16Array(2);
        let ta_size2_scratch;       // Uint16Array(2);
        let ta_pointers_scratch;
        let ta_pointers2_scratch;
        let ta_pointerpair_scratch;
        let ta_offsets_scratch;
        let ta_offsets_info_scratch; 


        const setup_ta_ro_props = () => {


            ro(this, 'ta_scratch', () => {
                if (!ta_scratch) {
                    ta_scratch = new this.ta.constructor(this.ta);
                } else {
    
                    // If it's not already an instance of the constructor of this.ta?
    
    
    
                    // check the size...? the types as well?
                    if (ta_scratch.length !== this.ta.length) {
                        ta_scratch = new this.ta.constructor(this.ta);
                    } else {
                        const l = this.ta.length;
                        // Could use faster copy?
                        //  Is typed array copy that fast compared to assignment operators?
                        for (c = 0; c < l; c++) {
                            ta_scratch[c] = this.ta[c];
                        }
                    }
                }
            });
    
    
            // ta_row_scratch
            //  a typed array sized to hold pixel data for a single row.
    
            // (this.bypr)
    
            ro(this, 'ta_row_scratch', () => {
                if (!ta_row_scratch) {
                    ta_row_scratch = new Uint8ClampedArray(this.bypr);
                } else {
                    if (ta_row_scratch.length !== this.bypr) {
                        ta_row_scratch = new Uint8ClampedArray(this.bypr);
                    }
                    return ta_row_scratch;
                }
            })
    
    
    
            
            ro(this, 'ta_pos_scratch', () => {
                if (!ta_pos_scratch) {
                    ta_pos_scratch = new Int16Array(2);
                }
                return ta_pos_scratch;
            });
    
            ro(this, 'ta_pos_iterator', () => {
                if (!ta_pos_iterator) {
                    ta_pos_iterator = new Int16Array(2);
                }
                return ta_pos_iterator;
            });
    
    
            // ta_source_to_self_translate_vector ???
            //  more properties could be stored and accessed in this form. tas particularly good for simple vectors.
    
            // maybe make some kind of optimized string indexed ta.
            //  look up values to consts, use them...?
            //  or have const declarations of the numbers, use them? May compile best. Macros for consts???
    
    
    
            // ta_move_vector
            ro(this, 'ta_move_vector', () => {
                if (!ta_move_vector) {
                    ta_move_vector = new Int16Array(2);
                }
                return ta_move_vector;
            });
    
    
    
            // a size scratch...
            //  must be a positive size.
    
    
    
            // What about double bounds scratch for rapid checking of overlaps?
            //  Could make use of this / other scratch ta properties to handle input and output
    
            // Still, need to make a very fast copy rectangle function.
    
            // Presumably can get it to a very high speed.
            
    
            // An assortment of temporary use tas to use for a variery of purposes.
    
            //
    
    
            // default bounds is it's own space? within its own coords, ie size? or bounds within other?
            //  better to leave it blank for the moment here.
            ro(this, 'ta_bounds', () => {
                if (!ta_bounds) {
                    ta_bounds = new Int16Array(4);
                }
                return ta_bounds;
            });
    
            ro(this, 'ta_rgb', () => {
                if (!ta_rgb) {
    
                    // rgb position of the current inner pos?
    
                    // we don't have a proper pointer for a selected position in the current coord space.
                    //  pos only applies to this pb's pos within another space.
    
    
    
    
                    ta_rgb = new Uint8ClampedArray(3);
                }
                return ta_rgb;
            });
            ro(this, 'ta_rgb2', () => {
                if (!ta_rgb2) {
                    ta_rgb2 = new Uint8ClampedArray(3);
                }
                return ta_rgb2;
            });
    
    
    
            // Could be of use in SIMD as well?
            //  Maybe especially if they dont need to be set so often in JS and can be the basis for many SIMD operations in C++.
    
    
    
            ro(this, 'ta_bounds_scratch', () => {
                if (!ta_bounds_scratch) {
                    ta_bounds_scratch = new Int16Array(4);
                }
                return ta_bounds_scratch;
            });
    
            
            ro(this, 'ta_bounds2_scratch', () => {
                if (!ta_bounds2_scratch) {
                    ta_bounds2_scratch = new Int16Array(4);
                }
                return ta_bounds2_scratch;
            });
    
            
            ro(this, 'ta_bounds3_scratch', () => {
                if (!ta_bounds3_scratch) {
                    ta_bounds3_scratch = new Int16Array(4);
                }
                return ta_bounds3_scratch;
            });
    
            
            ro(this, 'ta_bounds4_scratch', () => {
                if (!ta_bounds4_scratch) {
                    ta_bounds4_scratch = new Int16Array(4);
                }
                return ta_bounds4_scratch;
            });
    
            // ta_bounds2_scratch // can be useful / necessary to have 2 sets of bounds.
    
    
            // ta_bounds_scratch
            //  Int16 size 4
    
            
            ro(this, 'ta_size_scratch', () => {
                if (!ta_size_scratch) {
                    ta_size_scratch = new Uint16Array(2);
                }
                return ta_size_scratch;
            });
    
    
            // ta_size2_scratch
            ro(this, 'ta_size2_scratch', () => {
                if (!ta_size2_scratch) {
                    ta_size2_scratch = new Uint16Array(2);
                }
                return ta_size2_scratch;
            });
    
    
    
            // ta_pointers_scratch
    
            
    
    
    
            ro(this, 'ta_pointers_scratch', () => {
                if (!ta_pointers_scratch) {
                    // Only allow 2 pointers? by default?
                    ta_pointers_scratch = new Uint32Array(4);
                }
                return ta_pointers_scratch;
            });
    
            
            
            ro(this, 'ta_pointers2_scratch', () => {
                if (!ta_pointers2_scratch) {
                    // Only allow 2 pointers? by default?
                    ta_pointers2_scratch = new Uint32Array(4);
                }
                return ta_pointers2_scratch;
            });
    
    
            
            ro(this, 'ta_pointerpair_scratch', () => {
                if (!ta_pointerpair_scratch) {
                    // Only allow 2 pointers? by default?
                    ta_pointerpair_scratch = new Uint32Array(2);
                }
                return ta_pointerpair_scratch;
            });
    
            // pointer pair scratch?
            //  start and end?
    
    
    
    
    
            // offsets...
            //  (pointer offsets?)
    
            
            ro(this, 'ta_offsets_scratch', () => {
                if (!ta_offsets_scratch) {
                    // Only allow 2 pointers? by default?
                    ta_offsets_scratch = new Int32Array(4);
                }
                return ta_offsets_scratch;
            });
    
            ro(this, 'ta_offsets_info_scratch', () => {
                if (!ta_offsets_info_scratch) {
                    // Only allow 2 pointers? by default?
                    ta_offsets_info_scratch = new Int32Array(8);
                }
                return ta_offsets_info_scratch;
            });
    
    
    
    
            // have a .byte_idx property?
            //  and bit_idx???
    
            // byte idx would be a different representation of the position, as a single 32 bit integer.
            //  moving to the next pixel becomes simpler that way.
            //   could even make pos a facade to that???
    
            // moving to the next pixel could leave pos undefined?


        }
        setup_ta_ro_props();



        



        // move_to basically sets the position.
        //  but would do the copy from source too.





        // Yes, this move and copy is nicely fast.
        this.move = ta_2d_vector => {
            pos[0] += ta_2d_vector[0];
            pos[1] += ta_2d_vector[1];

            // then recopy from source if there is one....

            if (this.source) {
                //console.log('have source, so will do auto recopy.');
                 
                // and time this as well...?
                // not here.
                this.copy_from_source();

            }

        }

        this.each_pos_within_bounds = (callback) => {

            //console.log('each_pos_within_bounds');
            // Still within the constructor (extra speed?)
            //  will use the pos_bounds here too.

            //pos[0] = pos_bounds[0];
            //pos[1] = pos_bounds[1];

            // Double for loop definitely seems easiest here.
            
            // Byte index iteration in some cases may be better though.
            //  Could do both at the same time.

            // Byte index iteration by itself may be a bit faster?
            const has_source = !!this.source;

            //console.log('pos_bounds', pos_bounds);
            //console.log('this.pos_bounds', this.pos_bounds);
            //console.log('pos_bounds', pos_bounds);




            for (pos[1] = pos_bounds[1]; pos[1] < pos_bounds[3]; pos[1] ++) {
                for (pos[0] = pos_bounds[0]; pos[0] < pos_bounds[2]; pos[0] ++) {

                    if (has_source) this.copy_from_source();
                    callback();

                }
            }


        }


        // Yes - got the culprit here for convolution windows.


        // move_next_px could do with awareness of the movement bounds.

        //  the center pos could be bound within the space of the image it's a window to.
        //   that type of position binding / framing makes most sense.

        // binding a window px to a source px with the center_pos?
        //  binding as in bounds setting.

        // center pos of window bound to size of source.
        //  see about setting this option in the Pixel_Buffer constructor / spec.
        
        // Window position binding would be of use for pixel iteration, using .move_next_px
        //  Binding the center pos works out to a different window binding position range.
        //   a 3x3 conv would be bound within (-1, -1, size + 1, size + 1);



        // Position and position iteration boundaries specification makes a lot of sense.
        //  Avoiding bugs by going into a lot of detail about the various numbers that get used, and the relationships between those numbers.
















        this.move_next_px = () => {

            // within pos_bounds

            // only adjust the pos if the next pixel is within range.
            //  within the source size.


            

            const source_size = this.source.size;
            
            // boundary error here?

            // Just a little complex here.
            //  Needs to take account of boundaries.

            // Available positions depend on the source window.
            //  pos is own pos.

            // Maybe need some more specific tests for this function...?

            // Idea being that a px can only be within the bounds of the source image...
            //  That's the wrong assumption here.
            //   Maybe we need to define a movement bounds.
            //    The movement bounds can range outside of the source image's bounds - it's just that those OOB pixels won't / can't be copied over.










            if (pos[0] + size[0] < source_size[0]) {
                pos[0]++;
            } else {
                // Going to the next row seems like a big problem.
                //  Needs to go back to x pos 0 - the pos in the window.???
                //   Or some kind of offset center pos???




                if (pos[1] + size[1] < source_size[1]) {
                    pos[0] = 0;
                    pos[1]++;
                } else {
                    return false;

                }
            }

            if (this.source) {
                this.copy_from_source();
            }

            return pos;
        }
        // move_next_pixel

        /*
        // bytes_per_row
        ro(this, 'bytes_per_row', () => {
            
            return this.size[0] * this.bytes_per_pixel;
        });
        */
    }

    new_window(options) {
        //const {size} = options;

        //console.log('pb .new_window options', options);

        options.window_to = this;

        const res = new this.constructor(options);
        // automatic copy_from when it's constructed?

        res.copy_from_source();

        return res;


    }





    new_centered_window(size_or_options) {

        // size given as number...
        //  worth looking at args sig???

        const t1 = tf(size_or_options);
        console.log('t1', t1);

        // Centered window?
        //  may have better name for that....

        // .new_window???

        //  specifically defining movement bounds here would make a lot of sense.

        // pos_bounds
        //  so all .pos iteration would use these bounds.


        //  pos: ['centered-on', [0, 0]]





        // edge offsets...
        //  from source left edge       to the left of
        //  top edge                    above
        //  right edge                  to the right of
        //  bottom edge                 below


        // So yes, need to properly assign rows left and right, above and below, based on the size

        // Keep this as new_centered_window, its a nice enough name.



        let size;

        if (t1 === 'a') {

            if (size_or_options.length === 2) {
                size = new Int16Array([size_or_options, size_or_options]);
            } else {
                console.log('size_or_options', size_or_options);
                console.trace();
                throw 'Size array expected length: 2';
            }

        } else if (t1 === 'n') {
            size = new Int16Array([size_or_options, size_or_options]);
        } else {
            console.trace();
            throw 'NYI';
        }

        // Come up with the proper bounds.
        //  the pos_bounds
        //  Calculate the offset_from_center length?
        //   2 2d Vectors?
        //   Seems like we may need more values as it needs to cope with different +ve and -ve offsets from the center pos.
        //    Or could depend on rounding up or down?

        // Different option for centering a 4x4 block...
        //  .pos_center read-only property.
        //  
        //   could be set to different values if it can be different values, but not an illegal value?

        // Need to give full enough consideration to how the centering gets done when there is not a clear center row.

        //  center_down property...
        //   default as true. means centering goes towards the lower value.
        //    meaning the offset is greater on the +ve side.


        // could go for boolean property
        //  center_pos_low
        //   true (default) - [4, 4] has center pos of [1, 1]. offsets from center [-1, -1, 2, 2]


        // edge_offsets_from_center
        //  read-only property
        //  yes, would definitely make sense for windows.
        //   a ta property.

        // Quite a lot of detail needed for the various properties that are needed to effiently deal with all of this.





        // pos_center???
        //  make it read-only






        // Source
        //  Also system to translate from pos to source pos.
        //   Seems like we will need a vector or two.




        // window to this
        //  define its bounds as well.
        //  will get its pos_center value.
        //   will use that to determine how far the bounds need to be set
        //    use .edge_offset_from_center property as well.
        //     .edge_offsets_from_center being a read-only, ta property.
        //      use them for moving around a centered window
        //  source_px_center / source_px centered makes more sense.


        // source_px centering as a kind-of mode makes a lot of sense.
        //  moving pixel windows will use them
        //   underlying this will be pos_bounds.

        // set up source px centering, get pos_bounds set up automatically.
        //  integrate movement of a pb window within a source more into the core of the code.

        // pos_bounds property will sort out pos iteration.
        //  each_px?

        // Setting up / getting source iteration variables may be the best way, then use in a simpler (no fn call) loop.
        //  Maybe move_next_px is ok?

        // Direct access to typed arrays would be better as standard - easier porting to C++.



        // Better defined movement, what pos means?
        
        // pos as pos_within_source (or within frame / doc?) makes sense.

        // need an internal iteration pos too...

        // .pos is pos within source.
        // each_pos...
        // each_pos_within_source?
        //  each_source_pos?

        // each_pos
        //  works when the pos bounds are set
        //  when a source is set

        // each_pos_within_source
        //  clearer name

















        // each_source_px
        //  may be the right name for when we iterate through the source image, moving and copying per pixel.



        // .pos_within_source
        // .pos_bounds_within_source

        // .source_link(pos, pos_bounds)???

        




















        // Getting more interested in direct_reference mode.
        //  Where this does not maintain its own typed array copy.

        // but lets get 0.0.23 done soon.







        const res_pb = new this.constructor({
            size: size,
            bits_per_pixel: this.bits_per_pixel,
            window_to: this
        });

        // then set its pos_bounds to the get correct offsets (based on size and centering (rounding), as well as source size)
        
        // Its pos_bounds are used for iterating over the whole of the source image.

        // then do each_pos_px?
        //  each_px?

        // each_self_px, would also go over the corresponding source pixels?

        // each_source_px?
        //  and will use pos for the iteration...?

        // byte indexes will make for faster iteration.
        //  bit indexes (too) for bipp?










        // worth using mfp or similar?





    }



    // Could use internally set iteration / movement bounds.

    // Consider internal bounds and external bounds.
    //  Possible 2 or 3 properties of each.





    fill_solid_rect_by_bounds() {

        const bounds = this.ta_bounds;

        const bipp = this.bipp;

        if (bipp === 24) {

            const rgb = this.ta_rgb;

            //console.log('bounds', bounds);
            //console.log('rgb', rgb);


            // However, don't want the full row as scratch.
            //  Maybe better to create a new ta const here of the right size of the row of the data we are writing.

            // Could compare direct byte writing through iteration with row write iteration.
            //  Writing whole rows where possible definitely seems fastest in overview. In practise some less used functions in JS would be less optimized when compiled (JIT).

            // Does look like getting and using a bounds / byte iterator looks best here.
            //  byte index of the first pixel in the bounds
            //   byte width of the bounds

            const bytes_per_bounds_row = (bounds[2] - bounds[0]) * this.bypp;

            // bypbr - bytes per bounds row

            //console.log('bytes_per_bounds_row', bytes_per_bounds_row);

            // then can create a new temporary solid_row ta

            const solid_row = new Uint8ClampedArray(bytes_per_bounds_row);
            // fill it withthe pixels...

            // alternate rgb

            let cc = 0;

            for (let c = 0; c < bytes_per_bounds_row; c++) {
                solid_row[c] = rgb[cc];

                cc++;
                if (cc === 3) cc = 0;
            }

            //console.log('solid_row', solid_row);

            // then do the row-based iteration.
            //  will be simple usage of ta set(other_ta, offset)

            let write_byte_idx = bounds[0] * this.bypp + bounds[1] * this.bypr;
            //console.log('write_byte_idx', write_byte_idx);

            // then repeat through the rows in the bounds....
            //  advance the write_byte_idx by a row (this.bypr) each time.

            for (let i_row = bounds[1]; i_row < bounds[3]; i_row++) {
                this.ta.set(solid_row, write_byte_idx);

                write_byte_idx += this.bypr;
            }


            // should do the trick....








            //  iterate row: add the bypr value. seems easy







            // then do the fastest iteration through these bounds...

            //  could try doing row copy / create the first row, then copy that into all the rest?
            //   maybe use .ta_row or .ta_px_row which returns ta that holds data for a single row?
            //    or a ta_row_scratch (for the moment, and it's not used as a parameter for anything. scratch means its not 'officially' used, such as with ta_bounds and ta_rgb)

            // a scratch row would indeed be very useful.
            //  could check it's the right size before returning it.

            // Scratch row would definitely help when it comes to not creating more variables while fastest functions are running multiple times.





            // scratch rows delivered at other sizes (such as valid (overlapping) bounds size) could help a lot too.







        } else {
            console.trace();
            throw 'NYI';
        }

        



    }

    //move(ta_2d_vector) {

    //}

    // As a property in the constructor instead?
    //  Yes, would use local ta.

    /*
    get bounds() {
        const res = new Float32Array(4);
        const size = this.size;
        const pos = this.pos;
        res[0] = pos[0];
        res[1] = pos[1];
        res[2] = pos[0] + size[0];
        res[3] = pos[1] + size[1];
        return res;
    }
    */


    // source_target_iteration_prep???


    // copy_from_source_iteration_prep
    //  and could make other iteration prep functions too.


    // different bipp modes for copy from source too.


    // will return objects....
    //  a single object with keys and valus.
    //   will make use of the scratch typed arrays for holding the values.

    //  maybe creation of objecs is too much work? its one of the basics of JS though. keep for the moment.



    // ** Would be nice to use a more basic function referenced from outside of here.

    // change .bounds to .size_bounds?
    //  because it's the bounds given by its own pos and size?
    //  



    // size_bounds makes sense.
    //  so does pos_bounds

    //  so does center_pos_bounds_in_source???





    calc_source_target_valid_bounds_overlap() {

        //console.log('calc_source_target_valid_bounds_overlap');

        // possibly setting up .window_to will create more values that are useful for this type of copying.



        // bounds adjustment values too.

        // Really just adding and subtracting though. Maybe will make this simpler in the future???

        // using size and pos....

        //  this.pos

        // attempted source bounds

        // Could run a bounds check on the source.
        const source = this.source;

        
        // look at own bounds?

        //  this.bounds....

        //console.log('this.bounds', this.bounds);
        //console.log('source.size', source.size);
        //console.log('source.bounds', source.bounds);
        //console.log('source.size_bounds', source.size_bounds);

        // size_bounds? bounds based on the image size and not the image position.?
        //  the position of the source doesn't matter, but would influence the .bounds property.

        // size_bounds would just be the size starting with 0, 0.
        //  would then do calculation of the distance from this (window) .bounds to the source size_bounds.
        //   want to use very simple math on these tas where possible.
        //   will help compilation and usage of SIMD.

        // calc the overlap of the bounds.
        //  another bounds

        // also the offset from each edge?
        //  yet, think we need the this(window) to source pos translation vector.

        // use a scratch vector?

        // or a .ta_vector property?
        // .ta_vector_translation property?

        // lets use a scratch ta for the moment.
        //  position translation vector?
        //   ie the reverse of the position vector.

        // yes, reversing the position vector is the way to get the window -> source position translation vector.

        // so, just return the corrected bounds for the moment...?


        // bounds from what though?

        //  my size bounds? allow position bounds?
        //   still on a properties overhaul to get the convolution and window system working.

        const my_bounds = this.bounds_within_source;
        // see to what extent these bounds are allowed within the source.
        //  Possibly calc these things when a variety of properties are set.
        //   Need manual property updates in some cases / manually running functions that use updated properties (or typed array items).








        const source_size_bounds = source.size_bounds;

        // first bounds scratch?
        //  valid_corresponding_bounds scratch?

        const res = this.ta_bounds_scratch;
        if (my_bounds[0] < source_size_bounds[0]) {
            res[0] = source_size_bounds[0];
        } else {
            res[0] = my_bounds[0];
        }
        if (my_bounds[1] < source_size_bounds[1]) {
            res[1] = source_size_bounds[1];
        } else {
            res[1] = my_bounds[1];
        }
        if (my_bounds[2] > source_size_bounds[2]) {
            res[2] = source_size_bounds[2];
        } else {
            res[2] = my_bounds[2];
        }
        if (my_bounds[3] > source_size_bounds[3]) {
            res[3] = source_size_bounds[3];
        } else {
            res[3] = my_bounds[3];
        }

        return res;


















        // bounds adjustments / image translation...?
        //  want to get this in number of pixels.

        // be able to calculate a number of bytes int from a pixels vector.

        // will need to have translation vectors for both images?
        //  or have some read-write mechanism that doesn't need them?








        //throw 'stop';

        // bounds, source bounds

        // and the source size.









        //return {
        //    //source, target
        //}

    }


    // More standardised / understandable / understood iteration and bounds data in local tas.



    // ** reconsider function / rethink api.
    copy_from_source_iteration_prep() {

        const valid_bounds_overlap = this.calc_source_target_valid_bounds_overlap();
        //console.log('valid_bounds_overlap', valid_bounds_overlap); // source coords system.

        // translate from source to target using -1 * pos...

        //console.log('this.pos', this.pos);
        //console.log('this.minus_pos', this.minus_pos);

        const pos = this.pos;
        const bypp = this.bypp;

        // source_bounds
        // my_bounds

        const source_bounds = valid_bounds_overlap;
        const my_write_bounds = this.ta_bounds3_scratch;
        my_write_bounds[0] = source_bounds[0] - pos[0];
        my_write_bounds[1] = source_bounds[1] - pos[1];
        my_write_bounds[2] = source_bounds[2] - pos[0];
        my_write_bounds[3] = source_bounds[3] - pos[1];


        //console.log('source_bounds', source_bounds);
        //console.log('my_write_bounds', my_write_bounds);

        const bounds_size = this.ta_size_scratch;
        bounds_size[0] = source_bounds[2] - source_bounds[0];
        bounds_size[1] = source_bounds[3] - source_bounds[1];


        //console.log('bounds_size', bounds_size);

        // then both read and write offsets information.

        const offsets_info_source = this.source.ta_offsets_info_scratch;
        const offsets_info_self = this.ta_offsets_info_scratch;

        // a ta from each
        //  0 bounds row length in bytes
        //  1 bounds length in bytes

        //  2 bounds left byte index offset
        //  3 bounds top byte index offset
        //  4 bounds right byte index offset
        //  5 bounds bottom byte index offset ???? not needed???
        //   
        //  6 next bounds row number of bytes offset
        //   (used to move between source rows)

        //oi_self[0] = my_write_bounds * bypp;

        // the jump value... needs to use the source bypr.
        //  make bytes_per_row and bypr into a proper read-only property.




        offsets_info_self[0] = bounds_size[0] * bypp;

        // below number needs to make use of the source full row width.
        offsets_info_self[1] = bounds_size[0] * bounds_size[1] * bypp;

        // this.source.size[0] * bounds_size[1] * bypp;

        offsets_info_self[2] = my_write_bounds[0] * bypp;
        
        offsets_info_self[3] = my_write_bounds[1] * this.size[0] * bypp;


        offsets_info_self[4] = my_write_bounds[2] * bypp;
        offsets_info_self[5] = my_write_bounds[3] * offsets_info_self[0];

        offsets_info_self[6] = this.bytes_per_row - (offsets_info_self[4] - offsets_info_self[2]);


        //console.log('offsets_info_self', offsets_info_self);
        //console.log('this.bytes_per_row', this.bytes_per_row);
        // then the offsets info for the source.

        // with these, we should be very good to go for fast combined iteration / copying of source and target areas.
        //  then see how fast this can make convolutions and other operations.


        // Need to fix the write start pos.
        //  Some of these pieces of data here are too unclear.
        //  // write start pos = ... + bytes_per_row + row_num



        offsets_info_source[0] = bounds_size[0] * bypp;

        // 

        offsets_info_source[1] = bounds_size[0] * bounds_size[1] * bypp;

        // below number needs to take account of the full width.

        offsets_info_source[2] = source_bounds[0] * bypp;
        // source size (w)....
        offsets_info_source[3] = source_bounds[1] * this.source.size[0] * bypp;
        // change above line?
        // use:
        //  offsets_info_self[3] = my_write_bounds[1] * this.size[0] * bypp;
        

        offsets_info_source[4] = source_bounds[2] * bypp;
        offsets_info_source[5] = source_bounds[3] * offsets_info_source[0];


        // The full bytes per row...?
        //  Maybe no need to store this here.

        const source_bypr = this.source.bytes_per_row;
        //console.log('source_bypr', source_bypr);


        // next row bytes offset.
        //  bytes per row - start byte offset - end byte offset.

        // The offset to reach the next row - seems like one of the most important variables to have and use while doing this copy.
        //  Want to wrap the low level code in a way that makes it fast and convenient to use.





        offsets_info_source[6] = source_bypr - (offsets_info_source[4] - offsets_info_source[2]);

        //console.log('target next line advance bytes', offsets_info_self[6]);
        //console.log('source next line advance bytes', offsets_info_source[6]);

        //console.log('offsets_info_source', offsets_info_source);

        // prep containing all necessary items?

        //  a bounds iterator too? xy iterator?
        //   could get that later....


        // Want patterns / boilerplate for iterating various bounds in the most efficient way.

        // iteration info tas

















        // ta_pos_iterator
        // ta_iterator_pos
        //  would be very useful for x, y for loops
        //  while loops
        //  data locality and reuse of memory.

        // ta_offsets_info_scratch
        //  larger ta with space for up to 8(?) values
        //   



        // these should enable very fast iteration / copying between pixel buffers.
        //  will be able to iterate / increment relative values with very little overhead.






        //throw 'stop';

        // Got the source bounds
        // Got the write bounds

        // Need to get / calc the various byte offsets.
        //  Dealing with byte offsets is where the fastest ta access will be possible.

        // new row source byte offset...
        //  will be very useful for advancing to the next row.
        //   bypr - bytes per source bounds row.

        // so, need to get the row size.
        //  in pixels
        //  then in bytes

        // bounds to size function?

        // get another scratch ta
        //  the bounds size



        // and a minus_pos getter?
        //  better for translating from source to this.



        // calculate the byte positions in both the source and the target for that coordinate space.


        // source bounds, write bounds?

        // maybe no need right now.

        // does seem worth return the px info too.

        return {

            // info on byte positions / offsets.
            ta_info_source: offsets_info_source,
            ta_info_self: offsets_info_self,
            ta_bounds_size: bounds_size,
            ta_source_bounds: source_bounds,
            ta_write_bounds: my_write_bounds
        }
    }




    // Works quite quick... investigate optimizations further.
    copy_from_source() {

        // Having this inline may well be best.
        //  This does a row_copy algorithm.

        // Worth trying and benchmarking a version that operates differently, using an external function that's based around the maths, takes tas as params.







        // Copy from a position within the source.
        //  a different type of bounds to the movement bounds of the window within the source.




        // And any kind of offset?
        //  optional offset?
        //   and not pass i as a parameter?

        // Calculate the local and source bounds to do the copy.

        // Get the relavant info in terms of px as well as byte indexes.

        // Maybe should call functions specifically for mapping.


        // Iteration Prep:
        //  Make use of scratch and other tas. Dont initialise new typed arrays in this function call (except 1-time scratch init).

        // Then maybe call inner function once the prep has been done....
        //  Would help with inlining of simpler functions.


        // Lets make an outline version of this...

        // in ta-math.js


        const bipp = this.bipp;

        if (bipp === 1) {
            console.trace();
            throw 'NYI';
        } else if (bipp === 8 || bipp === 24 || bipp === 32) {
            const o_prep = this.copy_from_source_iteration_prep();

            // Maybe its a syncronised 2 pb iteration, same size (width? ) as pb2.

            // Worth working on more generalised copy function elsewhere?
            //  And an example called copy_rect?
            //   Copying rects between different tas.
            //    Want the lower level functionality to be really fast here.
            //    Easy to use higher level API too.

            // pb.copy_rect_to(rect_bounds, pb_target);
            // pb.copy_rect_from(rect_bounds, pb_source);






            //console.log('o_prep', o_prep);

            const {ta_bounds_size, ta_info_source, ta_info_self} = o_prep;

            // then lets do the iteration...

            const xy = this.source.ta_pos_iterator;

            const ta_source = this.source.ta;
            const ta = this.ta;

            // just iterate through the y dimension.
            //  set up / use pointer refs for the byte indexes to read / copy from and to.

            // maybe worth using ta.set(source.subset(a, b))
            //  would get the lengths right.

            // first row number..

            // do source -> target xy conversion.
            //  don't yet have the source -> target byte / bit index conversions.

            
            // vars for the current byte offsets?

            //  use ta_info_source / self item 7?
            //   would make sense, but maybe best to use local variables in some cases....


            // source, self bypr

            const bypr = this.bypr;
            const source_bypr = this.source.bypr;


            let i_byte_read = ta_info_source[2] + ta_info_source[3];

            // and the read length as well....

            // read length is the row length in bytes.

            // write to position 

            //  need to move the write position on??? on by the beginning of the write bounds (byte offset???)
            //   looks about right....
            let i_byte_write = ta_info_self[2] + ta_info_self[3];

            //console.log('i_byte_read', i_byte_read);
            //console.log('i_byte_write', i_byte_write);





            // .ta_read_idxs
            // .ta_write_idxs

            // The indexes by which we read and write the data to copy.

            const bytes_per_copy_row = ta_info_source[0];
            //console.log('bytes_per_copy_row', bytes_per_copy_row);






            // not so sure that the pointers are properly prepared and iterated...
            //  

            // The copy_row_then_skip algorithm.




            for (xy[1] = 0; xy[1] < ta_bounds_size[1]; xy[1]++) {

                // the source row.
                //  
                //console.log('xy[1]', xy[1]);


                // lets get the subarray....
                //  based on the read positions...
                //const sa = ta_source.subarray(i_byte_read, i_byte_read + bytes_per_copy_row);
                //ta.set(sa, i_byte_write);

                ta.set(ta_source.subarray(i_byte_read, i_byte_read + bytes_per_copy_row), i_byte_write);
                // reading looks like it's working OK...

                //console.log('sa', sa);
                //console.log('sa.length', sa.length);
                
                // then write it to the local ta....
                




                // advance i_byte_read and i_byte_write

                // just advance by a whole row.
                //  simple.

                i_byte_read += source_bypr;
                i_byte_write += bypr;

                //console.log('* ta', ta);




                //i_byte_read += ta_info_source[6] + bytes_per_copy_row;
                // write byte next row offset needs to be fixed.
                //  not quite sure why its being done incoorectly.

                //i_byte_write += ta_info_self[6] + bytes_per_copy_row;
            }

            //console.log('ta.length', ta.length);
        }

        // not quite sure why it's leaving blank space at the end of the dest ta.
        // Local, source
        //  bipp, bypp
        //  tl pos, br pos
        //   size
        //   bytes_per_row
        //  tl byte pointer, br byte pointer
        //   tl byte pointer, tr byte pointer reads the 1st line.

    }

    // copy_rect_by_bounds_to_24bipp(ta_bounds, pb_target)
    //  specific optimized version for 24 bipp.
    //   Would make a lot of sense to use that.

    // worth making the 8bipp version too soon.

    // do want to run rgb multichannel convolutions of course.
    //  see about image enlargement and enhancement.

    // image enlargement... try a pixel mapping algorithm that won't be all that complex?
    //  as in, for each result pixel, work out how many samples of which source pixels to take.
    //   result pixel would not have direct corresponsence with single source pixels, very often.
    //    think there would be a small square of 9 pixels where there would be overlap / possible overlap.
    //     work out the proportions based on a super-scaled resolution, don't need to use that much memory.







    // pb_window.copy_rect_by_bounds_to(window_bounds, pb_window);


    // Then will probably refine / simplify this function that gets made.
    //  Getting and using scratch arrays that get set up by their getter function...
    //   Adding more functionality to these scratch arrays so long as they work quickly.

    // The target should have has its pos set to -2, -2?
    //  Meaning its partially out of bounds of its source.
    
    // Need to be very accurate and efficient with all the bounds checking.

    // We will try making some more functions that do things like bounds checking while making use of the tas that are scratch or part of the objects.





    // Will keep this as an old version in the future, as it contains a lot of comments, ideas and code.
    //  Not all of it needed in one place.


    // Finding the safe bounds, based on target size and position, and the source size.
    //  target position refers to a position on the source.





    // Maybe change / remove this function.
    //  Have similar copy_from_source now.

    copy_rect_by_bounds_to_24bipp(ta_bounds, pb_target) {

        console.trace();
        throw 'NYI';

        const pos = this.ta_pos_scratch;
        // ta_size_scratch?
        //  could also be efficient and clear for storage of data during the running of an algorithm.

        // and a bounds scratch too?

        // various scratch tas could be effective for quickly running various algorithms.
        //  want the fastest JS perf, then port to C++ for faster perf still.

        // loop within the bounds...

        // worth calculating the size from the bounds as well.

        const rect_size = this.ta_size_scratch;


        rect_size[0] = ta_bounds[2] - ta_bounds[0];
        rect_size[1] = ta_bounds[3] - ta_bounds[1];
        //rect_size[0] = 1 + ta_bounds[2] - ta_bounds[0];
        //rect_size[1] = 1 + ta_bounds[3] - ta_bounds[1];


        console.log('rect_size', rect_size);

        // check that the rect size matches the target size.
        //  if so, got an optimized algorithm for it.

        // for loop of pos within the ta_bounds
        //  easy enough to loop between both of them

        // Maybe have a read byte pointer on the target?
        //  target.ta_pointers_scratch
        //   get 4? sized Uint32 array? Use that for a variety of numbers / variables / pointers in the inner working of a function?

        // these scratch objects will enable very fast operations by avoiding having to allocate more memory at many points in time.

        // .ta_further?

        // a pointers scratch would be useful?
        //  allowing up to 4 Uint32s to be stored...  8 bytes of memory isnt so bad.

        // pointers scratch?
        //  the pixel read position...?
        //   could do some clever incrementing of this value as well, when chaning row.

        // maybe a local variable is just fine / more efficient anyway?

        const ta_pointers = this.ta_pointers_scratch;

        // 0: byte index of pixel within source

        // and use a scratch from the target as well...
        // write position target pointer

        // got to make this very fast indeed in JS.

        const ta_target_pointers = pb_target.ta_pointers_scratch;

        console.log('ta_pointers', ta_pointers);
        console.log('ta_target_pointers', ta_target_pointers);

        // then can easily use the pointers for the byte positions.
        //  set the byte position of both of them according to the top left position as given by the bounds.
        //   maybe pointers are more important than calculating x, y positions?
        //    if we can bypass x and y (storage / calc?) and use the pointer positions we may be at an advantage?

        console.log('pos', pos);

        console.log('ta_bounds', ta_bounds);

        // get a bounds scratch as well.
        //  4 int16 values (accepts negatives).

        // use these ta ... scratch properties for the moment.

        // need to go through the image space from the source pb.

        const ta = this.ta;
        const ta_target = pb_target.ta;

        console.log('pb_target.pos', pb_target.pos);
        // The target pos should have been set up separately / automatially before?




        // const ta_adjusted_safe_bounds = this.ta_bounds_scratch
        // const ta_bounds_adjustment = this.ta_offset_scratch  (size 4)

        // using data stored in specific typed arrays will help process it quickly.
        //  




        // Using a few / plenty of scratch tas could help to keep the code from declaring new variables.



        // 


        // beginning the target pointer at the position of the beginning of the bounds...

        //  will need to check for x/y out of bounds errors anyway.
        //   likely need to do that with every pixel anyway?
        //    when reading from the source image...?
        //   or pre-calculate which are out of bounds, pre-fill with the out of bounds color, then process the area that's in bounds.
        //    that does seem like the fastest method with the fewest tests that need to be done on a per-pixel basis.
        //     and adjust the write positions?

        // Seems like doing this in a rather longwinded way does make sense.
        //  Want the fewest operations poss, done in a simple way (in general).

        // Finding the boundaries of the area that is within the source image bounds.
        //  Know what the offset between the given boundaries and allowed boundaries is.
        //  Only copy pixels within safe boundaries, to their positions within the safe boundaries.


        // Adjusted bounds, but then put into a slightly different position?
        //  As in when it's out of bounds, it just does not copy.

        // Do a for loop using the adjusted bounds.
        // These adjusted bounds will only cover a safe area of the image.

        // Bounds adjustments, also using these scratch tas, make sense.
        //  sometimes will need very fast copying between Pixel_Buffers.

        // do a bound adjusted copy.

        // safe bounds limits...
        //  then the bounds themselves...
        //  a secondary bounds scratch?

        // calculations on typed arrays would be of use too.
        //  both optimized and functional.





        const ta_safe_bounds_limits = this.ta_bounds_scratch;
        ta_safe_bounds_limits[0] = 0;
        ta_safe_bounds_limits[1] = 0;
        ta_safe_bounds_limits[2] = this.size[0];
        ta_safe_bounds_limits[3] = this.size[1];




        const ta_safe_adjusted_bounds = this.ta_bounds2_scratch;

        const ta_bounds_adjustments = this.ta_bounds3_scratch;

        // and a third bounds scratch ta for the adjustment values?
        //  do we need these for dealing with indexes?

        const ta_bounds_byte_offsets = this.ta_bounds3_scratch;




        // bounds adjustments values (x) needed for setting the index at the beginning of each row.


        //ta_safe_adjusted_bounds = 

        if (ta_bounds[0] >= ta_safe_bounds_limits[0]) {
            ta_safe_adjusted_bounds[0] = ta_bounds[0];
            ta_bounds_adjustments[0] = 0;
        } else {
            ta_bounds_adjustments[0] = ta_safe_bounds_limits[0] - ta_bounds[0];
            ta_safe_adjusted_bounds[0] = ta_safe_bounds_limits[0];
        }
        if (ta_bounds[1] >= ta_safe_bounds_limits[1]) {
            ta_safe_adjusted_bounds[1] = ta_bounds[1];
            ta_bounds_adjustments[1] = 0;
        } else {
            ta_bounds_adjustments[1] = ta_safe_bounds_limits[1] - ta_bounds[1];
            ta_safe_adjusted_bounds[1] = ta_safe_bounds_limits[1];
        }
        if (ta_bounds[2] <= ta_safe_bounds_limits[2]) {
            ta_safe_adjusted_bounds[2] = ta_bounds[2];
            ta_bounds_adjustments[2] = 0;
        } else {
            ta_bounds_adjustments[2] = ta_safe_bounds_limits[2] - ta_bounds[2];
            ta_safe_adjusted_bounds[2] = ta_safe_bounds_limits[2];
        }
        if (ta_bounds[3] <= ta_safe_bounds_limits[3]) {
            ta_safe_adjusted_bounds[3] = ta_bounds[3];
            ta_bounds_adjustments[3] = 0;
        } else {
            ta_bounds_adjustments[3] = ta_safe_bounds_limits[3] - ta_bounds[3];
            ta_safe_adjusted_bounds[3] = ta_safe_bounds_limits[3];
        }

        console.log('ta_safe_adjusted_bounds', ta_safe_adjusted_bounds);


        // Need to be specific about which offsets are used where.
        //  Will need to try different cases too.

        // A more efficient bits_per_pixel storage / getter?
        //  ta_bpp with both bipp and bypp
        //   and facade functions to access it.

        // Want to get this optimized to the fullest.


        // module level scratch as well?
        //  careful about multithreading then....




        console.log('ta_bounds_adjustments', ta_bounds_adjustments);

        // lets use a pixel read index in one of the tas.
        //  keep that up to date with each pixel?
        //   probably can do set from the row.

        // and update the write pixel location pointer too.
        //  will be able to set whole rows.
        //   not quite sure how fast that will be.

        // will work out the indexes of the start and end of each row from the source image.
        //  will use ta.set


        // bytes_per_row


        // use pointers ta for number of bytes per row.

        // source image bytes_per_row
        console.log('this.bytes_per_row', this.bytes_per_row);

        const source_bytes_per_row = this.bytes_per_row;
        const bypp = this.bypp;

        // the offset from the end of one row read from the source (according to the bounds) to the beginning of the next row to read from the source

        // byte offsets of bounds...

        // read byte offsets?
        //  source read byte offsets?


        // but what are these for?


        // want to calculate the start position of the first source byte to read.
        //  use the ta_safe_adjusted_bounds
        //   safe_adjusted_bounds_pixel_indexes?
        //    and they are pixel indexes based on the source image.

        // but also row widths in number of bytes.
        //  target.bytes_per_row
        

        // But most likely we want the read coords to be right at the top left.
        //  We do want to start at 0,0 on the source image, with the bounds system limiting how far right and down it reads to start with.

        // For the moment, it seems we need to get into more detail about what specific areas will be mapped,
        //  what indexes apply, and importantly what index increments apply when moving from pixel to pixel and then to the next row.

        // For loops mapping the target pixel to read.
        //  For the moment, use of scratch tas for these internal things will be best.

        // Maybe better to loop through the in-bounds pixels of the source pb.
        //  copy them to the target pb.

        // keeping track of variables is one of the most important things to get this working efficiently on a low level.



        // Seems worth redoing this in a focused way after all this writing....
        //  Could sum it up in a few parts.

        // 1) Calculate the in-bounds region (px) of the source image
        //     calculate its corresponding region (px) on the target image

        // 2) Calculate the row byte length of the in-bounds region

        //  source image - how many bytes to jump to the beginning of the next in-bound row.
        //  dest image - no row skip needed ??? (for the moment)

        //  offset of the beginning of each row (from the bounds) when reading from the source.

        // the y-dest-row-loop may work best?
        //  could try some different loop functions.
        //   easiest first and compare results.

        // Try the syncronised pointer update loop.

        // looping over dest_y.

        // the whole of the dest is within bounds?
        //  no, some of it may be referring to some out-of-bounds part of the source.

        // so loop over the dest rows that are within bounds.

        // ta_dest_area_within_source_safe_bounds
        //  so the bounds on the dest that match up with safe areas of the source.














        const adjusted_safe_bounds_source_read_byte_offsets = this.ta_offsets_scratch;
        adjusted_safe_bounds_source_read_byte_offsets[0] = ta_bounds_adjustments[0] * bypp;
        adjusted_safe_bounds_source_read_byte_offsets[1] = ta_bounds_adjustments[1] * source_bytes_per_row;
        adjusted_safe_bounds_source_read_byte_offsets[2] = ta_bounds_adjustments[2] * bypp;
        adjusted_safe_bounds_source_read_byte_offsets[3] = ta_bounds_adjustments[3] * source_bytes_per_row;

        console.log('adjusted_safe_bounds_source_read_byte_offsets', adjusted_safe_bounds_source_read_byte_offsets);



        const adjusted_safe_bounds_target_write_byte_offsets = pb_target.ta_offsets_scratch;
        // and the write offset...







        // And the safe bounds write offsets too.

        // Seems worth having all of this put into tas.
        //  Many functions seem to use a few structures which hold various forms of numbers for similar kinds of things. Can standardise and provent memory alloc / realloc.




        // loop through the rows that appear in the safe bounds
        //  calculate the byte indexes of the beginning and ends of each row?


        // Addition only may be faster.
        //  Try the algo only with increments.

        // Set up the start and end points of the first row, both reading and writing.

        // would be a pointer pair for each of them.

        const ta_pp_source_read = this.ta_pointerpair_scratch;
        const ta_pp_target_write = pb_target.ta_pointerpair_scratch;

        // then set these up before each line copy.

        

        // so can make pb_target.bytes_per_row the read width...


        //const row_byte_length = 

        // But only doing the safe copy.

        // May be best to set up and do the safe copy, row by row.
        //  But going by what's getting copied into the target pb, meaning leaving out anything that would be out of bounds there, or come from an out of bounds place in the source.

        // A moving window of some sort, set up with tas?


        // Maybe need to precompute some more values.

        // The bytes per row of the safe boundary range.

        const bytes_per_row_of_safe_bounds = (ta_safe_adjusted_bounds[2] - ta_safe_adjusted_bounds[0]) * bypp;

        console.log('bytes_per_row_of_safe_bounds', bytes_per_row_of_safe_bounds);


        ta_pp_source_read[0] = adjusted_safe_bounds_source_read_byte_offsets[0] + adjusted_safe_bounds_source_read_byte_offsets[1];
        // need to set it to a number that's within bounds of the source image.
        ta_pp_source_read[1] = ta_pp_source_read[0] + bytes_per_row_of_safe_bounds;




        ta_pp_target_write[0] = 0; // no, it's the left indent of the safe bounds.
        ta_pp_target_write[1] = ta_pp_target_write[0] + bytes_per_row_of_safe_bounds;


        console.log('ta_pp_source_read', ta_pp_source_read);
        console.log('ta_pp_target_write', ta_pp_target_write);

        // need to update this by the write offset...
        //  and maybe need some offset precalculation in bytes, for the target, with the bounds (safe adjusted bounds in use).
        //   need that to have accurate write positions.



        // A getter for bytes_per_row would be useful.



        console.log('pb_target.bytes_per_row', pb_target.bytes_per_row);

        // and then the number of rows to copy...
        //  will be able to iterate the pointers and do ta.set quite neatly.

        const num_rows_to_copy = ta_safe_adjusted_bounds[3] - ta_safe_adjusted_bounds[1];
        console.log('num_rows_to_copy', num_rows_to_copy);

        // Have a simple local variable to count the row number?
        //  Use incrementation to update the byte index values.

        for (let c = 0; c < num_rows_to_copy; c++) {
            // copy the row...

            // could set using a slice of the source...
            // or subarray.

            // .set using an offset and a subarray should work OK.

            // maybe pixel for loop would be faster anyway.

            const sa_source_row = ta.subarray(ta_pp_source_read[0], ta_pp_source_read[1]);
            console.log('sa_source_row', sa_source_row);







            //ta_target.set()


            // increment the pointers to point to the next row...


        }











        


        // .ta_bounds_info...
        //  larger ta that includes space for bounds intersection and safety options and info?


        

        //ta_pp_source_read[1] = ta_pp_source_read[0] + 





        // the source read 

        








        // ta_bounds_adjustments...
        //  but really need to go within / loop within the calculated safe bounds.

        // should be easy enough to loop through the in-range rows in the target image.
        //  ta_safe_adjusted_bounds

        // actually have the pos of the target set accurately to reflect its center point?
        //  it would be -2, -2 at size 5.










        // setup both the pointers for write and the pointers for read.



        // use another ta to hold the read row byte index bounds
        //  and another for the write row byte index bounds.

        // ta_pointerpair_scratch?
        //  just 2 of them makes more sense.



        // then work out the standard start and end points of the row in the data from the source???
        //  or we have the offsets to the start point already? the 0,0 point?

        // using a smallish bunch of named const typed scratch typed arrays makes sense here.

        // do the copying row by row.
        //  only think we need the y position. to be iterated?
        //   and work out the byte index variables, do the copying.
        //    optimized copying designed around the data structures.

        // the 4 points of the bounds in terms of pixel indexes would be useful
        //  or v edge values really, or lt, rb
        // with these we can do the row copy algorithm quickly.

        // probably best to do this using source and dest / dest and source byte indexes
        //  could use translations between them.

        // need to have the maths to do it for rows, or even better, whole blocks of rows, ie the necessary 2d image.

        // using byte array pointers for pixels may well speed operations up.
        //  its a lower level than coords.



        // have ta values available for the read and write byte pointers.
        //  row read pointer pair
        //  row write pointer pair

        // both pointer ranges - 2 pointers, sequential.

        // pointers here basically being array indexes.

        // uint32










        //  safe adjusted bounds byte offsets...
        //   can get another bounds scratch...?

        // These small scratch objects will work well with SIMD in the future.
        //  Working out the byte offsets from the different edges will be useful.

        // will use this.get_byte_index_from_pos_24bipp
        //  and other convenience / fast function.
        // Then could inline them.

        // functions that set a value to an existing typed array
        //   could be faster? give it the ta and the idx.

        // update_ta_with_px_byte_idx(ta, ta_idx, pos)

        // could work quickly that way.

        // would be worth testing different versions with different micro-optimizations.













        // ? row length of extraction in bytes

        // [0]: row beginning (source) byte index
        // [1]: row ending (source) byte index
        //ta_pointers[0] = 

        // copy it from the source row by row.








        
        // then calc what the safe bounds are...

        // safe bounds come from size of this....
        // min is 0, 0, max is w, h
        //  possibly by using quite a lot of ta variables things can work really fast.
        //  or more specific function calling...?



























        // use the adjusted bounds.
        //  and have the write index take into account necessary bounds adjustments.

        // Hopefully this function can still run very quickly indeed.
        //  Copy within the bounds
        //  Keep the read and write pointers both up-to-date, and use them



        // go within the safe adjusted bounds.

        for (pos[1] = ta_bounds[1]; pos[1] < ta_bounds[3]; pos[1]++) {
            // row start... worth setting the read byte pointer to the start of the row.
            //ta_pointers[0] = 



            // read the pixels in the row...


            //  worth setting 
            // row complete...
        }







        // Can easily and quickly use pos as the core of the iteration?
        //  Then calculate the edges with pos and ta_bounds

        // 
















        if (rect_size[0] === pb_target.size[0] && rect_size[1] === pb_target.size[1]) {
            // optimized...
            //  call a separate function?
            //  _24bipp_target_same_size?

            //  probably not needed for the moment...?
            //   smaller code paths result in more optimizations.

            console.log('rect_size matches target size.')



        }

        // 





    }

    copy_rect_by_bounds_to(ta_bounds, pb_target) {

        console.log('pb.copy_rect_by_bounds_to');

        const bipp = this.bipp;

        if (bipp === 24) {
            return this.copy_rect_by_bounds_to_24bipp(ta_bounds, pb_target)
        }

        // check its the same bipp on the target...
        //  could have optimized conversions in the future.

        // single for loop? while loop?
        //  double for?

        // Double for, using an already given ta for the pos.

        // maybe .ta_pos_scratch would do the job?
        //  lazy from oext? only provides the object (creates it) the first time it's asked.

        // want to be given a ta_pos?
        //  it be optional, and use a / the .ta_pos_scratch?

        

        // iterate through some new bounds?

        //  use the provided bounds?
        //  need to quickly be able to detect out of bounds.
        //   use if statement logic.

        // will use default colors / values when out of bounds.
        //  this will help convolutions work better.

        // two for loops, using the bounds and the pos
        //  detect out of bounds for both x and y
        //   if out of bounds, it's the default color
        //    (for source reading, fast byte index calculation from x, y?)

        // Copying (quickly) between array buffers?
        //  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/set

        // May be the fastest for copying over rows defined by blocks.
        //  Or making complete copies if we have the same width.

        // Consider using 8x8 pixel blocks to increase locality?


        // specialised loop for when the target size matches up with the size of the bounds?
        //  simpler iterations for the output position.
        //  

        // Can make a for loop that is very efficient for both arrays.


















        // output pixel index...?
        //  starts at 0 normally...

        // check that the target is the same as the size calculated from the bounds.





        // iterate pos1 from top bound to bottom bound
        //  iterate pos0 from left bound to right bound












    }



    // function to iterate a convolution window?
    //  could have a function to extract a rectangle as a small image
    //  but with a predefined Pixel_Buffer or underlying array.

    // Object reuse is important for some algorithms.

    // Maybe a function to directly do a blur convolution?
    //  Dont want some functions to be too abstract for perf reasons.

    // It's worth trying a variety of functions in a few ways.



    // a convolution window function may make most sense.
    //  give the convolution window buffer as a param, and it's a Pixel_Buffer?

    // that may be a faster way of updating data.
    //  even shift parameter of data views?
    //  for use loops to copy?
    //   copying probably wont take all that long. worth trying.



    // copying convolution window seems like one of the best ways.
    //  or provide all of the indexes to the points in a single array???
    //   need to deal with out of bounds as well.

    // reading a convolution window from each pixel.
    // get_window_centered_on_px(px_pos, window_size, optional pb_res_window)

    // So give it the pixel buffer for it to copy its result into.
    //  Seems like we will have fast convolutions before long.



    // and a convolution window loop function

    // Give it the pb_conv_window for it to work with

    

    // Could even give it the ta for positions as a parameter so it does not need to be passed in the callback function. Is that faster?


    // An easier to call function for convolutions?
    //  Callback will include various items such as the conv window?

    // The conv window could contain the pos though.

    // I do think that interlinking between Pixel_Buffers would work.

    // const pb_window = new Pixel_Buffer({size:..., window_to: pb, pos: [-1, -1]})
    //  pb_window.move_to(...)
    //  pb_window.move(...)

    //  Then it copies over the whole of its internal array when it's a window to another one?
    //   That would mean it acts as a cache.
    //    Convolution data would be more local to itself in memory, so possible / likely to run faster.


    // A Pixel_Buffer acting as a window_to another Pixel_Buffer looks like it would make the best coding style for this system, for convolutions at least.
    //  It could be very fast. Will be great to find out.



















    each_px_convolution(ta_size, pb_conv_window, ta_pos, callback) {


        throw 'NYI';
        // const ta_size = new Uint16Array(2);
        ta_pos[0] = 0;
        ta_pos[1] = 0;

        //console.log('ta_size', ta_size);


        // Would 4 levels of loop for a moving convolution window be too much?
        

        // Looping x and y should be OK.
        //  dealing with out of bounds.


        // Will find out how long loops take vs how long memory allocation takes
        //  also will check algorithms for amount of memory copying used.
        //   and size of area it copies memory to.


        // Could have a get_conv_window(pos, size) function.
        //  and would return a conv window object cached for that size?

        // Or write conv window to a ta?
        //  Updating a Pixel_Buffer with the conv_window makes a lot of sense.




        //  maybe that would work OK.
        //  and do it in a very fp way?








        // rectangular sizes?
        //  may as well support them at the moment.

        // should be able to work with different bipp.
        //  may be just worth implementing it for 8bipp to start with.

        // 1 bit per pixel image manipulation is now working nicely.
        //  pixel reducer functions?

        // Possibly different functions for different bipp would work best.

        // Have been given pb_conv_window already.

        if (are_equal(pb_conv_window.size, ta_size)) {

        } else {
            // Sizes need to be equal.

        }






    }
















    

    // Threshold above, below, equal?
    //  Could be in the options?
    //   Threshold passes whats above.
    get_1bipp_threshold_8bipp(ui8_threshold) {
        const bipp = this.bits_per_pixel;

        if (bipp === 8) {
            const res = new this.constructor({
                bits_per_pixel: 1,
                size: this.size
            });
            const rta = res.ta;
            const ta = this.ta;

            const cpx = this.num_px;

            let i_px = 0;

            // Probably best to do the bit modification inline.
            //  Won't take all that much code.
            //  Worth having it optimized.

            // Go through it pixel by pixel.
            //  calculate if its on or off
            //  calculate the byte and the necessary bit modification to set it.
            
            // Or as blocks of 8, building up an integer?
            //  Is that the same really?

            // Could take 8 pixel strides in the source image, building up a 1 byte in size value to use.
            //  Building them up byte by byte and then assigning them to the array?
            //  Could be faster as there would be more frequent writes to the same variable / pointer location.

            // Or with each byte, need to deal with it in descending order (getting this wrong???)

            // keeping track of the dest byte and dest bit

            let i_dest_byte = 0, i_dest_bit = 7;
            // start in reverse...
            //  That seems to be right because the first pixel is the most significant in terms of bits.


            // but the bit significance needs to be reversed within the byte.
            //  will need changes elsewhere.

            // ta[i_px];

            let meets_threshold = false;

            let out_byte = 0;

            while (i_px < cpx) {
                meets_threshold = ta[i_px] >= ui8_threshold;
                // 
                if (meets_threshold) {
                    // it's 2 to the power of i_dest_bit
                    // Could optimize with a powers array. (maybe).
                    out_byte = out_byte | Math.pow(2, i_dest_bit)

                } else {

                }
                i_px++;
                i_dest_bit--;
                if (i_dest_bit === -1) {
                    //console.log('out_byte', out_byte);
                    rta[i_dest_byte] = out_byte;

                    // put the number in place?

                    i_dest_bit = 7;
                    i_dest_byte++;
                    out_byte = 0;
                }
            }
            // then the rest once complete?
            return res;

        } else {
            console.trace();
            throw 'get_1bipp_threshold_8bipp: Unsupported bits_per_pixel ' + bipp;
        }


    }

    to_24bipp() {

        // Creates another one
        //  Consider how the other one could act as a window, but with a different number of channels.
        //   Would need specific optimized copy function.





        const bipp = this.bits_per_pixel;
        const bypp = this.bytes_per_pixel;
        let i_px = 0;
        const num_px = this.size[0] * this.size[1];
        //console.log('to_24bipp bipp', bipp);
        if (bipp === 1) {
            const res = new this.constructor({
                size: this.size,
                bits_per_pixel: 24
            })
            let i_byte = 0;
            const num_bytes = this.ta.length;
            // iterate through the bits?
            // could have a fast processing algorithm that's written out a bit longer, using &.
            // go through it byte by byte makes sense in a way.

            while (i_byte < num_bytes) {
                // iterate through pixel numbers too...
                // need to set the result points.
                // do this 8 times...
                for (var b = 0; b < 8; b++) {
                    const color = this.get_pixel_by_idx_1bipp(i_px) === 1 ? new Uint8ClampedArray([255, 255, 255]) : new Uint8ClampedArray([0, 0, 0]);
                    res.set_pixel_by_idx_24bipp(i_px++, color);
                }
                i_byte++;
                // pixel by pixel... not as efficient this way.
            }
            return res;
        } else if (bipp === 8) {
            const res = new this.constructor({
                size: this.size,
                bits_per_pixel: 24
            });

            // r, g, b all the same.



            return res;

        } else if (bipp === 24) {
            return this.clone();
        } else if (bipp === 32) {
            const res = new this.constructor({
                size: this.size,
                bits_per_pixel: 24
            })
            // will remove the channel.
            // iterate through each pixel?

            while (i_px < num_px) {
                const col_32 = this.get_pixel_by_idx_32bipp(i_px)
                i_px += bypp;
            }

            return res;

        }

    }

    toString() {
        /*
        size: Uint32Array [ 1024, 576 ],
        bits_per_pixel: 32,
        bytes_per_pixel: 4,
        bytes_per_row: 4096 }
        */
        return JSON.stringify({
            buffer: 'Uint8ClampedArray length ' + this.buffer.length,
            size: this.size,
            bits_per_pixel: this.bits_per_pixel,
            bytes_per_pixel: this.bytes_per_pixel,
            bytes_per_row: this.bytes_per_row
        });
    }
    /*
    [inspect]() {
        return 'Pixel_Buffer_Core ' + this.toString();
    }
    */

    // Awareness of a pixel buffer itself having a position.

    

    // index_to_pos function...
    // buffer index - posin buffer - could be called pixel_buffer_index
    // pixel index - could be called pixel number

    /*
    index_to_pos(idx) {
        // idx = bpp * (x + (y * w))
        // idx / bpp = x + (y * w)
        // (idx / pbb) - (y * w) = x
        // x = (idx / pbb) - (y * w)

        // x = (idx / pbb) - (y * w)
        // x - (idx / pbb) = -(y * w)
        // -x + (idx / pbb) = y * w
        // -x + (idx / pbb) / w = y
        // y = ((idx / pbb) / w ) - x
        // above looks wrong.
    }
    */

    // Could call more specific addon functions?
    // More general addon functions?

    color_whole(color) {
        // if color a number or typed array?
        //throw 'stop';
        //console.log('this.bytes_per_pixel', this.bytes_per_pixel);

        // 0.125 - 1/8 bytes per pixel

        if (this.bytes_per_pixel === 1) {
            // expect a value

            const ta_32_scratch = new Uint32Array(12);
            //console.log('this.size', this.size);
            ta_32_scratch[0] = this.size[0] * this.size[1];
            const buf = this.buffer;
            let i;
            for (i = 0; i < ta_32_scratch[0]; i++) {
                buf[i] = color;
            }
            //console.log('ta_32_scratch[0]', ta_32_scratch[0]);
        } else if (this.bytes_per_pixel === 3) {
            const ta_32_scratch = new Uint32Array(12);
            ta_32_scratch[0] = this.size[0] * this.size[1] * 3;
            const buf = this.buffer;
            let i, c = 0;
            for (i = 0; i < ta_32_scratch[0]; i++) {
                buf[c++] = color[0];
                buf[c++] = color[1];
                buf[c++] = color[2];
            }

        } else if (this.bytes_per_pixel === 4) {
            const ta_32_scratch = new Uint32Array(12);
            ta_32_scratch[0] = this.size[0] * this.size[1] * 4;
            const buf = this.buffer;
            let i, c = 0;
            for (i = 0; i < ta_32_scratch[0]; i++) {
                buf[c++] = color[0];
                buf[c++] = color[1];
                buf[c++] = color[2];
                buf[c++] = color[3];
            }
        } else {
            throw 'Unsupported this.bytes_per_pixel: ' + this.bytes_per_pixel;
        }
        return this;
    }

    crop(size) {
        let new_size = new Uint16Array([this.size[0] - size * 2, this.size[1] - size * 2]);
        let res = new this.constructor({
            bytes_per_pixel: this.bytes_per_pixel,
            size: new_size
        });
        if (this.pos) {
            res.pos = new Int16Array([this.pos[0] - size, this.pos[1] - size])
        }
        //if (this.pos) res.pos = this.pos;
        this.each_pixel_ta((pos, color) => {
            const new_pos = new Int16Array([pos[0] - size, pos[1] - size]);
            if (new_pos[0] >= 0 && new_pos[0] < new_size[0] && new_pos[1] >= 0 && new_pos[1] < new_size[1]) {
                //res.set_pixel_ta(new_pos, color);
                res.set_pixel_ta(new_pos, color);
            }
        });
        return res;
    }

    uncrop(size, color) {
        let res = new this.constructor({
            bytes_per_pixel: this.bytes_per_pixel,
            size: new Uint16Array([this.size[0] + size * 2, this.size[1] + size * 2])
        })
        if (this.pos) res.pos = this.pos;
        if (this.pos) {
            //res.pos = new Int16Array([this.pos[0] + size, this.pos[1] + size])
        }
        res.color_whole(color);
        console.log('size', size);
        this.each_pixel_ta((pos, color) => {
            //console.log('pos', pos);
            res.set_pixel_ta(new Uint16Array([pos[0] + size, pos[1] + size]), color);
            //res.set_pixel_ta(new Uint16Array([pos[0], pos[1]]), color);
        })
        return res;
    }

    // define the bounds, expect UInt16 array

    // bounds ltrb
    // pos and size?

    color_rect(bounds, color) {
        // ltrb
    }
    // couldn't we do a simpler for loop throughout the length.

    // Could use a for loop looping through pixel indexes elsewhere.

    each_pixel_index(cb) {
        const buf = this.buffer, l = buf.length, bpp = this.bytes_per_pixel;
        for (let c = 0; c < l; c += bpp) {
            cb(c);
        }
    }

    // then will want to do translations on pixel indexes.
    //  can have a translation list.
    //  pixel pos list used as offsets
    //  index array rather than pixel pos list too.

    // Could make shorter and more general version.
    padded_each_pixel_index(padding, cb) {
        const ta_32_scratch = new Uint32Array(9);
        ta_32_scratch[0] = this.bytes_per_pixel;
        ta_32_scratch[1] = 0; // i
        ta_32_scratch[2] = this.size[0] - padding;
        ta_32_scratch[3] = this.size[1] - padding;

        ta_32_scratch[7] = this.size[0];
        //ta_32_scratch[8] = 
        // 4 = x
        // 5 = y
        //let y, x, i;
        // a px typed array... could give actual access to that typed array / view.
        //const w = this.size[0],
        //    h = this.size[1];
        //const buf = this.buffer;
        const bpp = this.bits_per_pixel;

        if (bpp === 32) {
            ((cb) => {
                for (ta_32_scratch[5] = padding; ta_32_scratch[5] < ta_32_scratch[3]; ta_32_scratch[5]++) {
                    for (ta_32_scratch[4] = 0; ta_32_scratch[4] < ta_32_scratch[2]; ta_32_scratch[4]++) {
                        //ta_32_scratch[1] = (ta_32_scratch[5] * this.size[0] + ta_32_scratch[4]) * ta_32_scratch[0];
                        cb((ta_32_scratch[5] * ta_32_scratch[7] + ta_32_scratch[4]) * ta_32_scratch[0]);
                        //ta_32_scratch[1] += 4;
                    }
                }
            })(cb);
        }
        if (bpp === 24) {
            ((cb) => {
                for (ta_32_scratch[5] = padding; ta_32_scratch[5] < ta_32_scratch[3]; ta_32_scratch[5]++) {
                    for (ta_32_scratch[4] = 0; ta_32_scratch[4] < ta_32_scratch[2]; ta_32_scratch[4]++) {
                        //ta_32_scratch[1] = (ta_32_scratch[5] * this.size[0] + ta_32_scratch[4]) * ta_32_scratch[0];
                        cb((ta_32_scratch[5] * ta_32_scratch[7] + ta_32_scratch[4]) * ta_32_scratch[0]);
                        //ta_32_scratch[1] += 3;
                    }
                }
            })(cb);
        } else if (bpp === 8) {
            ((cb) => {
                for (ta_32_scratch[5] = padding; ta_32_scratch[5] < ta_32_scratch[3]; ta_32_scratch[5]++) {
                    for (ta_32_scratch[4] = 0; ta_32_scratch[4] < ta_32_scratch[2]; ta_32_scratch[4]++) {
                        cb((ta_32_scratch[5] * ta_32_scratch[7] + ta_32_scratch[4]) * ta_32_scratch[0]);
                        //ta_32_scratch[1] += 1;
                    }
                }
            })(cb);
        }
    }


    // Efficient Tensor processing could be used for this, in another version.

    // pos and subpos with 1bipp? or have intervals on 0.125.???

    // Shuld return the color too?

    // Accept the pos ta as an option?
    //  So it does not need to call the cb function with it, saving allocation???

    // Will go for more flexibility as well as optimization.

    each_pixel_pos(cb) {
        //const bpp = this.bytes_per_pixel;
        const b = this.size;
        const pos = new Int16Array(2);
        for (pos[1] = 0; pos[1] < b[1]; pos[1]++) {
            for (pos[0] = 0; pos[0] < b[0]; pos[0]++) {
                // and the color value
                cb(pos);
            }
        }
    }

    // Some kinds of pixel iteration functions that only work by reference?
    //  Or that do work by reference as well?

    // pixel indexes as well as the positions?
    //  do want a function that reads / provides the pixel values.

    // Putting the pixel value into a typed array does make sense.
    //  As well as using slice(a, b) on the typed array that initially holds the pixel.


    // each_px(ta_pos, ta_px_value, ta_info, cb)
    //  could wind up being very efficient.
    // each_px(ta_pos, ta_px_value, cb)
    //  and the callback can be called with no parameters
    //  also hold the byte index? bit index within byte?
    //   bit overall? The bit number of any value could be an effective means of indexing.

    // And would also have a different each_px (inner) function specific to the number of bipp.

    // if fast enough, each_px could work as the basis for a convolution.
    //  would also read the window around each px.
    //  a moving convolution window implemented in a fast and oo way would be very useful.


    // Functions that operate only on the typed arrays they are given. Callback has no params of its own.
    //  Lets give it a go.

    each_ta_24bipp(ta_pos, ta_px_value, ta_info, callback) {
        // worth doing an x and y loop?
        //  and then also do integer incrementing

        // Can we set details of the array view for the ta px value?
        //  Lets copy the pixel values for the moment.

        const bipp = this.bipp;
        if (bipp === 24) {

            // Check the parameter TAs are OK.
            //  Make necessary assignments.

            // the size within ta_info

            //ta_px_value being Uint8 clamped or unclamped array
            //  length 3 or more. we only use 1st 3.
            // could do this without allocating any variables at all?
            //  

            //let input_params_are_valid = true;


            //let arr_param_errs = []

            //if (!(ta_pos instanceof UInt16Array)) {
            //    input_params_are_valid = false;
            //}

            // Positions should be int arrays.
            //  More flexibility there, allowing for negative positions, and possibility of using these data structures to store offsets.

            //console.log('ta_pos', ta_pos);
            //throw 'stop';


            if (ta_pos instanceof Int16Array || ta_pos instanceof Int32Array && ta_pos.length >= 2) {

                // only accept clamped ui8 array for the moment?

                if (ta_px_value instanceof Uint8ClampedArray && ta_px_value.length >= 3) {

                    // r, g, b

                    // these values stored as 32 bit.
                    //  can still have quite large bit addresses. 512mb limit???

                    // or use larger float ta type?
                    //  32 bit int for the moment?
                    //  bigint?

                    if (ta_info instanceof Uint32Array && ta_info.length >= 4) {
                        // img w, img h, pixel index (num), bipp

                        // for loop over all...
                        //  set these two to the size.



                        const ta = this.ta;

                        ta_info[0] = this.size[0];
                        ta_info[1] = this.size[1];
                        ta_info[2] = 0;
                        ta_info[3] = 24; // bipp;

                        const update = () => {
                            ta[ta_info[2] * 3] = ta_px_value[0];
                            ta[ta_info[2] * 3 + 1] = ta_px_value[1];
                            ta[ta_info[2] * 3 + 2] = ta_px_value[2];

                        }

                        for (ta_pos[1] = 0; ta_pos[1] < ta_info[1]; ta_pos[1]++) {
                            for (ta_pos[0] = 0; ta_pos[0] < ta_info[0]; ta_pos[0]++) {
                                ta_px_value[0] = ta[ta_info[2] * 3];
                                ta_px_value[1] = ta[ta_info[2] * 3 + 1];
                                ta_px_value[2] = ta[ta_info[2] * 3 + 2];
                                
                                callback(update);
                                ta_info[2]++;
                            }
                        }

                        //  pixel num = bit index / bipp
                        //   have a pixel num variable too?
                        //    could be convenient.
                        //     maybe more convenient than bit index.
                        //  pixel num would be simpler / easier than bit_index in many cases.

                    }



                    // ta_info
                    //  width
                    //  height
                    //  bit index of current pixel
                    //  bipp (but we know that's 24???)
                    //   nice to set a value for it.

                }
            }



        } else {
            throw 'each_ta_24bipp error: bipp must be 24, bipp: ' + bipp;
        }


    }

    // Will make more utility tas that can be set to get iteration working well?
    //  Or keep them updated upon some other changes.


    // tas available on setup... on move (pos change).
    // tas that need to be calculated before a specific operation



    // should not use this.pos ta for iterating inside.

    // .xy?
    
    // Probably do need better differentiation between position variables.


    // More explicit naming here does make a lot of sense.



    // pos_within_source_window_bounds
    // pos_within_source_window

    // pos_within_source_window.bounds ???
    //  makes for more complex typed arrays, less like basic C / C++ arrays. Dont do this right now. May be an option for nice JS API but dont go this direction now.

    // May be worth writing up progress in Github issues.
    //  What is planned for a release
    //    Further analysis / written work on plans
    //  Progress of those items (can copy and paste simple / formatted checklist)
    //  Closing the issue once the release has been published to npm and github.
    //   Or as a Github Project or part of one.










    //  



    each_px(ta_pos, ta_px_value, ta_info, callback) {


        const bipp = this.bipp;

        //console.log('bipp', bipp);

        if (bipp === 1) {
            return this.each_ta_1bipp(ta_pos, ta_px_value, ta_info, callback);
        } else if (bipp === 8) {
            return this.each_ta_8bipp(ta_pos, ta_px_value, ta_info, callback);
        } else if (bipp === 24) {
            return this.each_ta_24bipp(ta_pos, ta_px_value, ta_info, callback);
        } else if (bipp === 32) {
            return this.each_ta_32bipp(ta_pos, ta_px_value, ta_info, callback);
        } else {
            console.trace();
            throw 'Unsupported bipp: ' + bipp;
        }


        // should have 4 arguments?

        // ta info will include the image size
        // 

        // ta_info should hold ints? uints?

        // Uint32Array size 4 or greater.

        // ta_pos - Uint32 or 16 Array size 2 (or greater?)
        // ta_px_value Uint8 (Clamped) array relevant bytes per pixel size
        //  (or size 1 when it's 1 bit per pixel)



        // info:
        //  image width
        //  image height
        //  bits per pixel
        //  pixel bit index  (/8 for the byte index)
        //   (can get the pos from this as well with a calculation involving bipp and width)

        // callback will be called without any parameters!
        //  lets see how fast it is...





    }





    //  







    // each_pixel_ta
    //  will return a typed array for each pixel.

    /*
    each_pixel_ta(cb) {


        // will use bipp

        // Be able to quickly go through 1bipp images.



        const bpp = this.bytes_per_pixel;
        if (bpp === 1) {
            (() => {
                const pos = new Int16Array(2);
                const a = new Uint32Array(2);
                const b = new Uint16Array(2);
                const sc = new Uint32Array(4);
                const buf = this.buffer;

                // Would be better to use an underlying typed array.

                //const buf = this.buffer;
                b[0] = this.size[0];
                b[1] = this.size[1];

                // the index as well...
                a[0] = 0;
                sc[0] = 0; // index
                for (pos[1] = 0; pos[1] < b[1]; pos[1]++) {
                    for (pos[0] = 0; pos[0] < b[0]; pos[0]++) {
                        // and the color value
                        cb(pos, buf[sc[0]++]);
                    }
                }
            })();

        } else if (bpp === 4) {
            (() => {
                const pos = new Int16Array(2);
                const a = new Uint32Array(2);
                const b = new Uint16Array(2);
                const sc = new Uint32Array(4);
                const buf = this.buffer;
                // Would be better to use an underlying typed array.

                //const buf = this.buffer;
                b[0] = this.size[0];
                b[1] = this.size[1];
                // the index as well...
                a[0] = 0;
                sc[0] = 0; // index

                // Recycle the result typed array for each pixel???

                for (pos[1] = 0; pos[1] < b[1]; pos[1]++) {
                    for (pos[0] = 0; pos[0] < b[0]; pos[0]++) {
                        // and the color value
                        cb(pos, new Uint8Array([buf[sc[0]++], buf[sc[0]++], buf[sc[0]++], buf[sc[0]++]]));
                    }
                }
            })();

        } else {
            throw 'Unsupported bpp ' + bpp;
        }
    }
    */

    // Maybe redo for conciseness and generalised principles? Inner functions for optimization?
    // ta_pixel

    // Will return a ta by default when appropriate for the color.

    /*
    each_pixel(cb) {
        // y loop
        // x loop

        const ta_32_scratch = new Uint32Array(6);
        ta_32_scratch[0] = this.bytes_per_pixel;
        ta_32_scratch[1] = 0; // i
        ta_32_scratch[2] = this.size[0];
        ta_32_scratch[3] = this.size[1];
        // 4 = x
        // 5 = y
        //let y, x, i;
        // a px typed array... could give actual access to that typed array / view.
        //const w = this.size[0],
        //    h = this.size[1];
        const buf = this.buffer;
        const bpp = this.bits_per_pixel;

        if (bpp === 32) {
            for (ta_32_scratch[5] = 0; ta_32_scratch[5] < ta_32_scratch[3]; ta_32_scratch[5]++) {
                for (ta_32_scratch[4] = 0; ta_32_scratch[4] < ta_32_scratch[2]; ta_32_scratch[4]++) {
                    cb(ta_32_scratch[4], ta_32_scratch[5], buf[ta_32_scratch[1]++], buf[ta_32_scratch[1]++], buf[ta_32_scratch[1]++], buf[ta_32_scratch[1]++]);
                }
            }
        }
        if (bpp === 24) {
            for (ta_32_scratch[5] = 0; ta_32_scratch[5] < ta_32_scratch[3]; ta_32_scratch[5]++) {
                for (ta_32_scratch[4] = 0; ta_32_scratch[4] < ta_32_scratch[2]; ta_32_scratch[4]++) {
                    cb(ta_32_scratch[4], ta_32_scratch[5], buf[ta_32_scratch[1]++], buf[ta_32_scratch[1]++], buf[ta_32_scratch[1]++]);
                }
            }
        } else if (bpp === 8) {
            for (ta_32_scratch[5] = 0; ta_32_scratch[5] < ta_32_scratch[3]; ta_32_scratch[5]++) {
                for (ta_32_scratch[4] = 0; ta_32_scratch[4] < ta_32_scratch[2]; ta_32_scratch[4]++) {
                    cb(ta_32_scratch[4], ta_32_scratch[5], buf[ta_32_scratch[1]++]);
                }
            }
        }
    }

    */

    /*
    padded_each_pixel(padding, cb) {
        // y loop
        // x loop

        const ta_32_scratch = new Uint32Array(7);
        ta_32_scratch[0] = this.bytes_per_pixel;
        ta_32_scratch[1] = 0; // i
        ta_32_scratch[2] = this.size[0] - padding;
        ta_32_scratch[3] = this.size[1] - padding;

        // 4 = x
        // 5 = y
        //let y, x, i;
        // a px typed array... could give actual access to that typed array / view.
        //const w = this.size[0],
        //    h = this.size[1];
        const buf = this.buffer;
        //console.log('buf', buf);
        //console.log('this.bytes_per_pixel', this.bytes_per_pixel);
        //console.log('ta_32_scratch[0]', ta_32_scratch[0]);

        if (ta_32_scratch[0] === 3) {
            for (ta_32_scratch[5] = padding; ta_32_scratch[5] < ta_32_scratch[3]; ta_32_scratch[5]++) {
                for (ta_32_scratch[4] = padding; ta_32_scratch[4] < ta_32_scratch[2]; ta_32_scratch[4]++) {
                    ta_32_scratch[1] = ta_32_scratch[6] = (ta_32_scratch[5] * this.size[0] + ta_32_scratch[4]) * ta_32_scratch[0];
                    cb(ta_32_scratch[4], ta_32_scratch[5], buf[ta_32_scratch[1]++], buf[ta_32_scratch[1]++], buf[ta_32_scratch[1]++], ta_32_scratch[6]);
                }
            }
        } else if (ta_32_scratch[0] === 4) {
            for (ta_32_scratch[5] = padding; ta_32_scratch[5] < ta_32_scratch[3]; ta_32_scratch[5]++) {
                for (ta_32_scratch[4] = padding; ta_32_scratch[4] < ta_32_scratch[2]; ta_32_scratch[4]++) {
                    ta_32_scratch[1] = ta_32_scratch[6] = (ta_32_scratch[5] * this.size[0] + ta_32_scratch[4]) * ta_32_scratch[0];
                    cb(ta_32_scratch[4], ta_32_scratch[5], buf[ta_32_scratch[1]++], buf[ta_32_scratch[1]++], buf[ta_32_scratch[1]++], buf[ta_32_scratch[1]++], ta_32_scratch[6]);
                }
            }
        } else {
            throw 'Not supported: ' + ta_32_scratch[0] + ' bytes per pixel';
        }
    }
    */
    paint_pixel_list(pixel_pos_list, color) {
        pixel_pos_list.each_pixel(pos => {
            //console.log('typeof pos', typeof pos);
            //console.log('pos', pos);
            //console.log('color', color);
            //console.log('pos, color', pos, color);
            this.set_pixel_ta(pos, color);
        });
    }

    // Will have more advances get_pixel too.
    //  get_pixel_by_idx


    // set_pixel_1bipp, set_pixel_8bipp, set_pixel_24bipp, set_pixel_32bipp

    'set_pixel_1bipp'(pos, color) {
        // color should be 1 or 0
        // on or off.
        
        //console.log('set_pixel_1bipp');
        //console.log('pos', pos);

        const val = !!color;
        // get the pixel index....

        const idx = pos[1] * this.size[0] + pos[0];
        const byte = Math.floor(idx / 8);

        // 7 - idx % 8 ???
        const bit = 7 - (idx % 8);

        //console.log('byte, bit', [byte, bit]);

        // use roots of some sort?

        const pow = Math.pow(2, bit);
        //console.log('pow', pow);

        const byte_val = this.ta[byte];
        //console.log('byte_val', byte_val);


        /*
        if (byte_val < pow) {
            //this.ta[byte] += pow;
        } else {
            //this.ta[byte] -= pow;
        }
        */

        if (val) {
            this.ta[byte] = this.ta[byte] | pow;
        } else {
            this.ta[byte] = this.ta[byte] & pow;
        }
        //console.log('this.ta[byte]', this.ta[byte]);
        // 0: 
        // Think this works now :)
    }
    // this.buffer[this.bytes_per_pixel * (pos[0] + pos[1] * this.size[0])] = color;
    'set_pixel_8bipp'(pos, color) {
        // color should be 1 or 0
        // on or off.
        //const val = !!color;
        // get the pixel index....
        const idx = pos[1] * this.size[0] + pos[0];
        //const byte = Math.floor(idx / 8);
        //const bit = idx % 8;

        //console.log('byte, bit', [byte, bit]);

        this.ta[idx] = color;
    }
    'set_pixel_24bipp'(pos, color) {
        // color should be 1 or 0
        // on or off.

        //const val = !!color;
        // get the pixel index....

        const idx = pos[1] * this.size[0] + pos[0];
        const byte = idx * 3;
        //const bit = idx % 8;

        //console.log('byte, bit', [byte, bit]);

        this.ta[idx] = color[0];
        this.ta[idx + 1] = color[1];
        this.ta[idx + 2] = color[2];
    }
    'set_pixel_32bipp'(pos, color) {
        // color should be 1 or 0
        // on or off.

        //const val = !!color;
        // get the pixel index....

        const idx = pos[1] * this.size[0] + pos[0];
        const byte = idx * 4;
        //const bit = idx % 8;

        //console.log('byte, bit', [byte, bit]);

        this.ta[idx] = color[0];
        this.ta[idx + 1] = color[1];
        this.ta[idx + 2] = color[2];
        this.ta[idx + 2] = color[3];
    }
    'set_pixel_by_idx_1bipp'(idx, color) {
        const byte = Math.floor(idx / 8);
        const bit = 7 - (idx % 8);
        const val = !!color;
        const pow = Math.pow(2, bit);

        //console.log('color', color);
        //console.log('val', val);

        //console.log('bit', bit);

        //console.log('1) this.ta[byte]', this.ta[byte]);
        //console.log('val', val);
        if (val) {
            this.ta[byte] = this.ta[byte] | pow;
        } else {
            //this.ta[byte] = this.ta[byte]~pow;
            // need to remove the component of that pow.
            //  xor?

            // 

            // Unset it...?
            //  how to do that?



            this.ta[byte] = this.ta[byte] & pow;
        }
        //console.log('2) this.ta[byte]', this.ta[byte]);

    }
    'set_pixel_by_idx_8bipp'(idx, color) {
        const byte = idx;
        this.ta[byte] = color;

        //console.log('color', color);

        //console.trace();
        //throw 'NYI';
    }
    'set_pixel_by_idx_24bipp'(idx, color) {
        const byte = idx * 3;
        this.ta[byte] = color[0];
        this.ta[byte + 1] = color[1];
        this.ta[byte + 2] = color[2];

        //console.log('color', color);

        //console.trace();
        //throw 'NYI';

    }
    'set_pixel_by_idx_32bipp'(idx, color) {
        const byte = idx * 4;
        //this.ta[byte] = color;

        this.ta[byte] = color[0];
        this.ta[byte + 1] = color[1];
        this.ta[byte + 2] = color[2];
        this.ta[byte + 3] = color[3];

        //console.trace();
        //throw 'NYI';
    }
    'set_pixel_by_idx'(idx, color) {
        const a = arguments;
        const l = a.length;

        //let t0, t1, t2, t3;

        const bipp = this.bipp;
        //console.log('bipp', bipp);

        if (bipp === 1) {
            return this.set_pixel_by_idx_1bipp(a[0], a[1]);
        } else if (bipp === 8) {
            // check args length

            if (l === 2) {
                return(this.set_pixel_by_idx_8bipp(a[0], a[1]));
            }

        } else if (bipp === 24) {
            if (l === 2) {
                return(this.set_pixel_by_idx_24bipp(a[0], a[1]));
            }
            
        } else if (bipp === 32) {
            if (l === 2) {
                return(this.set_pixel_by_idx_32bipp(a[0], a[1]));
            }
        }
    }
    'set_pixel'(pos, color) {

        // May be quite a long function.
        //  Better to use inner functions for better optimization? Could be worth checking that.

        // Lets get setting pixels working in all cases.

        // Not sure if this function should be polymorphic / have checking.
        //  Would it be slowed down too much?

        // A quick typed test at the beginning could help.
        //  Not sure how much perf would be lost through doing any kind of polymorphism here.
        //  However, want to make this flexible and work in all possible cases.
        //  Could look into typescript too.

        let ta_pos, ta_color, grey_color;

        const a = arguments;
        const l = a.length;

        //let t0, t1, t2, t3;

        const bipp = this.bipp;
        //console.log('bipp', bipp);

        if (bipp === 1) {
            return(this.set_pixel_1bipp(a[0], a[1]));
        } else if (bipp === 8) {

            // check args length

            if (l === 2) {
                return(this.set_pixel_8bipp(a[0], a[1]));
            }

        } else if (bipp === 24) {
            if (l === 2) {
                return(this.set_pixel_24bipp(a[0], a[1]));
            }
            
        } else if (bipp === 32) {
            if (l === 2) {
                return(this.set_pixel_32bipp(a[0], a[1]));
            }
        }

        // Or would dealing with a string sig be best here?
        //  Or even using mfp?
        //  That would be a good thing to test.

        // And a set pixel function that only uses typed arrays could work best as well.
        //  though may need to deal with greyscale / 1 bit images.

        // specific functions for 1 bpp and greyscale modes.

        // Will use a bunch of more specific functions for modes.
        //  Could have a function the returns the appropriate function.
        //   That would be an efficient way of doing polymorphism.

        /*

        if (l === 2) {

            // Maybe best not to call tf function?

            let t1 = tf(a[1]);
            console.log('t1', t1);

        } else if (l === 3) {
            // l === 3 : x, y, color

            // color as number or typed array



        }
        */
        // May be best to perf benchmark this function.
        // May be worth using mfp here?
        //  Not so sure about js speed but it could help compilation / porting.

        // 0.125 bytes per pixel.

        //console.log('pixel_buffer_pos', pixel_buffer_pos);

        /*

        if (this.bytes_per_pixel === 1) {
            //const pixel_buffer_pos = this.bytes_per_pixel * (pos[0] + pos[1] * this.size[0]);
            this.buffer[this.bytes_per_pixel * (pos[0] + pos[1] * this.size[0])] = color;
        } else if (this.bytes_per_pixel === 3) {
            let pixel_buffer_pos = this.bytes_per_pixel * (pos[0] + pos[1] * this.size[0]);
            this.buffer[pixel_buffer_pos++] = color[0];
            this.buffer[pixel_buffer_pos++] = color[1];
            this.buffer[pixel_buffer_pos++] = color[2];
        } else if (this.bytes_per_pixel === 4) {
            let pixel_buffer_pos = this.bytes_per_pixel * (pos[0] + pos[1] * this.size[0]);
            this.buffer[pixel_buffer_pos++] = color[0];
            this.buffer[pixel_buffer_pos++] = color[1];
            this.buffer[pixel_buffer_pos++] = color[2];
            this.buffer[pixel_buffer_pos++] = color[3];
        }
        */
    }

    /*

    '_set_pixel'() {
        // Could this whole thing be sped up with C++?
        const a = arguments,
            l = a.length;
        const bytes_per_pixel = this.bits_per_pixel / 8;
        // x, y, r, g, b, a  l = 6
        // x, y, r, g, b     l = 5

        // [x, y], r, g, b, a
        // [x, y], r, g, b
        //console.log('set_pixel sig ' + sig);
        //console.log('set_pixel a ' + stringify(a));

        // check the types of the args / the sig of the function call.
        // deep sig where it gets typed array lengths too?

        // or avoid making another function call?
        //  Maybe move more towards always using a typed array to describe a position.

        let x, y, r, g, b, alpha;

        // Maybe separate inner functions for different sigs would work well.

        // x and y could be given as a typed array.

        x = a[0];
        y = a[1];
        const w = this.size[0];

        console.log('x', x);
        console.log('y', y);
        console.log('w', w);

        console.log('bytes_per_pixel', bytes_per_pixel);

        var pixel_buffer_pos = bytes_per_pixel * (x + y * w);

        console.log('pixel_buffer_pos', pixel_buffer_pos);

        var buffer = this.buffer;
        // x, y, [r, g, b, a] l = 3
        // x, y, [r, g, b]    l = 3
        if (l === 3) {
            // pixel
            if (this.bits_per_pixel === 24) {
                var arr_pixel = a[2];
                if (arr_pixel.length != 3) {
                    var stack = new Error().stack;
                    //console.log(stack);
                    throw 'Expected pixel value in format [r, g, b] for 24 bits_per_pixel.';
                }
                //r = arr_pixel[0];
                //g = arr_pixel[1];
                //b = arr_pixel[2];
                [r, g, b] = arr_pixel;
            }
            if (this.bits_per_pixel === 32) {
                var arr_pixel = a[2];
                //console.log('arr_pixel ' + stringify(arr_pixel));
                if (arr_pixel.length != 4) {
                    //console.log('arr_pixel.length ' + arr_pixel.length);
                    var stack = new Error().stack;
                    //console.log(stack);
                    throw 'Expected pixel value in format [r, g, b, a] for 32 bits_per_pixel.';
                }
                //r = arr_pixel[0];
                //g = arr_pixel[1];
                //b = arr_pixel[2];
                //a = arr_pixel[3];
                [r, g, b, alpha] = arr_pixel;
            }
        }

        if (l == 5) {
            if (this.bits_per_pixel != 24) {
                throw 'Must specify the pixel as r, g, b with bits_per_pixel of 24';
            }
            //x = a[0];
            //y = a[1];
            //r = a[2];
            //g = a[3];
            //b = a[4];
            [x, y, r, g, b] = a;
        }

        if (l == 6) {
            if (this.bits_per_pixel != 32) {
                throw 'Must specify the pixel as r, g, b, a with bits_per_pixel of 32';
            }
            //x = a[0];
            //y = a[1];
            //r = a[2];
            //g = a[3];
            //b = a[4];
            //a = a[5];
            [x, y, r, g, b, alpha] = a;
            //console.log('[x, y, r, g, b, alpha]', [x, y, r, g, b, alpha]);
        }

        // 1 bit per pixel...
        //  a more complicated calculation.

        if (this.bits_per_pixel === 1) {
            //buffer[pixel_buffer_pos] = r;
            //buffer[pixel_buffer_pos + 1] = g;
            //buffer[pixel_buffer_pos + 2] = b;

            // get the pixel number
            //  pixel index
            //   sub-byte-index

            // then use that to calculate its bit position within the byte.
            //  then do the appropriate measurement and add or subtract of a number 2^idx (I think)

        } else if (this.bits_per_pixel === 24) {
            buffer[pixel_buffer_pos] = r;
            buffer[pixel_buffer_pos + 1] = g;
            buffer[pixel_buffer_pos + 2] = b;

        } else if (this.bits_per_pixel === 32) {

            buffer[pixel_buffer_pos] = r;
            buffer[pixel_buffer_pos + 1] = g;
            buffer[pixel_buffer_pos + 2] = b;
            buffer[pixel_buffer_pos + 3] = alpha;
        } else if (this.bits_per_pixel === 8) {
            buffer[pixel_buffer_pos] = a[2];
        } else {
            var stack = new Error().stack;
            //console.log(stack);
            throw '1) Must have bits_per_pixel set to 24 or 32';
        }
    }
    */

    // Maybe compiling using let would work ok?
    //  gta(6, 'uint32');
    //   a get typed array function could be very successful.
    //   could save on code size too.
    //    in lang-mini.
    
    // Could have a module level scratch for general purpose use.
    //  Would save having to redefine it.

    // Then specific ones.

    'get_pixel_by_idx_1bipp'(idx) {
        const byte = Math.floor(idx / 8);
        const bit = 7 - (idx % 8);
        const pow = Math.pow(2, bit);

        //const tas1 = new Uint32Array(6);

        //tas1[0] = pow;
        //tas1[1] = this.ta[byte] & pow;

        //console.log('tas1[0] === tas1[1]', (tas1[0] === tas1[1]));
        //console.log('(this.ta[byte] & pow) === pow', (this.ta[byte] & pow) === pow);

        //console.log('[byte, bit, pow]', [byte, bit, pow]);

        //console.log('this.ta[byte]', this.ta[byte]);
        //console.log('this.ta[byte] & pow', this.ta[byte] & pow);

        // set a ta with values of the same type to the values to compare?

        //console.log('get_pixel_by_idx_1bipp 1 ? 0 : (this.ta[byte] & pow) == pow', 1 ? 0 : (this.ta[byte] & pow) == pow);

        return ((this.ta[byte] & pow) === pow) ? 1 : 0;

        //return 1 ? 0 : (this.ta[byte] & pow) === pow;
    }
    'get_pixel_by_idx_8bipp'(idx) {
        const byte = idx;
        return this.ta[byte];
    }
    'get_pixel_by_idx_24bipp'(idx) {
        const byte = idx * 3;
        return this.ta.slice(byte, byte + 3);
    }
    'get_pixel_by_idx_32bipp'(idx) {
        const byte = idx * 4;
        return this.ta.slice(byte, byte + 4);
    }

    'get_pixel_by_idx'(idx) {
        const bipp = this.bits_per_pixel;

        if (bipp === 1) {
            return this.get_pixel_by_idx_1bipp(idx);
        } else if (bipp === 8) {
            return this.get_pixel_by_idx_8bipp(idx);
        } else if (bipp === 24) {
            return this.get_pixel_by_idx_24bipp(idx);
        } else if (bipp === 32) {
            return this.get_pixel_by_idx_32bipp(idx);
        } else {
            throw 'Unsupported bipp'
        }
    }

    // Will redo get_pixel.
    //  likely to use tas by default, and built in type checking within minimal calling of any other functions.

    'get_pixel_1bipp'(pos) {
        // work out the pixel index...

        const idx = pos[1] * this.size[0] + pos[0];
        const byte = Math.floor(idx / 8);
        const bit = 7 - (idx % 8);

        //console.log('byte, bit', [byte, bit]);

        // use roots of some sort?
        const pow = Math.pow(2, bit);
        // use AND with POW
        //console.log('get_pixel_1bipp 1 ? 0 : (this.ta[byte] & pow) === pow', 1 ? 0 : (this.ta[byte] & pow) === pow);
        return ((this.ta[byte] & pow) === pow) ? 1 : 0;
        //return 1 ? 0 : (this.ta[byte] & pow) === pow;
    }
    'get_pixel_8bipp'(pos) {
        const idx = pos[1] * this.size[0] + pos[0];
        const byte = idx;
        return this.ta[byte];
    }
    'get_pixel_24bipp'(pos) {
        const idx = pos[1] * this.size[0] + pos[0];
        const byte = idx * 3;

        return this.ta.slice(byte, byte + 3);
    }
    'get_pixel_32bipp'(pos) {
        
        const idx = pos[1] * this.size[0] + pos[0];
        const byte = idx * 4;

        return this.ta.slice(byte, byte + 4);
    }

    'get_pixel'(pos) {
        const bipp = this.bits_per_pixel;
        if (bipp === 1) {
            return this.get_pixel_1bipp(pos);
        } else if (bipp === 8) {
            return this.get_pixel_8bipp(pos);
        } else if (bipp === 24) {
            return this.get_pixel_24bipp(pos);
        } else if (bipp === 32) {
            return this.get_pixel_32bipp(pos);
        } else {
            console.trace();
            throw 'bits per pixels error';
        }
    }

    get num_px() {
        return this.size[0] * this.size[1];
    }

    // or a getter function for split_rgb_channels?

    get split_rgb_channels() {

        //console.log('core split_rgb_channels');

        // Seems like it had been loaded wrong in the first place.
        //  Need to improve loading of JPEG as 24 bipp.
        //   (though the data input from Sharp may be 32 bipp)

        const [bipp, bypp] = [this.bits_per_pixel, this.bytes_per_pixel];

        // only for images with bipp 24 or 32
        //console.log('bipp', bipp);
        //console.log('bypp', bypp);

        if (bipp === 24 || bipp === 32) {
            // 3 result objects.

            const res = [new this.constructor({
                bits_per_pixel: 8,
                size: this.size
            }), new this.constructor({
                bits_per_pixel: 8,
                size: this.size
            }), new this.constructor({
                bits_per_pixel: 8,
                size: this.size
            })]

            const [r, g, b] = res;

            // then go through the pixel indexes.
            //  direct copy between the tas.
            //   do this in an optimised but still simple way.
            // its fastest not to call other functions, ie iterate and to set.

            let i_px = 0;
            const num_px = this.num_px;
            let i_byte = 0;

            const [ta_r, ta_g, ta_b] = [r.ta, g.ta, b.ta];

            const ta = this.ta;
            while (i_px < num_px) {
                ta_r[i_px] = ta[i_byte];
                ta_g[i_px] = ta[i_byte + 1];
                ta_b[i_px] = ta[i_byte + 2];

                i_px++;
                i_byte += bypp;
            }

            //console.log('pre return res', res);

            return res;

        } else {
            console.trace();
            throw 'NYI';

        }

    }


    /*

    get_pixel_ta(pos) {
        const ta_32_scratch = new Uint32Array(6);
        ta_32_scratch[0] = this.bytes_per_pixel;



        ta_32_scratch[1] = 0; // i
        ta_32_scratch[2] = this.size[0];
        ta_32_scratch[3] = this.size[1];

        ta_32_scratch[1] = ta_32_scratch[0] * (pos[0] + pos[1] * ta_32_scratch[2]);
        const buffer = this.buffer;
        //var r, g, b, a;
        //console.log('pixel_buffer_pos', pixel_buffer_pos);
        //console.log('x, y', x, y);
        //console.log('ta_32_scratch[1]', ta_32_scratch[1]);

        //const check = this.check_rect_bounds(x, y);
        if (this.check_rect_bounds(pos[0], pos[1])) {
            if (ta_32_scratch[0] === 1) {
                return buffer[ta_32_scratch[1]];
            } else if (ta_32_scratch[0] === 3) {
                return [buffer[ta_32_scratch[1]++], buffer[ta_32_scratch[1]++], buffer[ta_32_scratch[1]++]];
            } else if (ta_32_scratch[0] === 4) {
                return [buffer[ta_32_scratch[1]++], buffer[ta_32_scratch[1]++], buffer[ta_32_scratch[1]++], buffer[ta_32_scratch[1]++]];
            } else {
                //var stack = new Error().stack;
                //console.log(stack);
                throw '2) Must have bits_per_pixel set to 24 or 32';
            }
        }
    }

    // Return it as a typed array by default?

    'get_pixel'(x, y) {
        // (ta_pos, int_color || ta_color)

        // Could asess the param sig...
        //  Want to identify typed arrays in the sigs as well.
        //   and the typed array type. ...   ta_ui32 type...?
        //    but the abbreviations?
        //     maybe i
        //     maybe d
        //     


        const ta_32_scratch = new Uint32Array(6);
        ta_32_scratch[0] = this.bytes_per_pixel;
        ta_32_scratch[1] = 0; // i
        ta_32_scratch[2] = this.size[0];
        ta_32_scratch[3] = this.size[1];
        ta_32_scratch[4] = x;
        ta_32_scratch[5] = y;
        // 4 = x
        // 5 = y

        //const bytes_per_pixel = this.bits_per_pixel / 8;
        // will return [r, g, b] or [r, g, b, a];
        ta_32_scratch[1] = ta_32_scratch[0] * (ta_32_scratch[4] + ta_32_scratch[5] * ta_32_scratch[2]);
        const buffer = this.buffer;
        //var r, g, b, a;
        //console.log('pixel_buffer_pos', pixel_buffer_pos);
        //console.log('x, y', x, y);

        //const check = this.check_rect_bounds(x, y);
        if (this.check_rect_bounds(ta_32_scratch[4], ta_32_scratch[5])) {
            if (ta_32_scratch[0] === 3) {
                return [buffer[ta_32_scratch[1]++], buffer[ta_32_scratch[1]++], buffer[ta_32_scratch[1]++]];
            } else if (ta_32_scratch[0] === 4) {
                return [buffer[ta_32_scratch[1]++], buffer[ta_32_scratch[1]++], buffer[ta_32_scratch[1]++], buffer[ta_32_scratch[1]++]];
            } else if (ta_32_scratch[0] === 1) {
                return [buffer[ta_32_scratch[1]++]];
            } else {
                //var stack = new Error().stack;
                //console.log(stack);
                throw '3) Must have bits_per_pixel set to 24 or 32';
            }
        }
    }
    */



    // Will use a ta instead.
    //  or two....

    /*
    check_rect_bounds(x, y, w = 0, h = 0) {

        //console.log('x, y, w, h', x, y, w, h);
        //console.trace();

        if (x < 0) return false;
        if (y < 0) return false;
        if (x + w > this.size[0]) return false;
        if (y + h > this.size[1]) return false;
        return true;
    }
    */
    // Custom convolution not working here.
    // Iterating pixels for the line joining convolution sounds best.
    // Custom convolution seems like the way to go, but it's hard to implement.

    process(fn) {
        let res = this.clone();
        return fn(this, res);
    }

    /*
    function typedArraysAreEqual(a, b) {
  if (a.byteLength !== b.byteLength) return false;
  return a.every((val, i) => val === b[i]);
}

    */
    equals(other_pixel_buffer) {
        let buf1 = this.buffer;
        let buf2 = other_pixel_buffer.buffer;
        if (buf1.length === buf2.length) {
            return buf1.every((val, i) => val === buf2[i]);
        } else {
            return false;
        }
    }







    // 1bipp images will replace pos lists in many cases.
    //  also 1bipp images which have got their pos set so they don't need as much space.

    // get (rectangle) view
    //  A rectangular square of pixels.

    copy_pixel_pos_list_region(pixel_pos_list, bg_color) {
        // find the bounds of that pixel pos list.
        //  would help if the returned bounds included size.

        let bounds = pixel_pos_list.bounds;
        // not sure why the +1 is needed / helps
        let size = new Uint16Array([bounds[2] - bounds[0] + 1, bounds[3] - bounds[1] + 1]);
        //console.log('size', size);
        //console.log('bounds', bounds);

        // make a new pb

        const res = new this.constructor({
            size: size,
            bytes_per_pixel: this.bytes_per_pixel
        });
        if (this.pos) res.pos = this.pos;
        if (bg_color) {
            res.color_whole(bg_color);
        }
        res.pos = new Int16Array([bounds[0], bounds[1]]);

        // each_pixel_rebounded?
        pixel_pos_list.each_pixel((pos) => {
            // then we copy pixels from the current image to the result.
            // set the result...
            let color = this.get_pixel_ta(pos);
            //console.log('color', color);
            //if (typeof color !== 'number') {
            //    console.log('color', color);
            //}
            const target_pos = new Int16Array([(pos[0] - bounds[0]), (pos[1] - bounds[1])]);
            //const target_pos = new Int16Array([(pos[0]), (pos[1])]);
            //const target_pos = pos;
            //console.log('target_pos, color', target_pos, color);
            res.set_pixel_ta(target_pos, color);
            //res.set_pixel()
        });
        return res;
    }
    // copy_rect_to
    //  copies it to another Pixel_Buffer

    // positions as UInt16Array?

    // x, y, w, h

    // Likely to change this to use typed arrays in the params.
    //  Also to call different inner versions depending on bits per pixel.

    // Will be able to get a window from this.
    //  Pixel buffer window.

    // Maybe Virtual_Pixel_Buffer would be useful for having a windowed view into another Pixel_Buffer.
    //  Could be very fast for convolutions. Not sure.


    __copy_rect(x, y, w, h, clip = false) {
        // check within bounds
        //console.log('copy_rect w, h', w, h)

        // Allow clipping?
        //  So would get a smaller rect if it's outside bounds
        let central_pos = [Math.floor(w / 2), Math.floor(h / 2)];
        let check = true;
        if (clip) {
            clip = {};
            if (x < 0) {
                w = w + x;
                clip.l = -1 * x;
                x = 0;
                central_pos[0] -= clip.l;
            };
            if (y < 0) {
                h = h + y;
                clip.t = -1 * y;
                y = 0;
                central_pos[1] -= clip.t;
            }
            if (x + w > this.size[0]) {
                clip.r = (x + w) - this.size[0];
                //\w = w - ((x + w) - this.size[0]);
                x = x - clip.r;
                w = w - clip.r;
                central_pos[0] -= clip.r;
            }
            if (y + h > this.size[1]) {
                clip.b = (y + h) - this.size[1];
                //console.log('this.size[1]', this.size[1]);
                //console.log('h', h);
                //console.log('y', y);
                y = y - clip.b;
                h = h - clip.b;
                central_pos[1] -= clip.b;
            }
            if (Object.keys(clip).length === 0) {
                clip = undefined;
            }
        } else {
            check = this.check_rect_bounds(x, y, w, h);
        }

        //let check = check_rect_bounds(x, y, w, h);
        if (!check) {
            throw 'Out of bounds error';
        } else {
            const r = x + w,
                b = y + h;
            let i;
            //var pixel_buffer_pos = 
            //let bb = this.buffer.buffer;
            let cr, cg, cb, ca;
            let buf = this.buffer;
            //console.log('[w, h]', [w, h]);
            let res = new this.constructor({
                size: [w, h],
                bits_per_pixel: this.bits_per_pixel
            });
            // The position of the copied rect...
            if (this.pos) {
                //res.pos = new Int16Array([this.pos[0] + x, this.pos[1] + y]);
                res.pos = this.pos;
            } else {
                //res.pos = new Int16Array([x, y]);
            }
            if (clip) {
                res.clip = clip;
            }
            res.central_pos = central_pos;
            const right = x + w;
            const bottom = y + h;
            const Bpp = this.bytes_per_pixel,
                my_w = this.size[0];
            //console.log('[right, bottom]', [right, bottom]);
            let i_res = 0;
            let buf_res = res.buffer;
            //let bbres = res.buffer.buffer;
            for (let y2 = y; y2 < bottom; y2++) {
                //console.log('y', y);
                //console.log('x < right', x < right);

                //console.log('this.bytes_per_pixel', this.bytes_per_pixel);
                i = Bpp * (x + y2 * my_w);;
                for (let x2 = x; x2 < right; x2++) {
                    //console.log('i', i);
                    //console.log('x2, y2', x2, y2);
                    //console.log('i_res', i_res);
                    //[cr, cg, cb, ca] = bb.slice(i, i = i + this.bytes_per_pixel);
                    //[bbres[i++], bbres[i++], bbres[i++], bbres[i++]] = bb.slice(i - 4, i);
                    //console.log('i_res', i_res);
                    buf_res[i_res++] = buf[i++];
                    buf_res[i_res++] = buf[i++];
                    buf_res[i_res++] = buf[i++];
                    buf_res[i_res++] = buf[i++];
                    //buf_res.writeUInt32BE(buf.readUInt32BE(i), i_res);
                    //i += 4;
                    //i_res += 4;
                    // let res_i = res.this.bytes_per_pixel * 
                }
            }
            return res;
        }
    }

    'place_image_from_pixel_buffer'(pixel_buffer, dest_pos) {
        // can do a fast copy.
        //  or can do pixel iteration.
        // function to get a line from a buffer?
        // will want to copy directly between them.
        // so for each line in the source, need to copy the line directly into the buffer.
        //  that's if they are the same bits_per_pixel.
        // copying rgba to rgba or rgb to rgb should be fast.
        //  direct copying is fastest.
        const dest_buffer = this.buffer;
        const source_buffer = pixel_buffer.buffer;
        //console.log('dest_pos ' + stringify(dest_pos));
        // It's also worth making RGB->RGBA and RGBA->RGB
        if (this.bits_per_pixel === 32 && pixel_buffer.bits_per_pixel === 32) {
            const dest_w = this.size[0];
            const dest_h = this.size[1];
            const dest_buffer_line_length = dest_w * 4;
            const source_w = pixel_buffer.size[0];
            const source_h = pixel_buffer.size[1];
            const source_buffer_line_length = source_w * 4;
            //console.log('source_w ' + source_w);
            //console.log('source_h ' + source_h);
            let source_buffer_line_start_pos, source_buffer_line_end_pos, dest_buffer_subline_start_pos, dest_buffer_start_offset;
            dest_buffer_start_offset = dest_pos[0] * 4;
            // This algorithm could be sped up with C.
            //cpp_mod.copy_rgba_pixel_buffer_to_rgba_pixel_buffer_region(source_buffer, source_buffer_line_length, dest_buffer, dest_buffer_line_length, dest_pos[0], dest_pos[1]);
            //throw 'stop';
            for (var y = 0; y < source_h; y++) {
                source_buffer_line_start_pos = y * source_buffer_line_length;
                source_buffer_line_end_pos = source_buffer_line_start_pos + source_buffer_line_length;
                dest_buffer_subline_start_pos = (y + dest_pos[1]) * dest_buffer_line_length;
                //var dest_buffer_subline_end_pos = dest_buffer_subline_start_pos + source_buffer_line_length;
                // buf.copy(targetBuffer, [targetStart], [sourceStart], [sourceEnd])
                source_buffer.copy(dest_buffer, dest_buffer_subline_start_pos + dest_buffer_start_offset, source_buffer_line_start_pos, source_buffer_line_end_pos);
            }
        } else {
            console.trace();
            throw 'not currently supported';
        }
    }
    'blank_copy'() {
        var res = new this.constructor({
            'size': this.size,
            'bits_per_pixel': this.bits_per_pixel
        });
        res.buffer.fill(0);
        if (this.pos) res.pos = this.pos;
        return res;
    }
    'clone'() {
        //console.log('1) this.bits_per_pixel', this.bits_per_pixel);
        var res = new this.constructor({
            'size': this.size,
            'bits_per_pixel': this.bits_per_pixel,
            'buffer': this.buffer.constructor(this.buffer)
        });
        if (this.pos) res.pos = this.pos;
        //this.buffer.copy(res.buffer);
        //res.buffer.fill(0);
        return res;
    }

    // Want tests and examples to do with 1 bit per pixel images.
    //  Will be nice to use them quickly, especially with C++ and wasm plugins.

    // transform-to-new style functions.
    //  means a new object gets made.

    // Maybe better to use to_xbipp functions.
    //  As its clearer that it creates and outputs a new object.


    // Should likely be in the constructor for direct interaction with local variables there.

    //  Will reinitialise the typed array.
    //   And other tas such as the scratch row / ta_scratch would need to be recreated.



    /*


    'change_bits_per_pixel'(old_bipp, new_bipp) {

        console.log('change_bits_per_pixel [old_bipp, new_bipp]', [old_bipp, new_bipp]);
        //const old_bipp = this.bits_per_pixel;

        // could make a temporary bixel buffer to work with.
        //  ie, clone, reallocate own ta, read from clone, write to this.
        
        // Or may be easier to write / use functions that apply directly to the typed arrays.
        //  May be easier to port them over to C++.

        if (old_bipp !== new_bipp) {
            console.log('change_bits_per_pixel [old_bipp, new_bipp]', [old_bipp, new_bipp]);
            console.trace();
            throw 'stop';

            if (old_bipp === 1) {

                if (new_bipp === 8) {

                } else if (new_bipp === 24) {

                } else if (new_bipp === 32) {

                }

            } else if (old_bipp === 8) {
                
            } else if (old_bipp === 24) {
                
            } else if (old_bipp === 32) {
                
            }


        }

    }

    */



    // Will be done by changing the .bytes_per_pixel or .bits_per_pixel
    //  Though possibly they could call functions like this when needed.
    //  Would result in the original typed array being reallocated.

    'add_alpha_channel'() {
        console.log('add_alpha_channel this.bytes_per_pixel', this.bytes_per_pixel);
        if (this.bytes_per_pixel === 3) {
            var res = new this.constructor({
                'size': this.size,
                'bytes_per_pixel': 4
            });
            if (this.pos) res.pos = this.pos;
            /*
            this.each_pixel((x, y, r, g, b) => {
                //console.log('x, y, r, g, b', x, y, r, g, b);
                res.set_pixel(x, y, r, g, b, 255);
            });
            */
            const buf = this.buffer,
                res_buf = res.buffer;
            const px_count = this.size[0] * this.size[1];
            let i = 0,
                ir = 0;
            for (let p = 0; p < px_count; p++) {
                res_buf[ir++] = buf[i++];
                res_buf[ir++] = buf[i++];
                res_buf[ir++] = buf[i++];
                res_buf[ir++] = 255;
            }
            return res;
        }
        if (this.bytes_per_pixel === 4) {
            return this;
        }
    }

    // Will have inner conversion too.

    // 

    //  again, change .bipp or .bypp. make aliases with those names? .bi .by even more abbreviated. Allow more abbreviated code, support aliases for that.
    // then need to be able to save as 8 bit bitmaps too.
    'to_8bit_greyscale'() {
        if (this.bytes_per_pixel === 1) {
            return this;
        }
        if (this.bytes_per_pixel === 3) {
            var res = new this.constructor({
                'size': this.size,
                'bits_per_pixel': 8
            });
            if (this.pos) res.pos = this.pos;
            const bres = res.buffer;
            // Then go over each of this pixel
            //  take average rgb values
            let i = 0;
            this.each_pixel((x, y, r, g, b, a) => {
                bres[i++] = Math.round((r + g + b) / 3);
                //i++;
            });
            return res;
        }
        if (this.bytes_per_pixel === 4) {
            var res = new this.constructor({
                'size': this.size,
                'bits_per_pixel': 8
            });
            if (this.pos) res.pos = this.pos;
            const bres = res.buffer;
            // Then go over each of this pixel
            //  take average rgb values
            let i = 0;
            this.each_pixel((x, y, r, g, b, a) => {
                bres[i++] = Math.round((r + g + b) / 3);
                //i++;
            });
            return res;
        }
    }

    'to_32bit_rgba'() {
        var res = new this.constructor({
            'size': this.size,
            'bits_per_pixel': 32
        });
        if (this.pos) res.pos = this.pos;
        const bres = res.buffer;
        if (this.bytes_per_pixel === 1) {
            // Then go over each of this pixel
            //  take average rgb values
            let i = 0;
            this.each_pixel((x, y, v) => {
                bres[i++] = v;
                bres[i++] = v;
                bres[i++] = v;
                bres[i++] = 255;
                //i++;
            });
        }
        return res;
    }


    // Assume self
    '__invert_greyscale_self'() {
        const bres = this.buffer;
        // Then go over each of this pixel
        //  take average rgb values
        let i = 0;
        this.each_pixel((x, y, v) => {
            bres[i++] = 255 - v;
        });
        return this;
    }
    
    // .invert
    //   and when it's on a greyscale image
    //   and do it in place.

    // get inverted greyscale
    '__invert_greyscale'() {
        let res = new this.constructor({
            'size': this.size,
            'bits_per_pixel': 8
        });
        if (this.pos) res.pos = this.pos;
        const bres = res.buffer;
        // Then go over each of this pixel
        //  take average rgb values
        let i = 0;
        this.each_pixel((x, y, v) => {
            bres[i++] = 255 - v;
        });
        return res;
    }

    // moving_pixels_indexes_window
    //  so it gives back the pixel indexes
    //  including index of central pixel

    // Would create a list of pixel offsets, then apply them to the lists of pixels generated.
    //  In some cases though, it would need to create a smaller result typed array.

    // convolution window?

    // Convolution window
    //  That would be a useful function.
    //   could look at how to optimize the data flow so that new objects dont need to get created.
    //   can provide the data in a ta but with that data changing later.
    //    meaning writing to a smaller amount of memory. Using that data immediately before it's next updated.


    // Likely to change the moving pixels window, making it more efficient.




    // Much improving this functionality....


    '____moving_pixels_window'(offset_bounds, cb) {
        const [offset_l, offset_t, offset_r, offset_b] = offset_bounds;

        const check = (pos) => {
            if (pos[0] < 0) return false;
            if (pos[1] < 0) return false;
            if (pos[0] >= this.size[0]) return false;
            if (pos[1] >= this.size[1]) return false;
            return true;
        }

        // then for each pixel ta
        //  we then run through the pixels defined by the offsets

        this.each_pixel_pos((pos) => {
            //console.log('pos', pos);
            let ppl = new Pixel_Pos_List();

            let ymax = pos[1] + offset_b;
            let xmax = pos[0] + offset_r;
            let pos2 = new Int16Array(2);
            const s = this.size;
            for (pos2[1] = pos[1] + offset_t; pos2[1] <= ymax; pos2[1]++) {
                //console.log('pos2[1]', pos2[1]);
                for (pos2[0] = pos[0] + offset_l; pos2[0] <= xmax; pos2[0]++) {
                    
                    //let ok = check(pos2);
                    //console.log('ok', ok);

                    if (!(pos2[0] < 0 || pos2[1] < 0 || pos2[0] >= s[0] || pos2[1] >= s[1])) ppl.add(pos2);


                    //if (check(pos2)) ppl.add(pos2);
                }
                //throw 'stop';
            }
            ppl.fix();
            //console.log('ppl.ta', ppl.ta);
            cb(pos, ppl);
            //console.log('ppl.length', ppl.length);

            //console.log('ppl', ppl);
        });
    }
    // This could be used to make a function that will despeckle larger areas of an image.
    //  Could even have a fairly large speckle in the centre, but detect it's not corrected around the edges.
    //   Even an 11x11 window size. 

    // Moving pixels pixel setter
    //  And provide a 'set' function too?

    '____moving_pixels_ppl_selector'(offset_bounds, fn_selector) {
        let res = new Pixel_Pos_List();
        this.moving_pixels_window(offset_bounds, (pos, ppl) => {
            if (fn_selector(pos, ppl) === true) {
                res.add(pos);
            }
        });
        res.fix();
        return res;
    }
    // Could reconstruct a new image from that ppl.


    // Will also include convolution in the core.
    
    // a function with a callback on the convolution window.

    // maybe get good at writing the convolution structure.
    //  having it inline for a variety of convolutions.
    //  would be most optimized that way.


    // Different convolution functions for different bips images.
    // Convolve greyscale using different code
    //  Should make it more optimized

    // Basically, need convolutions and transformations done quickly in js, then will make them faster still in C++.

    // Convolution Scratch?
    //  I think a self sized scratch ta would be of use.
    //  Once it gets asked for, it gets provided and kept, and reused.

    // Ways to save on initialising new (typed array) objects.

}


// Some more functionality and testing

// Moving pixel windows look important.

// Return a ppl of pixels within the bounds, for each pixel.
// 

module.exports = Pixel_Buffer_Core;

if (require.main === module) {
    const lg = console.log;

    (async() => {
        const run_examples = async() => {
            lg('Begin run examples');

            // A list of example functions. array.

            const examples = [
                async() => {
                    // just lg for log???
                    lg('Begin example 0');

                    // Change it to 1 bit per pixel.

                    // Maybe make a new 1 bit per pixel pixel buffer, and do some manipulations on it.

                    // Could make them small, such as 8 * 8, meaning 8 bytes. That would be a good starting point because each row is
                    //  1 byte.

                    // Can also try and test some set pixel and get pixel methods. See that it works with code on a small scale.
                    //  Then could work on expanding the scale once some maths has been better implemented and understood.

                    const pb = new Pixel_Buffer_Core({
                        bits_per_pixel: 1,
                        size: [8, 8]
                    });

                    // set_pixel(3, 3, 1);  // This could actually be faster though?
                    // set_pixel([3, 3], 1);
                    // set_pixel(ta_pos, 1);

                    const ta_pos = new Int16Array(2);

                    ta_pos[0] = 3;
                    ta_pos[1] = 3;

                    // Adding or subtracting the significance of the bit would be a good way to do it.
                    //  Reference an array of bit signigicances. Modify the number. Don't try to directly access the bits.
                    //  Will have simpler JS code this way. Could then maybe make bit manipulation system.




                    pb.set_pixel(ta_pos, 1);



                    // Will do individual set pixel and get pixel functions.
                    //  Treat input using truthy or falsy.

                    // if ... == true.







                    lg('End example 0');

                }
            ]

            const l = examples.length;
            for (var c = 0; c < l; c++) {
                const res_eg = await examples[c]();
                console.log('res_eg ' + c + ':', res_eg);
            }


            lg('End run examples');

        }

        await run_examples();
    })();


    const __test1 = () => {


        // Will make various examples in the examples directory, and use them as the basis for tests in the future.
        //  Stabilise the version numbers in which example results are saved to use as tests.

        // Want to do some work on 1 bit per pixel images.

        // Make a few example functions that do some things.
        //  Could run examples written and from here, then move them to the examples directory.


        


        





        


        let pb = new Pixel_Buffer_Core({
            size: [1000, 1000],
            bytes_per_pixel: 1
        });
        console.log('pb.size', pb.size);



        // a moving pixels window with a set current pixel function.

        // a moving pixels window boolean pixel list selector function.
        //  it itself will create a pixel_pos list based on the inner / convolution-type function results.

        // moving_pixels_pixel_selector
        //  returns the moving pixels ppl window to a callback, adds that pixel to a ppl if the callback returns true.
        //  and it puts the selected pixels into a pixel pos list.
        

        //pos, color, ppl
        // and the ppls by offset?
        // also interested in the indexes and index offsets.

        // An array of pixel indexes would do the job.

        // Moving Pixel Indexes


        pb.moving_pixels_window(new Uint16Array([-2, -2, 2, 2]), (pos, ppl) => {
            //console.log('pos', pos);
            //console.log('ppl.length', ppl.length);

            // are all the border pixels white?


        });
    }
    //test1();

}
