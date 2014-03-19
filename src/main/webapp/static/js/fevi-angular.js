var ng = angular.module('fevi', ['ionic', 'ngAnimate', 'ngResource'])
        
ng.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

ng.config(function($compileProvider){
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|javascript):/);
});

ng.factory('Cards', function($resource, $q) {
    var Cards;
          
      return {
        load: function(menu, page) {
            Cards = $resource('/api/:menu/today', {menu:'@menu', page:'@page'});
            var q = $q.defer();
            Cards.get({
                menu: menu,
                page: page
            }, function(resp) {
            q.resolve(resp);
            }, function(err) {
            q.reject(err);
            });

            return q.promise;
        },
        search: function(keyword) {
            Cards = $resource('/api/search', {keyword:'@keyword'}, {'query': {method: 'GET', isArray: true}});
            var q = $q.defer();
            Cards.get({
                keyword: keyword
            }, function(resp) {
            q.resolve(resp);
            }, function(err) {
            q.reject(err);
            });

            return q.promise;
        }
    }
});

ng.controller('FeviMenuCtrl', function($scope, $timeout, Cards, $ionicLoading) {

    $scope.busy = false;
    $scope.page = 1;
    
    $scope.header_left = function() {
        $scope.sideMenuController.toggleLeft();    
    }
    
    $scope.header_right = function() {
        $scope.sideMenuController.toggleRight();
    }

    $scope.attachCards = function() {
        addCards(Cards, $scope, $ionicLoading);
    }

    $scope.search = function(keyword) {
        if(keyword=== '') { location.reload(); }

        $.get('/api/search', {keyword:keyword}, function(cards) {
            if(!cards.length) {
                alert('검색 결과가 없습니다.');
            } else {
                $('.cardList').empty();
                for(i in cards) {
                    cardHtml(cards[i]);
                }
                $scope.$broadcast('scroll.resize');
                $scope.busy = true;
                $('.search-card').val('');
                $('.search-card').blur();
                $scope.sideMenuController.toggleRight();
                $('.scroll-content').scrollTop(0);
            }
        });
    };

    $scope.favorite = function(id) {
        if(favbusy) return;
        favbusy = true;

        if($('#' + id).attr('class') === 'tab-item') {
            
            favorite.push(id);
            $.post('/api/user',{"uid":feviuid, "favorite":favorite.toString()}, function(){
                $('#' + id).attr('class', 'tab-item favorite');
                favbusy = false;
            });

        } else {

            favorite = removeArrayElement(favorite, id.toString());
            $.post('/api/user',{"uid":feviuid, "favorite":favorite.toString()}, function(){
                $('#' + id).attr('class', 'tab-item');
                favbusy = false;
            });

        }    
    }

    $scope.detail = function(id) {
        location.href="/" + title + "/card?id=" + id;
    }

    $scope.openMenu = function(menu) {
        location.href = "/" + menu;
    }

    $scope.loadMore = function(done) {
        if(checkScroll($scope)) return;
        $scope.busy = true;

        $scope.loading = $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: false,
            showDelay: 500
        });

        page++;
        Cards.load(title, page).then(function(cards) {
            for(var i in cards.content) {
                cardHtml(cards.content[i]);
            }
            $scope.$broadcast('scroll.resize');
            $scope.busy = false;
            checkFavorite(cards.content, favorite);

            if(cards.content.length < 10) {
                $scope.busy = true;
            }
            done();
            $scope.loading.hide();
        });
    }

    initCard(Cards, $scope);
});

ng.directive('whenScrolled', function() {
    return function(scope, elm, attr) {
        var raw = elm[0];

        elm.bind('scroll', function() {
            if (raw.scrollTop + raw.offsetHeight + 1500 >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
        });
    };
}); 

ng.directive('inputEnter', function() {
        return function(scope, element, attrs, Cards) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.inputEnter + "('" + element[0].value + "')" );
                    });

                    event.preventDefault();
                }
            });
        };
});

var initCard = function(Cards, $scope) {

    $.get('/api/user',{"uid":feviuid}, function(data) {
        favorite = (data !== undefined) ? data.favorite.split(",") : [];
        if(type ==='cards') {
            $scope.cards = getNewCards(Cards, $scope, 0);
        } else if(type === 'favorite') {
            $scope.cards = getFavoriteCards(Cards, $scope, 0);
        }
    });
}

var getNewCards = function(Cards, $scope, page) {
    Cards.load(title, page).then(function(cards) {
            for(i in cards.content) {
                cardHtml(cards.content[i]);
            }
            $scope.$broadcast('scroll.resize');
            checkFavorite(cards.content, favorite);
        });
}

var getFavoriteCards = function(Cards, $scope) {
    if(favorite.length !== 0) {
        $.get('/api/favorite', {items:favorite.toString()}, function(cards){
            for(i in cards) {
                cardHtml(cards[i]);
            }
            $scope.$broadcast('scroll.resize');
            checkFavorite(cards, favorite);
        });
    } else {
        alert('즐겨찾기 항목이 없습니다.');
    }
}

var addCards = function(Cards, $scope, Loading) {
    if(checkScroll($scope)) return;
    
    $scope.busy = true;
    $scope.loading = Loading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: false,
            showDelay: 500
        });
    
    page++;
    
    Cards.load(title, page).then(function(cards) {
            for(i in cards.content) {
                cardHtml(cards.content[i]);
            }
            $scope.$broadcast('scroll.resize');
            $scope.loading.hide();
            $scope.busy = false;
            checkFavorite(cards.content, favorite);

            if(cards.content.length < 10) {
                $scope.busy = true;
            }
        });
}

var checkScroll = function($scope) {
    if(type === 'cards') {
        return $scope.busy;   
    } 

    return true;
}

var checkFavorite = function(Cards, items) {
    setTimeout(function() {
        for(var x in Cards) {
            for(var y in items ) {
                if(Cards[x].id === items[y]) {
                    $(document.getElementById(items[y])).attr('class', 'tab-item favorite');
                    $(document.getElementById(items[y])).attr('class', 'tab-item favorite').children().attr('src','/static/img/theme/favorite_enable.png');
                }
            }
        }
    }, 300);
}

var play = function(div) {

    var parent = $(div).parent();
    var data = parent.parent().children();
    var id = data[0].value;
    var source = data[1].value;

    _gaq.push(['_trackEvent', 'Videos', 'Play', id]);

    if(isAndroid()) {
        feviJs.play(source);
    } else {
        playWeb(div, id, source, parent);
    }

}

var playWeb = function(div, id, source, parent) {

    $(div).next().remove();
    $(div).remove();
    var ismobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
    if(ismobile){
        parent.prepend("<div class='item item-body card_video'>" + 
                        "<video class='card_video_player' controls autoplay>" +
                            "<source src='" + source + "' type='video/mp4'>" +
                            "<object data='" + source + "'>" +
                                "<embed src='https://www.facebook.com/video/embed?video_id=" + id + "'>" +
                            "</object>" +
                        "</video>" +
                    "</div>");
    } else {
        parent.prepend("<div class='item item-body card_video'>" + 
                        "<iframe src='https://www.facebook.com/video/embed?video_id=" + id + "' width='500' height='300' frameborder='0'></iframe>" +
                    "</div>");
    }    
}

var cardHtml = function(card) {

    var chtml = "<div class='card'>" + 
                    "<input type='hidden' value='" + card.id + "'/>" + 
                    "<input type='hidden' value='" + card.source + "'/>" + 
                    "<div class='item item-avatar'>" + 
                        "<img src='" + card.profile_image + "' />" + 
                        "<h2>" + card.name + "</h2>" +
                        "<p>" + card.updated_time + "</p>" +
                    "</div>" +
                    "<div class='item item-body card_image' >" +
                        "<a href='javascript:void(0)' class='play_button' onclick='play(this); return false;'>" +
                            "<img src='/static/img/play_button.png' />" + 
                        "</a>" +
                        "<img class='card_img' src='" + card.picture + "''>" +
                    "</div>" +
                    "<div class='item item-body card-description'>" +
                        "<pre>" + card.description + "</pre>" +
                        "<p>" +
                            "<i class='icon ion-thumbsup'></i>&nbsp;" +
                             card.likes_size + "Like&nbsp;&nbsp;" +
                            "<i class='icon ion-chatbox'></i>&nbsp;" +
                            card.comments_size + "Comments" +
                        "</p>" +
                    "</div>" +
                    "<div class='item tabs tabs-secondary tabs-icon-left card-bottom-menu' >" +
                        "<a class='tab-item' id='" + card.id + "' onclick='cardFavorite(" + card.id + ");'>" +
                              "<img class='favorite-button' src='/static/img/theme/favorite.png'/>" +
                        "</a>" +
                        "<a class='tab-item' onclick='cardDetail(" + card.id + ")'>" +
                              "<img class='view-button' src='/static/img/theme/view_more.png'/>" +
                        "</a>" +
                    "</div>" +
                "</div>";

    $('.cardList').append(chtml);
}

var cardDetail = function(id) {
        _gaq.push(['_trackEvent', 'Detail', 'click', id]);
        location.href="/" + title + "/card?id=" + id;
    }

var cardFavorite = function(id) {
        if(favbusy) return;
        favbusy = true;

        _gaq.push(['_trackEvent', 'Favorite', 'click', id]);

        if($('#' + id).attr('class') === 'tab-item') {
            favorite.push(id);
            $.post('/api/user',{"uid":feviuid, "favorite":favorite.toString()}, function(){
                $('#' + id).attr('class', 'tab-item favorite');
                $('#' + id).children().attr('src','/static/img/theme/favorite_enable.png');
                favbusy = false;
            });

        } else {
            favorite = removeArrayElement(favorite, id.toString());
            $.post('/api/user',{"uid":feviuid, "favorite":favorite.toString()}, function(){
                $('#' + id).attr('class', 'tab-item');
                $('#' + id).children().attr('src','/static/img/theme/favorite.png');
                favbusy = false;
            });

        }    
    }

