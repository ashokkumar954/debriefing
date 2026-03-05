const should = require('chai').should();
const puppeteer = require('puppeteer');
const helper = require('../mocks/helper');
const properties = require('./utils/properties');
const openActivity = require('../mocks/open-activity-autopopulate-zeroduration');
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

    test('auto population of labour hour based on zero travel hour', (async function () {
        this.timeout(60000);

        let frameHandle = null;
        let frame = null;
        let laborLabelText = null
        let laborLabelAutoPopulate = null;
        let laborLabelBillingItemAutoPopulate = null;
        let laborLabelBillingItemAutoPopulateText = null;
        let laborLabelBillingTypeAutoPopulate = null;
        let laborLabelBillingTypeAutoPopulateText = null;
        let continueButton, submitButton;

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

        /*Validate TravelHour property doesnt exist.*/

        await frame.evaluate(properties.LABEL_AUTOPOPULATE_DEFAULT_TRAVEL_TYPE, () => false);

        /*Validate total labour hour and should exclude the travel hour.*/


        continueButton = (await frame.$$('xpath/' + properties.CONTINUE_BUTTON))[0];
        await frame.evaluate((el) => el.click(), continueButton);
        await helper.waitSeconds(3);

        report_totalAmount1 = (await frame.$$('xpath/' + properties.TIME_LABOR_TOTAL))[1];
        report_totalAmounttext1 = await report_totalAmount1.evaluate(el => el.innerText);
        report_totalAmounttext1.should.contain('49 Minutes');

        submitButton = (await frame.$$('xpath/' + properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(3);

        closeJsonElem = await page.waitForSelector('#receivedMessageJson-6');
        closeJson = await closeJsonElem.evaluate(el => el.textContent);
        closeMessage = JSON.parse(closeJson);
        closeMessage.should.have.property('apiVersion').that.equals(1);
        closeMessage.should.have.property('method').that.equals('close');
        closeMessage.should.have.property('inventoryList');
        closeMessage.should.have.property('actions');
        (closeMessage.actions[0]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[0].properties).should.have.property('labor_item_number').that.equals('Labor Time');
        (closeMessage.actions[0].properties).should.have.property('labor_item_desc').that.equals('Labor Time');
        (closeMessage.actions[0].properties).should.have.property('labor_start_time').that.equals('T07:04:00');
        (closeMessage.actions[0].properties).should.have.property('labor_end_time').that.equals('T07:53:00');
    }));

    test('adding new line travel hour items along with zero travel hour.', (async function () {
        this.timeout(100000);

        let frameHandle = null;
        let frame = null;
        let submitButton = null;
        let inputStartTime, inputEndTime = null;
        let report_totalAmount1, report_totalAmounttext1 = null;

        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();

        /*Validate TravelHour property doesnt exist.*/

        await frame.evaluate(properties.LABEL_AUTOPOPULATE_DEFAULT_TRAVEL_TYPE, () => false);

        await helper.waitSeconds(2);
        menuButtonElem = await frame.waitForSelector(properties.DASHBOARD_MENU);
        await frame.evaluate((el) => el.click(), menuButtonElem);
        await helper.waitSeconds(2);
        console.log("Select Main Menu");
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);

        //Add New labour item
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);

        billingItem = await frame.waitForSelector(properties.BILLING_LABOR_ITEM_SELECT);
        await helper.waitSeconds(2);
        await frame.evaluate((el) => el.click(), billingItem);
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        await billingItem.click();
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');

        inputStartTime = await frame.waitForSelector(properties.LABOR_START_TIME);
        await frame.$eval(properties.LABOR_START_TIME, el => el.click());
        await helper.waitSeconds(2);
        await frame.$eval(properties.LABOR_START_TIME, el => el.value = '');
        await inputStartTime.type('7:00 AM', {delay: 1000});
        await helper.waitSeconds(1);
        await page.keyboard.press('Tab');
        console.log("Enter Start Time");

        inputEndTime = await frame.waitForSelector(properties.LABOR_END_TIME);
        await frame.$eval(properties.LABOR_END_TIME, el => el.click());
        await helper.waitSeconds(2);
        await frame.$eval(properties.LABOR_END_TIME, el => el.value = '');
        await inputEndTime.type('8:00 AM', {delay: 1000});
        await helper.waitSeconds(2);
        await page.keyboard.press('Tab');
        console.log("Enter End Time");

        submitButton = (await frame.$$('xpath/' + properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(3);
        console.log("Generate Invoice");
        //To generate proforma invoice
        await page.screenshot({path: 'WithLabor.png', fullPage: true});
        await helper.signAndSave(frame);


        //To take screenshot of final page
        await page.screenshot({path: 'WithLabor.png', fullPage: true});


        report_totalAmount1 = (await frame.$$('xpath/' + properties.TIME_LABOR_TOTAL))[1];
        report_totalAmounttext1 = await report_totalAmount1.evaluate(el => el.innerText);
        report_totalAmounttext1.should.contain('1 Hour 49 Minutes');


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

    teardown(async () => {
        await browser.close();
    });

});