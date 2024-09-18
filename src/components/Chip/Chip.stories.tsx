import Chip from './Chip';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Component/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Chip은 태그를 표시하는 컴포넌트입니다',
      },
    },
  },
  argTypes: {
    as: {
      options: ['div', 'span', 'button', 'a', 'li'],
      control: { type: 'select' },
      defaultValue: { summary: 'div' },
      table: {
        type: { summary: 'React.ElementType' },
      },
      description:
        '태그를 지정합니다<br/>예를 들어, "div", "span", "button" 등 HTML 태그를 입력할 수 있습니다',
    },
    children: {
      control: { type: 'text' },
      description: '내용을 지정합니다',
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
    className: {
      control: { type: 'text' },
      description: '추가적인 클래스를 지정합니다',
      table: {
        type: { summary: 'string' },
      },
    },
    size: {
      options: ['medium'],
      control: { type: 'select' },
      defaultValue: { summary: 'medium' },
      description: '크기를 지정합니다',
    },
    hierarchy: {
      options: ['primary'],
      control: { type: 'select' },
      defaultValue: { summary: 'primary' },
      description: '계층을 지정합니다',
    },
    state: {
      options: ['active', 'inactive'],
      control: { type: 'select' },
      defaultValue: { summary: 'inactive' },
      description: '상태를 지정합니다',
    },
  },
} satisfies Meta<typeof Chip>;

type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    size: 'medium',
    hierarchy: 'primary',
    state: 'active',
    children: 'Chip',
  },
};

export const Inactive: Story = {
  args: {
    size: 'medium',
    hierarchy: 'primary',
    state: 'inactive',
    children: 'Chip',
  },
};

export default meta;
