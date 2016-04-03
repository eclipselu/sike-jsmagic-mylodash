const _ = {
    once: function once(f) {
        var result;  // undefined

        function onceFunc() {
            if (!result) {
                result = f();
            }
            return result;
        }

        return onceFunc;
    },
    
    memoize: function memoize(f, resolver) {
        var cache = {};    
        
        function memoizedFunc(arg) {
            var cache_key = resolver ? resolver(arg) : arg; 
            var result;
            
            if (cache.hasOwnProperty(cache_key)) {
                result = cache[cache_key];  
            } else {
                result = f(arg);
                cache[cache_key] = result; 
            }
            
            return result;
        }
        
        return memoizedFunc;
    },

    bind: function bind(f, thisArg) {
        // f, thisArg, partials
        var partials = [].slice.call(arguments, 2);
        function bindedFunc() {
            var args = partials.concat([].slice.call(arguments));
            var result = f.apply(thisArg, args);
            return result;
        }
        return bindedFunc;
    }
};

module.exports = _;
