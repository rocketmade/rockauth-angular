# Rockauth Angular

## interfacing with rockauth-angular

For now, rockauth-angular is a private repo, but can be cloned and
referenced using _bower link_ (described in the development section below)

To setup rockauth-angular, somewhere in your angular app you must define the following constants:
```javascript
angular.module('rockauth')
  .constant('BaseAPI', 'http://example.com/api')
  .constant('ClientId', 'XYZ')
  .constant('ClientSecret', 'XYZ')
  .constant('FBAppId', 'XYZ')
```
After that, adding directives is as easy as the following to your html:
```
<ra-registration success-callback="vm.mySuccessCallback"></ra-registration>
```

## Possible Directives

- raRegistration
- raLogin
- raGoogle
- raFacebook
- raTwitter
- raInstagram

## Development

For development, you can link to the directory by executing the
command `bower link` inside the root of the rockauth-angular
directory. Then, inside the root of your app, use the command: `bower
link rockauth-angular`

This will create a sym-link inside the bower_components directory that
you can then reference as a dependency in the bower.json file of your
app using `'rockauth-angular': '*'`