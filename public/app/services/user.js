angular.module('userService', [])
.factory('User', function ($http) {
    const userFactory = this
    userFactory.create = function (userData) {
        return $http.post('api/signup', userData)
    }
    userFactory.all = function () {
        return $http.get('/api/users')
    }
    return userFactory
})