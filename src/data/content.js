/**
 * Centralized content for the entire application
 */

// Static imports return a StaticImageData object ({ src, width, height, blurDataURL }).
// Components currently use raw <img> / <Box component="img">, which only accept a string,
// so we expose the .src property. (Migrate components to next/image to use the full object.)
import arcLampLivingImg from '../assets/brand-mood/arc-lamp-living.png';
import columnLampStudioImg from '../assets/brand-mood/column-lamp-studio.png';
import archLightGalleryImg from '../assets/brand-mood/arch-light-gallery.png';
import splitDiscMeditationImg from '../assets/brand-mood/split-disc-meditation.png';
import capsuleLampLoftImg from '../assets/brand-mood/capsule-lamp-loft.png';

import arcLampLivingNightImg from '../assets/brand-mood/arc-lamp-living-night.png';
import columnLampStudioNightImg from '../assets/brand-mood/column-lamp-studio-night.png';
import archLightGalleryNightImg from '../assets/brand-mood/arch-light-gallery-night.png';
import splitDiscMeditationNightImg from '../assets/brand-mood/split-disc-meditation-night.png';
import capsuleLampLoftNightImg from '../assets/brand-mood/capsule-lamp-loft-night.png';

const arcLampLiving = arcLampLivingImg.src;
const columnLampStudio = columnLampStudioImg.src;
const archLightGallery = archLightGalleryImg.src;
const splitDiscMeditation = splitDiscMeditationImg.src;
const capsuleLampLoft = capsuleLampLoftImg.src;

const arcLampLivingNight = arcLampLivingNightImg.src;
const columnLampStudioNight = columnLampStudioNightImg.src;
const archLightGalleryNight = archLightGalleryNightImg.src;
const splitDiscMeditationNight = splitDiscMeditationNightImg.src;
const capsuleLampLoftNight = capsuleLampLoftNightImg.src;

export const content = {
  // Brand information
  brand: {
    name: 'Lumenstate',
    tagline: 'Light defines the space.',
  },

  // Navigation
  navigation: {
    menuItems: [
      { id: 'brand', label: 'Brand', path: '/brand' },
      { id: 'collection', label: 'Collection', path: '/collection' },
      { id: 'shop', label: 'Shop', path: '/shop' },
    ],
  },

  // Hero section
  hero: {
    title: 'Lumenstate',
    subtitle: 'Light defines the space.',
    moodboard: {
      hero: arcLampLiving,
      heroNight: arcLampLivingNight,
      side: archLightGallery,
      sideNight: archLightGalleryNight,
      sideAlt: 'Arch light in gallery space',
      gallery: [
        { src: archLightGallery, srcNight: archLightGalleryNight, alt: 'Arch light in gallery space' },
        { src: splitDiscMeditation, srcNight: splitDiscMeditationNight, alt: 'Split disc in meditation room' },
        { src: capsuleLampLoft, srcNight: capsuleLampLoftNight, alt: 'Capsule lamp in loft workspace' },
      ],
    },
  },

  // Brand Value section
  brandValue: {
    features: [
      {
        id: 'immanence',
        icon: 'CircleDot',
        title: 'Immanence',
        description: 'Light quietly residing within the space.',
        detailedDescription: '조명이 건축과 하나가 되어 은은하고 눈부심 없는 빛을 전합니다. 공간의 표면과 시선을 해치지 않으면서, 드러내지 않는 존재감과 방해 없는 정밀함을 구현합니다.',
      },
      {
        id: 'continuity',
        icon: 'Repeat',
        title: 'Continuity',
        description: 'Seamless & natural day to night flow.',
        detailedDescription: '밝기와 색온도가 하루의 흐름을 따라 한낮의 선명함에서 저녁의 온기로 부드럽게 이어집니다. 급격한 변화나 깜빡임 없이, 오직 안정적이고 편안한 빛만을 선사합니다.',
      },
      {
        id: 'flexibility',
        icon: 'Activity',
        title: 'Flexibility',
        description: 'Auto by default, precise on demand.',
        detailedDescription: '자동화가 일상의 조명을 관리하고, 필요할 때는 즉시 조도와 색온도를 정밀하게 제어할 수 있습니다. 최소한의 센서와 효율적인 기본 설정으로 공간의 맥락을 존중합니다.',
      },
    ],
  },

  // Product showcase
  products: {
    sectionTitle: 'Product Showcase',
    sectionSubtitle: 'Explore brightness and color temperature changes throughout the day',
  },

  // Footer (if needed later)
  footer: {
    copyright: '© 2025 Lumenstate. All rights reserved.',
  },
};

export default content;
