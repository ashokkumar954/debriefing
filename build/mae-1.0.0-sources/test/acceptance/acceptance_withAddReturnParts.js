const should = require('chai').should();
const puppeteer = require('puppeteer');
const helper = require('../mocks/helper');
const properties = require('./utils/properties');
const partsAddedFromInventory = require('../mocks/open-with-parts-added-from-inventory');
const browserHelper = require("./utils/browserHelper");


suite('Acceptance', () => {

    let browser = null;
    let page = null;

    setup(async function () {
        this.timeout(60000);
        browser = await browserHelper.initBrowser();


        page = await browser.newPage();
        page.setViewport({width: 1920, height: 1080});
        page.on('console', msg => console.log('PUPPETEER CONSOLE LOG:', msg.text()));
        await helper.openPlugin(page);
        await helper.initializePlugin(page);
        await helper.openIframe(page);
        await helper.openNewActivity(page, partsAddedFromInventory)
    });

    test('Verify asset inventory changes from Activity Inventory page are reflected in MAE', (async function () {
        this.timeout(60000);
        let frameHandle = null;
        let frame = null;
        let menuButtonElem = null, menuButtonText = null;
        let menuAddedPart = null, menuAddedPartText = null;
        //To switch to frame
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();
        //To validate the menu with non-empty dashboard
        menuButtonElem = await frame.waitForSelector(properties.DASHBOARD_SIDE_MENU);
        menuButtonText = await menuButtonElem.evaluate(el => el.innerText);
        menuButtonText.should.equal('Add Charges');
        //To validate the inventory added from the Inventory page
        menuAddedPart = (await frame.$$('xpath/' + properties.ADDED_PART))[0];
        menuAddedPartText = await menuAddedPart.evaluate(el => el.innerText);
        menuAddedPartText.should.contain('ECM100001');
        //To Take screenshot of the final page
        await page.screenshot({path: 'WithInstallingDeInstallingFromInventories.png', fullPage: true});

        let continueButton = (await frame.$$('xpath/' + properties.CONTINUE_BUTTON))[0];
        await frame.evaluate((el) => el.click(), continueButton);
        await helper.waitSeconds(3);

        let submitButton = (await frame.$$('xpath/' + properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(3);

        // Wait for first message after submit
        let closeJsonElem = await page.waitForSelector('#receivedMessageJson-6');
        let closeJson = await closeJsonElem.evaluate(el => el.textContent);
        let closeMessage = JSON.parse(closeJson);
        closeMessage.should.have.property('apiVersion').that.equals(1);
        closeMessage.should.have.property('inventoryList');
        closeMessage.should.have.property('actions');

        // Send updateResult and optionally handle a second message ('close'), if present
        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify({
            "apiVersion": 1,
            "method": "updateResult"
        }, 0, 4));
        await page.click(properties.SEND_MESSAGE);
        await helper.waitSeconds(3);

        // Wait for an optional final "close" message
        closeJsonElem = await page.waitForSelector('#receivedMessageJson-7', { timeout: 10000 }).catch(() => null);
        if (closeJsonElem) {
            closeJson = await closeJsonElem.evaluate(el => el.textContent);
            closeMessage = JSON.parse(closeJson);
            closeMessage.should.have.property('apiVersion').that.equals(1);
            if (closeMessage.method === 'close') {
                closeMessage.should.have.property('wakeupNeeded').that.equals(true);
                (closeMessage.wakeOnEvents.online).should.have.property('wakeupDelay').that.equals(120);
                (closeMessage.wakeOnEvents.timer).should.have.property('wakeupDelay').that.equals(120);
                (closeMessage.wakeOnEvents.timer).should.have.property('sleepTimeout').that.equals(600);
            }
        }
    }));

    teardown(async () => {
        await browser.close();
    });

});