angular.module('MyApp', ['appRoutes', 'mainCtrl', 'userCtrl', 'authService', 'userService'])
.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor')
})