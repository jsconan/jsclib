/*!
 * JavaScript Class to handle HTML templating v1.0 (use JSC v0.5.1 and jQuery v1.8.3)
 *
 * Copyright 2013 Jean-Sebastien CONAN
 * Released under the MIT license
 */
(function(JSC, $){
    var
        // default error template used when an error occurs
        _errorTemplate = '<div class="error">An error has occurred !</div>',

        // void jQuery selection
        _voidJQ = $(),

        /**
         * Class to handle HTML templating from JavaScript
         */
        Template = {
            /**
             * Name of the class
             *
             * @constant
             * @type String
             */
            className : "Template",

            /**
             * Delegate constructor
             *
             * @constructor
             * @param {String} template A DOM identifier to load HTML fragment as a template, an HTML code, or an URL to get template
             */
            initialize : function(template) {
                this.renderTo = [];
                this.modifiers = {};
                this.postProcessors = {};
                template && this.load(template);
            },

            /**
             * Loads a template
             *
             * @param {String} template A DOM identifier to load HTML fragment as a template, an HTML code, or an URL to get template
             * @return {Template} Return the instance for chaining
             */
            load : function(template) {
                this.template = "";
                this.loaded = false;

                // load html from a known DOM element when selector is given...
                if( JSC.isString(template) ) {
                    if( JSC.isHTML(template) ) {
                        // template is HTML, just copy
                        this.template = template;
                        this.loaded = true;
                    } else if( JSC.isSelector(template) ) {
                        // template is a CSS selector, load related content
                        this.template = $(template).html();
                        this.loaded = true;
                    } else if( JSC.isURL(template) ) {
                        // otherwise template is an URL, load it with AJAX
                        $.ajax({
                            url: template,
                            cache: false,
                            dataType: "text",
                            error: this.attach("_ajaxTemplateError"),
                            success: this.attach("_ajaxTemplateSuccess")
                        });
                        return this;
                    } else {
                        // unknown format, assume error
                        this.template = this.errorTemplate;
                        this.loaded = true;
                    }
                } else if( template && template.jquery ) {
                    // template is a jQuery selection, load related content
                    this.template = template.html();
                    this.loaded = true;
                } else {
                    // unknown format, assume error
                    this.template = this.errorTemplate;
                    this.loaded = true;
                }

                // compile template when loaded, fire optional triggers
                if( this.loaded ) {
                    if( this._onLoad ) {
                        this.template = this._onLoad.call(this, this.template, template, this) || this.template;
                    }
                    this.compile();
                    if( this._onLoaded ) {
                        this.nodes = this._onLoaded.call(this, this.nodes, this.template, this) || this.nodes;
                    }
                }
                return this;
            },

            /**
             * Renders the loaded template
             *
             * @param {Object} data The dataset used to fill the template, or an URL to get data
             * @param {String|jQuery} [renderTo] Entry point in which render the template
             * @param {Boolean} [clean] Flag that force cleanning of the entry point
             * @return {Template|jQuery} Return the instance for chaining or filled elements when no entry point was given
             */
            render : function(data, renderTo, clean) {
                data = data || {};

                // process the render when entry point is given
                if( renderTo ) {
                    // assume that the entry point is a jQuery selection
                    renderTo = renderTo.jquery ? renderTo : $(renderTo);
                    clean = clean ? true : false;

                    // need to load distant data ?
                    if( JSC.isString(data) ) {
                        if( JSC.isURL(data) ) {
                            // data is an URL, load it with AJAX
                            $.ajax({
                                url: data,
                                cache: false,
                                dataType: "json",
                                error: JSC.attach(this, "_ajaxDataError", renderTo, clean),
                                success: JSC.attach(this, "_ajaxDataSuccess", renderTo, clean)
                            });
                            return this;
                        } else {
                            // the dataset format is unknown, try to eval as JSON...
                            data = JSC.jsonDecode(data) || [];
                        }
                    }

                    // add descriptor for in-time rendering
                    this.renderTo.push({
                        place : renderTo,
                        data : data,
                        clean : clean
                    });

                    // render and inject the filled template in given entry point if the template is already loaded
                    // otherwise, il will be rendered when loaded
                    return this.inject();
                }

                // no entry point given, just renders the template in memory and returns the result
                return this.compose(data);
            },

            /**
             * Fills the loaded template with data and renders it in each registered entry point
             *
             * @return {Template} Return the instance for chaining
             */
            inject : function() {
                if( this.loaded ) {
                    // process each render registry
                    while( this.renderTo.length ) {
                        // extract and remove one render registry
                        var nodes, entry = this.renderTo.splice(0, 1)[0];

                        // clean entry point when needed
                        entry.clean && entry.place.empty();

                        // do the rendering and fire optional trigger
                        nodes = this.compose(entry.data);
                        if( this._onRender ) {
                            nodes = this._onRender.call(this, nodes, entry.data, this) || nodes;
                        }
                        entry.place.append(nodes);
                        this._onAppend && this._onAppend.call(this, entry.place, nodes, entry.data, this);
                    }
                }
                return this;
            },

            /**
             * Callback used to handle errors while load a template with AJAX
             *
             * @private
             * @param {jqXHR} jqXHR Transport object
             * @param {String} textStatus A string describing the type of error that occurred
             * @param {String} errorThrown Optional exception object
             */
            _ajaxTemplateError : function(jqXHR, textStatus, errorThrown) {
                var template = this.errorTemplate;
                if( this._onError ) {
                    template = this._onError.call(this, template, textStatus, jqXHR, errorThrown, this) || template;
                }
                this.load(template).loaded && this.inject();
            },

            /**
             * Callback used to handle a template got with an AJAX loading
             *
             * @private
             * @param {String} template The received template
             * @param {String} textStatus A string describing the status
             * @param {jqXHR} jqXHR Transport object
             */
            _ajaxTemplateSuccess : function(template, textStatus, jqXHR) {
                if( this._onSuccess ) {
                    template = this._onSuccess.call(this, template, textStatus, jqXHR, this) || template;
                }
                this.load(template).loaded && this.inject();
            },

            /**
             * Callback used to handle errors while load a dataset with AJAX
             *
             * @private
             * @param {String|jQuery} [renderTo] Entry point in which render the template
             * @param {Boolean} [clean] Flag that force cleanning of the entry point
             * @param {jqXHR} jqXHR Transport object
             * @param {String} textStatus A string describing the type of error that occurred
             * @param {String} errorThrown Optional exception object
             */
            _ajaxDataError : function(renderTo, clean, jqXHR, textStatus, errorThrown) {
                var template = this.errorTemplate;
                if( this._onDataError ) {
                    template = this._onDataError.call(this, renderTo, clean, textStatus, jqXHR, errorThrown, this) || template;
                }
                if( renderTo ) {
                    clean && renderTo.empty();
                    renderTo.append($(template));
                }
            },

            /**
             * Callback used to handle a dataset got with an AJAX loading
             *
             * @private
             * @param {String|jQuery} [renderTo] Entry point in which render the template
             * @param {Boolean} [clean] Flag that force cleanning of the entry point
             * @param {String} data The received dataset
             * @param {String} textStatus A string describing the status
             * @param {jqXHR} jqXHR Transport object
             */
            _ajaxDataSuccess : function(renderTo, clean, data, textStatus, jqXHR) {
                if( this._onDataSuccess ) {
                    data = this._onDataSuccess.call(this, data, renderTo, clean, textStatus, jqXHR, this) || data;
                }
                this.render(data, renderTo, clean);
            },

            /**
             * Compiles the loaded template
             *
             * @return {Template} Return the instance for chaining
             */
            compile : function() {
                this.nodes = this.template ? $(this.template) : _voidJQ;
                return this;
            },

            /**
             * Get a copy of the template
             *
             * @return {jQuery} Return a copy of the template
             */
            cloneTemplate : function() {
                if( this.nodes && this.nodes.length ) {
                    return this.nodes.clone();
                }
                return _voidJQ;
            },

            /**
             * Fill the loaded template with data and returns the generated HTML code
             *
             * @param {Object} data The dataset from which get values
             * @param {jQuery} [nodes] The elements tree in which fill the values
             * @param {boolean} [isGlobal] Internal use only - Flag to indicate that the template is on global level
             * @return {jQuery} The rendered elements
             */
            compose : function(data, nodes, isGlobal) {
                var i, template, fragment, blocks, value, that = this;

                // assume arguments
                data = data || [];
                isGlobal = isGlobal || !nodes;
                nodes = nodes || this.cloneTemplate();

                // different processing according to type of the given dataset
                if( JSC.isArray(data) ) {
                    // find optional sub-template
                    template = nodes.find('[data-context="template"]');
                    if( template.length ) {
                        // sub-template found, process it with the given dataset
                        template.each(function(){
                            var element = $(this);
                            element.append(that.compose(data, element.children().remove(), isGlobal));
                        });
                    } else if( nodes.length ) {
                        // apply each data entry on a clone of the template and add the result to a rendering pool
                        blocks = _voidJQ;
                        for(i = 0; i < data.length; i++) {
                            // get a clone of the template and fill it with data
                            fragment = this.compose(data[i], i + 1 < data.length ? nodes.clone() : nodes);

                            // do a post process on the rendered template
                            isGlobal && this.globalPostProcess(fragment, data[i]);

                            // add the rendered template to the rendering pool
                            blocks = blocks.add(fragment);
                        }
                        nodes = blocks;
                    }
                } else {
                    // apply each data value on placeholders in the template
                    for(i in data) {
                        value = this.modifiedData(i, data);
                        fragment = nodes.find('[data-name="' + i + '"]');

                        // different rendering according to type of the value
                        if( JSC.isArray(value) ) {
                            // special processing for array values : replace content in template by composed version
                            fragment.each(function(){
                                var element = $(this);
                                element.append(that.compose(value, element.children().remove()));
                            });
                        } else {
                            // just fill the placeholder with the related data
                            fragment.html(value);
                        }

                        // do a post process on the rendered fragment
                        this.postProcess(i, fragment, data);
                    }

                    // do a post process on the rendered template
                    isGlobal && this.globalPostProcess(nodes, data);
                }
                return nodes;
            },

            /**
             * Get particular value from dataset, after related modifier has been applied on
             *
             * @param {String} name The name of the needed value
             * @param {Object} data The dataset from which get values
             * @return {Object} Return the modified value
             */
            modifiedData : function(name, data) {
                if( JSC.isFunction(this.modifiers[name]) ) {
                    return this.modifiers[name].call(this, data[name], name, data, this);
                }
                return data[name];
            },

            /**
             * Do an optional post processing on the rendered fragment
             *
             * @param {String} name The name of the needed value
             * @param {jQuery} fragment The rendered fragment
             * @param {Object} data The related dataset
             * @return {jQuery} Return the modified fragment
             */
            postProcess : function(name, fragment, data) {
                if( JSC.isFunction(this.postProcessors[name]) ) {
                    this.postProcessors[name].call(this, fragment, data, name, this);
                }
                return fragment;
            },

            /**
             * Do an optional post processing on the rendered template
             *
             * @param {jQuery} template The rendered template
             * @param {Object} data The related dataset
             * @return {jQuery} Return the modified fragment
             */
            globalPostProcess : function(template, data) {
                if( JSC.isFunction(this.globalPostProcessor) ) {
                    this.globalPostProcessor.call(this, template, data, this);
                }
                return template;
            },

            /**
             * Set the list of modifiers used to handle formatting of particular data
             *
             * @type Function({Object} value, {String} name, {Object} data, {Template} tpl))
             *
             * @param {Object} modifiers The new list of modifiers
             * @return {Template} Return the instance for chaining
             */
            setModifiers : function(modifiers) {
                if( JSC.isObject(modifiers) ) {
                    this.modifiers = modifiers;
                }
                return this;
            },

            /**
             * Get the list of modifiers used to handle formatting of particular data
             *
             * @type Function({Object} value, {String} name, {Object} data, {Template} tpl))
             *
             * @return {Object} The list of modifiers
             */
            getModifiers : function() {
                return this.modifiers;
            },

            /**
             * Set a particular data modifier
             *
             * @type Function({Object} value, {String} name, {Object} data, {Template} tpl))
             *
             * @param {String} name The name of data for which set the modifier
             * @param {Function} modifier The new modifier
             * @return {Template} Return the instance for chaining
             */
            setModifier : function(name, modifier) {
                if( JSC.isFunction(modifier) ) {
                    this.modifiers[name] = modifier;
                }
                return this;
            },

            /**
             * Get a particular data modifier
             *
             * @type Function({Object} value, {String} name, {Object} data, {Template} tpl))
             *
             * @return {Function} The modifier
             */
            getModifier : function(name) {
                return this.modifiers[name];
            },

            /**
             * Set the list of post processors to apply on rendered template
             *
             * @type Function({jQuery} fragment, {Object} data, {String} name, {Template} tpl))
             *
             * @param {Object} postProcessors The new list of post processors
             * @return {Template} Return the instance for chaining
             */
            setPostProcessors : function(postProcessors) {
                if( JSC.isObject(postProcessors) ) {
                    this.postProcessors = postProcessors;
                }
                return this;
            },

            /**
             * Get the list of post processors to apply on rendered template
             *
             * @type Function({jQuery} fragment, {Object} data, {String} name, {Template} tpl))
             *
             * @return {Object} The list of post processors
             */
            getPostProcessors : function() {
                return this.postProcessors;
            },

            /**
             * Set a particular post processor
             *
             * @type Function({jQuery} fragment, {Object} data, {String} name, {Template} tpl))
             *
             * @param {String} name The name of data for which set the post processor
             * @param {Function} postProcessor The new post processor
             * @return {Template} Return the instance for chaining
             */
            setPostProcessor : function(name, postProcessor) {
                if( JSC.isFunction(postProcessor) ) {
                    this.postProcessors[name] = postProcessor;
                }
                return this;
            },

            /**
             * Get a particular post processor
             *
             * @type Function({jQuery} fragment, {Object} data, {String} name, {Template} tpl))
             *
             * @return {Function} The post processor
             */
            getPostProcessor : function(name) {
                return this.postProcessors[name];
            },

            /**
             * Set the global post processor
             *
             * @type Function({jQuery} template, {Object|Array} data, {Template} tpl))
             *
             * @param {Function} postProcessor The new global post processor
             * @return {Template} Return the instance for chaining
             */
            setGlobalPostProcessor : function(postProcessor) {
                if( JSC.isFunction(postProcessor) ) {
                    this.globalPostProcessor = postProcessor;
                }
                return this;
            },

            /**
             * Get a particular post processor
             *
             * @type Function({jQuery} template, {Object|Array} data, {Template} tpl))
             *
             * @return {Function} The post processor
             */
            getGlobalPostProcessor : function(name) {
                return this.globalPostProcessor;
            },

            /**
             * Set or get an event handler
             *
             * @param {String} name Name of the related event
             * @param {Function} fn The related function to call when event occurs
             * @return {Function|Template} Return the event related function in getter mode, or return the current instance in setter mode
             */
            on : function(name, fn) {
                name = "_on" + name.charAt(0).toUpperCase() + name.substr(1);
                if( fn ) {
                    if( JSC.isFunction(fn) ) {
                        this[name] = fn;
                    }
                    return this;
                }
                return this[name];
            },

            /**
             * Set or get the trigger fired before a rendered template is appended to an entry point
             *
             * @type Function({jQuery} nodes, {Object} data, {Template} tpl)
             *
             * @param {Function} fn The related function to call when event occurs
             * @return {Function|Template} Return the event related function in getter mode, or return the current instance in setter mode
             */
            onRender : function(fn) {
                return this.on("render", fn);
            },

            /**
             * Set or get the trigger fired after a rendered template is appended to an entry point
             *
             * @type Function({jQuery} entry, {jQuery} nodes, {Object} data, {Template} tpl)
             *
             * @param {Function} fn The related function to call when event occurs
             * @return {Function|Template} Return the event related function in getter mode, or return the current instance in setter mode
             */
            onAppend : function(fn) {
                return this.on("append", fn);
            },

            /**
             * Set or get the trigger fired after template is loaded
             *
             * @type Function({String} template, {String} source, {Template} tpl)
             *
             * @param {Function} fn The related function to call when event occurs
             * @return {Function|Template} Return the event related function in getter mode, or return the current instance in setter mode
             */
            onLoad : function(fn) {
                return this.on("load", fn);
            },

            /**
             * Set or get the trigger fired after template is loaded and compiled
             *
             * @type Function({jQuery} nodes, {String} template, {Template} tpl)
             *
             * @param {Function} fn The related function to call when event occurs
             * @return {Function|Template} Return the event related function in getter mode, or return the current instance in setter mode
             */
            onLoaded : function(fn) {
                return this.on("loaded", fn);
            },

            /**
             * Set or get the trigger fired after succesfull load of a template with AJAX
             *
             * @type Function({String} template, {String} textStatus, {jqXHR} jqXHR, {Template} tpl)
             *
             * @param {Function} fn The related function to call when event occurs
             * @return {Function|Template} Return the event related function in getter mode, or return the current instance in setter mode
             */
            onSuccess : function(fn) {
                return this.on("success", fn);
            },

            /**
             * Set or get the trigger fired when error occurs on template loading with AJAX
             *
             * @type Function({String} template, {String} textStatus, {jqXHR} jqXHR, {String} errorThrown, {Template} tpl)
             *
             * @param {Function} fn The related function to call when event occurs
             * @return {Function|Template} Return the event related function in getter mode, or return the current instance in setter mode
             */
            onError : function(fn) {
                return this.on("error", fn);
            },

            /**
             * Set or get the trigger fired after succesfull load of a dataset with AJAX
             *
             * @type Function({Object} data, {jQuery} renderTo, {Boolean} clean, {String} textStatus, {jqXHR} jqXHR, {Template} tpl)
             *
             * @param {Function} fn The related function to call when event occurs
             * @return {Function|Template} Return the event related function in getter mode, or return the current instance in setter mode
             */
            onDataSuccess : function(fn) {
                return this.on("dataSuccess", fn);
            },

            /**
             * Set or get the trigger fired when error occurs on data loading with AJAX
             *
             * @type Function({jQuery} renderTo, {Boolean} clean, {String} textStatus, {jqXHR} jqXHR, {String} errorThrown, {Template} tpl)
             *
             * @param {Function} fn The related function to call when event occurs
             * @return {Function|Template} Return the event related function in getter mode, or return the current instance in setter mode
             */
            onDataError : function(fn) {
                return this.on("dataError", fn);
            },

            /**
             * Flag to indicate whether a template is loaded or not
             *
             * @type Boolean
             */
            loaded : false,

            /**
             * List of entry points in which render the template
             *
             * @type Array
             */
            renderTo : [],

            /**
             * HTML code of the template
             *
             * @type String
             */
            template : "",

            /**
             * HTML code of the template used when error occurs
             *
             * @type String
             */
            errorTemplate : _errorTemplate,

            /**
             * DOM elements compiled from template code
             *
             * @type jQuery
             */
            nodes : _voidJQ,

            /**
             * List of modifiers used to handle formatting of particular data
             *
             * @type Object
             */
            modifiers : null,

            /**
             * List of post processors to apply on rendered template
             *
             * @type Object
             */
            postProcessors : null,

            /**
             * Global post processor to apply on rendered template
             *
             * @type Function
             */
            globalPostProcessor : null
        };

    JSC.Template = JSC(Template).self(function(selector) {
        return new this(selector);
    });
})(JSC, jQuery);
