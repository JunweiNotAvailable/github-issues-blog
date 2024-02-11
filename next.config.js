/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '**',
      },
    ],
  },
  env: {
    clientId: '7ba3399eff5d8686ef99',
    clientSecret: '98df2ed26ec2b9bf97db851a019b25b64c5426de',
    accessToken: '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'
  }
}

module.exports = nextConfig
