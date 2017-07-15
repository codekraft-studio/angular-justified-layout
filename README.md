# angular-justified-layout
> angularjs wrapper for Flickr Justified Layout

### [DEMO](https://codekraft-studio.github.io/angular-justified-layout/)

## Getting Started
First install the module, with your preferred method:

Clone it with GitHub:
```bash
git clone https://github.com/codekraft-studio/angular-justified-layout.git
```

Download it with Bower:
```bash
bower install --save angular-justified-layout
```

Download it with Npm:
```bash
npm install --save angular-justified-layout
```

Than add the module scripts in your application html:
```html
<script type="text/javascript" src="angular-justified-layout.js"></script>
```

Finally add the module name as dependency for your application:
```javascript
angular.module('app', ['angular-justified-layout']);
```
And now you are ready to go!

---

## How it works?
There is only one directive called __justified-layout__ and it takes two attributes:
  * __items__: An array of rateo values or objects
  * __options__: The justified-layout options
  
If you want more details about the options, take a look on [flickr](https://github.com/flickr/justified-layout) justified-layout.

#### Basic usage

The basic usage of the directive is:
```html
<justified-layout items="[1, 0.5, 1.5, 2]"></justified-layout>
```
And it will create four different boxes spaced like the rateo you specified.

You can use it with objects too and it has some advantages:
```javascript
$scope.myArray = [
  { width: 500, height: 350: url: 'https://placehold.it/500x350' },
  { width: 800, height: 540: url: 'https://placehold.it/800x540' },
  { width: 640, height: 480: url: 'https://placehold.it/640x480' },
];
```
```html
<justified-layout items="myArray"></justified-layout>
```
All the array objects __MUST__ have the width and height properties, otherwise the directive will not work, additionally if you specify a url property the directive default template will use it to display an image for you.

#### Advanced usage
The directive will transclude any content inside of it by default so, you can use a custom template for rendering your boxes and add all the funky style you want:
```html
<justified-layout items="myArray" options="{
  containerPadding: 5,
  boxSpacing: 5
}">
  
  <div ng-repeat="image in $parent.items track by $index" ng-style="image.style">
    
    <div class="box-inside">
      <div class="details-block" ng-click="removeItem(image, $index)"></div>
    </div>
    
  </div>
  
</justified-layout>
```
If you want to access the directive scope, for example, the __items__ property which contains all the enriched elements of your array you should refer to the __parent scope__ like in the example. Be sure to use `$parent` inside the transcluded content if you want to access the directive scope, otherwise the variable will be empty and your template will not render as expected.

---

## Development
Clone the project to your computer, than install all dependencies by typing:
```bash
npm install
```
When you are ready you can start the grunt development server by typing:
```bash
grunt serve
```
When you finished editing, stop the development server and run the final build:
```bash
grunt build
```

---

## Contributing

1. Create an issue and describe your idea
2. Fork the project (https://github.com/codekraft-studio/angular-justified-layout/fork)
3. Create your feature branch (`git checkout -b my-new-feature`)
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Publish the branch (`git push origin my-new-feature`)
6. Add some test for your new feature
7. Create a new Pull Request