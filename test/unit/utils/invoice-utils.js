define(['knockout',
        'utils/invoice-utils',
        'utils/labor-time-utils',
        "ojs/ojresponsiveutils",
        "ojs/ojresponsiveknockoututils",
        "constants"],
    (ko,
     InvoiceUtils,
     LaborTimeUtils,
     ResponsiveUtils,
     ResponsiveKnockoutUtils,
     Constants) => {

        suite('InvoiceUtils', () => {
            const sandbox = sinon.createSandbox();

            setup(() => {

            });

            teardown(() => {
                sandbox.restore();
            });

            test('InvoiceUtils constructor', ( async function() {
                let invoiceUtils = new InvoiceUtils();
                expect(invoiceUtils.detectDevice()).is.not.empty;
            }));

            test('test _calculateDuration', ( async function() {
                let invoiceUtils = new InvoiceUtils();
                let laborTimeUtilsStub = sandbox.createStubInstance(LaborTimeUtils);
                invoiceUtils._laborTimeUtils = laborTimeUtilsStub;

                invoiceUtils._calculateDuration(sinon.match.any , sinon.match.any , sinon.match.any);
                const html2pdfMock = {
                    from: sinon.stub().returnsThis(),
                    set: sinon.stub().returnsThis(),
                    save: sinon.stub(),
                    outputPdf: sinon.stub()
                };
                window.html2pdf = () => html2pdfMock;
                expect(html2pdfMock.save.calledOnce).to.be.false;
            }));

            test('test detectDevice', ( async function() {
                let invoiceUtils = new InvoiceUtils();
                let  result = invoiceUtils.determineDeviceType(true);
                expect(result).to.equal(Constants.DEVICE_TYPE_MOBILE);

            }));
        });

    });