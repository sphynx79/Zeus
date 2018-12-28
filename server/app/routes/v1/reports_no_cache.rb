# frozen_string_literal: true

V1::Api.route("reports_no_cache") do |r|
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
    p remaining_path

    # daily tecnologia
    r.is_exactly "centrali_tecnologia_daily" do
      json(Report.get_report(start_dt, end_dt, remaining_path))
    end

    # daily zona
    r.is_exactly "centrali_zona_daily" do
      json(Report.get_report(start_dt, end_dt, remaining_path))
    end

    # hourly tecnologia
    r.is_exactly "centrali_tecnologia_hourly" do
      json(Report.get_report(start_dt, end_dt, remaining_path))
    end

    # hourly zona
    r.is_exactly "centrali_zona_hourly" do
      json(Report.get_report(start_dt, end_dt, remaining_path))
    end

  end
end

