
var app = angular.module("game", ["ngRoute", "ngResource"]);

app.config(function($routeProvider)
{
    $routeProvider
    .when("/page/:name", {
        templateUrl : function(page){
        	return "pages/"+page.name+".html"
        },
        controller: "pagesController"
    })
    .otherwise("/page/start");
})


.controller("pagesController",function($scope, $http){

	$http.get("?controller=user").success(function (data) {
		$scope.users = data;
	});
})


.controller("gameController", function ($scope, $rootScope, $http, $location) {

	$scope.level = 0;
	$scope.time = 3;
	$scope.score = 0;

	$rootScope.$on('eatOladushek', function () {
		$scope.level++;
		$scope.score += parseInt($rootScope.currentvkus);
	});

	$rootScope.$on('notEatOladushek', function () {

		if ($scope.time== 0)
		{
			$scope.time=0;
			$rootScope.$emit('endGame');
		}
		else
		{
			$scope.level++;
			$scope.time -= 1
		}
	});

	$rootScope.$on('endOladushek', function () {
		$rootScope.$emit('endGame');
	});

	$rootScope.$on('endGame', function () {
		$rootScope.totalScore = $scope.score;
		$location.path('/page/game_over');
	});

	$scope.sendData = function () {
		$http.post("?controller=user",
			{id:0, name: $scope.entername.username.$modelValue, score: $rootScope.totalScore})
			.success(function () {
				$location.path('/page/start');
			})
	}
})


.controller("menuController", function ($scope, $http) {
	$http.get("?controller=menu").success(function (data) {
		$scope.items = data;
	});
})


.controller("oladushek_controller", function ($http, $scope, $interval, $timeout, $rootScope) {

	var oladushki;

	$http.get("?controller=oladushek").success(function (data) {
		oladushki = data;
		$scope.next();
	});

	var current = 0;
	var isEnd = false;
	$scope.power = 0;
	$scope.vkus = 1;
	$scope.image = "images/oladushki/1.png";
	$scope.active = "hidden";

	var timer;
	$scope.x = 50;
	$scope.y = 20;

	var animation, time = 0;

	$scope.move = function ()
    {
		$scope.active = "visible";
		animation = $interval(function () {
			time += parseInt($scope.speed) / 5;
			$scope.x = 10 * Math.sin(time / 13) + 50;
			$scope.y = 50 * Math.cos(time / 13) + 20;
		}, 30);

		timer = $timeout(function () {
			$scope.notCaught();
		}, 8000)
	};

	$scope.notCaught = function () {
		$rootScope.$emit('notEatOladushek');
		$scope.stop();
	};

	$scope.caught = function () {
		$rootScope.$emit('eatOladushek');
		$timeout.cancel(timer);
		$scope.stop();
	};

	$scope.stop = function () {
		$scope.active = "hidden";
		$interval.cancel(animation);
		time = 0;
		$scope.x = 10;
		$scope.y = 50;

		if (!isEnd)
			$scope.next();
	};

	$scope.next = function () {

		if (current < oladushki.length)
		{
			$scope.vkus = oladushki[current].vkus;
			$rootScope.currentvkus = $scope.vkus;
			$scope.speed = oladushki[current].speed;
			$scope.image = oladushki[current].image;

			current++;

			$scope.move();
		}
		else
		{
			$rootScope.$emit('endOladushek');
		}
	};

	$rootScope.$on('endGame', function () {
		isEnd = true;
	});
})


.directive("header", function(){
	return {
		templateUrl:"directives/menu.html",
		replace: true,
		restrict: 'E',
		scope:{},
		controller: "menuController"
	}
})


.directive("oladushek", function () {
	return {
		templateUrl:"directives/oladushek.html",
		replace: true,
		restrict: 'E',
		scope:{},
		controller: "oladushek_controller"
	}
})