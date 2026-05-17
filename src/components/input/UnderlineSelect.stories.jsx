import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import UnderlineSelect from './UnderlineSelect';

const GLASS_FINISH_OPTIONS = [
  { value: 'opaline', label: 'Opaline' },
  { value: 'clear', label: 'Clear Glass' },
  { value: 'frosted', label: 'Frosted' },
  { value: 'amber', label: 'Amber' },
];

const HARDWARE_OPTIONS = [
  { value: 'patina-brass', label: 'Patina Brass' },
  { value: 'chrome', label: 'Chrome' },
  { value: 'matte-black', label: 'Matte Black' },
  { value: 'brushed-nickel', label: 'Brushed Nickel' },
];

const HEIGHT_OPTIONS = [
  { value: '48-60', label: '48–60 in' },
  { value: '61-72', label: '61–72 in' },
  { value: '73-84', label: '73–84 in' },
];

export default {
  title: 'Custom Component/input/UnderlineSelect',
  component: UnderlineSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## UnderlineSelect

하단 underline만 있는 미니멀한 셀렉트 필드.
제품 옵션 선택(Glass Finish, Hardware, Height 등)에 사용.

### 특징
- 상단 라벨 + 하단 border 셀렉트 영역
- 드롭다운 메뉴 (MUI Select standard variant)
- placeholder 지원 (displayEmpty)
- small / medium / large 세 가지 크기
        `,
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: '필드 상단 라벨',
      table: {
        type: { summary: 'string' },
      },
    },
    value: {
      control: 'text',
      description: '현재 선택된 값',
      table: {
        type: { summary: 'string' },
      },
    },
    options: {
      control: 'object',
      description: '옵션 배열 [{ value, label, disabled? }]',
      table: {
        type: { summary: 'Array<{ value: string, label: string, disabled?: boolean }>' },
      },
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트 (값이 없을 때 표시)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "''" },
      },
    },
    isDisabled: {
      control: 'boolean',
      description: '비활성화 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '컴포넌트 크기',
      table: {
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: 'medium' },
      },
    },
    onChange: {
      action: 'changed',
      description: '변경 핸들러 (event) => void',
      table: {
        type: { summary: 'function' },
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
  render: function DefaultDemo(args) {
    const [value, setValue] = useState(args.value ?? '');

    return (
      <Box sx={{ width: 240 }}>
        <UnderlineSelect
          {...args}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            args.onChange?.(e);
          }}
        />
      </Box>
    );
  },
  args: {
    label: 'Glass Finish',
    value: 'opaline',
    options: GLASS_FINISH_OPTIONS,
    placeholder: '',
    isDisabled: false,
    size: 'medium',
  },
};

/** 제품 옵션 조합 */
export const ProductOptions = {
  render: function ProductOptionsDemo() {
    const [finish, setFinish] = useState('opaline');
    const [hardware, setHardware] = useState('patina-brass');
    const [height, setHeight] = useState('61-72');

    return (
      <Stack spacing={3} sx={{ width: 280 }}>
        <Typography variant="body2" color="text.secondary">
          제품 옵션 선택
        </Typography>
        <UnderlineSelect
          label="Glass Finish"
          value={finish}
          onChange={(e) => setFinish(e.target.value)}
          options={GLASS_FINISH_OPTIONS}
        />
        <UnderlineSelect
          label="Hardware"
          value={hardware}
          onChange={(e) => setHardware(e.target.value)}
          options={HARDWARE_OPTIONS}
        />
        <UnderlineSelect
          label="Height"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          options={HEIGHT_OPTIONS}
        />
        <Box sx={{ pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            선택: {finish} / {hardware} / {height}
          </Typography>
        </Box>
      </Stack>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '실제 제품 페이지에서 사용하는 Glass Finish / Hardware / Height 옵션 조합입니다.',
      },
    },
  },
};

/** 플레이스홀더 */
export const WithPlaceholder = {
  render: function PlaceholderDemo() {
    const [value, setValue] = useState('');

    return (
      <Box sx={{ width: 240 }}>
        <UnderlineSelect
          label="Glass Finish"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          options={GLASS_FINISH_OPTIONS}
          placeholder="옵션을 선택하세요"
        />
      </Box>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'placeholder prop으로 초기 안내 문구를 표시합니다. 선택 후 사라집니다.',
      },
    },
  },
};

/** 크기 비교 */
export const Sizes = {
  render: () => (
    <Stack spacing={4} sx={{ width: 240 }}>
      {['small', 'medium', 'large'].map((size) => (
        <Stack key={size} spacing={1}>
          <Typography variant="caption" color="text.secondary">
            {size}{size === 'medium' ? ' (기본)' : ''}
          </Typography>
          <UnderlineSelect
            label="Glass Finish"
            value="opaline"
            onChange={() => {}}
            options={GLASS_FINISH_OPTIONS}
            size={size}
          />
        </Stack>
      ))}
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'small, medium, large 세 가지 크기를 비교합니다.',
      },
    },
  },
};

/** 비활성화 상태 */
export const Disabled = {
  render: () => (
    <Stack spacing={3} sx={{ width: 240 }}>
      <Stack spacing={1}>
        <Typography variant="caption" color="text.secondary">
          활성화
        </Typography>
        <UnderlineSelect
          label="Glass Finish"
          value="opaline"
          onChange={() => {}}
          options={GLASS_FINISH_OPTIONS}
        />
      </Stack>
      <Stack spacing={1}>
        <Typography variant="caption" color="text.secondary">
          비활성화
        </Typography>
        <UnderlineSelect
          label="Glass Finish"
          value="opaline"
          onChange={() => {}}
          options={GLASS_FINISH_OPTIONS}
          isDisabled
        />
      </Stack>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'isDisabled 상태에서는 드롭다운이 열리지 않습니다.',
      },
    },
  },
};
