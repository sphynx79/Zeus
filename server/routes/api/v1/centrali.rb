# frozen_string_literal: true

class Ampere
  
  route('centrali', 'api/v1') do |r|
    r.get do
      centrali = MAPBOX.centrali
      if Ampere.production?
        response.cache_control public: true, must_revalidate: true, max_age: 300
        # response.cache_control public: true, max_age: 3600
        r.etag Digest::SHA1.hexdigest(centrali.to_s)
      end
      # r.last_modified Time.now
      lista_centrali = []
      centrali.map do |centrale|
        lista_centrali << centrale["properties"]
      end
      lista_centrali
    end
  end

end
