#!/usr/bin/env bash
export PUPPETEER_PRODUCT=chrome
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
export ACCEPTANCE_TEST_LOCAL=1

php -S localhost:49443 -t "./" &
PHP_PID=$!

./node_modules/.bin/grunt oraclejet-build:dev
./node_modules/.bin/mocha --ui tdd "test/test-index.js"
TEST_RESULT=$?

kill ${PHP_PID}
exit ${TEST_RESULT}