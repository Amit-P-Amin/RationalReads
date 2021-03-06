Rails.application.routes.draw do
  root to: "static_pages#root"

  resources :users
  resource :session, only: [:new, :create, :destroy]

  resources :ratings, only: [:create, :update], defaults: { format: :json }
  resources :comments, only: [:create, :update], defaults: { format: :json }
  resources :tags, only: [:new, :create, :index]

  namespace :api, defaults: { format: :json } do
    resources :works, only: [:create, :show, :index, :update]
    resources :chapters, only: [:create, :show, :index]
  end

  resources :follows, only: [:create, :destroy, :show]

  resources :password_resets, only: [:new, :create]
  get 'password_resets/use_reset_string' => 'password_resets#use_reset_string'
  post 'password_resets/reset' => 'password_resets#reset'
end
