/* eslint-env browser, jquery */
$(function(){"use strict";var e=null,i=null;$.fn.api.settings.api={search:"/m/search/{query}"},$(".ui.nag").nag("show"),$(".ui.modal").modal({blurring:!0});var n=function(i){e=i,i&&$.ajax("/m/"+i,{dataType:"json",success:function(i){if(i&&i.movie&&i.movie.id===e){console.log(i.movie),$(".actors").empty();for(var n=function(e){o($(e.currentTarget).data("id"))},s=0;s<i.movie.cast.length;s++){var r=i.movie.cast[s],t=$('<div class="clickable two wide column"><img class="ui fluid circular image"><br><p><b class="name"></b><br><em class="role"></em></p></div>');t.data("id",r.id),t.find(".image").attr("src",r.imageUrl),t.find(".name").text(r.name),t.find(".role").text(r.role),t.click(n),$(".actors").append(t)}}}})},o=function(e){i=e,e&&$.ajax("/p/"+e,{dataType:"json",success:function(e){if(e&&e.person&&e.person.id===i){console.log(e.person);var n=$(".ui.modal");n.find(".header .name").text(e.person.name),n.find(".header .subname").text([e.person.age?"1"===e.person.age?"1 year old":e.person.age+" years old":"",e.person.alsoKnownAs&&e.person.alsoKnownAs.length>0?"also known as "+e.person.alsoKnownAs.join(", "):""].filter(function(e){return"string"==typeof e&&""!==e}).join(" • ")),n.find(".profile").attr("src",e.person.imageUrl),n.find(".bio").text(e.person.bio||""),n.find(".movies").empty();for(var o=0;o<e.person.movies.length;o++){var s=e.person.movies[o],r=$('<div class="four wide movie column"><img class="ui fluid rounded image"><br><p><b class="title"></b><br><em class="year"></em></p></div>');r.find(".image").attr("src",s.posterUrl),r.find(".title").text(s.title),r.find(".year").text(s.year),n.find(".movies").prepend(r)}n.modal("show")}}})};$(".ui.search").search({apiSettings:{onResponse:function(e){for(var i=0;i<e.movies.length;i++)for(var n in e.movies[i])e.movies[i].hasOwnProperty(n)&&!e.movies[i][n]&&delete e.movies[i][n];return e}},transition:"swing down",duration:300,cache:!1,fields:{results:"movies",description:"year",image:"posterUrl"},onSelect:function(e,i){return $(".poster").attr("src",e.posterUrl||""),$(".title").text(e.originalTitle+(e.year?" ("+e.year+")":"")),$(".subtitle").text(e.title!==e.originalTitle?e.title:""),$(".synopsis").text(e.description||""),n(e.id),!0},onResultsOpen:function(){$(".bodycontainer").dimmer("show")},onResultsClose:function(){$(".bodycontainer").dimmer("hide")}})});