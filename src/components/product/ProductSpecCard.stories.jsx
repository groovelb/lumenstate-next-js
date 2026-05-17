import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Sun, Thermometer, Zap, Layers, Box as BoxIcon, ArrowUpDown } from 'lucide-react';
import ProductSpecCard from './ProductSpecCard';

const ICON_SIZE = 20;
const ICON_STROKE = 1.5;

export default {
  title: 'Custom Component/product/ProductSpecCard',
  component: ProductSpecCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## ProductSpecCard

제품 스펙 정보를 아이콘 + 라벨 + 값 조합으로 표시하는 카드.
LineGrid 내부에서 구분선과 함께 배치하여 사용.

### 특징
- 상단: lucide-react 아이콘
- 하단: 라벨 (UPPERCASE, caption) + 값 (monospace)
- 수직 가운데 정렬 레이아웃
        `,
      },
    },
  },
  argTypes: {
    icon: {
      control: false,
      description: 'lucide-react 아이콘 JSX 노드 (ReactNode). Controls에서 직접 편집 불가.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    label: {
      control: 'text',
      description: '스펙 라벨 (예: "Type", "Luminance")',
      table: {
        type: { summary: 'string' },
      },
    },
    value: {
      control: 'text',
      description: '스펙 값 (예: "Ceiling", "260 lx")',
      table: {
        type: { summary: 'string | number' },
      },
    },
    sx: {
      control: 'object',
      description: '추가 스타일 (MUI sx)',
      table: {
        type: { summary: 'object' },
      },
    },
  },
};

/** 기본 사용 */
export const Default = {
  render: (args) => (
    <Box sx={{ width: 120 }}>
      <ProductSpecCard
        icon={<Sun size={ICON_SIZE} strokeWidth={ICON_STROKE} />}
        label={args.label || 'Luminance'}
        value={args.value || '260 lx'}
        sx={args.sx}
      />
    </Box>
  ),
  args: {
    label: 'Luminance',
    value: '260 lx',
  },
};

/** 다양한 스펙 항목 */
export const SpecVariants = {
  render: () => (
    <Stack direction="row" spacing={0} divider={<Divider orientation="vertical" flexItem />}>
      <Box sx={{ width: 120 }}>
        <ProductSpecCard
          icon={<BoxIcon size={ICON_SIZE} strokeWidth={ICON_STROKE} />}
          label="Type"
          value="Ceiling"
        />
      </Box>
      <Box sx={{ width: 120 }}>
        <ProductSpecCard
          icon={<Sun size={ICON_SIZE} strokeWidth={ICON_STROKE} />}
          label="Luminance"
          value="260 lx"
        />
      </Box>
      <Box sx={{ width: 120 }}>
        <ProductSpecCard
          icon={<Thermometer size={ICON_SIZE} strokeWidth={ICON_STROKE} />}
          label="Color Temp"
          value="2700 K"
        />
      </Box>
      <Box sx={{ width: 120 }}>
        <ProductSpecCard
          icon={<Zap size={ICON_SIZE} strokeWidth={ICON_STROKE} />}
          label="Wattage"
          value="18 W"
        />
      </Box>
      <Box sx={{ width: 120 }}>
        <ProductSpecCard
          icon={<ArrowUpDown size={ICON_SIZE} strokeWidth={ICON_STROKE} />}
          label="Height"
          value="61–72 in"
        />
      </Box>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 스펙 항목을 아이콘과 함께 나란히 배치한 예시입니다.',
      },
    },
  },
};

/** LineGrid 배치 시뮬레이션 */
export const GridLayout = {
  render: () => (
    <Box sx={{ width: 500 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        LineGrid 내부 배치 예시 (구분선 포함)
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          border: '1px solid',
          borderColor: 'divider',
          '& > *': {
            borderRight: '1px solid',
            borderColor: 'divider',
            '&:last-child': { borderRight: 'none' },
          },
        }}
      >
        <ProductSpecCard
          icon={<BoxIcon size={ICON_SIZE} strokeWidth={ICON_STROKE} />}
          label="Type"
          value="Ceiling"
        />
        <ProductSpecCard
          icon={<Sun size={ICON_SIZE} strokeWidth={ICON_STROKE} />}
          label="Luminance"
          value="260 lx"
        />
        <ProductSpecCard
          icon={<Thermometer size={ICON_SIZE} strokeWidth={ICON_STROKE} />}
          label="Color Temp"
          value="2700 K"
        />
        <ProductSpecCard
          icon={<Layers size={ICON_SIZE} strokeWidth={ICON_STROKE} />}
          label="Finish"
          value="Opaline"
        />
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'LineGrid 컴포넌트와 함께 사용하는 실제 배치 패턴을 보여줍니다.',
      },
    },
  },
};
