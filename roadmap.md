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
  Some more functionality that supports convolutions / convolution windows.
  // Running it on a greyscale image would help to begin with.
  //  Then can try running it on a multi-channel image.
  //   Could have the view window switch between channels?
  //  A view into a channel could be useful as well.
  //   So the view would have different bipp and it would convert on copy.
  //   
  Initial Convolution implementation

  Bug fix: move_next_px
    Sort out definition of bound movement range when using window_to source pb.


  



    Moving convolution window seems useful / important.
      A good structure as well to check that the conv is working with the right data along the way.


0.0.24 - Improvements with convolutions
  Further convolution examples / benchmarks...?
    (will also do some work on the server-side version)



0.0.25 - Improvements with examples system
  Will be able to run all examples at once, save their output in a dir that's labelled / pathed by:
    /module_ver/node_ver/datetime_test_run/test_name

  Saving test / example results for comparison / regression testing will be a great help.





