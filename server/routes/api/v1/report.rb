# frozen_string_literal: true

class Ampere
  route("report", "api/v1") do |r|
    r.get "centrali_tecnologia", String, String do |start_dt, end_dt|
      start_dt =  Time.parse(start_dt)
      end_dt = (Time.parse(end_dt) + (3600 * 24) - 1)
      Report.get_report(start_dt, end_dt, "tecnologia")
    end
    r.get "centrali_zona", String, String do |start_dt, end_dt|
      start_dt =  Time.parse(start_dt)
      end_dt = (Time.parse(end_dt) + (3600 * 24) - 1)
      Report.get_report(start_dt, end_dt, "zona")
    end
    r.get "centrali_giornaliero_tecnologia", String, String do |start_dt, end_dt|
      start_dt =  Time.parse(start_dt)
      end_dt = (Time.parse(end_dt) + (3600 * 24) - 1)
      Report.get_report(start_dt, end_dt, "tecnologia_giornaliero")
    end
    r.get "centrali_giornaliero_zona", String, String do |start_dt, end_dt|
      start_dt =  Time.parse(start_dt)
      end_dt = (Time.parse(end_dt) + (3600 * 24) - 1)
      Report.get_report(start_dt, end_dt, "zona_giornaliero")
    end
  end
end

