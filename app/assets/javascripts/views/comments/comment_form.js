RationalReads.Views.CommentForm = Backbone.View.extend({
  template: JST['comments/comment_form'],
  errorTemplate: JST['error'],
  commentTemplate: JST['comments/comment_show'],
  commentHeaderTemplate: JST['comments/headers/work_comment_header'],

  initialize: function (options) {
    this.work = options.work;
    this.reply = options.reply;
    this.parent_comment = options.parent_comment;
    this.chapter = options.chapter
    this.type = options.type
  },

  events: {
    "submit .comment": "submitComment"
  },

  render: function () {
    if (this.reply) {
      var header = "Leave a reply"
    } else {
      var header = "Leave a comment"
    }

    var content = this.template({header: header});

    this.$el.html(content);

    return this;
  },

  submitComment: function (event) {
    event.preventDefault();
    var form = $(event.currentTarget);
    var $textarea = form.find("textarea");
    var content = $textarea.val();

    var comment = new RationalReads.Models.Comment();
    if (this.type === "chapter") {
      comment.set({chapter_id: this.chapter.get("id"), content: content});
    } else {
      comment.set({work_id: this.work.get("id"), content: content});
    }

    if (this.parent_comment != null) {
      comment.set({parent_comment_id: this.parent_comment.get("id")});
    }

    comment.save({},
      {
        success: function(model, response) {
          var $newComment = $(this.commentTemplate({comment: comment}))

          if (this.type === "chapter") {
            this.updateCommentCount(this.chapter.get("num_comments"));
          } else {
            this.updateCommentCount(this.work.get("num_comments"));
          }

          this.remove();
          if (this.reply) {
            $("#" + model.get("parent_comment_id")).append($newComment);
          } else {
            if ( $("#comment").length === 0 ) {
              $("#comment-form").append(this.commentHeaderTemplate());
              $("#comment-form").append("<div id='comment'>")
            }
            $("#comment").prepend($newComment);
          }

          var $raty = $newComment.find(".raty")
            $raty.raty({
              readOnly: true,
              score: comment.get("rating")
            });

        }.bind(this),
        error: function (model, response) {

          response.responseJSON.forEach ( function (error) {
            $(".errors").append(this.errorTemplate({error: error}));
          }.bind(this));

        }.bind(this)
      }
    )
  },

  updateCommentCount: function (comments) {
    var newNumComments = comments + 1;

    $(".num-comments-number").animate({'opacity': 0}, 500, function () {
        $(this).text(newNumComments);
    }).animate({'opacity': 1}, 10);
  }

});
