# frozen_string_literal: true

class Units
  extend Mapbox

  class << self
    def initialize_cache
        get_all_units
    end

    def get_all_units
      centrali.map { |x| x["properties"] }
    end
  end
end

