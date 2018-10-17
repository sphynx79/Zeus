# frozen_string_literal: true

class Ampere
  route("remits", "api/v1") do |r|
    r.on String do |data|
      r.halt(403, {'error'=>"Data non corretta"}) if self.class.data_is_correct(data)
      data = Time.parse(data)
      utc_offset = data.utc_offset
      start_dt = (data + utc_offset).utc
      end_dt = (data + utc_offset + (3600 * 24) - 1).utc
      r.is_exactly "centrali" do |data|
        Remit.get_remit(start_dt, end_dt, "centrali")
      end
      r.on "linee", String do |volt|
        r.halt(403, {'error'=>"Volt selezionato non corretto"}) if (/^(380|220)$/ =~ volt).nil? 
        Remit.get_remit(start_dt, end_dt, volt)
      end

    end

  end
end

