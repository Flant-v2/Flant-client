import { useState } from 'react';
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
    size: {
      options: ['medium', 'large'],
      control: { type: 'select' },
      defaultValue: { summary: 'medium' },
      description: '크기를 지정합니다',
    },
    disabled: {
      options: [true, false],
      control: 'boolean',
      defaultValue: { summary: false },
      description: '선택 가능 여부를 지정합니다',
    },
    checked: {
      options: [true, false],
      control: 'boolean',
      defaultValue: { summary: false },
      description: '선택 여부를 지정합니다',
    },
    onCheckedChange: {
      description: '선택 함수',
    },
  },
} satisfies Meta<typeof CheckBox>;

export default meta;

type Story = StoryObj<typeof meta>;

// 기본 스토리 정의
export const Default: Story = {
  args: {
    size: 'medium',
    disabled: false,
    checked: false,
    onCheckedChange: (checked: boolean) => console.log(checked), // 기본 함수
  },
  render: args => {
    const [checked, setChecked] = useState(args.checked); // 초기 값 설정

    const handleCheckedChange = (newChecked: boolean) => {
      setChecked(newChecked); // 상태 업데이트
      args.onCheckedChange(newChecked); // args의 onCheckedChange 호출
    };

    return (
      <CheckBox
        {...args}
        checked={checked}
        onCheckedChange={handleCheckedChange} // 상태 변경 함수 전달
      />
    );
  },
};
