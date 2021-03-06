// Taken from https://github.com/sidorares/gaussian-convolution-kernel
//  Modified by James Vickers
//   Returns a Float32Array
//   const and let

// the code is taken from https://github.com/mattlockyer/iat455/blob/6493c882f1956703133c1bffa1d7ee9a83741cbe/assignment1/assignment/effects/blur-effect-dyn.js
// (c) Matt Lockyer, https://github.com/mattlockyer

function hypotenuse(x1, y1, x2, y2) {
  var xSquare = Math.pow(x1 - x2, 2);
  var ySquare = Math.pow(y1 - y2, 2);
  return Math.sqrt(xSquare + ySquare);
}

/*
 * Generates a kernel used for the gaussian blur effect.
 *
 * @param dimension is an odd integer
 * @param sigma is the standard deviation used for our gaussian function.
 *
 * @returns an array with dimension^2 number of numbers, all less than or equal
 *   to 1. Represents our gaussian blur kernel.
 */
function generateGaussianKernel(dimension, sigma) {
  if (!(dimension % 2) || Math.floor(dimension) !== dimension || dimension < 3) {
    throw new Error(
      'The dimension must be an odd integer greater than or equal to 3'
    );
  }
  const kernel = [];
  const twoSigmaSquare = 2 * sigma * sigma;
  const centre = (dimension - 1) / 2;

  for (let i = 0; i < dimension; i++) {
    for (let j = 0; j < dimension; j++) {
      var distance = hypotenuse(i, j, centre, centre);

      // The following is an algorithm that came from the gaussian blur
      // wikipedia page [1].
      //
      // http://en.wikipedia.org/w/index.php?title=Gaussian_blur&oldid=608793634#Mechanics
      //var gaussian = ;

      kernel.push((1 / Math.sqrt(
        Math.PI * twoSigmaSquare
      )) * Math.exp((-1) * (Math.pow(distance, 2) / twoSigmaSquare)));
    }
  }

  // Returns the unit vector of the kernel array.
  const sum = kernel.reduce(function (c, p) { return c + p; });
  const arr_res = kernel.map(function (e) { return e / sum; });

  const res = new Float32Array(arr_res);
  return res;

}

module.exports = generateGaussianKernel;
