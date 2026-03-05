#!/usr/bin/env bash
S=`realpath "${BASH_SOURCE}" | xargs dirname`

grunt oraclejet-build:dev test-setup
karma start "${S}/karma.conf.js"
TEST_RESULT=$?
exit ${TEST_RESULT}