//MockServer
const PLUGIN_FRAME = '#pluginFrame'; //Dont Modify
const SEND_MESSAGE = '#sendMessageButton';

//Dashboard
const DASHBOARD_CONTAINER = '#emptyDashboard-container';
const DASHBOARD_MENU = '#emptyDashboard-container #menuButton1 button';
const DASHBOARD_SIDE_MENU = 'oj-menu-button#menuButton2';
const MAIN_MENU_SELECT = '#menuButton1 button';
const SIDE_MENU_SELECT = '#menuButton2 button';
const SIDE_MENU_BUTTON = '//*[@id=\"menuButton2\"]/button';
const MAIN_MENU_LABOR = '#debriefMenu1 #iconFont5 a';
const MAIN_MENU_EXPENSE = '#debriefMenu1 #iconFont6 a';
const MAIN_MENU_ADD_PARTS = '#debriefMenu1 #iconFont7 a';
const MAIN_MENU_RETURN_PARTS = '#debriefMenu1 #iconFont8 a';
const SIDE_MENU_ADD_PART = '//*[contains(@id,\'debriefMenu2\')] //a[contains(text(),\'Add Parts\')]';
const LABEL_NO_ITEMS = "//*[@id=\"globalBody\"] //span[contains(text(),'No items to display.')]";
const GLOBAL_BODY = "//*[@id=\"globalBody\"]";
const EXPENSES_LABEL = "//div[contains(text(),'Expenses')]";
//Labor
const LABOR_SELECT = 'oj-option#iconFont5 > a';
const SIDE_MENU_LABOR_SELECT = 'oj-option#iconFont51 > a';
const BILLING_TYPE_SELECT = '#oj-combobox-choice-activity input';
const BILLING_TYPE_1 = '#oj-listbox-results-activity li:first-child';
const BILLING_LABOR_ITEM_SELECT = '#oj-combobox-choice-laborItem';
const BILLING_LABOR_ITEM_1 = '#oj-listbox-results-laborItem li:first-child';
const LABOR_START_TIME = '#startTimeEl input';
const LABOR_END_TIME = '#endTimeEl input';
const LABOR_TIME_OK_BUTTON = '//*[contains(@id,\'__oj_zorder_container\')]//a[contains(text(),\'Cancel\')]';
const SUBMIT_BUTTON = '//*[contains(text(),\'Submit\')]/ancestor::button';
const LABOR_DELETE_BUTTON = '//*[contains(@id,\'labor\')]/button';
const ERROR_DELETE = '#modalDialog oj-bind-text';
const REMOVE_CONFIRM = '//*[contains(text(),\'Delete\')]/ancestor::button';
const LABEL_LABOR = "//*[@id=\"globalBody\"] //div[contains(text(),'Labor')]";
const DURATION_VALUE = "//*[@id=\"durationHours|input\"]";
const LABEL_DURATION = "//*[contains(text(),'Duration')]";
const LABEL_DESCRIPTION = "//*[contains(text(),'Description')]";
const LABOR_DESC_VALUE = "//*[@id=\"itemDescription|input\"]";
const LABOR_ITEM_SELECT = "#oj-combobox-choice-laborItem";
const DASHBOARD_LABOR =   "//ul[contains(@aria-label,'Labor')]/li";
//Expense
const EXPENSE_SELECT = 'oj-option#iconFont6 > a';
const SIDE_MENU_EXPENSE_SELECT = 'oj-option#iconFont61 > a';
const EXPENSE_TYPE_SELECT = '//a[contains(text(),\'Expenses\')]';
const EXPENSE_AMOUNT = '#amount input';
const EXPENSE_DELETE_BUTTON = '//*[contains(@id,\'expenses\')]/button';
const DASHBOARD_CONTAINER_AFTER_DELETE = 'div#emptyDashboard-container';
const SIDE_MENU_EXPENSE = '//*[contains(@id,\'debriefMenu2\')] //a[contains(text(),\'Expenses\')]';
const TOTAL_AMOUNT = '//*[@id=\"previewForm\"]/div[5]/div[3]/div/div';
const LABEL_EXPENSES = "//*[@id=\"globalBody\"] //div[contains(text(),'Expenses')]";
const DASHBOARD_EXPENSE = "//ul[contains(@aria-label,'Expenses')]/li";
//Add Parts
const ADD_PART_SELECT = '#iconFont7 > a';
const SIDE_MENU_ADD_PART_SELECT = 'oj-option#iconFont71 > a';
const ADD_PART_TYPE_SELECT = '//a[contains(text(),\'Add Parts\')]';
const ADD_PART_SEARCH = '//*[contains(@class,\'oj-inputsearch-input\')]';
const ADD_PART_SEARCH_SELECT = '#tracker li:first-child';
const ADDED_PART = '//*[contains(@class,\'oj-listitemlayout-textslots\')]';
const ADDED_PARTS = '//ul[contains(@aria-label,\'Added Parts\')]//*[contains(@class,\'oj-listitemlayout-textslots\')]';
const DELETE_ADDED_PARTS = '//*[contains(@id,\'usedParts\')]/button';
const ERROR_ADD_DELETE_PARTS = '//*[contains(@class,\'oj-dialog-body\')]';
const LABEL_ADD_PARTS = "//*[@id=\"globalBody\"] //div[contains(text(),'Added Parts')]";

//Return Parts
const RETURN_PART_SELECT = '#iconFont8 > a';
const SIDE_MENU_RETURN_PART_SELECT = 'oj-option#iconFont81 > a';
const RETURN_PART_TYPE_SELECT = '//a[contains(text(),\'Return Parts\')]';
const RETURN_PART_SEARCH = '//*[contains(@class, \'oj-inputsearch-input\')]';
const RETURN_PART_SEARCH_SELECT = '//*[contains(@class,\'inventory-information\')]';
const RETURN_PART_SERIAL_NUMBER = '//input[contains(@class,\'oj-inputtext-input\')]';
const ADDED_RETURN_PARTS = '//ul[contains(@aria-label,\'Returned Parts\')]//*[contains(@class,\'oj-listitemlayout-textslots\')]';
const DELETE_RETURN_PARTS = '//*[contains(@id,\'returnParts\')]/button';
const SIDE_MENU_RETURN_PART = '//*[contains(@id,\'debriefMenu2\')] //a[contains(text(),\'Return Parts\')]';
//const SIDE_MENU_RETURN_PART = '//*[@id="ui-id-31"]';
const LABEL_RETURNED_PARTS = "//*[@id=\"globalBody\"] //div[contains(text(),'Returned Parts')]";

const TIME_LABOR_REPORT_EXPENSE_1 = "//*[@id=\"previewForm\"]/div[5]/div[2]/div[1]/div";
const TIME_LABOR_REPORT_TOTAL = "//*[@id=\"previewForm\"]/div[5]/div[3]/div/div/span";
const TIME_LABOR_REPORT_LABOR_1 = "//*[@id=\"previewForm\"]/div[4]/div[2]/div/div";
const TIME_LABOR_TOTAL = "//*[@id=\"previewForm\"]/div[4]/div[3]/div/span";
const LABEL_AUTOPOPULATE_DEFAULT_LABOR_TYPE = "//*[@id=\"ui-id-7\"] //span[contains(@class,\'name\')]";
const LABEL_AUTOPOPULATE_DEFAULT_LABOR_ITEM_TIME = "//*[@id=\"ui-id-7\"] //span[contains(@class,\'oj-typography-body-sm oj-text-color-primary\')]";
const LABEL_AUTOPOPULATE_DEFAULT_TRAVEL_TYPE = "//*[@id=\"ui-id-8\"] //span[contains(@class,\'name\')]";
const LABEL_AUTOPOPULATE_DEFAULT_TRAVEL_ITEM_TIME = "//*[@id=\"ui-id-8\"] //span[contains(@class,\'oj-typography-body-sm oj-text-color-primary\')]";
const CONTINUE_BUTTON = '//*[contains(@on-click,\'[[onPreviewInvoiceButtonClick.bind($data)]]\')]/button';
const BILLING_ITEM_SELECT = "//*[@id=\"ui-id-27\"] //a[contains(@class,\'oj-combobox-arrow oj-combobox-icon oj-component-icon oj-clickable-icon-nocontext oj-combobox-open-icon\')]";
const SAVE_BUTTON = '//*[contains(@on-click,\'[[onSaveButtonClick.bind($data)]]\')]/button';

const TIME_SPENT_DATA = "//*[@id=\"previewForm\"]/div[4]/div/div";
const EXPENSE_DATA = "//*[@id=\"previewForm\"]/div[5]/div/div"
const PDF_DOWNLOAD = '//*[contains(text(),\'Download\')]/ancestor::button';

module.exports = {
    PLUGIN_FRAME,
    SEND_MESSAGE,
    DASHBOARD_CONTAINER,
    DASHBOARD_MENU,
    DASHBOARD_SIDE_MENU,
    MAIN_MENU_SELECT,
    SIDE_MENU_SELECT,
    SIDE_MENU_BUTTON,
    MAIN_MENU_LABOR,
    MAIN_MENU_EXPENSE,
    MAIN_MENU_ADD_PARTS,
    MAIN_MENU_RETURN_PARTS,
    SIDE_MENU_ADD_PART,
    LABOR_SELECT,
    BILLING_TYPE_SELECT,
    BILLING_TYPE_1,
    BILLING_LABOR_ITEM_SELECT,
    BILLING_LABOR_ITEM_1,
    LABOR_START_TIME,
    LABOR_END_TIME,
    LABOR_TIME_OK_BUTTON,
    SUBMIT_BUTTON,
    LABOR_DELETE_BUTTON,
    ERROR_DELETE,
    REMOVE_CONFIRM,
    EXPENSE_SELECT,
    EXPENSE_TYPE_SELECT,
    EXPENSE_AMOUNT,
    EXPENSE_DELETE_BUTTON,
    SIDE_MENU_EXPENSE,
    DASHBOARD_CONTAINER_AFTER_DELETE,
    ADD_PART_SELECT,
    ADD_PART_TYPE_SELECT,
    ADD_PART_SEARCH,
    ADD_PART_SEARCH_SELECT,
    ADDED_PART,
    ADDED_PARTS,
    DELETE_ADDED_PARTS,
    RETURN_PART_SELECT,
    RETURN_PART_TYPE_SELECT,
    RETURN_PART_SEARCH,
    RETURN_PART_SEARCH_SELECT,
    RETURN_PART_SERIAL_NUMBER,
    ADDED_RETURN_PARTS,
    DELETE_RETURN_PARTS,
    ERROR_ADD_DELETE_PARTS,
    SIDE_MENU_RETURN_PART,
    TOTAL_AMOUNT,
    SIDE_MENU_LABOR_SELECT,
    SIDE_MENU_EXPENSE_SELECT,
    SIDE_MENU_ADD_PART_SELECT,
    SIDE_MENU_RETURN_PART_SELECT,
    LABEL_LABOR,
    LABEL_EXPENSES,
    LABEL_ADD_PARTS,
    LABEL_RETURNED_PARTS,
    LABEL_NO_ITEMS,
    DURATION_VALUE,
    LABEL_DURATION,
    LABEL_DESCRIPTION,
    LABOR_DESC_VALUE,
    TIME_LABOR_REPORT_EXPENSE_1,
    TIME_LABOR_REPORT_TOTAL,
    TIME_LABOR_REPORT_LABOR_1,
    TIME_LABOR_TOTAL,
    LABOR_DESC_VALUE,
    GLOBAL_BODY,
    EXPENSES_LABEL,
    DASHBOARD_EXPENSE,
    EXPENSES_LABEL,
    LABEL_AUTOPOPULATE_DEFAULT_LABOR_TYPE,
    LABEL_AUTOPOPULATE_DEFAULT_LABOR_ITEM_TIME,
    LABEL_AUTOPOPULATE_DEFAULT_TRAVEL_TYPE,
    LABEL_AUTOPOPULATE_DEFAULT_TRAVEL_ITEM_TIME,
    CONTINUE_BUTTON,
    LABOR_ITEM_SELECT,
    TIME_SPENT_DATA,
    EXPENSE_DATA,
    DASHBOARD_LABOR,
    EXPENSE_DATA,
    BILLING_ITEM_SELECT,
    SAVE_BUTTON,
    PDF_DOWNLOAD

};