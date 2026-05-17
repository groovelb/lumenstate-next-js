import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import UnderlineInput from './UnderlineInput';

export default {
  title: 'Custom Component/input/UnderlineInput',
  component: UnderlineInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## UnderlineInput

하단 underline만 있는 미니멀한 텍스트 입력 필드.
readOnly 모드를 지원하여 정보 표시용으로도 사용 가능.

### 특징
- 상단 라벨 + 하단 border 입력 영역
- focus 시 underline 색상 전환 (200ms ease)
- readOnly: 편집 불가, 정보 표시 전용
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
      description: '입력 값',
      table: {
        type: { summary: 'string' },
      },
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "''" },
      },
    },
    isReadOnly: {
      control: 'boolean',
      description: '읽기 전용 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
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
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel'],
      description: 'HTML input type',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'text' },
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

/** 기본 사용 (편집 가능) */
export const Default = {
  render: function DefaultDemo(args) {
    const [value, setValue] = useState(args.value ?? '');

    return (
      <Box sx={{ width: 280 }}>
        <UnderlineInput
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
    label: 'Email',
    value: '',
    placeholder: 'Enter email address',
    isReadOnly: false,
    isDisabled: false,
    size: 'medium',
  },
};

/** 읽기 전용 (정보 표시) */
export const ReadOnly = {
  render: () => (
    <Stack spacing={3} sx={{ width: 280 }}>
      <UnderlineInput label="Item Number" value="FA-100318" isReadOnly />
      <UnderlineInput label="Lead Time" value="12 Weeks" isReadOnly />
      <UnderlineInput label="Est. Ship Date" value="March 5, 2026" isReadOnly />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'isReadOnly 모드에서는 커서가 default로 전환되고 border 색이 변하지 않습니다.',
      },
    },
  },
};

/** 크기 비교 */
export const Sizes = {
  render: () => (
    <Stack spacing={4} sx={{ width: 280 }}>
      <Stack spacing={1}>
        <Typography variant="caption" color="text.secondary">
          small
        </Typography>
        <UnderlineInput label="Name" value="Flora Chandelier" size="small" isReadOnly />
      </Stack>
      <Stack spacing={1}>
        <Typography variant="caption" color="text.secondary">
          medium (기본)
        </Typography>
        <UnderlineInput label="Name" value="Flora Chandelier" size="medium" isReadOnly />
      </Stack>
      <Stack spacing={1}>
        <Typography variant="caption" color="text.secondary">
          large
        </Typography>
        <UnderlineInput label="Name" value="Flora Chandelier" size="large" isReadOnly />
      </Stack>
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

/** 상태별 비교 */
export const States = {
  render: function StatesDemo() {
    const [value, setValue] = useState('입력 가능한 필드');

    return (
      <Stack spacing={4} sx={{ width: 280 }}>
        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary">
            편집 가능
          </Typography>
          <UnderlineInput
            label="Label"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Stack>
        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary">
            읽기 전용
          </Typography>
          <UnderlineInput label="Label" value="읽기 전용 값" isReadOnly />
        </Stack>
        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary">
            비활성화
          </Typography>
          <UnderlineInput label="Label" value="비활성화 값" isDisabled />
        </Stack>
        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary">
            플레이스홀더
          </Typography>
          <UnderlineInput label="Label" value="" placeholder="값을 입력하세요" />
        </Stack>
      </Stack>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '편집 가능, 읽기 전용, 비활성화, 플레이스홀더 네 가지 상태를 비교합니다.',
      },
    },
  },
};
