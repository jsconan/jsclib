/*!
 * LocalStorage Wrapper
 *
 * Plugin for JavaScript Class Library v0.5.0 and above
 *
 * Copyright 2012 Jean-Sebastien CONAN
 * Released under the MIT license
 */
(function(JSC, globalContext){
    var
        // load the "localStorage" entry, or stash its absence by a dummy object
        _localData = localStorage || {},

        // extract or create method to read a value from localStorage
        _getItem = _localData.getItem || function(name) {
            return this[name];
        },

        // extract or create method to write a value to localStorage
        _setItem = _localData.setItem || function(name, value) {
            this[name] = value;
        },

        // extract or create method to remove a value from localStorage
        _removeItem = _localData.removeItem || function(name) {
            "undefined" !== typeof this[name] && delete this[name];
        };

    // Class definition with multiton pattern to wrap access to localStorage
    var LocalStorage = {
        /**
         * Name of class
         *
         * @type String
         */
        className : "LocalStorage",

        /**
         * Init the localStorage wrapper.
         *
         * @param {String} name Name of the entry point in the local storage. By default use the library name (JSC).
         */
        initialize : function(name) {
            this.name = name || this.name;
            this.load();
            localStorage && this.bindEvent(globalContext, "unload", JSC.attach(this, "store"));
        },

        /**
         * Load data from local storage
         *
          * @return {JSC.localStorage} Plugin entry point
         */
        load : function() {
            this.data = JSC.jsonDecode(_getItem.call(_localData, this.name)) || {};
        },

        /**
         * Store all the data from the wrapper to local storage
         *
         * @return {JSC.localStorage} Plugin entry point
         */
        store : function(){
            if( JSC.isEmptyObject(this.data) ) {
                _removeItem.call(_localData, this.name);
            } else {
                _setItem.call(_localData, this.name, JSC.jsonEncode(this.data));
            }
        },

        /**
         * Set data to local storage wrapper.
         *
         * @param {String} name Name of the entry to set
         * @param {Object} data Data to set in the entry
         * @return {JSC.localStorage} Plugin entry point
         */
        set : function(name, data) {
            this.data[name] = data;
            return this;
        },

        /**
         * Get data from local storage wrapper.
         *
         * @param {String} name Name of the entry to get
         * @return {Object} Return the data from the entry
         */
        get : function(name) {
            return this.data[name];
        },

        /**
         * Remove an entry from local storage wrapper.
         *
         * @param {String} name Name of the entry to remove
         * @return {Object} Return the removed data
         */
        remove : function(name) {
            var data = this.data[name];
            "undefined" !== typeof data && delete this.data[name];
            return data;
        },

        /**
         * Erase all the data in the local storage wrapper.
         *
         * @return {JSC.localStorage} Plugin entry point
         */
        clear : function() {
            this.data = {};
            return this;
        },

        /**
         * Bind an event handler on an element for particular event name
         *
         * @param {Element} element Element on which bind the event
         * @param {String} eventName Name of the event to bind
         * @param {Function} eventHandler Handler to call when event is fired
         */
        bindEvent : function(element, eventName, eventHandler) {
            if( element.addEventListener ) {
                element.addEventListener(eventName, eventHandler, false);
            } else if( element.attachEvent ) {
                element.attachEvent("on" + eventName, eventHandler);
            }
        },

        /**
         * Name of the data set in local storage
         *
         * @type String
         */
        name : JSC.className,

        /**
         * Data set
         *
         * @type Object
         */
        data : null
    };

    // build and declare the class
    JSC.localStorage = JSC.multiton(LocalStorage);
})(JSC, this);
