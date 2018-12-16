# frozen_string_literal: true

V1::Api.route("reports") do |r|
  def get_value(dates, cache)
    # la ricerca nella cache ha sempre la key nel timezone italiano
    dates.reduce("[".dup) { |cum, data| cum << "#{cache[data]}," }[0..-2] << "]" 
  end

  r.on String, String do |start_dt, end_dt|
    r.halt(403, json({"error" => "Start date non corretta"})) if data_is_correct(start_dt)
    r.halt(403, json({"error" => "End date non corretta"})) if data_is_correct(end_dt)
    start_dt = Time.parse(start_dt)
    end_dt = (Time.parse(end_dt) + (3600 * 24) - 1)
    dates = Set.new
    remaining_path = request.remaining_path.tr("/", "")
    cache = Caddy[:cache_report]["cache_#{remaining_path}".to_sym]
    r.halt(403, json({"error" => cache})) unless cache.is_a? (Hash)

    # daily teconlogia
    r.is_exactly "centrali_tecnologia_daily" do
      while (start_dt += (3600 * 24)) <= end_dt
        dates << start_dt.strftime("%Y-%m-%d")
      end
      get_value(dates, cache)
    end

    # daily zona
    r.is_exactly "centrali_zona_daily" do
      while (start_dt += (3600 * 24)) <= end_dt
        dates << start_dt.strftime("%Y-%m-%d")
      end
      get_value(dates, cache)
    end

    # hourly tecnologia
    r.is_exactly "centrali_tecnologia_hourly" do
      while (start_dt += (3600)) <= end_dt
        dates << start_dt.strftime("%Y-%m-%d %H:%M:%S")
      end
      get_value(dates, cache)
    end

    # hourly zona
    r.is_exactly "centrali_zona_hourly" do
      while (start_dt += (3600)) <= end_dt
        dates << start_dt.strftime("%Y-%m-%d %H:%M:%S")
      end
      get_value(dates, cache)
    end

  end
end

