# frozen_string_literal: true

class Units
  extend Mapbox
  cattr :cache

  class << self
    def refresh_cache
      @@cache = get_all_units
    end

    def get_all_units
      centrali.map { |x| x["properties"] }
    end
  end
end

