# frozen_string_literal: true

V1::Api.route("units") do |r|
  r.get do
    centrali = Caddy[:cache_units].cache
    # if Server.production?
    #   response.cache_control public: true, must_revalidate: true, max_age: 300
    #   r.etag Digest::SHA1.hexdigest(centrali.to_s)
    # end
    json(centrali)
  end
end

