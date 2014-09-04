/* jshint ignore:start */
if (typeof Object.getPrototypeOf !== "function")
Object.getPrototypeOf = ''.__proto__ === String.prototype
? function (object) {
    return object.__proto__;
}
: function (object) {
    // May break if the constructor has been tampered with
    return object.constructor.prototype;
}
if (!Object.create) {
    Object.create = (function(){
        function F(){}

        return function(o){
            if (arguments.length != 1) {
                throw new Error('Object.create implementation only accepts one parameter.');
            }
            F.prototype = o;
            return new F()
        }
    })()
}
/* jshint ignore:end */
