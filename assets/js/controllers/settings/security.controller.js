angular
  .module('walletApp')
  .controller('SettingsSecurityCtrl', SettingsSecurityCtrl);

function SettingsSecurityCtrl ($scope, $uibModal, Wallet, Alerts) {
  $scope.settings = Wallet.settings;
  $scope.user = Wallet.user;

  $scope.processToggleRememberTwoFactor = null;

  $scope.display = { advanced: false };

  $scope.toggleAdvanced = () => {
    $scope.display.advanced = !$scope.display.advanced;
  };

  $scope.toggleLogging = () => {
    let level = $scope.settings.loggingLevel === 0 ? 1 : 0;
    Wallet.setLoggingLevel(level);
  };

  $scope.enableRememberTwoFactor = () => {
    $scope.processToggleRememberTwoFactor = true;
    const success = () => {
      $scope.processToggleRememberTwoFactor = false;
      Wallet.saveActivity(2);
    };
    const error = () => {
      $scope.processToggleRememberTwoFactor = false;
    };
    Wallet.enableRememberTwoFactor(success, error);
  };

  $scope.disableRememberTwoFactor = () => {
    $scope.processToggleRememberTwoFactor = true;
    const success = () => {
      $scope.processToggleRememberTwoFactor = false;
      Wallet.saveActivity(2);
    };
    const error = () => {
      $scope.processToggleRememberTwoFactor = false;
    };
    Wallet.disableRememberTwoFactor(success, error);
  };

  $scope.changeTwoFactor = () => {
    $uibModal.open({
      templateUrl: 'partials/settings/two-factor.jade',
      windowClass: 'bc-modal initial',
      controller: 'TwoFactorCtrl',
      resolve: {
        loadBcPhoneNumber: ($ocLazyLoad) => {
          return $ocLazyLoad.load('bcPhoneNumber');
        }
      }
    });
  };

  $scope.confirmRecoveryPhrase = () => {
    let openModal = () => $uibModal.open({
      templateUrl: 'partials/confirm-recovery-phrase-modal.jade',
      controller: 'ConfirmRecoveryPhraseCtrl',
      windowClass: 'bc-modal'
    });
    let validatePw = (result) => {
      if (Wallet.isCorrectMainPassword(result)) {
        openModal();
      } else {
        Alerts.displayError('INCORRECT_PASSWORD');
        $scope.confirmRecoveryPhrase();
      }
    };
    $scope.settings.secondPassword
      ? openModal()
      : Alerts.prompt('MAIN_PW_REQUIRED', { type: 'password' }).then(validatePw);
  };

  $scope.clearErrors = () => {
    $scope.errors = {};
  };
}
