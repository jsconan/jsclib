/*!
 * LocalStorage Wrapper
 *
 * Plugin for JavaScript Class Library v0.4.0 and above
 *
 * Copyright 2012 Jean-Sebastien CONAN
 * Released under the MIT license
 */
(function(JSC, globalContext){
    var localstorage = {
        /**
         * Name of plugin
         *
         * @type String
         */
        pluginName : "localStorage",

        /**
         * Init the localStorage wrapper.
         *
         * @param {String} name Name of the entry point in the local storage. By default use the library name (JSC).
         * @return {JSC.localStorage} Plugin entry point
         */
        init : function(name) {
            if( globalContext.localStorage ) {
                this.name = name || this.name;
                this.data = JSC.jsonDecode(globalContext.localStorage[this.name]) || {};
                globalContext.addEventListener("unload", JSC.attach(this, "store"));
            }
            return this;
        },

        /**
         * Store all the data from the wrapper to local storage
         *
         * @return {JSC.localStorage} Plugin entry point
         */
        store : function(){
            if( JSC.isEmptyObject(this.data) ) {
                globalContext.localStorage[this.name] && delete globalContext.localStorage[this.name];
            } else {
                globalContext.localStorage[this.name] = JSC.jsonEncode(this.data);
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
    JSC.install(localstorage);
})(JSC, this);
