// Change this file to move the site to another domain or enable integrations.
const siteUrl = process.env.SITE_URL || 'https://games.encrypted-cat.com';
export default {
  name: 'Encrypted Cat Games',
  siteUrl,
  base: process.env.SITE_BASE || '/',
  customDomain:
    process.env.CUSTOM_DOMAIN ??
    (new URL(siteUrl).hostname.endsWith('.github.io')
      ? ''
      : new URL(siteUrl).hostname),
  email: 'encrypted.cat53@gmail.com',
  formEndpoint: process.env.PUBLIC_FORM_ENDPOINT || '', // https://formspree.io/f/YOUR_FORM_ID
  analyticsId: process.env.PUBLIC_GA_ID || 'G-DYL1N86XM1',
  // Set true only after checking the native games and completing game privacy disclosures.
  nativePrivacyConfirmed: false,
  socials: [
    { name: 'itch.io', url: 'https://0xkot.itch.io/' },
    { name: 'Discord', url: 'https://discord.gg/ufYtrP3NRk' },
    { name: 'Reddit', url: 'https://www.reddit.com/r/TheCradleHorror/' },
    { name: 'YouTube', url: 'https://www.youtube.com/@EncryptedCatGames' },
    { name: 'Twitch', url: 'https://twitch.tv/0xKOT' },
  ],
};
