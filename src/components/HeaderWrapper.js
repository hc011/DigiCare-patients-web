import React, { useState } from 'react';
import Header from './Header';
import { 
  installApp, 
  isAppInstalled, 
  checkInstalledRelatedApps, 
  getInstallationInstructions 
} from '../services/installService';

const HeaderWrapper = (props) => {
  const [showAppInstallDialog, setShowAppInstallDialog] = useState(false);

  const handleAppInstallDialogClose = () => {
    setShowAppInstallDialog(false);
  };

  const handleInstallClick = async () => {
    // First check if app is already installed
    const isStandaloneMode = isAppInstalled();
    let isDetectedAsInstalled = isStandaloneMode;
    
    if (!isDetectedAsInstalled) {
      isDetectedAsInstalled = await checkInstalledRelatedApps();
    }

    if (isDetectedAsInstalled) {
      // Show "Already installed" dialog
      setShowAppInstallDialog(true);
      return;
    }

    // Try to install the app
    const result = await installApp();
    
    if (!result.success) {
      if (result.message === 'no_installation_prompt') {
        // Show browser-specific installation instructions
        alert(getInstallationInstructions());
      } else if (result.message === 'app_already_installed') {
        setShowAppInstallDialog(true);
      } else if (result.message === 'installation_error') {
        alert("There was an error with the installation. Please try refreshing the page.");
      }
    }
  };

  // Additional props for the Header
  const headerProps = {
    ...props,
    handleInstallClick,
    showAppInstallDialog,
    handleAppInstallDialogClose
  };

  return <Header {...headerProps} />;
};

export default HeaderWrapper; 