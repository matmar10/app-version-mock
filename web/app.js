
var app = angular.module('desjAppVersionMock', []);

app.controller('MainCtrl', function($http, $timeout, $scope) {

    var loadVersions = null,
        parseVersionAsInteger = function (version) {
            return parseInt(version.replace(/\./g, ''));
        },
        minimumLessOrEqualRequired = function (platform, versionSpecifier, versionValue) {
            var min = null,
                current = null;
            if('versionMinimum' === versionSpecifier) {
                min = parseVersionAsInteger(versionValue);
                current = parseVersionAsInteger($scope.versions[platform].versionCourante);
            }
            if('versionCourante' === versionSpecifier) {
                min = parseVersionAsInteger($scope.versions[platform].versionMinimum);
                current = parseVersionAsInteger(versionValue);
            }
            return min <= current;
        };

    $scope.loading = {
        Android: {
            versionCourante: true,
            versionMinimum: true
        },
        Blackberry: {
            versionCourante: true,
            versionMinimum: true
        }
    };

    $scope.errors = {
        Android: {
            versionCourante: false,
            versionMinimum: false
        },
        Blackberry: {
            versionCourante: false,
            versionMinimum: false
        }
    };

    $scope.successMessage = {
        Android: {
            versionCourante: false,
            versionMinimum: false
        },
        Blackberry: {
            versionCourante: false,
            versionMinimum: false
        }
    };

    $scope.newVersion = {
        Android: {
            versionCourante: null,
            versionMinimum: null
        },
        Blackberry: {
            versionCourante: null,
            versionMinimum: null
        }
    };

    $scope.versions = {
        Android: {
            versionCourante: 'loading',
            versionMinimum: 'loading'
        },
        Blackberry: {
            versionCourante: 'loading',
            versionMinimum: 'loading'
        }
    };

    $http({
        method: 'GET',
        url: 'api/version'
    }).then(function(response) {
        $scope.versions = response.data;
        $scope.loading = {
            Android: {
                versionCourante: false,
                versionMinimum: false
            },
            Blackberry: {
                versionCourante: false,
                versionMinimum: false
            }
        };
    });



    $scope.updateVersion = function(platform, versionSpecifier, versionValue) {

        $scope.errors[platform][versionSpecifier] = false;
        $scope.successMessage[platform][versionSpecifier] = false;

        if(null === versionValue.match(/^(\d+\.)?(\d+\.)?(\d+)$/)) {
            $scope.errors[platform][versionSpecifier] = 'The version number you provided is not valid. The valid format is <em>n.n.n</em> (example: 1.0.3).';
            return;
        }

        if(!minimumLessOrEqualRequired(platform, versionSpecifier, versionValue)) {
            $scope.errors[platform][versionSpecifier] = "The minimum version must be less than or equal to the current version (how can you expect someone to download a minimum version that doesn't exist yet?";
            return;
        }

        $scope.loading[platform][versionSpecifier] = true;
        $scope.newVersion[platform][versionSpecifier] = null;

        $http({
            contentType: 'text/plain',
            data: versionValue,
            method: 'PUT',
            url: '/api/version/platform/versionSpecifier'
                .replace(/platform/, platform)
                .replace(/versionSpecifier/, versionSpecifier)
        }).then(function(response) {
            $timeout(function() {
                $scope.versions = response.data;
                $scope.errors[platform][versionSpecifier] = false;
                $scope.loading[platform][versionSpecifier] = false;
                $scope.successMessage[platform][versionSpecifier] = true;
                $timeout(function() {
                    $scope.successMessage[platform][versionSpecifier] = false;
                }, 3000);
            }, 1000);
        });

    };

});