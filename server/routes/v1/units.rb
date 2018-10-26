# frozen_string_literal: true

class Ampere
  
  route('units', 'api/v1') do |r|
    r.get do
      centrali = MAPBOX.centrali.map{|x| x["properties"]}
      if Ampere.production?
        response.cache_control public: true, must_revalidate: true, max_age: 300
        r.etag Digest::SHA1.hexdigest(centrali.to_s)
      end
      Oj.dump(centrali, mode: :compat)
    end
  end

end
