const attributeDescription = require("./attribute-description-mock");

module.exports = {
    openIframe: async (page) => {

        await page.goto('http://localhost:49443/test/test.html', {waitUntil: 'domcontentloaded'});
        await page.click('#openIframeButton');
        await page.waitForSelector('#receivedMessageJson-1');

    },
    signAndSave: async (frame) => {

        let signAndSave = (await frame.$x("//*[contains(text(),'Continue')]/ancestor::button"))[0];
        await frame.evaluate((el) => el.click(), signAndSave);
        //await signAndSave.click({delay: 3000});
        await new Promise(resolve => setTimeout(resolve, 3000));
        let signature = (await frame.$x("//*[@id=\"canvas_invoice\"]"))[0];
        //await signature.click({delay: 2000});
        await frame.evaluate((el) => el.click(), signature);
        const submitReport = (await frame.$x("//*[contains(text(),'Submit')]/ancestor::button"))[0];
        await frame.evaluate((el) => el.click(), submitReport);
        //await submitReport.click({delay: 2000});
    },
    openPlugin: async (page) => {
        await page.goto('http://localhost:49443/test/test.html', {waitUntil: 'domcontentloaded'});
        await page.click('#openIframeButton');

        const readyMessageJsonElem = await page.waitForSelector('#receivedMessageJson-1');
        const readyMessageJson = await readyMessageJsonElem.evaluate(el => el.textContent);

        JSON.parse(readyMessageJson).should.eql({
            "apiVersion": 1,
            "method": "ready",
            "sendInitData": true
        });
    },
    initializePlugin: async (page) => {
        await page.goto('http://localhost:49443/test/test.html', {waitUntil: 'domcontentloaded'});
        await page.click('#openIframeButton');

        await page.waitForSelector('#receivedMessageJson-1');

        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify({
            "apiVersion": 1,
            "method": "init",
            "attributeDescription": attributeDescription,
            "buttons": [
                {
                    "buttonId": "20634",
                    "params": {}
                },
                {
                    "buttonId": "32278",
                    "params": {}
                }
            ],
            "applications": {
                "fusionOAuthUserAssertionApplication": {
                    "type": "oauth_user_assertion",
                    "resourceUrl": "https://cptbmtqqy.fusionapps.ocs.oc-test.com"
                },
                "ofsApiApplication": {
                    "type": "ofs",
                    "resourceUrl": "https://plugins-0-ofsc-c033e3.test.fs.ocs.oc-test.com"
                }
            }
        }, 0, 4));

        await page.click('#sendMessageButton');

        const initEndMessageJsonElem = await page.waitForSelector('#receivedMessageJson-2');
        const initEndMessageJson = await initEndMessageJsonElem.evaluate(el => el.textContent);

        JSON.parse(initEndMessageJson).should.eql({
            "apiVersion": 1,
            "method": "initEnd",
            "wakeOnEvents": {
                "online": {
                    "wakeupDelay": 120
                },
                "timer": {
                    "sleepTimeout": 300,
                    "wakeupDelay": 120
                }
            },
            "wakeupNeeded": true
        });

        await page.screenshot({path: 'initend.png', fullPage: true});

    },
    openNewActivity: async (page, activity) => {
        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify(activity, 0, 4));

        await page.click('#sendMessageButton');

        const callProcedureMessageJsonElem = await page.waitForSelector('#receivedMessageJson-2');
        const callProcedureMessageJson = await callProcedureMessageJsonElem.evaluate(el => el.textContent);
        const callProcedureMessage = JSON.parse(callProcedureMessageJson);

        callProcedureMessage.should.have.property('apiVersion', 1);
        callProcedureMessage.should.have.property('method', "callProcedure");
        callProcedureMessage.should.have.property('callId');
        callProcedureMessage.should.have.property('procedure', "getPartsCatalogsStructure");

        const callId = callProcedureMessage.callId;

        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify({
            "apiVersion": 1,
            "method": "callProcedureResult",
            "callId": callId,
            "resultData": []
        }, 0, 4));

        await page.click('#sendMessageButton');

        const callProcedureMessageJsonElem3 = await page.waitForSelector('#receivedMessageJson-3');
        const callProcedureMessageJson3 = await callProcedureMessageJsonElem3.evaluate(el => el.textContent);
        const callProcedureMessage3 = JSON.parse(callProcedureMessageJson3);

        callProcedureMessage3.should.have.property('apiVersion', 1);
        callProcedureMessage3.should.have.property('method', "callProcedure");
        callProcedureMessage3.should.have.property('callId');
        callProcedureMessage3.should.have.property('procedure', "getAccessToken");

        const callId3 = callProcedureMessage3.callId;

        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify({
            "apiVersion": 1,
            "method": "callProcedureResult",
            "callId": callId3,
            "resultData": []
        }, 0, 4));

        await page.click('#sendMessageButton');

        const callProcedureMessageJsonElem4 = await page.waitForSelector('#receivedMessageJson-4');
        const callProcedureMessageJson4 = await callProcedureMessageJsonElem4.evaluate(el => el.textContent);
        const callProcedureMessage4 = JSON.parse(callProcedureMessageJson4);

        callProcedureMessage4.should.have.property('apiVersion', 1);
        callProcedureMessage4.should.have.property('method', "callProcedure");
        callProcedureMessage4.should.have.property('callId');
        callProcedureMessage4.should.have.property('procedure', "getAccessToken");

        const callId4 = callProcedureMessage4.callId;

        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify({
            "apiVersion": 1,
            "method": "callProcedureResult",
            "callId": callId4,
            "resultData": []
        }, 0, 4));

        await page.click('#sendMessageButton');

    },
    waitSeconds : async(seconds) => {
        await new Promise(resolve => setTimeout(resolve, 1000*seconds));
    }
};