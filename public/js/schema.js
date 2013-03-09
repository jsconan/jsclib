/*!
 * JavaScript Class to handle schemas v1.0 (use JSC v0.5.1)
 *
 * Copyright 2013 Jean-Sebastien CONAN
 * Released under the MIT license
 */
(function(JSC){
    var
        // get the native method to slice array
        _arraySlice = [].slice,

        /**
         * Class to handle schemas
         */
        Schema = {
            /**
             * Name of the class
             *
             * @constant
             * @type String
             */
            className : "Schema",

            /**
             * Delegate constructor
             *
             * @constructor
             * @param {String} name Name of the represented node
             * @param {Object} nested Nested item
             */
            initialize : function(name, nested) {
                this.name = name;
                this.nested = nested;
                this.nodes = {};
            },

            /**
             * Rename the node
             *
             * @param {String} name Name of the represented node
             */
            rename : function(name) {
                this.name = name;
            },

            /**
             * Assign a nested item
             *
             * @param {Object} nested Nested item
             */
            nest : function(nested) {
                this.nested = nested;
            },

            /**
             * Find a node for given name and parent. If it does not exist, create it at appropriate place
             *
             * @param {String} name Name of the node to find
             * @param {String|Schema} parent Parent of the node
             * @return {Schema} Return the wanted node
             */
            node : function(name, parent) {
                var node = JSC.isObject(name) && name instanceof JSC.Schema ? name : this.find(name);
                return node || (parent ? this.node(parent) : this).add(name);
            },

            /**
             * Move a node to another place
             *
             * @param {String} name Name of the node to move
             * @param {String|Schema} to New parent of the node
             * @return {Schema} Return the moved node
             */
            move : function(name, to) {
                var node = this.remove(name);
                node && (to ? this.node(to) : this).add(node);
                return node;
            },

            /**
             * Add a node. If the node already exists, just return it.
             *
             * @param {String} name Name of the node to add
             * @return {Schema} Return the added node
             */
            add : function(name) {
                var node;

                // is a node given ?
                if( JSC.isObject(name) && name instanceof JSC.Schema ) {
                    // load the given node
                    node = name;
                    name = node.name;
                } else {
                    // try to find node in this, or create it
                    node = this.nodes[name] || JSC.Schema(name);
                }

                // force node in place, then return it
                this.nodes[name] = node;
                return node;
            },

            /**
             * Remove a node.
             *
             * @param {String} name Name of the node to remove
             * @return {Schema} Return the removed node
             */
            remove : function(name) {
                var i, node;
                if( name ) {
                    // wanted node is in this ?
                    if( this.nodes[name] ) {
                        node = this.nodes[name];
                        delete this.nodes[name];
                        return node;
                    }

                    // try to find in children
                    for(i in this.nodes) {
                        node = this.nodes[i].remove(name);
                        if( node ) {
                            return node;
                        }
                    }
                }
                return null;
            },

            /**
             * Find a node for a given name.
             *
             * @param {String} name Name of the node to find
             * @return {Schema} Return the wanted node, or null if not found
             */
            find : function(name) {
                var i, node;
                if( name ) {
                    // wanted node is in this ?
                    if( this.nodes[name] ) {
                        return this.nodes[name];
                    }

                    // try to find in children
                    for(i in this.nodes) {
                        node = this.nodes[i].find(name);
                        if( node ) {
                            return node;
                        }
                    }
                }
                return null;
            },

            /**
             * Call a function on each node, from root to leafs
             *
             * @type Function({Schema} node)
             *
             * @return {Schema} Return the current instance
             */
            walk : function(fn) {
                var name, node, args = _arraySlice.call(arguments, 0);

                // call on current node
                args[0] = this;
                fn.apply(this, args);

                // call on each child
                for(name in this.nodes) {
                    node = this.nodes[name];
                    node.walk.apply(node, arguments);
                }
                return this;
            },

            /**
             * Call a function on each node, from leafs to root
             *
             * @type Function({Schema} node)
             *
             * @return {Schema} Return the current instance
             */
            walkBack : function(fn) {
                var name, node, args = _arraySlice.call(arguments, 0);

                // call on each child
                for(name in this.nodes) {
                    node = this.nodes[name];
                    node.walkBack.apply(node, arguments);
                }

                // call on current node
                args[0] = this;
                fn.apply(this, args);
                return this;
            },

            /**
             * Name of the node
             *
             * @type String
             */
            name : null,

            /**
             * Nested item
             *
             * @type Object
             */
            nested : null,

            /**
             * List of nodes
             *
             * @type Object
             */
            nodes : null
        };

    JSC.Schema = JSC(Schema).self(function(name, nested) {
        return new this(name, nested);
    });
})(JSC);
