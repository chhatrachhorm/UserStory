/**
 * Service fetches the data, handle backend from node.js
 * Get the data from views and pass it into routes
 * Get Data from routes and pass it to the controller to perform some logic and pass back to views
 * *********
 * $http : handle http requests
 * $q : handle promise obj
 * $window : to handle window obj (related to browser)
 * */
angular.module('authService', [])
.factory('Auth', function ($http, $q, AuthToken) {
    const authFactory = {}
    authFactory.login = function (username , password) {
        return $http.post('/api/login', {
            username : username,
            password : password
        }).success(function (data) {
            AuthToken.setToken(data.token)
        })
    }
    authFactory.logout = function () {
        AuthToken.setToken()
    }
    authFactory.isLoggedIn = function () {
        return !!AuthToken.getToken();
    }
    authFactory.getUser = function () {
        if(AuthToken.getToken())
            return $http.get('/api/me')
        else return $q.reject({message : "User has no token"})
    }
    return authFactory
})
.factory('AuthToken', function ($window) {
    const authTokenFactory = {}
    authTokenFactory.getToken = function () {
        return $window.localStorage.getItem('token')
    }
    authTokenFactory.setToken = function (token) {
        if(token)
            $window.localStorage.setItem('token', token)
        else $window.localStorage.removeItem('token')
    }
    return authTokenFactory
})
.factory('AuthInterceptor', function ($q, $location, AuthToken) {
    const interceptorFactory = {}
    interceptorFactory.request = function (config) {
        const token = AuthToken.getToken()
        if(token){
            config.headers['x-access-token'] = token
        }
        return config
    }
    interceptorFactory.responseError = function (response) {
        if (403 === response.status) {
            $location.path('/login')
        }
        return $q.reject(response)
    }
    return interceptorFactory
})