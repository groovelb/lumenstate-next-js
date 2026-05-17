import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CartSummary from './CartSummary';

export default {
  title: 'Custom Component/CartSummary',
  component: CartSummary,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## CartSummary

장바구니 소계(Subtotal) 표시 컴포넌트.

### 특징
- 좌측: 라벨 텍스트 (기본값: 'Subtotal')
- 우측: 통화 포맷이 적용된 금액 (Intl.NumberFormat)
- 상단 divider 라인
        `,
      },
    },
  },
  argTypes: {
    subtotal: {
      control: { type: 'number', min: 0, step: 100 },
      description: '소계 금액 (숫자)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    currency: {
      control: 'select',
      options: ['USD', 'EUR', 'KRW', 'GBP'],
      description: '통화 코드 (ISO 4217)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'USD' },
      },
    },
    label: {
      control: 'text',
      description: '라벨 텍스트',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Subtotal' },
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
  args: {
    subtotal: 2580,
    currency: 'USD',
    label: 'Subtotal',
  },
  render: (args) => (
    <Box sx={{ width: 380, border: '1px solid', borderColor: 'divider' }}>
      <CartSummary {...args} />
    </Box>
  ),
};

/** 금액 범위 */
export const AmountVariants = {
  render: () => (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="caption" color="text.secondary">
          금액 없음 (빈 장바구니)
        </Typography>
        <Box sx={{ width: 380, border: '1px solid', borderColor: 'divider' }}>
          <CartSummary subtotal={0} />
        </Box>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="caption" color="text.secondary">
          일반 금액
        </Typography>
        <Box sx={{ width: 380, border: '1px solid', borderColor: 'divider' }}>
          <CartSummary subtotal={1290} />
        </Box>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="caption" color="text.secondary">
          고액 주문
        </Typography>
        <Box sx={{ width: 380, border: '1px solid', borderColor: 'divider' }}>
          <CartSummary subtotal={12580} />
        </Box>
      </Stack>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 금액 범위에서 통화 포맷이 올바르게 표시되는지 확인합니다.',
      },
    },
  },
};

/** 커스텀 라벨 */
export const CustomLabel = {
  render: () => (
    <Stack spacing={3}>
      <Box sx={{ width: 380, border: '1px solid', borderColor: 'divider' }}>
        <CartSummary subtotal={2580} label="Subtotal" />
      </Box>
      <Box sx={{ width: 380, border: '1px solid', borderColor: 'divider' }}>
        <CartSummary subtotal={2580} label="Total" />
      </Box>
      <Box sx={{ width: 380, border: '1px solid', borderColor: 'divider' }}>
        <CartSummary subtotal={2580} label="Order Total" />
      </Box>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'label prop으로 라벨 텍스트를 변경할 수 있습니다.',
      },
    },
  },
};
