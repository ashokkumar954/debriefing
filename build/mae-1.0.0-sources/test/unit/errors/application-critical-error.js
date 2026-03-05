define(['knockout', 'errors/application-critical-error'], (ko, ApplicationCriticalError) => {
    suite('AbstractModel', () => {
        suiteSetup(async () => {

        });

        suiteTeardown(async () => {

        });

        setup(() => {

        });

        teardown(() => {

        });

        test('Constructor is working', (() => {
            new ApplicationCriticalError({}).should.be.instanceOf(ApplicationCriticalError);
        }));
    });

});