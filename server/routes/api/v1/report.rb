# frozen_string_literal: true

class Ampere
  
  route('report', 'api/v1') do |r|
    r.get "centrali", String, String do |start_dt, end_dt|
      
      start_dt = Time.parse(start_dt)
      utc_offset_start_dt = start_dt.utc_offset
      end_dt = Time.parse(end_dt)
      utc_offset_end_dt = end_dt.utc_offset

      start_dt = (start_dt + utc_offset_start_dt).utc
      end_dt = (end_dt + utc_offset_end_dt + (3600 * 24) - 1).utc
      Report.get_report(start_dt, end_dt)
    end
    # r.get "centrali_zona", String, String do |start_dt, end_dt|
    #   start_dt = (Time.parse(start_dt) + UTC_OFFSET).utc
    #   end_dt = (Time.parse(end_dt) + UTC_OFFSET + (3600 * 24) - 1).utc
    #   report = Report.get_report(start_dt, end_dt, "zona") 
    #   Oj.dump(report, mode: :compat)
    # end
    # r.get "centrali_giornaliero_tecnologia", String, String do |start_dt, end_dt|
    #   start_dt = (Time.parse(start_dt) + UTC_OFFSET).utc
    #   end_dt = (Time.parse(end_dt) + UTC_OFFSET + (3600 * 24) - 1).utc
    #   report = Report.get_report(start_dt, end_dt, "tecnologia_giornaliero") 
    #   Oj.dump(report, mode: :compat)
    # end
    # r.get "centrali_giornaliero_zona", String, String do |start_dt, end_dt|
    #   start_dt = (Time.parse(start_dt) + UTC_OFFSET).utc
    #   end_dt = (Time.parse(end_dt) + UTC_OFFSET + (3600 * 24) - 1).utc
    #   report = Report.get_report(start_dt, end_dt, "zona_giornaliero") 
    #   Oj.dump(report, mode: :compat)
    # end
  end

end
