/* eslint-env browser, jquery */

$(function () {
  'use strict';

  var movieId = null;

  $.fn.api.settings.api = {
    'search': '/m/search/{query}'
  };

  $('.ui.nag').nag('show');

  $('.ui.search').search({
    apiSettings: {
      onResponse: function (res) {
        for (var i = 0; i < res.movies.length; i++) {
          for (var key in res.movies[i]) {
            if (res.movies[i].hasOwnProperty(key) && !res.movies[i][key]) {
              delete res.movies[i][key];
            }
          }
        }
        return res;
      }
    },
    transition: 'swing down',
    duration: 300,
    cache: false,
    fields: {
      results: 'movies',
      description: 'year',
      image: 'posterUrl'
    },
    onSelect: function (result, res) {
      movieId = result.id;
      var title = result.title || '';
      var originalTitle = result.originalTitle || '';
      var year = result.year || '';

      $('.poster').attr('src', result.posterUrl || '');
      $('.title').text(originalTitle + (year ? ' (' + year + ')' : ''));
      $('.subtitle').text(title !== originalTitle ? title : '');

      $.ajax('/m/' + result.id, {
        dataType: 'json',
        success: function (answer) {
          if (!answer || !answer.movie || answer.movie.id !== movieId) { return; }
          console.log(answer.movie);
          $('.actors').empty();
          for (var actor = 0; actor < answer.movie.cast.length; actor++) {
            var person = answer.movie.cast[actor];
            $('.actors').append('<div class="two wide column"><img class="ui fluid circular image" src="' + person.imageUrl + '"><br><p><b>' + person.name + '</b><br><i>' + person.role + '</i></p></div>');
          }
        }
      });

      return true;
    },
    onResultsOpen: function () {
      $('.bodycontainer').dimmer('show');
    },
    onResultsClose: function () {
      $('.bodycontainer').dimmer('hide');
    }
  });
});
