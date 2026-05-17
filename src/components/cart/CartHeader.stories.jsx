import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CartHeader from './CartHeader';

export default {
  title: 'Custom Component/CartHeader',
  component: CartHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## CartHeader

장바구니 헤더 컴포넌트. "Cart" 타이틀 + 닫기(X) 버튼 행.

### 특징
- 좌측: 타이틀 텍스트 (기본값: 'Cart')
- 우측: IconButton 닫기 버튼
- 하단 divider 라인
        `,
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: '헤더 타이틀 텍스트',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Cart' },
      },
    },
    onClose: {
      action: 'closed',
      description: '닫기 버튼 클릭 핸들러 () => void',
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
    title: 'Cart',
  },
  render: (args) => (
    <Box sx={{ width: 380, border: '1px solid', borderColor: 'divider' }}>
      <CartHeader {...args} />
    </Box>
  ),
};

/** 커스텀 타이틀 */
export const CustomTitle = {
  render: () => (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="caption" color="text.secondary">
          기본 타이틀
        </Typography>
        <Box sx={{ width: 380, border: '1px solid', borderColor: 'divider' }}>
          <CartHeader title="Cart" />
        </Box>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="caption" color="text.secondary">
          커스텀 타이틀
        </Typography>
        <Box sx={{ width: 380, border: '1px solid', borderColor: 'divider' }}>
          <CartHeader title="My Bag (3)" />
        </Box>
      </Stack>
    </Stack>
  ),
};

/** 인터랙티브 예제 */
export const Interactive = {
  render: function InteractiveDemo() {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <Stack spacing={2} sx={{ width: 380 }}>
        <Box sx={{ border: '1px solid', borderColor: 'divider', opacity: isOpen ? 1 : 0.4 }}>
          <CartHeader title="Cart" onClose={() => setIsOpen(false)} />
          {isOpen && (
            <Box sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary">
                패널 콘텐츠 영역
              </Typography>
            </Box>
          )}
        </Box>
        {!isOpen && (
          <Typography variant="caption" color="text.secondary">
            닫기 버튼을 클릭하면 onClose가 호출됩니다.
          </Typography>
        )}
      </Stack>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '닫기 버튼 클릭 시 onClose 핸들러가 호출됩니다.',
      },
    },
  },
};
