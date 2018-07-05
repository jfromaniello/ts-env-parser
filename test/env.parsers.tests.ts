import { assert } from 'chai';
import * as url from 'url';
import { setting, EnvironmentBase } from '../src/index';

describe('test', function() {
  it('should parse properties', function() {
    class Config extends EnvironmentBase {
      @setting({ parser: parseInt })
      public PORT: number;
    }

    const result = new Config({ PORT: '9090' });

    assert.equal(result.PORT, 9090);
  });

  it('should work with the default parser', function() {
    class Config extends EnvironmentBase {
      @setting()
      public PORT: number;
    }

    const result = new Config({ PORT: '9090' });

    assert.equal(result.PORT, 9090);
  });

  it('should validate required properties', function() {
    class Config extends EnvironmentBase {
      @setting({ required: true })
      public PORT: number;
    }

    assert.throws(() => new Config({}).validate(), /PORT is required/) ;
  });

  it('should not fail when a required property has a default', function() {
    class Config extends EnvironmentBase {
      @setting({ required: true })
      public PORT: number = 9090;
    }

    assert.doesNotThrow(() => new Config({}).validate(), /PORT is required/) ;
  });

  it('should validate the type of the property', function() {

    class Config extends EnvironmentBase {
      @setting({})
      public PORT: number;
    }

    assert.throws(() => new Config({ PORT: ['321'] }).validate(), /PORT should be a Number/) ;
  });

  it('should not fail when a required property has a default', function() {
    class Config extends EnvironmentBase {
      @setting({ required: true })
      public PORT: number = 9090;
    }

    assert.doesNotThrow(() => new Config({}).validate(), /PORT is required/) ;
  });

  it('should work for a url', function() {
    class Config extends EnvironmentBase {
      @setting({ required: true, parser: url.parse })
      public URL: url.Url;
    }
    const config = new Config({ URL: 'http://example.com'}).validate();
    assert.equal(config.URL.protocol, "http:");
    assert.equal(config.URL.host, "example.com");
  });
});
