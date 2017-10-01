angular.module('mainCtrl', [])
.controller('MainController', function ($rootScope, $location, Auth) {
    const vm = this
    vm.loggedIn = function(){
        return Auth.isLoggedIn()
    }
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
            .then(function (data) {
                console.log(data)
                vm.proccess = false
                Auth.getUser()
                    .then(function (data) {
                        console.log(data)
                        vm.user = data.data
                    })
                $location.path('/')
            }, function (err) {
                vm.error = err
            })
    }
    vm.doLogout = function () {
        Auth.logout()
            .then(function () {
                $location.path('/login')
            })
            .catch(function () {
                console.log("Failure occur")
            })
    }
})