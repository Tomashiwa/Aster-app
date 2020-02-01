Rails.application.routes.draw do
  # root to: "home#index"
  
  namespace :api do
    jsonapi_resources :tasks
    jsonapi_resources :tags
    jsonapi_resources :lists
    jsonapi_resources :boards
    jsonapi_resources :users
    jsonapi_resources :comments
  end
  
  scope '/api' do
    post 'user_token' => 'user_token#create'
  end

  # get "*path", to: "home#index", constraints: { format: "html" }
end