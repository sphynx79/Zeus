# frozen_string_literal: true

class Ampere
  route("reports", "api/v1") do |r|
    r.on String, String do |start_dt, end_dt|
      r.halt(403, {'error'=>"Start date non corretta"}) if self.class.data_is_correct(start_dt)
      r.halt(403, {'error'=>"End date non corretta"}) if self.class.data_is_correct(end_dt)
      start_dt = Time.parse(start_dt)
      end_dt = (Time.parse(end_dt) + (3600 * 24) - 1)
      r.is_exactly "centrali_tecnologia" do
        Report.get_report(start_dt, end_dt, "tecnologia")
      end
      r.is_exactly "centrali_zona" do
        Report.get_report(start_dt, end_dt, "zona")
      end
      r.is_exactly "centrali_giornaliero_tecnologia" do
        Report.get_report(start_dt, end_dt, "tecnologia_giornaliero")
      end
      r.is_exactly "centrali_giornaliero_zona" do
        Report.get_report(start_dt, end_dt, "zona_giornaliero")
      end
    
    end
  end

  # def self.data_is_correct(data)
  #   (/(^([0-2][0-9]|(3)[0-1])(-)(((0)[0-9])|((1)[0-2]))(-)\d{4}$)|(([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])))/ =~ data).nil?
  # end

end

