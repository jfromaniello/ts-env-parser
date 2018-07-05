The idea of this module is to parse and validate settings provided by process.env into a typescript object.

This module is similar to another module I built before called [xenv](https://www.npmjs.com/package/xenv) but in addition to validation it also allow me to take advantage of static typing.

## Installation

```
npm i ts-env-parser --save
```

## Usage

```typescript
import { setting, EnvironmentBase } from '../src/index';
import * as url from 'url';

class Config extends EnvironmentBase {
  @setting()
  public PORT: number = 9090;

  @setting({ required: true, parser: url.parse })
  public URL: url.Url;

  @setting()
  public OTHER: stirng;
}

const config = new Config();

config.validate();

export default config;
```

## LICENSE

MIT 2018 - José F. Romaniello
