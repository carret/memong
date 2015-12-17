import * as NodeParse from 'node-parse-api';
import * as ClientParse from 'parse';

import isNode from 'detect-node';


var ParseApp = null;

var APP_ID = 'sheYinNuOuHuCoUnOFvIEVbMukCS5RFpE7LK0P0a';
var APP_JS_KEY = '3mtRiYBix0pWFUxsQZn3cvT0D0jlgOKuGSdM3irS';
var APP_MASTER_KEY = 'fL9NI74TsKMzwD4v5iipillTvIuSrVgVa9R4sQ0V';


if (isNode) ParseApp = new NodeParse.Parse(APP_ID, APP_MASTER_KEY);
else {
    ClientParse.initialize(APP_ID, APP_JS_KEY);
    ParseApp = ClientParse;
}

export default ParseApp;