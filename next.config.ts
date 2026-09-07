import type { NextConfig } from 'next';

// GitHub project sites live below /repository-name; Sites uses the root path.
const basePath = process.env.ELEMENT_LAB_BASE_PATH || '';
const config: NextConfig = { output: 'export', assetPrefix: basePath };
export default config;

