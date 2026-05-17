import Box from '@mui/material/Box';

import { ElevationSection } from './ElevationSection';

export default {
  title: 'Section/ElevationSection',
  component: ElevationSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## ElevationSection

3개의 Elevation 비디오를 가로 스크롤로 배치하는 섹션.
스크롤 진행도에 따라 각 비디오의 프레임이 스크러빙된다.

### 구조
- HorizontalScrollContainer 안에 3개의 슬라이드 배치
- 각 슬라이드: 전체 화면(100vw × 100vh) 비디오

### 동작
- 연속 가로 스크롤 progress (0→1) 를 3구간으로 분할
- **Set 1**: progress 0→0.33 → 비디오 0%→100% 스크러빙
- **Set 2**: progress 0.33→0.67 → 비디오 0%→100% 스크러빙
- **Set 3**: progress 0.67→1 → 비디오 0%→100% 스크러빙
        `,
      },
    },
  },
  argTypes: {
    sx: {
      control: 'object',
      description: '추가 스타일 객체',
    },
  },
};

/**
 * 기본 사용법 - 가로 스크롤하여 비디오 스크러빙 확인
 */
export const Default = {
  render: () => (
    <Box sx={{ minHeight: '400vh', backgroundColor: 'background.default' }}>
      <ElevationSection />
      <Box sx={{ height: '100vh' }} />
    </Box>
  ),
};
