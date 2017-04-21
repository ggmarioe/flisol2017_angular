angular.module('starter.controllers', [])
.constant('CONFIG',{
  APIURL: 'http://localhost/ticket/public/api/'
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})


.controller('TicketCtrl',function($scope, $http, CONFIG){

  $scope.data = {};
  $scope.error = {};

  //listar
  $http.get(CONFIG.APIURL  + "ticket").then(function(response){
    //console.log(response.data);
    $scope.tickets = response.data;
  },function(error){
    $scope.error = error;
  });

  $scope.guardar = function(){
    $scope.mensaje='';
    $scope.mensajeError = {}
    //guardar los datos
    var params = {
          nombre: $scope.data.nombre,
          correo: $scope.data.correo,
          solicitud: $scope.data.solicitud,
          estado: "abierto"
    };
    //Es necesario pasar a json los datos que vienen por el input
    //de otra forma no se pueden utlilizar con php input en el lado del servidor
    var jsoned = angular.toJson(params);
    //headers indicando el contenido del post
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' };

    $http({
        url: CONFIG.APIURL + "ticket",
        method: "POST",
        data: jsoned,
        headers: headers
    }).then(function(response){
        //resolvemos los datos para entregarlos al usuario
        $scope.mensaje = response.data;
        //deferred.resolve(response.data);
    },function(error){
        $scope.error = error
    });
  }
})

.controller('TicketEditCtrl',function($scope, $http, $stateParams, CONFIG){

  $scope.data ={};
  if($stateParams){
    var ticketId =$stateParams.ticketId;

    $http.get(CONFIG.APIURL  + "ticket/" + ticketId).then(function(response){

      console.log(response.data);
      $scope.data.nombre_usuario = response.data.nombre_usuario;
      $scope.data.correo_usuario = response.data.correo_usuario;
      $scope.data.solicitud = response.data.solicitud;
      $scope.data.estado = response.data.estado;
      $scope.data.id = response.data.id;
    },function(error){
      $scope.error = error;
    });
  }

  $scope.update = function(){

    if($scope.data == {}){
      alert("No hay datos");
      return false;
    }

    var params = {
          id: $scope.data.id,
          nombre_usuario: $scope.data.nombre_usuario,
          correo_usuario: $scope.data.correo_usuario,
          solicitud: $scope.data.solicitud,
          estado: "cerrado"
    };
    var jsoned =angular.toJson(params);
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' };

    $http({
      url: CONFIG.APIURL + "ticket/" + $scope.data.id,
      method: "PUT",
      data: jsoned,
      headers: headers
    }).then(function(response){
        //resolvemos los datos para entregarlos al usuario
        $scope.mensaje = response.data;
    },function(error){
        $scope.error = error
    });
  }

})

.controller('TicketCerradoCtrl',function($scope, $http, $stateParams, CONFIG){
  $http.get(CONFIG.APIURL  + "ticket/cerrado").then(function(response){
    //console.log(response.data);
    $scope.tickets = response.data;
  },function(error){
    $scope.error = error;
  });
});
