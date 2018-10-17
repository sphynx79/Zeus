# frozen_string_literal: true

require './app.rb'

run(Ampere.development? ? Unreloader : Ampere.freeze.app)
