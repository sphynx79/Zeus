# frozen_string_literal: true

class Ampere
  
  route('report', 'api/v1') do |r|
    r.get "centrali", String, String do |start_dt, end_dt|
      start_dt = Date.parse(start_dt)
      end_dt = Date.parse(end_dt)
      report = Report.get_report(start_dt, end_dt) 
      Oj.dump(report, mode: :compat)
    end
    r.get "centrali_zona", String, String do |start_dt, end_dt|
      start_dt = Date.parse(start_dt)
      end_dt = Date.parse(end_dt)
      report = Report.get_report_zona(start_dt, end_dt) 
      Oj.dump(report, mode: :compat)
    end
  end
  
  # route('report_centrali', 'api/v1') do |r|
  #   r.on String, String do |start_dt, end_dt|
  #     start_dt = Date.parse(start_dt)
  #     end_dt = Date.parse(end_dt)
  #     report = Report.get_report(start_dt, end_dt) 
  #     Oj.dump(report, mode: :compat)
  #   end
  # end

end
