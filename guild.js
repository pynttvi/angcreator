/**
 * Created by villep on 27.8.2014.
 */
app.controller("GuildController", function ($scope, $http) {

    $scope.guilds = [];
    var spinner = $("#spinner").spinner();

    $scope.$watch('$viewContentLoaded', function () {
        getGuilds();
    });

    $scope.availableLevels = function (guild) {
        var availableLevels = 45;

        var totalLevels = 0
        totalLevels += $scope.reinc.freeLevels
        var chosenGuildsListLength = $scope.reinc.guilds.length;
        for (var i = 0; i < chosenGuildsListLength; i++) {
            totalLevels += $scope.reinc.guilds[i].chosenLevels;
        }

        availableLevels = 120 - totalLevels;

        if (guild.levels < availableLevels)
            availableLevels = guild.levels;
        else if (totalLevels >= 120)
            availableLevels = 0;
        else if (availableLevels > 45)
            availableLevels = 45;
        else
            availableLevels = 120 - totalLevels;

        if (availableLevels == 0)
            availableLevels = ""

        return availableLevels;
    };

    $scope.updateFreeLevels = function () {
        var totalLevels = 0
        var freeLevels = $scope.reinc.freeLevels
        totalLevels += freeLevels
        var chosenGuildsListLength = $scope.reinc.guilds.length;
        for (var i = 0; i < chosenGuildsListLength; i++) {
            totalLevels += $scope.reinc.guilds[i].chosenLevels;
        }
        if (freeLevels > 0 && totalLevels > 120)
            $scope.reinc.freeLevels = 0

    }


    $scope.updateGuild = function (guild) {
        var totalLevels = 0
        totalLevels += $scope.reinc.freeLevels
        var chosenGuildsListLength = $scope.reinc.guilds.length;
        for (var i = 0; i < chosenGuildsListLength; i++) {
            totalLevels += $scope.reinc.guilds[i].chosenLevels;
        }


        var chosenLevels = guild.chosenLevels
        if (chosenLevels > 0) {

            var exists = false;
            for (var i = 0; i < $scope.reinc.guilds.length; i++) {
                if (guild.name == $scope.reinc.guilds[i].name)
                    exists = true;
            }
            if (exists == false) {
                if (totalLevels >= 120) {
                    guild.chosenLevels = "";
                    return;
                }
                $scope.reinc.guilds.push({
                    name: guild.name,
                    chosenLevels: chosenLevels
                });
            }
        }

        if (chosenLevels == 0 || chosenLevels == '') {

            var exists = false;
            var itemIndex = 0;
            for (var i = 0; i < $scope.reinc.guilds.length; i++) {
                if (guild.name == $scope.reinc.guilds[i].name) {
                    exists = true;
                    itemIndex = i;
                }
            }
            if (exists == true) {
                $scope.reinc.guilds.splice(itemIndex, 1);
            }
        }
    };

    function getGuilds() {
        $http({method: 'GET', url: '//api.github.com/repos/pynttvi/char-creator-data/contents/guilds.chr'}).
            success(function (data, status, headers, config) {

                var guild = atob(data.content);
                var lines = guild.split('\n');
                for (var i = 0; i < lines.length; i++) {
                    var cols = lines[i].split(" ");
                    $scope.guilds.push({
                        id: i,
                        name: cols[0],
                        levels: cols[1]
                    });
                }
            }).
            error(function (data, status, headers, config) {
                alert("error:" + status);
                alert("error:" + data);
            });
    }

});

