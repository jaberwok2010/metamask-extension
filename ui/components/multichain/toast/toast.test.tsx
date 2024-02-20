/* eslint-disable jest/require-top-level-describe */
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import testData from '../../../../.storybook/test-data';
import { Toast } from '.';
import { AvatarAccount, AvatarAccountSize } from '../../component-library';
import { BorderColor } from '../../../helpers/constants/design-system';

const [chaosAddress] = Object.keys(testData.metamask.identities);

const CHAOS_IDENTITY = {
  ...testData.metamask.identities[chaosAddress],
  balance: '0x152387ad22c3f0',
  keyring: {
    type: 'HD Key Tree',
  },
};

const onActionClick = jest.fn();
const onClose = jest.fn();

const ToastArgs = {
  startAdornment: (<AvatarAccount
  address={CHAOS_IDENTITY.address}
  size={AvatarAccountSize.Md}
  borderColor={BorderColor.transparent}
/>),
  text: 'This is the Toast text',
  actionText: 'Take some action',
  onActionClick,
  onClose,
}

describe('Toast', () => {
  it('should render Toast component', () => {
    const { container } = render(<Toast {...ToastArgs} />);
    expect(container).toMatchSnapshot();
  });

  it('executes onActionClick properly', () => {
    const { getByText } = render(<Toast {...ToastArgs} />);
    fireEvent.click(getByText(ToastArgs.actionText));
    expect(onActionClick).toHaveBeenCalled();
  });

  it('executes onClose properly', () => {
    render(<Toast {...ToastArgs} />);
    const closeButton = document.querySelector('.mm-banner-base__close-button');
    if (closeButton) {
      fireEvent.click(closeButton);
    }
    expect(closeButton).toBeDefined();
    expect(onActionClick).toHaveBeenCalled();
  });
});
