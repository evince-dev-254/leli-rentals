"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Gift } from "lucide-react"

export function PromoBanner() {
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 23,
    minutes: 58,
    seconds: 57,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) {
          seconds = 59
          minutes--
        }
        if (minutes < 0) {
          minutes = 59
          hours--
        }
        if (hours < 0) {
          hours = 23
          days--
        }
        if (days < 0) {
          return { days: 0, hours: 0, minutes: 0, seconds: 0 }
        }
        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const copyCode = () => {
    navigator.clipboard.writeText("FESTIVE2025")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/90 via-primary to-accent/80 p-8 md:p-12">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Content */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <Gift className="h-6 w-6 text-primary-foreground" />
                <span className="text-primary-foreground/90 font-medium">Festive Season Mega Sale</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Celebrate with up to 30% OFF
              </h2>
              <p className="text-primary-foreground/80 max-w-md">
                Get amazing discounts on selected rentals this festive season. Limited time offer!
              </p>
            </div>

            {/* Promo Code & Timer */}
            <div className="flex flex-col items-center gap-6">
              {/* Code */}
              <div className="glass rounded-xl p-4 flex items-center gap-4">
                <div>
                  <p className="text-xs text-primary-foreground/70 mb-1">Use Code:</p>
                  <p className="text-2xl font-bold text-primary-foreground tracking-wider">FESTIVE2025</p>
                </div>
                <Button variant="secondary" size="icon" onClick={copyCode} className="shrink-0">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              {/* Timer */}
              <div className="flex gap-3">
                {[
                  { value: timeLeft.days, label: "Days" },
                  { value: timeLeft.hours, label: "Hours" },
                  { value: timeLeft.minutes, label: "Min" },
                  { value: timeLeft.seconds, label: "Sec" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="glass rounded-lg w-14 h-14 flex items-center justify-center">
                      <span className="text-xl font-bold text-primary-foreground">
                        {String(item.value).padStart(2, "0")}
                      </span>
                    </div>
                    <span className="text-xs text-primary-foreground/70 mt-1">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
