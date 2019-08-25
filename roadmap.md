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











 a float32 number in each for example, or float16.




