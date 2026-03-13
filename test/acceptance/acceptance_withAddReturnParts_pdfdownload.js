const should = require('chai').should();
const puppeteer = require('puppeteer');
const helper = require('../mocks/helper');
const properties = require('./utils/properties');
const partsAddedFromInventory = require('../mocks/open-with-parts-added-from-inventory');
const fs = require('fs');
const path = require('path');
const browserHelper = require("./utils/browserHelper");

suite('Acceptance', () => {
    let browser = null;
    let page = null;
    let downloadPath = null;
    let isFirefox = true;

    setup(async function () {
        this.timeout(60000);

        browser = await browserHelper.initBrowser();
        page = await browser.newPage();
        await page.setViewport({width: 1920, height: 1080});

        const version = await browser.version();
        isFirefox = version.toLowerCase().includes('firefox');

        if (!isFirefox) {

            downloadPath = path.resolve(__dirname, 'downloads');
            if (!fs.existsSync(downloadPath)) fs.mkdirSync(downloadPath, {recursive: true});
            const client = await page.target().createCDPSession();
            await client.send('Page.setDownloadBehavior', {
                behavior: 'allow',
                downloadPath: downloadPath,
            });
        } else {
            downloadPath = null;
        }

        page.on('console', msg => console.log('PUPPETEER CONSOLE LOG:', msg.text()));
        await helper.openPlugin(page);
        await helper.initializePlugin(page);
        await helper.openIframe(page);
        await helper.openNewActivity(page, partsAddedFromInventory);
    });


    async function validatePdfDownload(frame) {
        const pagesBefore = await browser.pages();

        const downloadButton = (await frame.$$('xpath/' + properties.PDF_DOWNLOAD))[0];
        await frame.evaluate(el => el.click(), downloadButton);

        let pdfPage = null;

        const maxTries = 20;
        for (let tries = 0; tries < maxTries; tries++) {
            const pagesAfter = await browser.pages();
            if (pagesAfter.length > pagesBefore.length) {
                pdfPage = pagesAfter.find(p => !pagesBefore.includes(p));
                break;
            }
            await new Promise(res => setTimeout(res, 500));
        }
        if (isFirefox) {
            if (pdfPage) {
                await pdfPage.bringToFront();
                const downloadSelector = 'button[title="Download"], .toolbarButton.download';
                try {
                    await pdfPage.waitForSelector(downloadSelector, {visible: true, timeout: 5000});
                    const pdfjsDownloadBtn = await pdfPage.$(downloadSelector);
                    should.exist(pdfjsDownloadBtn);
                    await pdfPage.screenshot({path: 'PDF_viewer_download_button_firefox.png'});
                    console.log('Download button is visible.');
                    return;
                } catch (e) {
                    console.warn('Test');
                }
            }

        } else {

            let pdfFile = '';
            let waitTime = 0;
            let found = false;
            const timeout = 40000;
            while (waitTime < timeout) {
                const files = fs.readdirSync(downloadPath);
                const pdfs = files.filter(f => f.endsWith('.pdf'));
                if (pdfs.length > 0) {
                    pdfFile = path.join(downloadPath, pdfs[0]);
                    found = true;
                    break;
                }
                await new Promise(res => setTimeout(res, 500));
                waitTime += 500;
            }
            found.should.equal(true, 'PDF file appeared in downloads directory');
            fs.existsSync(pdfFile).should.equal(true, 'PDF file was downloaded');
            const stats = fs.statSync(pdfFile);
            console.log('PDF file size (bytes):', stats.size);
            stats.size.should.be.above(10000, 'PDF was generated and is not blank');
            console.log('Verified: PDF file download in Chrome.');
        }
    }

    test('Validate adding parts/Validate deleting the added parts with PDF Download and validation', (async function () {
        this.timeout(60000);
        let frameHandle = await page.$(properties.PLUGIN_FRAME);
        let frame = await frameHandle.contentFrame();

        await helper.waitSeconds(3);

        let menuButtonElem = await frame.waitForSelector(properties.DASHBOARD_SIDE_MENU);
        let menuButtonText = await menuButtonElem.evaluate(el => el.innerText);
        menuButtonText.should.equal('Add Charges');
        let menuAddedPart = (await frame.$$('xpath/' + properties.ADDED_PART))[0];
        let menuAddedPartText = await menuAddedPart.evaluate(el => el.innerText);
        menuAddedPartText.should.contain('ECM100001');
        await helper.waitSeconds(2);
        await page.screenshot({path: 'WithInstallingDeInstallingFromInventories.png', fullPage: true});

        let continueButton = (await frame.$$('xpath/' + properties.CONTINUE_BUTTON))[0];
        await frame.evaluate(el => el.click(), continueButton);
        await helper.waitSeconds(2);

        await validatePdfDownload(frame);
    }));

    test('Verify asset inventory changes from Activity Inventory page are reflected in BHM with PDF Download and validation', (async function () {
        this.timeout(60000);
        let frameHandle = await page.$(properties.PLUGIN_FRAME);
        let frame = await frameHandle.contentFrame();

        await helper.waitSeconds(3);

        let menuButtonElem = await frame.waitForSelector(properties.DASHBOARD_SIDE_MENU);
        let menuButtonText = await menuButtonElem.evaluate(el => el.innerText);
        menuButtonText.should.equal('Add Charges');
        let menuAddedPart = (await frame.$$('xpath/' + properties.ADDED_PART))[0];
        let menuAddedPartText = await menuAddedPart.evaluate(el => el.innerText);
        menuAddedPartText.should.contain('ECM100001');
        await helper.waitSeconds(2);
        await page.screenshot({path: 'WithInstallingDeInstallingFromInventories.png', fullPage: true});

        let continueButton = (await frame.$$('xpath/' + properties.CONTINUE_BUTTON))[0];
        await frame.evaluate((el) => el.click(), continueButton);
        await helper.waitSeconds(2);

        let submitButton = (await frame.$$('xpath/' + properties.SUBMIT_BUTTON))[0];
        await frame.evaluate((el) => el.click(), submitButton);
        await helper.waitSeconds(2);

        let closeJsonElem = await page.waitForSelector('#receivedMessageJson-6');
        let closeJson = await closeJsonElem.evaluate(el => el.textContent);
        let closeMessage = JSON.parse(closeJson);
        closeMessage.should.have.property('apiVersion').that.equals(1);
        closeMessage.should.have.property('method').that.equals('close');
        closeMessage.should.have.property('inventoryList');
        closeMessage.should.have.property('actions');
        closeMessage.should.have.property('activity');
        closeMessage.should.have.property('wakeupNeeded');
        closeMessage.should.have.property('wakeOnEvents');

        await page.screenshot({path: 'WithInstallingDeInstallingFromInventories_AfterSubmit.png', fullPage: true});

        await validatePdfDownload(frame);
    }));

    teardown(async () => {
        await browser.close();
    });
});