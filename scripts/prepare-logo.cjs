const sharp = require('sharp');

const input = 'src/assets/images/cortek_logo_1787330624536.jpg';
const output = 'src/assets/images/cortek_logo_transparent_gold.png';

sharp(input)
  .raw()
  .toBuffer({ resolveWithObject: true })
  .then(({ data, info }) => {
    const { width, height, channels } = info;
    const out = Buffer.alloc(width * height * 4);

    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const isBackground = r < 80 && g < 80 && b < 80;

      const rr = Math.min(255, r + 18);
      const gg = Math.min(255, g + 12);
      const bb = Math.max(0, b - 16);
      const alpha = isBackground ? 0 : 255;

      const offset = (i / channels) * 4;
      out[offset] = rr;
      out[offset + 1] = gg;
      out[offset + 2] = bb;
      out[offset + 3] = alpha;
    }

    return sharp(out, { raw: { width, height, channels: 4 } })
      .png()
      .toFile(output);
  })
  .then(() => {
    console.log('Created:', output);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
