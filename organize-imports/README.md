## `organize-imports`
A simple codemod that organizes all your import statements. It also organizes all specifiers in these statements alphabetically.

- **Motivation**: it's good to keep one pattern in the whole project. I love it because it improves the readability;
- **Decision**: entirely based on specifications instead of conditions. What does that mean? `import type` will be always on the top &mdash; it's a rule. The same apply to the rest;
- **Features**: understands all known variations of import statement & organizes the specifiers too. Works also with [flow's](http://flowtype.org/) `import type`.

The following code:
```JS
import Relay from 'react-relay';
import doSomethingElse from '../../doSomethingElse';
import { dropWhile, curry, takeWhile } from 'lodash';
import { OrderedMap, List, Set } from 'immutable';
import React, { PropTypes, Component, findDOMNode } from 'react';
import doSomething from '../doSomething';
import type { A, B } from './types';
import type { E, D, C } from '../../moreTypes';
```

Will be organized as:
```JS
import type { A, B } from './types';
import type { C, D, E } from '../../moreTypes';
import React, { Component, findDOMNode, PropTypes } from 'react';
import Relay from 'react-relay';
import { List, OrderedMap, Set } from 'immutable';
import { curry, dropWhile, takeWhile } from 'lodash';
import doSomething from '../doSomething';
import doSomethingElse from '../../doSomethingElse';
```

### Authors
- @txgruppi &mdash; helped to define the rules and its priorities;
- @CentaurWarchief &mdash; wrapped it all to work with [jscodeshift](https://github.com/facebook/jscodeshift) API;
- @esytem &mdash; did nothing.
