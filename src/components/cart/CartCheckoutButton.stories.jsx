import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CartCheckoutButton from './CartCheckoutButton';

export default {
  title: 'Custom Component/CartCheckoutButton',
  component: CartCheckoutButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## CartCheckoutButton

장바구니 체크아웃 버튼 컴포넌트. 전체 너비의 강조 버튼.

### 특징
- 전체 너비(fullWidth) contained 버튼
- 비활성화 상태 (빈 장바구니, isDisabled)
- 로딩 상태 (isLoading) 시 'Processing...' 텍스트 표시
- onCheckout 핸들러 연결
        `,
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: '버튼 텍스트',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Checkout' },
      },
    },
    isDisabled: {
      control: 'boolean',
      description: '비활성화 여부 (장바구니가 비어있을 때 사용)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    isLoading: {
      control: 'boolean',
      description: '로딩 상태. true 시 "Processing..." 텍스트 표시',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onCheckout: {
      action: 'checkout',
      description: '체크아웃 버튼 클릭 핸들러 () => void',
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
  args: {
    label: 'Checkout',
    isDisabled: false,
    isLoading: false,
  },
  render: (args) => (
    <Box sx={{ width: 380 }}>
      <CartCheckoutButton {...args} />
    </Box>
  ),
};

/** 상태별 비교 */
export const States = {
  render: () => (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="caption" color="text.secondary">
          기본 (활성화)
        </Typography>
        <Box sx={{ width: 380 }}>
          <CartCheckoutButton label="Checkout" />
        </Box>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="caption" color="text.secondary">
          비활성화 (빈 장바구니)
        </Typography>
        <Box sx={{ width: 380 }}>
          <CartCheckoutButton label="Checkout" isDisabled />
        </Box>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="caption" color="text.secondary">
          로딩 중
        </Typography>
        <Box sx={{ width: 380 }}>
          <CartCheckoutButton label="Checkout" isLoading />
        </Box>
      </Stack>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: '기본, 비활성화, 로딩 세 가지 상태를 비교합니다.',
      },
    },
  },
};

/** 인터랙티브 예제 */
export const Interactive = {
  render: function InteractiveDemo() {
    const [isLoading, setIsLoading] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleCheckout = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsDone(true);
      }, 2000);
    };

    return (
      <Stack spacing={2} sx={{ width: 380 }}>
        <CartCheckoutButton
          label={isDone ? 'Order Placed!' : 'Checkout'}
          isLoading={isLoading}
          isDisabled={isDone}
          onCheckout={handleCheckout}
        />
        {isDone && (
          <Typography variant="caption" color="success.main" textAlign="center">
            주문이 완료되었습니다.
          </Typography>
        )}
      </Stack>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '버튼 클릭 시 로딩 상태를 거쳐 완료 상태로 전환되는 예제입니다.',
      },
    },
  },
};
