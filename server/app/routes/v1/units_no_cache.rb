# frozen_string_literal: true

V1::Api.route("units_no_cache") do |r|
  r.get do
    centrali = Units.get_all_units
    # if Server.production?
    #   response.cache_control public: true, must_revalidate: true, max_age: 300
    #   r.etag Digest::SHA1.hexdigest(centrali.to_s)
    # end
    json(centrali)
  end
end

