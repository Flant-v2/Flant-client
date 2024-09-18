import CheckBox from './CheckBox';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Component/CheckBox',
  component: CheckBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'CheckBox는 태그를 표시하는 컴포넌트입니다',
      },
    },
  },
  argTypes: {
    className: {
      control: { type: 'text' },
      description: '추가적인 클래스를 지정합니다',
      table: {
        type: { summary: 'string' },
      },
    },
    size1: {
      options: ['medium', 'large'],
      control: { type: 'select' },
      defaultValue: { summary: 'medium' },
      description: '크기를 지정합니다',
    },
    disabled: {
      options: [true, false],
      control: { type: 'select' },
      defaultValue: { summary: false },
      description: '선택 가능 여부를 지정합니다',
    },
    checked: {
      options: [true, false],
      control: { type: 'select' },
      defaultValue: { summary: false },
      description: '선택 여부를 지정합니다',
    },
    onCheckedChange: { action: 'checked' }, // 액션 핸들러 추가
  },
} satisfies Meta<typeof CheckBox>;

export default meta;

type Story = StoryObj<typeof meta>;

// 기본 스토리 정의
export const Default: Story = {
  args: {
    size1: 'medium',
    disabled: false,
    checked: false,
    onCheckedChange: (checked: boolean) => console.log(checked), // 필수 속성 추가
  },
};
