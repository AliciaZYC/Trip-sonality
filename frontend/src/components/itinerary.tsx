import React, { useState, useRef, useEffect } from "react";

// 6-day placeholder itinerary for a Los Angeles movie-themed trip
export const placeholderItinerary = [
  {
    day: "Day 1",
    food: { time: "12:00 PM", place: "Grand Central Market", cost: "$25" },
    activities: [
      {
        time: "2:00 PM (2h)",
        place: "Hollywood Walk of Fame",
        cost: "$0",
      },
      { time: "5:00 PM (2h)", place: "TCL Chinese Theatre", cost: "$20" },
    ],
    summary:
      "Kick off your LA movie-themed trip with tasty street food and a stroll among the stars.",
  },
  {
    day: "Day 2",
    food: { time: "1:00 PM", place: "In-N-Out Burger", cost: "$15" },
    activities: [
      { time: "2:30 PM (2h)", place: "Griffith Observatory", cost: "$15" },
      { time: "6:00 PM (2h)", place: "Hollywood Bowl Tour", cost: "$30" },
    ],
    summary:
      "Enjoy a classic California burger, then catch panoramic city views and a behind-the-scenes music venue tour.",
  },
  {
    day: "Day 3",
    food: { time: "11:30 AM", place: "Grandma's Café", cost: "$20" },
    activities: [
      {
        time: "1:00 PM (2h)",
        place: "Universal Studios Backlot Tour",
        cost: "$30",
      },
      { time: "4:00 PM (2h)", place: "CityWalk Exploration", cost: "$0" },
    ],
    summary:
      "Taste homey brunch fare before exploring iconic movie sets and entertainment district vibes.",
  },
  {
    day: "Day 4",
    food: { time: "12:00 PM", place: "Shake Shack", cost: "$18" },
    activities: [
      { time: "1:30 PM (2h)", place: "Getty Center Tour", cost: "$20" },
      {
        time: "5:00 PM (2h)",
        place: "Sunset Boulevard Drive",
        cost: "$0",
      },
    ],
    summary:
      "Grab a casual shake, then enjoy art, architecture, and a scenic drive into movie history.",
  },
  {
    day: "Day 5",
    food: { time: "1:00 PM", place: "Venice Beach Snack Stand", cost: "$12" },
    activities: [
      {
        time: "2:00 PM (2h)",
        place: "Venice Beach Skateboarders",
        cost: "$0",
      },
      { time: "5:00 PM (2h)", place: "Santa Monica Pier", cost: "$10" },
    ],
    summary:
      "Soak up beach culture with tasty snacks, street performances, and a seaside amusement experience.",
  },
  {
    day: "Day 6",
    food: { time: "1:00 PM", place: "The Grove Food Court", cost: "$20" },
    activities: [
      {
        time: "2:30 PM (2h)",
        place: "Warner Bros. Studio Tour",
        cost: "$50",
      },
      { time: "5:00 PM (2h)", place: "Downtown Art District", cost: "$0" },
    ],
    summary:
      "End with a gourmet food hall meal and an immersive peek behind your favorite films, capped by local art browsing.",
  },
] as const;

// 导出 ItineraryDay 类型，方便其他组件使用
export type ItineraryDay = (typeof placeholderItinerary)[number];

interface ItineraryProps {
  onPlaceHover: (place: string | undefined) => void;
}

export default function Itinerary({ onPlaceHover }: ItineraryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const day = placeholderItinerary[currentIndex];

  // Track mouse movement for swiping
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<"none" | "left" | "right">("none");
  const [touchStartX, setTouchStartX] = useState(0);
  const [activePlace, setActivePlace] = useState<string | undefined>(undefined);

  // Function to handle mouse enter on place names
  const handlePlaceHover = (place: string) => {
    setActivePlace(place);
    onPlaceHover(place);
  };

  // We're intentionally not clearing the hover state when mouse leaves
  // This keeps the marker visible until another place is hovered
  const handlePlaceLeave = () => {
    // We no longer clear the highlighted place
    // onPlaceHover(undefined);
  };

  // Clear highlighted place when changing days
  useEffect(() => {
    setActivePlace(undefined);
    onPlaceHover(undefined);
  }, [currentIndex, onPlaceHover]);

  // Move to next or previous day
  const moveToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setDirection("right");
    }
  };

  const moveToNext = () => {
    if (currentIndex < placeholderItinerary.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setDirection("left");
    }
  };

  // Mouse events for swipe
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setOffsetX(0);
    setDirection("none");
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const currentX = e.clientX;
    const diff = currentX - startX;
    setOffsetX(diff);

    if (diff > 50) {
      setDirection("right");
    } else if (diff < -50) {
      setDirection("left");
    } else {
      setDirection("none");
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    if (direction === "left") {
      moveToNext();
    } else if (direction === "right") {
      moveToPrev();
    }

    setIsDragging(false);
    setOffsetX(0);
  };

  // Touch events for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setDirection("none");
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchCurrentX = e.touches[0].clientX;
    const diff = touchCurrentX - touchStartX;

    if (diff > 50) {
      setDirection("right");
    } else if (diff < -50) {
      setDirection("left");
    } else {
      setDirection("none");
    }
  };

  const handleTouchEnd = () => {
    if (direction === "left") {
      moveToNext();
    } else if (direction === "right") {
      moveToPrev();
    }
  };

  // Reset animation classes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDirection("none");
    }, 300);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Get animation class
  const getAnimationClass = () => {
    if (direction === "left") return "animate-slide-left";
    if (direction === "right") return "animate-slide-right";
    return "";
  };

  return (
    <div
      className="panel rounded-custom flex-1 overflow-hidden p-4"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      {/* Header */}
      <h2 className="text-center font-georgia font-medium text-lg mb-1">
        {placeholderItinerary.length} Days Itinerary – Los Angeles Movie Trip
      </h2>
      <div className="border-b border-gray-200 w-3/4 mx-auto mb-3"></div>
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="absolute inset-0 translate-x-2 translate-y-2 bg-gray-200 rounded-md"></div>
          <div className="relative py-1 px-6 border-2 border-black bg-white rounded-md font-georgia font-medium z-10">
            {day.day}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div
        className={`space-y-4 transition-transform duration-300 ${getAnimationClass()}`}
      >
        {/* Food */}
        <div className="border border-gray-200 p-4 rounded-lg font-georgia">
          <div className="font-medium text-lg mb-2">Food</div>
          <div className="flex items-center">
            <div className="w-24 text-sm text-gray-500">{day.food.time}</div>
            <div
              className={`flex-1 text-sm font-medium cursor-pointer transition-colors ${
                activePlace === day.food.place
                  ? "text-red-500"
                  : "text-gray-900 hover:text-red-500"
              }`}
              onMouseEnter={() => handlePlaceHover(day.food.place)}
              onMouseLeave={handlePlaceLeave}
            >
              {day.food.place}
            </div>
            <div className="w-5 text-sm text-right text-gray-400">
              {day.food.cost}
            </div>
          </div>
        </div>

        {/* Activities */}
        <div className="border border-gray-200 p-4 rounded-lg font-georgia ">
          <div className="font-medium text-lg mb-2">Activities</div>
          <div className="space-y-2">
            {day.activities.map((act) => (
              <div key={act.place} className="flex items-center">
                <div className="w-24 text-sm text-gray-500">{act.time}</div>
                <div
                  className={`flex-1 text-sm font-medium cursor-pointer transition-colors ${
                    activePlace === act.place
                      ? "text-red-500"
                      : "text-gray-900 hover:text-red-500"
                  }`}
                  onMouseEnter={() => handlePlaceHover(act.place)}
                  onMouseLeave={handlePlaceLeave}
                >
                  {act.place}
                </div>
                <div className="w-5 text-sm text-right text-gray-400">
                  {act.cost}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="border border-gray-200 p-4 rounded-lg font-georgia ">
          <div className="font-medium text-lg mb-2 text-red-800">
            Summary of the Day
          </div>
          <p className="text-sm italic text-gray-700">"{day.summary}"</p>
        </div>
      </div>

      {/* Pagination with left/right indicators */}
      <div className="flex justify-center items-center mt-6 select-none">
        <div
          className={`mr-4 ${
            currentIndex === 0
              ? "text-gray-300"
              : "text-gray-600 cursor-pointer"
          }`}
          onClick={currentIndex > 0 ? moveToPrev : undefined}
        >
          ←
        </div>
        {placeholderItinerary.map((_, idx) => (
          <span
            key={idx}
            className={`w-2 h-2 rounded-full mx-1 cursor-pointer ${
              idx === currentIndex ? "bg-black" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
        <div
          className={`ml-4 ${
            currentIndex === placeholderItinerary.length - 1
              ? "text-gray-300"
              : "text-gray-600 cursor-pointer"
          }`}
          onClick={
            currentIndex < placeholderItinerary.length - 1
              ? moveToNext
              : undefined
          }
        >
          →
        </div>
      </div>
    </div>
  );
}
