import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { I18nContext } from '../../../contexts/i18n';
import { useNewMetricEvent } from '../../../hooks/useMetricEvent';
import {
  getFetchParams,
  prepareToLeaveSwaps,
  getLatestSmartTransactionUuid,
  getSmartTransactions,
} from '../../../ducks/swaps/swaps';
import {
  isHardwareWallet,
  getHardwareWalletType,
} from '../../../selectors/selectors';
import { DEFAULT_ROUTE } from '../../../helpers/constants/routes';
import PulseLoader from '../../../components/ui/pulse-loader';
import Typography from '../../../components/ui/typography';
import Box from '../../../components/ui/box';
import {
  BLOCK_SIZES,
  COLORS,
  TYPOGRAPHY,
  JUSTIFY_CONTENT,
  DISPLAY,
} from '../../../helpers/constants/design-system';
import SwapSuccessIcon from '../awaiting-swap/swap-success-icon';
import SwapFailureIcon from '../awaiting-swap/swap-failure-icon';
import {
  // fetchSmartTransactionsStatus,
  stopPollingForQuotes,
  cancelSmartTransaction,
} from '../../../store/actions';
// import { SECOND } from '../../../../shared/constants/time';

import SwapsFooter from '../swaps-footer';

// const SMART_TRANSACTIONS_STATUS_INTERVAL = SECOND * 10; // Poll every 10 seconds.

export default function SmartTransactionStatus() {
  const [showCancelSwapLink, setShowCancelSwapLink] = useState(true);
  const t = useContext(I18nContext);
  const history = useHistory();
  const dispatch = useDispatch();
  const fetchParams = useSelector(getFetchParams);
  const { destinationTokenInfo, sourceTokenInfo } = fetchParams?.metaData || {};
  const hardwareWalletUsed = useSelector(isHardwareWallet);
  const hardwareWalletType = useSelector(getHardwareWalletType);
  const needsTwoConfirmations = true;
  const latestSmartTransactionUuid = useSelector(getLatestSmartTransactionUuid);
  const smartTransactions = useSelector(getSmartTransactions);
  const smartTransactionStatus =
    smartTransactions.find((stx) => stx.uuid === latestSmartTransactionUuid)
      ?.status || {};
  console.log(`smartTransactionStatus`, smartTransactionStatus);

  const sensitiveProperties = {
    needs_two_confirmations: needsTwoConfirmations,
    token_from: sourceTokenInfo?.symbol,
    token_from_amount: fetchParams?.value,
    token_to: destinationTokenInfo?.symbol,
    request_type: fetchParams?.balanceError ? 'Quote' : 'Order',
    slippage: fetchParams?.slippage,
    custom_slippage: fetchParams?.slippage === 2,
    is_hardware_wallet: hardwareWalletUsed,
    hardware_wallet_type: hardwareWalletType,
    stx_uuid: latestSmartTransactionUuid,
  };

  const stxStatusPageLoadedEvent = useNewMetricEvent({
    event: 'STX Status Page Loaded',
    sensitiveProperties,
    category: 'swaps',
  });

  const cancelSmartTransactionEvent = useNewMetricEvent({
    event: 'Cancel STX',
    sensitiveProperties,
    category: 'swaps',
  });

  const isSmartTransactionPending =
    !smartTransactionStatus.minedTx ||
    (smartTransactionStatus.minedTx === 'not_mined' &&
      smartTransactionStatus.cancellationReason === 'not_cancelled');

  useEffect(() => {
    stxStatusPageLoadedEvent();
    // const intervalId = setInterval(() => {
    //   if (isSmartTransactionPending && latestSmartTransactionUuid) {
    //     dispatch(fetchSmartTransactionsStatus([latestSmartTransactionUuid]));
    //   } else {
    //     clearInterval(intervalId);
    //   }
    // }, SMART_TRANSACTIONS_STATUS_INTERVAL);
    // return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isSmartTransactionPending, latestSmartTransactionUuid]);

  useEffect(() => {
    // We don't need to poll for quotes on the status page.
    dispatch(stopPollingForQuotes());
  }, [dispatch]);

  let headerText = t('stxPending');
  let description = t('stxPendingDescription');
  let icon = <PulseLoader />;
  if (smartTransactionStatus.minedTx === 'success') {
    headerText = t('stxSuccess');
    description = t('stxSuccessDescription');
    icon = <SwapSuccessIcon />;
  } else if (
    smartTransactionStatus.cancellationReason &&
    smartTransactionStatus.cancellationReason === 'user_cancelled'
  ) {
    headerText = t('stxUserCancelled');
    description = t('stxUserCancelledDescription');
    icon = <SwapFailureIcon />;
  } else if (
    smartTransactionStatus.cancellationReason &&
    smartTransactionStatus.cancellationReason !== 'not_cancelled'
  ) {
    headerText = t('stxFailure');
    description = t('stxFailureDescription', [
      <a
        className="smart-transaction-status__support-link"
        key="smart-transaction-status-support-link"
        href="https://support.metamask.io"
        target="_blank"
        rel="noopener noreferrer"
      >
        support.metamask.io
      </a>,
    ]);
    icon = <SwapFailureIcon />;
  }

  const CancelSwap = () => {
    return (
      <Box marginBottom={3}>
        <a
          href="#"
          onClick={(e) => {
            e?.preventDefault();
            setShowCancelSwapLink(false); // We want to hide it after a user clicks on it.
            cancelSmartTransactionEvent();
            dispatch(cancelSmartTransaction(latestSmartTransactionUuid));
          }}
        >
          {t('cancelSwap')}
        </a>
      </Box>
    );
  };

  return (
    <div className="smart-transaction-status">
      <Box
        paddingLeft={8}
        paddingRight={8}
        height={BLOCK_SIZES.FULL}
        justifyContent={JUSTIFY_CONTENT.CENTER}
        display={DISPLAY.FLEX}
        className="smart-transaction-status__content"
      >
        <Box marginTop={3} marginBottom={4}>
          {icon}
        </Box>
        <Typography color={COLORS.BLACK} variant={TYPOGRAPHY.H3}>
          {headerText}
        </Typography>
        <Typography variant={TYPOGRAPHY.Paragraph} boxProps={{ marginTop: 2 }}>
          {description}
        </Typography>
      </Box>
      {showCancelSwapLink &&
        latestSmartTransactionUuid &&
        isSmartTransactionPending && <CancelSwap />}
      <SwapsFooter
        onSubmit={async () => {
          await dispatch(prepareToLeaveSwaps());
          history.push(DEFAULT_ROUTE);
        }}
        submitText={isSmartTransactionPending ? t('cancel') : t('close')}
        hideCancel
      />
    </div>
  );
}
