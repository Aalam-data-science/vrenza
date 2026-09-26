import fs from 'fs';
import zlib from 'zlib';

function createSolidPNG(width, height, r, g, b, a = 255) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8 bit depth
  ihdrData.writeUInt8(6, 9); // RGBA color type
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Raw image data: filter byte (0) + RGBA per pixel per row
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  // Center coordinates for drawing a simple cross and circle
  const cx = width / 2;
  const cy = height / 2;
  const outerR = width * 0.4;
  const crossW = width * 0.1;
  const crossL = width * 0.35;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // None filter
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background #FBFBF7
      let pr = 0xFB, pg = 0xFB, pb = 0xF7, pa = 255;

      // Outer ring border
      if (Math.abs(dist - outerR) < width * 0.015) {
        pr = 0x3E; pg = 0x6B; pb = 0x8E; // Surgical blue
      }
      // Medical cross #3C7049
      else if ((Math.abs(dx) <= crossW && Math.abs(dy) <= crossL) ||
               (Math.abs(dy) <= crossW && Math.abs(dx) <= crossL)) {
        pr = 0x3C; pg = 0x70; pb = 0x49; // Clinical green
      }
      // Center dot
      else if (dist < width * 0.04) {
        pr = 0x22; pg = 0x24; pb = 0x1F;
      }

      rawData[pxOffset] = pr;
      rawData[pxOffset + 1] = pg;
      rawData[pxOffset + 2] = pb;
      rawData[pxOffset + 3] = pa;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcPayload = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(crcPayload);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

fs.writeFileSync('public/pwa-192x192.png', createSolidPNG(192, 192, 60, 112, 73));
fs.writeFileSync('public/pwa-512x512.png', createSolidPNG(512, 512, 60, 112, 73));
fs.writeFileSync('public/pwa-maskable-512x512.png', createSolidPNG(512, 512, 60, 112, 73));
fs.writeFileSync('public/apple-touch-icon.png', createSolidPNG(180, 180, 60, 112, 73));
console.log('Valid PWA PNG icons generated successfully in public/');
