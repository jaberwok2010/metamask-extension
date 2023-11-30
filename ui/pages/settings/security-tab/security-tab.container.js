import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import {
  setIncomingTransactionsPreferences,
  setIpfsGateway,
  setMetaMetricsParticipation,
  setUseCurrencyRateCheck,
  setUseMultiAccountBalanceChecker,
  setUsePhishDetect,
  setUseTokenDetection,
  setUseAddressBarEnsResolution,
  setOpenSeaEnabled,
  setUseNftDetection,
  setUse4ByteResolution,
  setUseSafeChainsListValidation,
  ///: BEGIN:ONLY_INCLUDE_IN(petnames)
  setUseExternalNameSources,
  ///: END:ONLY_INCLUDE_IN
} from '../../../store/actions';
import { getAllNetworks } from '../../../selectors';
import SecurityTab from './security-tab.component';

const mapStateToProps = (state) => {
  const {
    appState: { warning },
    metamask,
  } = state;

  const {
    incomingTransactionsPreferences,
    metaMetricsParticipationMode,
    usePhishDetect,
    useTokenDetection,
    ipfsGateway,
    useMultiAccountBalanceChecker,
    useSafeChainsListValidation,
    useCurrencyRateCheck,
    useAddressBarEnsResolution,
    openSeaEnabled,
    useNftDetection,
    use4ByteResolution,
    ///: BEGIN:ONLY_INCLUDE_IN(petnames)
    useExternalNameSources,
    ///: END:ONLY_INCLUDE_IN
  } = metamask;

  const allNetworks = getAllNetworks(state);

  return {
    warning,
    incomingTransactionsPreferences,
    allNetworks,
    metaMetricsParticipationMode,
    usePhishDetect,
    useTokenDetection,
    ipfsGateway,
    useMultiAccountBalanceChecker,
    useSafeChainsListValidation,
    useCurrencyRateCheck,
    useAddressBarEnsResolution,
    openSeaEnabled,
    useNftDetection,
    use4ByteResolution,
    ///: BEGIN:ONLY_INCLUDE_IN(petnames)
    useExternalNameSources,
    ///: END:ONLY_INCLUDE_IN
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setIncomingTransactionsPreferences: (chainId, value) =>
      dispatch(setIncomingTransactionsPreferences(chainId, value)),
    setMetaMetricsParticipation: (val) =>
      dispatch(setMetaMetricsParticipation(val)),
    setUsePhishDetect: (val) => dispatch(setUsePhishDetect(val)),
    setUseCurrencyRateCheck: (val) => dispatch(setUseCurrencyRateCheck(val)),
    setUseTokenDetection: (val) => dispatch(setUseTokenDetection(val)),
    setIpfsGateway: (val) => dispatch(setIpfsGateway(val)),
    setUseMultiAccountBalanceChecker: (val) =>
      dispatch(setUseMultiAccountBalanceChecker(val)),
    setUseAddressBarEnsResolution: (val) =>
      dispatch(setUseAddressBarEnsResolution(val)),
    setUseSafeChainsListValidation: (val) =>
      dispatch(setUseSafeChainsListValidation(val)),
    setOpenSeaEnabled: (val) => dispatch(setOpenSeaEnabled(val)),
    setUseNftDetection: (val) => dispatch(setUseNftDetection(val)),
    setUse4ByteResolution: (value) => {
      return dispatch(setUse4ByteResolution(value));
    },
    ///: BEGIN:ONLY_INCLUDE_IN(petnames)
    setUseExternalNameSources: (value) => {
      return dispatch(setUseExternalNameSources(value));
    },
    ///: END:ONLY_INCLUDE_IN
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SecurityTab);
