define([
    'services/ofsc-rest-api-transport',
    'ofsc-connector'
], (OfscRestApiTransport, OfscConnector) => {

    suite('OfscRestApiTransport', function () {
        let ofscRest;
        let xhr;
        let ofscConnector;
        // For mocking responses to requests
        requests = [];
        const delay = (delayInms) => {
            return new Promise(resolve => setTimeout(resolve, delayInms));
        };

        setup(() => {
            const endpoint = 'endpoint';
            const tokenString = '__OfscRestApiAuthToken__.12344';
            const expiresInSeconds = 60 * 5;
            ofscConnector = sinon.createStubInstance(OfscConnector);
            ofscConnector = {
                obtainToken: sinon.stub().resolves('__OfscRestApiAuthToken__')
            };
            xhr = sinon.useFakeXMLHttpRequest();
            xhr.onCreate = function (request) {
                requests.push(request);
            };
            ofscRest = new OfscRestApiTransport(endpoint, ofscConnector);
            this._connector = ofscConnector;
            xhr = sinon.useFakeXMLHttpRequest();
            // Subscribe
            xhr.onCreate = function(request) {
                requests.push(request);
            }.bind(this);
            // Subscribe
            xhr.onreadystatechange = function() {
            }.bind(this);
        });

        teardown(async () => {
            // Restore original XMLHttpRequest
            xhr.restore();
            requests = [];
        });

        test('endpoint is required',  () => {
            expect(() => {
                new OfscRestApiTransport()
            }).to.throw('endpoint must be a non-empty string401');
        });

        test('GET request', async function () {
            const endpoint = 'endpoint';
            const tokenString = '__OfscRestApiAuthToken__';
            const expiresInSeconds = 60 * 5;
            const restApiTransport = new OfscRestApiTransport(endpoint, ofscConnector);
            let promise = Promise.resolve(["12.3455"]);

            // Mocking obtainToken method
            restApiTransport._token = ofscConnector.obtainToken.withArgs(sinon.match.any).returns(promise);

            const path = 'localhost';
            const method = OfscRestApiTransport.HTTP_METHOD_GET;
            const getParams = { a: 1, b: 2 };
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
        });

        test('GET request with ? in path', async function () {

            const path = 'localhost?c=1';
            const method = OfscRestApiTransport.HTTP_METHOD_GET;
            const getParams = { a: 1, b: 2 };
            const headers = {
                'Content-Type': 'application/json',
            };
            let result = ofscRest.request(path, method, getParams, headers);
            result.should.be.an.instanceof(Promise);
        });

        test('Request with only path parameter', async function () {

            const path = 'localhost?c=1';
            let result = ofscRest.request(path);
            result.should.be.an.instanceof(Promise);
        });

        test('POST request with postDataType', async function () {

            const path = 'localhost';
            const method = OfscRestApiTransport.HTTP_METHOD_POST;
            const getParams = { a: 1, b: 2 };
            const headers = {
                'Content-Type': 'application/json',
            };
            let result = ofscRest.request(path, method, getParams, headers);
            result.should.be.an.instanceof(Promise);

        });

        test('POST request with postDataType', async function () {
            const path = 'localhost';
            const method = OfscRestApiTransport.HTTP_METHOD_POST;
            const getParams = { a: 1, b: 2 };
            const headers = {
                'Content-Type': 'application/json',
            };
            const postDataType = 'json';

            let result = ofscRest.request(path, method, getParams, headers, postDataType);
            result.should.be.an.instanceof(Promise);
        });

        test('static getter POST_DATA_TYPE_FORM ', () => {
            expect(OfscRestApiTransport.POST_DATA_TYPE_FORM).to.be.equal('form');
        });

        test('_onXhrReadyStateChange onSuccess', () => {
            // const endpoint = 'endpoint';
            // const restApiTransport = new OfscRestApiTransport(endpoint, ofscConnector);

            let xhr1 = {
                DONE: 'done',
                readyState: 'done',
                status: 200,
                responseText: ''
            };
            const onSuccess = sinon.spy();
            const onError = sinon.spy();

            ofscRest._getResolution(this, xhr1, onSuccess, onError);

            sinon.assert.calledOnce(onSuccess);
            sinon.assert.notCalled(onError);
        });

        test('_onXhrReadyStateChange with responseText onSuccess', () => {
            const endpoint = 'endpoint';
            const restApiTransport = new OfscRestApiTransport(endpoint, ofscConnector);

            const xhr = {
                DONE: 'done',
                readyState: 'done',
                status: 200,
                responseText: JSON.stringify({ a: 1 })
            };
            const onSuccess = sinon.spy();
            const onError = sinon.spy();

            restApiTransport._getResolution(this, xhr, onSuccess, onError);

            sinon.assert.calledOnce(onSuccess);
            sinon.assert.notCalled(onError);
        });

        test('_onXhrReadyStateChange with responseText onSuccess', () => {
            const endpoint = 'endpoint';
            const restApiTransport = new OfscRestApiTransport(endpoint, ofscConnector);

            const xhr = {
                DONE: 'done',
                readyState: 'done',
                status: 200,
                responseText: [{
                    "a" : "1"

                }]
            };
            const onSuccess = sinon.spy();
            const onError = sinon.spy();

            restApiTransport._getResolution(this, xhr, onSuccess, onError);

            sinon.assert.calledOnce(onSuccess);
            sinon.assert.notCalled(onError);
        });

        test('_onXhrReadyStateChange with wrong responseText onSuccess', () => {
            const endpoint = 'endpoint';
            const restApiTransport = new OfscRestApiTransport(endpoint, ofscConnector);

            const xhr = {
                DONE: 'done',
                readyState: 'done',
                status: 200,
                responseText: 'json'
            };
            const onSuccess = sinon.spy();
            const onError = sinon.spy();

            restApiTransport._getResolution(xhr, onSuccess, onError);

            sinon.assert.calledOnce(onSuccess);
            sinon.assert.notCalled(onError);
        });

        test('test for __doRequest', () => {
            const endpoint = 'endpoint';
            const restApiTransport = new OfscRestApiTransport(endpoint, ofscConnector);

            const xhr = {
                DONE: 'done',
                readyState: 'done',
                status: 200,
                responseText: null
            };
            const onSuccess = sinon.spy();
            const onError = sinon.spy();

            restApiTransport._getResolution(xhr, onSuccess, onError);

            sinon.assert.calledOnce(onSuccess);
            sinon.assert.notCalled(onError);
        });



    });
});