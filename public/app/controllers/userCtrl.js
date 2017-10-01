angular.module('userCtrl', ['userService'])
.controller('UserController', function (User) {
    const vm = this
    User.all()
        .then(function (data) {
            // error might be here
            vm.users = data.data
        })
})
.controller('UserCreateController', function (User, $location, $window) {
    const vm = this
    vm.signupUser = function () {
        vm.message = ''
        User.create(vm.userData)
            .then(function (response) {
                vm.userData = {}
                vm.message = response.data.message
                $window.localStorage.setItem('token', response.data.token)
                $location.path('/')
            })
    }
})