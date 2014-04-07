/* jslint nomen: true, plusplus: true, white: true, indent: 2, maxlen: 120 */

/**
 * Base namespace for JEZ.
 */
var JEZ = JEZ || {},
    JEZ_locale = [];

(function(win, undef) {
  'use strict';

  var doc = win.document,
      JEZ_locale = win.JEZ_locale;

  /**
   * JEZ
   *
   * @version 0.1.2
   */
  JEZ = {
    'keys': {
      'ENTER': 13,
      'ESCAPE': 27,
      'SPACE': 32,
      'END': 35,
      'HOME': 36,
      'LEFT': 37,
      'UP': 38,
      'RIGHT': 39,
      'DOWN': 40,
      'ZERO': 48,
      'NINE': 57
    },
    // Localization
    '__': function(locale) {
      var lang = JEZ_locale[locale] || {};

      return function(collocation) {
        return lang[collocation] || collocation;
      };
    },
    'inherits': function(Child, Parent) {
      var F = function() {
        return undef;
      };

      if (!win.Object.create) {
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
        Child.super_ = Parent.prototype;
      } else {
        Child.prototype = win.Object.create(Parent.prototype);
      }
    },
    'extend': function(obj, ext_obj) {
      var counter = arguments.length,
          prop,
          i;

      if (counter > 2) {
        for (i = 1; i < counter; i++) {
          this.extend(obj, arguments[i]);
        }
      } else {
        for (prop in ext_obj) {
          if (this.hop.call(ext_obj, prop)) {
            obj[prop] = ext_obj[prop];
          }
        }
      }

      return obj;
    },
    'nail': function() {
      return undef;
    },
    'dom': function(el, parent) {
      el = el || null;
      parent = parent || doc;

      var self = this,
          api = {
            'el': el,
            'parent': parent,
            // event
            'on': function(type, handler, selector) {
              selector = selector || false;

              var func = handler,
                  elem = this.el;

              if (selector !== false) {
                func = function (event) {
                  return handler(event, selector);
                };
              }

              if (elem !== null) {
                elem.addEventListener ?
                    elem.addEventListener(type, func, false) :
                    elem.attachEvent('on' + type, func); // IE
              }

              return this;
            },
            // event
            'off': function(type, handler) {
              var elem = this.el;

              if (elem !== null) {
                elem.removeEventListener ?
                    elem.removeEventListener(type, handler, false) :
                    elem.detachEvent('on' + type, handler); // IE
              }

              return this;
            },
            // event
            'trigger': function(event_name, args) {
              var evt,
                  elem = this.el,
                  par = this.parent;

              if (par.createEvent) {
                evt = par.createEvent('Events');
                evt.initEvent(event_name, true, false);
              } else if (par.createEventObject) { // IE
                evt = par.createEventObject();
              } else {
                return false;
              }

              evt.data = args;

              if (elem.dispatchEvent) {
                return elem.dispatchEvent(evt);
              } else if (elem.fireEvent) {
                return elem.fireEvent('on' + event_name, evt);
              }
            },
            // attr
            'set': function(attr_name, attrs) {
              var set_name,
                  elem = this.el;

              if (attr_name === 'style') {
                for (set_name in attrs) {
                  if (self.hop.call(attrs, set_name)) {
                    elem.style[set_name] = attrs[set_name];
                  }
                }
              } else {
                elem.setAttribute(attr_name, attrs);
              }

              return this;
            },
            'html': function(data) {
              if (data === undef) {
                return this.el.innerHTML;
              }

              this.el.innerHTML = data;

              return this;
            },
            // attr 
            'get': function(type, attr_name) {
              var computed_style,
                  elem = this.el;

              if (type === 'style') {
                computed_style = elem.currentStyle || win.getComputedStyle(elem, null);
                return computed_style[attr_name];
              }

              return elem.getAttribute(type);
            },
            // attr 
            'del': function(attr_name) {
              this.el.removeAttribute(attr_name);
              return this;
            },
            'data': function(attr_name, attr_val) {
              var prefix = 'data-',
                  full_attr_name = prefix + attr_name;

              if (arguments.length === 2) { // get data
                return this.get(full_attr_name);
              } else if (arguments.length === 3) {
                if (attr_name === '') { // remove data
                  this.del(full_attr_name);
                } else { // set data
                  this.set(full_attr_name, attr_val);
                }

                return true;
              }

              return false;
            },
            'create': function(params) {
              params = params || {};

              var elem = this.parent.createElement(this.el),
                  param_name;

              for (param_name in params) {
                if (self.hop.call(params, param_name)) {
                  elem[param_name] = params[param_name];
                }
              }

              return elem;
            },
            'remove': function() {
              var elem = this.el;

              if (elem.parentNode) {
                elem.parentNode.removeChild(elem);
              }

              return this;
            },
            'append': function(selector) {
              this.el.appendChild(selector);

              return this;
            },
            'find': function(wrapped, all) {
              parent = this.parent;
              wrapped = wrapped === undef ? true : false;

              var data = null,
                  elem = this.el;

              if (elem.charAt(0) === '#') {
                data = parent.getElementById(elem.substr(1));
              } else {
                data = !all ? parent.querySelector(elem): parent.querySelectorAll(elem);
              }

              if (wrapped) {
                this.el = data;
                return this;
              }

              return data;
            },
            'hasClass': function(class_name) {
              var elem = this.el;

              return self.support_class_list ?
                  elem.classList.contains(class_name) :
                  new RegExp('(^| )' + class_name + '( |$)', 'gi').test(elem.className);
            },
            'addClass': function(class_name) {
              var elem = this.el;

              if (!this.hasClass(class_name)) {
                if (self.support_class_list) {
                  elem.classList.add(class_name);
                } else {
                  elem.className += ' ' + class_name;
                }
              }

              return this;
            },
            'removeClass': function(class_name) {
              var elem = this.el;

              if (this.hasClass(class_name)) {
                if (self.support_class_list) {
                  elem.classList.remove(class_name);
                } else {
                  elem.className = elem.className.replace(new RegExp('(\\s|^)' + class_name + '(\\s|$)'), ' ');
                }
              }

              return this;
            },
            'toggleClass':  function(class_name) {
              if (this.hasClass(class_name)) {
                this.removeClass(class_name);
              } else {
                this.addClass(class_name);
              }

              return this;
            },
            'parents': function() {
              return this.el.parentNode;
            },
            'children': function() {
              return this.el.childNodes;
            }
          };

      return api;
    },
    'modal': function(content, title) {
      title = title || '';

      var modal_window = this.dom('#JEZ_modal').find(false),
          modal_form = [
            '<span class="JEZ_modal_close icon-cancel" id="JEZ_modal_close"></span>',
            '<h3>' + title + '</h3>',
            '<div class="JEZ_modal_content">',
            content,
            '</div>'
          ],
          $modal_window;

      if (modal_window === null) {
        modal_window = this.dom('div').create({
          'id': 'JEZ_modal',
          'className': 'JEZ_modal fade'
        });
        this.dom(doc.body).append(modal_window);
      }
      $modal_window = this.dom(modal_window);

      $modal_window.html(modal_form.join(''));

      return {
        'show' : function() {
          $modal_window.addClass('show');
        },
        'hide': function() {
          $modal_window.removeClass('show');
        }
      };
    },
    /*
     * Adds a scroll feature for mobile devices
     */
    'touchScrolling': function(el) {
      var start_pos = 0,
          $el = this.dom(el);

      $el
        .on('touchstart', function(event) {
          start_pos = this.el.scrollTop + event.touches[0].pageY;
          event.preventDefault();
        })
        .on('touchmove', function(event) {
          this.el.scrollTop = start_pos - event.touches[0].pageY;
          event.preventDefault();
        });

      return this;
    },
    'fullScreen': {
      'is': function() {
        if (
            doc.webkitIsFullScreen ||
            doc.mozFullScreen ||
            doc.msFullScreen ||
            doc.fullScreen
            ) {
          return true;
        }

        return false;
      },
      'request': function(el) {
        if (el.requestFullScreen) {
          el.requestFullScreen();
        } else if (el.webkitRequestFullScreen) {
          el.webkitRequestFullScreen();
        } else if (el.mozRequestFullScreen) {
          el.mozRequestFullScreen();
        } else if (el.msRequestFullScreen) {
          el.msRequestFullScreen();
        } else {
          return false;
        }

        return true;
      },
      'exit': function(el) {
        if (el.requestFullScreen) {
          doc.cancelFullScreen();
        } else if (el.webkitRequestFullScreen) {
          doc.webkitCancelFullScreen();
        } else if (el.mozRequestFullScreen) {
          doc.mozCancelFullScreen();
        } else if (el.msExitFullScreen) {
          doc.msExitFullScreen();
        } else {
          return false;
        }

        return true;
      }
    },
    'storage': {
      'prefix': 'jez_',
      'supports': JEZ.support_local_storage,
      'set': function(key, val) {
        if (this.supports) {
          win.localStorage.setItem(this.prefix + key, JSON.stringify(val));
        }

        return this;
      },
      'get': function(key, default_value) {
        var val;

        if (this.supports) {
          val = win.localStorage.getItem(this.prefix + key);
        }

        if (!this.supports || !val) {
          return default_value;
        }

        return JSON.parse(val);
      },
      'remove': function(key) {
        if (this.supports) {
          win.localStorage.removeItem(this.prefix + key);
        }

        return this;
      },
      'clear': function() {
        if (this.supports) {
          win.localStorage.clear();
        }

        return this;
      }
    },
    'getXHR': function() {
      var data = false;

      if (win.XMLHttpRequest.prototype.hasOwnProperty('withCredentials')) {
        data = new win.XMLHttpRequest();
      } else if (win.XDomainRequest !== undef) {
        data = new win.XDomainRequest();
      }

      return data;
    },
    isCurrentHost: function(host) {
      return host.indexOf(win.location.hostname) !== -1 ? true : false;
    },
    'vendors': ['', 'ms', 'moz', 'webkit', 'o'],
    'support_xhr': !(win.XMLHttpRequest.prototype.hasOwnProperty('withCredentials')) || !(win.XDomainRequest !== undef),
    'support_local_storage': win.localStorage !== undef,
    'support_class_list': doc.documentElement.classList !== undef,
    'is_mobile': /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(win.navigator.userAgent),
    // "touchstart" event is faster than "click" on mobile devices
    'click_event': function() {
      return !this.is_mobile ? 'click' : 'touchstart';
    },
    'hop': Object.prototype.hasOwnProperty
  };
}(this));
