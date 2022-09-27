// hàm validator
function Validator(options) {

    var selectorRules = {}

    // hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage;

        // lấy ra các rules của selector 
        var rules = selectorRules[rule.selector];
        // lặp qua từng rule và kiểm tra
        for(var i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value)
            if(errorMessage) break;
        }
        if(errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }
        return !errorMessage;
    }
    // lấy element của form cần validate
    var formElement = document.querySelector(options.form);
    if(formElement) {
        formElement.onsubmit = function(e) {
            e.preventDefault();

            var isFormValid = true;


            // thực hiện lặp qua từng rule và validate luôn
            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if(!isValid) {
                    isFormValid = false;
                }
            });
            
                    
            if(isFormValid) {
                // trường hợp submit với javascript
                if(typeof options.onSubmit === 'function') {
                    var EnableInputs = formElement.querySelectorAll('[name]');
                var formValues = Array.from(EnableInputs).reduce(function(values, input) {
                return (values[input.name] = input.value) && values;
                }, {});
                
                    options.onSubmit(formValues)
                } else {
                    formElement.submit();
                }
            } 
        }
        

        // Lặp qua mỗi rule và xử lý(lắng nghe sự kiện blur, input,...)
        options.rules.forEach(function(rule) {

            // lưu lại các rules cho mỗi input
            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test];

            }
            var inputElement = formElement.querySelector(rule.selector);
            
            if(inputElement) {
                // xử lý trường hợp blur khỏi input
                inputElement.onblur = function() {
                    validate(inputElement, rule);
                }
                // xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = function() {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                    errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
                }
            }
        });

        
    }

}
// định nghĩa rules
Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : message || "Vui lòng nhập trường này"
        }
    }
}
Validator.isEmail = function(selector) {
     return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập email';
        }
    }
}
Validator.minLength = function(selector, min) {
    return {
       selector: selector,
       test: function(value) {
           return value.length >= min ? undefined : `Vui lòng nhập nhập tối thiểu ${min} kí tự`;
       }
   }
}
Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : message || 'giá trị nhập vào không chính xác'
        }
    }
}