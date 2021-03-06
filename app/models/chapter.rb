class Chapter < ActiveRecord::Base
  validates :work_id, presence: true
  validates :number, presence: true
  validates :link, presence: true

  has_many :comments
  has_many :ratings
  belongs_to :work

  def average_rating
    ratings = self.ratings

    if ratings.length == 0
      return 0
    end

    sum = 0
    ratings.each do | rating |
     sum += rating.rating
   end

   full_rating = sum.to_f / ratings.length
   rounded_rating = (full_rating * 100).round / 100.0

   rounded_rating.to_f
 end

 def send_notifications
   self.work.users.find_each do |user|
    NotificationMailer.send_update(user, self).deliver_now
   end
 end

end
