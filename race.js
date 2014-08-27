/**
 * Created by villep on 26.8.2014.
 */
app.controller("RaceController", function ($scope, $http) {


    $scope.$watch('$viewContentLoaded', function () {
        getRaces();
    });

    $scope.races = [];

    $scope.status = {
        isopen: false
    };

    $scope.toggled = function(open) {
        alert("FOO");
        console.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };


    function getRaces() {
        $http({method: 'GET', url: '//api.github.com/repos/pynttvi/char-creator-data/contents/races.txt'}).
            success(function (data, status, headers, config) {

                var raceFile = atob(data.content);
                var lines = raceFile.split('\n');
                for (var i = 0; i < lines.length; i++) {
                    if (lines[i].lastIndexOf("#", 0) !== 0) {
                        var cols = lines[i].split(":");
                        $scope.races.push({
                            id: i,
                            name: cols[0],
                            str: cols[1],
                            dex: cols[2],
                            con: cols[3],
                            int: cols[4],
                            wis: cols[5],
                            cha: cols[6],
                            siz: cols[7],
                            exp: cols[8],
                            spr: cols[9],
                            hpr: cols[10],
                            skimax: cols[11],
                            spemax: cols[12],
                            skicost: cols[13],
                            specost: cols[14]
                        });
                    }
                }
            }).
            error(function (data, status, headers, config) {
                alert("error:"+status);
                alert("error:"+data);
            });
    }
});
