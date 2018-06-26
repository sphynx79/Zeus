# frozen_string_literal: true

class Ampere
  route('v1', 'api') do |r|
    r.multi_route('api/v1')
  end
end
