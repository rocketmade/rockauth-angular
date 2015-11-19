describe('LoginService', function() {

	beforeEach(module('rockauth.login'));

	beforeEach(module(function($provide) {
		$provide.value('BaseAPI', {
			constant: 'http://localhost:3000/api'
		});
		$provide.value('ClientId', {
			constant: 'pCJ9mqTHakWk8VSFUh_OeQ'
		});
		$provide.value('ClientSecret', {
			constant: 'aaj5Hpb2DML8YLBkuiEbizJBs4cCE8ecjy-c1NTYz68'
		});
	}));

	it('should exist', inject(function(loginService) {
		expect(loginService).toBeDefined();
	}));

	it('should save token to local storage', inject(function(loginService) {
		var token = 'testt0k3n!';
		loginService.saveToken(token);
		expect(localStorage.getItem('rockauth.jwtToken')).toEqual(token);
	}));

	it('should get token from local storage', inject(function(loginService) {
		var token = 'testt0k3n!';
		localStorage.setItem('rockauth.jwtToken', token);
		var getMockToken = loginService.getToken();
		expect(localStorage.getItem('rockauth.jwtToken')).toEqual(token);
	}));

	it('should remove token from local storage', inject(function(loginService){
		var token = 'testt0k3n!';
		localStorage.setItem('rockauth.jwtToken', token);
		loginService.logout();
		expect(localStorage.getItem('rockauth.jwtToken')).toBeNull();
	}));

	var mockLoginResponse = {
		data: {
			authentication: {
				token: ''
			},
			authentications: [{
				token: ''
			}]
		}
	};

	it('should have a token be defined on login', inject(function(loginService, $injector) {
		var $httpBackend = $injector.get('$httpBackend');
		$httpBackend.when('POST', 'localhost:3000/api/authentications.json').respond(mockLoginResponse);
		loginService.login().then(function(res) {
			expect(res.data.authentication.token).toBeDefined() || expect(res.data.authentications[0].token).toBeDefined();
		})
	}));

	it('should save token on login', inject(function(loginService, $injector) {
		spyOn(loginService, 'saveToken');
		var $httpBackend = $injector.get('$httpBackend');
		$httpBackend.when('POST', 'localhost:3000/api/authentications.json').respond(mockLoginResponse);
		loginService.login().then(function(res) {
			expect(loginService.saveToken).toHaveBeenCalled();
		});
	}));
});