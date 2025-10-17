"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, AlertCircle, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export function HeroSearch() {
  const router = useRouter();
  const [location, setLocation] = React.useState("");
  const [range, setRange] = React.useState<
    { from?: Date; to?: Date } | undefined
  >(undefined);
  const [adults, setAdults] = React.useState<number>(0);
  const [children, setChildren] = React.useState<number>(0);
  const [infants, setInfants] = React.useState<number>(0);
  const [error, setError] = React.useState<string>("");

  const [datesOpen, setDatesOpen] = React.useState(false);
  const [activeField, setActiveField] = React.useState<"in" | "out">("in");
  const [hoverDate, setHoverDate] = React.useState<Date | undefined>(undefined);

  const guestsTotal = adults + children;

  const formatLabel = (d?: Date) =>
    d
      ? d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
      : "Add dates";

  const formatDateForURL = (d?: Date) =>
    d ? d.toISOString().slice(0, 10) : "";

  // Determinar qué fecha está seleccionada actualmente para el Calendar
  const selectedDate = activeField === "in" ? range?.from : range?.to;

  const getNights = () => {
    const start = range?.from;
    const end = range?.to || (activeField === "out" ? hoverDate : undefined);
    if (start && end) {
      const diffMs = end.getTime() - start.getTime();
      const nights = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return nights > 0 ? nights : 0;
    }
    return 0;
  };

  const validate = (): boolean => {
    setError("");
    if (!range?.from || !range?.to) {
      setError("Please select both check-in and check-out dates.");
      return false;
    }
    if (range.from && range.to) {
      if (isNaN(range.from.getTime()) || isNaN(range.to.getTime())) {
        setError("Invalid dates selected.");
        return false;
      }
      if (!(range.from < range.to)) {
        setError("Check-out must be after check-in.");
        return false;
      }
    }
    if (guestsTotal < 0) {
      setError("Guests must be at least 0.");
      return false;
    }
    return true;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (range?.from) params.set("checkIn", formatDateForURL(range.from));
    if (range?.to) params.set("checkOut", formatDateForURL(range.to));
    if (guestsTotal > 0) params.set("guests", String(guestsTotal));
    router.push(`/listings?${params.toString()}`);
  };

  const CounterRow = ({
    label,
    value,
    setValue,
    subtitle,
  }: {
    label: string;
    value: number;
    setValue: (n: number) => void;
    subtitle?: string;
  }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {subtitle && (
          <div className="text-xs text-muted-foreground">{subtitle}</div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-8 w-8 rounded-full"
          onClick={() => setValue(Math.max(0, value - 1))}
          aria-label={`Decrease ${label}`}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <div className="w-6 text-center text-sm">{value}</div>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-8 w-8 rounded-full"
          onClick={() => setValue(value + 1)}
          aria-label={`Increase ${label}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  // Modifiers para mostrar el rango visualmente
  const rangeStartMatcher = (date: Date) => {
    if (!range?.from) return false;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const f = new Date(range.from);
    f.setHours(0, 0, 0, 0);
    return d.getTime() === f.getTime();
  };

  const rangeEndMatcher = (date: Date) => {
    if (!range?.to) return false;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const t = new Date(range.to);
    t.setHours(0, 0, 0, 0);
    return d.getTime() === t.getTime();
  };

  const rangeMiddleMatcher = (date: Date) => {
    const start = range?.from;
    const end = range?.to || (activeField === "out" ? hoverDate : undefined);
    if (!start || !end) return false;
    const s = new Date(start);
    s.setHours(0, 0, 0, 0);
    const e = new Date(end);
    e.setHours(0, 0, 0, 0);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const sTime = s.getTime();
    const eTime = e.getTime();
    const dTime = d.getTime();
    return dTime > sTime && dTime < eTime;
  };

  // Handle date selection manually for complete control
  const handleDateSelect = React.useCallback(
    (selectedDate: Date | undefined) => {
      if (!selectedDate) return;

      // Normalizar la fecha a medianoche
      const normalizedDate = new Date(selectedDate);
      normalizedDate.setHours(0, 0, 0, 0);

      if (activeField === "in") {
        // Seleccionando check-in - siempre establecer como nueva fecha de inicio
        setRange({ from: normalizedDate, to: undefined });
        setActiveField("out");
      } else if (activeField === "out") {
        // Seleccionando check-out
        if (range?.from) {
          const fromDate = new Date(range.from);
          fromDate.setHours(0, 0, 0, 0);

          if (normalizedDate > fromDate) {
            // Fecha válida, establecer check-out
            setRange({ from: range.from, to: normalizedDate });
            setTimeout(() => {
              setDatesOpen(false);
              setActiveField("in");
            }, 100);
          } else {
            // Fecha anterior o igual a check-in, reiniciar selección
            setRange({ from: normalizedDate, to: undefined });
            setActiveField("out");
          }
        } else {
          // No hay check-in (no debería pasar), establecer como check-in
          setRange({ from: normalizedDate, to: undefined });
        }
      }
    },
    [activeField, range]
  );

  const handleCheckInClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveField("in");
    setDatesOpen(true);
  }, []);

  const handleCheckOutClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveField("out");
    setDatesOpen(true);
  }, []);

  const handleClearDates = React.useCallback(() => {
    setRange(undefined);
    setActiveField("in");
    setHoverDate(undefined);
  }, []);

  const handleDoneDates = React.useCallback(() => {
    setDatesOpen(false);
  }, []);

  const handleDayMouseEnter = React.useCallback((day: Date) => {
    setHoverDate(day);
  }, []);

  const handleDayMouseLeave = React.useCallback(() => {
    setHoverDate(undefined);
  }, []);

  return (
    <Card className="mx-auto w-full max-w-4xl rounded-full border shadow-md">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-0 p-1 md:flex-row md:items-center md:gap-0"
      >
        {/* Where */}
        <div className="flex flex-1 items-start gap-1 rounded-full px-3 py-1 md:rounded-none md:rounded-l-full">
          <div className="flex w-full flex-col">
            <div className="text-xs leading-none font-bold text-foreground">
              Where
            </div>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search destinations"
              className="border-0 p-0 h-8 leading-none focus-visible:ring-0"
              aria-label="Where"
            />
          </div>
        </div>

        <div className="hidden h-4 w-px bg-border md:block" />

        {/* Dates (two segments) */}
        <div className="flex flex-1 items-center gap-1 rounded-full px-2 py-1 md:rounded-none">
          <Popover open={datesOpen} onOpenChange={setDatesOpen}>
            <div className="flex w-full items-center justify-between rounded-full">
              <button
                type="button"
                onClick={handleCheckInClick}
                className={`flex flex-1 items-center gap-1 rounded-full px-3 py-1 text-left transition-all hover:bg-accent/50 ${
                  activeField === "in" && datesOpen ? "ring-2 ring-ring" : ""
                }`}
              >
                <div className="flex flex-col items-start leading-none">
                  <div className="text-xs leading-none font-bold text-foreground">
                    Check in
                  </div>
                  <div className="text-xs leading-none">
                    {formatLabel(range?.from)}
                  </div>
                </div>
              </button>
              <div className="hidden h-4 w-px bg-border md:block" />
              <button
                type="button"
                onClick={handleCheckOutClick}
                className={`flex flex-1 items-center gap-1 rounded-full px-3 py-1 text-left transition-all hover:bg-accent/50 ${
                  activeField === "out" && datesOpen ? "ring-2 ring-ring" : ""
                }`}
              >
                <div className="flex flex-col items-start leading-none">
                  <div className="text-xs leading-none font-bold text-foreground">
                    Check out
                  </div>
                  <div className="text-xs leading-none">
                    {formatLabel(range?.to)}
                  </div>
                </div>
              </button>
            </div>
            <PopoverTrigger asChild>
              <div className="sr-only" />
            </PopoverTrigger>
            <PopoverContent align="center" className="w-auto p-3">
              <div className="flex flex-col gap-3">
                <Calendar
                  mode="single"
                  numberOfMonths={2}
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={{ before: new Date() }}
                  onDayMouseEnter={handleDayMouseEnter}
                  onDayMouseLeave={handleDayMouseLeave}
                  modifiers={{
                    range_start: (date) => rangeStartMatcher(date),
                    range_end: (date) => rangeEndMatcher(date),
                    range_middle: (date) => rangeMiddleMatcher(date),
                  }}
                  modifiersClassNames={{
                    range_start:
                      "bg-primary text-primary-foreground rounded-l-md",
                    range_end:
                      "bg-primary text-primary-foreground rounded-r-md",
                    range_middle:
                      "bg-accent/60 text-accent-foreground rounded-none",
                  }}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearDates}
                  >
                    Clear
                  </Button>
                  <div className="flex-1 text-center">
                    {getNights() > 0 && <span>{getNights()} nights</span>}
                  </div>
                  <Button type="button" size="sm" onClick={handleDoneDates}>
                    Done
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="hidden h-4 w-px bg-border md:block" />

        {/* Who */}
        <div className="flex items-center gap-1 rounded-full px-2 py-1 md:rounded-none md:rounded-r-full">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="rounded-full px-3 h-8">
                <div className="flex flex-col items-start leading-none">
                  <span className="text-xs leading-none font-bold text-foreground">
                    Who
                  </span>
                  <span className="text-xs leading-none">
                    {guestsTotal > 0 || infants > 0
                      ? `${guestsTotal || 0} guests${
                          infants ? `, ${infants} infants` : ""
                        }`
                      : "Add guests"}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-3">
              <CounterRow
                label="Adults"
                value={adults}
                setValue={setAdults}
                subtitle="Ages 13+"
              />
              <CounterRow
                label="Children"
                value={children}
                setValue={setChildren}
                subtitle="Ages 2–12"
              />
              <CounterRow
                label="Infants"
                value={infants}
                setValue={setInfants}
                subtitle="Under 2"
              />
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAdults(0);
                    setChildren(0);
                    setInfants(0);
                  }}
                >
                  Clear
                </Button>
                <div>Infants don’t count toward the number of guests.</div>
                <Button type="button" size="sm" onClick={onSubmit}>
                  Done
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            type="submit"
            size="icon"
            className="ml-1 h-8 w-8 rounded-full"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>
      {error && (
        <div className="px-6 pb-2 text-xs text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </div>
      )}
    </Card>
  );
}
