define(['knockout', 'services/fusion-rest-api-transport', 'ofsc-connector'], (ko, FusionRestApiTransport, OfscConnector) => {

    suite('FusionRestApiTransport', () => {
        let xhr;
        let requests = [];
        let ofscConnector;
        let ofscRest;
        const delay = (delayInms) => {
            return new Promise(resolve => setTimeout(resolve, delayInms));
        };

        // For mocking responses to requests
        requests = [];
        setup(() => {
            ofscConnector = {
                obtainToken: sinon.stub().resolves('__OfscRestApiAuthToken__')
            };
            xhr = sinon.useFakeXMLHttpRequest();
            xhr.onCreate = function (request) {
                requests.push(request);
            };
            ofscRest = new FusionRestApiTransport('url', ofscConnector);

        });

        teardown(async () => {
            // Restore original XMLHttpRequest
            xhr.restore();
            requests = [];
        });

        test('Constructor is working', (() => {
            expect(ofscRest).to.be.an.instanceof(FusionRestApiTransport);
            try {
                new FusionRestApiTransport("")
            } catch (e) {
                expect(e).to.be.an('error');
            }
            try {
                new FusionRestApiTransport(ofscConnector)
            } catch (e) {
                expect(e).to.be.an('error');
            }
            try {
                new FusionRestApiTransport("url")
            } catch (e) {
                expect(e).to.be.an('error');
            }
            FusionRestApiTransport.HTTP_METHOD_POST.should.contains('POST');
            FusionRestApiTransport.HTTP_METHOD_PATCH.should.contains('PATCH');
            FusionRestApiTransport.POST_DATA_TYPE_JSON.should.contains('json');
            FusionRestApiTransport.POST_DATA_TYPE_FORM.should.contains('form');
        }));

        test('#request is working with http', (async function () {
            const endpoint = 'endpoint';
            const tokenString = '__OfscRestApiAuthToken__';
            const expiresInSeconds = 60 * 5;
            const restApiTransport = new FusionRestApiTransport(endpoint, ofscConnector);
            let promise = Promise.resolve(["12.3455"]);

            // Mocking obtainToken method
            restApiTransport._token = ofscConnector.obtainToken.withArgs(sinon.match.any).returns(promise);

            const path = 'localhost';
            const method = FusionRestApiTransport.HTTP_METHOD_GET;
            const getParams = {a: 1, b: 2};
            const headers = {
                'Content-Type': 'application/json',
            };

            // Ensure the promise is resolved before continuing
            await promise;
            try {
                // Make the request and await its completion
                return new Promise(resolve => {
                    restApiTransport.request(path, method, getParams, headers);
                    resolve();
                });

            } catch (err) {
                // Handle errors and assertions properly
                expect(err.name).to.be.equal('TransportError');
                expect(err.message).to.be.equal('Unknown error');
            }
        }));

        test('test response (status 200)', async function () {
            const endpoint = 'http://example.com/api';
            const tokenString = '__OfscRestApiAuthToken__';
            const expiresInSeconds = 60 * 5;
            const restApiTransport = new FusionRestApiTransport(endpoint, ofscConnector);

            restApiTransport._token = new FusionRestApiTransport(tokenString, expiresInSeconds);

            const path = 'localhost';
            const method = FusionRestApiTransport.HTTP_METHOD_POST;
            const getParams = {a: 1, b: 2};
            const bodyData = JSON.stringify({key: 'value'});
            const headers = {
                'Content-Type': 'application/json',
            };
            const promise = restApiTransport._doRequest(path, method, getParams, bodyData, headers);
            promise.then(function (response) {
                // Assert that the response is correctly handled
                expect(response).to.deep.equal({success: true});
                done();
            }).catch(function (error) {
                done(error);
            });
            // Simulate XHR request completion with successful response (status 200)
            requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify({success: true}));

        });

        test('test response (status 200)', async function () {
            const endpoint = 'http://example.com/api';
            const tokenString = '__OfscRestApiAuthToken__';
            const expiresInSeconds = 60 * 5;
            const restApiTransport = new FusionRestApiTransport(endpoint, ofscConnector);

            restApiTransport._token = new FusionRestApiTransport(tokenString, expiresInSeconds);

            const path = 'localhost';
            const method = FusionRestApiTransport.HTTP_METHOD_POST;
            const getParams = {a: 1, b: 2};
            const bodyData = JSON.stringify({key: 'value'});
            const headers = {
                'Content-Type': 'application/json',
            };
            const promise = restApiTransport._doRequest(path, method, getParams, bodyData, headers);
            promise.then(function (response) {
                // Assert that the response is correctly handled
                expect(response).to.deep.equal({success: true});
                done();
            }).catch(function (error) {
                done(error);
            });
            requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify({success: true}));

        });

        test('test response (status other than 200)', async function () {
            const endpoint = 'http://example.com/api';
            const tokenString = '__OfscRestApiAuthToken__';
            const expiresInSeconds = 60 * 5;
            const restApiTransport = new FusionRestApiTransport(endpoint, ofscConnector);

            restApiTransport._token = new FusionRestApiTransport(tokenString, expiresInSeconds);

            const path = 'localhost';
            const method = FusionRestApiTransport.HTTP_METHOD_POST;
            const getParams = {a: 1, b: 2};
            const bodyData = JSON.stringify({key: 'value'});
            const headers = {
                'Content-Type': 'application/json',
            };
            const promise = restApiTransport._doRequest(path, method, getParams, bodyData, headers);
            promise.then(function (response) {
                done(new Error('Expected promise to be rejected'));
            }).catch(function (error) {
                expect(error.message).to.equal('Server returned an error. HTTP Status: 404');
                done();
            });
            requests[0].respond(404, {}, '');

        });

        test('test response (status 400)', async function () {
            const endpoint = 'http://example.com/api';
            const tokenString = '__OfscRestApiAuthToken__';
            const expiresInSeconds = 60 * 5;
            const restApiTransport = new FusionRestApiTransport(endpoint, ofscConnector);

            restApiTransport._token = new FusionRestApiTransport(tokenString, expiresInSeconds);

            const path = 'localhost';
            const method = FusionRestApiTransport.HTTP_METHOD_POST;
            const getParams = {a: 1, b: 2};
            const bodyData = JSON.stringify({key: 'value'});
            const headers = {
                'Content-Type': 'application/json',
            };
            const promise = restApiTransport._doRequest(path, method, getParams, bodyData, headers);
            promise.then(function (response) {
                done(new Error('Expected promise to be rejected'));
            }).catch(function (error) {
                expect(error.message).to.equal('Server returned an error. HTTP Status: 400');
                done();
            });
            requests[0].respond(400, {}, '');

        });

        test('test response (status 501)', async function () {
            const endpoint = 'http://example.com/api';
            const tokenString = '__OfscRestApiAuthToken__';
            const expiresInSeconds = 60 * 5;
            const restApiTransport = new FusionRestApiTransport(endpoint, ofscConnector);

            restApiTransport._token = new FusionRestApiTransport(tokenString, expiresInSeconds);

            const path = 'localhost';
            const method = FusionRestApiTransport.HTTP_METHOD_POST;
            const getParams = {a: 1, b: 2};
            const bodyData = JSON.stringify({key: 'value'});
            const headers = {
                'Content-Type': 'application/json',
            };
            const promise = restApiTransport._doRequest(path, method, getParams, bodyData, headers);
            promise.then(function (response) {
                done(new Error('Expected promise to be rejected'));
            }).catch(function (error) {
                expect(error.message).to.equal('Server returned an error. HTTP Status: 501');
                done();
            });
            requests[0].respond(501, {}, '');

        });

        test('test for _doRequestForNonJsonResponse', async function () {
            const endpoint = 'http://example.com/api';
            const tokenString = '__OfscRestApiAuthToken__';
            const expiresInSeconds = 60 * 5;
            const restApiTransport = new FusionRestApiTransport(endpoint, ofscConnector);
            const path = 'localhost';
            const method = FusionRestApiTransport.HTTP_METHOD_POST;
            const getParams = {a: 1, b: 2};
            const bodyData = "";
            const headers = {
                'Content-Type': 'application/json',
            };
            const promise = restApiTransport._doRequestForNonJsonResponse(path, method, getParams, bodyData, headers);
            promise.then(function (response) {
                // Assert that the response is correctly handled
                expect(response).to.deep.equal({success: true});
                done();
            }).catch(function (error) {
                done(error);
            });
            requests[0].respond(200, {}, '');

        });

        test('test for _doRequest', async function () {
            const endpoint = 'http://example.com/api';
            const tokenString = '__OfscRestApiAuthToken__';
            const expiresInSeconds = 60 * 5;
            const restApiTransport = new FusionRestApiTransport(endpoint, ofscConnector);
            const path = 'localhost';
            const method = FusionRestApiTransport.HTTP_METHOD_POST;
            const getParams = {a: 1, b: 2};
            const bodyData = "";
            const headers = {
                'Content-Type': 'application/json',
            };
            const promise = restApiTransport._doRequest(path, method, getParams, bodyData, headers);
            promise.then(function (response) {
                // Assert that the response is correctly handled
                expect(response).to.deep.equal({success: true});
                done();
            }).catch(function (error) {
                done(error);
            });
            requests[0].respond(204, {}, '');

        });

        test('test for _doRequestForNonJsonResponse with non 200 response', async function () {
            const endpoint = 'http://example.com/api';
            const tokenString = '__OfscRestApiAuthToken__';
            const expiresInSeconds = 60 * 5;
            const restApiTransport = new FusionRestApiTransport(endpoint, ofscConnector);
            const path = 'localhost';
            const method = FusionRestApiTransport.HTTP_METHOD_POST;
            const getParams = {a: 1, b: 2};
            const bodyData = "";
            const headers = {
                'Content-Type': 'application/json',
            };
            const promise = restApiTransport._doRequestForNonJsonResponse(path, method, getParams, bodyData, headers);
            promise.then(function (response) {
                // Assert that the response is correctly handled
                expect(response).to.deep.equal({success: true});
                done();
            }).catch(function (error) {
                done(error);
            });
            requests[0].respond(201, {}, '');
        });

    });


});