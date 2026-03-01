define(['knockout', 'utils/ko-text-highlighted-binding','ojs/ojmodel',], (ko, TextHighlight,ojmodel) => {

    suite('TextHighlight', () => {

        suiteSetup(async () => {
        });

        suiteTeardown(async () => {

        });

        setup(() => {

        });

        teardown(() => {

        });

        test('Constructor - flow 1 - is working', (() => {
            let text = ko.observable('ECM10000001');
            el = document.createElement('div');
            el.innerHTML= '<span id="testHighlightedSpan" data-bind="textHighlighted: text, searchString: searchSubstringIsEmpty"></span>';

            ko.bindingHandlers.textHighlighted.init(el,text);
            let model1 = new ojmodel.Model({
                'searchString': 'ECM1000'
            });
            ko.bindingHandlers.textHighlighted.update(el,text,model1);

            text = ko.observable('ECM');
            ko.bindingHandlers.textHighlighted.update(el,text,model1);
        }));

        test('Constructor - flow 2 - is working', (() => {
            let text = ko.observable();
            el = document.createElement('div');
            el.innerHTML= '<span id="testHighlightedSpan" data-bind="textHighlighted: text, searchString: searchSubstringIsEmpty"></span>';

            ko.bindingHandlers.textHighlighted.init(el,text);
            let model1 = new ojmodel.Model({
                'searchString': 1241434
            });
            ko.bindingHandlers.textHighlighted.update(el,text,model1);

            text = ko.observable('');
            ko.bindingHandlers.textHighlighted.update(el,text,model1);
        }));
        
    });

});