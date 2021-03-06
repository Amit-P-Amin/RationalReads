module Api
  class WorksController < ApplicationController
    def create
      @work = Work.new(work_params)
      @work.bayesian_average = 0
      if current_user.nil?
        @work.user_id = nil
      else
        @work.user_id = current_user.id
      end
      @tags = params["taggings"]

      if @work.save
        Tagging.save_tags(@tags, @work.id)
        render json: @work
      else
        render json: @work.errors.full_messages, status: 406
      end
    end

    def update
      @work = Work.find(params[:id])
      @tags = params["taggings"]
      @work.update(work_params)

      if @work.save
        Tagging.update_tags(@tags, @work.id)
        render json: @work
      else
        render json: @work.errors.full_messages, status: 406
      end
    end

    def show
      @work = Work.find(params[:id])
      @comments = @work.comments
      @chapters = @work.chapters

      render :show
    end

    def index
      filtered_works = Work.filtered(params[:filters])

      if params[:recommendations] == "true"
        if current_user.nil?
          render json: "Invalid, sign in first.", status: 406
        else
          works = current_user.recommended_works
        end
      else
        works = Work.order(params[:order], filtered_works)
      end

      @number_of_works = works.length

      if params[:page] === nil
        @works = works
        @pages = (works.length / 10.0).ceil
      else
        @works = Work.page(params[:page], works)
        @pages = (works.length / 10.0).ceil
      end

      render :index
    end

    private

      def work_params
        params.require(:work).permit(:name, :author, :link, :description, :length)
      end
  end
end
