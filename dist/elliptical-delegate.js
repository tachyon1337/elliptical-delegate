
/*
 * =============================================================
 * elliptical-delegate
 * =============================================================
 *
 * dependencies:
 *
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-mvc'),require('elliptical-event'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-mvc','elliptical-event'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.Delegate = factory(root.elliptical,root.elliptical.Event);
        root.returnExports = root.elliptical.Delegate;
    }
}(this, function (elliptical,Event) {

    var Delegate=elliptical.Class.extend({
        bindings:null,

        init:function(bindings){
            this.bindings=bindings;

        },

        on:function(){
            var bindings=this.bindings;
            if(bindings && bindings.length){
                bindings.forEach(function(binding){
                    var eventName=binding.event;
                    var name=binding.delegate;
                    _bind(eventName,name);
                });
            }

            function _bind(eventName,name){
                $(document).on(eventName, '[delegate="'+ name +'"]', function (event) {
                    if (_validTarget(eventName,'delegate-target')) {
                        _handleEvent(event);
                    }

                });

                $(document).on(eventName, '[data-delegate="'+ name +'"]', function (event) {
                    if (_validTarget(event,'data-delegate-target')) {
                        _handleEvent(event);
                    }

                });
            }

            function _validTarget(event,attr){
                if(event.target===event.currentTarget){
                    return true;
                }else{
                    return ($(event.currentTarget).attr(attr)!==undefined);
                }
            }

            function _handleEvent(event) {
                var target = $(event.currentTarget);
                var evt,channel,camelCase;
                camelCase=false;
                if(target.attr('event')){
                    evt=target.attr('event');
                }else{
                    evt=target.attr('data-event');
                }
                if(target.attr('channel')){
                    channel=target.attr('channel');
                }else{
                    channel=target.attr('data-channel');
                }
                if(target.attr('camel-case')){
                    camelCase=target.attr('camel-case');
                }else if(target.attr('data-camel-case')){
                    camelCase=target.attr('data-camel-case');
                }

                /* pass the element attributes as the event data */
                var opts= $.element.getOpts(target[0],camelCase);
                //delete props channel and delegate-event
                if(opts.channel){
                    delete opts.channel;
                }
                if(opts.event){
                    delete opts.event;
                }
                if(opts.delegate){
                    delete opts.delegate;
                }
                if(opts.camelCase){
                    delete opts.camelCase;
                }

                opts.target=target[0];
                if (typeof channel !== 'undefined' && evt !== 'sync') {
                    Event.emit(channel + '.' + evt, opts);
                }
            }
        },

        off:function(){
            var bindings=this.bindings;
            if(bindings && bindings.length){
                bindings.forEach(function(binding){
                    var eventName=binding.event;
                    var name=binding.delegate;
                    _unbind(eventName,name);
                });
            }

            function _unbind(eventName,name){
                $(document).off(event, '[delegate="'+ name +'"]');
                $(document).on(eventName, '[data-delegate="'+ name +'"]');
            }
        }

    });

    return Delegate;


}));