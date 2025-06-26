/** @jest-config-loader ts-node */
/** @jest-config-loader-options {"transpileOnly": true} */

import type { Config } from 'jest';

const config: Config = {
    verbose: true,
};

export default config;
