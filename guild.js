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

        var totalLevels = getChosenLevelsAmount();
        var availableLevels = 120 - totalLevels;

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
        var totalLevels = getChosenLevelsAmount();
        if ($scope.reinc.freeLevels > 0 && totalLevels > 120)
            $scope.reinc.freeLevels = 0
    }

    function getChosenLevelsAmount() {
        var levels = 0;
        levels += $scope.reinc.freeLevels
        var chosenGuildsListLength = $scope.reinc.guilds.length;
        for (var i = 0; i < chosenGuildsListLength; i++) {
            levels += $scope.reinc.guilds[i].chosenLevels;
            for (var j = 0; j < $scope.reinc.guilds[i].subguilds.length; j++) {
                if ($scope.reinc.guilds[i].subguilds[j].chosenLevels > 0)
                    levels += $scope.reinc.guilds[i].subguilds[j].chosenLevels;
            }
        }
        console.log(levels);
        return levels;
    }

    function removeSubguildsFromGuild(guild) {
        guild.subguilds = [];
        for (var i = 0; i < $scope.reinc.guilds.length; i++) {
            if (guild.name == $scope.reinc.guilds[i].name) {
                for (var j = 0; j < $scope.reinc.guilds[i].subguilds.length; j++)
                    $scope.reinc.guilds[i].subguilds = [];
            }
        }
    }

    $scope.updateGuild = function (guild) {
        var totalLevels = getChosenLevelsAmount();
        var chosenLevels = guild.chosenLevels;

        if (chosenLevels < 45 && guild.subguilds != null) {
            removeSubguildsFromGuild(guild);
        }

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
                getSubguilds(guild);
                $scope.reinc.guilds.push(guild);

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
                removeSubguildsFromGuild(guild)
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
                        levels: cols[1],
                        chosenLevels: "",
                        subguilds: []
                    });
                }
            }).
            error(function (data, status, headers, config) {
                alert("error:" + status);
                alert("error:" + data);
            });
    }

    function getSubguilds(guild) {
        if (guild.chosenLevels == 45 && guild.subguilds.length == 0) {
            var guildFileName = guild.name.replace(" ", "-").toLowerCase() + ".chr"
            $http({method: 'GET', url: '//api.github.com/repos/pynttvi/char-creator-data/contents/' + guildFileName}).
                success(function (data, status, headers, config) {

                    var guildFile = atob(data.content);
                    var lines = guildFile.split('\n');
                    var subGuildsStartIndex
                    for (var i = 0; i < lines.length; i++) {
                        if (lines[i].contains("Subguilds:") == true)
                            subGuildsStartIndex = i;

                        if (subGuildsStartIndex != null && subGuildsStartIndex < i && lines[i] != "") {
                            var cols = lines[i].split(" ");
                            var exists = false;
                            for (var j = 0; j < guild.subguilds.length; j++) {
                                if (cols[0] == guild.subguilds[j].name) {
                                    exists = true;
                                }
                            }
                            if (exists == false) {
                                guild.subguilds.push({
                                    name: cols[0],
                                    levels: cols[1]
                                });
                            }
                        }
                    }
                }).
                error(function (data, status, headers, config) {
                    alert("error:" + status);
                    alert("error:" + data);
                });
        }
        else {
            removeSubguildsFromGuild(guild);
        }
    }
});

