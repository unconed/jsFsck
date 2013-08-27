var jsFsck = (function () {

  /*
    Note: jsFsck is not safe. It can only fsck basic JavaScript and will
    mercilessly clobber variables, comments and strings. Sometimes it
    generates invalid code. Don't bother trying to use this in production
    to hide real code, it won't work.
  */

  function r(n) {
    return Math.floor(Math.random() * (n - .0001));
  }

  function noise(level) {
    var b = "+-/*%&|";
    var u = "~!";
    var nouns = ['window', 'document', 'document.body', 'navigator', 'console', 'setTimeout', 'setInterval', 'requestAnimationFrame', 'null', 'true', 'false', 'undefined', 'Infinity', 'NaN', ];

    var reserved = ['break', 'case', 'catch', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'finally', 'for', 'function', 'if', 'in', 'instanceof', 'new', 'return', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'class', 'enum', 'export', 'extends', 'import', 'super', 'implements', 'interface', 'let', 'package', 'private', 'protected', 'public', 'static', 'yield', ];

    function fakeout() {
      // For maximum confusion
      var list = [
        'getAchievement',
        'getAchievement',
        'achievement',
        'secretEncryptionKey',
        'pmt',
        'pmt',
        'pmt',
        'pmt',
        'pmt',
        'eval',
        'eval',
        'eval',
        'eval',
        'eval',
        'eval',
        '$',
        '$$',
        'lacv',
        'qacv',
        'list',
        'sdqwm',
        'original'
      ];

      var name = r(5) > 1 ? k(6) : list[r(list.length)];

      switch (r(3)) {
        case 0:
          return ' var '+ name +' ';
        case 1:
          return ' function '+ name +'(){' + (''+token(1)) + '}';
        case 2:
          return ' var '+ name +'='+ token(1);
      }
    }

    function s(n, raw) {
      var n = r(n || 20);
      var t = '';
      var m = " !@#$%^&*(){}[]?\\:'.,<>`~_+|\\";
      for (var i = 0; i < n; ++i) {
        if (r(8) == 1) t += fakeout();
        if (r(5) > 3)
          t += m[r(m.length)];
        else
          t += String.fromCharCode(65 + Math.min(1, r(6)) * 32 + r(26));
      }
      return raw ? t : JSON.stringify(t);
    }

    function k(n) {
      var nn = r(n || 20) + 1;
      var t = '';
      for (var i = 0; i < nn; ++i) {
        t += String.fromCharCode(65 + Math.min(1, r(6)) * 32 + r(26));
      }
      if (reserved.indexOf(t) >= 0) return k(n);
      return t;
    }

    function statement(recurse) {
      recurse -= Math.random();
      if (recurse < 0) { return leaf(); }

      var c = r(20);
      switch (c) {
      case 0:
      case 1:
        return s(12);
      case 2:
      case 3:
        return statement(recurse) + ';' + statement(recurse) + ';' + statement(recurse);
      case 4:
      case 5:
        return statement(recurse) + ';' + statement(recurse);
      case 6:
      case 7:
      case 8:
      case 9:
        return 'var ' + k(6) + '=' + token(recurse);
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
        var t = '' + token(recurse);
        if (t.match(/function/)) return '(' + t + ')';
        return t;
      case 16:
      case 17:
        var args = [];
        for (var i = r(recurse + 2); i >= 0; --i) {
          args.push(k(6));
        }
        return '(function (' + args.join(',') + ') {' + statement(recurse + 1) + '})()';
      case 18:
      case 19:
        recurse-=1+Math.random();

        var out = [];

        var e = r(2);
        var obj1, obj2;
        var type;
        if (e) {
          var items = [];
          for (var i = r(10); i >= 0; --i) {
            items.push(token(recurse));
          }
          var cut = r(items.length - 1) + 1;
          obj1 = '[' + items.slice(0, cut).join(',') + ']';
          obj2 = '[' + items.slice(cut).join(',') + ']';
          type = 'array';
        }
        else {
          var items = [];
          for (var i = r(10); i >= 0; --i) {
            items.push("'" + k() + "':" + token(recurse));
          }
          var cut = r(items.length - 1) + 1;
          obj1 = '({' + items.slice(0, cut).join(',') + '})';
          obj2 = '({' + items.slice(cut).join(',') + '})';
          type = 'object';
        }

        var args = [];
        for (var i = r(5); i >= 0; --i) {
          args.push(k(6));
        }
        var cut = r(args.length - 1) + 1;
        var retk1 = k(6);
        var closure1 = 'function (' + args.slice(0, cut).join(',') + ') {'
                     + statement(recurse)
                     +'; var '+ retk1 +' = '+ token(recurse) +';'
                     + statement(recurse)
                     + '; return ' + retk1 + ';}';

        var retk2 = k(6);
        var closure2 = 'function (' + args.slice(cut).join(',') + ') {'
                     + statement(recurse)
                     +'; var '+ retk2 +' = '+ token(recurse) +';'
                     + statement(recurse)
                     + '; return ' + retk2 + ';}';

        var key1 = k(6);
        var key2 = k(6);
        var key3 = k(6);
        var key4 = k(6);
        out.push("var " + key1 +' ='+ obj1);
        for (var i = r(2) + 1; i >= 0; --i)
          out.push(statement(recurse - 1));
        out.push("var " + key2 +' ='+ obj2);
        for (var i = r(2) + 1; i >= 0; --i)
          out.push(statement(recurse - 1));

        var d = r(5);
        switch (d) {
          case 0:
            out.push('_.each('+ key1 +', '+ closure1 +')');
            out.push(statement(recurse));
            out.push('var '+ key3 +' = _.map('+ key2 +', '+ closure2 +')');
            break;
          case 1:
            var method = type == 'array' ? 'zip' : 'extend';
            out.push('var '+ key3 + ' = _.'+ method +'('+ key1 +', '+ key2 +')');
            out.push(statement(recurse));
            out.push('var '+ key4 +' = _.map('+ key3 +', '+ closure1 +')');
            break;
          case 2:
            out.push('var '+ key3 +' = _.sortBy('+ key1 +', '+ closure1 +')');
            out.push(statement(recurse));
            out.push('var '+ key4 +' = _.reduce('+ key3 +', '+ closure2 +', 0)');
            break;
          case 3:
            out.push('var '+ key3 + '= _.filter('+ key1 +', '+ closure1 +')');
            out.push(statement(recurse));
            out.push('var '+ key4 + '= _.contains('+ key1 +', '+ token(recurse) +')');
            break;
          case 4:
            var method = type == 'array' ? 'indexOf' : 'contains';
            out.push('var '+ key3 + '= _.' + method +'('+ key1 +', '+ key2 +')');
            out.push(statement(recurse));
            out.push('var '+ key4 + '= _.find('+ key3 +', '+ closure1 +')');
            break;
        }
        var underscore = out.join(' ; ');

        return underscore;
      }
    }

    function leaf() {
      var c = r(10);
      switch (c) {
      case 0:
      case 1:
        return s(10);
      case 2:
      case 3:
      case 4:
        return r(2) > 0 ? r(10000) : -r(10000);
      case 5:
      case 6:
        return Math.round(r(10000) / (Math.random() + 1) * 1000) / 1000;
      case 7:
        return nouns[r(nouns.length)];
      case 8:
        return '({})';
      case 9:
        return '[]';
      }
    }

    function token(recurse) {
      recurse -= 1 + Math.random();

      if (recurse < 0) {
        return leaf();
      }

      var c = r(7);
      switch (c) {
      case 0:
        return (token(recurse) + b[r(b.length)] + token(recurse)).replace(/--/g, '-');
      case 1:
        return u[r(u.length)] + token(recurse);
      case 2:
      case 3:
        var out = [];
        for (var i = r(5); i >= 0; --i) {
          out.push("'" + k() + "':" + token(recurse));
        }
        return '({' + out.join(',') + '})';
      case 4:
        var out = [];
        for (var i = r(5); i >= 0; --i) {
          out.push(token(recurse));
        }
        return '[' + out.join(',') + ']';
      case 5:
        var args = [];
        for (var i = r(5); i >= 0; --i) {
          args.push(k(6));
        }
        var retk = k(6);
        return 'function(' + args.join(',') + ') {'
               + statement(recurse)
               +'; var '+ retk +' = '+ token(recurse) +';'
               + statement(recurse)
               + '; return ' + retk + ';}';
      case 6:
        var out = [];
        for (var i = r(10); i > 0; --i) {
          out.push(s(3, true));
        }
        var c = out.join(' ').replace(/\*\//g, '');
        var f = r(2);
        var t = token(recurse);

        return f ? '/*' + c + '*/' + t : t + '/*' + c + '*'+'/';

      }
    }

    level = level || 3;

    return statement(level);
  }


  return function fsck(s, level) {
    level = level || 1;

    var o = s.replace(/\/\*.*?\*\//g, '');
    var n = o.length;

    s = s.split(/(?=\/\*)|(?=\*\/)/);
    s = s.map(function (t) {
      if (!t.match(/^\/\*(_X_X_)?/)) {
        return t.replace(/([),;])/g, function(v) {
          if (r(4) > 2) {
            var string;
            var rev = r(2);
            if (r(2) > 1) {
              var a = r(n - 40) + 20;
              var b = a + r(30) + 5;

              string = o.substring(a, b);
            }
            else {
              string = noise(r(level)+1);
            }
            if (rev) string = string.split("").reverse().join("")
            else string = '\u202e' + string;

            return "/*" + string.replace(/\*\//g, '') + "*" + "/ " + v + " ";
          }
          return v;
        });
      }
      return t;
    });
    s = s.join('');

    s = s.split(/(?=\/\*)|(?=\*\/)/);
    s = s.map(function (v) {
      if (!v.match(/^\/\*(_X_X_)?/)) {
        v = v.replace(/;/g, function() {
          if (r(3) > 1) {
            return ';' + noise(r(level)+1) +';'+ noise(r(level)+1) + ';';
          }
          return ';';
        });
        v = v.replace(/\)\s+\{/g, function() {
          return '){' + noise(r(level)+1) + ';' + noise(r(level)+1) + ';';
        });
      }
      return v;
    });
    s = s.join('');

    s = "/*\u202e*" + "/(function () {"
      + [noise(4), noise(3), noise(level), s, noise(level + 1), ''].join(';')
      +"})();";

    s = s.replace(/\s*([{}():;,=])\s*/g, '$1');
    s = s.replace(/;;/g, ';');

    return s;
  }

})();
