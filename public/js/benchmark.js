/*!
 * JavaScript Class to handle benchmarks v1.0 (use JSC v0.5.3)
 * Copyright 2013 Jean-Sebastien CONAN
 * Released under the MIT license
 */
JSC.helper(function(JSC){
    /**
     * Class to handle benchmarks
     *
     * @todo Use delayed calls structure (setTimeout)
     * @todo Add handlers called to build particular context before measures
     * @todo Reduce default loops number, the measured test functions must implement a minimal heap of code to be visible in measure without run too many loops
     */
    JSC.Benchmark = JSC.create({
        /**
         * Name of the class
         *
         * @constant
         * @type String
         */
        className : "Benchmark",

        /**
         * Delegate constructor
         *
         * @constructor
         * @param {Object} config A config object to setup the benchmark
         */
        initialize : function(config) {
            // set initial config
            if( config ) {
                // load context values
                this.name = config.name || this.name;
                this.times = config.times || this.times;
                this.loops = config.loops || this.loops;
                this.benchs = config.benchs || [];

                // load event handlers
                this.setHandlers(config.handlers);
            }

            // fire event after benchmark initialize
            this.trigger("initialize", config, this);
        },

        /**
         * Run the benchmark
         */
        run : function() {
            var i, benchItem, result, handlers, measures = [];

            // fire event before the benchmark run
            this.trigger("beforeRun", this.benchs, this);

            // run measures for each bench
            for(i = 0; i < this.benchs.length; i++) {
                benchItem = this.benchs[i];

                // fire event before the bench measures
                this.trigger("beforeBench", benchItem, this);

                // do the bench measures
                try {
                    // is there a benchmark suite nested ?
                    if( benchItem.benchs ) {
                        // need event handlers in list
                        if( !handlers ) {
                            handlers = this.getHandlers();
                        }

                        // benchmark descriptor ?
                        if( !(benchItem instanceof JSC.Benchmark) ) {
                            // get a valid instance of benchmark suite
                            benchItem = JSC.Benchmark(JSC.merge(true, {
                                name : this.name,
                                times : this.times,
                                loops : this.loops,
                                handlers : handlers
                            }, benchItem));
                        } else {
                            // just custom the benchmark suite with handlers
                            benchItem.setHandlers(handlers);
                        }

                        // run the nested benchmark suite
                        result = benchItem.run();
                    } else {
                        // standard bench measures
                        result = this.bench(benchItem.name, benchItem.bench, benchItem.loops, benchItem.times);
                    }
                } catch(e) {
                    result = this.measureDetails(e, benchItem.name, benchItem.bench);
                }
                measures.push(result);

                // fire event after the bench measures
                this.trigger("afterBench", result, benchItem, this);
            }

            // fire event after the benchmark run
            this.trigger("afterRun", measures, this);

            return measures;
        },

        /**
         * Run a bench
         *
         * @param {String} name The measures' name
         * @param {Function} fn The function to measure
         * @param {Number} loops The number of times the function must be running to get an exploitable measure
         * @param {Number} times The number of times the measure must be taken
         * @return {Object} Returns the measure details
         * @throws JSC.Error
         */
        bench : function(name, fn, loops, times) {
            var i, details, measures = [];

            // validate the params
            times = times|| this.times;
            loops = loops || this.loops;
            if( !JSC.isFunction(fn) ) {
                JSC.error("A valid function is needed !");
            }

            // take measures
            for(i = 0; i < times; i++) {
                // fire event before the measures
                this.trigger("beforeMeasure", name, fn, this);

                // do the measures
                try {
                    measures.push(this.measure(fn, loops));
                    details = this.measureDetails(measures, name, fn);
                } catch(e) {
                    details = this.measureDetails(e, name, fn);
                }

                // fire event after the bench measures
                this.trigger("afterMeasure", details, this);
            }

            // compute detailed measures
            return details;
        },

        /**
         * Take a benchmark measure on a particular function.
         *
         * @param {Function} fn The function to measure
         * @param {Number} loops The number of times the function must be running to get an exploitable measure
         * @return {Number} Returns the duration for this measure
         * @throws JSC.Error
         */
        measure : function(fn, loops) {
            var i, t1, t2;

            // validate the params
            loops = loops || this.loops;
            if( !JSC.isFunction(fn) ) {
                JSC.error("A valid function is needed !");
            }

            // capture the begin timestamp
            t1 = this.timestamp();

            // run the function to measure
            for(i = 0; i < loops; i++) {
                fn();
            }

            // capture the end timestamp and compute duration
            t2 = this.timestamp();
            return t2 - t1;
        },

        /**
         * Get details for a list of measures
         *
         * @param {Array} measures The list of measures (a measure is a duration in milliseconds)
         * @param {String} name A name for the measures
         * @param {Function} bench The measured function
         * @return {Object} Returns the detailed measures
         */
        measureDetails : function(measures, name, bench) {
            var i, min, max, duration, measure, result = {};

            // measures are successful ?
            if( JSC.isArray(measures) ) {
                // compute detailed measures
                for(i = 0; i < measures.length; i++) {
                    measure = measures[i];
                    min = Math.min(min || measure, measure);
                    max = Math.max(max || measure, measure);
                    duration = (duration || 0) + measure;
                }

                // gathers the details
                JSC.merge(result, {
                    duration : duration,
                    average : duration / (measures.length || 1),
                    variation : max - min,
                    min : min,
                    max : max,
                    success : true
                });
            } else {
                // error occured on measures
                result.success = false;
            }

            // finalizes and returns the details
            return JSC.merge(result, {
                name : name,
                bench : bench,
                measures : measures
            });
        },

        /**
         * Get the current timestamp as a number of milliseconds since Epok (1970-01-01)
         *
         * @return {Number} The current timestamp
         */
        timestamp : function() {
            return (new Date()).getTime();
        },

        /**
         * Get event handlers
         *
         * @return {Object} Returns the list of installed event handlers
         */
        getHandlers : function() {
            var name, event, handlers = {};
            for(name in this) {
                if( "_on" === name.substr(0, 3) && JSC.isFunction(this[name]) ) {
                    event = name.charAt(3).toLowerCase() + name.substr(4);
                    handlers[event] = this[name];
                }
            }
            return handlers;
        },

        /**
         * Set event handlers
         *
         * @param {Object} handlers List of event handlers to install
         * @return {JSC.Benchmark}
         */
        setHandlers : function(handlers) {
            // fire event before add handlers
            if( false !== this.trigger("beforeHandlers", handlers, this) ) {
                // load event handlers
                if( handlers ) {
                    JSC.each(handlers, this.attach("on"));
                }
            }

            // fire event after handlers added
            this.trigger("afterHandlers", handlers, this);
            return this;
        },

        /**
         * Name of the benchmark
         *
         * @type String
         */
        name : "JavaScript Performance Benchmark",

        /**
         * Number of times the bench function is run to take a measure
         *
         * @type Number
         */
        loops : 1000000,

        /**
         * Number of times the measure is taken
         *
         * @type Number
         */
        times : 4,

        /**
         * The benchmark suite
         *
         * @type Array
         */
        benchs : null
    });

    JSC.Benchmark.implement("SimpleEvents").self(function(config) {
        return new this(config);
    });
});
