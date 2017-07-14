angular.module('angular-justified-layout')

.directive('justifiedLayout', function($log, $window) {
  
  // TODO:  put in a external service so it can be shared in app
  var justifiedLayout = require('justified-layout');
  
  // Init the configurations
  var defaults = {
    containerPadding: 5,
    boxSpacing: 5
  };
  
  var directive = {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: [
      '<div class="justified-container">',
        '<ng-transclude>',
          '<div ng-repeat="item in items track by $index" class="box" ng-style="item.style">',
            '<img ng-if="item.url" ng-src="{{ item.url }}" />',
          '</div>',
        '</ng-transclude>',
      '</div>'
    ].join('\n'),
    scope: { 
      items: '=',
      options: '=?'
    },
    link: _link
  };
  
  return directive;
  
  /**
   * Append px string at the end of given value
   */
  function _addPixels(value) {
    return value + 'px';
  }
  
  /**
   * Add the item style properties to every array objects
   */
  function _addItemsStyle(items, geometry) {
    
    // add new style to items
    angular.forEach(items, function(item, index) {      
      
      // get the box measure object
      var box = geometry.boxes[index];
      
      // reference original item
      var item = angular.isObject(item) ? item : {
        width: box.width,
        height: box.height,
      };

      var style = {
        width: _addPixels(box.width),
        height: _addPixels(box.height),
        top: _addPixels(box.top),
        left: _addPixels(box.left),
        position: 'absolute'
      };
      
      // extend any user custom style
      item.style = angular.isObject(item.style) ? angular.extend(item.style, style) : style;
      
      // updte original item
      items[index] = item;
      
    });
    
  }
  
  /**
   * Init the function and setup the watchers
   */
  function _link(scope, elem, attrs, ctrl, transclude) {
    
    // init some local variables
    var geometry, collectionLength = 0;
    
    // set container mandatory style
    elem.css({ 
      position: 'relative',
      // overflow: 'hidden'
    });
    
    // get the directive options for justify
    if( angular.isObject(scope.options) ) {
      scope.options = angular.extend({}, defaults, scope.options)
    } else {
      scope.options = angular.copy(defaults);
    }
    
    // window resize callback
    var onResize = function(e) {
      // update the configurations object
      scope.options.containerWidth = elem[0].clientWidth;
  
      // get the boxes geometry using flickr code
      geometry = justifiedLayout(scope.items, scope.options);
      
      // TODO: move in a ng style so is auto watched
      // update element height
      elem.css({ height: _addPixels(geometry.containerHeight) });
      
      _addItemsStyle(scope.items, geometry);
      
      scope.$apply();
    };
      
    // collection change callback
    var collectionWatch = function(newVal) {
      
      // exit if input is not valid      
      if( !newVal || !newVal.length || !angular.isArray(newVal) ) {
        return;
      }
      
      // TODO: Possibly make an option to disable deep watch which saves memory
      // // do actions only if elements were added or removed (not updated)
      // if( collectionLength === newVal.length ) {
      //   return;
      // }
      
      // update new collection (last) length value
      collectionLength = newVal.length;
      
      // get the element (container) width
      scope.options.containerWidth = elem[0].clientWidth;

      // get the boxes geometry using flickr code
      geometry = justifiedLayout(scope.items, scope.options);
        
      // TODO: move in a ng style so is auto watched
      // update element height
      elem.css({ height: _addPixels(geometry.containerHeight) });
      
      _addItemsStyle(scope.items, geometry);
      
    };
    
    // watch for window resize
    angular.element($window).on('resize', onResize);
    
    /**
     * Watch the array for changes and get the new geometries data
     */
    scope.$watchCollection('items', collectionWatch);
    
    /**
     * When scope is destroyed remove all the listeners
     */
    scope.$on('$destroy', function() {
      angular.element($window).off('resize', onResize);
      collectionWatch();
    });
    
  }
  
});