const should = require('chai').should();
const puppeteer = require('puppeteer');
const helper = require('../mocks/helper');
const properties = require('./utils/properties');
const browserHelper = require('./utils/browserHelper');
const openActivity = require('../mocks/open-activity');

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

    test('BHM Landing page is getting displayed without any data and having options to add labor, expense , add parts and return parts', (async function () {
        this.timeout(60000);

        let frameHandle = null;
        let frame = null;
        let dashboardElem = null, dashboardText = null;
        let menuButtonElem = null, menuButtonText = null;
        let laborButtonElem = null, expenseButtonElem = null, addPartsButtonElem = null, returnPartsButtonElem = null;
        let laborButtonText = null, expenseButtonText = null, addPartsButtonText = null, returnPartsButtonText = null;

        //To switch to frame
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();
        menuButtonElem = await frame.waitForSelector(properties.DASHBOARD_MENU);

        menuButtonText = await menuButtonElem.evaluate(el => el.innerText);
        menuButtonText.should.equal('Add Charges');
        //To Validate the dashboard content
        dashboardElem = await frame.waitForSelector(properties.DASHBOARD_CONTAINER);
        dashboardText = await dashboardElem.evaluate(el => el.innerText);
        dashboardText.should.contain('Please report your service summary');
        dashboardText.should.contain('You can add Labor Hours, Expense Charges, Installed Parts and Part Returns details');

        //To Validate the menu options or dropdown
        await frame.focus(properties.MAIN_MENU_SELECT);
        await frame.click(properties.MAIN_MENU_SELECT);

        laborButtonElem = await frame.waitForSelector(properties.MAIN_MENU_LABOR);
        expenseButtonElem = await frame.waitForSelector(properties.MAIN_MENU_EXPENSE);
        addPartsButtonElem = await frame.waitForSelector(properties.MAIN_MENU_ADD_PARTS);
        returnPartsButtonElem = await frame.waitForSelector(properties.MAIN_MENU_RETURN_PARTS);

        laborButtonText = await laborButtonElem.evaluate(el => el.innerText);
        laborButtonText.should.equal('Labor');

        expenseButtonText = await expenseButtonElem.evaluate(el => el.innerText);
        expenseButtonText.should.equal('Expenses');

        addPartsButtonText = await addPartsButtonElem.evaluate(el => el.innerText);
        addPartsButtonText.should.equal('Add Parts');

        returnPartsButtonText = await returnPartsButtonElem.evaluate(el => el.innerText);
        returnPartsButtonText.should.equal('Return Parts');
        //To Take screenshot of final page
        await page.screenshot({path: 'WithEmptyDashboard.png', fullPage: true});
    }));

    test('Validate the page by adding labor', (async function () {
        this.timeout(70000);

        let frameHandle = null;
        let frame = null;
        let menuButtonElem = null;
        let laborOption = null;
        let billingType = null, billingItem = null;
        let inputStartTime = null, inputEndTime = null;
        let submitButton = null, okButton = null;
        let closeJsonElem = null, closeJson = null, closeMessage = null;

        //To Open Activity
        //await helper.openNewActivity(page, openActivity);
        //To switch to frame
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        await helper.waitSeconds(2);
        menuButtonElem = await frame.waitForSelector(properties.DASHBOARD_MENU);
        await frame.evaluate((el) => el.click(), menuButtonElem);
        await helper.waitSeconds(1);
        console.log("Select Main Menu");
        //To Add Labor Charge
        laborOption = await frame.waitForSelector(properties.LABOR_SELECT);
        await frame.evaluate((el) => el.click(), laborOption);
        await helper.waitSeconds(2);
        console.log("To Add Labor Charge");
        billingType = await frame.waitForSelector(properties.BILLING_TYPE_SELECT);
        await billingType.click();
        await helper.waitSeconds(1);
        console.log("Select Billing Type Select");
        //await frame.click(properties.BILLING_TYPE_1);
        await frame.$eval(properties.BILLING_TYPE_1, el => el.click());
        console.log("Select Billing Type");

        await helper.waitSeconds(2);
        billingItem = await frame.waitForSelector(properties.BILLING_LABOR_ITEM_SELECT);
        await billingItem.click();
        await helper.waitSeconds(1);
        console.log("Select Labor Item Type");
        await frame.$eval(properties.BILLING_LABOR_ITEM_1, el => el.click());
        await helper.waitSeconds(2);
        console.log("Select BILLING_LABOR_ITEM");
        inputStartTime = await frame.waitForSelector(properties.LABOR_START_TIME);
        await frame.$eval(properties.LABOR_START_TIME, el => el.click());
        await inputStartTime.type('7:00 AM', {delay: 1000});
        await helper.waitSeconds(1);
        await page.keyboard.press('Tab');
        console.log("Enter Start Time");

        inputEndTime = await frame.waitForSelector(properties.LABOR_END_TIME);
        await frame.$eval(properties.LABOR_END_TIME, el => el.click());
        await inputEndTime.type('8:00 AM', {delay: 1000});
        await helper.waitSeconds(2);
        await page.keyboard.press('Tab');
        console.log("Enter End Time");

        await helper.waitSeconds(2);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
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


        //To take screenshot of final page
        await page.screenshot({path: 'WithLabor.png', fullPage: true});

    }));

    test('Validate deleting the added labor items', (async function () {
        this.timeout(80000);

        let frameHandle = null;
        let frame = null;
        let dashboardElem = null, dashboardText = null;
        let menuButtonElem = null;
        let laborOption = null;
        let billingType = null, billingItem = null;
        let inputStartTime = null, inputEndTime, amount = null;
        let submitButton = null;
        let deleteLaborButton = null;
        let removeLaborElem = null, removeLaborText = null, removeButton = null;

        //To Open Activity
        //await helper.openNewActivity(page, openActivity);
        //To switch to frame
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        await helper.waitSeconds(2);
        menuButtonElem = await frame.waitForSelector(properties.DASHBOARD_MENU);
        await frame.evaluate((el) => el.click(), menuButtonElem);
        await helper.waitSeconds(1);
        console.log("Select Main Menu");
        //To Add Labor Charge
        laborOption = await frame.waitForSelector(properties.LABOR_SELECT);
        await frame.evaluate((el) => el.click(), laborOption);
        await helper.waitSeconds(2);
        console.log("To Add Labor Charge");
        billingType = await frame.waitForSelector(properties.BILLING_TYPE_SELECT);
        await billingType.click();
        console.log("Select Billing Type");
        await helper.waitSeconds(1);
        //await frame.click(properties.BILLING_TYPE_1);
        await frame.$eval(properties.BILLING_TYPE_1, el => el.click());
        console.log("Select BILLING_TYPE_1");

        await helper.waitSeconds(2);
        billingItem = await frame.waitForSelector(properties.BILLING_LABOR_ITEM_SELECT);
        await billingItem.click();
        await helper.waitSeconds(1);
        console.log("Select Labor Item Type");
        //await frame.click(properties.BILLING_LABOR_ITEM_1);
        await frame.$eval(properties.BILLING_LABOR_ITEM_1, el => el.click());
        console.log("Select BILLING_LABOR_ITEM");
        await helper.waitSeconds(2);
        inputStartTime = await frame.waitForSelector(properties.LABOR_START_TIME);
        await frame.$eval(properties.LABOR_START_TIME, el => el.click());
        //await inputStartTime.click({delay: 1000});
        await inputStartTime.type('7:00 AM', {delay: 1000});
        await helper.waitSeconds(1);
        await page.keyboard.press('Tab');
        /*await inputStartTime.click();
        await helper.waitSeconds(1);*/
        console.log("Enter Start Time");

        inputEndTime = await frame.waitForSelector(properties.LABOR_END_TIME);
        await frame.$eval(properties.LABOR_END_TIME, el => el.click());
        //await inputEndTime.click({delay: 1000});
        await inputEndTime.type('8:00 AM', {delay: 1000});
        await helper.waitSeconds(2);
        await page.keyboard.press('Tab');
        console.log("Enter End Time");
        /*okButton =(await frame.$$('xpath/' +properties.LABOR_TIME_OK_BUTTON))[0];
        okButton.click({delay:2000});*/
        // await page.keyboard.press("Enter",{delay :2000});
        // await inputStartTime.click({delay: 3000});

        await helper.waitSeconds(2);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(3);
        console.log("Submit Labor Charges");
        //To Delete Labor
        deleteLaborButton = (await frame.$$('xpath/'+properties.LABOR_DELETE_BUTTON))[0];
        //await deleteLaborButton.click({delay: 1000});
        await frame.evaluate((el) => el.click(), deleteLaborButton);
        console.log("Delete Labor Charges");
        removeLaborElem = await frame.waitForSelector(properties.ERROR_DELETE);
        removeLaborText = await removeLaborElem.evaluate(el => el.innerText);
        removeLaborText.should.contain('Delete FS Overtime Labor?');
        removeLaborText.should.contain('You won\'t be able to recover it.');

        await helper.waitSeconds(1);
        removeButton = (await frame.$$('xpath/'+properties.REMOVE_CONFIRM))[0];
        await frame.evaluate((el) => el.click(), removeButton);
        console.log("Navigate to Dashboard");
        //await removeButton.click({delay: 2000});
        //To Validate Empty dashboard
        dashboardElem = await frame.waitForSelector(properties.DASHBOARD_CONTAINER);
        dashboardText = await dashboardElem.evaluate(el => el.innerText);
        dashboardText.should.contain('Please report your service summary');
        dashboardText.should.contain('You can add Labor Hours, Expense Charges, Installed Parts and Part Returns details');
        //To take screenshot of final screen
        await page.screenshot({path: 'WithDeleteLabor.png', fullPage: true});

    }));

    test('Validate adding expense', (async function () {
        this.timeout(60000);

        let frameHandle = null;
        let frame = null;
        let menuButtonElem = null;
        let expenseOption = null;
        let billingType = null, billingItem = null;
        let amount = null;
        let submitButton = null;
        let closeJsonElem = null, closeJson = null, closeMessage = null;

        //To Open Activity
        //await helper.openNewActivity(page, openActivity);
        //To switch to frame
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        await helper.waitSeconds(2);
        menuButtonElem = await frame.waitForSelector(properties.DASHBOARD_MENU);
        await frame.evaluate((el) => el.click(), menuButtonElem);
        await helper.waitSeconds(1);
        console.log("Select Main Menu");
        //To Add expense
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);
        console.log("Add Expense");

        console.log("Looking for selector:", properties.EXPENSE_AMOUNT);
        const el = await frame.$(properties.EXPENSE_AMOUNT);
        console.log("Element found?", !!el);

        if (!el) {
            const html = await frame.content();
            console.log("Frame HTML snippet:", html.slice(0, 500)); // first 500 chars
        }

        await frame.$eval(properties.EXPENSE_AMOUNT, el => el.click());
        amount = await frame.waitForSelector(properties.EXPENSE_AMOUNT);
        await amount.type("50", {delay: 1000});
        await page.keyboard.press('Enter');
        console.log("Add Expense Amount");
        await helper.waitSeconds(2);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(2);
        console.log("Submit to generate invoice");
        //To Generate Proforma invoice
        await helper.signAndSave(frame);

        //To Validate the details submitted
        closeJsonElem = await page.waitForSelector('#receivedMessageJson-6');
        closeJson = await closeJsonElem.evaluate(el => el.textContent);
        closeMessage = JSON.parse(closeJson);

        closeMessage.should.have.property('apiVersion').that.equals(1);
        closeMessage.should.have.property('method');
        ['update', 'close'].should.include(closeMessage.method);
        closeMessage.should.have.property('inventoryList');
        closeMessage.should.have.property('actions');

        (closeMessage.actions[0]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[0]).should.have.property('action').that.equals('create');
        (closeMessage.actions[0]).should.have.property('invpool').that.equals('install');
        (closeMessage.actions[0]).should.have.property('invtype').that.equals('expense');
        (closeMessage.actions[0].properties).should.have.property('expense_service_activity').that.equals('Expense');
        (closeMessage.actions[0].properties).should.have.property('expense_item_number').that.equals('prk');
        (closeMessage.actions[0].properties).should.have.property('expense_item_desc').that.equals('prk');
        (closeMessage.actions[0].properties).should.have.property('expense_amount').that.equals('50');

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

        //To take screenshot of final screen
        await page.screenshot({path: 'WithExpense.png', fullPage: true});

    }));

    test('Validate deleting the added expense', (async function () {
        this.timeout(40000);

        let frameHandle = null;
        let frame = null;
        let dashboardElem = null, dashboardText = null;
        let menuButtonElem = null;
        let expenseOption = null;
        let billingType = null, billingItem = null;
        let amount = null;
        let submitButton = null;
        let deleteExpenseButton = null, removeExpensesButton = null, removeExpensesText = null;
        let removeButton = null;

        //To Open Activity
        //await helper.openNewActivity(page, openActivity);
        //To switch to frame
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        /*menuButtonElem = await frame.waitForSelector('#menuButton1');
        await frame.evaluate((el) => el.click(), menuButtonElem);*/
        await helper.waitSeconds(2);
        menuButtonElem = await frame.waitForSelector(properties.DASHBOARD_MENU);
        await frame.evaluate((el) => el.click(), menuButtonElem);
        await helper.waitSeconds(1);
        console.log("Select Main Menu");
        //To Add expense
        /*await frame.focus(properties.EXPENSE_SELECT);
        expenseOption = (await frame.$$('xpath/'+properties.EXPENSE_TYPE_SELECT))[0];
        await expenseOption.click({delay: 1000});
        await helper.waitSeconds(1);*/
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);
        console.log("Add Expense");
        await frame.$eval(properties.EXPENSE_AMOUNT, el => el.click());
        console.log("Click on  Expense Amount");
        amount = await frame.waitForSelector(properties.EXPENSE_AMOUNT);
        await amount.type("5", {delay: 1000});
        await page.keyboard.press('Enter');
        console.log("Add Expense Amount");
        await helper.waitSeconds(2);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(2);
        console.log("Submit Expense Amount added");
        //To delete expense
        deleteExpenseButton = (await frame.$$('xpath/'+properties.EXPENSE_DELETE_BUTTON))[0];
        await frame.evaluate((el) => el.click(), deleteExpenseButton);
        console.log("Delete Expense Amount");
        removeExpensesButton = await frame.waitForSelector(properties.ERROR_DELETE);
        removeExpensesText = await removeExpensesButton.evaluate(el => el.innerText);
        await removeExpensesText.should.contain('Delete Parking?');
        removeExpensesText.should.contain('You won\'t be able to recover it.');
        console.log("Information message to delete Expense");
        await helper.waitSeconds(3);
        removeButton = (await frame.$$('xpath/'+properties.REMOVE_CONFIRM))[0];
        await frame.evaluate((el) => el.click(), removeButton);
        console.log("Navigate to Dashboard");
        //await removeButton.click({delay: 3000});
        //To Validate empty dashboard
        dashboardElem = await frame.waitForSelector(properties.DASHBOARD_CONTAINER_AFTER_DELETE);
        dashboardText = await dashboardElem.evaluate(el => el.innerText);
        dashboardText.should.contain('Please report your service summary');
        dashboardText.should.contain('You can add Labor Hours, Expense Charges, Installed Parts and Part Returns details');
        //To take screenshot of final page
        await page.screenshot({path: 'WithDeleteExpense.png', fullPage: true});

    }));

    test('BHM Redwood - Verify search functionality and results details for Return parts', (async function () {
        this.timeout(90000);

        let frameHandle = null;
        let frame = null;
        let menuButtonElem = null;
        let expenseOption = null;
        let submitButton = null, searchPart = null, returnPart = null,
            returnPartSerialNumber = null;
        let menuAddedReturnPart = null, menuAddedReturnPartText = null;

        //To Open Activity
        //await helper.openNewActivity(page, openActivity);
        //To switch to frame
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        await helper.waitSeconds(2);
        menuButtonElem = await frame.waitForSelector(properties.DASHBOARD_MENU);
        await frame.evaluate((el) => el.click(), menuButtonElem);
        await helper.waitSeconds(1);
        console.log("Select Main Menu");
        //To add return parts
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);
        console.log("To select return part menu");

        //Search Serialized inventory
        searchPart = (await frame.$$('xpath/'+properties.RETURN_PART_SEARCH))[0];
        await searchPart.type('ECM200002', {delay: 1000});
        await page.keyboard.press('Enter', {delay: 1000});
        await helper.waitSeconds(2);
        console.log("Search Using Serial Number");
        //To Load the Search result of Serialized inventory
        const callProcedureMessageSearchInvJsonElem = await page.waitForSelector('#receivedMessageJson-6');
        const callProcedureMessageSearchInvJson = await callProcedureMessageSearchInvJsonElem.evaluate(el => el.textContent);
        const callProcedureMessageSearchInv = JSON.parse(callProcedureMessageSearchInvJson);

        callProcedureMessageSearchInv.should.have.property('apiVersion').that.equals(1);
        callProcedureMessageSearchInv.should.have.property('method').that.equals('callProcedure');
        callProcedureMessageSearchInv.should.have.property('callId');
        callProcedureMessageSearchInv.should.have.property('procedure').that.equals('searchParts');

        const callIdSearchInv = callProcedureMessageSearchInv.callId;

        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify({
            "apiVersion": 1,
            "method": "callProcedureResult",
            "callId": callIdSearchInv,
            "resultData": {
                "items": [
                    {
                        "catalogId": 599,
                        "itemId": 37294,
                        "label": "ECM200002",
                        "itemType": "part",
                        "linkedItems": [],
                        "fields": {
                            "part_disposition_code": "",
                            "part_item_number": "ECM200002",
                            "part_item_revision": "A",
                            "part_item_desc": "Safety Clip",
                            "part_uom_code": "zzu"
                        },
                        "images": []
                    }
                ],
                "isContinueAvailable": true,
                "source": "cache",
                "searchId": 1
            }
        }, 0, 4));
        await page.click(properties.SEND_MESSAGE);
        await helper.waitSeconds(3);

        //To Select the search result
        returnPart = (await frame.$$('xpath/'+properties.RETURN_PART_SEARCH_SELECT))[0];
        await frame.evaluate((el) => el.click(), returnPart);
        //await returnPart.click({delay: 1000});
        //Enter Serial Number
        returnPartSerialNumber = (await frame.$$('xpath/'+properties.RETURN_PART_SERIAL_NUMBER))[0];
        await returnPartSerialNumber.type('SN100', {delay: 1000});
        console.log("Search Return Parts using serial number");
        //Submit Return Part
        await helper.waitSeconds(3);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(2);
        console.log("Validate Return parts");
        //To Validate the Return parts added after searching
        menuAddedReturnPart = (await frame.$$('xpath/'+properties.ADDED_PART))[0];
        menuAddedReturnPartText = await menuAddedReturnPart.evaluate(el => el.innerText);
        menuAddedReturnPartText.should.contain('ECM200002');
        //To take screenshot of final page
        await page.screenshot({path: 'WithReturnPartsSearched.png', fullPage: true});

    }));

    test('To validate add parts with Inventory having 2 different serial numbers', (async function () {
        this.timeout(120000);

        let frameHandle = null;
        let frame = null;
        let menuButtonElem = null;
        let menuOptionWithCharges = null;
        let addPartOption = null;
        let submitButton = null, searchPart = null, searchPartResult = null;

        //To Open Activity
        //await helper.openNewActivity(page, openActivity);
        //To switch to frame
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        await helper.waitSeconds(2);
        menuButtonElem = await frame.waitForSelector(properties.DASHBOARD_MENU);
        await frame.evaluate((el) => el.click(), menuButtonElem);
        await helper.waitSeconds(2);
        console.log("Select Main Menu");
        //To Add parts
        /*await frame.focus(properties.ADD_PART_SELECT);
        addPartOption = (await frame.$$('xpath/'+properties.ADD_PART_TYPE_SELECT))[0];
        await addPartOption.click({delay: 1000});
        await helper.waitSeconds(1);*/
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);
        console.log("Select Add Parts in main menu");
        //Search using serial number
        searchPart = (await frame.$x(properties.ADD_PART_SEARCH))[0];
        await searchPart.type('SN005',{delay : 1000});
        await page.keyboard.press('Enter');
        await helper.waitSeconds(2);
        console.log("Search for the Parts using serial number");
        await frame.evaluate((el) => el.click(), searchPart);
        //await searchPart.click({delay: 1000});
        await helper.waitSeconds(2);
        //Select the search result
        searchPartResult = await frame.waitForSelector(properties.ADD_PART_SEARCH_SELECT);
        await frame.$eval(properties.ADD_PART_SEARCH_SELECT, el => el.click());
        // await searchPartResult.click({delay: 1000});

        //Click on Submit Button
        await helper.waitSeconds(3);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        console.log("Add the first part");
        //To add second part
        await helper.waitSeconds(3);
        menuOptionWithCharges = (await frame.$$('xpath/'+properties.SIDE_MENU_BUTTON))[0];
        //await menuOptionWithCharges.click({delay: 1000});
        await frame.evaluate((el) => el.click(), menuOptionWithCharges);
        await helper.waitSeconds(1);
        console.log("Select side menu");
        /* addPartOption = (await frame.$$('xpath/'+properties.SIDE_MENU_ADD_PART))[0];
         await addPartOption.click({delay: 1000});
         await helper.waitSeconds(1);*/
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);
        console.log("Select Add Part using side menu");
        searchPart = (await frame.$$('xpath/'+properties.ADD_PART_SEARCH))[0];
        await searchPart.type('SN004', {delay: 1000});
        await page.keyboard.press('Enter');
        await helper.waitSeconds(2);
        console.log("Search Parts using serial number");
        //Select the search result
        searchPartResult = await frame.waitForSelector(properties.ADD_PART_SEARCH_SELECT);
        await frame.$eval(properties.ADD_PART_SEARCH_SELECT, el => el.click());
        //await searchPartResult.click({delay: 1000});
        await helper.waitSeconds(3);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        console.log("Add the searched part");
        await helper.waitSeconds(3);
        //To generate proforma invoice
        await helper.signAndSave(frame);
        console.log("Generate Invoice");
        //To validate the charges added
        let closeJsonElem = await page.waitForSelector('#receivedMessageJson-6');
        let closeJson = await closeJsonElem.evaluate(el => el.textContent);
        let closeMessage = JSON.parse(closeJson);

        closeMessage.should.have.property('apiVersion').that.equals(1);
        closeMessage.should.have.property('method');
        ['update', 'close'].should.include(closeMessage.method);
        closeMessage.should.have.property('inventoryList');
        closeMessage.should.have.property('actions');

        (closeMessage.actions[0]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[0]).should.have.property('action').that.equals('install');
        (closeMessage.actions[0].properties).should.have.property('part_service_activity_used').that.equals('IN');
        (closeMessage.actions[0].properties).should.have.property('invsn').that.equals('SN005');

        (closeMessage.actions[1]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[1]).should.have.property('action').that.equals('install');
        (closeMessage.actions[1].properties).should.have.property('part_service_activity_used').that.equals('IN');
        (closeMessage.actions[1].properties).should.have.property('invsn').that.equals('SN004');

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

        //To take the final screenshot
        await page.screenshot({path: 'WithMultipleInventoryWithDistinctSRs.png', fullPage: true});

    }));

    test('To validate add parts by adding same inventory with same serial number multiple times', (async function () {
        this.timeout(120000);

        let frameHandle = null;
        let frame = null;
        let menuButtonElem = null;
        let menuOptionWithCharges = null;
        let addPartOption = null;
        let submitButton = null, searchPart = null, searchPartResult = null;
        let criticalError = null;

        //To Open Activity
        //await helper.openNewActivity(page, openActivity);
        //To switch to frame
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        await helper.waitSeconds(2);
        menuButtonElem = await frame.waitForSelector(properties.DASHBOARD_MENU);
        await frame.evaluate((el) => el.click(), menuButtonElem);
        await helper.waitSeconds(2);
        console.log("Select Main Menu");
        //To Add parts
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);

        console.log("Select Add Parts menu option");
        //Search using serial number
        searchPart = (await frame.$$('xpath/'+properties.ADD_PART_SEARCH))[0];
        await searchPart.type('SN005',{delay : 1000});
        await page.keyboard.press('Enter');
        await helper.waitSeconds(2);
        await frame.evaluate((el) => el.click(), searchPart);
        //await searchPart.click({delay: 1000});
        console.log("Search Add Parts using Serial Number");
        //Select the search result
        await frame.$eval(properties.ADD_PART_SEARCH_SELECT, el => el.click());

        //Click on Submit Button
        await helper.waitSeconds(3);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        console.log("Add First part");
        //To add second part
        await helper.waitSeconds(3);
        menuOptionWithCharges = (await frame.$$('xpath/'+properties.SIDE_MENU_BUTTON))[0];
        await frame.evaluate((el) => el.click(), menuOptionWithCharges);
        //await menuOptionWithCharges.click({delay: 1000});
        await helper.waitSeconds(1);
        console.log("Select Add Parts menu option in side menu");

        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);

        searchPart = (await frame.$$('xpath/'+properties.ADD_PART_SEARCH))[0];
        await searchPart.type('SN005', {delay: 2000});
        await helper.waitSeconds(2);
        await page.keyboard.press('Enter', {delay: 2000});
        await helper.waitSeconds(2);
        console.log("Search serial Number to add");
        //Select the search result
        // searchPartResult = await frame.waitForSelector(properties.ADD_PART_SEARCH_SELECT);
        // await searchPartResult.click({delay: 1000});
        await frame.$eval(properties.ADD_PART_SEARCH_SELECT, el => el.click());
        console.log("Search for invalid serial number");
        //Validate the error
        criticalError = (await frame.$$('xpath/'+properties.ERROR_ADD_DELETE_PARTS))[0];
        const criticalErrorText = await criticalError.evaluate(el => el.innerText);
        criticalErrorText.should.contain('is not available in your inventory. Please update your inventory with this item and proceed.');
        console.log("Error message shown for invalid inventory");
        //To take screenshot of final screen
        await page.screenshot({path: 'WithDuplicateInventoryError.png', fullPage: true});

    }));

    test('To validate return parts for a serialised inventory in OFS', (async function () {
        this.timeout(120000);

        let frameHandle = null;
        let frame = null;
        let menuButtonElem = null;
        let returnPartsOption = null;
        let submitButton = null, searchPart = null, returnPart = null,
            returnPartSerialNumber = null;

        //To Open Activity
        //await helper.openNewActivity(page, openActivity);
        //To switch to frame
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        await helper.waitSeconds(2);
        menuButtonElem = await frame.waitForSelector(properties.DASHBOARD_MENU);
        await frame.evaluate((el) => el.click(), menuButtonElem);
        await helper.waitSeconds(2);
        console.log("Select Main Menu");
        //To Return parts
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);
        //await frame.focus(properties.RETURN_PART_SELECT);
        /*returnPartsOption = (await frame.$$('xpath/'+properties.RETURN_PART_TYPE_SELECT))[0];
        await returnPartsOption.click({delay: 1000});
        await helper.waitSeconds(2);*/
        console.log("Select Return Part");
        searchPart = (await frame.$$('xpath/'+properties.ADD_PART_SEARCH))[0];
        //Search Serialized inventory
        await searchPart.type('ECM300001', {delay: 1000});
        await page.keyboard.press('Enter');
        await helper.waitSeconds(2);
        console.log("Search Parts to Return using Item");
        //To Load the Search result of Serialized inventory
        const callProcedureMessageSearchInvJsonElem = await page.waitForSelector('#receivedMessageJson-6');
        const callProcedureMessageSearchInvJson = await callProcedureMessageSearchInvJsonElem.evaluate(el => el.textContent);
        const callProcedureMessageSearchInv = JSON.parse(callProcedureMessageSearchInvJson);

        callProcedureMessageSearchInv.should.have.property('apiVersion').that.equals(1);
        callProcedureMessageSearchInv.should.have.property('method').that.equals('callProcedure');
        callProcedureMessageSearchInv.should.have.property('callId');
        callProcedureMessageSearchInv.should.have.property('procedure').that.equals('searchParts');

        const callIdSearchInv = callProcedureMessageSearchInv.callId;

        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify({
            "apiVersion": 1,
            "method": "callProcedureResult",
            "callId": callIdSearchInv,
            "resultData": {
                "items": [
                    {
                        "catalogId": 599,
                        "itemId": 37294,
                        "label": "ECM300001",
                        "itemType": "part_sn",
                        "linkedItems": [],
                        "fields": {
                            "part_disposition_code": "",
                            "part_item_number": "ECM300001",
                            "part_item_revision": "A",
                            "part_item_desc": "Multi-Directional Joint assembly",
                            "part_uom_code": "zzu"
                        },
                        "images": []
                    }
                ],
                "isContinueAvailable": true,
                "source": "cache",
                "searchId": 1
            }
        }, 0, 4));
        await page.click('#sendMessageButton');
        await helper.waitSeconds(2);
        //To Select the search result
        returnPart = (await frame.$$('xpath/'+properties.RETURN_PART_SEARCH_SELECT))[0];
        await frame.evaluate((el) => el.click(), returnPart);
        //await returnPart.click({delay: 1000});
        console.log("Select Search Result");
        //Enter Serial Number
        returnPartSerialNumber = (await frame.$$('xpath/'+properties.RETURN_PART_SERIAL_NUMBER))[0];

        await returnPartSerialNumber.focus();
        await frame.evaluate((el) => el.click(), returnPartSerialNumber);
        await helper.waitSeconds(2);
        //await returnPartSerialNumber.click();
        await page.keyboard.type('SN100',{delay : 1000});
        await helper.waitSeconds(2);
        await page.keyboard.press('Enter');
        console.log("Enter serial number");
        //  await returnPartSerialNumber.type('SN100', {delay: 2000});
        //Submit Return Part
        await helper.waitSeconds(2);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(3);
        console.log("Submit Return part");
        //To Submit and sign proforma invoice
        await helper.signAndSave(frame);
        console.log("Generate invoice");
        //To valdiate the charges added
        let closeJsonElem = await page.waitForSelector('#receivedMessageJson-7');
        let closeJson = await closeJsonElem.evaluate(el => el.textContent);
        let closeMessage = JSON.parse(closeJson);

        closeMessage.should.have.property('apiVersion').that.equals(1);
        closeMessage.should.have.property('method');
        ['update', 'close'].should.include(closeMessage.method);
        closeMessage.should.have.property('inventoryList');
        closeMessage.should.have.property('actions');
        //To Validate the return items added
        (closeMessage.actions[0]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[0]).should.have.property('action').that.equals('create');
        (closeMessage.actions[0]).should.have.property('invtype').that.equals('part_sn');
        (closeMessage.actions[0]).should.have.property('invpool').that.equals('deinstall');
        (closeMessage.actions[0].properties).should.have.property('part_item_number').that.equals('ECM300001~SN100');
        (closeMessage.actions[0].properties).should.have.property('part_item_revision').that.equals('A');
        (closeMessage.actions[0].properties).should.have.property('part_item_number_rev').that.equals('ECM300001');
        (closeMessage.actions[0].properties).should.have.property('part_item_desc').that.equals('Multi-Directional Joint assembly');
        (closeMessage.actions[0].properties).should.have.property('part_uom_code').that.equals('zzu');
        (closeMessage.actions[0].properties).should.have.property('part_disposition_code').that.equals('N');
        (closeMessage.actions[0].properties).should.have.property('part_service_activity_returned').that.equals('Return');
        (closeMessage.actions[0].properties).should.have.property('invsn').that.equals('SN100');

        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify({
            "apiVersion": 1,
            "method": "updateResult"
        }, 0, 4));
        await page.click(properties.SEND_MESSAGE);
        await helper.waitSeconds(3)

        closeJsonElem = await page.waitForSelector('#receivedMessageJson-8', { timeout: 10000 }).catch(() => null);
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

        //Screenshot of final screen
        await page.screenshot({path: 'WithReturnPartsWithSerializedInventory.png', fullPage: true});

    }));

    test('To validate add parts and return parts with serial number', (async function () {
        this.timeout(140000);

        let frameHandle = null;
        let frame = null;
        let menuButtonElem = null;
        let menuOptionWithCharges = null;
        let addPartOption = null, returnPartsOption = null;
        let submitButton = null, searchPart = null, searchPartResult = null, returnPart = null,
            returnPartSerialNumber = null;

        //To Open Activity
        //await helper.openNewActivity(page, openActivity);
        //To switch to frame
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        //menuButtonElem = await frame.waitForSelector('#menuButton1');
        await helper.waitSeconds(2);
        menuButtonElem = await frame.waitForSelector(properties.DASHBOARD_MENU);
        await frame.evaluate((el) => el.click(), menuButtonElem);
        await helper.waitSeconds(1);
        console.log("Select Main Menu");
        //To Add parts
        /* await frame.focus(properties.ADD_PART_SELECT);
         addPartOption = (await frame.$$('xpath/'+properties.ADD_PART_TYPE_SELECT))[0];
         await addPartOption.click({delay: 1000});*/
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);
        console.log("Selected menu to  Add Parts");
        await helper.waitSeconds(2);

        //Search using serial number
        searchPart = (await frame.$$('xpath/'+properties.ADD_PART_SEARCH))[0];
        await searchPart.type('SN005',{delay : 1000});
        await helper.waitSeconds(1);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(2);
        await frame.evaluate((el) => el.click(), searchPart);
        //await searchPart.click({delay: 1000});
        console.log("Search Parts to Add using serial number");
        await helper.waitSeconds(2);
        //Select the search result
        searchPartResult = await frame.waitForSelector(properties.ADD_PART_SEARCH_SELECT);
        await frame.evaluate((el) => el.click(), searchPartResult);
        //await searchPartResult.click({delay: 1000});
        console.log("Select Search Result");
        //Click on Submit Button
        await helper.waitSeconds(3);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        console.log("Submit Added part");
        //To add second part
        await helper.waitSeconds(3);
        menuOptionWithCharges = (await frame.$$('xpath/'+properties.SIDE_MENU_BUTTON))[0];
        //await menuOptionWithCharges.click({delay: 1000});
        await frame.evaluate((el) => el.click(), menuOptionWithCharges);
        await helper.waitSeconds(1);
        console.log("Select Return Parts using Side menu");
        /*returnPartsOption = (await frame.$$('xpath/'+properties.SIDE_MENU_RETURN_PART))[0];
        await returnPartsOption.click({delay: 1000});
        await helper.waitSeconds(1);*/
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);
        console.log("Add Parts Selected");
        searchPart = (await frame.$$('xpath/'+properties.ADD_PART_SEARCH))[0];
        await searchPart.type('ECM300001', {delay: 1000});
        await helper.waitSeconds(2);
        await page.keyboard.press('Enter', {delay: 2000});
        console.log("Search Parts to Add using Item");
        await helper.waitSeconds(2);
        //To Load the return parts searched
        const callProcedureMessageSearchInvJsonElem = await page.waitForSelector('#receivedMessageJson-6');
        const callProcedureMessageSearchInvJson = await callProcedureMessageSearchInvJsonElem.evaluate(el => el.textContent);
        const callProcedureMessageSearchInv = JSON.parse(callProcedureMessageSearchInvJson);

        callProcedureMessageSearchInv.should.have.property('apiVersion').that.equals(1);
        callProcedureMessageSearchInv.should.have.property('method').that.equals('callProcedure');
        callProcedureMessageSearchInv.should.have.property('callId');
        callProcedureMessageSearchInv.should.have.property('procedure').that.equals('searchParts');

        const callIdSearchInv = callProcedureMessageSearchInv.callId;
        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify({
            "apiVersion": 1,
            "method": "callProcedureResult",
            "callId": callIdSearchInv,
            "resultData": {
                "items": [
                    {
                        "catalogId": 599,
                        "itemId": 37294,
                        "label": "ECM300001",
                        "itemType": "part_sn",
                        "linkedItems": [],
                        "fields": {
                            "part_disposition_code": "",
                            "part_item_number": "ECM300001",
                            "part_item_revision": "A",
                            "part_item_desc": "Multi-Directional Joint assembly",
                            "part_uom_code": "zzu"
                        },
                        "images": []
                    }
                ],
                "isContinueAvailable": true,
                "source": "cache",
                "searchId": 1
            }
        }, 0, 4));
        await page.click('#sendMessageButton');
        await helper.waitSeconds(2);
        returnPart = (await frame.$$('xpath/'+properties.RETURN_PART_SEARCH_SELECT))[0];
        await frame.evaluate((el) => el.click(), returnPart);
        //await returnPart.click({delay: 1000});
        await helper.waitSeconds(2);
        console.log("Select return part");
        //Enter Serial Number
        returnPartSerialNumber = (await frame.$$('xpath/'+properties.RETURN_PART_SERIAL_NUMBER))[0];
        await returnPartSerialNumber.focus();
        await frame.evaluate((el) => el.click(), returnPartSerialNumber);
        console.log("Select the search result");
        //await returnPartSerialNumber.click();
        await page.keyboard.type('SN100',{delay : 1000});
        await helper.waitSeconds(1);
        await page.keyboard.press('Enter');
        //Submit Return Part
        await helper.waitSeconds(2);
        console.log("Enter serial number");
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(3);
        //To generate proforma invoice
        await helper.signAndSave(frame);
        console.log("Generate Invoice");
        //To validate the charges added
        closeJsonElem = await page.waitForSelector('#receivedMessageJson-7');
        let closeJson = await closeJsonElem.evaluate(el => el.textContent);
        let closeMessage = JSON.parse(closeJson);

        closeMessage.should.have.property('apiVersion').that.equals(1);
        closeMessage.should.have.property('method');
        ['update', 'close'].should.include(closeMessage.method);
        closeMessage.should.have.property('inventoryList');
        closeMessage.should.have.property('actions');

        (closeMessage.actions[0]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[0]).should.have.property('action').that.equals('install');

        (closeMessage.actions[0].properties).should.have.property('part_service_activity_used').that.equals('IN');
        (closeMessage.actions[0].properties).should.have.property('invsn').that.equals('SN005');

        (closeMessage.actions[1]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[1]).should.have.property('action').that.equals('create');
        (closeMessage.actions[1]).should.have.property('invtype').that.equals('part_sn');
        (closeMessage.actions[1]).should.have.property('invpool').that.equals('deinstall');
        (closeMessage.actions[1].properties).should.have.property('part_item_number').that.equals('ECM300001~SN100');
        (closeMessage.actions[1].properties).should.have.property('part_item_revision').that.equals('A');
        (closeMessage.actions[1].properties).should.have.property('part_item_number_rev').that.equals('ECM300001');
        (closeMessage.actions[1].properties).should.have.property('part_item_desc').that.equals('Multi-Directional Joint assembly');
        (closeMessage.actions[1].properties).should.have.property('part_uom_code').that.equals('zzu');
        (closeMessage.actions[1].properties).should.have.property('part_disposition_code').that.equals('N');
        (closeMessage.actions[1].properties).should.have.property('part_service_activity_returned').that.equals('Return');
        (closeMessage.actions[1].properties).should.have.property('invsn').that.equals('SN100');

        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify({
            "apiVersion": 1,
            "method": "updateResult"
        }, 0, 4));
        await page.click(properties.SEND_MESSAGE);
        await helper.waitSeconds(3)

        closeJsonElem = await page.waitForSelector('#receivedMessageJson-8', { timeout: 10000 }).catch(() => null);
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

        //To take screenshot of final screen
        await page.screenshot({path: 'WithMultipleInventoryWithAddAndReturnSRPart.png', fullPage: true});

    }));

    test('Validate adding multiple expense with decimals', (async function () {
        this.timeout(120000);

        let frameHandle = null;
        let frame = null;
        let menuButtonElem = null;
        let expenseAmount1 = null,expenseAmount1text = null;
        let report_totalAmount = null, report_totalAmounttext = null;
        let amount = null;
        let submitButton = null;
        let closeJsonElem = null, closeJson = null, closeMessage = null, menuOptionWithCharges = null;
        let totalamount = null , totalamounttext = null;

        //To Open Activity
        //await helper.openNewActivity(page, openActivity);
        //To switch to frame
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        await helper.waitSeconds(2);
        menuButtonElem = await frame.waitForSelector(properties.DASHBOARD_MENU);
        await frame.evaluate((el) => el.click(), menuButtonElem);
        await helper.waitSeconds(2);
        console.log("Select Main Menu");
        //To Add expense
        /*await frame.focus(properties.EXPENSE_SELECT);
         expenseOption = (await frame.$$('xpath/'+properties.EXPENSE_TYPE_SELECT))[0];
         await expenseOption.click({delay: 1000});
         await helper.waitSeconds(1);*/
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);
        console.log("Add First Expense in Main menu");
        /*billingType = await frame.waitForSelector('#oj-combobox-choice-activity a');
        await billingType.click({delay: 1000});

        await frame.click('#oj-listbox-results-activity > li:first-child');
        billingItem = await frame.waitForSelector('#oj-combobox-choice-laborItem a');
        await billingItem.click({delay: 5000});*/

        //await frame.click(properties.EXPENSE_AMOUNT);
        await frame.$eval(properties.EXPENSE_AMOUNT, el => el.click());
        amount = await frame.waitForSelector(properties.EXPENSE_AMOUNT);
        await amount.type("428.57",{delay: 1000});
        await page.keyboard.press('Enter');

        await helper.waitSeconds(3);
        console.log("Enter Expense Amount");
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(1);

        //To add second expense
        await helper.waitSeconds(3);
        //menuOptionWithCharges = (await frame.$$('xpath/'+properties.SIDE_MENU_BUTTON))[0];
        await frame.$eval(properties.SIDE_MENU_SELECT, el => el.click());
        //await menuOptionWithCharges.click({delay: 1000});
        await helper.waitSeconds(1);
        console.log("Select side menu");
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);
        console.log("Add First Expense in Main menu");
        /*billingItem = (await frame.$$('xpath/'+properties.SIDE_MENU_EXPENSE))[0];
        await billingItem.click({delay: 1000});
        await helper.waitSeconds(1);*/
        console.log("Select expense to add");
        //await frame.click(properties.EXPENSE_AMOUNT);
        await frame.$eval(properties.EXPENSE_AMOUNT, el => el.click());
        amount = await frame.waitForSelector(properties.EXPENSE_AMOUNT);
        await amount.type("1500", {delay: 1000});
        await page.keyboard.press('Enter');
        console.log("Enter Second Expense");
        await helper.waitSeconds(3);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(1);
        console.log("Submit second expense");
        //To add third expense
        await helper.waitSeconds(3);
        menuOptionWithCharges = (await frame.$$('xpath/'+properties.SIDE_MENU_BUTTON))[0];
        await frame.evaluate((el) => el.click(), menuOptionWithCharges);
        //await menuOptionWithCharges.click({delay: 1000});
        await helper.waitSeconds(1);
        console.log("Select side menu to add third expense");
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);
        /*billingItem = (await frame.$$('xpath/'+properties.SIDE_MENU_EXPENSE))[0];
        await billingItem.click({delay: 1000});
        await helper.waitSeconds(1);*/
        console.log("Search third expense to add");
        //await frame.click(properties.EXPENSE_AMOUNT);
        await frame.$eval(properties.EXPENSE_AMOUNT, el => el.click());
        amount = await frame.waitForSelector(properties.EXPENSE_AMOUNT);
        await amount.type("258", {delay: 1000});
        await page.keyboard.press('Enter');
        console.log("Enter Third expense amount");
        await helper.waitSeconds(3);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(1);
        console.log("Submit all expense");
        //To Generate Proforma invoice
        await helper.signAndSave(frame);
        console.log("Generate Invoice");
        //To Validate the details submitted
        closeJsonElem = await page.waitForSelector('#receivedMessageJson-6');
        closeJson = await closeJsonElem.evaluate(el => el.textContent);
        closeMessage = JSON.parse(closeJson);

        closeMessage.should.have.property('apiVersion').that.equals(1);
        closeMessage.should.have.property('method');
        ['update', 'close'].should.include(closeMessage.method);
        closeMessage.should.have.property('inventoryList');
        closeMessage.should.have.property('actions');

        (closeMessage.actions[0]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[0]).should.have.property('action').that.equals('create');
        (closeMessage.actions[0]).should.have.property('invpool').that.equals('install');
        (closeMessage.actions[0]).should.have.property('invtype').that.equals('expense');
        (closeMessage.actions[0].properties).should.have.property('expense_service_activity').that.equals('Expense');
        (closeMessage.actions[0].properties).should.have.property('expense_item_number').that.equals('prk');
        (closeMessage.actions[0].properties).should.have.property('expense_item_desc').that.equals('prk');
        (closeMessage.actions[0].properties).should.have.property('expense_amount').that.equals('428.57');
        (closeMessage.actions[0].properties).should.have.property('expense_currency_code').that.equals('USD');

        (closeMessage.actions[1]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[1]).should.have.property('action').that.equals('create');
        (closeMessage.actions[1]).should.have.property('invpool').that.equals('install');
        (closeMessage.actions[1]).should.have.property('invtype').that.equals('expense');
        (closeMessage.actions[1].properties).should.have.property('expense_service_activity').that.equals('Expense');
        (closeMessage.actions[1].properties).should.have.property('expense_item_number').that.equals('prk');
        (closeMessage.actions[1].properties).should.have.property('expense_item_desc').that.equals('prk');
        (closeMessage.actions[1].properties).should.have.property('expense_amount').that.equals('1500');
        (closeMessage.actions[1].properties).should.have.property('expense_currency_code').that.equals('USD');

        (closeMessage.actions[2]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[2]).should.have.property('action').that.equals('create');
        (closeMessage.actions[2]).should.have.property('invpool').that.equals('install');
        (closeMessage.actions[2]).should.have.property('invtype').that.equals('expense');
        (closeMessage.actions[2].properties).should.have.property('expense_service_activity').that.equals('Expense');
        (closeMessage.actions[2].properties).should.have.property('expense_item_number').that.equals('prk');
        (closeMessage.actions[2].properties).should.have.property('expense_item_desc').that.equals('prk');
        (closeMessage.actions[2].properties).should.have.property('expense_amount').that.equals('258');
        (closeMessage.actions[2].properties).should.have.property('expense_currency_code').that.equals('USD');

        totalamount = (await frame.$$('xpath/'+properties.TOTAL_AMOUNT))[0];
        totalamounttext = await totalamount.evaluate(el => el.innerText);
        totalamounttext.should.contain('Total');
        totalamounttext.should.contain('$');
        totalamounttext.should.contain('2186.57');
        //To take screenshot of final screen
        expenseAmount1 = (await frame.$$('xpath/'+properties.TIME_LABOR_REPORT_EXPENSE_1))[0];
        expenseAmount1text = await expenseAmount1.evaluate(el => el.innerText);
        expenseAmount1text.should.contain('Parking Charges for Service');
        expenseAmount1text.should.contain('$');
        expenseAmount1text.should.contain('428.57');

        expenseAmount2 = (await frame.$$('xpath/'+properties.TIME_LABOR_REPORT_EXPENSE_1))[1];
        expenseAmount2text = await expenseAmount2.evaluate(el => el.innerText);
        expenseAmount2text.should.contain('Parking');


        report_totalAmount = (await frame.$$('xpath/'+properties.TIME_LABOR_REPORT_TOTAL))[0];
        report_totalAmounttext = await report_totalAmount.evaluate(el => el.innerText);
        report_totalAmounttext.should.contain('Total:');

        report_totalAmount1 = (await frame.$$('xpath/'+properties.TIME_LABOR_REPORT_TOTAL))[1];
        report_totalAmounttext1 = await report_totalAmount1.evaluate(el => el.innerText);
        report_totalAmounttext1.should.contain('$');

        report_totalAmount2 = (await frame.$$('xpath/'+properties.TIME_LABOR_REPORT_TOTAL))[2];
        report_totalAmounttext2 = await report_totalAmount2.evaluate(el => el.innerText);
        report_totalAmounttext2.should.contain('2186.57');

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

        await page.screenshot({path: 'WithExpense.png', fullPage: true});

    }));

    test('Validate the page by adding labor with decimal', (async function () {
        this.timeout(70000);

        let frameHandle = null;
        let frame = null;
        let menuButtonElem = null;
        let laborOption = null;
        let billingType = null, billingItem = null;
        let inputStartTime = null, inputEndTime = null;
        let submitButton = null;
        let menuAddedReturnPart = null, menuAddedReturnPartText = null,label_DESCRIPTION = null,labelDescriptionText = null,label_DESCRIPTION_VALUE = null,labelDescriptionValueText = null;
        //To switch to frame
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        await helper.waitSeconds(2);
        menuButtonElem = await frame.waitForSelector(properties.DASHBOARD_MENU);
        await frame.evaluate((el) => el.click(), menuButtonElem);
        await helper.waitSeconds(1);
        console.log("Select Main Menu");
        //To Add Labor Charge
        laborOption = await frame.waitForSelector(properties.LABOR_SELECT);
        await frame.evaluate((el) => el.click(), laborOption);
        await helper.waitSeconds(2);
        console.log("To Add Labor Charge");
        billingType = await frame.waitForSelector(properties.BILLING_TYPE_SELECT);
        await billingType.click();
        await helper.waitSeconds(1);
        console.log("Select Billing Type Select");
        //await frame.click(properties.BILLING_TYPE_1);
        await frame.$eval(properties.BILLING_TYPE_1, el => el.click());
        console.log("Select Billing Type");

        await helper.waitSeconds(2);
        billingItem = await frame.waitForSelector(properties.BILLING_LABOR_ITEM_SELECT);
        await billingItem.click();
        await helper.waitSeconds(1);
        console.log("Select Labor Item Type");
        await frame.$eval(properties.BILLING_LABOR_ITEM_1, el => el.click());
        await helper.waitSeconds(2);
        console.log("Select BILLING_LABOR_ITEM");

        label_DESCRIPTION =  (await frame.$$('xpath/'+properties.LABEL_DESCRIPTION))[0];
        labelDescriptionText = await label_DESCRIPTION.evaluate(el => el.innerText);
        labelDescriptionText.should.contain('Description');

        label_DESCRIPTION_VALUE =  (await frame.$$('xpath/'+properties.LABOR_DESC_VALUE))[0];
        labelDescriptionValueText = await label_DESCRIPTION_VALUE.evaluate(el => el.value);
        labelDescriptionValueText.should.contain('FS Overtime Labor');

        inputStartTime = await frame.waitForSelector(properties.LABOR_START_TIME);
        await frame.$eval(properties.LABOR_START_TIME, el => el.click());
        await inputStartTime.type('7:00 AM', {delay: 1000});
        await helper.waitSeconds(1);
        await page.keyboard.press('Tab');
        console.log("Enter Start Time");

        inputEndTime = await frame.waitForSelector(properties.LABOR_END_TIME);
        await frame.$eval(properties.LABOR_END_TIME, el => el.click());
        await inputEndTime.type('8:35 AM', {delay: 1000});
        await helper.waitSeconds(2);
        await page.keyboard.press('Tab');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Tab');
        console.log("Enter End Time");

        let durationValue = null , label_DURATION = null , durationValueText = null , labelDurationText = null;
        durationValue =  (await frame.$$('xpath/'+properties.DURATION_VALUE))[0];
        durationValueText = await durationValue.evaluate(el => el.value);
        durationValueText.should.contain('1 Hour 35 Minutes');

        label_DURATION =  (await frame.$$('xpath/'+properties.LABEL_DURATION))[0];
        labelDurationText = await label_DURATION.evaluate(el => el.innerText);
        labelDurationText.should.contain('Duration');

        await helper.waitSeconds(2);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(3);

        menuAddedReturnPart = (await frame.$$('xpath/'+properties.ADDED_PART))[0];
        menuAddedReturnPartText = await menuAddedReturnPart.evaluate(el => el.innerText);
        menuAddedReturnPartText.should.contain('1 Hour 35 Minutes');
        await helper.signAndSave(frame);
        console.log("Generate Invoice");
        //To Validate the details submitted
        closeJsonElem = await page.waitForSelector('#receivedMessageJson-6');
        closeJson = await closeJsonElem.evaluate(el => el.textContent);
        closeMessage = JSON.parse(closeJson);

        closeMessage.should.have.property('apiVersion').that.equals(1);
        closeMessage.should.have.property('method');
        ['update', 'close'].should.include(closeMessage.method);
        closeMessage.should.have.property('inventoryList');
        closeMessage.should.have.property('actions');

        (closeMessage.actions[0]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[0]).should.have.property('action').that.equals('create');
        (closeMessage.actions[0]).should.have.property('invpool').that.equals('install');
        (closeMessage.actions[0]).should.have.property('invtype').that.equals('labor');
        (closeMessage.actions[0].properties).should.have.property('labor_service_activity').that.equals('com');
        (closeMessage.actions[0].properties).should.have.property('labor_item_number').that.equals('FS Overtime Labor');
        (closeMessage.actions[0].properties).should.have.property('labor_item_desc').that.equals('FS Overtime Labor');
        const normalizeTime = (t) => t.replace(/\+.*$|Z$/, '');

        // Compare normalized times
        normalizeTime(closeMessage.actions[0].properties.labor_start_time)
            .should.equal('T07:00:00');
        normalizeTime(closeMessage.actions[0].properties.labor_end_time)
            .should.equal('T08:35:00');

        laborAmount_Report1 = (await frame.$$('xpath/'+properties.TIME_LABOR_REPORT_LABOR_1))[0];
        laborAmount_Report1Text = await laborAmount_Report1.evaluate(el => el.innerText);
        laborAmount_Report1Text.should.contain('Overtime Labor (Hours)');
        laborAmount_Report1Text.should.contain('1 Hour 35 Minutes');

        laborAmount_Report2 = (await frame.$$('xpath/'+properties.TIME_LABOR_REPORT_LABOR_1))[1];
        laborAmount_Report2Text = await laborAmount_Report2.evaluate(el => el.innerText);
        laborAmount_Report2Text.should.contain('FS Overtime Labor');

        report_totalAmount = (await frame.$$('xpath/'+properties.TIME_LABOR_TOTAL))[0];
        report_totalAmounttext = await report_totalAmount.evaluate(el => el.innerText);
        report_totalAmounttext.should.contain('Total:');

        report_totalAmount1 = (await frame.$$('xpath/'+properties.TIME_LABOR_TOTAL))[1];
        report_totalAmounttext1 = await report_totalAmount1.evaluate(el => el.innerText);
        report_totalAmounttext1.should.contain('1 Hour 35 Minutes');

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

        await page.screenshot({path: 'WithLabor.png', fullPage: true});

    }));

    test('Validate after adding new Expense  only the Expense Details are shown in the dashboard and other charges should not be shown.(autoPopulateLabor - false)', (async function () {
        //await helper.openNewActivity(page, openActivity);
        this.timeout(60000);

        let frameHandle = null;
        let frame = null;
        let menuButtonElem = null;
        let amount = null;
        let submitButton = null;

        //To switch to frame
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        await helper.waitSeconds(2);
        menuButtonElem = await frame.waitForSelector(properties.DASHBOARD_MENU);
        await frame.evaluate((el) => el.click(), menuButtonElem);
        await helper.waitSeconds(1);
        console.log("Select Main Menu");
        //To Add expense
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);
        console.log("Add Expense");

        await frame.$eval(properties.EXPENSE_AMOUNT, el => el.click());
        amount = await frame.waitForSelector(properties.EXPENSE_AMOUNT);
        await amount.type("50", {delay: 1000});
        await page.keyboard.press('Enter');
        console.log("Add Expense Amount");
        await helper.waitSeconds(2);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(2);

        global_body = (await frame.$$('xpath/'+properties.GLOBAL_BODY))[0];
        global_bodyText = await global_body.evaluate(el => el.innerText);
        await global_bodyText.should.contain('Expenses');
        await global_bodyText.should.not.contain('Labor');
        await global_bodyText.should.not.contain('Added Parts');
        await global_bodyText.should.not.contain('Return Parts');

        //To take screenshot of final screen
        await page.screenshot({path: 'WithExpense.png', fullPage: true});

    }));

    test('Validate dashboard adding only Add Parts and other Charges should not be shown. (autoPopulateLabor - false)', (async function () {
        this.timeout(120000);

        let frameHandle = null;
        let frame = null;
        let menuButtonElem = null;
        let submitButton = null, searchPart = null;

        //To switch to frame
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        await helper.waitSeconds(2);
        menuButtonElem = await frame.waitForSelector(properties.DASHBOARD_MENU);
        await frame.evaluate((el) => el.click(), menuButtonElem);
        await helper.waitSeconds(2);
        console.log("Select Main Menu");
        //To Add parts
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);

        console.log("Select Add Parts menu option");
        //Search using serial number
        searchPart = (await frame.$$('xpath/'+properties.ADD_PART_SEARCH))[0];
        await searchPart.type('SN005',{delay : 1000});
        await page.keyboard.press('Enter');
        await helper.waitSeconds(2);
        await frame.evaluate((el) => el.click(), searchPart);
        console.log("Search Add Parts using Serial Number");
        //Select the search result
        await frame.$eval(properties.ADD_PART_SEARCH_SELECT, el => el.click());

        //Click on Submit Button
        await helper.waitSeconds(3);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        console.log("Add First part");

        // Waiting for "Added Parts" heading to appear before asserting ***
        await frame.waitForSelector('#addedPartsHeading', { timeout: 10000 });
        global_body = (await frame.$$('xpath/'+properties.GLOBAL_BODY))[0];
        global_bodyText = await global_body.evaluate(el => el.innerText);
        await global_bodyText.should.contain('Added Parts');
        await global_bodyText.should.not.contain('Labor');
        await global_bodyText.should.not.contain('Expenses');
        await global_bodyText.should.not.contain('Return Parts');

        //To take screenshot of final screen
        await page.screenshot({path: 'WithDuplicateInventoryError.png', fullPage: true});

    }));

    test('Validate dashboard adding only Return Parts  and  other Charges should not be shown.(autoPopulateLabor - false)', (async function () {
        //await helper.openNewActivity(page, openActivity);
        this.timeout(120000);

        let frameHandle = null;
        let frame = null;
        let menuButtonElem = null;
        let submitButton = null, searchPart = null, returnPart = null,
            returnPartSerialNumber = null;

        //To switch to frame
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        await helper.waitSeconds(2);
        menuButtonElem = await frame.waitForSelector(properties.DASHBOARD_MENU);
        await frame.evaluate((el) => el.click(), menuButtonElem);
        await helper.waitSeconds(2);
        console.log("Select Main Menu");
        //To Return parts
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);
        console.log("Select Return Part");
        searchPart = (await frame.$$('xpath/'+properties.ADD_PART_SEARCH))[0];
        //Search Serialized inventory
        await searchPart.type('ECM300001', {delay: 1000});
        await page.keyboard.press('Enter');
        await helper.waitSeconds(2);
        console.log("Search Parts to Return using Item");
        //To Load the Search result of Serialized inventory
        const callProcedureMessageSearchInvJsonElem = await page.waitForSelector('#receivedMessageJson-6');
        const callProcedureMessageSearchInvJson = await callProcedureMessageSearchInvJsonElem.evaluate(el => el.textContent);
        const callProcedureMessageSearchInv = JSON.parse(callProcedureMessageSearchInvJson);

        callProcedureMessageSearchInv.should.have.property('apiVersion').that.equals(1);
        callProcedureMessageSearchInv.should.have.property('method').that.equals('callProcedure');
        callProcedureMessageSearchInv.should.have.property('callId');
        callProcedureMessageSearchInv.should.have.property('procedure').that.equals('searchParts');

        const callIdSearchInv = callProcedureMessageSearchInv.callId;

        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify({
            "apiVersion": 1,
            "method": "callProcedureResult",
            "callId": callIdSearchInv,
            "resultData": {
                "items": [
                    {
                        "catalogId": 599,
                        "itemId": 37294,
                        "label": "ECM300001",
                        "itemType": "part_sn",
                        "linkedItems": [],
                        "fields": {
                            "part_disposition_code": "",
                            "part_item_number": "ECM300001",
                            "part_item_revision": "A",
                            "part_item_desc": "Multi-Directional Joint assembly",
                            "part_uom_code": "zzu"
                        },
                        "images": []
                    }
                ],
                "isContinueAvailable": true,
                "source": "cache",
                "searchId": 1
            }
        }, 0, 4));
        await page.click('#sendMessageButton');
        await helper.waitSeconds(2);
        //To Select the search result
        returnPart = (await frame.$$('xpath/'+properties.RETURN_PART_SEARCH_SELECT))[0];
        await frame.evaluate((el) => el.click(), returnPart);
        console.log("Select Search Result");
        //Enter Serial Number
        returnPartSerialNumber = (await frame.$$('xpath/'+properties.RETURN_PART_SERIAL_NUMBER))[0];

        await returnPartSerialNumber.focus();
        await frame.evaluate((el) => el.click(), returnPartSerialNumber);
        await helper.waitSeconds(2);
        //await returnPartSerialNumber.click();
        await page.keyboard.type('SN100',{delay : 1000});
        await helper.waitSeconds(2);
        await page.keyboard.press('Enter');
        console.log("Enter serial number");
        //Submit Return Part
        await helper.waitSeconds(2);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(3);
        console.log("Submit Return part");

        global_body = (await frame.$$('xpath/'+properties.GLOBAL_BODY))[0];
        global_bodyText = await global_body.evaluate(el => el.innerText);
        await global_bodyText.should.contain('Returned Parts');
        await global_bodyText.should.not.contain('Labor');
        await global_bodyText.should.not.contain('Expenses');
        await global_bodyText.should.not.contain('Added Parts');

        //Screenshot of final screen
        await page.screenshot({path: 'WithReturnPartsWithSerializedInventory.png', fullPage: true});

    }));

    test('Validate the added Charges corresponding to Expense is getting displayed in sorted order based on Billing Item', (async function () {
        //await helper.openNewActivity(page, openActivity);

        this.timeout(120000);

        let frameHandle = null;
        let frame = null;
        let menuButtonElem = null;
        let amount = null;
        let submitButton = null;

        //To switch to frame
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        await helper.waitSeconds(2);
        menuButtonElem = await frame.waitForSelector(properties.DASHBOARD_MENU);
        await frame.evaluate((el) => el.click(), menuButtonElem);
        await helper.waitSeconds(1);
        console.log("Select Main Menu");
        //To Add expense
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);
        console.log("Add Expense");

        await frame.$eval(properties.EXPENSE_AMOUNT, el => el.click());
        amount = await frame.waitForSelector(properties.EXPENSE_AMOUNT);
        await amount.type("50.33", {delay: 1000});
        await page.keyboard.press('Enter');
        console.log("Add Expense Amount");
        await helper.waitSeconds(2);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(2);

        await frame.waitForSelector(properties.SIDE_MENU_SELECT);
        await frame.$eval(properties.SIDE_MENU_SELECT, el => el.click());

        await helper.waitSeconds(1);
        console.log("Select side menu");
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);
        console.log("To Add Labor Charge");
        await helper.waitSeconds(5);
        console.log("Add Expense");

        await helper.waitSeconds(2);
        billingItem = await frame.waitForSelector(properties.BILLING_LABOR_ITEM_SELECT);
        await billingItem.click();
        await helper.waitSeconds(1);
        console.log("Select Labor Item Type");
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);

        await frame.$eval(properties.EXPENSE_AMOUNT, el => el.click());
        amount = await frame.waitForSelector(properties.EXPENSE_AMOUNT);
        await amount.type("70.01", {delay: 1000});
        await page.keyboard.press('Enter');
        console.log("Add Expense Amount");
        await helper.waitSeconds(2);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);


        await frame.waitForSelector(properties.SIDE_MENU_SELECT);
        await frame.$eval(properties.SIDE_MENU_SELECT, el => el.click());
        //await menuOptionWithCharges.click({delay: 1000});
        await helper.waitSeconds(1);
        console.log("Select side menu");
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);
        console.log("To Add Labor Charge");
        await helper.waitSeconds(5);
        console.log("Add Expense");

        await helper.waitSeconds(2);
        billingItem = await frame.waitForSelector(properties.BILLING_LABOR_ITEM_SELECT);
        await billingItem.click();
        await helper.waitSeconds(1);
        console.log("Select Labor Item Type");
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);


        await frame.$eval(properties.EXPENSE_AMOUNT, el => el.click());
        amount = await frame.waitForSelector(properties.EXPENSE_AMOUNT);
        await amount.type("60.99", {delay: 1000});
        await page.keyboard.press('Enter');
        console.log("Add Expense Amount");
        await helper.waitSeconds(2);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);

        await helper.waitSeconds(2);

        labelExpenseBillingItem =  (await frame.$$('xpath/'+properties.DASHBOARD_EXPENSE))[0];
        labelExpenseBillingItemText = await labelExpenseBillingItem.evaluate(el => el.innerText);
        labelExpenseBillingItemText.should.contain('FS Toll');
        labelExpenseBillingItemText.should.contain('Expense');
        labelExpenseBillingItemText.should.contain('$');
        labelExpenseBillingItemText.should.contain('60.99');

        labelExpenseBillingItem =  (await frame.$$('xpath/'+properties.DASHBOARD_EXPENSE))[1];
        labelExpenseBillingItemText = await labelExpenseBillingItem.evaluate(el => el.innerText);
        labelExpenseBillingItemText.should.contain('Parking');
        labelExpenseBillingItemText.should.contain('Expense');
        labelExpenseBillingItemText.should.contain('$');
        labelExpenseBillingItemText.should.contain('50.33');

        labelExpenseBillingItem =  (await frame.$$('xpath/'+properties.DASHBOARD_EXPENSE))[2];
        labelExpenseBillingItemText = await labelExpenseBillingItem.evaluate(el => el.innerText);
        labelExpenseBillingItemText.should.contain('Toll Charges');
        labelExpenseBillingItemText.should.contain('Expense');
        labelExpenseBillingItemText.should.contain('$');
        labelExpenseBillingItemText.should.contain('70.01');

        //To take screenshot of final page
        await page.screenshot({path: 'WithLabor.png', fullPage: true});


    }));

    test('Validate the added Charges corresponding to Expense is getting displayed in sorted order based on Billing Type', (async function () {
        //await helper.openNewActivity(page, openActivity);

        this.timeout(120000);

        let frameHandle = null;
        let frame = null;
        let menuButtonElem = null;
        let amount = null;
        let submitButton = null;

        //To switch to frame
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        await helper.waitSeconds(2);
        menuButtonElem = await frame.waitForSelector(properties.DASHBOARD_MENU);
        await frame.evaluate((el) => el.click(), menuButtonElem);
        await helper.waitSeconds(1);
        console.log("Select Main Menu");
        //To Add expense
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);
        console.log("Add Expense");

        await frame.$eval(properties.EXPENSE_AMOUNT, el => el.click());
        amount = await frame.waitForSelector(properties.EXPENSE_AMOUNT);
        await amount.type("990.99", {delay: 1000});
        await page.keyboard.press('Enter');
        console.log("Add Expense Amount");
        await helper.waitSeconds(2);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(2);

        await frame.waitForSelector(properties.SIDE_MENU_SELECT);
        await frame.$eval(properties.SIDE_MENU_SELECT, el => el.click());
        await helper.waitSeconds(1);
        console.log("Select side menu");
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);
        console.log("To Add Labor Charge");
        await helper.waitSeconds(5);
        console.log("Add Expense");

        await helper.waitSeconds(2);
        billingItem = await frame.waitForSelector(properties.BILLING_TYPE_SELECT);
        await billingItem.click();
        await helper.waitSeconds(1);
        console.log("Select Labor Item Type");
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);

        await frame.$eval(properties.EXPENSE_AMOUNT, el => el.click());
        amount = await frame.waitForSelector(properties.EXPENSE_AMOUNT);
        await amount.type("70.91", {delay: 1000});
        await page.keyboard.press('Enter');
        console.log("Add Expense Amount");
        await helper.waitSeconds(2);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);

        await frame.waitForSelector(properties.SIDE_MENU_SELECT);
        await frame.$eval(properties.SIDE_MENU_SELECT, el => el.click());
        await helper.waitSeconds(1);
        console.log("Select side menu");
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);
        console.log("To Add Labor Charge");
        await helper.waitSeconds(5);
        console.log("Add Expense");

        await helper.waitSeconds(2);
        billingItem = await frame.waitForSelector(properties.BILLING_TYPE_SELECT);
        await billingItem.click();
        await helper.waitSeconds(1);
        console.log("Select Labor Item Type");
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);

        await frame.$eval(properties.EXPENSE_AMOUNT, el => el.click());
        amount = await frame.waitForSelector(properties.EXPENSE_AMOUNT);
        await amount.type("600.01", {delay: 1000});
        await page.keyboard.press('Enter');
        console.log("Add Expense Amount");
        await helper.waitSeconds(2);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);

        await helper.waitSeconds(2);

        labelExpenseBillingItem =  (await frame.$$('xpath/'+properties.DASHBOARD_EXPENSE))[0];
        labelExpenseBillingItemText = await labelExpenseBillingItem.evaluate(el => el.innerText);
        labelExpenseBillingItemText.should.contain('Parking');
        labelExpenseBillingItemText.should.contain('Expense');
        labelExpenseBillingItemText.should.contain('$');
        labelExpenseBillingItemText.should.contain('990.99');

        labelExpenseBillingItem =  (await frame.$$('xpath/'+properties.DASHBOARD_EXPENSE))[1];
        labelExpenseBillingItemText = await labelExpenseBillingItem.evaluate(el => el.innerText);
        labelExpenseBillingItemText.should.contain('Parking');
        labelExpenseBillingItemText.should.contain('Travel');
        labelExpenseBillingItemText.should.contain('$');
        labelExpenseBillingItemText.should.contain('70.91');

        labelExpenseBillingItem =  (await frame.$$('xpath/'+properties.DASHBOARD_EXPENSE))[2];
        labelExpenseBillingItemText = await labelExpenseBillingItem.evaluate(el => el.innerText);
        labelExpenseBillingItemText.should.contain('Parking');
        labelExpenseBillingItemText.should.contain('Miscellaneous');
        labelExpenseBillingItemText.should.contain('$');
        labelExpenseBillingItemText.should.contain('600.01');

        //To take screenshot of final page
        await page.screenshot({path: 'WithLabor.png', fullPage: true});


    }));

    test('Valdiate the added details corresponding to Labor/Expense/Add Parts and Return Parts  are shown in the sorted order in Proforma Invoice.', (async function () {
        //await helper.openNewActivity(page, openActivity);
        this.timeout(200000);

        let frameHandle = null;
        let frame = null;
        let menuButtonElem = null;
        let laborOption = null;
        let billingItem = null;
        let inputStartTime = null, inputEndTime = null;
        let submitButton = null;

        //To switch to frame
        frameHandle = await page.$(properties.PLUGIN_FRAME);
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        await helper.waitSeconds(2);
        menuButtonElem = await frame.waitForSelector(properties.DASHBOARD_MENU);
        await frame.evaluate((el) => el.click(), menuButtonElem);
        await helper.waitSeconds(1);
        console.log("Select Main Menu");
        //To Add Labor Charge
        laborOption = await frame.waitForSelector(properties.LABOR_SELECT);
        await frame.evaluate((el) => el.click(), laborOption);
        await helper.waitSeconds(2);
        console.log("To Add Labor Charge");

        await helper.waitSeconds(2);
        billingItem = await frame.waitForSelector(properties.LABOR_ITEM_SELECT);
        await billingItem.click();
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);

        console.log("Select BILLING_LABOR_ITEM");
        inputStartTime = await frame.waitForSelector(properties.LABOR_START_TIME);
        await frame.$eval(properties.LABOR_START_TIME, el => el.click());
        await inputStartTime.type('7:00 AM', {delay: 1000});
        await helper.waitSeconds(1);
        await page.keyboard.press('Tab');
        console.log("Enter Start Time");

        inputEndTime = await frame.waitForSelector(properties.LABOR_END_TIME);
        await frame.$eval(properties.LABOR_END_TIME, el => el.click());
        await inputEndTime.type('8:01 AM', {delay: 1000});
        await helper.waitSeconds(2);
        await page.keyboard.press('Tab');
        console.log("Enter End Time");

        await helper.waitSeconds(2);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(3);

        await frame.waitForSelector(properties.SIDE_MENU_SELECT);
        await frame.$eval(properties.SIDE_MENU_SELECT, el => el.click());

        await helper.waitSeconds(1);
        console.log("Select side menu");
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);
        console.log("To Add Labor Charge");
        await helper.waitSeconds(5);

        inputStartTime = await frame.waitForSelector(properties.LABOR_START_TIME);
        await frame.$eval(properties.LABOR_START_TIME, el => el.click());
        await inputStartTime.type('7:00 AM', {delay: 1000});
        await helper.waitSeconds(1);
        await page.keyboard.press('Tab');
        console.log("Enter Start Time");

        inputEndTime = await frame.waitForSelector(properties.LABOR_END_TIME);
        await frame.$eval(properties.LABOR_END_TIME, el => el.click());
        await inputEndTime.type('8:30 AM', {delay: 1000});
        await helper.waitSeconds(2);
        await page.keyboard.press('Tab');
        console.log("Enter End Time");

        await helper.waitSeconds(2);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(3);

        //Expenses
        await frame.waitForSelector(properties.SIDE_MENU_SELECT);
        await frame.$eval(properties.SIDE_MENU_SELECT, el => el.click());

        await helper.waitSeconds(1);
        console.log("Select side menu");
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);
        console.log("To Add Labor Charge");
        await helper.waitSeconds(5);
        console.log("Add Expense");

        await helper.waitSeconds(2);
        billingItem = await frame.waitForSelector(properties.BILLING_LABOR_ITEM_SELECT);
        await billingItem.click();
        await helper.waitSeconds(1);
        console.log("Select Labor Item Type");
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);

        await frame.$eval(properties.EXPENSE_AMOUNT, el => el.click());
        amount = await frame.waitForSelector(properties.EXPENSE_AMOUNT);
        await amount.type("70.11", {delay: 1000});
        await page.keyboard.press('Enter');
        console.log("Add Expense Amount");
        await helper.waitSeconds(2);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);


        await frame.waitForSelector(properties.SIDE_MENU_SELECT);
        await frame.$eval(properties.SIDE_MENU_SELECT, el => el.click());
        await helper.waitSeconds(1);
        console.log("Select side menu");
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);
        console.log("To Add Labor Charge");
        await helper.waitSeconds(5);
        console.log("Add Expense");

        await helper.waitSeconds(2);
        billingItem = await frame.waitForSelector(properties.BILLING_LABOR_ITEM_SELECT);
        await billingItem.click();
        await helper.waitSeconds(1);
        console.log("Select Labor Item Type");
        await helper.waitSeconds(3);
        await page.keyboard.press('ArrowDown');
        await helper.waitSeconds(3);
        await page.keyboard.press('Enter');
        await helper.waitSeconds(3);


        await frame.$eval(properties.EXPENSE_AMOUNT, el => el.click());
        amount = await frame.waitForSelector(properties.EXPENSE_AMOUNT);
        await amount.type("60.99", {delay: 1000});
        await page.keyboard.press('Enter');
        console.log("Add Expense Amount");
        await helper.waitSeconds(2);
        submitButton = (await frame.$$('xpath/'+properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        //Expenses
        await helper.waitSeconds(3);
        await helper.signAndSave(frame);

        timeSpentData =  (await frame.$$('xpath/'+properties.TIME_SPENT_DATA))[0];
        timeSpentDataText = await timeSpentData.evaluate(el => el.innerText);
        timeSpentDataText.should.contain('Time Spent');

        timeSpentData =  (await frame.$$('xpath/'+properties.TIME_SPENT_DATA))[1];
        timeSpentDataText = await timeSpentData.evaluate(el => el.innerText);
        timeSpentDataText.should.contain('Overtime Labor (Hours)');
        timeSpentDataText.should.contain('FS Overtime Labor');
        timeSpentDataText.should.contain('07:00 AM');
        timeSpentDataText.should.contain('08:30 AM');
        timeSpentDataText.should.contain('1 Hour 30 Minutes');

        timeSpentData =  (await frame.$$('xpath/'+properties.TIME_SPENT_DATA))[2];
        timeSpentDataText = await timeSpentData.evaluate(el => el.innerText);
        timeSpentDataText.should.contain('Labor Hours Spent');
        timeSpentDataText.should.contain('Labor Hours');
        timeSpentDataText.should.contain('07:00 AM');
        timeSpentDataText.should.contain('08:01 AM');
        timeSpentDataText.should.contain('1 Hour 1 Minute');

        timeSpentData =  (await frame.$$('xpath/'+properties.TIME_SPENT_DATA))[3];
        timeSpentDataText = await timeSpentData.evaluate(el => el.innerText);
        timeSpentDataText.should.contain('Total:');
        timeSpentDataText.should.contain('2 Hours 31 Minutes');

        expenseData =  (await frame.$$('xpath/'+properties.EXPENSE_DATA))[0];
        expenseDataText = await expenseData.evaluate(el => el.innerText);
        expenseDataText.should.contain('Expenses');

        expenseData =  (await frame.$$('xpath/'+properties.EXPENSE_DATA))[1];
        expenseDataText = await expenseData.evaluate(el => el.innerText);
        expenseDataText.should.contain('Toll Charges');
        expenseDataText.should.contain('FS Toll');
        expenseDataText.should.contain('$');
        expenseDataText.should.contain('60.99');

        expenseData =  (await frame.$$('xpath/'+properties.EXPENSE_DATA))[2];
        expenseDataText = await expenseData.evaluate(el => el.innerText);
        expenseDataText.should.contain('Toll Charges for Service');
        expenseDataText.should.contain('Toll Charges');
        expenseDataText.should.contain('$');
        expenseDataText.should.contain('70.11');

        expenseData =  (await frame.$$('xpath/'+properties.EXPENSE_DATA))[3];
        expenseDataText = await expenseData.evaluate(el => el.innerText);
        expenseDataText.should.contain('Total:');
        expenseDataText.should.contain('$');
        expenseDataText.should.contain('131.10');

        closeJsonElem = await page.waitForSelector('#receivedMessageJson-6');
        closeJson = await closeJsonElem.evaluate(el => el.textContent);
        closeMessage = JSON.parse(closeJson);

        closeMessage.should.have.property('apiVersion').that.equals(1);
        closeMessage.should.have.property('method');
        ['update', 'close'].should.include(closeMessage.method);
        closeMessage.should.have.property('inventoryList');
        closeMessage.should.have.property('actions');

        const normalizeTime = (t) => t.replace(/\+.*$|Z$/, '');

        (closeMessage.actions[0]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[0]).should.have.property('action').that.equals('create');
        (closeMessage.actions[0]).should.have.property('invpool').that.equals('install');
        (closeMessage.actions[0]).should.have.property('invtype').that.equals('labor');
        (closeMessage.actions[0].properties).should.have.property('labor_service_activity').that.equals('Labor');
        (closeMessage.actions[0].properties).should.have.property('labor_item_number').that.equals('FS Overtime Labor');
        (closeMessage.actions[0].properties).should.have.property('labor_item_desc').that.equals('FS Overtime Labor');
        normalizeTime(closeMessage.actions[0].properties.labor_start_time)
            .should.equal('T07:00:00');
        normalizeTime(closeMessage.actions[0].properties.labor_end_time)
            .should.equal('T08:30:00');

        (closeMessage.actions[1]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[1]).should.have.property('action').that.equals('create');
        (closeMessage.actions[1]).should.have.property('invpool').that.equals('install');
        (closeMessage.actions[1]).should.have.property('invtype').that.equals('labor');
        (closeMessage.actions[1].properties).should.have.property('labor_service_activity').that.equals('Labor');
        (closeMessage.actions[1].properties).should.have.property('labor_item_number').that.equals('Labor Time');
        (closeMessage.actions[1].properties).should.have.property('labor_item_desc').that.equals('Labor Time');
        normalizeTime(closeMessage.actions[1].properties.labor_start_time)
            .should.equal('T07:00:00');
        normalizeTime(closeMessage.actions[1].properties.labor_end_time)
            .should.equal('T08:01:00');

        (closeMessage.actions[2]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[2]).should.have.property('action').that.equals('create');
        (closeMessage.actions[2]).should.have.property('invpool').that.equals('install');
        (closeMessage.actions[2]).should.have.property('invtype').that.equals('expense');
        (closeMessage.actions[2].properties).should.have.property('expense_service_activity').that.equals('Expense');
        (closeMessage.actions[2].properties).should.have.property('expense_item_number').that.equals('FS Toll');
        (closeMessage.actions[2].properties).should.have.property('expense_item_desc').that.equals('FS Toll');
        (closeMessage.actions[2].properties).should.have.property('expense_amount').that.equals('60.99');
        (closeMessage.actions[2].properties).should.have.property('expense_currency_code').that.equals('USD');

        (closeMessage.actions[3]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[3]).should.have.property('action').that.equals('create');
        (closeMessage.actions[3]).should.have.property('invpool').that.equals('install');
        (closeMessage.actions[3]).should.have.property('invtype').that.equals('expense');
        (closeMessage.actions[3].properties).should.have.property('expense_service_activity').that.equals('Expense');
        (closeMessage.actions[3].properties).should.have.property('expense_item_number').that.equals('tol');
        (closeMessage.actions[3].properties).should.have.property('expense_item_desc').that.equals('tol');
        (closeMessage.actions[3].properties).should.have.property('expense_amount').that.equals('70.11');
        (closeMessage.actions[3].properties).should.have.property('expense_currency_code').that.equals('USD');

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

        await page.screenshot({path: 'WithLabor.png', fullPage: true});

    }));

    teardown(async function () {
        this.timeout(10000);
        await browser.close();
    });

});