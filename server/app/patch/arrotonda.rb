#!/usr/bin/env ruby
# Encoding: utf-8
# warn_indent: true
# frozen_string_literal: true

class Time
  def arrotonda(sec = 1)
    down = self - (to_i % sec)
    up = down + sec

    difference_down = self - down
    difference_up = up - self

    if difference_down < difference_up
      return down
    else
      return up
    end
  end
end

