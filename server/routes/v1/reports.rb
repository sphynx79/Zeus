# frozen_string_literal: true

class Ampere
  route("reports", "api/v1") do |r|
    r.on String, String do |start_dt, end_dt|
      r.halt(403, {"error" => "Start date non corretta"}) if self.class.data_is_correct(start_dt)
      r.halt(403, {"error" => "End date non corretta"}) if self.class.data_is_correct(end_dt)
      start_dt = Time.parse(start_dt)
      end_dt = (Time.parse(end_dt) + (3600 * 24) - 1)
      keys = Set.new
      # daily teconlogia
      r.is_exactly "centrali_tecnologia" do
      response["Content-Type"] = "application/json"
        while (start_dt += (3600 * 24)) <= end_dt
          keys << start_dt.strftime("%Y-%m-%d")
        end
        self.class.get_value(keys, CACHE_TEC_DAILY)
      end
      # daily zona
      r.is_exactly "centrali_zona" do
      response["Content-Type"] = "application/json"
        while (start_dt += (3600 * 24)) <= end_dt
          keys << start_dt.strftime("%Y-%m-%d")
        end
        self.class.get_value(keys, CACHE_ZONA_DAILY)
      end
      # hourly tecnologia
      r.is_exactly "centrali_giornaliero_tecnologia" do
      response["Content-Type"] = "application/json"
        while (start_dt += (3600)) <= end_dt
          keys << start_dt.strftime("%Y-%m-%d %H:%M:%S")
        end
        self.class.get_value(keys, CACHE_TEC_HOURLY)
      end
      # hourly zona
      r.is_exactly "centrali_giornaliero_zona" do
      response["Content-Type"] = "application/json"
        while (start_dt += (3600)) <= end_dt
          keys << start_dt.strftime("%Y-%m-%d %H:%M:%S")
        end
        self.class.get_value(keys, CACHE_ZONA_HOURLY)
      end
    end
  end

  def self.get_value(keys, db)
    keys.reduce("[".dup) { |cum, indv| cum << "#{db[indv]}," }[0..-2] << "]"
  end
end

