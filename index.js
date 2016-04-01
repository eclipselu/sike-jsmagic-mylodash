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
    }
};

module.exports = _;
