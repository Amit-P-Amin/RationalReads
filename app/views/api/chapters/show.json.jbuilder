json.extract! @chapter, :id, :work_id, :number, :link, :created_at
json.description @chapter.work.description
json.work_title @chapter.work.name

json.created_at_string @chapter.created_at.strftime("%B %d, %Y")
json.time_ago time_ago_in_words(@chapter.created_at)

if current_user && current_user.rating(nil, @chapter.id)
  json.user_rating current_user.rating(@chapter.id, nil).rating
else
  json.user_rating "none"
end

json.average_rating @chapter.average_rating
json.ratings @chapter.ratings.length

json.num_comments @chapter.comments.length

json.comments @comments do |comment|
  json.partial! './comments/show', comment: comment
end
