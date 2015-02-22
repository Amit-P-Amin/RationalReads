RationalReads.Views.WorksIndex = Backbone.CompositeView.extend({
  indexTemplate: JST['works/headers/index_header'],
  recommendationsTemplate: JST['works/headers/recommendations_header'],
  searchTemplate: JST['works/headers/search_header'],
  template: JST['works/headers/insert_location'],
  paginationTemplate: JST['works/pagination'],
  filterFormTemplate: JST['works/filter'],

  initialize: function (options) {
    this.type = options.type;
    RationalReads.Utils.MoveTop();
    this.$el = $("<div class='centered'>");
    this.listenTo(this.collection, "sync", this.render);
    this.currentPage = "1";
    this.currentOrder = null;
    this.currentFilters = [];
  },

  events: {
    "click .pagination-links a": "detectDesiredPage",
    "click .filter-link": "renderFilterForm",
    "click #filters input:checkbox": "updateFilter",
    "click #orderings input:radio": "updateOrder"
  },

  updateFilter: function () {
    this.currentFilters = this.getTags();
    this.reRenderWorks();
  },

  updateOrder: function () {
    var $order = $("#orderings input:radio:checked");
    this.currentOrder = $order.val();
    this.reRenderWorks();
  },

  getTags: function () {
    var $checkedTags = $( "input:checkbox:checked" );
    var tags = [];

    $checkedTags.each( function(index, tag) {
      tags.push($(tag).val());
    });

    return tags;
  },

  reRenderWorks: function () {
    var newCollection = new RationalReads.Collections.Works();
    this.removeSubviews();

    newCollection.fetch({
      data: {filters: this.currentFilters, order: this.currentOrder},
      success: function (collection, response) {
        this.collection = newCollection;
        this.renderWorks();
      }.bind(this)
    })
  },

  render: function () {
    this.removePastPages();
    if (this.type === "index") {
      this.$el.html(this.indexTemplate());
    } else if (this.type === "recommendations" ){
      this.$el.html(this.recommendationsTemplate());
    } else if (this.type === "search") {
      this.$el.html(this.searchTemplate());
    }

    this.$el.append(this.template());

    this.renderWorks();

    return this;
  },

  renderFilterForm: function () {
    var tags = new RationalReads.Collections.Tags();

    tags.fetch({
      success: function (model, response) {
        var form = this.filterFormTemplate({tags: tags});
        var $formDiv = $(".filter-form")
        $formDiv.html(form);
        $formDiv.slideDown({
          duration: "slow"
        });
      }.bind(this)
    })
  },

  renderTitle: function () {
    if (this.collection.length === 1) {
      $("#all-works").text("1 Work");
    } else if (this.currentFilters.length > 0) {
      $("#all-works").text(this.collection.length + " Works");
    } else {
      $("#all-works").text("All Works");
    }
  },

  renderWorks: function () {
    this.renderTitle();

    if (this.collection.length === 0) {
      $(".index").append("<h3>No works found. Select fewer tags.</h3>");
    } else {
      $(".index").empty();
      this.collection.each( function (work, index) {
        var subItem = new RationalReads.Views.WorkItem({
          model: work,
          type: this.type,
          index: index
        });
        this.addSubview('.index', subItem);
      }.bind(this));
    }

    if (this.type === "index") {
      // this.renderPagination();
    }
  },

  detectDesiredPage: function (event) {
    var page = $(event.currentTarget).text();
    if (this.currentPage !== page) {
      RationalReads.Utils.MoveTop();
      this.currentPage = page;
      this.collection.fetch({
        data: {page: page}
      })
    }
  },

  renderPagination: function () {
    var content = this.paginationTemplate({pages: this.collection.pages, currentPage: this.currentPage});
    this.$el.append(content);
  },

  removePastPages: function () {
    _(this.subviews()).each(function (subviews) {
      _(subviews).each(function (subview) {
        subview.remove();
      });
    });
  }

});
