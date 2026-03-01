define([
    'knockout',
    'ojs/ojarraydataprovider',
    'ojs/ojinputtext',
    'ojs/ojbutton'
], function (ko) {

    function TestFlowViewModel() {

        let self = this;

        self.actions = ko.observableArray([]);

        self.addAction = function () {

            self.actions.push({
                field1: ko.observable(''),
                field2: ko.observable(''),
                field3: ko.observable(''),
                field4: ko.observable('')
            });

        };

        self.saveActions = function () {

            let payload = self.actions().map(item => ({
                field1: item.field1(),
                field2: item.field2(),
                field3: item.field3(),
                field4: item.field4()
            }));

            console.log("Collected Data:", payload);

            alert("Check console for saved data");

            // Later you can call:
            // self._controller.submitPluginData(payload);

        };

    }

    return TestFlowViewModel;
});