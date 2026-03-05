const should = require('chai').should();
const puppeteer = require('puppeteer');
const helper = require('../mocks/helper');
const properties = require('./utils/properties');
const openActivityWithLabor = require('../mocks/open-activity-autopopulate-labor');
const openActivityWithTravel = require('../mocks/open-activity-autopopulate-travel');
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

    });

    test('Validate if the automatically populated Labor is deleted then the plugin is getting navigated to default dashboard page. (No Travel Time available) and Validate the message shown in the popup during delete.', (async function () {
        this.timeout(60000);
        await helper.openNewActivity(page, openActivityWithLabor);
        let frameHandle = null;
        let frame = null;

        // Switch to frame
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();

        await helper.waitSeconds(2);

        // Delete Labor
        let deleteLaborButton = (await frame.$$('xpath/' + properties.LABOR_DELETE_BUTTON))[0];
        await frame.evaluate((el) => el.click(), deleteLaborButton);
        console.log("Delete Labor Charges");
        let removeLaborElem = await frame.waitForSelector(properties.ERROR_DELETE);
        let removeLaborText = await removeLaborElem.evaluate(el => el.innerText);
        removeLaborText.should.contain('Delete Labor Hours?');
        removeLaborText.should.contain('You won\'t be able to recover it.');
        await helper.waitSeconds(1);
        let removeButton = (await frame.$$('xpath/' + properties.REMOVE_CONFIRM))[0];
        await frame.evaluate((el) => el.click(), removeButton);
        console.log("Navigate to Dashboard");

        // Validate Empty dashboard
        let dashboardElem = await frame.waitForSelector(properties.DASHBOARD_CONTAINER);
        let dashboardText = await dashboardElem.evaluate(el => el.innerText);
        dashboardText.should.contain('Please report your service summary');
        dashboardText.should.contain('You can add Labor Hours, Expense Charges, Installed Parts and Part Returns details');

        // Screenshot of final screen
        await page.screenshot({ path: 'WithDeleteLabor.png', fullPage: true });

        let continueButton = (await frame.$$('xpath/' + properties.CONTINUE_BUTTON))[0];
        await frame.evaluate((el) => el.click(), continueButton);
        await helper.waitSeconds(3);
        let submitButton = (await frame.$$('xpath/' + properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(3);

        // Wait for plugin response message
        let closeJsonElem = await page.waitForSelector('#receivedMessageJson-6');
        let closeJson = await closeJsonElem.evaluate(el => el.textContent);
        let closeMessage = JSON.parse(closeJson);

        closeMessage.should.have.property('apiVersion').that.equals(1);
        closeMessage.should.have.property('method');
        ['update', 'close'].should.include(closeMessage.method);

        closeMessage.should.have.property('inventoryList');
        closeMessage.should.have.property('actions');

        if (closeMessage.method === 'close') {
            closeMessage.should.have.property('wakeupNeeded').that.equals(true);
            (closeMessage.wakeOnEvents.online).should.have.property('wakeupDelay').that.equals(120);
            (closeMessage.wakeOnEvents.timer).should.have.property('wakeupDelay').that.equals(120);
            (closeMessage.wakeOnEvents.timer).should.have.property('sleepTimeout').that.equals(600);
        }

    }));

    test('Validate if the automatically populated  Travel hours is deleted then the plugin is getting navigated to default dashboard page.(No Labor hours available)  and Validate the message shown in the popup during delete.', (async function () {

        this.timeout(60000);
        await helper.openNewActivity(page, openActivityWithTravel);
        let frameHandle = null;
        let frame = null;
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();

        await helper.waitSeconds(2);

        //To Delete Labor
        deleteLaborButton = (await frame.$$('xpath/' + properties.LABOR_DELETE_BUTTON))[0];
        await frame.evaluate((el) => el.click(), deleteLaborButton);
        console.log("Delete Labor Charges");
        removeLaborElem = await frame.waitForSelector(properties.ERROR_DELETE);
        removeLaborText = await removeLaborElem.evaluate(el => el.innerText);
        removeLaborText.should.contain('Delete Travel Hrs?');
        removeLaborText.should.contain('You won\'t be able to recover it.');

        await helper.waitSeconds(1);
        removeButton = (await frame.$$('xpath/' + properties.REMOVE_CONFIRM))[0];
        await frame.evaluate((el) => el.click(), removeButton);
        console.log("Navigate to Dashboard");

        //To Validate Empty dashboard
        dashboardElem = await frame.waitForSelector(properties.DASHBOARD_CONTAINER);
        dashboardText = await dashboardElem.evaluate(el => el.innerText);
        dashboardText.should.contain('Please report your service summary');
        dashboardText.should.contain('You can add Labor Hours, Expense Charges, Installed Parts and Part Returns details');
        //To take screenshot of final screen
        await page.screenshot({path: 'WithDeleteLabor.png', fullPage: true});

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
        if (closeMessage.method === 'close') {
            closeMessage.should.have.property('wakeupNeeded').that.equals(true);
            (closeMessage.wakeOnEvents.online).should.have.property('wakeupDelay').that.equals(120);
            (closeMessage.wakeOnEvents.timer).should.have.property('wakeupDelay').that.equals(120);
            (closeMessage.wakeOnEvents.timer).should.have.property('sleepTimeout').that.equals(600);
        }


    }));

    test('Validate same item mulitple time for Labor Hours and validate if both are shown as separate lineitems.', (async function () {

        this.timeout(100000);
        await helper.openNewActivity(page, openActivityWithLabor);
        let frameHandle = null;
        let frame = null;
        let inputStartTime = null, inputEndTime = null;
        let submitButton = null;

        //To switch to frame
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
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
        await helper.waitSeconds(5);
        inputStartTime = await frame.waitForSelector(properties.LABOR_START_TIME);
        await frame.$eval(properties.LABOR_START_TIME, el => el.click());
        await helper.waitSeconds(2);
        await frame.$eval(properties.LABOR_START_TIME, el => el.value = '');
        await inputStartTime.type('7:00 AM', {delay: 1000});
        await helper.waitSeconds(1);
        await page.keyboard.press('Tab');
        console.log("Enter Start Time");

        await helper.waitSeconds(2);
        inputEndTime = await frame.waitForSelector(properties.LABOR_END_TIME);
        await frame.$eval(properties.LABOR_END_TIME, el => el.click());
        await frame.$eval(properties.LABOR_END_TIME, el => el.value = '');
        await helper.waitSeconds(2);
        await inputEndTime.type('8:00 AM', {delay: 1000});
        await helper.waitSeconds(2);
        await page.keyboard.press('Tab');
        console.log("Enter End Time");

        await helper.waitSeconds(2);
        submitButton = (await frame.$$('xpath/' + properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(3);

        labelLaborBillingItem = (await frame.$$('xpath/' + properties.DASHBOARD_LABOR))[0];
        labelLaborBillingItemText = await labelLaborBillingItem.evaluate(el => el.innerText);
        labelLaborBillingItemText.should.contain('Labor Hours');
        labelLaborBillingItemText.should.contain('Labor');
        labelLaborBillingItemText.should.contain('49 Minutes');

        labelLaborBillingItem = (await frame.$$('xpath/' + properties.DASHBOARD_LABOR))[1];
        labelLaborBillingItemText = await labelLaborBillingItem.evaluate(el => el.innerText);
        labelLaborBillingItemText.should.contain('Labor Hours');
        labelLaborBillingItemText.should.contain('Labor');
        labelLaborBillingItemText.should.contain('1 Hour');

        //To take screenshot of final page
        await page.screenshot({path: 'WithLabor.png', fullPage: true});

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

    test('Validate after adding new Labor only the Labor Details are shown in the dashboard and  other Charges should not be shown.(autoPopulateLabor - false)', (async function () {

        this.timeout(60000);
        await helper.openNewActivity(page, openActivityWithLabor);
        let frameHandle = null;
        let frame = null;

        //To switch to frame
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();

        await helper.waitSeconds(2);

        global_body = (await frame.$$('xpath/' + properties.GLOBAL_BODY))[0];
        global_bodyText = await global_body.evaluate(el => el.innerText);
        await global_bodyText.should.contain('Labor');
        await global_bodyText.should.not.contain('Expenses');
        await global_bodyText.should.not.contain('Added Parts');
        await global_bodyText.should.not.contain('Return Parts');

        //To take screenshot of final screen
        await page.screenshot({path: 'WithDeleteLabor.png', fullPage: true});

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


    teardown(async () => {
        await browser.close();
    });

});