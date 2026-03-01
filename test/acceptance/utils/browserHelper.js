const {env} = require("mocha-junit-reporter/.eslintrc");
const puppeteer = require('puppeteer');

function getEnvParam(name, defaultValue) {
    return process.env.hasOwnProperty(name) ? process.env[name] : defaultValue;
}

function getBoolEnvParam(name, defaultValue) {
    const envValue = getEnvParam(name, defaultValue);

    if (envValue === defaultValue) {
        return envValue;
    }

    if (typeof envValue === "string") {
        return envValue === '1' || envValue.toLowerCase() === 'true'
    }

    return !!envValue;
}

const ACCEPTANCE_TEST_LOCAL = getBoolEnvParam('ACCEPTANCE_TEST_LOCAL', false);

module.exports = {
    initBrowser: async () => {
        const browserArgs = [
            '--disable-web-security',
            '--disable-features=IsolateOrigins',
            '--disable-site-isolation-trials',
            '--no-sandbox', '--disable-setuid-sandbox',
            '--disable-features=BlockInsecurePrivateNetworkRequests'
        ];

        if (!ACCEPTANCE_TEST_LOCAL) {
            browserArgs.push(
                '--proxy-server=http://www-proxy-brmdc.us.oracle.com:80',
                '--proxy-bypass-list="localhost"'
            );
        }

        return await puppeteer.launch({
            timeout:0,
            headless: 'new',
            args:browserArgs
        });
    }
}