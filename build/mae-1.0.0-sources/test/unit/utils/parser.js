define(['knockout',
        'utils/parser'],
    (ko,
     Parser) => {

        suite('Parser', () => {
            const sandbox = sinon.createSandbox();

            setup(() => {

            });

            teardown(() => {
                sandbox.restore();
            });

            test('Parser constructor', ( async function() {
                let result = Parser.parseJSON('some value');
                expect(result).to.be.null;
            }));

        });

    });