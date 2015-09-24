PPL_Frontend.directive('numbersOnly', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            console.log("Inside directive element:",element);
            console.log("Inside directive attrs:",attrs);
            modelCtrl.$parsers.push(function(inputValue) {
                if (inputValue == undefined) return ''
                var onlyNumeric = inputValue.replace(/[^0-9]/g, '');
                if (onlyNumeric != inputValue) {
                    modelCtrl.$setViewValue(onlyNumeric);
                    modelCtrl.$render();
                }
                console.log("onlyNumeric type of:" + typeof onlyNumeric);
                return onlyNumeric;
            });
        }
    };
   });