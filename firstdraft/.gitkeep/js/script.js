
/*
 * jQuery form plugin
 * @requires jQuery v1.0.3
 *
 * Revision: $Id$
 * Version: .97
 */

/**
 * ajaxSubmit() provides a mechanism for submitting an HTML form using AJAX.
 *
 * ajaxSubmit accepts a single argument which can be either a success callback function
 * or an options Object.  If a function is provided it will be invoked upon successful
 * completion of the submit and will be passed the response from the server.
 * If an options Object is provided, the following attributes are supported:
 *
 *  target:   Identifies the element(s) in the page to be updated with the server response.
 *            This value may be specified as a jQuery selection string, a jQuery object,
 *            or a DOM element.
 *            default value: null
 *
 *  url:      URL to which the form data will be submitted.
 *            default value: value of form's 'action' attribute
 *
 *  type:     The method in which the form data should be submitted, 'GET' or 'POST'.
 *            default value: value of form's 'method' attribute (or 'GET' if none found)
 *
 *  beforeSubmit:  Callback method to be invoked before the form is submitted.
 *            default value: null
 *
 *  success:  Callback method to be invoked after the form has been successfully submitted
 *            and the response has been returned from the server
 *            default value: null
 *
 *  dataType: Expected dataType of the response.  One of: null, 'xml', 'script', or 'json'
 *            default value: null
 *
 *  semantic: Boolean flag indicating whether data must be submitted in semantic order (slower).
 *            default value: false
 *
 *  resetForm: Boolean flag indicating whether the form should be reset if the submit is successful
 *
 *  clearForm: Boolean flag indicating whether the form should be cleared if the submit is successful
 *
 *
 * The 'beforeSubmit' callback can be provided as a hook for running pre-submit logic or for
 * validating the form data.  If the 'beforeSubmit' callback returns false then the form will
 * not be submitted. The 'beforeSubmit' callback is invoked with three arguments: the form data
 * in array format, the jQuery object, and the options object passed into ajaxSubmit.
 * The form data array takes the following form:
 *
 *     [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
 *
 * If a 'success' callback method is provided it is invoked after the response has been returned
 * from the server.  It is passed the responseText or responseXML value (depending on dataType).
 * See jQuery.ajax for further details.
 *
 *
 * The dataType option provides a means for specifying how the server response should be handled.
 * This maps directly to the jQuery.httpData method.  The following values are supported:
 *
 *      'xml':    if dataType == 'xml' the server response is treated as XML and the 'after'
 *                   callback method, if specified, will be passed the responseXML value
 *      'json':   if dataType == 'json' the server response will be evaluted and passed to
 *                   the 'after' callback, if specified
 *      'script': if dataType == 'script' the server response is evaluated in the global context
 *
 *
 * Note that it does not make sense to use both the 'target' and 'dataType' options.  If both
 * are provided the target will be ignored.
 *
 * The semantic argument can be used to force form serialization in semantic order.
 * This is normally true anyway, unless the form contains input elements of type='image'.
 * If your form must be submitted with name/value pairs in semantic order and your form
 * contains an input of type='image" then pass true for this arg, otherwise pass false
 * (or nothing) to avoid the overhead for this logic.
 *
 *
 * When used on its own, ajaxSubmit() is typically bound to a form's submit event like this:
 *
 * $("#form-id").submit(function() {
 *     $(this).ajaxSubmit(options);
 *     return false; // cancel conventional submit
 * });
 *
 * When using ajaxForm(), however, this is done for you.
 *
 * @example
 * $('#myForm').ajaxSubmit(function(data) {
 *     alert('Form submit succeeded! Server returned: ' + data);
 * });
 * @desc Submit form and alert server response
 *
 *
 * @example
 * var options = {
 *     target: '#myTargetDiv'
 * };
 * $('#myForm').ajaxSubmit(options);
 * @desc Submit form and update page element with server response
 *
 *
 * @example
 * var options = {
 *     success: function(responseText) {
 *         alert(responseText);
 *     }
 * };
 * $('#myForm').ajaxSubmit(options);
 * @desc Submit form and alert the server response
 *
 *
 * @example
 * var options = {
 *     beforeSubmit: function(formArray, jqForm) {
 *         if (formArray.length == 0) {
 *             alert('Please enter data.');
 *             return false;
 *         }
 *     }
 * };
 * $('#myForm').ajaxSubmit(options);
 * @desc Pre-submit validation which aborts the submit operation if form data is empty
 *
 *
 * @example
 * var options = {
 *     url: myJsonUrl.php,
 *     dataType: 'json',
 *     success: function(data) {
 *        // 'data' is an object representing the the evaluated json data
 *     }
 * };
 * $('#myForm').ajaxSubmit(options);
 * @desc json data returned and evaluated
 *
 *
 * @example
 * var options = {
 *     url: myXmlUrl.php,
 *     dataType: 'xml',
 *     success: function(responseXML) {
 *        // responseXML is XML document object
 *        var data = $('myElement', responseXML).text();
 *     }
 * };
 * $('#myForm').ajaxSubmit(options);
 * @desc XML data returned from server
 *
 *
 * @example
 * var options = {
 *     resetForm: true
 * };
 * $('#myForm').ajaxSubmit(options);
 * @desc submit form and reset it if successful
 *
 * @example
 * $('#myForm).submit(function() {
 *    $(this).ajaxSubmit();
 *    return false;
 * });
 * @desc Bind form's submit event to use ajaxSubmit
 *
 *
 * @name ajaxSubmit
 * @type jQuery
 * @param options  object literal containing options which control the form submission process
 * @cat Plugins/Form
 * @return jQuery
 * @see formToArray
 * @see ajaxForm
 * @see $.ajax
 * @author jQuery Community
 */
jQuery.fn.ajaxSubmit = function(options) {
    if (typeof options == 'function')
        options = { success: options };

    options = jQuery.extend({
        url:  this.attr('action') || window.location,
        type: this.attr('method') || 'GET'
    }, options || {});

    var a = this.formToArray(options.semantic);

    // give pre-submit callback an opportunity to abort the submit
    if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) return this;

    // fire vetoable 'validate' event
    var veto = {};
    jQuery.event.trigger('form.submit.validate', [a, this, options, veto]);
    if (veto.veto)
        return this;

    var q = jQuery.param(a);//.replace(/%20/g,'+');

    if (options.type.toUpperCase() == 'GET') {
        options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
        options.data = null;  // data is null for 'get'
    }
    else
        options.data = q; // data is the query string for 'post'

    var $form = this, callbacks = [];
    if (options.resetForm) callbacks.push(function() { $form.resetForm(); });
    if (options.clearForm) callbacks.push(function() { $form.clearForm(); });

    // perform a load on the target only if dataType is not provided
    if (!options.dataType && options.target) {
        var oldSuccess = options.success || function(){};
        callbacks.push(function(data, status) {
            jQuery(options.target).attr("innerHTML", data).evalScripts().each(oldSuccess, [data, status]);
        });
    }
    else if (options.success)
        callbacks.push(options.success);

    options.success = function(data, status) {
        for (var i=0, max=callbacks.length; i < max; i++)
            callbacks[i](data, status);
    };

    // are there files to upload?
    var files = jQuery('input:file', this).fieldValue();
    var found = false;
    for (var j=0; j < files.length; j++)
        if (files[j])
            found = true;

    if (options.iframe || found) // options.iframe allows user to force iframe mode
        fileUpload();
    else
        jQuery.ajax(options);

    // fire 'notify' event
    jQuery.event.trigger('form.submit.notify', [this, options]);
    return this;


    // private function for handling file uploads (hat tip to YAHOO!)
    function fileUpload() {
        var form = $form[0];
        var opts = jQuery.extend({}, jQuery.ajaxSettings, options);

        var id = 'jqFormIO' + jQuery.fn.ajaxSubmit.counter++;
        var $io = jQuery('<iframe id="' + id + '" name="' + id + '" />');
        var io = $io[0];
        var op8 = jQuery.browser.opera && window.opera.version() < 9;
        if (jQuery.browser.msie || op8) io.src = 'javascript:false;document.write("");';
        $io.css({ position: 'absolute', top: '-1000px', left: '-1000px' });

        // make sure form attrs are set
        form.method = 'POST';
        form.encoding ? form.encoding = 'multipart/form-data' : form.enctype = 'multipart/form-data';

        var xhr = { // mock object
            responseText: null,
            responseXML: null,
            status: 0,
            statusText: 'n/a',
            getAllResponseHeaders: function() {},
            getResponseHeader: function() {},
            setRequestHeader: function() {}
        };

        var g = opts.global;
        // trigger ajax global events so that activity/block indicators work like normal
        if (gjQuery.active++)jQuery.event.trigger(("ajaxStart"));
        if (g) jQuery.event.trigger("ajaxSend", [xhr, opts]);

        var cbInvoked = 0;
        var timedOut = 0;

        // take a breath so that pending repaints get some cpu time before the upload starts
        setTimeout(function() {
            $io.appendTo('body');
            // jQuery's event binding doesn't work for iframe events in IE
            io.attachEvent ? io.attachEvent('onload', cb) : io.addEventListener('load', cb, false);
            form.action = opts.url;
            var t = form.target;
            form.target = id;

            // support timout
            if (opts.timeout)
                setTimeout(function() { timedOut = true; cb(); }, opts.timeout);

            form.submit();
            form.target = t; // reset
        }, 10);

        function cb() {
            if (cbInvoked++) return;

            io.detachEvent ? io.detachEvent('onload', cb) : io.removeEventListener('load', cb, false);

            var ok = true;
            try {
                if (timedOut) throw 'timeout';
                // extract the server response from the iframe
                var data, doc;
                doc = io.contentWindow ? io.contentWindow.document : io.contentDocument ? io.contentDocument : io.document;
                xhr.responseText = doc.body ? doc.body.innerHTML : null;
                xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;

                if (opts.dataType == 'json' || opts.dataType == 'script') {
                    var ta = doc.getElementsByTagName('textarea')[0];
                    data = ta ? ta.value : xhr.responseText;
                    if (opts.dataType == 'json')
                        eval("data = " + data);
                    else
                        jQuery.globalEval(data);
                }
                else if (opts.dataType == 'xml') {
                    data = xhr.responseXML;
                    if (!data&&xhr.responseText)
                        data = toXml(xhr.responseText);
                }
                else {
                    data = xhr.responseText;
                }
            }
            catch(e){
                ok = false;
                jQuery.handleError(opts, xhr, 'error', e);
            }

            // ordering of these callbacks/triggers is odd, but that's how $.ajax does it
            if (ok) {
                opts.success(data, 'success');
                if (g) jQuery.event.trigger("ajaxSuccess", [xhr, opts]);
            }
            if (g) jQuery.event.trigger("ajaxComplete", [xhr, opts]);
            if (g && ! --jQuery.active) jQuery.event.trigger("ajaxStop");
            if (opts.complete) opts.complete(xhr, ok ? 'success' : 'error');

            // clean up
            setTimeout(function() {
                $io.remove();
                xhr.responseXML = null;
            }, 100);
        }

        function toXml(s, doc) {
            if (window.ActiveXObject) {
                doc = new ActiveXObject('Microsoft.XMLDOM');
                doc.async = 'false';
                doc.loadXML(s);
            }
            else
                doc = (new DOMParser()).parseFromString(s, 'text/xml');
            return (doc && doc.documentElement && doc.documentElement.tagName != 'parsererror') ? doc : null;
        }
    }
};
jQuery.fn.ajaxSubmit.counter = 0; // used to create unique iframe ids

/**
 * ajaxForm() provides a mechanism for fully automating form submission.
 *
 * The advantages of using this method instead of ajaxSubmit() are:
 *
 * 1: This method will include coordinates for <input type="image" /> elements (if the element
 *    is used to submit the form).
 * 2. This method will include the submit element's name/value data (for the element that was
 *    used to submit the form).
 * 3. This method binds the submit() method to the form for you.
 *
 * Note that for accurate x/y coordinates of image submit elements in all browsers
 * you need to also use the "dimensions" plugin (this method will auto-detect its presence).
 *
 * The options argument for ajaxForm works exactly as it does for ajaxSubmit.  ajaxForm merely
 * passes the options argument along after properly binding events for submit elements and
 * the form itself.  See ajaxSubmit for a full description of the options argument.
 *
 *
 * @example
 * var options = {
 *     target: '#myTargetDiv'
 * };
 * $('#myForm').ajaxSForm(options);
 * @desc Bind form's submit event so that 'myTargetDiv' is updated with the server response
 *       when the form is submitted.
 *
 *
 * @example
 * var options = {
 *     success: function(responseText) {
 *         alert(responseText);
 *     }
 * };
 * $('#myForm').ajaxSubmit(options);
 * @desc Bind form's submit event so that server response is alerted after the form is submitted.
 *
 *
 * @example
 * var options = {
 *     beforeSubmit: function(formArray, jqForm) {
 *         if (formArray.length == 0) {
 *             alert('Please enter data.');
 *             return false;
 *         }
 *     }
 * };
 * $('#myForm').ajaxSubmit(options);
 * @desc Bind form's submit event so that pre-submit callback is invoked before the form
 *       is submitted.
 *
 *
 * @name   ajaxForm
 * @param  options  object literal containing options which control the form submission process
 * @return jQuery
 * @cat    Plugins/Form
 * @type   jQuery
 * @see    ajaxSubmit
 * @author jQuery Community
 */
jQuery.fn.ajaxForm = function(options) {
    return this.each(function() {
        jQuery("input:submit,input:image,button:submit", this).click(function(ev) {
            var $form = this.form;
            $form.clk = this;
            if (this.type == 'image') {
                if (ev.offsetX !=x) {
                    $form.clk_x = ev.offsetX;
                    $form.clk_y = ev.offsetY;
                } else if (typeof jQuery.fn.offset == 'function') { // try to use dimensions plugin
                    var offset = jQuery(this).offset();
                    $form.clk_x = ev.pageX - offset.left;
                    $form.clk_y = ev.pageY - offset.top;
                } else {
                    $form.clk_x = ev.pageX - this.offsetLeft;
                    $form.clk_y = ev.pageY - this.offsetTop;
                }
            }
            // clear form vars
            setTimeout(function() {
                $form.clk = $form.clk_x = $form.clk_y = null;
                }, 10);
        })
    }).submit(function(e) {
        jQuery(this).ajaxSubmit(options);
        return false;
    });
};


/**
 * formToArray() gathers form element data into an array of objects that can
 * be passed to any of the following ajax functions: $.get, $.post, or load.
 * Each object in the array has both a 'name' and 'value' property.  An example of
 * an array for a simple login form might be:
 *
 * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
 *
 * It is this array that is passed to pre-submit callback functions provided to the
 * ajaxSubmit() and ajaxForm() methods.
 *
 * The semantic argument can be used to force form serialization in semantic order.
 * This is normally true anyway, unless the form contains input elements of type='image'.
 * If your form must be submitted with name/value pairs in semantic order and your form
 * contains an input of type='image" then pass true for this arg, otherwise pass false
 * (or nothing) to avoid the overhead for this logic.
 *
 * @example var data = $("#myForm").formToArray();
 * $.post( "myscript.cgi", data );
 * @desc Collect all the data from a form and submit it to the server.
 *
 * @name formToArray
 * @param semantic true if serialization must maintain strict semantic ordering of elements (slower)
 * @type Array<Object>
 * @cat Plugins/Form
 * @see ajaxForm
 * @see ajaxSubmit
 * @author jQuery Community
 */
jQuery.fn.formToArray = function(semantic) {
    var a = [];
    if (this.length===0) return a;

    var form = this[0];
    var els = semantic ? form.getElementsByTagName('*') : form.elements;
    if (!els) return a;
    for(var i=0, max=els.length; i < max; i++) {
        var el = els[i];
        var n = el.name;
        if (!n) continue;

        if (semantic && form.clk && el.type == "image") {
            // handle image inputs on the fly when semantic == true
            if(!el.disabled && form.clk == el)
                a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
            continue;
        }
        var v = jQuery.fieldValue(el, true);
        if (v === null) continue;
        if (v.constructor == Array) {
            for(var j=0, jmax=v.length; j < jmax; j++)
                a.push({name: n, value: v[j]});
        }
        else
            a.push({name: n, value: v});
    }

    if (!semantic && form.clk) {
        // input type=='image' are not found in elements array! handle them here
        var inputs = form.getElementsByTagName("input");
        for(var i=0, max=inputs.length; i < max; i++) {
            var input = inputs[i];
            var n = input.name;
            if(n && !input.disabled && input.type == "image" && form.clk == input)
                a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
        }
    }
     a;
};


/**
 * Serializes form data into a 'submittable' string. This method will return a string
 * in the format: name1=value1&amp;name2=value2
 *
 * The semantic argument can be used to force form serialization in semantic order.
 * If your form must be submitted with name/value pairs in semantic order then pass
 * true for this arg, otherwise pass false (or nothing) to avoid the overhead for
 * this logic (which can be significant for very large forms).
 *
 * @example var data = $("#myForm").formSerialize();
 * $.ajax('POST', "myscript.cgi", data);
 * @desc Collect all the data from a form into a single string
 *
 * @name formSerialize
 * @param semantic true if serialization must maintain strict semantic ordering of elements (slower)
 * @type String
 * @cat Plugins/Form
 * @see formToArray
 * @author jQuery Community
 */
jQuery.fn.formSerialize = function(semantic) {
    //hand off to jQuery.param for proper encoding
    return jQuery.param(this.formToArray(semantic));
};


/**
 * Serializes all field elements in the jQuery object into a query string.
 * This method will return a string in the format: name1=value1&amp;name2=value2
 *
 * The successful argument controls whether or not serialization is limited to
 * 'successful' controls (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
 * The default value of the successful argument is true.
 *
 * @example var data = $("input").formSerialize();
 * @desc Collect the data from all successful input elements into a query string
 *
 * @example var data = $(":radio").formSerialize();
 * @desc Collect the data from all successful radio input elements into a query string
 *
 * @example var data = $("#myForm :checkbox").formSerialize();
 * @desc Collect the data from all successful checkbox input elements in myForm into a query string
 *
 * @example var data = $("#myForm :checkbox").formSerialize(false);
 * @desc Collect the data from all checkbox elements in myForm (even the unchecked ones) into a query string
 *
 * @example var data = $(":input").formSerialize();
 * @desc Collect the data from all successful input, select, textarea and button elements into a query string
 *
 * @name fieldSerialize
 * @param successful true if only successful controls should be serialized (default is true)
 * @type String
 * @cat Plugins/Form
 */
jQuery.fn.fieldSerialize = function(successful) {
    var a = [];
    this.each(function() {
        var n = this.name;
        if (!n) return;
        var v = jQuery.fieldValue(this, successful);
        if (v && v.constructor == Array) {
            for (var i=0,max=v.length; i < max; i++)
                a.push({name: n, value: v[i]});
        }
        else if (v !== null && typeof v != 'undefined')
            a.push({name: this.name, value: v});
    });
    //hand off to jQuery.param for proper encoding
    return jQuery.param(a);
};


/**
 * Returns the value(s) of the element in the matched set.  For example, consider the following form:
 *
 *  <form><fieldset>
 *      <input name="A" type="text" />
 *      <input name="A" type="text" />
 *      <input name="B" type="checkbox" value="B1" />
 *      <input name="B" type="checkbox" value="B2"/>
 *      <input name="C" type="radio" value="C1" />
 *      <input name="C" type="radio" value="C2" />
 *  </fieldset></form>
 *
 *  var v = $(':text').fieldValue();
 *  // if no values are entered into the text inputs
 *  v == ['','']
 *  // if values entered into the text inputs are 'foo' and 'bar'
 *  v == ['foo','bar']
 *
 *  var v = $(':checkbox').fieldValue();
 *  // if neither checkbox is checked
 *  v === undefined
 *  // if both checkboxes are checked
 *  v == ['B1', 'B2']
 *
 *  var v = $(':radio').fieldValue();
 *  // if neither radio is checked
 *  v === undefined
 *  // if first radio is checked
 *  v == ['C1']
 *
 * The successful argument controls whether or not the field element must be 'successful'
 * (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
 * The default value of the successful argument is true.  If this value is false the value(s)
 * for each element is returned.
 *
 * Note: This method *always* returns an array.  If no valid value can be determined the
 *       array will be empty, otherwise it will contain one or more values.
 *
 * @example var data = $("#myPasswordElement").fieldValue();
 * alert(data[0]);
 * @desc Alerts the current value of the myPasswordElement element
 *
 * @example var data = $("#myForm :input").fieldValue();
 * @desc Get the value(s) of the form elements in myForm
 *
 * @example var data = $("#myForm :checkbox").fieldValue();
 * @desc Get the value(s) for the successful checkbox element(s) in the jQuery object.
 *
 * @example var data = $("#mySingleSelect").fieldValue();
 * @desc Get the value(s) of the select control
 *
 * @example var data = $(':text').fieldValue();
 * @desc Get the value(s) of the text input or textarea elements
 *
 * @example var data = $("#myMultiSelect").fieldValue();
 * @desc Get the values for the select-multiple control
 *
 * @name fieldValue
 * @param Boolean successful true if only the values for successful controls should be returned (default is true)
 * @type Array<String>
 * @cat Plugins/Form
 */
jQuery.fn.fieldValue = function(successful) {
    for (var val=[], i=0, max=this.length; i < max; i++) {
        var el = this[i];
        var v = jQuery.fieldValue(el, successful);
        if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length))
            continue;
        v.constructor == Array ? jQuery.merge(val, v) : val.push(v);
    }
    return val;
};

/**
 * Returns the value of the field element.
 *
 * The successful argument controls whether or not the field element must be 'successful'
 * (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
 * The default value of the successful argument is true.  If the given element is not
 * successful and the successful arg is not false then the returned value will be null.
 *
 * Note: If the successful flag is true (default) but the element is not successful, the return will be null
 * Note: The value returned for a successful select-multiple element will always be an array.
 * Note: If the element has no value the return value will be undefined.
 *
 * @example var data = jQuery.fieldValue($("#myPasswordElement")[0]);
 * @desc Gets the current value of the myPasswordElement element
 *
 * @name fieldValue
 * @param Element el The DOM element for which the value will be returned
 * @param Boolean successful true if value returned must be for a successful controls (default is true)
 * @type String or Array<String> or null or undefined
 * @cat Plugins/Form
 */
jQuery.fieldValue = function(el, successful) {
    var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
    if (typeof successful == 'undefined') successful = true;

    if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||
        (t == 'checkbox' || t == 'radio') && !el.checked ||
        (t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
        tag == 'select' && el.selectedIndex == -1))
            return null;

    if (tag == 'select') {
        var index = el.selectedIndex;
        if (index < 0) return null;
        var a = [], ops = el.options;
        var one = (t == 'select-one');
        var max = (one ? index+1 : ops.length);
        for(var i=(one ? index : 0); i < max; i++) {
            var op = ops[i];
            if (op.selected) {
                // extra pain for IE...
                var v = jQuery.browser.msie && !(op.attributes['value'].specified) ? op.text : op.value;
                if (one) return v;
                a.push(v);
            }
        }
        return a;
    }
    return el.value;
};


/**
 * Clears the form data.  Takes the following actions on the form's input fields:
 *  - input text fields will have their 'value' property set to the empty string
 *  - select elements will have their 'selectedIndex' property set to -1
 *  - checkbox and radio inputs will have their 'checked' property set to false
 *  - inputs of type submit, button, reset, and hidden will *not* be effected
 *  - button elements will *not* be effected
 *
 * @example $('form').clearForm();
 * @desc Clears all forms on the page.
 *
 * @name clearForm
 * @type jQuery
 * @cat Plugins/Form
 * @see resetForm
 */
jQuery.fn.clearForm = function() {
    return this.each(function() {
        jQuery('input,select,textarea', this).clearFields();
    });
};

/**
 * Clears the selected form elements.  Takes the following actions on the matched elements:
 *  - input text fields will have their 'value' property set to the empty string
 *  - select elements will have their 'selectedIndex' property set to -1
 *  - checkbox and radio inputs will have their 'checked' property set to false
 *  - inputs of type submit, button, reset, and hidden will *not* be effected
 *  - button elements will *not* be effected
 *
 * @example $('.myInputs').clearFields();
 * @desc Clears all inputs with class myInputs
 *
 * @name clearFields
 * @type jQuery
 * @cat Plugins/Form
 * @see clearForm
 */
jQuery.fn.clearFields = jQuery.fn.clearInputs = function() {
    return this.each(function() {
        var t = this.type, tag = this.tagName.toLowerCase();
        if (t == 'text' || t == 'password' || tag == 'textarea')
            this.value = '';
        else if (t == 'checkbox' || t == 'radio')
            this.checked = false;
        else if (tag == 'select')
            this.selectedIndex = -1;
    });
};


/**
 * Resets the form data.  Causes all form elements to be reset to their original value.
 *
 * @example $('form').resetForm();
 * @desc Resets all forms on the page.
 *
 * @name resetForm
 * @type jQuery
 * @cat Plugins/Form
 * @see clearForm
 */
jQuery.fn.resetForm = function() {
    return this.each(function() {
        // guard against an input with the name of 'reset'
        // note that IE reports the reset function as an 'object'
        if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType))
            this.reset();
    });
};



$(document).ready(function() {

	// remove 'username'/'password' overtext if the browser has already
	// saved and inserted a value in to the field.
	if ($('#login_username').val()) {
		$('#login_username').removeClass('logu'); 
		$('#login_password').removeClass('logp');
	}
	
	/*clear input field text. applied to the header search input - add as needed*/
	$("#search, #title_createit, #username, #pass").inputClear();

	/*add class to drop downs for IE <6*/
	if(document.all){
	    $("#nav>li").hover(
	            function() {
					$(this).addClass("over");
				},
	            function() {
					$(this).removeClass("over");
				}
	    );
	}

	// for buttons, we will wrap the span around the outside.  buttons do not take the wrapping in certain contexts
	$("button:not(.continue):not(.gobutton):not(.entry-content button), a.button:not(.createthemebutton)").wrap("<span class='buttonwrap'></span>");
	$("button.continue, button.morebutton").wrap("<span class='morebutton'></span>").filter("button.back").parent().addClass("back");
	$(".button.addimage").parent().addClass("addimage");
	$("#deletechecked").parent().css({ float: "right" });

	// .continue class is floated and may be followed by another element.  IE6 doesn't
	// support sibling selectors, so using jQuery to take care of that.
	if (typeof document.body.style.maxHeight == 'undefined')  {// testing document.all still captures IE7.  this test does not.
		$(".continue + *").css("clear", "left");
	}

	//tabs - enter a number in tabs(here) to make a tab other than the first display by default.
	//full docs can be found at: http://www.stilbuero.de/jquery/tabs/
	$(".tabbedlisting, .tabwrap, #creator, #themepreview ").not("#edit_profile .tabwrap").tabs({
		onHide: function(a) {
			if (a.href.indexOf("#deleteaccount")>-1) {
				$("#edit_profile>.buttonwrap").hide();
			} else {
				$("#edit_profile>.buttonwrap").show();
			}
		}									 
	});
	$(".hubtabs").tabs(3);/* setting the third tab ('newest) to display first  */

	//activate password box on 'sharing' squidget
	$("#sharewithpasswordonly").css({display: "none"});
	$("#canview").change(function() {
			if(this.value == 1) { /* CHANGED FROM 0 TO 1 */
				$("#sharewithpasswordonly").css({display: "block"});
				$("#contentpassword").attr("autocomplete","off");
			} else {
				$("#sharewithpasswordonly").css({display: "none"});
			}
	});

	//load suggested tags
	$(".tagadd a").click(function () {
		var recommendedtag = $(this).html();//the clicked tag
		
		var currenttags = $(this).parent().parent().parent().find("#tagittags,#categories").val(); //the current tags in case they've been added
		var delimiter=$(this).parents(".editcategories").length>0&&currenttags!==""?",":currenttags===""?"=":"=";
		$(this).parent().parent().parent().find("#tagittags,#categories").val(currenttags + delimiter + recommendedtag).html(currenttags + delimiter + recommendedtag); //mash em up
		
		return false;
	});

	// populate creator tabs as content is entered.
	// uses js since we aren't doing posts. could ajax later as saving to server. this is demo code only
	if($('.creator').length>0) {
		$('.creator #title').blur( function() {	if($('.creator #title').val() !== "" ) { $('.quiztitle').html( this.value ); $('#preview legend.accessibility').html( this.value ); } });
		$('.creator #memo').blur( function() { if($('.creator #memo').val() !== "" ) { $('.quizmemo').html( this.value ); } });
	}


	//make the rating stars (transforms a regular form into something pretty)
	$('form.rating,div.rating').rating();

	$(".comment:odd").addClass("alternaterow");


	// MyStuff tables - pulls meta info out of ul in title_cell and adds it as a seperate, collapsed row below current.  also turns on toggling (to reveal item meta) on title_cell.  Formats meta row appropriately based on type of sort that has been done on the page; assumes that the .stuff container will have the appropriate (.category or .type) class appended.

	if ($(".stuff").length>0){
   		//var sortstate = $('.stuff').attr('class').match(/bycategory/) ? 'category' : 'type';

		/* wrap the meta info in a new row and move it to an appropriate place in the table.
		$('td.title_cell ul').toggleClass('closed').wrap("<tr class='meta'><td class='stuffmeta' colspan='4'></td></tr>").parent().parent().each(function() {
			if (sortstate == 'category') $(this).prepend('<td></td>');
			if ($(this).parent().attr('class').match(/alternaterow/)) {
			$(this).children('td').addClass('alternaterow'); 
		}
		$(this).parent().parent().after($(this));
		});*/
	
		/* attach the meta display toggle to the click event of the title cell.*/
		$('td.title_cell').click( function() {
			$(this).toggleClass('open');
			var collapser = $(this).parent().next('tr');
			collapser.toggle();
		});

	} //if (stuff)

	// un/check messages
	$(".checkall").click(function(){
		$(".mymessages input:checkbox").attr({ checked:"checked" });
		return false;
	});
	$(".uncheckall").click(function(){
		$(".mymessages input:checkbox").removeAttr("checked");		
		return false;
	});
	$("#selectallmessages").click(function() {
	
		if($(this).is(":checked")) {
			$(".mymessages input:checkbox").attr({ checked:"checked" });
		} else {
			$(".mymessages input:checkbox").removeAttr("checked");	
		}
	});

	//tagcloud switcher
	if($(".tagcloud").length>0) {

		//saved for later
		$(".taglist").each(function(t){	
			$(this).attr({"rel":"tags-"+t});
			QUIZ.taglist.push($(this).html()); 
			QUIZ.taglistgraph.push("");
		});

		// safari doesn't let the selected state change after the fact, so flag each and add in dom
		var selected = {
			size: "",
			color: "",
			graph: ""		
		};
		if(getCookie("tagtype")) {
			var cookietype = getCookie("tagtype");

			switch (cookietype) {
				case "size":
					selected.size = ' selected="selected"';
					break;
				case "graph":
					selected.graph = ' selected="selected"';
					break;	
				default:
					selected.color = ' selected="selected"';
					break;				
			}
		}	
		
		
		$("body:not(.tagspage) .taglist").before('<label class="tagview">View: <select><option value="size"'+selected.size+'>By Size</option><option value="color"'+selected.color+'>By Color</option><option value="graph"'+selected.graph+'>As Graph</option></select></label>');
		
		$("select").change(function(){ showTags($(this).val(),"",$(this).parent().parent()); });

		if(getCookie("tagtype")) {

			if(cookietype=="size" || cookietype=="graph") {
				$("#tagsby"+cookietype).parent().addClass("selected");
				showTags(cookietype);
				$("option[@value="+cookietype+"]").attr("selected","selected");
			} else {
				$("#tagsbycolor").parent().addClass("selected");
				showTags("color",cookietype);
				$("option[@value=color]").attr("selected","selected");
			}
		}
	} //tagcloud

	//tagtype switch on hub
	$(".toptagsbytype ol:not(#tags-quizzes)").hide();
	$("#tagtypeselect").change(function(){
		var val = $(this).val().toLowerCase();
		$(".toptagsbytype ol.taglist").hide();
		$("#tags-"+val).show();
	});
	// hub switch
	$("#globaltagstyle li a").click(function(){
		
		$("#globaltagstyle li").removeClass("selected");
		$(this).parent().toggleClass("selected");
		showTags($(this).attr("rel"));
		$(this).blur();
		return false;
	
	});
	

	//hide stuff turned on via thickbox
	$("div.helpcontainer").hide();

	/* toggles for register page document agreements */
	$("#usagepolicy, #contentpolicy").hide();

	$("label[@for=usagepolicyagree] a").click(function(){
		$("#usagepolicy").slideToggle(50); 	return false });

	$("label[@for=contentpolicyagree] a").click(function(){
		$("#contentpolicy").slideToggle(50); return false});

	$("label[@for=postingrulesagree] a").click(function(){
		$("#postingrules").slideToggle(50); return false;
	});


	/* DISPLAY COMMENTS IF SINGLE JOURNAL ENTRY 
	if($(".journalpage").length == 0) {
		$("#comments").hide();
	}*/
	$(".commentinvite a").click(function(){

		var hash = $(this).attr('href');
		
		if(hash == "#commentinputlabel") {
			if($("#comments").css("display")!="block") { $("#comments").toggle(); } 
			$("#commentinput").focus();
		} else {
		$("#comments").toggle();
		}
		
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
		      var $target = $(this.hash);
		      $target = $target.length && $target
		      || $('[name=' + this.hash.slice(1) +']');
		      if ($target.length) {
		        var targetOffset = $target.offset().top;
		        $('html,body').animate({scrollTop: targetOffset}, 150);
		       return false;
		      }
		    }
			/*
			plugin:
				get the current a's $target, hide it
				speed is a passable param
				$("a.toggler").targetScroll();
				$("a.toggler").targetScroll(250);
			*/
	});


	$(".shareitbutton + #shareit").hide()
	$("#shareittoggler").click(function(){
		$("#shareit").toggle();
		$(this).toggleClass("open").blur();		

		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
		    && location.hostname == this.hostname) {
		      var $target = $(this.hash);
		      $target = $target.length && $target
		      || $('[name=' + this.hash.slice(1) +']');
		      if ($target.length) {
		        var targetOffset = $target.offset().top;
		        $('html,body').animate({scrollTop: targetOffset}, 150);
		       return false;
		      }
		    }
	});

	//hide the textarea gigya gets its code from.
	$("#htmlsharecode, label[for=htmlsharecode]").hide();

	// hide/show email form
	$("#shareit #composemessage").hide();
	$(".shareemail a,#shareit .sendbuttons a.button").click(function(){
		
		var $this = $(this);
		/* reset gigya height to make slide below content */
		$("#shareit #composemessage").slideToggle("normal",function(){ 
			if($this.parents(".modalwrap").length>0) {
				$(".shareitwrapper").slideToggle("normal");
			} else { $(".gigya").toggleClass("plusone"); }
		});
		
		return false;
	});
	$("#shareit #composemessage").submit(function(){
											 
		$.post($(this).attr("action"),$(this).formSerialize(),function(){
		
			// USER CLICKS SEND, MESSAGE CHANGES, MOUSE TURNS TO DISPLAY 'NO LINK'
			$("#shareit #composemessage button").html('Message Sent!').css('cursor','default');
			
			// BYPASS SUBMISSION IF USER HAS SENT ALREADY
			$("#shareit #composemessage button").click(function() {
				if ( $("#shareit #composemessage button").html() == "Message Sent!") {return false;}
			});
			
			s = setTimeout('$("#shareit #composemessage").slideToggle("normal",function(){ $(".gigya").toggleClass("plusone"); $("#shareit #composemessage").find("button").html("Send").css("cursor","pointer"); $("#shareit #composemessage").resetForm(); });$("#shareit #composemessage button").click(function() {return true;});',2000);

		});
		return false;
											 
	});
	
	/* toggles for login form - forgot password and temporary 'sent'
		hides the second two divs and swaps them in and out.

		this is for display only. can be separated into ajax calls once hooked into the backend instead
		of having all elements inline on the page and hidden.

	*/
	$("#forgotpassword, #passwordsent").hide();
	var forgotpassword = $("#forgotpassword");

	$(".forgotpassword").click(function () {
		$("#loginformwrap").insertAfter("#forgotpassword");
		$("#forgotpassword, #loginformwrap").toggle();
		return false;
	});

	$("#forgotpassword button#gogogo").click(function () {
		$("#forgotpassword").insertAfter("#passwordsent");
		$("#forgotpassword, #passwordsent").toggle();
	});

	$("#passwordsent .loginlink").click(function () {
		$("#passwordsent").insertAfter("#loginformwrap");
		$("#loginformwrap, #passwordsent").toggle();
		return false;
	});
	
	/* NEW CANCEL BUTTON FOR FORGOT PASSWORD */
	$(".cancelbutton").click(function() {
		$("#forgotpassword, #loginformwrap").toggle();
		return false;
	});
	
/* behind the menu dropdowns we must put an iframe to save IE6 from the evil select dropdowns*/
/* because of the lag in menu operation that this fix introduces, it will only fire if there are selects
close enough to the top to neccessitate it.  because of this, it must be initalized after all other document.ready
functions have been completed, as these changes may move selects around on the page. */
if (typeof document.body.style.maxHeight == 'undefined')  {// true for IE6 ONLY.
	var selectflag = false;
	$('select').each(function(){ if ($(this).topPos() < 450) selectflag = true });
	if (selectflag) {
		$('#nav > li').hover(function() { 
			if ($(this).attr("id") != "games-menu") { // SINCE GAMES HAS NO CHILDREN, FIXING IE ERROR
				$(this).children('ul:first').before('<iframe class="selectfix" src="javascript:\'\'"></iframe>');
				$('.selectfix').height($(this).children('ul').height()+5);
			}
		},
		function(){
			$('.selectfix').remove();
		});// end $().hover()
	} //end if(selectflag)
}

/* folding lists - faqs, mystuff, myimages...*/
if ($('.squeezebox dl').length > 0){
	$('.squeezebox dt').click(function(){
		$(this).next("dd").toggle();
		$(this).toggleClass("selected");
	});
	$(".expandall").toggle(
		function() {
			$('.squeezebox dl dd').css("display","block"); // no more slidey slidey
			$('.squeezebox dl dt').addClass("selected");
			$(this).html("Collapse All")
			return false;
		},
		function(){
        	$('.squeezebox dl dd').css("display","none"); // no more slidey slidey
			$('.squeezebox dl dt').removeClass("selected");
			$(this).html("Expand All")
			return false;
		}
	);

		/* lightbox for delete cat */
	
	
	$(".remove_cat").click(function() {
		deleteThisCat = $(this).parent();
		$("#del_cat_msg").html("Are you sure you want to delete the category " + deleteThisCat.attr("title") + " ?");
		currentCat = deleteThisCat.attr("id");
	});
		
	$("#delete_cat").jqm({trigger: '.remove_cat', toTop: true}).hide();
	
	$("#del_cat").click(function() {	
			$.post("index.php",{'id':currentCat});
			deleteThisCat.next().remove();
			deleteThisCat.css("display","none");// no more slidey slidey
			if($(".jqmOverlay").length>0) { $(".jqmWindow").jqmHide(); }
		}
	);
	
	/* GLOBAL REMOVE FOR SQUEEZBOX ? */
	$('.squeezebox dt a').click(function(event) { 

		event.stopPropagation();
		$(this).parent().next().remove();

		// IF MYSTUFF, DON'T AUTOKILL CATEGORY
		if($(".mystuff").length<0) { $(this).parent().css("display","none"); }// no more slidey slidey
		
		/* this will hide the element.  link will still fire unless next line is uncommented.  if Ajax callback is needed, it can be added here; 
		change previous line to $(this).parent().slideUp('fast', function(){ ... your code here ... }); */
		// return false; 
	});
}


   	//$('.jqmWindow').jqm().hide();
	/* can be custom triggers/dialog class.  pagehelptrigger/pagehelp
	$('.pagehelp').jqm({
		trigger: '.pagehelptrigger',
    	overlay: 30,
		ajax: '@href', // Extract ajax URL from the 'href' attribute of triggering element
    	overlayClass: 'whiteOverlay'});*/
	$(".jqmWindow").prepend("<div class='jqmHeader'><a href='#' class='jqmClose'>Close</a> or ESC Key</div>").hide().wrapInner("<div class='modalwrap'></div>");

/*
	//listen for the escape key to hide the box
	 $(document).keydown( function( e ) {
	   if( e.which == 27) {  // escape, close box
	     $(".jqmWindow").jqmHide();
	   }
	 });
*/


	if ($('.myimages dl').length > 0){
		
		//hide delete confirm message
		$("#removeimage fieldset:eq(1), #removeimage fieldset:eq(2)").hide();
		
		$("#addimage").jqm({trigger: 'a.add', toTop: true}).hide();
		$("#editimage").jqm({trigger: '.myimages dd li a:not(.removeimage)', toTop: true}).hide();
		$(".myimages dd li a:not(.removeimage)").click(function() {
			$("#imageid").val($(this).children("img").attr("title")); 
			$("#editimage img").attr("src",$(this).children("img").attr("src"));
		});
		$("#removeimage").jqm({
			trigger: '.myimages dd li a.removeimage',
			toTop: true
       		}).hide();
		$(".removeimage").click(function() {
			$("#removeimgid").val($(this).attr("title"));
			removethisimg = $("#removeimgid").val();
		});
		//ajax to tell server image is deleted
		hasdel=0;
		$("#removeimage button[@type=submit]").click(function(){
			if(!hasdel) {
				$.ajax({
					type: "POST",
					url: $("#deleteimageform").attr("action"),
					data: "image="+removethisimg,
					success: function(msg) {
						$("#removeimage fieldset:eq(0), #removeimage fieldset:eq(2)").hide();
						$("#removeimage fieldset:eq(1)").show();
					},
					error: function(msg) {
						$("#removeimage fieldset:eq(0), #removeimage fieldset:eq(1)").hide();
						$("#removeimage fieldset:eq(2)").show();
					}				
				});
				hasdel=1;
			}
			return false;		
		});
		
		//Delete category. Modal submits a form
			$('.confirm-category-delete').jqm({trigger: '.myimages dt a', toTop: true, top: "100px", width: "500px" }).hide();	
			$(".myimages dt a").click(function(){
				var name = $(this).parent().html().split("(");
				$("#deletecategory").html($.trim(name[0]));	
				$("#categoryid").val($("#deletecategory").html());		
			});
	}

	
	//The actual backend functions need to be added to these.
	$('.confirm-delete').jqm({trigger: 'a.deletemessage', toTop: true, width: "500px" }).hide();	
	
	/* 	$(".listtable").each(function(){
		 $(this).find("tr:odd td").addClass("alternaterow");
	});*/
	//Delete content item. Modal submits a form
	$('.confirm-content-delete').jqm({trigger: 'a.deletecontent', toTop: true, width: "500px" }).hide();	
	$("a.deletecontent").click(function(){
		$("#itemid").val($(this).parents("tr").find(".title_cell a").attr("title"));
		getType = $(this).parents("tr").find(".title_cell a").attr("href").split('/');
		$("#typename").val(getType[getType.length-3]);
		$("#deletename").html($(this).parents("tr").find(".title_cell a").html());	
	});	

	//Delete category. Modal submits a form
	$('.confirm-category-delete').jqm({trigger: '.stuff dt a', toTop: true, top: "100px", width: "500px" }).hide();	
	$(".stuff dt a").click(function(){
		var name = $(this).parent().html().split("(");
		$("#deletecategory").html($.trim(name[0]));	
		$("#categoryid").val($("#deletecategory").html());		
	});

	//Edit categories. Modal submits a form
	$('.category-select').jqm({trigger: 'a.categoryselect', toTop: true, width: "500px" }).hide();	
	$("a.categoryselect").click(function(){		
		$("#categoryname").html($(this).parents("tr").find(".title_cell a").html());
		var val = typeof($(this).attr("rel")) != "undefined" ? $(this).attr("rel") : "";
		$("#categories").val(val);
		$("#contentid").val($(this).parents("tr").find(".title_cell a").attr("title"));
	});	
	

	//The actual backend functions need to be added to these.
 	function share_writer(info,link){
		
		info=info.split(',');
	
		// OS X FF has trouble with flash on opacity
		function detectMacXFF() {
			var userAgent = navigator.userAgent.toLowerCase();
			if (userAgent.indexOf('mac') != -1 && userAgent.indexOf('firefox')!=-1) {
				return true;
			}
		}
		if (detectMacXFF()) { $(".jqmOverlay").css({ opacity:"1", background: "transparent url(" + qzPath + "/templates/QZ2/images/dev/modal_bg.png) repeat" }); }
		
		$("p.sharelink").text(document.location.protocol+'//'+document.location.host+link);
		
		// append content url to yahoo messenger href
		document.getElementById("ymsgrlink").href=document.getElementById("ymsgrlink").href + document.location.protocol+'//'+document.location.host+link;
		
		// append content url to AIM messenger href
		document.getElementById("aimlink").href=document.getElementById("aimlink").href + document.location.protocol+'//'+document.location.host+link;

		qtype=info[0];
		qid=info[1];
		qtitle=info[2];
		
		// set item id, item type, url and title hidden vars in shareit form block
		document.getElementById("item_id").value=qid;
		document.getElementById("title").value=qtitle;
		document.getElementById("item_type").value=qtype;
		document.getElementById("url").value=document.location.protocol+'//'+document.location.host+link;

		
		$("#htmlsharecode").text(embedwrite);
		
		var pconf= {
			UIConfig: '<config><display showCloseButton="false" networksToHide="" networksWithCodeBox="" networksToShow="myspace, hi5, facebook, tagged, blogger, freewebs, livejournal, typepad, bebo, livespaces, wordpress" /><body><controls><snbuttons iconsOnly="false" /></controls></body></config>',
			 defaultContent: 'htmlsharecode',
			 showEmailAfterPost: 'false'
			};
		
		Wildfire.initPost('13481', 'divWildfirePost', 570, 200, pconf);
	}
	
	var close = function(hash){ hash.w.hide(); hash.o.remove(); if(document.all){$("#createtype").show()}};
	$('.share-content').jqm({trigger: 'a.sharecontent', toTop: true, width: "650px" }).hide();	
	$('.sharecontent').click(function(){
		share_writer( $(this).attr("title"), $(this).parents("tr").find(".title_cell a").attr("href") );
	});

	
	// autocomplete for typing name on compose message
	if($("#composemessage #messageto").length>0){
		$("#composemessage #messageto").autocompleteArray(getFriends());
	}
	// message recipient box, compose message page
	// MODIFIED TO ACCEPT ONLY ONE USER FROM FRIEND LIGHTBOX
	$('#selectrecipient').click(function(){
		$("#messageto").val("");
		$("#messagerecipientselect .friendslist a").removeClass("selected");
	});
	$('#messagerecipientselect').jqm({trigger: '#selectrecipient', toTop: true	}).hide();
	$('#messagerecipientselect li a').click(function(){
		$("#messagerecipientselect .friendslist a").removeClass("selected");
		$(this).blur().toggleClass("selected");
		return false;
	});

	// use hash to prevent modul on backbutton
	if($('#confirmsent').length>0 && location.hash == "#confirm") {
		$('#confirmsent').jqm({	onHide: function(hash) { hash.w.remove(); hash.o.remove(); location.hash = "#"; } }).jqmShow();
	}

	$('#toselection').click(function() {
		var selected = $("#messagerecipientselect a.selected img").attr('alt');
		$("#messageto").val(selected);
		$('#messagerecipientselect').jqmHide();
		return false;
	});
	
	$("#favoritesconfirmation").jqm({trigger: '.addtomyfavorites', toTop: true}).hide();
	$(".favoritelisting a.remove").click(function(){
		var url = $(this).attr('title');
		var content = url.split(',');
		
		var c_type = content[0];
		var c_id = content[1]
		
		$get('index.php?a=communication&app='+c_type+'& task=removefromfavorites&protocol=json&id='+c_id);
		
		var $table = $(this).parents("table");
		$(this).parents("tr").remove();
		$table.find("td").removeClass("alternaterow");
		$table.find("tr:odd td").addClass("alternaterow");
	});
	
	$('#invitefriendformwrap').jqm({trigger: '.invitefriend .gobutton', toTop: true});
	// form validation for invite friend & submission behavior handled in forms.validation.js
	
	// wires up the 'delete account' confirmation lightbox on edit profile.  callback to delete account should probably put on the 'ok' button on that dialoge, which can be found on the edit profile page immediately below the "Delete This Account" button.
	$("#deleteaccountconfirm").jqm({trigger:"#deleteaccountbutton", toTop: true});

	var checkcom = function(hash) {
		if(hash.t.href.match(/#c/)) {
			commentid = hash.t.href.split("#");
			c_id = commentid[1].substring(1,commentid[1].length);
			$("#com_id").val(c_id);
			actionstring = $("#reportitform").attr("action");
			$("#reportitform").attr( "action", actionstring+"&comment_id="+c_id); 
		}
		
	}

	$("#reportitcontainer").jqm({trigger: '.reportit', toTop: true, onShow:checkcom}).hide();

	$("#reportitconfirmation").hide();
	$("#resetreport").click(function() {
		$('#reportitcontainer').jqmHide();
		$("#reportitform, #reportitconfirmation").toggle();
		$("#report_comments").val("");
	});
	$("#reportit form").submit(function() {
	
		// DO NOT EDIT BELOW VALUE NAMES (reason, comments)
		$.post(this.action,{'reason':this.why_reported.value, 'comments':this.commentfield.value});  

		$("#reportitconfirmation, #reportitform").toggle();
		
		return false;
	});
	
	$("#reportit button .formsubmit").click(function(){ 
		return false;
	});
	

	/* quiz results buttons : view and save results */
	$("#allresultscontainer").jqm({trigger: '.viewallresults', toTop: true}).hide();
	$("#savedresultsconfirmation").jqm({trigger: '.savemyresults', toTop: true}).hide();


	/* below adds extra js alert to delete account lightbox 
		$("#deleteaccountbutton").not("label").click(function(){
		return confirm("Are you sure you want to delete your account? You cannot undo this.");
	}); */
 	
	// Clear out current user name
	//document.forms["logf"].elements[1].value  = "";
	$('#login_username').focus(function(event) {
		$('#login_username').removeClass('logu');
		$('#login_password').removeClass('logp');
	});

	$('#login_password').focus(function(event) {
		$('#login_password').removeClass('logp');
	});
	
	$(".ratingdisplay_ulo").bind("mouseover",function() {
		$(".display_u_msg").toggle();
		if( $(".display_u_msg").html() != "You've already rated this!" ) {
			$(".ratingdisplay_ulo").css("cursor","pointer");
		}
	});
	
	$(".ratingdisplay_ulo").click(function() {
		if( $(".display_u_msg").html() != "You've already rated this!" ) {
			document.location = "/index.php/register/login/";
		}
		return false;
	});
	
	$(".ratingdisplay_ulo").bind("mouseout",function() {
		$(".display_u_msg").toggle();
	});
	
	/* lightbox for rss help */
	$("#rsshelpcontainer").jqm({trigger: '.rsshelp', toTop: true}).hide();
	


	/* BELOW CHANGES MESSAGES TO USE BLUE MESSAGING INSTEAD OF DEFAULT ERROR MESSAGING
		TO CHANGE TO BLUE, AD IDENTICAL COPY INTO messagesToChange ARRAY */
		
	messagesToChange = ["Profile Updated","Image Added","Message Sent"];
	
	function checkErrorMessage() {
		txt = $("#system-message ul li").html();
		for(i=0;i<messagesToChange.length;i++) {
			if (messagesToChange[i] == txt || messagesToChange[i] + " " == txt) {
				return true;
			}
		} 
		return false;
	}
		
	if ( checkErrorMessage() ) {
		$("#system-message dd").css({background:"#E1EBED",color:"#187682",border:"1px solid #187682"});
	}
	
	
	/* USER PROFILE BUTTON BEHAVIORS */
	$("#addasfriend").click(function(){
		curMsg = $("#addasfriend").html();
		curUsr = $("#addasfriend").attr("title");
		switch (curMsg) {
			case "add friend":newMsg ="remove friend";
				$.ajax({
					type: "POST",
					url: "index.php?a=communication&app=user&task=addfriend&protocol=json&view=friends&profile_username="+curUsr,
					data: "name="+curUsr,
					success:function(msg) {
						if (msg != "ok" ) {
							$("#gen_msg").html(msg);
							$(".generic-message").jqm().jqmShow();
							newMsg = "add friend"; // fails for some reason
						}
					},
					error:function() {
						$("#gen_msg").html("Whoopse! Cannot Add Friend!");
						$(".generic-message").jqm().jqmShow();
						newMsg = "add friend"; // fails for some reason
					}
				});break;
					
			case "remove friend":newMsg = "add friend";
				$.ajax({
					type: "POST",
					url: "index.php?a=communication&app=user&task=removefriend&protocol=json&view=friends&profile_username="+curUsr,
					data: "name="+curUsr,
					success:function(msg) {
						if (msg != "ok" ) {
							$("#gen_msg").html(msg);
							$(".generic-message").jqm().jqmShow();
							newMsg = "remove friend"; // fails for some reason
						}
						
					},
					error:function() {
						$("#gen_msg").html("Whoopse! Cannot Remove Friend!");
						$(".generic-message").jqm().jqmShow();
						newMsg = "remove friend"; // fails for some reason
					}
				});break;
			default:return false;
		}
		$("#addasfriend").html(newMsg);
		return false;
	});
	
	$("#watchthisuser").click(function(){
		curMsg = $("#watchthisuser").html();
		curUsr = $("#watchthisuser").attr("title");
		switch (curMsg) {
			case "add to watch list":newMsg ="remove from watch list";
				$.ajax({
					type: "POST",
					url:"index.php?a=communication&app=user&task=addtowatchlist&protocol=json&view=watchlist&profile_username="+curUsr,
					data: "name="+curUsr,
					success:function(msg) {
						if (msg != "ok" ) {
							$("#gen_msg").html(msg);
							$(".generic-message").jqm().jqmShow();
							newMsg = "add to watch list"; // fails for some reason
						}
						
					},
					error:function() {
						$("#gen_msg").html("oh noes! couldn't add to watch list!");
						$(".generic-message").jqm().jqmShow();
						newMsg = "add to watch list"; // fails for some reason
					}
				});break;
			case "remove from watch list":newMsg = "add to watch list";
				$.ajax({
					type: "POST",
					url:"index.php?a=communication&app=user&task=removefromwatchlist&protocol=json&view=watchlist&profile_username="+curUsr,
					data: "name="+curUsr,
					success:function(msg) {
						if (msg != "ok" ) {
							$("#gen_msg").html(msg);
							$(".generic-message").jqm().jqmShow();
							newMsg = "remove from watch list"; // fails for some reason
						}
						
					},
					error:function() { 
						$("#gen_msg").html("oh noes! couldn't remove from watch list!");
						$(".generic-message").jqm().jqmShow();
						newMsg = "remove from watch list"; // fails for some reason
					}
				});break;
			default:return false;
		}
		$("#watchthisuser").html(newMsg);
		return false;
	});
	 
	$("#blockconfirm").click(function(){
		 $(".jqmWindow").jqmHide();
		curMsg = $("#blockthisuser").html();
		curUsr = $("#blockthisuser").attr("title");
		switch (curMsg) {
			case "block user":
				newMsg ="unblock user";
				$.ajax({
					type: "POST",
					url: "index.php?a=communication&app=user&task=addblock&protocol=json&view=friends&profile_username="+curUsr,
					data: "name="+curUsr,
					success:function(msg) {
						if (msg != "ok" ) {
							$("#gen_msg").html(msg);
							$(".generic-message").jqm().jqmShow();
							newMsg = "block user"; // fails for some reason
						}
						
					},
					error:function() { 
						$("#gen_msg").html("oh noes! couldn't block user!");
						$(".generic-message").jqm().jqmShow();
						newMsg = "block user"; // fails for some reason
					}
				});break;
			case "unblock user":newMsg="block user";
			default:return false;
		}
		
		$("#blockthisuser").html(newMsg);
		return false;
	});
	
	
	
	/* WATCHED LIST PG REMOVE BUTTON */
	$("#wl").jqm({trigger:".rmfwl", toTop: true});
	$(".rmfwl").click(function(){
		curUsr = $(this).parent("li").children("a").children("img").attr("alt");
		$("#wl p").html("Are you sure you want to remove <b>" + curUsr + "</b> from your Watched List?");
		return false;
	});
	$("#confirmrflw").click(function() {
			$.ajax({
				type: "POST",
				url:"index.php?a=communication&app=user&task=removefromwatchlist&protocol=json&view=watchlist&profile_username="+curUsr,
				data: "name="+curUsr,
				success:function(msg) {
					if (msg != "ok" ) {
						$("#gen_msg").html(msg);
						$(".generic-message").jqm().jqmShow();
						newMsg = "add to watch list"; // fails for some reason
					}
					
				},
				error:function() {
					$("#gen_msg").html("oh noes! couldn't add to watch list!");
					$(".generic-message").jqm().jqmShow();
					newMsg = "add to watch list"; // fails for some reason
				}
			});
		$(".jqmWindow").jqmHide();
		return true;
	});

	
	/* REGISTRATION HOTWIRE */
	$("#usagepolicy,#contentpolicy,#postingrules").children("div").css("width","360px");
	$("#reggo").click(function(){
		$("#registrationform").submit();
	});
	
	$("#addfav").click(function() {
		curMsg = $(this).html();
		curLink = $(this).attr("href").split("task=");
		addorremove = curLink[1].split("&");
		
		newtask= (curLink[0] + "task=" +((addorremove[0] == "addtofavorites")?"removefromfavorites":"addtofavorites")+"&protocol=json&"+addorremove[2]);
		
		if (curMsg == "add to favorites" || curMsg == "remove favorite") {
			$.get($(this).attr("href"));
			$(this).attr("href",newtask);
			$(this).html((curMsg == "add to favorites")?"remove favorite":"add to favorites");
		}
		
		return false;
	});
	
	
	
	$("#report_topic").change(function(){
		if($(this).val() == 2) {
			$(this).after("<div id=\"copyalert\">Be sure to include a link to the original piece of work you believe is being plagiarized here.</div>");
		} else {
			if($("#copyalert")) { $("#copyalert").remove(); }
		}
	});
	
	if($("input#contentpassword").val() != "") {
		$("#sharewithpasswordonly").css("display","block");
	}
	
	$("#msg_blockthisuser").click(function() {
		switch ( $("#msg_blockthisuser").html() ) {
			case "block user":$('.msg_confirm-block').jqm().jqmShow();break;
			case "unblock user":$.post('index.php?a=communication&app=user&task=removeblock&protocol=json&view=message&profile_username='+$("#msg_blockthisuser").attr("title"));$("#msg_blockthisuser").html("block user");break;
			default:return false;
		}
	});

	$("#msg_block").click(function() {
		$.get('index.php?a=communication&app=user&task=addblock&protocol=json&view=message&profile_username='+$("#msg_blockthisuser").attr("title"));
		$("#msg_blockthisuser").html("unblock user");
	});
	
	$("#msg_blockdel").click(function() {
		//$.get('index.php?a=communication&app=user&task=deletemsg&protocol=json&view=message&profile_username='+$("#msg_blockthisuser").attr("title"));
	});
	
	
	/* WATCH LIST FUNCS */
	$(".wl_userlink").click(function(){
		curUsr = $(this).children("img").attr("alt");
		
		$.ajax({
				type: "POST",
				url:"index.php?app=user&task=getNewestContent&protocol=json&view=watchlist&profile_username="+curUsr,
				data: "name="+curUsr,
				success:function(msg) {
					getCnt = msg.split('.');
					cnt = getCnt[getCnt.length-1];
					
					if(cnt<5) {
						$("#wl_list").css({overflow:"visible",height:"auto"});
					} else {
						$("#wl_list").css({overflow:"auto",height:"300px"});
					}
					msg = msg.substring(0,msg.length-4);

					$("#wl_nc").remove();
					$("#wl_list").after("<div style=\"width:600px;text-align:right;\" id=\"wl_nc\"><a href=\"#\" onclick=\"javascript:window.location.reload();\">50 Newest Creations</a></div>");
					$("#wl_list").html(msg);
					$("#wl_title span").html(curUsr + "'s Newest Creations");			
				},
				error:function(msg) {
					alert('bork!');
				}
			});
		
		});
	
	$(".journalentry h2").each(function(i) {
		if (i != 0) $(this).css({background:"none",color:"#000"});
	});
	
	$('#creator').css("display","block");
	$('#loadmsg').css("display","none");
	
	getNewAds();
});// document ready / end jquery functions / FLAG END OF DOCLOAD

function getNewAds() {
	//console.log('updating');
	$("#qzBannerAd").attr({src:$("#qzBannerAd").attr('src')});
	$("#qzRColAd").attr({src:$("#qzRColAd").attr('src')});
	at=setTimeout('getNewAds()',60000);
}
sentmsg=0;
function checkSend() {
	if (!sentmsg) {return true; sentmsg=1;}else{return false;}
}
function parseURLVar() {
	var getURLVars = new Array();
	var URLqString = unescape(top.location.search.substring(1));
	if (URLqString.length>0) {
	var pairs = URLqString.split(/\&/);
		for (var i in pairs) {
			if (!isNaN(i)) {
				var nameVal = pairs[i].split(/\=/);
				getURLVars[nameVal[0]] = nameVal[1];
			}
		}
	return getURLVars;
	}
}
	
function getAds(w,h,tile) {
	
	var g = parseURLVar();
	var appendQStringToDBClickURL = '';
	
	if (g) {
		for (var i in g) {
			if (i=='testmode') {
				if (g[i] == '') {
					appendQStringToDBClickURL = 'testmode=on;';
				}
				else if (!isNaN( g[i] )) {
					appendQStringToDBClickURL = i+'='+g[i]+';';
				} else {
					appendQStringToDBClickURL = 'testmode=on;';
				}
			}
		}
	}

	
	AdDcopt = (tile == 1)?'dcopt=ist;':AdDcopt = '';
	AdPage = (window.DCadPage)?'page=' + DCadPage + ';':'';
	
	var curH = fetchHierarchy(app,view,title,item_id,id);
	curH = curH.split('/');

	var sections = "";

	for(var c=0;c<curH.length;c++) {
		if (curH[c]!="") {sections += "sec"+c+"="+curH[c];}
		if (c!=curH.length) {sections+=';';}
	}

	sections = (app=="default") ? sections.substring(0,sections.length-1):sections;
	sections = sections.replace(/ /g,"_");
	
	var rnd=Math.round(Math.random()*10000000000000000);
	var pth="<scr"+"ipt type='text/javascript' language='javascript' src='https://web.archive.org/web/20100105001639/http://ad.doubleclick.net/adj/quizilla.nol/atf_j_s/home;"+sections+"pos=atf;tag=adj;mtype=standard;sz="+w+"x"+h+";" + AdDcopt + appendQStringToDBClickURL + AdPage + "tile="+tile+";u=mtype-standard|tile-1;ord="+rnd+"?'><\/scr"+"ipt>";
	
	return pth;
}

function getAdParams(w,h,tile) {

	var g = parseURLVar();
	var appendQStringToDBClickURL = '';

	if (g) {
		for (var i in g) {
			if (i=='testmode') {
				if (g[i] == '') { 
					appendQStringToDBClickURL = 'testmode=on;'; 
				} else if (!isNaN( g[i] )) { 
					appendQStringToDBClickURL = i+'='+g[i]+';'; 
				} else { 
					appendQStringToDBClickURL = 'testmode=on;'; 
				} 
			}
		}
	}

	var AdDcopt = (tile == 1)?'dcopt=ist;':AdDcopt = '';
	var AdPage = (window.DCadPage)?'page=' + DCadPage + ';':'';
	var curH = fetchHierarchy(app,view,title,item_id,id);

	return({size:w+"x"+h,keyValues:AdDcopt+appendQStringToDBClickURL+AdPage+"tile="+tile+";",sections:curH});
}





function fetchHierarchy(a,v,t,iid,gid) {//formerly in coda_funcs
	
	if (v=="create"){v=a;a="creator";}
	if (v=="type" && a=="quizzes")  { a="creator";v="quiz_"+v; }
	
	switch(a) {
		case "register":a="utils";break;
		case "pages":a="info";break;
		case "user":
		case "my":a="mystuff";break;
		default:break;
	}
	
	h=(a=="default")?"home/home":a;

	if ( (h != "home") || (h != "search") ) {
		h += (view=="" && a!="default" && a!="info" && a!="utils") ? "/hub":"/"+v;
		if (a=="utils" && (!v) ) {h +="register";}
		switch (v) {
			case "quiz":
			case "test":
			case "lyric":
			case "poem":
			case "poll":
			case "story":h += "/"+t;break;
			case "info":h += "/"+iid;break;
			default:break;
		}
	}
	
	if (a=="lists") {h = "home/lists/"+ ( (v=="top")?"top_rated":v);}
	if (a=="games" && (gid) ) { h += "/"+gid; }
	return h;
}

/*/ search func
function chksearch(qs) {
	f=document.forms["sform"];
	if (f.q.value=="") return false;
	m="https://web.archive.org/web/20100105001639/http://search.live.com/results.aspx?q="+escape( f.q.value.replace(/ /g, "+") )+"&mkt=en-us&FORM=VCM017";
	if(f.stype[0].checked){window.open(m);return false;}else{f.action=qs;f.submit();}
	return true;
}*/
	
// a jquery cancel default
$.fn.cancel = function( e ) { return this.bind( e, function() { return false; } ); };


/*clear search field on click - made into plugin so it can easily be used more than once. use: $("input id/class").inputClear(). */
$.fn.inputClear = function() {
	return this.focus(function() {
		if( this.value == this.defaultValue ) {
			this.value = "";
		}
	}).blur(function() {
		if( !this.value.length ) {
			this.value = this.defaultValue;
		}
	});
};

$.fn.topPos = function() {
	var curtop = 0;
	var obj=this.get(0);
	if (obj.offsetParent) {
		curtop = obj.offsetTop
		while (obj = obj.offsetParent) {
			curtop += obj.offsetTop
		}
	}
	return curtop;
}


// some vars we use to check status
var QUIZ = function () {
	return {
		cpon : 0, // was for color picker
		edititem : 0, // for quiz creation
		section : 0, // for quiz creation
		results : 1,
		questions : 1,
		answers : 1,
		currentLabel: "",
		resultsstatus : ' disabled="disabled"',
		newresult : "",
		image : "",
		gotoquestion : "", // jump back after result creation
		returnanswer : "", // populate after result creation
		taglist : Array(), // tagstyle
		taglistgraph : Array(), // tagstyle
		tagcolors : Array("red","blue","green","purple","yellow","brown"),
		type : "",
		scored : 0,
		f: "", // for onblur + cancel action in jeditable
		params: "",

		result : function(title,description) { //this got dropped
			this.title = title;
			this.description = description;
		}
	}
}();

// close stuff with esc key
$(document).keydown( function( e ) {
	if( e.which == 27) {  // escape, close box
		// remove jqmodal

		if($(".jqmOverlay").length>0) { $(".jqmWindow").jqmHide(); }
		// remove colorpicker
		if(QUIZ.cpon == 1) { cp_remove(); }
	}
});

// close color picker when click away.
// todo: make it not coloorpicker only
document.onclick=check;
function check(e){
	var target = (e && e.target) || (event && event.srcElement);
	var obj = document.getElementById('colorpicker');
	if (target != document.getElementById("cpicon")&&target != document.getElementById("cpclose")&&QUIZ.cpon == 1) {
		checkParent(target) ? cp_remove() : null;
	}
}
function checkParent(t){
	while(t.parentNode){
		if(t==document.getElementById('colorpicker')){
			return false
		}
		t=t.parentNode
	}
	return true
}

// toggle and reset
function cp_remove() {
	$("#colorpicker").remove();
	QUIZ.cpon = 0;
}

/* toggle the color picker
function cp_toggle() {
	$('#colorpicker').toggle();
	$('form.colorpicker .colorpickerclose').toggle();
	QUIZ.cpon = 0 ? 0 : 1;
}*/

function breaker() {
	loc = window.location.href.split('/');
	return (loc[loc.length-1] == "create" && loc[loc.length-2] == "stories") ? true:false;
}


// init the RTE if it's included. textarea class=rte
if(typeof(tinyMCE)!="undefined") {

	tinyMCE.init({
		force_p_newlines : breaker(),
		mode : "textareas",
		theme : "advanced",
		editor_selector : "rte",
		convert_fonts_to_spans : true,
		invalid_elements : "font",
		inline_styles : true,
		relative_urls : false,
		remove_script_host : false,
		plugins : "inlinepopups,searchreplace,quizimage",
		theme_advanced_buttons1 : "bold,italic,underline,formatselect,fontselect,fontsizeselect,separator,forecolor,separator,removeformat,separator,image",
		theme_advanced_buttons2 : ",justifyleft,justifycenter,justifyright,justifyfull,separator,cut,copy,paste",
		theme_advanced_buttons3 : "",
		theme_advanced_fonts : "Andale Mono=andale mono,monospace;Arial=arial,helvetica,sans-serif;Arial Black=arial black,sans-serif;Century Gothic=century gothic,sans-serif;Courier New=courier new,courier,monospace;Comic Sans MS=comic sans,cursive;Georgia=georgia,arial,helvetica,san-serif;Impact=impact,sans-serif;Times-Roman=Times New Roman,Times,times,timesroman,serif;Trebuchet MS=trebuchet ms,san-serif;",
		theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		extended_valid_elements : "em/i,strong/b,u,a[name|href|target|title|onclick],img[style|rel|class|src|alt|title|width|height|name],hr[class|width|size],span[class|style]"
	});
}

// showtags
function showTags(type,color,obj) {

	var $obj = $(obj);

	switch (type) {
		case "size":
			$obj.find(".taglist").removeClass(QUIZ.tagcolors.join(" ")+" graph").addClass("size");
			$obj.find(".tagselect").remove();
			
			// if it's not graph but coming from, replace html with og and pull the sorted class
			$obj.find(".sorted").each(function(){
				var tindex = $(this).attr("rel").substring(5);
				$(this).html(QUIZ.taglist[tindex]);
				$(this).removeClass("sorted");
			});

			// remember for next time
			setCookie("tagtype", type);
			break
		case "color":
				
				
			if($obj.find(".tagselect").length==0) {
		
				$obj.find(".taglist").removeClass(QUIZ.tagcolors.join(" ")+" graph size").addClass(QUIZ.tagcolors[0]);
			
				/* BELOW BREAKS COLOR BLOCKS ON TAG HUB
				
				if((arguments.length>2 || color!="") && $("body.tagspage").length==0) { $obj.find(".taglist").before(colorList()); } else {$("#globaltagstyle").append(colorList());	 }
				
				*/
				
				$obj.find(".taglist").before(colorList());
				
				
				// if it's not graph but coming from, replace html with og and pull the sorted class
				$obj.find(".sorted").each(function(){
					var tindex = $(this).attr("rel").substring(5);
					$(this).html(QUIZ.taglist[tindex]);
					$(this).removeClass("sorted");
				});

			//change on hover
				$obj.find(".tagselect a").cancel("click").click(function(){
				var tempcolor = $(this).attr("href").split("#");
				var newcolor = tempcolor[1];

				$(this).parent().parent().parent().find(".tagselect a").removeClass("on");
				$(this).addClass("on");

				// remove all possible colors and add just the hovered
					// below line was used for individual cloud controls on tags page. change to global control
					// $(this).parent().parent().parent().find(".taglist").removeClass(QUIZ.tagcolors.join(" ")+" graph").addClass(newcolor);	
					$(".taglist").removeClass(QUIZ.tagcolors.join(" ")+" graph").addClass(newcolor);

				// remember for next time
				setCookie("tagtype", newcolor);
			});

			if(color) {
					$obj.find(".taglist").addClass(color);
					$obj.find(".tagselect li."+color+" a").addClass("on");
				} else { 
					$obj.find(".tagselect li:first a").addClass("on");
				}
			}
			
			break
		case "graph":
			$obj.find(".taglist").removeClass(QUIZ.tagcolors.join(" ")+" size").addClass("graph");
			$obj.find(".tagselect").remove();
			sortList($obj.find(".taglist"),"class");

			// remember for next time
			setCookie("tagtype", type);
			break
	}
}

//buildcolorlistforselection
function colorList() {
	var list = '<ul class="tagselect">';
	for(i=0;i<QUIZ.tagcolors.length;i++) {
		list += '<li class="'+QUIZ.tagcolors[i]+'"><a href="#'+QUIZ.tagcolors[i]+'">'+QUIZ.tagcolors[i]+'</a></li>';
	}
	list += '</ul>';
	return list;
}

// sort list of tags for graph
function sortList(obj,attr) {

	var $obj = $(obj);	
	if($obj.find(".sorted").length==0) {		
		$obj.each(function(t) {							 
			
			var $current = $(this);			
			if(!QUIZ.taglistgraph[t] || QUIZ.taglistgraph[t]=="") {				
				QUIZ.taglistgraph[t]=="";
			var i = 10;
			while(i>0) {
					$current.find(".rank-"+i).each(function(){		
						QUIZ.taglistgraph[t] += "<li>"+$(this).parent().html()+"</li>";
				});
				i--;
			}
		}
			$current.addClass("sorted").html(QUIZ.taglistgraph[t]);			
		});
	}
}

// Cookies get/set/delete
function getCookie( name ) {
	var start = document.cookie.indexOf( name + "=" );
	var len = start + name.length + 1;
	if ( ( !start ) && ( name != document.cookie.substring( 0, name.length ) ) ) {
		return null;
	}
	if ( start == -1 ) return null;
	var end = document.cookie.indexOf( ";", len );
	if ( end == -1 ) end = document.cookie.length;
	return unescape( document.cookie.substring( len, end ) );
}
function setCookie( name, value, expires, path, domain, secure ) {
	var today = new Date();
	today.setTime( today.getTime() );
	if ( expires ) {
		expires = expires * 1000 * 60 * 60 * 24;
	}
	var expires_date = new Date( today.getTime() + (expires) );
	document.cookie = name+"="+escape( value ) +
		( ( expires ) ? ";expires="+expires_date.toGMTString() : "" ) + //expires.toGMTString()
		( ( path ) ? ";path=" + path : "" ) +
		( ( domain ) ? ";domain=" + domain : "" ) +
		( ( secure ) ? ";secure" : "" );
}
function deleteCookie( name, path, domain ) {
	if ( getCookie( name ) ) document.cookie = name + "=" +
			( ( path ) ? ";path=" + path : "") +
			( ( domain ) ? ";domain=" + domain : "" ) +
			";expires=Thu, 01-Jan-1970 00:00:01 GMT";
}
/* popular array for compose message to field friends autocomplete */
function getFriends() {
	
	var friends = new Array();
	$("#messagerecipientselect .friendslist a img").each(function(){	
		friends.push($(this).attr("alt"));	
	});
	
	return friends;	
}

Array.prototype.inArray = function (value)
// Returns true if the passed value is found in the
// array.  Returns false if it is not.
{
    var i;
    for (i=0; i < this.length; i++) {
        // Matches identical (===), not just similar (==).
        if (this[i] === value) {
            return true;
        }
    }
    return false;
};

function singleApp(a) {
	switch(a) {
		case "quizzes":ap="quiz";break;
		case "tests":ap="test";break;
		case "stories":ap="story";break;
		case "polls":ap="poll";break;
		case "poems":ap="poem";break;
		case "lyrics":ap="lyrics";break;
		default: ap="quiz";break;
	}
	return ap;
}

function setupPopQuiz() { 
	pt=$("#hub_list").text().split(', ');
	mod = "<div><h2><span>"+pt[0]+"<\/span><\/h2>";
	for(i=1;i<pt.length;i++) {
		mod += '<a href="/hubs/'+hubruls[i-1]+'">'+pt[i]+'<\/a> | ';
	}
	mod = mod.substring(0,mod.length-2);
	
	return mod+"</div>";

}

/*
 * jqModal - Minimalist Modaling with jQuery
 *
 * Copyright (c) 2007 Brice Burgess <bhb@iceburg.net>, http://www.iceburg.net
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * $Version: 2007.08.17 +r11
 * 
 */
(function($) {
$.fn.jqm=function(o){
var _o = {
zIndex: 3000,
overlay: 50,
overlayClass: 'jqmOverlay',
closeClass: 'jqmClose',
trigger: '.jqModal',
ajax: false,
target: false,
modal: false,
toTop: true, /*changed this to true to fix all in ie*/
onShow: false,
onHide: false,
onLoad: false
};
return this.each(function(){if(this._jqm)return; s++; this._jqm=s;
H[s]={c:$.extend(_o, o),a:false,w:$(this).addClass('jqmID'+s),s:s};
if(_o.trigger)$(this).jqmAddTrigger(_o.trigger);
});};

$.fn.jqmAddClose=function(e){hs(this,e,'jqmHide'); return this;};
$.fn.jqmAddTrigger=function(e){hs(this,e,'jqmShow'); return this;};
$.fn.jqmShow=function(t){return this.each(function(){if(!H[this._jqm].a)$.jqm.open(this._jqm,t)});};
$.fn.jqmHide=function(t){return this.each(function(){if( (H[this._jqm]) && (H[this._jqm].a) )$.jqm.close(this._jqm,t)});}; //added check to see if this._jqm exists

$.jqm = {
hash:{},
open:function(s,t){var h=H[s],c=h.c,cc='.'+c.closeClass,z=(/^\d+$/.test(h.w.css('z-index')))?h.w.css('z-index'):c.zIndex,o=$('<div></div>').css({height:'100%',width:'100%',position:'fixed',left:0,top:0,'z-index':z-1,opacity:c.overlay/100});h.t=t;h.a=true;h.w.css('z-index',z);
 if(c.modal) {if(!A[0])F('bind');A.push(s);o.css('cursor','wait');}
 else if(c.overlay > 0)h.w.jqmAddClose(o);
 else o=false;

 h.o=(o)?o.addClass(c.overlayClass).prependTo('body'):false;
 if(ie6){$('html,body').css({height:'100%',width:'100%'});if(o){o=o.css({position:'absolute'})[0];for(var y in {Top:1,Left:1})o.style.setExpression(y.toLowerCase(),"(_=(document.documentElement.scroll"+y+" || document.body.scroll"+y+"))+'px'");}}

 if(c.ajax) {var r=c.target||h.w,u=c.ajax,r=(typeof r == 'string')?$(r,h.w):$(r),u=(u.substr(0,1) == '@')?$(t).attr(u.substring(1)):u;
  r.load(u,function(){if(c.onLoad)c.onLoad.call(this,h);if(cc)h.w.jqmAddClose($(cc,h.w));e(h);});}
 else if(cc)h.w.jqmAddClose($(cc,h.w));

 if(c.toTop&&h.o)h.w.before('<span id="jqmP'+h.w[0]._jqm+'"></span>').insertAfter(h.o);
 (c.onShow)?c.onShow(h):h.w.show();e(h);return false;
},
close:function(s){var h=H[s];h.a=false;
 if(A[0]){A.pop();if(!A[0])F('unbind');}
 if(h.c.toTop&&h.o)$('#jqmP'+h.w[0]._jqm).after(h.w).remove();
 if(h.c.onHide)h.c.onHide(h);else{h.w.hide();if(h.o)h.o.remove();} return false;
}};
var s=0,H=$.jqm.hash,A=[],ie6=$.browser.msie&&($.browser.version == "6.0"),
i=$('<iframe src="javascript:false;document.write(\'\');" class="jqm"></iframe>').css({opacity:0}),
e=function(h){if(ie6)if(h.o)h.o.html('<p style="width:100%;height:100%"/>').prepend(i);else if(!$('iframe.jqm',h.w)[0])h.w.prepend(i); f(h);},
f=function(h){try{$(':input:visible',h.w)[0].focus();}catch(e){}},
F=function(t){$()[t]("keypress",m)[t]("keydown",m)[t]("mousedown",m);},
m=function(e){var h=H[A[A.length-1]],r=(!$(e.target).parents('.jqmID'+h.s)[0]);if(r)f(h);return !r;},
hs=function(w,e,y){var s=[];w.each(function(){s.push(this._jqm)});
 $(e).each(function(){if(this[y])$.extend(this[y],s);else{this[y]=s;$(this).click(function(){for(var i in {jqmShow:1,jqmHide:1})for(var s in this[i])if(H[this[i][s]])H[this[i][s]].w[i](this);return false;});}});};
})(jQuery);


var linkspotlist = mapkey[0].keywords.split(', ');

function parstring (str) {
    str = str.replace(/&/g, '&#38;');
    str = str.replace(/'/g, '&#39;');
    str = str.replace(/"/g, '&#34;');
    str = str.replace(/\\/g, '&#92;');
    var ptitle = '';
   
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 31 && str.charCodeAt(i) < 127) { ptitle += str.charAt(i); }
    }

    return ptitle;
}


function ylistings(type) {
	var linkspots ="";
	var i=6;
	var rowcount = 0;
	var linkstring = "";
	
		while (i<zSr.length) {
			var desc = zSr[i++];var unused1 = zSr[i++];var clickURL = zSr[i++];var title = zSr[i++]; var sitehost = zSr[i++]; var unused = zSr[i++];
			var ptitle=parstring(title);
			var pdesc = parstring(desc);
			linkstring += '<div class="ylink" ';
			if (i==24) { linkstring += 'style="padding-right:0px;"';}
			linkstring += ('><a class="ylinktitle" href="'+clickURL + '" target="_new">'+ptitle+'<\/a><br><a href="'+clickURL + '" target="_new" class="ylinkdesc">'+pdesc+'<\/a><br><a href="'+clickURL+'" class="ysitelink" target="_new">'+sitehost+'<\/a><\/div>');
		}
		
		linkspots += '<br clear="all"><br><center><table cellpadding="0" cellspacing="0" border="0" width="600"><tr>';
		for(x=0;x<4;x++) {
			linkspots += '<td width="150" valign="top" align="center"><a href="/search/?q=' + linkspotlist[x].toLowerCase() + '&ls=1" class="ylinkspottitle">'+linkspotlist[x]+'<\/a><\/td>';
		}
		linkspots += '<\/table><\/center>';
		
	document.write(linkstring+linkspots);
}

if(zSr.length>0){ ylistings(); }



/* OMNITURE TRACKING CODE */
var id,item_id,view,title,task;

var channel = (app=="default") ? "misc":app;

var pageName 	= getPgName(app,view);//window.location.pathname

dispatcher.setAttribute("pageName", pageName);
dispatcher.setAttribute("channel", channel);

var contentType = (id) ? id:0;
var actionType=0;
var contentID=0;

// type switch based on app name
switch(channel) { 
	case "quizzes": contentType=1;break;
	case "tests": contentType=2;break;
	case "stories": contentType=3;break;
	case "polls": contentType=4;break;
	case "lyrics": contentType=5;break;
	case "poems": contentType=6;break;
	case "games": contentType=7;break;
	case "profiles": contentType=8;break;
	case "images": contentType=9;break;
	default: 0;break;
}

switch(view) {
	case "create": actionType=11;break;
	default: actionType=12;break;
}

if (item_id) id=item_id;
id = (id) ? id:0;
contentID = id;

sendQuizillaReporting(contentType, actionType, contentID);

function getPgName(a,v) { // dupe of hierarchy
	
	if (v=="create"){v=a;a="creator";}
	if (v=="type" && a=="quizzes")  { a="creator";v="quiz_"+v; }
	if (v=="share") v="published";
	
	switch(a) {
		case "register":a="utils";break;
		case "pages":a="info";break;
		case "user":
		case "my":a="mystuff";break;
		default:break;
	}
	
	pn=(a=="default")?"home/home":a;

	if ( (pn != "home") || (pn != "search") ) {
		pn += (v==="" && a!="default" && a!="info" && a!="utils") ? "/hub":"/"+v;
		if (a=="utils" && (!v) ) {pn +="register";}
	}

	if ( (a == "mystuff") && (v=="inbox" || v=="message" || v=="sent" ) ){
		insertmsg = pn.split("/");
		if(task=="compose") insertmsg[1] = task;
		pn = insertmsg[0] + "/messages/" + insertmsg[1];
	}
	
	if ( (a=="quizzes" || a=="polls" || a=="tests") && view=="result") {
		inserttype = pn.split("/");
		var loc_a=a=="quizzes"?"/quiz/":a=="polls"?"/poll/":"/test/";
		pn = inserttype[0] + loc_a + inserttype[1];
	}
	return pn;
}



ar; contentTitle 	= ["Page","Quizzes","Tests","Stories","Polls","Lyrics","Poems","Games","Profiles","Images"];
var actionTitle 	= ["","Created","Served","Saved","Reported","Shared","Favorited","Emailed"];

function sendQuizillaReporting(contentType, actionType, contentID, userID, result){
	if(typeof dispatcher!="undefined"){		
		clearDispatcherAttributes(20);		
		setOmniDispatcher();		
		dispatcher.sendCall();
	}
}

function setOmniDispatcher(){
        try{
               if(typeof dispatcher!="undefined"){   
                       if(contentType !==x){                         
                               if(typeof hierarchy != "undefined"){
                                      hierarchy = actionTitle[actionType%10] + "/" + contentTitle[contentType] + "/" + contentID;
                               }
 
                               dispatcher.setAttribute("channel", channel);
                               dispatcher.setAttribute("prop"+contentType, contentID);
                               dispatcher.setAttribute("prop"+actionType, contentID);
                               switch(contentType){
                                      case 1:
                                      case 2:
                                      case 4: if(actionType == 13) dispatcher.setAttribute("prop18", result);
                                              break;
                               }
                       }
 
                       hierarchy = pageName;//redefineHierarchy(app,view,title,item_id,id);
 
                       dispatcher.setAttribute("pageName ", pageName);
                       dispatcher.setAttribute("hier1", hierarchy);
                       dispatcher.setAttribute("prop20", userID);
 
                       if (app=="search" && s_term != "x") { dispatcher.setAttribute("prop21",s_term);}
               }
        }catch(e){}
}
function clearDispatcherAttributes(count){
	try{
		if(count){
			if(typeof dispatcher!="undefined"){
				for(var i=1; i<=count; i++){
					dispatcher.setAttribute("prop"+i, "");
				}
			}
		}
	}catch(e){}
}

function debug(dispatcher){
	if(typeof dispatcher != "undefined"){
		var str = 	"pageName: " + dispatcher.setAttribute("pageName") + "\n";
		str +=		"hier1: " + dispatcher.setAttribute("hier1") + "\n";
		str +=		"channel: " + dispatcher.setAttribute("channel") + "\n";
		for(var i=1; i<=20; i++){
			str +=	"prop" + i + ": " + dispatcher.getAttribute("prop"+i) + "\n";
		}
	}
}

//top logo link -- link event
function headerclicked(){
                try{
                                com.mtvi.reporting.Account.name = "viaquiz";
                                dispatcher.setAttribute("linkType","o");
                                dispatcher.setAttribute("linkName",pageName+"/"+quizName+"/headerClickThru");
                                dispatcher.setAttribute("lnk",true);
                                dispatcher.setAttribute("pageName","");
                                dispatcher.setAttribute("hier1","");
                                dispatcher.setAttribute("channel","");
                                clearDispatcherAttributes(20);   
                                dispatcher.sendCall();
                } catch(e){}
}

//report on flash quiz taken
function quiztaken(){
	try{
		resetParamsToDefault();
		dispatcher.setAttribute("prop10",quizName);
		dispatcher.sendCall();
	} catch(e){}
 	$.get("index.php?a=quizzes&view=quiztaken&flash_quiz_id="+item_id);
}

function sendAnalyticsEvent(str,lnkname){
	
	try {
		if(com.mtvi.util.isDefined(dispatcher)){
			if(com.mtvi.util.isDefined(com.mtvi.reporting.Account)){
				if(com.mtvi.util.isDefined(lnkname)){
					obj = {};					
					if(com.mtvi.util.isDefined(str)){ 
						obj.name=str;
						omniSetOverrides(obj, "append");
					}else{ 
						obj.name=com.mtvi.reporting.Account.name;
						omniSetOverrides(obj, null);
					}					
					 obj;
					dispatcher.sendLinkEvent({linkType:"o",lnk:true,linkName:lnkname});
				}else{
					if(com.mtvi.util.isDefined(str))
						omniSetOverrides({name:str}, "append");
					else
						omniSetOverrides({name:com.mtvi.reporting.Account.name}, null);
					dispatcher.sendCall();
				}
			}
		}
	} catch(e){}	
}
function omniSetOverrides(or,acctNameAction){
	try{
		resetParamsToDefault();
		var ro = {};
		for (i in or){
			var tmpi=i.replace(/s_/,"");
			tmpi=(tmpi=="account")? "name" : tmpi;
			ro[tmpi]=or[i];
			
			if(tmpi=="name"){
				if(acctNameAction){
					if(acctNameAction=="append"){
						var pattern = new RegExp("^"+ro[tmpi]+"$|^"+ro[tmpi]+",|,"+ro[tmpi]+"$|,"+ro[tmpi]+",");
						if(!pattern.test(com.mtvi.reporting.Account.name))
							com.mtvi.reporting.Account.name += ',' + ro[tmpi]; 
					}else if(acctNameAction=="overwrite")
						com.mtvi.reporting.Account.name = ro[tmpi]; 
				}
				ro[tmpi]= com.mtvi.reporting.Account.name;
			}
		}
		ro.dynamicAccountSelection = false;
		ro.linkInternalFilters = "auto";
		ro.trackExternalLinks = true;
		ro.trackDownloadLinks = true;
		if(com.mtvi.util.isDefined(dispatcher)) dispatcher.setAccountVars(ro);
	}catch(e){}
}
function resetParamsToDefault(){
	try {
		if(com.mtvi.util.isDefined(dispatcher)){
			com.mtvi.reporting.Account={
				name:'viaquiz',
				dynamicAccountSelection:true,	
				dynamicAccountList:'auto ',
				linkInternalFilters:'auto',
				trackExternalLinks: true,
				trackDownloadLinks: true
			};
		}
		
		
/*
 * Thickbox 3 - One Box To Rule Them All.
 * By Cody Lindley (http://www.codylindley.com)
 * Copyright (c) 2007 cody lindley
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
*/

var tb_pathToImage = qzPath + "/media/images/loadingAnimation.gif";

eval;(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('$(o).2S(9(){1u(\'a.18, 3n.18, 3i.18\');1w=1p 1t();1w.L=2H});9 1u(b){$(b).s(9(){6 t=X.Q||X.1v||M;6 a=X.u||X.23;6 g=X.1N||P;19(t,a,g);X.2E();H P})}9 19(d,f,g){3m{3(2t o.v.J.2i==="2g"){$("v","11").r({A:"28%",z:"28%"});$("11").r("22","2Z");3(o.1Y("1F")===M){$("v").q("<U 5=\'1F\'></U><4 5=\'B\'></4><4 5=\'8\'></4>");$("#B").s(G)}}n{3(o.1Y("B")===M){$("v").q("<4 5=\'B\'></4><4 5=\'8\'></4>");$("#B").s(G)}}3(1K()){$("#B").1J("2B")}n{$("#B").1J("2z")}3(d===M){d=""}$("v").q("<4 5=\'K\'><1I L=\'"+1w.L+"\' /></4>");$(\'#K\').2y();6 h;3(f.O("?")!==-1){h=f.3l(0,f.O("?"))}n{h=f}6 i=/\\.2s$|\\.2q$|\\.2m$|\\.2l$|\\.2k$/;6 j=h.1C().2h(i);3(j==\'.2s\'||j==\'.2q\'||j==\'.2m\'||j==\'.2l\'||j==\'.2k\'){1D="";1G="";14="";1z="";1x="";R="";1n="";1r=P;3(g){E=$("a[@1N="+g+"]").36();25(D=0;((D<E.1c)&&(R===""));D++){6 k=E[D].u.1C().2h(i);3(!(E[D].u==f)){3(1r){1z=E[D].Q;1x=E[D].u;R="<1e 5=\'1X\'>&1d;&1d;<a u=\'#\'>2T &2R;</a></1e>"}n{1D=E[D].Q;1G=E[D].u;14="<1e 5=\'1U\'>&1d;&1d;<a u=\'#\'>&2O; 2N</a></1e>"}}n{1r=1b;1n="1t "+(D+1)+" 2L "+(E.1c)}}}S=1p 1t();S.1g=9(){S.1g=M;6 a=2x();6 x=a[0]-1M;6 y=a[1]-1M;6 b=S.z;6 c=S.A;3(b>x){c=c*(x/b);b=x;3(c>y){b=b*(y/c);c=y}}n 3(c>y){b=b*(y/c);c=y;3(b>x){c=c*(x/b);b=x}}13=b+30;1a=c+2G;$("#8").q("<a u=\'\' 5=\'1L\' Q=\'1o\'><1I 5=\'2F\' L=\'"+f+"\' z=\'"+b+"\' A=\'"+c+"\' 23=\'"+d+"\'/></a>"+"<4 5=\'2D\'>"+d+"<4 5=\'2C\'>"+1n+14+R+"</4></4><4 5=\'2A\'><a u=\'#\' 5=\'Z\' Q=\'1o\'>1l</a> 1k 1j 1s</4>");$("#Z").s(G);3(!(14==="")){9 12(){3($(o).N("s",12)){$(o).N("s",12)}$("#8").C();$("v").q("<4 5=\'8\'></4>");19(1D,1G,g);H P}$("#1U").s(12)}3(!(R==="")){9 1i(){$("#8").C();$("v").q("<4 5=\'8\'></4>");19(1z,1x,g);H P}$("#1X").s(1i)}o.1h=9(e){3(e==M){I=2w.2v}n{I=e.2u}3(I==27){G()}n 3(I==3k){3(!(R=="")){o.1h="";1i()}}n 3(I==3j){3(!(14=="")){o.1h="";12()}}};16();$("#K").C();$("#1L").s(G);$("#8").r({Y:"T"})};S.L=f}n{6 l=f.2r(/^[^\\?]+\\??/,\'\');6 m=2p(l);13=(m[\'z\']*1)+30||3h;1a=(m[\'A\']*1)+3g||3f;W=13-30;V=1a-3e;3(f.O(\'2j\')!=-1){1E=f.1B(\'3d\');$("#15").C();3(m[\'1A\']!="1b"){$("#8").q("<4 5=\'2f\'><4 5=\'1H\'>"+d+"</4><4 5=\'2e\'><a u=\'#\' 5=\'Z\' Q=\'1o\'>1l</a> 1k 1j 1s</4></4><U 1W=\'0\' 2d=\'0\' L=\'"+1E[0]+"\' 5=\'15\' 1v=\'15"+1f.2c(1f.1y()*2b)+"\' 1g=\'1m()\' J=\'z:"+(W+29)+"p;A:"+(V+17)+"p;\' > </U>")}n{$("#B").N();$("#8").q("<U 1W=\'0\' 2d=\'0\' L=\'"+1E[0]+"\' 5=\'15\' 1v=\'15"+1f.2c(1f.1y()*2b)+"\' 1g=\'1m()\' J=\'z:"+(W+29)+"p;A:"+(V+17)+"p;\'> </U>")}}n{3($("#8").r("Y")!="T"){3(m[\'1A\']!="1b"){$("#8").q("<4 5=\'2f\'><4 5=\'1H\'>"+d+"</4><4 5=\'2e\'><a u=\'#\' 5=\'Z\'>1l</a> 1k 1j 1s</4></4><4 5=\'F\' J=\'z:"+W+"p;A:"+V+"p\'></4>")}n{$("#B").N();$("#8").q("<4 5=\'F\' 3c=\'3b\' J=\'z:"+W+"p;A:"+V+"p;\'></4>")}}n{$("#F")[0].J.z=W+"p";$("#F")[0].J.A=V+"p";$("#F")[0].3a=0;$("#1H").11(d)}}$("#Z").s(G);3(f.O(\'37\')!=-1){$("#F").q($(\'#\'+m[\'26\']).1T());$("#8").24(9(){$(\'#\'+m[\'26\']).q($("#F").1T())});16();$("#K").C();$("#8").r({Y:"T"})}n 3(f.O(\'2j\')!=-1){16();3($.1q.35){$("#K").C();$("#8").r({Y:"T"})}}n{$("#F").34(f+="&1y="+(1p 33().32()),9(){16();$("#K").C();1u("#F a.18");$("#8").r({Y:"T"})})}}3(!m[\'1A\']){o.21=9(e){3(e==M){I=2w.2v}n{I=e.2u}3(I==27){G()}}}}31(e){}}9 1m(){$("#K").C();$("#8").r({Y:"T"})}9 G(){$("#2Y").N("s");$("#Z").N("s");$("#8").2X("2W",9(){$(\'#8,#B,#1F\').2V("24").N().C()});$("#K").C();3(2t o.v.J.2i=="2g"){$("v","11").r({A:"1Z",z:"1Z"});$("11").r("22","")}o.1h="";o.21="";H P}9 16(){$("#8").r({2U:\'-\'+20((13/2),10)+\'p\',z:13+\'p\'});3(!(1V.1q.2Q&&1V.1q.2P<7)){$("#8").r({38:\'-\'+20((1a/2),10)+\'p\'})}}9 2p(a){6 b={};3(!a){H b}6 c=a.1B(/[;&]/);25(6 i=0;i<c.1c;i++){6 d=c[i].1B(\'=\');3(!d||d.1c!=2){39}6 e=2a(d[0]);6 f=2a(d[1]);f=f.2r(/\\+/g,\' \');b[e]=f}H b}9 2x(){6 a=o.2M;6 w=1S.2o||1R.2o||(a&&a.1Q)||o.v.1Q;6 h=1S.1P||1R.1P||(a&&a.2n)||o.v.2n;1O=[w,h];H 1O}9 1K(){6 a=2K.2J.1C();3(a.O(\'2I\')!=-1&&a.O(\'3o\')!=-1){H 1b}}',62,211,'|||if|div|id|var||TB_window|function||||||||||||||else|document|px|append|css|click||href|body||||width|height|TB_overlay|remove|TB_Counter|TB_TempArray|TB_ajaxContent|tb_remove|return|keycode|style|TB_load|src|null|unbind|indexOf|false|title|TB_NextHTML|imgPreloader|block|iframe|ajaxContentH|ajaxContentW|this|display|TB_closeWindowButton||html|goPrev|TB_WIDTH|TB_PrevHTML|TB_iframeContent|tb_position||thickbox|tb_show|TB_HEIGHT|true|length|nbsp|span|Math|onload|onkeydown|goNext|ESC|or|Close|tb_showIframe|TB_imageCount|Close|new|browser|TB_FoundURL|Key|Image|tb_init|name|imgLoader|TB_NextURL|random|TB_NextCaption|modal|split|toLowerCase|TB_PrevCaption|urlNoQuery|TB_HideSelect|TB_PrevURL|TB_ajaxWindowTitle|img|addClass|tb_detectMacXFF|TB_ImageOff|150|rel|arrayPageSize|innerHeight|clientWidth|self|window|children|TB_prev|jQuery|frameborder|TB_next|getElementById|auto|parseInt|onkeyup|overflow|alt|unload|for|inlineId||100||unescape|1000|round|hspace|TB_closeAjaxWindow|TB_title|undefined|match|maxHeight|TB_iframe|bmp|gif|png|clientHeight|innerWidth|tb_parseQuery|jpeg|replace|jpg|typeof|which|keyCode|event|tb_getPageSize|show|TB_overlayBG|TB_closeWindow|TB_overlayMacFFBGHack|TB_secondLine|TB_caption|blur|TB_Image|60|tb_pathToImage|mac|userAgent|navigator|of|documentElement|Prev|lt|version|msie|gt|ready|Next|marginLeft|trigger|fast|fadeOut|TB_imageOff|hidden||catch|getTime|Date|load|safari|get|TB_inline|marginTop|continue|scrollTop|TB_modal|class|TB_|45|440|40|630|input|188|190|substr|try|area|firefox'.split('|'),0,{}))


/**

* Tabs - jQuery plugin for accessible, unobtrusive tabs
 * @requires jQuery v1.0.3
 *
 * http://stilbuero.de/tabs/
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Version: 2.7.3
 */
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(4($){$.1Z({7:{26:0}});$.1s.7=4(w,x){3(G w==\'2y\')x=w;x=$.1Z({J:(w&&G w==\'1U\'&&w>0)?--w:0,X:A,E:$.1p?2b:W,13:W,1l:\'2C&#2x;\',1Y:\'13-2t-\',1O:A,1u:A,1t:A,1r:A,1H:\'2X\',2k:A,2i:A,2h:W,2f:A,1a:A,12:A,1k:\'7-1G\',H:\'7-22\',18:\'7-X\',1b:\'7-20\',1q:\'7-1C\',1A:\'7-2v\',1X:\'1i\'},x||{});$.9.1g=$.9.1g||$.9.T&&G 2r==\'4\';4 1v(){1V(0,0)}B 5.R(4(){2 j=5;2 l=$(\'10.\'+x.1k,j);l=l.V()&&l||$(\'>10:6(0)\',j);2 m=$(\'a\',l);3(x.13){m.R(4(){2 c=x.1Y+(++$.7.26),z=\'#\'+c,2g=5.1J;5.1J=z;$(\'<1i N="\'+c+\'" 2Q="\'+x.1b+\'"></1i>\').2c(j);$(5).19(\'1P\',4(e,a){2 b=$(5).I(x.1A),L=$(\'L\',5)[0],25=L.1D;3(x.1l){L.1D=\'<23>\'+x.1l+\'</23>\'}1o(4(){$(z).2I(2g,4(){3(x.1l){L.1D=25}b.16(x.1A);a&&a()})},0)})})}2 n=$(\'1i.\'+x.1b,j);n=n.V()&&n||$(\'>\'+x.1X,j);l.S(\'.\'+x.1k)||l.I(x.1k);n.R(4(){2 a=$(5);a.S(\'.\'+x.1b)||a.I(x.1b)});2 o=$(\'8\',l).2j($(\'8.\'+x.H,l)[0]);3(o>=0){x.J=o}3(14.z){m.R(4(i){3(5.z==14.z){x.J=i;3(($.9.T||$.9.2z)&&!x.13){2 a=$(14.z);2 b=a.15(\'N\');a.15(\'N\',\'\');1o(4(){a.15(\'N\',b)},2w)}1v();B W}})}3($.9.T){1v()}n.17(\':6(\'+x.J+\')\').1z().1j().2u(\':6(\'+x.J+\')\').I(x.1q);$(\'8\',l).16(x.H).6(x.J).I(x.H);m.6(x.J).U(\'1P\').1j();3(x.2h){2 p=4(c){2 d=$.2s(n.1y(),4(a){2 h,1x=$(a);3(c){3($.9.1g){a.Z.2q(\'1W\');a.Z.F=\'\';a.1f=A}h=1x.K({\'1d-F\':\'\'}).F()}C{h=1x.F()}B h}).2p(4(a,b){B b-a});3($.9.1g){n.R(4(){5.1f=d[0]+\'1T\';5.Z.2o(\'1W\',\'5.Z.F = 5.1f ? 5.1f : "2n"\')})}C{n.K({\'1d-F\':d[0]+\'1T\'})}};p();2 q=j.1S;2 r=j.1m;2 s=$(\'#7-1R-1Q-V\').1y(0)||$(\'<L N="7-1R-1Q-V">M</L>\').K({2l:\'2W\',2V:\'2U\',2T:\'2S\'}).2c(Q.1N).1y(0);2 t=s.1m;2R(4(){2 a=j.1S;2 b=j.1m;2 c=s.1m;3(b>r||a!=q||c!=t){p((a>q||c<t));q=a;r=b;t=c}},1M)}2 u={},Y={},1L=x.2k||x.1H,1K=x.2i||x.1H;3(x.1u||x.1O){3(x.1u){u[\'F\']=\'1z\';Y[\'F\']=\'1C\'}3(x.1O){u[\'P\']=\'1z\';Y[\'P\']=\'1C\'}}C{3(x.1t){u=x.1t}C{u[\'1d-2e\']=0;1L=x.E?1M:1}3(x.1r){Y=x.1r}C{Y[\'1d-2e\']=0;1K=x.E?1M:1}}2 v=x.2f,1a=x.1a,12=x.12;m.19(\'2d\',4(){2 a=$(5).11(\'8:6(0)\');3(j.1c||a.S(\'.\'+x.H)||a.S(\'.\'+x.18)){B W}2 b=5.z;3($.9.T){$(5).U(\'1e\');3(x.E){$.1p.2a(b);14.z=b.1I(\'#\',\'\')}}C{3(x.E){14.z=b.1I(\'#\',\'\')}C{$(5).U(\'1e\')}}});m.19(\'1w\',4(){2 a=$(5).11(\'8:6(0)\');3($.9.29){a.1h({P:0},1,4(){a.K({P:\'\'})})}a.I(x.18)});3(x.X&&x.X.1B){28(2 i=0,k=x.X.1B;i<k;i++){m.6(--x.X[i]).U(\'1w\').1j()}};m.19(\'27\',4(){2 a=$(5).11(\'8:6(0)\');a.16(x.18);3($.9.29){a.1h({P:1},1,4(){a.K({P:\'\'})})}});m.19(\'1e\',4(e){2 b=e.2P;2 c=5,8=$(5).11(\'8:6(0)\'),D=$(5.z),O=n.17(\':2O\');3(j[\'1c\']||8.S(\'.\'+x.H)||8.S(\'.\'+x.18)||G v==\'4\'&&v(5,D[0],O[0])===W){5.24();B W}j[\'1c\']=2b;3(D.V()){3($.9.T&&x.E){2 d=5.z.1I(\'#\',\'\');D.15(\'N\',\'\');1o(4(){D.15(\'N\',d)},0)}4 1F(){3(x.E&&b){$.1p.2a(c.z)}O.1h(Y,1K,4(){$(c).11(\'8:6(0)\').I(x.H).2N().16(x.H);3(G 1a==\'4\'){1a(c,D[0],O[0])}2 a={2l:\'\',2M:\'\',F:\'\'};3(!$.9.T){a[\'P\']=\'\'}O.I(x.1q).K(a);D.16(x.1q).1h(u,1L,4(){D.K(a);3($.9.T){O[0].Z.17=\'\';D[0].Z.17=\'\'}3(G 12==\'4\'){12(c,D[0],O[0])}j[\'1c\']=A})})}3(!x.13){1F()}C{$(c).U(\'1P\',[1F])}}C{2L(\'2K S 2J 2H 20.\')}2 f=1E.2G||Q.1n&&Q.1n.21||Q.1N.21||0;2 g=1E.2F||Q.1n&&Q.1n.2m||Q.1N.2m||0;1o(4(){1E.1V(f,g)},0);5.24();B x.E&&!!b});3(x.E){$.1p.2E(4(){m.6(x.J).U(\'1e\').1j()})}})};2 y=[\'2d\',\'1w\',\'27\'];28(2 i=0;i<y.1B;i++){$.1s[y[i]]=(4(d){B 4(c){B 5.R(4(){2 b=$(\'10.7-1G\',5);b=b.V()&&b||$(\'>10:6(0)\',5);2 a;3(!c||G c==\'1U\'){a=$(\'8 a\',b).6((c&&c>0&&c-1||0))}C 3(G c==\'2D\'){a=$(\'8 a[@1J$="#\'+c+\'"]\',b)}a.U(d)})}})(y[i])}$.1s.2B=4(){2 c=[];5.R(4(){2 a=$(\'10.7-1G\',5);a=a.V()&&a||$(\'>10:6(0)\',5);2 b=$(\'8\',a);c.2A(b.2j(b.17(\'.7-22\')[0])+1)});B c[0]}})(2Y);',62,185,'||var|if|function|this|eq|tabs|li|browser||||||||||||||||||||||||||hash|null|return|else|toShow|bookmarkable|height|typeof|selectedClass|addClass|initial|css|span||id|toHide|opacity|document|each|is|msie|trigger|size|false|disabled|hideAnim|style|ul|parents|onShow|remote|location|attr|removeClass|filter|disabledClass|bind|onHide|containerClass|locked|min|click|minHeight|msie6|animate|div|end|navClass|spinner|offsetHeight|documentElement|setTimeout|ajaxHistory|hideClass|fxHide|fn|fxShow|fxSlide|unFocus|disableTab|jq|get|show|loadingClass|length|hide|innerHTML|window|switchTab|nav|fxSpeed|replace|href|hideSpeed|showSpeed|50|body|fxFade|loadRemoteTab|font|watch|offsetWidth|px|number|scrollTo|behaviour|tabStruct|hashPrefix|extend|container|scrollLeft|selected|em|blur|tabTitle|remoteCount|enableTab|for|safari|update|true|appendTo|triggerTab|width|onClick|url|fxAutoHeight|fxHideSpeed|index|fxShowSpeed|display|scrollTop|1px|setExpression|sort|removeExpression|XMLHttpRequest|map|tab|not|loading|500|8230|object|opera|push|activeTab|Loading|string|initialize|pageYOffset|pageXOffset|such|load|no|There|alert|overflow|siblings|visible|clientX|class|setInterval|hidden|visibility|absolute|position|block|normal|jQuery'.split('|'),0,{}))

/**
 * Star Rating - jQuery plugin
 *
 * Copyright (c) 2007 Wil Stuckey
 * Modified by John Resig
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Create a degradeable star rating interface out of a simple form structure.
 * Returns a modified jQuery object containing the new interface.
 *
 * @example jQuery('form.rating').rating();
 * @cat plugin
 * @type jQuery
 *
 */
jQuery.fn.rating = function(){
    return this.each(function(){
        var div = jQuery("<div/>").attr({
            title: this.title,
            className: this.className
        }).insertAfter( this );

        jQuery(this).find("select option").each(function(){
            div.append( this.value == "0" ?
               "" : // "<div class='cancel'><a href='#0' title='Cancel Rating'>Cancel Rating</a></div>" :
                "<div class='star' id='star"+this.value+"'><a href='#" + this.value + "' title='Give it a " +
                    this.value + " Star Rating'>" + this.value + "</a></div>" );
        });

        var averageRating = this.title.split(/:\s*/)[1].split("."),
            url = this.action,
            averageIndex = averageRating[1],
            averagePercent = averageRating[1];
		
        // hover events and focus events added
        var stars = div.find("div.star")
            .mouseover(drainFill).focus(drainFill)
            .mouseout(drainReset).blur(drainReset)
            .click(click);

        // cancel button events
        div.find("div.cancel")
            .mouseover(drainAdd).focus(drainAdd)
            .mouseout(resetRemove).blur(resetRemove)
            .click(click);

       	reset();
		hasrated = 0;
        function drainFill(){ drain(); fill(this); }
        function drainReset(){ drain(); reset(); }
        function resetRemove(){ reset(); jQuery(this).removeClass('on'); }
        function drainAdd(){ drain(); jQuery(this).addClass('on'); }
		
        function click(){
			averageIndex = stars.index(this) + 1;
			averagePercent = 10;

			if ( averageIndex ===0 )
				drain();
			jQuery.post(url,{
				'rating': jQuery(this).find('a')[0].href.slice(-1)
			});
			hasrated=1;
			lockRating();
			return false;
        }
		
		function lockRating() {
			$(".rater").remove();
			div.find("div.star,a").unbind("mouseover").unbind("mouseout").unbind("click").css({ "cursor" : "default" });
			div.find(".hover").addClass("on").removeClass("hover");
			div.find("div.on").css({ "background-position" : "0 -31px" });
			div.find("a").css({ "visibility" : "hidden" });
			div.css({ "cursor" : "default" }).append("Thanks for rating!");
		}
		
        // fill to the current mouse position.
        function fill( elem ){
        	if(!hasrated) {
				stars.find("a").css("width", "100%");
				//was stars.lt(stars.index(elem) + 1)
				stars.slice(0, stars.index(elem) + 1 ).addClass("hover");
				plural = (stars.index(elem) ===0) ? "":"s";
				div.append("<div class='rater'> Give it "+(stars.index(elem) + 1)+" star"+plural+"!</div>"); /* adds messaging */
			}
        }
        
        // drain all the stars.
        function drain(){
            stars.removeClass("on hover");
            $(".rater").remove(); /* clears out messaging */
            
        }

        // Reset the stars to the default index.
        function reset() {
            stars.slice(0,averageIndex).addClass("on");
            percent = averagePercent ? averagePercent:10;
            percent = (percent == 50)?43:percent; // display hack to reset 50% values to look like 50% stars
			$("#star"+(eval(averageIndex)+1)).addClass("on").children("a").css("width", percent + "%");
		}
			
        
    }).remove();
};

// fix ie6 background flicker problem.
if ( jQuery.browser.msietrue )
    document.execCommand('BackgroundImageCache', false, true);
    
    
    (function($) {
$.fn.jqm=function(o){
var _o = {
zIndex: 3000,
overlay: 50,
overlayClass: 'jqmOverlay',
closeClass: 'jqmClose',
trigger: '.jqModal',
ajax: false,
target: false,
modal: false,
toTop: true, /*changed this to true to fix all in ie*/
onShow: false,
onHide: false,
onLoad: false
};
return this.each(function(){if(this._jqm)return; s++; this._jqm=s;
H[s]={c:$.extend(_o, o),a:false,w:$(this).addClass('jqmID'+s),s:s};
if(_o.trigger)$(this).jqmAddTrigger(_o.trigger);
});};

$.fn.jqmAddClose=function(e){hs(this,e,'jqmHide'); return this;};
$.fn.jqmAddTrigger=function(e){hs(this,e,'jqmShow'); return this;};
$.fn.jqmShow=function(t){return this.each(function(){if(!H[this._jqm].a)$.jqm.open(this._jqm,t)});};
$.fn.jqmHide=function(t){return this.each(function(){if( (H[this._jqm]) && (H[this._jqm].a) )$.jqm.close(this._jqm,t)});}; //added check to see if this._jqm exists

$.jqm = {
hash:{},
open:function(s,t){var h=H[s],c=h.c,cc='.'+c.closeClass,z=(/^\d+$/.test(h.w.css('z-index')))?h.w.css('z-index'):c.zIndex,o=$('<div></div>').css({height:'100%',width:'100%',position:'fixed',left:0,top:0,'z-index':z-1,opacity:c.overlay/100});h.t=t;h.a=true;h.w.css('z-index',z);
 if(c.modal) {if(!A[0])F('bind');A.push(s);o.css('cursor','wait');}
 else if(c.overlay > 0)h.w.jqmAddClose(o);
 else o=false;

 h.o=(o)?o.addClass(c.overlayClass).prependTo('body'):false;
 if(ie6){$('html,body').css({height:'100%',width:'100%'});if(o){o=o.css({position:'absolute'})[0];for(var y in {Top:1,Left:1})o.style.setExpression(y.toLowerCase(),"(_=(document.documentElement.scroll"+y+" || document.body.scroll"+y+"))+'px'");}}

 if(c.ajax) {var r=c.target||h.w,u=c.ajax,r=(typeof r == 'string')?$(r,h.w):$(r),u=(u.substr(0,1) == '@')?$(t).attr(u.substring(1)):u;
  r.load(u,function(){if(c.onLoad)c.onLoad.call(this,h);if(cc)h.w.jqmAddClose($(cc,h.w));e(h);});}
 else if(cc)h.w.jqmAddClose($(cc,h.w));

 if(c.toTop&&h.o)h.w.before('<span id="jqmP'+h.w[0]._jqm+'"></span>').insertAfter(h.o);
 (c.onShow)?c.onShow(h):h.w.show();e(h);return false;
},
close:function(s){var h=H[s];h.a=false;
 if(A[0]){A.pop();if(!A[0])F('unbind');}
 if(h.c.toTop&&h.o)$('#jqmP'+h.w[0]._jqm).after(h.w).remove();
 if(h.c.onHide)h.c.onHide(h);else{h.w.hide();if(h.o)h.o.remove();} return false;
}};
var s=0,H=$.jqm.hash,A=[],ie6=$.browser.msie&&($.browser.version == "6.0"),
i=$('<iframe src="javascript:false;document.write(\'\');" class="jqm"></iframe>').css({opacity:0}),
e=function(h){if(ie6)if(h.o)h.o.html('<p style="width:100%;height:100%"/>').prepend(i);else if(!$('iframe.jqm',h.w)[0])h.w.prepend(i); f(h);},
f=function(h){try{$(':input:visible',h.w)[0].focus();}catch(e){}},
F=function(t){$()[t]("keypress",m)[t]("keydown",m)[t]("mousedown",m);},
m=function(e){var h=H[A[A.length-1]],r=(!$(e.target).parents('.jqmID'+h.s)[0]);if(r)f(h);return !r;},
hs=function(w,e,y){var s=[];w.each(function(){s.push(this._jqm)});
 $(e).each(function(){if(this[y])$.extend(this[y],s);else{this[y]=s;$(this).click(function(){for(var i in {jqmShow:1,jqmHide:1})for(var s in this[i])if(H[this[i][s]])H[this[i][s]].w[i](this);return false;});}});};
})(jQuery);



/**
 * ajaxSubmit() provides a mechanism for submitting an HTML form using AJAX.
 *
 * ajaxSubmit accepts a single argument which can be either a success callback function
 * or an options Object.  If a function is provided it will be invoked upon successful
 * completion of the submit and will be passed the response from the server.
 * If an options Object is provided, the following attributes are supported:
 *
 *  target:   Identifies the element(s) in the page to be updated with the server response.
 *            This value may be specified as a jQuery selection string, a jQuery object,
 *            or a DOM element.
 *            default value: null
 *
 *  url:      URL to which the form data will be submitted.
 *            default value: value of form's 'action' attribute
 *
 *  type:     The method in which the form data should be submitted, 'GET' or 'POST'.
 *            default value: value of form's 'method' attribute (or 'GET' if none found)
 *
 *  beforeSubmit:  Callback method to be invoked before the form is submitted.
 *            default value: null
 *
 *  success:  Callback method to be invoked after the form has been successfully submitted
 *            and the response has been returned from the server
 *            default value: null
 *
 *  dataType: Expected dataType of the response.  One of: null, 'xml', 'script', or 'json'
 *            default value: null
 *
 *  semantic: Boolean flag indicating whether data must be submitted in semantic order (slower).
 *            default value: false
 *
 *  resetForm: Boolean flag indicating whether the form should be reset if the submit is successful
 *
 *  clearForm: Boolean flag indicating whether the form should be cleared if the submit is successful
 *
 *
 * The 'beforeSubmit' callback can be provided as a hook for running pre-submit logic or for
 * validating the form data.  If the 'beforeSubmit' callback returns false then the form will
 * not be submitted. The 'beforeSubmit' callback is invoked with three arguments: the form data
 * in array format, the jQuery object, and the options object passed into ajaxSubmit.
 * The form data array takes the following form:
 *
 *     [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
 *
 * If a 'success' callback method is provided it is invoked after the response has been returned
 * from the server.  It is passed the responseText or responseXML value (depending on dataType).
 * See jQuery.ajax for further details.
 *
 *
 * The dataType option provides a means for specifying how the server response should be handled.
 * This maps directly to the jQuery.httpData method.  The following values are supported:
 *
 *      'xml':    if dataType == 'xml' the server response is treated as XML and the 'after'
 *                   callback method, if specified, will be passed the responseXML value
 *      'json':   if dataType == 'json' the server response will be evaluted and passed to
 *                   the 'after' callback, if specified
 *      'script': if dataType == 'script' the server response is evaluated in the global context
 *
 *
 * Note that it does not make sense to use both the 'target' and 'dataType' options.  If both
 * are provided the target will be ignored.
 *
 * The semantic argument can be used to force form serialization in semantic order.
 * This is normally true anyway, unless the form contains input elements of type='image'.
 * If your form must be submitted with name/value pairs in semantic order and your form
 * contains an input of type='image" then pass true for this arg, otherwise pass false
 * (or nothing) to avoid the overhead for this logic.
 *
 *
 * When used on its own, ajaxSubmit() is typically bound to a form's submit event like this:
 *
 * $("#form-id").submit(function() {
 *     $(this).ajaxSubmit(options);
 *     return false; // cancel conventional submit
 * });
 *
 * When using ajaxForm(), however, this is done for you.
 *
 * @example
 * $('#myForm').ajaxSubmit(function(data) {
 *     alert('Form submit succeeded! Server returned: ' + data);
 * });
 * @desc Submit form and alert server response
 *
 *
 * @example
 * var options = {
 *     target: '#myTargetDiv'
 * };
 * $('#myForm').ajaxSubmit(options);
 * @desc Submit form and update page element with server response
 *
 *
 * @example
 * var options = {
 *     success: function(responseText) {
 *         alert(responseText);
 *     }
 * };
 * $('#myForm').ajaxSubmit(options);
 * @desc Submit form and alert the server response
 *
 *
 * @example
 * var options = {
 *     beforeSubmit: function(formArray, jqForm) {
 *         if (formArray.length == 0) {
 *             alert('Please enter data.');
 *             return false;
 *         }
 *     }
 * };
 * $('#myForm').ajaxSubmit(options);
 * @desc Pre-submit validation which aborts the submit operation if form data is empty
 *
 *
 * @example
 * var options = {
 *     url: myJsonUrl.php,
 *     dataType: 'json',
 *     success: function(data) {
 *        // 'data' is an object representing the the evaluated json data
 *     }
 * };
 * $('#myForm').ajaxSubmit(options);
 * @desc json data returned and evaluated
 *
 *
 * @example
 * var options = {
 *     url: myXmlUrl.php,
 *     dataType: 'xml',
 *     success: function(responseXML) {
 *        // responseXML is XML document object
 *        var data = $('myElement', responseXML).text();
 *     }
 * };
 * $('#myForm').ajaxSubmit(options);
 * @desc XML data returned from server
 *
 *
 * @example
 * var options = {
 *     resetForm: true
 * };
 * $('#myForm').ajaxSubmit(options);
 * @desc submit form and reset it if successful
 *
 * @example
 * $('#myForm).submit(function() {
 *    $(this).ajaxSubmit();
 *    return false;
 * });
 * @desc Bind form's submit event to use ajaxSubmit
 *
 *
 * @name ajaxSubmit
 * @type jQuery
 * @param options  object literal containing options which control the form submission process
 * @cat Plugins/Form
 * @return jQuery
 * @see formToArray
 * @see ajaxForm
 * @see $.ajax
 * @author jQuery Community
 */
jQuery.fn.ajaxSubmit = function(options) {
    if (typeof options == 'function')
        options = { success: options };

    options = jQuery.extend({
        url:  this.attr('action') || window.location,
        type: this.attr('method') || 'GET'
    }, options || {});

    var a = this.formToArray(options.semantic);

    // give pre-submit callback an opportunity to abort the submit
    if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) return this;

    // fire vetoable 'validate' event
    var veto = {};
    jQuery.event.trigger('form.submit.validate', [a, this, options, veto]);
    if (veto.veto)
        return this;

    var q = jQuery.param(a);//.replace(/%20/g,'+');

    if (options.type.toUpperCase() == 'GET') {
        options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
        options.data = null;  // data is null for 'get'
    }
    else
        options.data = q; // data is the query string for 'post'

    var $form = this, callbacks = [];
    if (options.resetForm) callbacks.push(function() { $form.resetForm(); });
    if (options.clearForm) callbacks.push(function() { $form.clearForm(); });

    // perform a load on the target only if dataType is not provided
    if (!options.dataType && options.target) {
        var oldSuccess = options.success || function(){};
        callbacks.push(function(data, status) {
            jQuery(options.target).attr("innerHTML", data).evalScripts().each(oldSuccess, [data, status]);
        });
    }
    else if (options.success)
        callbacks.push(options.success);

    options.success = function(data, status) {
        for (var i=0, max=callbacks.length; i < max; i++)
            callbacks[i](data, status);
    };

    // are there files to upload?
    var files = jQuery('input:file', this).fieldValue();
    var found = false;
    for (var j=0; j < files.length; j++)
        if (files[j])
            found = true;

    if (options.iframe || found) // options.iframe allows user to force iframe mode
        fileUpload();
    else
        jQuery.ajax(options);

    // fire 'notify' event
    jQuery.event.trigger('form.submit.notify', [this, options]);
    return this;


    // private function for handling file uploads (hat tip to YAHOO!)
    function fileUpload() {
        var form = $form[0];
        var opts = jQuery.extend({}, jQuery.ajaxSettings, options);

        var id = 'jqFormIO' + jQuery.fn.ajaxSubmit.counter++;
        var $io = jQuery('<iframe id="' + id + '" name="' + id + '" />');
        var io = $io[0];
        var op8 = jQuery.browser.opera && window.opera.version() < 9;
        if (jQuery.browser.msie || op8) io.src = 'javascript:false;document.write("");';
        $io.css({ position: 'absolute', top: '-1000px', left: '-1000px' });

        // make sure form attrs are set
        form.method = 'POST';
        form.encoding ? form.encoding = 'multipart/form-data' : form.enctype = 'multipart/form-data';

        var xhr = { // mock object
            responseText: null,
            responseXML: null,
            status: 0,
            statusText: 'n/a',
            getAllResponseHeaders: function() {},
            getResponseHeader: function() {},
            setRequestHeader: function() {}
        };

        var g = opts.global;
        // trigger ajax global events so that activity/block indicators work like normal
        if (g && jQuery.active++) jQuery.event.trigger("ajaxStart");
        if (g) jQuery.event.trigger("ajaxSend", [xhr, opts]);

        var cbInvoked = 0;
        var timedOut = 0;

        // take a breath so that pending repaints get some cpu time before the upload starts
        setTimeout(function() {
            $io.appendTo('body');
            // jQuery's event binding doesn't work for iframe events in IE
            io.attachEvent ? io.attachEvent('onload', cb) : io.addEventListener('load', cb, false);
            form.action = opts.url;
            var t = form.target;
            form.target = id;

            // support timout
            if (opts.timeout)
                setTimeout(function() { timedOut = true; cb(); }, opts.timeout);

            form.submit();
            form.target = t; // reset
        }, 10);

        function cb() {
            if (cbInvoked++) return;

            io.detachEvent ? io.detachEvent('onload', cb) : io.removeEventListener('load', cb, false);

            var ok = true;
            try {
                if (timedOut) throw 'timeout';
                // extract the server response from the iframe
                var data, doc;
                doc = io.contentWindow ? io.contentWindow.document : io.contentDocument ? io.contentDocument : io.document;
                xhr.responseText = doc.body ? doc.body.innerHTML : null;
                xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;

                if (opts.dataType == 'json' || opts.dataType == 'script') {
                    var ta = doc.getElementsByTagName('textarea')[0];
                    data = ta ? ta.value : xhr.responseText;
                    if (opts.dataType == 'json')
                        eval("data = " + data);
                    else
                        jQuery.globalEval(data);
                }
                else if (opts.dataType == 'xml') {
                    data = xhr.responseXML;
                    if (!data && xhr.responseText !==null)
                        data = toXml(xhr.responseText);
                }
                else {
                    data = xhr.responseText;
                }
            }
            catch(e){
                ok = false;
                jQuery.handleError(opts, xhr, 'error', e);
            }

            // ordering of these callbacks/triggers is odd, but that's how $.ajax does it
            if (ok) {
                opts.success(data, 'success');
                if (g) jQuery.event.trigger("ajaxSuccess", [xhr, opts]);
            }
            if (g) jQuery.event.trigger("ajaxComplete", [xhr, opts]);
            if (g && ! --jQuery.active) jQuery.event.trigger("ajaxStop");
            if (opts.complete) opts.complete(xhr, ok ? 'success' : 'error');

            // clean up
            setTimeout(function() {
                $io.remove();
                xhr.responseXML = null;
            }, 100);
        };

        function toXml(s, doc) {
            if (window.ActiveXObject) {
                doc = new ActiveXObject('Microsoft.XMLDOM');
                doc.async = 'false';
                doc.loadXML(s);
            }
            else
                doc = (new DOMParser()).parseFromString(s, 'text/xml');
            return (doc && doc.documentElement && doc.documentElement.tagName != 'parsererror') ? doc : null;
        }
    };
};
jQuery.fn.ajaxSubmit.counter = 0; // used to create unique iframe ids

/**
 * ajaxForm() provides a mechanism for fully automating form submission.
 *
 * The advantages of using this method instead of ajaxSubmit() are:
 *
 * 1: This method will include coordinates for <input type="image" /> elements (if the element
 *    is used to submit the form).
 * 2. This method will include the submit element's name/value data (for the element that was
 *    used to submit the form).
 * 3. This method binds the submit() method to the form for you.
 *
 * Note that for accurate x/y coordinates of image submit elements in all browsers
 * you need to also use the "dimensions" plugin (this method will auto-detect its presence).
 *
 * The options argument for ajaxForm works exactly as it does for ajaxSubmit.  ajaxForm merely
 * passes the options argument along after properly binding events for submit elements and
 * the form itself.  See ajaxSubmit for a full description of the options argument.
 *
 *
 * @example
 * var options = {
 *     target: '#myTargetDiv'
 * };
 * $('#myForm').ajaxSForm(options);
 * @desc Bind form's submit event so that 'myTargetDiv' is updated with the server response
 *       when the form is submitted.
 *
 *
 * @example
 * var options = {
 *     success: function(responseText) {
 *         alert(responseText);
 *     }
 * };
 * $('#myForm').ajaxSubmit(options);
 * @desc Bind form's submit event so that server response is alerted after the form is submitted.
 *
 *
 * @example
 * var options = {
 *     beforeSubmit: function(formArray, jqForm) {
 *         if (formArray.length == 0) {
 *             alert('Please enter data.');
 *             return false;
 *         }
 *     }
 * };
 * $('#myForm').ajaxSubmit(options);
 * @desc Bind form's submit event so that pre-submit callback is invoked before the form
 *       is submitted.
 *
 *
 * @name   ajaxForm
 * @param  options  object literal containing options which control the form submission process
 * @return jQuery
 * @cat    Plugins/Form
 * @type   jQuery
 * @see    ajaxSubmit
 * @author jQuery Community
 */
jQuery.fn.ajaxForm = function(options) {
    return this.each(function() {
        jQuery("input:submit,input:image,button:submit", this).click(function(ev) {
            var $form = this.form;
            $form.clk = this;
            if (this.type == 'image') {
                if (ev.offsetX != undefined) {
                    $form.clk_x = ev.offsetX;
                    $form.clk_y = ev.offsetY;
                } else if (typeof jQuery.fn.offset == 'function') { // try to use dimensions plugin
                    var offset = jQuery(this).offset();
                    $form.clk_x = ev.pageX - offset.left;
                    $form.clk_y = ev.pageY - offset.top;
                } else {
                    $form.clk_x = ev.pageX - this.offsetLeft;
                    $form.clk_y = ev.pageY - this.offsetTop;
                }
            }
            // clear form vars
            setTimeout(function() {
                $form.clk = $form.clk_x = $form.clk_y = null;
                }, 10);
        })
    }).submit(function(e) {
        jQuery(this).ajaxSubmit(options);
        return false;
    });
};


/**
 * formToArray() gathers form element data into an array of objects that can
 * be passed to any of the following ajax functions: $.get, $.post, or load.
 * Each object in the array has both a 'name' and 'value' property.  An example of
 * an array for a simple login form might be:
 *
 * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
 *
 * It is this array that is passed to pre-submit callback functions provided to the
 * ajaxSubmit() and ajaxForm() methods.
 *
 * The semantic argument can be used to force form serialization in semantic order.
 * This is normally true anyway, unless the form contains input elements of type='image'.
 * If your form must be submitted with name/value pairs in semantic order and your form
 * contains an input of type='image" then pass true for this arg, otherwise pass false
 * (or nothing) to avoid the overhead for this logic.
 *
 * @example var data = $("#myForm").formToArray();
 * $.post( "myscript.cgi", data );
 * @desc Collect all the data from a form and submit it to the server.
 *
 * @name formToArray
 * @param semantic true if serialization must maintain strict semantic ordering of elements (slower)
 * @type Array<Object>
 * @cat Plugins/Form
 * @see ajaxForm
 * @see ajaxSubmit
 * @author jQuery Community
 */
jQuery.fn.formToArray = function(semantic) {
    var a = [];
    if (this.length == 0) return a;

    var form = this[0];
    var els = semantic ? form.getElementsByTagName('*') : form.elements;
    if (!els) return a;
    for(var i=0, max=els.length; i < max; i++) {
        var el = els[i];
        var n = el.name;
        if (!n) continue;

        if (semantic && form.clk && el.type == "image") {
            // handle image inputs on the fly when semantic == true
            if(!el.disabled && form.clk == el)
                a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
            continue;
        }
        var v = jQuery.fieldValue(el, true);
        if (v === null) continue;
        if (v.constructor == Array) {
            for(var j=0, jmax=v.length; j < jmax; j++)
                a.push({name: n, value: v[j]});
        }
        else
            a.push({name: n, value: v});
    }

    if (!semantic && form.clk) {
        // input type=='image' are not found in elements array! handle them here
        var inputs = form.getElementsByTagName("input");
        for(var i=0, max=inputs.length; i < max; i++) {
            var input = inputs[i];
            var n = input.name;
            if(n && !input.disabled && input.type == "image" && form.clk == input)
                a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
        }
    }
    return a;
};


/**
 * Serializes form data into a 'submittable' string. This method will return a string
 * in the format: name1=value1&amp;name2=value2
 *
 * The semantic argument can be used to force form serialization in semantic order.
 * If your form must be submitted with name/value pairs in semantic order then pass
 * true for this arg, otherwise pass false (or nothing) to avoid the overhead for
 * this logic (which can be significant for very large forms).
 *
 * @example var data = $("#myForm").formSerialize();
 * $.ajax('POST', "myscript.cgi", data);
 * @desc Collect all the data from a form into a single string
 *
 * @name formSerialize
 * @param semantic true if serialization must maintain strict semantic ordering of elements (slower)
 * @type String
 * @cat Plugins/Form
 * @see formToArray
 * @author jQuery Community
 */
jQuery.fn.formSerialize = function(semantic) {
    //hand off to jQuery.param for proper encoding
    return jQuery.param(this.formToArray(semantic));
};


/**
 * Serializes all field elements in the jQuery object into a query string.
 * This method will return a string in the format: name1=value1&amp;name2=value2
 *
 * The successful argument controls whether or not serialization is limited to
 * 'successful' controls (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
 * The default value of the successful argument is true.
 *
 * @example var data = $("input").formSerialize();
 * @desc Collect the data from all successful input elements into a query string
 *
 * @example var data = $(":radio").formSerialize();
 * @desc Collect the data from all successful radio input elements into a query string
 *
 * @example var data = $("#myForm :checkbox").formSerialize();
 * @desc Collect the data from all successful checkbox input elements in myForm into a query string
 *
 * @example var data = $("#myForm :checkbox").formSerialize(false);
 * @desc Collect the data from all checkbox elements in myForm (even the unchecked ones) into a query string
 *
 * @example var data = $(":input").formSerialize();
 * @desc Collect the data from all successful input, select, textarea and button elements into a query string
 *
 * @name fieldSerialize
 * @param successful true if only successful controls should be serialized (default is true)
 * @type String
 * @cat Plugins/Form
 */
jQuery.fn.fieldSerialize = function(successful) {
    var a = [];
    this.each(function() {
        var n = this.name;
        if (!n) return;
        var v = jQuery.fieldValue(this, successful);
        if (v && v.constructor == Array) {
            for (var i=0,max=v.length; i < max; i++)
                a.push({name: n, value: v[i]});
        }
        else if (v !==null && typeof v != 'undefined')
            a.push({name: this.name, value: v});
    });
    //hand off to jQuery.param for proper encoding
    return jQuery.param(a);
};


/**
 * Returns the value(s) of the element in the matched set.  For example, consider the following form:
 *
 *  <form><fieldset>
 *      <input name="A" type="text" />
 *      <input name="A" type="text" />
 *      <input name="B" type="checkbox" value="B1" />
 *      <input name="B" type="checkbox" value="B2"/>
 *      <input name="C" type="radio" value="C1" />
 *      <input name="C" type="radio" value="C2" />
 *  </fieldset></form>
 *
 *  var v = $(':text').fieldValue();
 *  // if no values are entered into the text inputs
 *  v == ['','']
 *  // if values entered into the text inputs are 'foo' and 'bar'
 *  v == ['foo','bar']
 *
 *  var v = $(':checkbox').fieldValue();
 *  // if neither checkbox is checked
 *  v === undefined
 *  // if both checkboxes are checked
 *  v == ['B1', 'B2']
 *
 *  var v = $(':radio').fieldValue();
 *  // if neither radio is checked
 *  v === undefined
 *  // if first radio is checked
 *  v == ['C1']
 *
 * The successful argument controls whether or not the field element must be 'successful'
 * (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
 * The default value of the successful argument is true.  If this value is false the value(s)
 * for each element is returned.
 *
 * Note: This method *always* returns an array.  If no valid value can be determined the
 *       array will be empty, otherwise it will contain one or more values.
 *
 * @example var data = $("#myPasswordElement").fieldValue();
 * alert(data[0]);
 * @desc Alerts the current value of the myPasswordElement element
 *
 * @example var data = $("#myForm :input").fieldValue();
 * @desc Get the value(s) of the form elements in myForm
 *
 * @example var data = $("#myForm :checkbox").fieldValue();
 * @desc Get the value(s) for the successful checkbox element(s) in the jQuery object.
 *
 * @example var data = $("#mySingleSelect").fieldValue();
 * @desc Get the value(s) of the select control
 *
 * @example var data = $(':text').fieldValue();
 * @desc Get the value(s) of the text input or textarea elements
 *
 * @example var data = $("#myMultiSelect").fieldValue();
 * @desc Get the values for the select-multiple control
 *
 * @name fieldValue
 * @param Boolean successful true if only the values for successful controls should be returned (default is true)
 * @type Array<String>
 * @cat Plugins/Form
 */
jQuery.fn.fieldValue = function(successful) {
    for (var val=[], i=0, max=this.length; i < max; i++) {
        var el = this[i];
        var v = jQuery.fieldValue(el, successful);
        if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length))
            continue;
        v.constructor == Array ? jQuery.merge(val, v) : val.push(v);
    }
    return val;
};

/**
 * Returns the value of the field element.
 *
 * The successful argument controls whether or not the field element must be 'successful'
 * (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
 * The default value of the successful argument is true.  If the given element is not
 * successful and the successful arg is not false then the returned value will be null.
 *
 * Note: If the successful flag is true (default) but the element is not successful, the return will be null
 * Note: The value returned for a successful select-multiple element will always be an array.
 * Note: If the element has no value the return value will be undefined.
 *
 * @example var data = jQuery.fieldValue($("#myPasswordElement")[0]);
 * @desc Gets the current value of the myPasswordElement element
 *
 * @name fieldValue
 * @param Element el The DOM element for which the value will be returned
 * @param Boolean successful true if value returned must be for a successful controls (default is true)
 * @type String or Array<String> or null or undefined
 * @cat Plugins/Form
 */
jQuery.fieldValue = function(el, successful) {
    var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
    if (typeof successful == 'undefined') successful = true;

    if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||
        (t == 'checkbox' || t == 'radio') && !el.checked ||
        (t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
        tag == 'select' && el.selectedIndex == -1))
            return null;

    if (tag == 'select') {
        var index = el.selectedIndex;
        if (index < 0) return null;
        var a = [], ops = el.options;
        var one = (t == 'select-one');
        var max = (one ? index+1 : ops.length);
        for(var i=(one ? index : 0); i < max; i++) {
            var op = ops[i];
            if (op.selected) {
                // extra pain for IE...
                var v = jQuery.browser.msie && !(op.attributes['value'].specified) ? op.text : op.value;
                if (one) return v;
                a.push(v);
            }
        }
        return a;
    }
    return el.value;
};


/**
 * Clears the form data.  Takes the following actions on the form's input fields:
 *  - input text fields will have their 'value' property set to the empty string
 *  - select elements will have their 'selectedIndex' property set to -1
 *  - checkbox and radio inputs will have their 'checked' property set to false
 *  - inputs of type submit, button, reset, and hidden will *not* be effected
 *  - button elements will *not* be effected
 *
 * @example $('form').clearForm();
 * @desc Clears all forms on the page.
 *
 * @name clearForm
 * @type jQuery
 * @cat Plugins/Form
 * @see resetForm
 */
jQuery.fn.clearForm = function() {
    return this.each(function() {
        jQuery('input,select,textarea', this).clearFields();
    });
};

/**
 * Clears the selected form elements.  Takes the following actions on the matched elements:
 *  - input text fields will have their 'value' property set to the empty string
 *  - select elements will have their 'selectedIndex' property set to -1
 *  - checkbox and radio inputs will have their 'checked' property set to false
 *  - inputs of type submit, button, reset, and hidden will *not* be effected
 *  - button elements will *not* be effected
 *
 * @example $('.myInputs').clearFields();
 * @desc Clears all inputs with class myInputs
 *
 * @name clearFields
 * @type jQuery
 * @cat Plugins/Form
 * @see clearForm
 */
jQuery.fn.clearFields = jQuery.fn.clearInputs = function() {
    return this.each(function() {
        var t = this.type, tag = this.tagName.toLowerCase();
        if (t == 'text' || t == 'password' || tag == 'textarea')
            this.value = '';
        else if (t == 'checkbox' || t == 'radio')
            this.checked = false;
        else if (tag == 'select')
            this.selectedIndex = -1;
    });
};


/**
 * Resets the form data.  Causes all form elements to be reset to their original value.
 *
 * @example $('form').resetForm();
 * @desc Resets all forms on the page.
 *
 * @name resetForm
 * @type jQuery
 * @cat Plugins/Form
 * @see clearForm
 */
jQuery.fn.resetForm = function() {
    return this.each(function() {
        // guard against an input with the name of 'reset'
        // note that IE reports the reset function as an 'object'
        if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType))
            this.reset();
    });
};
var qzPath = "";

		var mapkey;
		function setupIE() {if(document.all){ $("#nav>li").hover(function() { $(this).addClass("over");}, function() {$(this).removeClass("over");});}}
				var view = "";
	
 var app = "default"; 
var Ad_h = fetchHierarchy(app,view);