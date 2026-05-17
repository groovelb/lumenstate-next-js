import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import QuantitySelector from './QuantitySelector';

export default {
  title: 'Custom Component/input/QuantitySelector',
  component: QuantitySelector,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## QuantitySelector

수량 선택을 위한 − / 숫자 / + 형태의 입력 컴포넌트.

### 특징
- 감소(−) 버튼 / 현재 수량 / 증가(+) 버튼
- min/max 범위 제한
- small / medium 두 가지 크기
- 비활성화(isDisabled) 상태 지원
        `,
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'number', min: 1, max: 99 },
      description: '현재 수량',
      table: {
        type: { summary: 'number' },
      },
    },
    min: {
      control: { type: 'number', min: 0 },
      description: '최소 수량',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    max: {
      control: { type: 'number', min: 1 },
      description: '최대 수량',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '99' },
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
      options: ['small', 'medium'],
      description: '컴포넌트 크기',
      table: {
        type: { summary: "'small' | 'medium'" },
        defaultValue: { summary: 'medium' },
      },
    },
    onChange: {
      action: 'changed',
      description: '수량 변경 핸들러 (newValue: number) => void',
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
    const [value, setValue] = useState(args.value ?? 1);

    return (
      <QuantitySelector
        {...args}
        value={value}
        onChange={(v) => {
          setValue(v);
          args.onChange?.(v);
        }}
      />
    );
  },
  args: {
    value: 1,
    min: 1,
    max: 99,
    isDisabled: false,
    size: 'medium',
  },
};

/** 크기 비교 */
export const Sizes = {
  render: () => {
    function SizedDemo({ size }) {
      const [value, setValue] = useState(1);
      return <QuantitySelector value={value} onChange={setValue} size={size} />;
    }

    return (
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary">
            medium (기본)
          </Typography>
          <SizedDemo size="medium" />
        </Stack>
        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary">
            small
          </Typography>
          <SizedDemo size="small" />
        </Stack>
      </Stack>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'small과 medium 두 가지 크기를 비교합니다.',
      },
    },
  },
};

/** 범위 제한 */
export const WithLimits = {
  render: function LimitsDemo() {
    const [value, setValue] = useState(3);

    return (
      <Stack spacing={2}>
        <QuantitySelector value={value} onChange={setValue} min={1} max={5} />
        <Typography variant="caption" color="text.secondary">
          현재 수량: {value} (최소 1, 최대 5)
        </Typography>
      </Stack>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'min=1, max=5로 범위를 제한한 예시입니다. 경계에서 버튼이 비활성화됩니다.',
      },
    },
  },
};

/** 비활성화 상태 */
export const Disabled = {
  render: () => (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="caption" color="text.secondary">
          활성화
        </Typography>
        <QuantitySelector value={2} onChange={() => {}} />
      </Stack>
      <Stack spacing={1}>
        <Typography variant="caption" color="text.secondary">
          비활성화
        </Typography>
        <QuantitySelector value={2} onChange={() => {}} isDisabled />
      </Stack>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'isDisabled 상태에서는 버튼 클릭이 불가능합니다.',
      },
    },
  },
};

/** 장바구니 아이템 수량 조절 시뮬레이션 */
export const CartContext = {
  render: function CartContextDemo() {
    const [items, setItems] = useState([
      { id: 1, name: 'Flora Chandelier', qty: 1 },
      { id: 2, name: 'Lumen Desk Pro', qty: 2 },
    ]);

    const updateQty = (id, qty) => {
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item)));
    };

    return (
      <Stack spacing={2} sx={{ width: 300 }}>
        {items.map((item) => (
          <Box
            key={item.id}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Typography variant="body2">{item.name}</Typography>
            <QuantitySelector
              value={item.qty}
              onChange={(v) => updateQty(item.id, v)}
              size="small"
              min={1}
              max={10}
            />
          </Box>
        ))}
      </Stack>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '장바구니 아이템 목록에서 수량을 독립적으로 조절하는 패턴입니다.',
      },
    },
  },
};
