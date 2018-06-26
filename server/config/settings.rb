# frozen_string_literal: true

class Settings < Settingslogic
  source "#{APP_ROOT}/config/settings.yml"
  namespace ENV['RACK_ENV']
  load!
end

