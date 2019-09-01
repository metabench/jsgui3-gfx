1 - MAJOR API CHANGE
--------------------

Edit in place wherever possible.
Always use .clone.operation when we want a new obj

Convenience
-----------

Alias method names!!!
Support that on a lower level, such as with obext.

PRIORITY 1 Convert to RGB / RGBA / Greyscale

Proper implementation of 1 bit per pixel. 1/8 bytes per pixel. 0.125
  Get this working in JS. Will be useful for the results of thresholding or other function / map operations. For holding masks.
  C++ optimization, can compile to wasm too. Isomorphic c++ for node and browser using wasm.




Immediate Plan:

*) Continue working on variety of interface and convenience things.
    Testing / examples.
   Hold off from releasing 0.0.23.

   Get 0.0.23 release a bit more tested and covering some more ground.
    Better movement / iteration API and byte_index optimized methods.








Immediate Plan Details:

// Properties to describe the relationship to the source window.


// pos_within_source_window_bounds
//  was .pos_bounds
// pos_within_source_window
//  was .pos


Possible:

.source_window_processing


// an array of different functions to be called on the data once it has been written to this.
//  eg could have one or more convolutions assigned.
//   may be an efficient way of getting multiple successive convolutions done on a source image



Movement Definitions:
  Movement of pointers get defined more
  Relationships get defined more?
    have.source already.
      change to .window_source to be clearer?

  each_source_pos?
    Quite a powerful function that will move the window over all possible (given bounds) positions within the source.

    and will copy from the source appropriately.
    makes a lot of sense with this name.
      but consider pos_within_source.each()??



  pos_within_window_source?

  // coords.within.window_source?


  

// Convolution-style functions?
//  Easier calling of convolutions and use of convolution results.
//  A convolution function or API that itself makes use of the pixel window system.


// Getting byte index data about a specified movement within bounds...
//  A separate jS file for these functions could be useful, at least to start with.
//   Then when the API is stable, make sure they are optimized (internal?) versions.

// Or an iteration_data example for the moment?
//  And when it's working in the example, implement the functions either in a new (helper / more pure fns) file, or within pixel-buffer-core





















Examples

Will run in node.js. Will use some dev dependencies.
The 1bpp format looks like its working now.


Worth making convolutions now.

They could run a lot faster in JS.

Maybe worth using some higher resolution images too.

Convolutions inc edge detection would be really useful.
Could make specific pixel buffers to store the conv data.
  Or classes / data structures specific to convolutions.

Convolutions on both color and greyscale images
Also 1bpp images
Convolutions could apply to them.

// Convolution window?

// Function to separate out the different RGBA channels.

// Would be interesting to apply functions to arrays of pixel buffers too.

// Optimized 8bipp to 1bipp thresholding function

// Thresholding at all 255 values on all channels...
//  How long would that take?
//   Could test optimizations well using that as well.

// Resizing / getting the resized versions.

Pixel buffer core could do with a fair bit more work and testing.
Rapidly and efficiently doing convolutions will be very useful.


 a float32 number in each for example, or float16.




0.0.21 - Pixel_Buffer acting as a window_to another Pixel_Buffer (spec.window_to(source))
  work in progress
  0.0.21 - pos_center property as a facade to pos and size
   Properties overhaul, using the 'facade' pattern.
    // Pre properties overhaul version???

0.0.22
  .bypp = 1 convert to greyscale
   greyscale image helps prepare for convolution.

0.0.23
  Plan what to do...
    Decided on cursors in 0.0.24
  Some more functionality that supports convolutions / convolution windows.
  // Running it on a greyscale image would help to begin with.
  //  Then can try running it on a multi-channel image.
  //   Could have the view window switch between channels?
  //  A view into a channel could be useful as well.
  //   So the view would have different bipp and it would convert on copy.
  //   


  Initial Convolution implementation

  Bug fix: move_next_px - not fixed yet
    Sort out definition of bound movement range when using window_to source pb.
    Rethinking image centering and centered window pb movement.
      Coming up with possible ways it will be more efficient than before as well as more accurate.

    (.each_window_px)
      // And would do the corresponding copy to own ta to represent what's in the window.
      //  would do that before the callback.
      // Not yet - lets use pos_bounds and incorporate that into existing iteration.


    Moving convolution window seems useful / important.
      A good structure as well to check that the conv is working with the right data along the way.


0.0.23(a?) - Further improvements to iteration system, including byte iteration variables and methods.
  Copy and paste various kinds of iteration boilerplate too.
    Made a fast (but restricted use) copy between pbs function.
  Dealing with the typed arrays themselves more, more mathematical functions that deal with abstractions of multiple values.
    Also providing the basic non-abstract info.
  Getting the byte index info (or general purpose and iteration...)
    Function that returns a very human-readable object (with explanations?)
      Would also return the typed arrays, and explain their indexing
    Function that just returns the typed arrays.
  Have made a fast byte iteration and copy pb data function.
    Will make more functions in the near future that apply to the pixel buffers' internal data.

  Does seem like inlining various functions in various situations, not passing args to functions, gets the best speed.
  Variables both defined and accessed in the local block scope.
  Worth making the different ways of doing things comparible in benchmarks.



0.0.23 final:
  easy to use convolutions API.
  convolve.js example
    consider most optimized paths separately, seek to integrate but accept some API convenience performance lossless
      and later can optimize some fns using C++ on the server and test that.

  more flexible, (faster) copy between pbs
  standard typed arrays for parameters, with restricted number of tas being passed to the functions.
    try a single function object too, containing all the tas? is that faster?
  larger convolutions, benchmarks.
  multiple convolutions done (different params?) on larger single input image.

  Edge detection convolution
    examples

  



  
  Iterations for more than one coordinate space at once (ie coordinate spaces from multiple images?)

  Further convolutions, and refinements to them?
  Speed bencmarking multiple convolution processes?



// Create half size image?
//  Could be a useful stage towards other scaling
//   downscaling and upscaling?

// Each pixel in the res image would be an average of 4 pixels in the source image.





0.0.24 Image resizing (pixel remapping?)

// May be enabled by further work involving multiple view windows, and remapping of coordinate spaces.
//  This is the kind of thing which would work well on a platform with its own very fast operations.


// May be enabled with some pixel rescaling / virtual resolution maths I've been thinking about.

Have a pb window that does not have own copies of its values (no ta)
All get and set operations are done by coordinates, and it then remaps to the coordinate space of the the source, and gets it from there.

// Each pixel in the original image becomes a square in a virtual high-res remapped image.



  



0.0.24? Improved convolutions?



0.0.24 - Cursors??? No
  Further convolution examples / benchmarks...?
    (will also do some work on the server-side version)
  (Improvements with convolutions)???
  (More work using bounds, regions? can just use an xy ta)
  ta_xy? xyta?


0.0.24 - Pixel remapping
  Used in part for convolutions
  May be worth making copy functions with explicit pixel remapping.





0.0.25 - Improvements with examples system
  Will be able to run all examples at once, save their output in a dir that's labelled / pathed by:
    /module_ver/node_ver/datetime_test_run/test_name

  Saving test / example results for comparison / regression testing will be a great help.

0.0.26 ???
  1bipp convolutions / image processing
  1bipp window to 1bipp image
    efficient copying
  



// .coordinate_space or .coords variable?
//  .coords could be made to be a fast and flexible API. would handle pos, size, bounds, iterations, pos within another image, many things.

  

