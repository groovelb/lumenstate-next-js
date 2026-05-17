// Static imports return a StaticImageData object ({ src, width, height, blurDataURL }).
// Components currently use raw <img> / <Box component="img">, which only accept a string,
// so productAssets exposes the .src property. (Migrate components to next/image to use
// the full object.)
import p1 from './1.png';
import p1_1 from './1-1.png';
import p2 from './2.png';
import p2_1 from './2-1.png';
import p3 from './3.png';
import p3_1 from './3-1.png';
import p4 from './4.png';
import p4_1 from './4-1.png';
import p5 from './5.png';
import p5_1 from './5-1.png';
import p6 from './6.png';
import p6_1 from './6-1.png';
import p7 from './7.png';
import p7_1 from './7-1.png';
import p8 from './8.png';
import p8_1 from './8-1.png';
import p9 from './9.png';
import p9_1 from './9-1.png';
import p10 from './10.png';
import p10_1 from './10-1.png';
import p11 from './11.png';
import p11_1 from './11-1.png';
import p12 from './12.png';
import p12_1 from './12-1.png';
import p13 from './13.png';
import p13_1 from './13-1.png';
import p14 from './14.png';
import p14_1 from './14-1.png';
import p15 from './15.png';
import p15_1 from './15-1.png';
import p16 from './16.png';
import p16_1 from './16-1.png';
import p17 from './17.png';
import p17_1 from './17-1.png';
import p18 from './18.png';
import p18_1 from './18-1.png';
import p19 from './19.png';
import p19_1 from './19-1.png';
import p20 from './20.png';
import p20_1 from './20-1.png';

export const productAssets = {
  1: { images: [p1.src, p1_1.src] },
  2: { images: [p2.src, p2_1.src] },
  3: { images: [p3.src, p3_1.src] },
  4: { images: [p4.src, p4_1.src] },
  5: { images: [p5.src, p5_1.src] },
  6: { images: [p6.src, p6_1.src] },
  7: { images: [p7.src, p7_1.src] },
  8: { images: [p8.src, p8_1.src] },
  9: { images: [p9.src, p9_1.src] },
  10: { images: [p10.src, p10_1.src] },
  11: { images: [p11.src, p11_1.src] },
  12: { images: [p12.src, p12_1.src] },
  13: { images: [p13.src, p13_1.src] },
  14: { images: [p14.src, p14_1.src] },
  15: { images: [p15.src, p15_1.src] },
  16: { images: [p16.src, p16_1.src] },
  17: { images: [p17.src, p17_1.src] },
  18: { images: [p18.src, p18_1.src] },
  19: { images: [p19.src, p19_1.src] },
  20: { images: [p20.src, p20_1.src] },
};
