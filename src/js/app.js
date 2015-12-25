import React from 'react';
import ReactDOM from 'react-dom';

import HelloParse from './core/components/HelloParse';

ReactDOM.render(<HelloParse />, document.getElementById('app'));


import AppScenario from './controller/AppScenario';

AppScenario.playScenario();