# frozen_string_literal: true

class Ampere
  
  route('remits', 'api/v1') do |r|
    
      r.is 'centrali', String do |data|
        # r.halt(403, {'Content-Type'=>'text/html'}, 'La data non è corretta') if self.class.data_is_correct(data)
        data = Time.parse(data)
        utc_offset = data.utc_offset
        start_dt = (data + utc_offset).utc
        end_dt = (data + utc_offset + (3600 * 24) - 1).utc
        Remit.get_remit(start_dt, end_dt, "centrali")
      end

      r.on 'linee', String  do |data|
        # r.halt(403, {'Content-Type'=>'text/html'}, 'La data non è corretta') if self.class.data_is_correct(data)
        data = Time.parse(data)
        utc_offset = data.utc_offset
        start_dt = (data + utc_offset).utc
        end_dt = (data + utc_offset + (3600 * 24) - 1).utc
        # start_dt = Date.parse(data)
        # end_dt = Date.parse(data)
        r.is '380' do
          Remit.get_remit(start_dt, end_dt, "380")
        end
        r.is '220' do
          Remit.get_remit(start_dt, end_dt, "220")
        end
      end
      # r.redirect '/'
      # r.halt(403, {'Content-Type'=>'text/html'}, 'Route not fount')

  end

  def self.data_is_correct(data)
      (/^([0-2][0-9]|(3)[0-1])(-)(((0)[0-9])|((1)[0-2]))(-)\d{4}$/ =~ data).nil?
  end
end
