# frozen_string_literal: true

class Ampere
  
  route('centrali', 'api/v1') do |r|
    r.get do
      # response.cache_control public: true, must_revalidate: true, max_age: 3600
      response.cache_control public: true, max_age: 3600
      # centrali = MapBox.get_centrali
      centrali = MAPBOX.centrali
      r.etag Digest::SHA1.hexdigest(centrali.to_s)
      # r.last_modified Time.now
      lista_centrali = []
      centrali.map do |centrale|
        lista_centrali << centrale["properties"]
      end
      Oj.dump(lista_centrali, mode: :compat)
    end
  end

end
