angular.module('mainCtrl', [])
.controller('MainController', function ($rootScope, $location, Auth) {
    const vm = this
    vm.loggedIn = Auth.isLoggedIn()
    // like listener
    $rootScope.$on('$routeChangeStart', function () {
        vm.loggedIn = Auth.isLoggedIn()
        Auth.getUser()
            .then(function (data) {
                vm.user = data.data
            })
    })

    vm.doLogin = function () {
        vm.proccess = true
        vm.error = ''
        Auth.login(vm.loginData.username, vm.loginData.password)
            .success(function (data) {
                vm.proccess = false
                Auth.getUser()
                    .then(function (data) {
                        vm.user = data.data
                    })
                if(data.success)
                    $location.path('/')
                else
                    vm.error = data.message
            })
    }
    vm.doLogout = function () {
        Auth.logout()
            .then(function () {
                $location.path('/logout')
            })

    }
})