# frozen_string_literal: true

class Ampere
  route('api') do |r|
    response['Content-Type'] = 'application/json'
    response['Access-Control-Allow-Headers'] = '*'
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
    r.multi_route('api')
  end
end
