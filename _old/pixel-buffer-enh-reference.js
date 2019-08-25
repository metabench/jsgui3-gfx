
// Reference implementations - not so optimized.
//  Still may be useful to understand the algorithms.

/*

let stacked_mapped_flood_fill = () => {
            const map_pixels_visited = {};
            const arr_pixels_to_visit = [
                [x, y]
            ];
            let c_visited = 0;
            const buffer = this.buffer;

            let pixel_buffer_pos = this.bytes_per_pixel * (x + y * this.size[0]);

            const c_start = new Uint8Array([buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++)]);
            //console.log('c_start', c_start);
            while (c_visited < arr_pixels_to_visit.length) {
                // 
                [x, y] = arr_pixels_to_visit[c_visited];
                //console.log('c_visited', c_visited);
                map_pixels_visited[[x, y]] = true;
                //console.log('[x, y]', [x, y]);

                // Check this pixel...
                let pixel_buffer_pos = this.bytes_per_pixel * (x + y * this.size[0]);
                //const [pr, pg, pb, pa] = 
                const c_px = new Uint8Array([buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++), buffer.readUInt8(pixel_buffer_pos++)]);
                //console.log('c_px', c_px);
                // then the difference from the start colors

                const c_diff = new Uint8Array([c_start[0] - c_px[0], c_start[1] - c_px[1], c_start[2] - c_px[2], c_start[3] - c_px[3]]);
                //console.log('c_diff', c_diff);
                if (c_diff[0] === 0 && c_diff[1] === 0 && c_diff[2] === 0 && c_diff[3] === 0) {
                    // No color change
                    //  So change the color
                    pixel_buffer_pos -= 4;
                    buffer.writeUInt8(r, pixel_buffer_pos++);
                    buffer.writeUInt8(g, pixel_buffer_pos++);
                    buffer.writeUInt8(b, pixel_buffer_pos++);
                    buffer.writeUInt8(a, pixel_buffer_pos++);

                    // Add adjacent pixels to the queue
                    //  if they've not been visited before.

                    if (x - 1 > 0 && x - 1 < w && !map_pixels_visited[[x - 1, y]]) {
                        arr_pixels_to_visit.push([x - 1, y]);
                    }
                    if (y - 1 > 0 && y - 1 < h && !map_pixels_visited[[x, y - 1]]) {
                        arr_pixels_to_visit.push([x, y - 1]);
                    }
                    if (x + 1 > 0 && x + 1 < w && !map_pixels_visited[[x + 1, y]]) {
                        arr_pixels_to_visit.push([x + 1, y]);
                    }
                    if (y + 1 > 0 && y + 1 < h && !map_pixels_visited[[x, y + 1]]) {
                        arr_pixels_to_visit.push([x, y + 1]);
                    }
                }
                // compare these arrays

                // Add adjacent pixels to the stack?
                c_visited++;
            }
            //console.log('c_visited', c_visited);
        }
        //stacked_mapped_flood_fill();


*/