/* eslint-env browser, jquery */

$(function () {
  'use strict';

  var movieId = null;
  var personId = null;

  $.fn.api.settings.api = {
    'search': '/m/search/{query}'
  };

  $('.ui.nag').nag('show');
  $('.ui.modal').modal({ blurring: true });

  var showMovie = function (id) {
    movieId = id;
    if (!id) { return; }

    $.ajax('/m/' + id, {
      dataType: 'json',
      success: function (answer) {
        if (!answer || !answer.movie || answer.movie.id !== movieId) { return; }
        console.log(answer.movie);
        $('.actors').empty();
        var clickListener = function (e) {
          showPerson($(e.currentTarget).data('id'));
        };
        for (var actor = 0; actor < answer.movie.cast.length; actor++) {
          var person = answer.movie.cast[actor];
          var column = $('<div class="clickable two wide column"><img class="ui fluid circular image"><br><p><b class="name"></b><br><em class="role"></em></p></div>');
          column.data('id', person.id);
          column.find('.image').attr('src', person.imageUrl);
          column.find('.name').text(person.name);
          column.find('.role').text(person.role);
          column.click(clickListener);
          $('.actors').append(column);
        }
      }
    });
  };

  var showPerson = function (id) {
    personId = id;
    if (!id) { return; }

    $.ajax('/p/' + id, {
      dataType: 'json',
      success: function (answer) {
        if (!answer || !answer.person || answer.person.id !== personId) { return; }
        console.log(answer.person);
        var modal = $('.ui.modal');
        modal.find('.header .name').text(answer.person.name);
        modal.find('.header .aka').text(answer.person.alsoKnownAs && answer.person.alsoKnownAs.length > 0 ?
            'also known as ' + answer.person.alsoKnownAs.join(', ') : '');
        modal.find('.profile').attr('src', answer.person.imageUrl);
        modal.find('.movies').empty();
        for (var cast = 0; cast < answer.person.movies.length; cast++) {
          var movie = answer.person.movies[cast];
          var column = $('<div class="four wide movie column"><img class="ui fluid rounded image"><br><p><b class="title"></b><br><em class="year"></em></p></div>');
          column.find('.image').attr('src', movie.posterUrl);
          column.find('.title').text(movie.title);
          column.find('.year').text(movie.year);
          modal.find('.movies').prepend(column);
        }
        modal.modal('show');
      }
    });
  };

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
      $('.poster').attr('src', result.posterUrl || '');
      $('.title').text(result.originalTitle + (result.year ? ' (' + result.year + ')' : ''));
      $('.subtitle').text(result.title !== result.originalTitle ? result.title : '');
      showMovie(result.id);
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
