define([ 'ofsc-connector'], ( OfscConnector) => {

    suite('OfscConnector', () => {

        suiteSetup(async () => {

        });

        suiteTeardown(async () => {

        });

        setup(() => {

        });

        teardown(() => {

        });

        test('Constructor is working', (() => {
            let ofscConnector = new OfscConnector();

            let data = {method: "post",
                apiVersion: "1.0"};
            ofscConnector.sendMessage(data);
            let even = new Event('create');
            ofscConnector.onPostMessage(even);

            expect(ofscConnector).to.be.an.instanceof(OfscConnector);
        }));

        test('SendMessage with basic input is working', (() => {
            let ofscConnector = new OfscConnector();
            let data = {method: "post",
                apiVersion: "1.0"};
            ofscConnector.sendMessage(data);
        }));

        test('getOrigin with String as input', (() => {
            expect(OfscConnector._getOrigin("test")).to.equal('http:test');
        }));

        test('onPostMessage with basic input', (() => {
            let ofscConnector = new OfscConnector();
            let even = new Event('create');
            expect(ofscConnector.onPostMessage(even)).to.equal(false);
        }));

        test('generateCallId ', (() => {
            expect(OfscConnector.generateCallId()).to.be.a('string');
        }));

        test('onPostMessage with data 1', (() => {
            let ofscConnector = new OfscConnector();
            let even = new Event('create');
            let data = {method: "post",
                apiVersion: "1.0"};
            even.data = data;
            expect(ofscConnector.onPostMessage(even)).to.equal(false);

            ofscConnector.sendMessage(data);
        }));

        test('onPostMessage with data 2', (() => {
            let result;
            let ofscConnector = new OfscConnector();
            let even = new Event('create');
            even.data = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";
            expect(ofscConnector.onPostMessage(even)).to.equal(result);
        }));

        test('onPostMessage with window 2', (() => {
            let result;
            let ofscConnector = new OfscConnector();

            let even = new Event('create');
            even.data = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";
            even.source = window;
            expect(ofscConnector.onPostMessage(even)).to.equal(result);
        }));

        test('onPostMessage with error procedure response', (() => {
            let result;
            let ofscConnector = new OfscConnector();

            let even = new Event('create');
            even.data = {
                "apiVersion": 1,
                "method": "error",
                "errors": [
                    {
                        "type": "TYPE_PROCEDURE_PARAM",
                        "code": "CODE_PROCEDURE_PARAM_VALUE_INVALID",
                        "procedure": "getAccessToken",
                        "paramName": "applicationKey"
                    }
                ],
                "callId": "1111111111"
            };
            even.source = window;
            expect(ofscConnector.onPostMessage(even)).to.equal(result);
        }));

        test('getOrigin with Number as input', (() => {
            expect(OfscConnector._getOrigin(123)).to.equal('');
        }));

        test('generateCallId with Number as output', (() => {
            const callId1 = OfscConnector.generateCallId();
            const callId2 = OfscConnector.generateCallId();
            expect(callId1).to.not.equal(callId2);
        }));

        test('SendMessage with basic input is working', (() => {
            let ofscConnector = new OfscConnector();
            let data = {method: "post",
                apiVersion: "1.0"};
            ofscConnector.sendMessage(data);
        }));

        test('SendMessage return reject with error if originUrl is not available', (async () => {
            let ofscConnector = new OfscConnector();
            sinon.stub(ofscConnector, '_getOriginUrl').returns('https://example.com');
            ofscConnector.sendMessage({ method: 'callProcedure', procedure: 'testProcedure', callId: 'test' })
                .then(() => {
                    done(new Error('Expected promise to reject but it resolved.'));
                })
                .catch(error => {
                    assert.equal(error, 'Unable to get referrer');
                    done();
                });
        }));

        test('test successful response in _deleteCallbacksAndPromises', () => {
            let ofscConnector = new OfscConnector();

            const originUrl = 'https://example.com';
            const callId = 'someCallId';
            sinon.stub(ofscConnector, '_getOriginUrl').returns(originUrl);

            ofscConnector._currentCommunicationCallbacks[callId] = () => {};
            ofscConnector._currentCommunicationPromises[callId] = () => {};
            ofscConnector._deleteCallbacksAndPromises(callId);
            expect(ofscConnector._currentCommunicationCallbacks[callId]).to.be.undefined;
            expect(ofscConnector._currentCommunicationPromises[callId]).to.be.undefined;
        });

        test('test successful response in obtainToken', () => {
            let ofscConnector = new OfscConnector();
            const key = 'testKey';
            const expectedToken = 'testToken';
            const responseData = {
                method: 'callProcedureResult',
                callId: 'testCallId',
                resultData: { token: expectedToken }
            };
            sinon.stub(ofscConnector, 'sendMessage').resolves(responseData);
            ofscConnector.obtainToken(key)
                .then((token) => {
                    // Assert that the token is obtained successfully
                    expect(token).to.equal(expectedToken);
                    done();
                })
                .catch((error) => {
                    done(error); // Fail the test if an error occurs
                });

            // Assert that the message to obtain the token is sent with the correct data
            sinon.assert.calledOnce(ofscConnector.sendMessage);
            sinon.assert.calledWith(ofscConnector.sendMessage, {
                method: 'callProcedure',
                callId: sinon.match.string,
                procedure: 'getAccessToken',
                params: { applicationKey: key }
            });
        });

        test('test error response in obtainToken', () => {
            let ofscConnector = new OfscConnector();
            const key = 'testKey';
            const expectedErrors = [{ code: 'ERR001', message: 'Some error' }];
            sinon.stub(ofscConnector, 'sendMessage').rejects({
                method: 'error',
                errors: expectedErrors
            });

            ofscConnector.obtainToken(key)
                .then((token) => {
                    // Assert that the token is obtained successfully
                    done(new Error('Expected promise to be rejected with errors'));
                })
                .catch((error) => {
                    expect(error).to.deep.equal(expectedErrors);
                    done();
                });
        });

        test('test empty token response in obtainToken', () => {
            let ofscConnector = new OfscConnector();
            const key = 'testKey';
            const expectedToken = '123';
            const responseData = {
                method: 'callProcedureResult',
                callId: 'testCallId'
            };
            sinon.stub(ofscConnector, 'sendMessage').resolves(responseData);
            ofscConnector.obtainToken(key)
                .then((token) => {
                    expect(token).to.equal(expectedToken);
                    done();
                })
                .catch((error) => {
                    done(error); // Fail the test if an error occurs
                });

            // Assert that the message to obtain the token is sent with the correct data
            sinon.assert.calledOnce(ofscConnector.sendMessage);
            sinon.assert.calledWith(ofscConnector.sendMessage, {
                method: 'callProcedure',
                callId: sinon.match.string,
                procedure: 'getAccessToken',
                params: { applicationKey: key }
            });
        });

        test('test callback if data method is callProcedureResult', (async () => {
            let ofscConnector = new OfscConnector();
            let callId = 'someId'
            const responseData = {
                method: 'callProcedureResult',
                callId: 'testCallId',
                resultData: { result: 'testResult' }
            };
            const callback = sinon.stub();
            ofscConnector._currentCommunicationCallbacks['testCallId'] = callback;
            ofscConnector.processResult(responseData);
            sinon.assert.calledOnce(callback);
            sinon.assert.calledWithExactly(callback, responseData);
        }));

        test('test callback if data method is callProcedureResult with error', (async () => {
            let ofscConnector = new OfscConnector();
            let callId = 'someId'
            const responseData = {
                method: 'error',
                callId: 'testCallId',
                resultData: { result: 'testResult' }
            };
            const callback = sinon.stub();
            ofscConnector._currentCommunicationCallbacks['testCallId'] = callback;
            ofscConnector.processResult(responseData);
            sinon.assert.calledOnce(callback);
            sinon.assert.calledWithExactly(callback, responseData);
        }));

        test('test callback if data method is not callProcedureResult', (async () => {
            let ofscConnector = new OfscConnector();
            const data = {
                method: 'otherMethod',
                result: 'testResult'
            };
            const callback = sinon.stub();
            ofscConnector._currentCommunicationCallbacks['default'] = callback;
            ofscConnector.processResult(data);
            sinon.assert.calledOnce(callback);
            sinon.assert.calledWithExactly(callback, data);
        }));

        test('test with resultData when shareFile is successful', (done) => {
            const ofscConnector = new OfscConnector();

            const fakeFile = new File(["dummy content"], "invoice.pdf", { type: "application/pdf" });
            const expectedResultData = { success: true };

            // Stub static method generateCallId
            sinon.stub(OfscConnector, 'generateCallId').returns('testCallId');

            // Stub sendMessage
            sinon.stub(ofscConnector, 'sendMessage').resolves({
                method: 'callProcedureResult',
                callId: 'testCallId',
                resultData: expectedResultData
            });

            ofscConnector.shareFile(fakeFile).then((result) => {
                expect(result).to.deep.equal(expectedResultData);
                sinon.assert.calledOnce(ofscConnector.sendMessage);
                sinon.assert.calledWith(ofscConnector.sendMessage, {
                    method: 'callProcedure',
                    callId: 'testCallId',
                    procedure: 'share',
                    params: {
                        title: 'Invoice',
                        fileObject: fakeFile,
                        text: 'Sharing File'
                    }
                });
                done();
                sinon.restore();
            }).catch((error) => {
                done(error); // Fail test if promise rejects
            });
        });

        test('test when resultData is missing in shareFile response', (done) => {
            const ofscConnector = new OfscConnector();

            const fakeFile = new File(["dummy content"], "invoice.pdf", { type: "application/pdf" });

            sinon.stub(OfscConnector, 'generateCallId').returns('testCallId');

            sinon.stub(ofscConnector, 'sendMessage').resolves({
                method: 'callProcedureResult',
                callId: 'testCallId',
                // resultData is missing here
            });

            ofscConnector.shareFile(fakeFile).then(() => {
                done(new Error('Expected promise to be rejected due to missing resultData'));
            }).catch((error) => {
                expect(error).to.be.an('object'); // whatever is returned from sendMessage
                done();
            });
            sinon.restore();
        });

        test('test with errors when shareFile fails with method "error"', (done) => {
            const ofscConnector = new OfscConnector();

            const fakeFile = new File(["dummy content"], "invoice.pdf", { type: "application/pdf" });

            const expectedErrors = [{ code: 'ERR001', message: 'Share failed' }];

            sinon.stub(OfscConnector, 'generateCallId').returns('testCallId');

            sinon.stub(ofscConnector, 'sendMessage').rejects({
                method: 'error',
                errors: expectedErrors
            });

            ofscConnector.shareFile(fakeFile).then(() => {
                done(new Error('Expected promise to be rejected with errors'));
            }).catch((error) => {
                expect(error).to.deep.equal(expectedErrors);
                done();
            });
            sinon.restore();
        });

        test('test to call messageFromOfscSignal if no callback found', (async () => {
            let ofscConnector = new OfscConnector();
            const data = {
                method: 'otherMethod',
                result: 'testResult',
                callId: 'test'
            };
            const callback = sinon.stub();
            ofscConnector.messageFromOfscSignal.dispatch = sinon.stub();
            ofscConnector.processResult(data);
            sinon.assert.calledOnce(ofscConnector.messageFromOfscSignal.dispatch);
            sinon.assert.calledWithExactly(ofscConnector.messageFromOfscSignal.dispatch, data);
        }));

        test('SendMessage to handle handleGetAccessToken', (async () => {
            let ofscConnector = new OfscConnector();
            sinon.stub(ofscConnector, '_getOriginUrl').returns('https://example.com');
            const messageData = {
                method: 'callProcedure',
                procedure: 'getAccessToken',
                callId: '123456'
            };
            const mockResponseData = { token: 'mockToken' };
            const deleteCallbacksAndPromisesSpy = sinon.stub(ofscConnector, '_deleteCallbacksAndPromises').returns('');
            ofscConnector.sendMessage(messageData)
                .then(response => {
                    assert.deepEqual(response, mockResponseData);
                    assert.calledWithExactly(deleteCallbacksAndPromisesSpy, messageData);
                    done();
                })
                .catch(error => {
                    done(error);
                });
        }));

        test('obtainTokenByScope resolves with resultData', async () => {
            let ofscConnector = new OfscConnector();
            ofscConnector.sendMessage = sinon.stub().resolves({
                resultData: { accessToken: 'abc123' }
            });

            const result = await ofscConnector.obtainTokenByScope('scope1');
            expect(result).to.deep.equal({ accessToken: 'abc123' });
        });

        test('obtainTokenByScope rejects on error method', async () => {
            let ofscConnector = new OfscConnector();

            ofscConnector.sendMessage = sinon.stub().rejects({
                method: 'error',
                errors: ['bad-scope']
            });

            try {
                await ofscConnector.obtainTokenByScope('scopeX');
                throw new Error('Expected rejection');
            } catch (err) {
                expect(err).to.deep.equal(['bad-scope']);
            }
        });
    });

});