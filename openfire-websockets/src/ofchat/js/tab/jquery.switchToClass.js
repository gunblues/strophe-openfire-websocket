(function($){
    $.switchToClass = function(el, targetClass, options){
        var base = this;

        base.$el = $(el);
        base.el = el;

        base.$el.data("switchToClass", base);

        base.init = function(){
            if( typeof( targetClass ) === "undefined" || targetClass === null ) targetClass = "";
            base.targetClass = targetClass;
            base.options = $.extend({},$.switchToClass.defaultOptions, options);
        };

        base.init();
    };

    $.switchToClass.defaultOptions = {

    };

    $.fn.switchToClass = function(targetClass, options){
        return this.each(function(){
            (new $.switchToClass(this,targetClass, options));
                    var oClass = $(this).data('switch-class');
                    if (oClass) {
                        $(this).removeClass(oClass);
                    }
                    $(this).addClass(targetClass).data('switch-class', targetClass);
        });
    };

})(jQuery);
