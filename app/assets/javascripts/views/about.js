RationalReads.Views.About = Backbone.CompositeView.extend({
  template: JST['about'],

  render: function () {
    this.$el.append(this.template());
    RationalReads.Utils.MoveTop();
    return this
  }

});
