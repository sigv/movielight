/* eslint-env browser, jquery */

$(function () {
  'use strict';

  var openMovie = {};
  var openPerson = {};

  $.fn.api.settings.api = {
    'search': '/m/search/{query}'
  };

  $('.ui.modal').modal({
    blurring: true,
    onHide: function ($element) {
      openPerson = {};
      history.pushState({}, '', '/#/m' + (openMovie.id || '') + '/p' + (openPerson.id || ''));
      document.title = (openMovie.title ? openMovie.title + ' • ' : '') + 'Movie Light';
    }
  });

  var showMovie = function (id) {
    openMovie = { id: id };
    if (!id) { return; }

    $.ajax('/m/' + id, {
      dataType: 'json',
      success: function (answer) {
        if (!answer || !answer.movie || answer.movie.id !== openMovie.id) { return; }
        history.pushState({}, '', '/#/m' + (openMovie.id || '') + '/p' + (openPerson.id || ''));
        openMovie = answer.movie;
        document.title = (openPerson.name ? openPerson.name : answer.movie.title) + ' • Movie Light';

        $('.poster').attr('src', answer.movie.posterUrl || '');
        $('.title').text(answer.movie.originalTitle + (answer.movie.year ? ' (' + answer.movie.year + ')' : ''));
        $('.subtitle').text(answer.movie.title !== answer.movie.originalTitle ? answer.movie.title : '');
        $('.synopsis').text(answer.movie.description || '');

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
    openPerson = { id: id };
    if (!id) { $('.ui.modal').modal('hide'); return; }

    $.ajax('/p/' + id, {
      dataType: 'json',
      success: function (answer) {
        if (!answer || !answer.person || answer.person.id !== openPerson.id) { return; }
        history.pushState({}, '', '/#/m' + (openMovie.id || '') + '/p' + (openPerson.id || ''));
        openPerson = answer.person;
        document.title = answer.person.name + ' • Movie Light';

        var modal = $('.ui.modal');
        modal.find('.header .name').text(answer.person.name);
        modal.find('.header .subname').text([
          answer.person.age ? answer.person.age === '1' ? '1 year old' : answer.person.age + ' years old' : '',
          answer.person.alsoKnownAs && answer.person.alsoKnownAs.length > 0 ? 'also known as ' + answer.person.alsoKnownAs.join(', ') : ''
        ].filter(function (item) { return typeof item === 'string' && item !== ''; }).join(' • '));
        modal.find('.profile').attr('src', answer.person.imageUrl);
        modal.find('.bio').text(answer.person.bio || '');
        modal.find('.movies').empty();
        var clickListener = function (e) {
          openPerson = {};
          showMovie($(e.currentTarget).data('id'));
          setTimeout(function () {
            modal.modal('hide');
          }, 1);
        };
        for (var cast = 0; cast < answer.person.movies.length; cast++) {
          var movie = answer.person.movies[cast];
          var column = $('<div class="clickable four wide movie column"><img class="ui fluid rounded image"><br><p><b class="title"></b><br><em class="year"></em></p></div>');
          column.data('id', movie.id);
          column.find('.image').attr('src', movie.posterUrl);
          column.find('.title').text(movie.title);
          column.find('.year').text(movie.year);
          column.click(clickListener);
          modal.find('.movies').prepend(column);
        }
        setTimeout(function () {
          modal.modal('show');
        }, 1);
      }
    });
  };

  window.onhashchange = function () {
    var hashMatch = location.hash.match(/^#\/m([0-9]*)\/p([0-9]*)$/);

    var movieId = hashMatch ? parseInt(hashMatch[1], 10) || null : null;
    if (movieId !== null ? movieId !== openMovie.id : (typeof openMovie.id !== 'undefined' && openMovie.id !== null)) {
      showMovie(movieId);
    }

    var personId = hashMatch ? parseInt(hashMatch[2], 10) || null : null;
    if (personId !== null ? personId !== openPerson.id : (typeof openPerson.id !== 'undefined' && openPerson.id !== null)) {
      showPerson(personId);
    }
  };
  window.onhashchange();

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
      $('.synopsis').text(result.description || '');
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
