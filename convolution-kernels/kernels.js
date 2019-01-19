generateGaussianKernel = require('gaussian-convolution-kernel');

module.exports = {
    'edge': new Float32Array(
        [
            -1, -1, -1,
            -1, 8, -1,
            -1, -1, -1
        ]
    ),
    'gauss_blur_5_2': generateGaussianKernel(5, 2),
    'gauss_blur_5_5': generateGaussianKernel(5, 5),
    'get_gauss': (d, sigma) => new Float32Array(generateGaussianKernel(d, sigma)),
    'lap_gauss_5': new Int8Array([
        0, 0, -1, 0, 0,
        0, -1, -2, -1, 0,
        -1, -2, 16, -2, -1,
        0, -1, -2, -1, 0,
        0, 0, -1, 0, 0
    ]),
    'sobel_x': new Int8Array([
        -1, 0, 1,
        -2, 0, 2,
        -1, 0, 1
    ]),
    'sobel_y': new Int8Array([
        1, 2, 1,
        0, 0, 0,
        -1, -2, -1
    ]),
    'sobel_diag_1': new Int8Array([
        0, 1, 2,
        -1, 0, 1,
        -2, -1, 0
    ]),
    'sobel_diag_2': new Int8Array([
        -2, -1, 0,
        -1, 0, 1,
        0, 1, 2
    ])
}