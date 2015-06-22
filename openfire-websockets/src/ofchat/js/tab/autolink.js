/*
 * http://codesnipp.it/code/793
 */
(function($) {
  $.fn.extend({
    autoLink: function(options){
      var classes = options.class || '';
      var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      /* Credit for the regex above goes to @elijahmanor on Twitter, so follow that awesome guy! */
      this.each( function(){
        $(this).html( $(this).html().replace(exp,"<a href='$1' class='" + classes + "' target='_blank'>$1</a>") );
      });
      return this;
    }
  });
})(jQuery);

