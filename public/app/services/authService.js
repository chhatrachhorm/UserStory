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
        }).then(function (data) {
            console.log(data)
            console.log("this is token ", data.data.token)
            AuthToken.setToken(data.data.token)
            return data
        }, function (err) {
            console.log(err)
        })
    }
    authFactory.logout = function () {
        AuthToken.setToken()
    }
    authFactory.isLoggedIn = function () {
        return !!AuthToken.getToken();
    }
    authFactory.getUser = function () {
        const token = AuthToken.getToken()
        console.log(token)
        if(token)
            return $http.get('/api/me', {
                headers : {'x-access-token' : token}
            })
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
        console.log('setToken : ', token)
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