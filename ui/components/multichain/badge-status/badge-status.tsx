import React from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { WALLET_SNAP_PERMISSION_KEY } from '@metamask/snaps-rpc-methods';
import {
  AlignItems,
  BackgroundColor,
  BorderColor,
  BorderRadius,
  Color,
  Display,
  JustifyContent,
  Size,
} from '../../../helpers/constants/design-system';
import {
  AvatarAccount,
  AvatarAccountSize,
  AvatarAccountVariant,
  BadgeWrapper,
  Box,
  BoxProps,
} from '../../component-library';
import {
  getAddressConnectedSubjectMap,
  getOriginOfCurrentTab,
  getPermissionsForActiveTab,
  getUseBlockie,
} from '../../../selectors';
import Tooltip from '../../ui/tooltip';
import { BadgeStatusProps } from './badge-status.types';

export const BadgeStatus: React.FC<BadgeStatusProps> = ({
  className = '',
  badgeBackgroundColor = BackgroundColor.backgroundAlternative,
  badgeBorderColor = BorderColor.borderMuted,
  address,
  isConnectedAndNotActive = false,
  text,
  ...props
}): JSX.Element => {
  const useBlockie = useSelector(getUseBlockie);
  const permissionsForActiveTab = useSelector(getPermissionsForActiveTab);

  const activeWalletSnap = permissionsForActiveTab
    .map((permission) => permission.key)
    .includes(WALLET_SNAP_PERMISSION_KEY);

  const addressConnectedSubjectMap = useSelector(getAddressConnectedSubjectMap);
  const originOfCurrentTab = useSelector(getOriginOfCurrentTab);

  const selectedAddressSubjectMap = addressConnectedSubjectMap[address];
  const currentTabIsConnectedToSelectedAddress = Boolean(
    selectedAddressSubjectMap && selectedAddressSubjectMap[originOfCurrentTab],
  );

  let status;
  if (isActive) {
    status = STATUS_CONNECTED;
  } else if (currentTabIsConnectedToSelectedAddress) {
    status = STATUS_CONNECTED_TO_ANOTHER_ACCOUNT;
  } else if (activeWalletSnap) {
    status = STATUS_CONNECTED_TO_SNAP;
  } else {
    status = STATUS_NOT_CONNECTED;
  }

  let badgeBorderColor = BackgroundColor.backgroundDefault;
  let badgeBackgroundColor = Color.borderMuted;
  let tooltipText = t('statusNotConnected');
  if (status === STATUS_CONNECTED) {
    badgeBorderColor = BackgroundColor.backgroundDefault;
    badgeBackgroundColor = BackgroundColor.successDefault;
    tooltipText = t('active');
  } else if (status === STATUS_CONNECTED_TO_ANOTHER_ACCOUNT) {
    badgeBorderColor = BorderColor.successDefault;
    badgeBackgroundColor = BackgroundColor.backgroundDefault;
    tooltipText = t('tooltipSatusConnectedUpperCase');
  }

  const connectedAndNotActive =
    currentTabIsConnectedToSelectedAddress && !isActive;

  return (
    <Box
      className={classNames('multichain-badge-status', className)}
      data-testid="multichain-badge-status"
      as="button"
      display={Display.Flex}
      alignItems={AlignItems.center}
      justifyContent={JustifyContent.center}
      backgroundColor={BackgroundColor.backgroundDefault}
      {...(props as BoxProps<'div'>)}
    >
      <Tooltip
        title={tooltipText}
        data-testid="multichain-badge-status__tooltip"
        position="bottom"
      >
        <BadgeWrapper
          positionObj={
            isConnectedAndNotActive
              ? { bottom: 2, right: 5}
              : { bottom: -1, right: 2}
          }
          badge={
            <Box
              className={classNames('multichain-badge-status__badge', {
                'multichain-badge-status__badge-not-connected':
                  isConnectedAndNotActive,
              })}
              backgroundColor={badgeBackgroundColor}
              borderRadius={BorderRadius.full}
              borderColor={badgeBorderColor}
              borderWidth={connectedAndNotActive ? 2 : 4}
            />
          }
        >
          <AvatarAccount
            borderColor={BorderColor.transparent}
            size={AvatarAccountSize.Md}
            address={address}
            variant={
              useBlockie
                ? AvatarAccountVariant.Blockies
                : AvatarAccountVariant.Jazzicon
            }
            marginInlineEnd={2}
          />
        </BadgeWrapper>
      </Tooltip>
    </Box>
  );
};

