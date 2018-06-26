# frozen_string_literal: true

require_relative './config/boot'

run(Ampere.development? ? Unreloader : Ampere.freeze.app)
