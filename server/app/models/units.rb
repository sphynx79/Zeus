# frozen_string_literal: true

class Units
  extend Mapbox
  mattr_reader :cache_units

  class << self
    def initialize_cache
      @@cache_units = get_all_units
    end

    def get_all_units
      centrali.map { |x| x["properties"] }
    end
  end
end

