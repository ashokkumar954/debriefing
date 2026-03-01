const should = require('chai').should();
const puppeteer = require('puppeteer');
const helper = require('../mocks/helper');
const properties = require('./utils/properties');
const openActivity = require('../mocks/open-activity-autopopulate');
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
        await helper.openNewActivity(page, openActivity);
    });

    test('auto population of labour hour based on auto population logic.', (async function () {
        this.timeout(60000);

        let frameHandle = null;
        let frame = null;
        let laborLabelText = null
        let laborLabelAutoPopulate = null;
        let laborLabelBillingItemAutoPopulate = null;
        let laborLabelBillingItemAutoPopulateText = null;
        let laborLabelBillingTypeAutoPopulate = null;
        let laborLabelBillingTypeAutoPopulateText = null;

        //To Open Activity
        //await helper.openNewActivity(page, openActivity);
        //To switch to frame
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();

        await helper.waitSeconds(2);
        laborLabelAutoPopulate = (await frame.$$('xpath/' + properties.LABEL_LABOR))[0];
        laborLabelText = await laborLabelAutoPopulate.evaluate(el => el.innerText);
        laborLabelText.should.equal('Labor');

        laborLabelBillingItemAutoPopulate = (await frame.$$('xpath/' + properties.LABEL_AUTOPOPULATE_DEFAULT_LABOR_TYPE))[0];
        laborLabelBillingItemAutoPopulateText = await laborLabelBillingItemAutoPopulate.evaluate(el => el.innerText);
        laborLabelBillingItemAutoPopulateText.should.equal('Labor Hours');

        laborLabelBillingTypeAutoPopulate = (await frame.$$('xpath/' + properties.LABEL_AUTOPOPULATE_DEFAULT_LABOR_ITEM_TIME))[0];
        laborLabelBillingTypeAutoPopulateText = await laborLabelBillingTypeAutoPopulate.evaluate(el => el.innerText);
        laborLabelBillingTypeAutoPopulateText.should.equal('49 Minutes');

        let continueButton = (await frame.$$('xpath/' + properties.CONTINUE_BUTTON))[0];
        await frame.evaluate((el) => el.click(), continueButton);
        await helper.waitSeconds(3);
        let submitButton = (await frame.$$('xpath/' + properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(3);

        // Handle plugin response (update or close)
        let closeJsonElem = await page.waitForSelector('#receivedMessageJson-6');
        let closeJson = await closeJsonElem.evaluate(el => el.textContent);
        let closeMessage = JSON.parse(closeJson);
        closeMessage.should.have.property('apiVersion').that.equals(1);
        closeMessage.should.have.property('method');
        ['update', 'close'].should.include(closeMessage.method);
        closeMessage.should.have.property('inventoryList');
        closeMessage.should.have.property('actions');

        (closeMessage.actions[0]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[0].properties).should.have.property('labor_item_number').that.equals('Labor Time');
        (closeMessage.actions[0].properties).should.have.property('labor_item_desc').that.equals('Labor Time');

        (closeMessage.actions[0].properties).should.have.property('labor_start_time').that.equals('T07:04:00');
        (closeMessage.actions[0].properties).should.have.property('labor_end_time').that.equals('T07:53:00');

        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify({
            "apiVersion": 1,
            "method": "updateResult"
        }, 0, 4));
        await page.click(properties.SEND_MESSAGE);
        await helper.waitSeconds(3)

        let closeJsonElem2 = await page.waitForSelector('#receivedMessageJson-7', { timeout: 10000 }).catch(() => null);
        if (closeJsonElem2) {
            let closeJson2 = await closeJsonElem2.evaluate(el => el.textContent);
            let closeMessage2 = JSON.parse(closeJson2);
            closeMessage2.should.have.property('apiVersion').that.equals(1);
            closeMessage2.should.have.property('method').that.equals('close');
            closeMessage2.should.have.property('wakeupNeeded').that.equals(true);
            (closeMessage2.wakeOnEvents.online).should.have.property('wakeupDelay').that.equals(120);
            (closeMessage2.wakeOnEvents.timer).should.have.property('wakeupDelay').that.equals(120);
            (closeMessage2.wakeOnEvents.timer).should.have.property('sleepTimeout').that.equals(600);
        }
    }));

    test('auto population of travel hour based on auto population logic.', async function () {
        this.timeout(60000);

        let frameHandle = await page.$(properties.PLUGIN_FRAME);
        let frame = await frameHandle.contentFrame();

        let TravelLabelBillingItemAutoPopulate = (await frame.$$('xpath/' + properties.LABEL_AUTOPOPULATE_DEFAULT_TRAVEL_TYPE))[0];
        let TravelLabelBillingItemAutoPopulateText = await TravelLabelBillingItemAutoPopulate.evaluate(el => el.innerText);
        TravelLabelBillingItemAutoPopulateText.should.equal('Travel Hrs');
        let TravelLabelBillingTypeAutoPopulate = (await frame.$$('xpath/' + properties.LABEL_AUTOPOPULATE_DEFAULT_TRAVEL_ITEM_TIME))[0];
        let TravelLabelBillingTypeAutoPopulateText = await TravelLabelBillingTypeAutoPopulate.evaluate(el => el.innerText);
        TravelLabelBillingTypeAutoPopulateText.should.equal('1 Minute');
        let continueButton = (await frame.$$('xpath/' + properties.CONTINUE_BUTTON))[0];
        await frame.evaluate((el) => el.click(), continueButton);
        await helper.waitSeconds(3);
        let submitButton = (await frame.$$('xpath/' + properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(3);

        // Accept both 'update' and 'close' as valid after submit
        let closeJsonElem = await page.waitForSelector('#receivedMessageJson-6', {timeout: 10000}).catch(() => null);
        if (!closeJsonElem) {
            throw new Error('No plugin response (expected #receivedMessageJson-6)');
        }
        let closeJson = await closeJsonElem.evaluate(el => el.textContent);
        let closeMessage = JSON.parse(closeJson);

        closeMessage.should.have.property('apiVersion').that.equals(1);
        closeMessage.should.have.property('method');
        ['update', 'close'].should.include(closeMessage.method);

        closeMessage.should.have.property('inventoryList');
        closeMessage.should.have.property('actions');

        (closeMessage.actions[0]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[0].properties).should.have.property('labor_item_number').that.equals('Labor Time');
        (closeMessage.actions[0].properties).should.have.property('labor_item_desc').that.equals('Labor Time');
        (closeMessage.actions[0].properties).should.have.property('labor_start_time').that.equals('T07:04:00');
        (closeMessage.actions[0].properties).should.have.property('labor_end_time').that.equals('T07:53:00');

        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify({
            "apiVersion": 1,
            "method": "updateResult"
        }, 0, 4));
        await page.click(properties.SEND_MESSAGE);
        await helper.waitSeconds(3);

        let closeJsonElem2 = await page.waitForSelector('#receivedMessageJson-7', {timeout: 10000}).catch(() => null);
        if (closeJsonElem2) {
            let closeJson2 = await closeJsonElem2.evaluate(el => el.textContent);
            let closeMessage2 = JSON.parse(closeJson2);
            closeMessage2.should.have.property('apiVersion').that.equals(1);
            closeMessage2.should.have.property('method').that.equals('close');
            closeMessage2.should.have.property('wakeupNeeded').that.equals(true);
            (closeMessage2.wakeOnEvents.online).should.have.property('wakeupDelay').that.equals(120);
            (closeMessage2.wakeOnEvents.timer).should.have.property('wakeupDelay').that.equals(120);
            (closeMessage2.wakeOnEvents.timer).should.have.property('sleepTimeout').that.equals(600);
        }
    });

    test('Validate Labour hours start time and end time is auto populated when new inline item is added.', (async function () {
        this.timeout(60000);

        let frameHandle = null;
        let frame = null;
        let laborStartTime, laborStartimeText = null;
        let laborEndTime = null;
        let laborEndTimeText = null;
        let submitButton = null;
        let report_totalAmount1, report_totalAmounttext1 = null;


        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();


        await helper.waitSeconds(2);
        menuButtonElem = await frame.waitForSelector(properties.DASHBOARD_MENU);
        await frame.evaluate((el) => el.click(), menuButtonElem);
        await helper.waitSeconds(2);
        console.log("Select Main Menu");
        //Add New labour item
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);

        const normalizeTimeDisplay = (t) => {
            let [hourMin, meridiem] = t.split(' ');
            let [h, m] = hourMin.split(':');
            if (h.length === 1) h = '0' + h;
            return `${h}:${m} ${meridiem}`;
        };

        laborStartTime = await frame.waitForSelector(properties.LABOR_START_TIME);
        laborStartimeText = await laborStartTime.evaluate(el => el.value, laborStartimeText);
        console.log(laborStartimeText);
        normalizeTimeDisplay(laborStartimeText).should.equal('07:04 AM');


        laborEndTime = await frame.waitForSelector(properties.LABOR_END_TIME);
        laborEndTimeText = await laborEndTime.evaluate(el => el.value);
        normalizeTimeDisplay(laborEndTimeText).should.equal('07:53 AM');


        submitButton = (await frame.$$('xpath/' + properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(3);
        console.log("Generate Invoice");
        //To generate proforma invoice
        await page.screenshot({path: 'WithLabor.png', fullPage: true});
        await helper.signAndSave(frame);

        closeJsonElem = await page.waitForSelector('#receivedMessageJson-6');
        closeJson = await closeJsonElem.evaluate(el => el.textContent);
        closeMessage = JSON.parse(closeJson);

        closeMessage.should.have.property('apiVersion').that.equals(1);
        closeMessage.should.have.property('method');
        ['update', 'close'].should.include(closeMessage.method);
        closeMessage.should.have.property('inventoryList');
        closeMessage.should.have.property('actions');

        (closeMessage.actions[0]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[0].properties).should.have.property('labor_item_number').that.equals('Labor Time');
        (closeMessage.actions[0].properties).should.have.property('labor_item_desc').that.equals('Labor Time');

        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify({
            "apiVersion": 1,
            "method": "updateResult"
        }, 0, 4));
        await page.click(properties.SEND_MESSAGE);
        await helper.waitSeconds(3)

        closeJsonElem = await page.waitForSelector('#receivedMessageJson-7', { timeout: 10000 }).catch(() => null);
        if (closeJsonElem) {
            closeJson = await closeJsonElem.evaluate(el => el.textContent);
            closeMessage = JSON.parse(closeJson);
            closeMessage.should.have.property('apiVersion').that.equals(1);
            closeMessage.should.have.property('method').that.equals('close');
            closeMessage.should.have.property('wakeupNeeded').that.equals(true);
            (closeMessage.wakeOnEvents.online).should.have.property('wakeupDelay').that.equals(120);
            (closeMessage.wakeOnEvents.timer).should.have.property('wakeupDelay').that.equals(120);
            (closeMessage.wakeOnEvents.timer).should.have.property('sleepTimeout').that.equals(600);
        }


        //To take screenshot of final page
        await page.screenshot({path: 'WithLabor.png', fullPage: true});


        report_totalAmount1 = (await frame.$$('xpath/' + properties.TIME_LABOR_TOTAL))[1];
        report_totalAmounttext1 = await report_totalAmount1.evaluate(el => el.innerText);
        report_totalAmounttext1.should.contain('1 Hour 39 Minutes');


    }));

    test('Validate Labour hours start time and end time is auto populated and able to continue without adding any inline items.', async function () {
        this.timeout(60000);
        let frameHandle = null;
        let frame = null;
        let submitButton = null;
        let report_totalAmount1, report_totalAmounttext1 = null;

        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();

        laborLabelAutoPopulate = (await frame.$$('xpath/' + properties.LABEL_LABOR))[0];
        laborLabelText = await laborLabelAutoPopulate.evaluate(el => el.innerText);
        laborLabelText.should.equal('Labor');
        laborLabelBillingItemAutoPopulate = (await frame.$$('xpath/' + properties.LABEL_AUTOPOPULATE_DEFAULT_LABOR_TYPE))[0];
        laborLabelBillingItemAutoPopulateText = await laborLabelBillingItemAutoPopulate.evaluate(el => el.innerText);
        laborLabelBillingItemAutoPopulateText.should.equal('Labor Hours');
        laborLabelBillingTypeAutoPopulate = (await frame.$$('xpath/' + properties.LABEL_AUTOPOPULATE_DEFAULT_LABOR_ITEM_TIME))[0];
        laborLabelBillingTypeAutoPopulateText = await laborLabelBillingTypeAutoPopulate.evaluate(el => el.innerText);
        laborLabelBillingTypeAutoPopulateText.should.equal('49 Minutes');
        await helper.waitSeconds(2);
        continueButton = (await frame.$$('xpath/' + properties.CONTINUE_BUTTON))[0];
        await frame.evaluate((el) => el.click(), continueButton);
        await helper.waitSeconds(3);
        submitButton = (await frame.$$('xpath/' + properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(3);
        //To generate proforma invoice

        report_totalAmount1 = (await frame.$$('xpath/' + properties.TIME_LABOR_TOTAL))[1];
        report_totalAmounttext1 = await report_totalAmount1.evaluate(el => el.innerText);
        report_totalAmounttext1.should.contain('50 Minutes');

        submitButton = (await frame.$$('xpath/' + properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(3);
        closeJsonElem = await page.waitForSelector('#receivedMessageJson-6');
        closeJson = await closeJsonElem.evaluate(el => el.textContent);
        closeMessage = JSON.parse(closeJson);

        closeMessage.should.have.property('apiVersion').that.equals(1);
        closeMessage.should.have.property('method');
        ['update', 'close'].should.include(closeMessage.method);

        closeMessage.should.have.property('inventoryList');
        closeMessage.should.have.property('actions');
        (closeMessage.actions[0]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[0].properties).should.have.property('labor_item_number').that.equals('Labor Time');
        (closeMessage.actions[0].properties).should.have.property('labor_item_desc').that.equals('Labor Time');
        (closeMessage.actions[0].properties).should.have.property('labor_start_time').that.equals('T07:04:00');
        (closeMessage.actions[0].properties).should.have.property('labor_end_time').that.equals('T07:53:00');
        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify({
            "apiVersion": 1,
            "method": "updateResult"
        }, 0, 4));
        await page.click(properties.SEND_MESSAGE);
        await helper.waitSeconds(3);

        closeJsonElem = await page.waitForSelector('#receivedMessageJson-7', { timeout: 10000 }).catch(() => null);

        if (closeJsonElem) {
            closeJson = await closeJsonElem.evaluate(el => el.textContent);
            closeMessage = JSON.parse(closeJson);
            closeMessage.should.have.property('apiVersion').that.equals(1);
            closeMessage.should.have.property('method').that.equals('close');
            closeMessage.should.have.property('wakeupNeeded').that.equals(true);
            (closeMessage.wakeOnEvents.online).should.have.property('wakeupDelay').that.equals(120);
            (closeMessage.wakeOnEvents.timer).should.have.property('wakeupDelay').that.equals(120);
            (closeMessage.wakeOnEvents.timer).should.have.property('sleepTimeout').that.equals(600);
        }
    });

    test('Validate Adding inline travel hours along with auto populated travel hours.', (async function () {
        this.timeout(60000);

        let frameHandle = null;
        let frame = null;
        let submitButton = null;
        let report_totalAmount1, report_totalAmounttext1 = null;
        let billingItem = null;

        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();

        await helper.waitSeconds(5);
        await frame.waitForSelector(properties.SIDE_MENU_SELECT);
        await frame.$eval(properties.SIDE_MENU_SELECT, el => el.click());
        await helper.waitSeconds(1);
        console.log("Select side menu");
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);
        console.log("To Add Labor Charge");
        billingItem = await frame.waitForSelector(properties.BILLING_LABOR_ITEM_SELECT);
        await billingItem.click();
        await helper.waitSeconds(2);
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        await helper.waitSeconds(2);

        submitButton = (await frame.$$('xpath/' + properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(3);
        console.log("Generate Invoice");

        //To generate proforma invoice
        await page.screenshot({path: 'WithLabor.png', fullPage: true});
        await helper.signAndSave(frame);

        closeJsonElem = await page.waitForSelector('#receivedMessageJson-6');
        closeJson = await closeJsonElem.evaluate(el => el.textContent);
        closeMessage = JSON.parse(closeJson);

        closeMessage.should.have.property('apiVersion').that.equals(1);
        closeMessage.should.have.property('method');
        ['update', 'close'].should.include(closeMessage.method);
        closeMessage.should.have.property('inventoryList');
        closeMessage.should.have.property('actions');

        (closeMessage.actions[0]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[0].properties).should.have.property('labor_item_number').that.equals('Labor Time');
        (closeMessage.actions[0].properties).should.have.property('labor_item_desc').that.equals('Labor Time');

        (closeMessage.actions[0].properties).should.have.property('labor_default_start_time').that.equals('T07:04:00');
        (closeMessage.actions[0].properties).should.have.property('labor_default_end_time').that.equals('T07:53:00');
        //To take screenshot of final page
        await page.screenshot({path: 'WithLabor.png', fullPage: true});

        report_totalAmount1 = (await frame.$$('xpath/' + properties.TIME_LABOR_TOTAL))[1];
        report_totalAmounttext1 = await report_totalAmount1.evaluate(el => el.innerText);
        report_totalAmounttext1.should.contain('51 Minutes');

        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify({
            "apiVersion": 1,
            "method": "updateResult"
        }, 0, 4));
        await page.click(properties.SEND_MESSAGE);
        await helper.waitSeconds(3)

        closeJsonElem = await page.waitForSelector('#receivedMessageJson-7', { timeout: 10000 }).catch(() => null);
        if (closeJsonElem) {
            closeJson = await closeJsonElem.evaluate(el => el.textContent);
            closeMessage = JSON.parse(closeJson);
            closeMessage.should.have.property('apiVersion').that.equals(1);
            closeMessage.should.have.property('method').that.equals('close');
            closeMessage.should.have.property('wakeupNeeded').that.equals(true);
            (closeMessage.wakeOnEvents.online).should.have.property('wakeupDelay').that.equals(120);
            (closeMessage.wakeOnEvents.timer).should.have.property('wakeupDelay').that.equals(120);
            (closeMessage.wakeOnEvents.timer).should.have.property('sleepTimeout').that.equals(600);
        }


    }));

    test('Validate save button in auto population page with default labour and travel hours.', (async function () {
        this.timeout(60000);
        let frameHandle = null;
        let frame = null;
        let TravelLabelBillingItemAutoPopulate = null;
        let TravelLabelBillingItemAutoPopulateText = null;
        let TravelLabelBillingTypeAutoPopulate = null;
        let TravelLabelBillingTypeAutoPopulateText = null;
        let saveButton;

        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();

        TravelLabelBillingItemAutoPopulate = (await frame.$$('xpath/' + properties.LABEL_AUTOPOPULATE_DEFAULT_TRAVEL_TYPE))[0];
        TravelLabelBillingItemAutoPopulateText = await TravelLabelBillingItemAutoPopulate.evaluate(el => el.innerText);
        TravelLabelBillingItemAutoPopulateText.should.equal('Travel Hrs');
        TravelLabelBillingTypeAutoPopulate = (await frame.$$('xpath/' + properties.LABEL_AUTOPOPULATE_DEFAULT_TRAVEL_ITEM_TIME))[0];
        TravelLabelBillingTypeAutoPopulateText = await TravelLabelBillingTypeAutoPopulate.evaluate(el => el.innerText);
        TravelLabelBillingTypeAutoPopulateText.should.equal('1 Minute');
        //Save the items.
        saveButton = (await frame.$$('xpath/' + properties.SAVE_BUTTON))[0];
        await frame.evaluate((el) => el.click(), saveButton);
        continueButton = (await frame.$$('xpath/' + properties.CONTINUE_BUTTON))[0];
        await frame.evaluate((el) => el.click(), continueButton);
        await helper.waitSeconds(3);
        submitButton = (await frame.$$('xpath/' + properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(3);
        closeJsonElem = await page.waitForSelector('#receivedMessageJson-6');
        closeJson = await closeJsonElem.evaluate(el => el.textContent);
        closeMessage = JSON.parse(closeJson);

        // Allow both 'update' or 'close' as method
        closeMessage.should.have.property('apiVersion').that.equals(1);
        closeMessage.should.have.property('method');
        ['update', 'close'].should.include(closeMessage.method);

        closeMessage.should.have.property('inventoryList');
        closeMessage.should.have.property('actions');
        (closeMessage.actions[0]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[0].properties).should.have.property('labor_item_number').that.equals('Labor Time');
        (closeMessage.actions[0].properties).should.have.property('labor_item_desc').that.equals('Labor Time');
        (closeMessage.actions[0].properties).should.have.property('labor_start_time').that.equals('T07:04:00');
        (closeMessage.actions[0].properties).should.have.property('labor_end_time').that.equals('T07:53:00');

        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify({
            "apiVersion": 1,
            "method": "updateResult"
        }, 0, 4));
        await page.click(properties.SEND_MESSAGE);
        await helper.waitSeconds(3)

        closeJsonElem = await page.waitForSelector('#receivedMessageJson-7', { timeout: 10000 }).catch(() => null);
        if (closeJsonElem) {
            closeJson = await closeJsonElem.evaluate(el => el.textContent);
            closeMessage = JSON.parse(closeJson);
            closeMessage.should.have.property('apiVersion').that.equals(1);
            closeMessage.should.have.property('method').that.equals('close');
            closeMessage.should.have.property('wakeupNeeded').that.equals(true);
            (closeMessage.wakeOnEvents.online).should.have.property('wakeupDelay').that.equals(120);
            (closeMessage.wakeOnEvents.timer).should.have.property('wakeupDelay').that.equals(120);
            (closeMessage.wakeOnEvents.timer).should.have.property('sleepTimeout').that.equals(600);
        }
    }));


    test('Validate save button after adding inline items in auto population page.', (async function () {
        this.timeout(60000);

        let frameHandle = null;
        let frame = null;
        let laborStartTime, laborStartimeText = null;
        let laborEndTime = null;
        let laborEndTimeText = null;
        let submitButton = null;


        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();


        await helper.waitSeconds(2);
        menuButtonElem = await frame.waitForSelector(properties.DASHBOARD_MENU);
        await frame.evaluate((el) => el.click(), menuButtonElem);
        await helper.waitSeconds(2);
        console.log("Select Main Menu");
        //Add New labour item
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);

        const normalizeTimeDisplay = (t) => {
            let [hourMin, meridiem] = t.split(' ');
            let [h, m] = hourMin.split(':');
            if (h.length === 1) h = '0' + h;
            return `${h}:${m} ${meridiem}`;
        };

        laborStartTime = await frame.waitForSelector(properties.LABOR_START_TIME);
        laborStartimeText = await laborStartTime.evaluate(el => el.value, laborStartimeText);
        console.log(laborStartimeText);
        normalizeTimeDisplay(laborStartimeText).should.equal('07:04 AM');


        laborEndTime = await frame.waitForSelector(properties.LABOR_END_TIME);
        laborEndTimeText = await laborEndTime.evaluate(el => el.value);
        normalizeTimeDisplay(laborEndTimeText).should.equal('07:53 AM');


        submitButton = (await frame.$$('xpath/' + properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(3);
        console.log("Generate Invoice");

        //Save the items after adding inline items.

        saveButton = (await frame.$$('xpath/' + properties.SAVE_BUTTON))[0];
        await frame.evaluate((el) => el.click(), saveButton);

        continueButton = (await frame.$$('xpath/' + properties.CONTINUE_BUTTON))[0];
        await frame.evaluate((el) => el.click(), continueButton);
        await helper.waitSeconds(3);

        submitButton = (await frame.$$('xpath/' + properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(3);

        closeJsonElem = await page.waitForSelector('#receivedMessageJson-6');
        closeJson = await closeJsonElem.evaluate(el => el.textContent);
        closeMessage = JSON.parse(closeJson);

        closeMessage.should.have.property('apiVersion').that.equals(1);
        closeMessage.should.have.property('method');
        ['update', 'close'].should.include(closeMessage.method);
        closeMessage.should.have.property('inventoryList');
        closeMessage.should.have.property('actions');

        (closeMessage.actions[0]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[0].properties).should.have.property('labor_item_number').that.equals('Labor Time');
        (closeMessage.actions[0].properties).should.have.property('labor_item_desc').that.equals('Labor Time');

        (closeMessage.actions[0].properties).should.have.property('labor_start_time').that.equals('T07:04:00');
        (closeMessage.actions[0].properties).should.have.property('labor_end_time').that.equals('T07:53:00');

        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify({
            "apiVersion": 1,
            "method": "updateResult"
        }, 0, 4));
        await page.click(properties.SEND_MESSAGE);
        await helper.waitSeconds(3)

        closeJsonElem = await page.waitForSelector('#receivedMessageJson-7', { timeout: 10000 }).catch(() => null);
        if (closeJsonElem) {
            closeJson = await closeJsonElem.evaluate(el => el.textContent);
            closeMessage = JSON.parse(closeJson);
            closeMessage.should.have.property('apiVersion').that.equals(1);
            closeMessage.should.have.property('method').that.equals('close');
            closeMessage.should.have.property('wakeupNeeded').that.equals(true);
            (closeMessage.wakeOnEvents.online).should.have.property('wakeupDelay').that.equals(120);
            (closeMessage.wakeOnEvents.timer).should.have.property('wakeupDelay').that.equals(120);
            (closeMessage.wakeOnEvents.timer).should.have.property('sleepTimeout').that.equals(600);
        }


    }));

    teardown(async function () {
        this.timeout(10000);
        await browser.close();
    });

});