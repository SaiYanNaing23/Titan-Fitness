const { withAndroidManifest } = require('expo/config-plugins');

// The member app connects to the gym server over HTTP on the local Wi-Fi.
module.exports = (config) =>
  withAndroidManifest(config, (config) => {
    const application = config.modResults.manifest.application?.[0];
    if (!application) {
      throw new Error('AndroidManifest.xml has no application element');
    }

    application.$ = {
      ...application.$,
      'android:usesCleartextTraffic': 'true',
    };
    return config;
  });
