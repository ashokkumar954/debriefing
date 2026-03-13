const should = require('chai').should();
const puppeteer = require('puppeteer');
const helper = require('../mocks/helper');
const properties = require('./utils/properties');
const withAddAndReturnParts = require('../mocks/open-with-add-and-return-parts');
const deleteAddedParts = require('../mocks/updateResult_DeleteAddedParts');
const deleteReturnParts = require('../mocks/updateResult_DeleteReturnedParts');
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
        await helper.openNewActivity(page, withAddAndReturnParts);
    });

    test('Validate adding parts/Validate deleting the added parts/Validate adding return parts/Validate deleting the added return parts', (async function () {
        this.timeout(80000);

        let frameHandle = null;
        let frame = null;
        let dashboardElem = null, dashboardText = null;
        let menuButtonElem = null, menuButtonText = null;
        let deletePartsButton = null, removePartsButton = null, removePartsText = null;
        let deleteReturnPartsButton = null, removeReturnParts = null, removeReturnPartsText = null, removeReturnPartsButton = null;
        let menuAddedPart = null, menuAddedPartText = null, menuAddedReturnPart = null, menuAddedReturnPartText = null;
        let continueButton = null, submitButton = null, removeButton = null;

        // Switch to frame
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();
        //To validate menu option with non-empty dashboard
        menuButtonElem = await frame.waitForSelector(properties.SIDE_MENU_SELECT);
        menuButtonText = await menuButtonElem.evaluate(el => el.innerText);
        menuButtonText.should.contain('Add Charges');
        // Validate the added parts
        menuAddedPart = (await frame.$$('xpath/' + properties.ADDED_PARTS))[0];
        menuAddedPartText = await menuAddedPart.evaluate(el => el.innerText);
        menuAddedPartText.should.contain('ECM300001');

        // Validate the added return parts
        menuAddedReturnPart = (await frame.$$('xpath/' + properties.ADDED_RETURN_PARTS))[0];
        menuAddedReturnPartText = await menuAddedReturnPart.evaluate(el => el.innerText);
        menuAddedReturnPartText.should.contain('ECM200002');

        // Delete the added installed part
        deletePartsButton = (await frame.$$('xpath/' + properties.DELETE_ADDED_PARTS))[0];
        await deletePartsButton.evaluate(b => b.click());

        removePartsButton = await frame.waitForSelector(properties.ERROR_DELETE);
        removePartsText = await removePartsButton.evaluate(el => el.innerText);
        removePartsText.should.contain('Delete ECM300001 (SN001)?');
        removePartsText.should.contain('You won\'t be able to recover it.');

        await new Promise(resolve => setTimeout(resolve, 1000));
        removeButton = (await frame.$$('xpath/' + properties.REMOVE_CONFIRM))[0];
        await removeButton.evaluate(b => b.click({ delay: 1000 }));
        await helper.waitSeconds(3);

        // Delete the return part
        deleteReturnPartsButton = (await frame.$$('xpath/' + properties.DELETE_RETURN_PARTS))[0];
        await deleteReturnPartsButton.evaluate(b => b.click({ delay: 1000 }));
        removeReturnParts = await frame.waitForSelector(properties.ERROR_DELETE);
        removeReturnPartsText = await removeReturnParts.evaluate(el => el.innerText);
        removeReturnPartsText.should.contain('Delete ECM200002 (3433321)?');
        removeReturnPartsText.should.contain('You won\'t be able to recover it.');
        await new Promise(resolve => setTimeout(resolve, 1000));
        removeReturnPartsButton = (await frame.$$('xpath/' + properties.REMOVE_CONFIRM))[0];
        await removeReturnPartsButton.evaluate(b => b.click({ delay: 1000 }));
        await helper.waitSeconds(3);

        // Validate the empty dashboard
        dashboardElem = await frame.waitForSelector(properties.DASHBOARD_CONTAINER_AFTER_DELETE);
        dashboardText = await dashboardElem.evaluate(el => el.innerText);
        dashboardText.should.contain('Please report your service summary');
        dashboardText.should.contain('You can add Labor Hours, Expense Charges, Installed Parts and Part Returns details');

        // Screenshot of the final screen
        await page.screenshot({ path: 'WithDeleteAddedAndReturnPartsAdded.png', fullPage: true });

        // Final workflow: continue, submit, validate message from plugin
        continueButton = (await frame.$$('xpath/' + properties.CONTINUE_BUTTON))[0];
        await frame.evaluate((el) => el.click(), continueButton);
        await helper.waitSeconds(3);

        submitButton = (await frame.$$('xpath/' + properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(3);

        let closeJsonElem = await page.waitForSelector('#receivedMessageJson-6');
        let closeJson = await closeJsonElem.evaluate(el => el.textContent);
        let closeMessage = JSON.parse(closeJson);

        closeMessage.should.have.property('apiVersion').that.equals(1);
        closeMessage.should.have.property('method');
        closeMessage.should.have.property('inventoryList');
        closeMessage.should.have.property('actions');
        (closeMessage.actions[0]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[0].properties).should.have.property('invsn').that.equals('SN001');
        if (closeMessage.method === 'close') {
            closeMessage.should.have.property('wakeupNeeded').that.equals(true);
            (closeMessage.wakeOnEvents.online).should.have.property('wakeupDelay').that.equals(120);
            (closeMessage.wakeOnEvents.timer).should.have.property('wakeupDelay').that.equals(120);
            (closeMessage.wakeOnEvents.timer).should.have.property('sleepTimeout').that.equals(600);
        }

    }));

    test('Validate Dashboard after deleting the added parts', (async function () {
        this.timeout(60000);
        let frameHandle = null;
        let frame = null;
        let menuButtonElem = null, menuButtonText = null;
        let deletePartsButton = null, removePartsButton = null, removePartsText = null;
        let deleteReturnPartsButton = null, removeReturnParts = null, removeReturnPartsText = null, removeReturnPartsButton = null;
        let menuAddedPart = null, menuAddedPartText = null,
            menuAddedReturnPart = null, menuAddedReturnPartText = null;
        let label_LABOR = null , label_EXPENSE = null , label_ADDED_PARTS = null, label_RETURNED_PARTS = null,label_NOITEMS = null;
        let menuLaborText = null , menuExpenseText = null , menuAddedPartsText = null , menuReturnedPartsText = null;
        let continueButton = null, submitButton = null, removeButton = null;

        // Switch to plugin frame
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();

        // Validate side menu with non-empty dashboard
        menuButtonElem = await frame.waitForSelector(properties.SIDE_MENU_SELECT);
        menuButtonText = await menuButtonElem.evaluate(el => el.innerText);
        menuButtonText.should.contain('Add Charges');

        // Validate added parts
        menuAddedPart = (await frame.$$('xpath/' + properties.ADDED_PARTS))[0];
        menuAddedPartText = await menuAddedPart.evaluate(el => el.innerText);
        menuAddedPartText.should.contain('ECM300001');

        // Validate added return parts
        menuAddedReturnPart = (await frame.$$('xpath/' + properties.ADDED_RETURN_PARTS))[0];
        menuAddedReturnPartText = await menuAddedReturnPart.evaluate(el => el.innerText);
        menuAddedReturnPartText.should.contain('ECM200002');

        // Delete added parts
        deletePartsButton = (await frame.$$('xpath/' + properties.DELETE_ADDED_PARTS))[0];
        await deletePartsButton.evaluate(b => b.click());
        removePartsButton = await frame.waitForSelector(properties.ERROR_DELETE);
        removePartsText = await removePartsButton.evaluate(el => el.innerText);
        removePartsText.should.contain('Delete ECM300001 (SN001)?');
        removePartsText.should.contain('You won\'t be able to recover it.');
        await new Promise(resolve => setTimeout(resolve, 1000));
        removeButton = (await frame.$$('xpath/' + properties.REMOVE_CONFIRM))[0];
        await removeButton.evaluate(b => b.click({delay: 1000}));
        await helper.waitSeconds(3);
        // Inform plugin of deleted part
        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify(deleteAddedParts, 0, 4));
        await page.click(properties.SEND_MESSAGE);
        await helper.waitSeconds(3);

        // Delete the returned part
        deleteReturnPartsButton = (await frame.$$('xpath/' + properties.DELETE_RETURN_PARTS))[0];
        await deleteReturnPartsButton.evaluate(b => b.click({delay: 1000}));
        removeReturnParts = await frame.waitForSelector(properties.ERROR_DELETE);
        removeReturnPartsText = await removeReturnParts.evaluate(el => el.innerText);
        removeReturnPartsText.should.contain('Delete ECM200002 (3433321)?');
        removeReturnPartsText.should.contain('You won\'t be able to recover it.');
        await new Promise(resolve => setTimeout(resolve, 1000));
        removeReturnPartsButton = (await frame.$$('xpath/' + properties.REMOVE_CONFIRM))[0];
        await removeReturnPartsButton.evaluate(b => b.click({delay: 1000}));
        await helper.waitSeconds(3);
        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify(deleteReturnParts, 0, 4));
        await page.click(properties.SEND_MESSAGE);
        await helper.waitSeconds(3);

        // Validate the dashboard is now empty (labels present, but items gone)
        await helper.waitSeconds(2);
        label_LABOR =  (await frame.$$('xpath/' + properties.LABEL_LABOR))[0];
        menuLaborText = await label_LABOR.evaluate(el => el.innerText);
        menuLaborText.should.contain('Labor');
        label_EXPENSE =  (await frame.$$('xpath/' + properties.LABEL_EXPENSES))[0];
        menuExpenseText = await label_EXPENSE.evaluate(el => el.innerText);
        menuExpenseText.should.contain('Expenses');
        label_ADDED_PARTS =  (await frame.$$('xpath/' + properties.LABEL_ADD_PARTS))[0];
        menuAddedPartsText = await label_ADDED_PARTS.evaluate(el => el.innerText);
        menuAddedPartsText.should.contain('Added Parts');
        label_RETURNED_PARTS =  (await frame.$$('xpath/' + properties.LABEL_RETURNED_PARTS))[0];
        menuReturnedPartsText = await label_RETURNED_PARTS.evaluate(el => el.innerText);
        menuReturnedPartsText.should.contain('Returned Parts');

        // Screenshot for debugging
        await page.screenshot({path: 'WithDeleteAddedAndReturnPartsAdded.png', fullPage: true});

        // Submit workflow and validate plugin message
        continueButton = (await frame.$$('xpath/' + properties.CONTINUE_BUTTON))[0];
        await frame.evaluate((el) => el.click(), continueButton);
        await helper.waitSeconds(3);
        submitButton = (await frame.$$('xpath/' + properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(3);

        let closeJsonElem = await page.waitForSelector('#receivedMessageJson-6');
        let closeJson = await closeJsonElem.evaluate(el => el.textContent);
        let closeMessage = JSON.parse(closeJson);

        closeMessage.should.have.property('apiVersion').that.equals(1);
        closeMessage.should.have.property('method');
        ['update','close'].should.include(closeMessage.method);
        closeMessage.should.have.property('inventoryList');
        closeMessage.should.have.property('actions');
        (closeMessage.actions[0]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[0].properties).should.have.property('invsn').that.equals('SN001');
        if (closeMessage.method === 'close') {
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