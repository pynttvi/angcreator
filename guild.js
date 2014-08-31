/**
 * Created by villep on 27.8.2014.
 */
app.controller("GuildController", function ($scope, $http, $filter) {

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


            if (guild.type == 'sub') {
                var subs = $filter('filter')($scope.reinc.guilds, {parent: guild.parent});
                var chosenSubguildLevels = 0;
                angular.forEach(subs, function (sub, i) {
                    if (sub.chosenLevels > 0)
                        chosenSubguildLevels += chosenSubguildLevels;
                });
                availableLevels = 15 - chosenSubguildLevels;
                if (availableLevels > guild.levels)
                    availableLevels = guild.levels;

            }
            if (availableLevels == 0)
                availableLevels = "";

            return availableLevels;
        }


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
                var chosenLevels = $scope.reinc.guilds[i].chosenLevels;
                if (chosenLevels == "")
                    chosenLevels = 0;
                levels += chosenLevels;
            }
            return levels;
        }

        function removeSubguildsFromGuild(guild) {
            var spliced = false;
            angular.forEach($scope.reinc.guilds, function (myGuild, i) {
                if (myGuild.parent == guild.name) {
                    myGuild.chosenLevels = "";
                    $scope.reinc.guilds.splice(i, 1);
                    spliced = true;
                }
            });
            angular.forEach($scope.guilds, function (myGuild, i) {
                if (myGuild.parent == guild.name) {
                    myGuild.chosenLevels = "";
                    $scope.guilds.splice(i, 1);
                    spliced = true;
                }

            });

            if (spliced == true)
                removeSubguildsFromGuild(guild);
        }

        $scope.updateGuild = function (guild) {
            var totalLevels = getChosenLevelsAmount();
            var chosenLevels = guild.chosenLevels;
            var subguilds = getSubguildsByGuild(guild);

            if (chosenLevels < 45 && subguilds.length > 0 && guild.type == 'primary') {
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
                    if (guild.type == 'primary' && subguilds.length == 0)
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
                if (exists == true && guild.type == 'primary') {
                    removeSubguildsFromGuild(guild);
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
                            type: 'primary',
                            parent: ""
                        });
                    }
                }).
                error(function (data, status, headers, config) {
                    alert("error:" + status);
                    alert("error:" + data);
                });
        }

        function getSubguildsByGuild(guild) {
            return $filter('filter')($scope.reinc.guilds, {type: 'sub', parent: guild.name});
        }


        function getSubguilds(guild) {
            var subguilds = getSubguildsByGuild(guild);
            if (guild.chosenLevels == 45 && subguilds.length == 0) {
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
                                var found = $filter('filter')($scope.guilds, {name: cols[0]});
                                if (found.length == 0) {
                                    $scope.guilds.push({
                                        name: cols[0],
                                        levels: cols[1],
                                        chosenLevels: "",
                                        type: 'sub',
                                        parent: guild.name
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
    }
)
;

