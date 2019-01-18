# frozen_string_literal: true

V1::Api.route("units") do |r|
  r.get do
    centrali = Units.cache
    json(centrali)
  end
end

