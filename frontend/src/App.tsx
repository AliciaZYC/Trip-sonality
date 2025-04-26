// src/App.tsx
import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./components/sidebar";
import { MapView } from "./components/map-view-backup";
import { ChatHeader } from "./components/chat-header";
// import Itinerary from "./components/itinerary";
import Itinerary, {
  placeholderItinerary,
  ItineraryDay,
} from "./components/itinerary";
import Select, { SingleValue } from "react-select";
import { FiShare2, FiCalendar } from "react-icons/fi";
import { createEvents, EventAttributes } from "ics";
// import { FaSignInAlt } from "react-icons/fa";
import WelcomePage from "./components/WelcomePage";
import ShareModal from "./components/ShareModal";

//
// ——— Types ———
//
type MBTI =
  | "INTJ"
  | "INTP"
  | "ENTJ"
  | "ENTP"
  | "INFJ"
  | "INFP"
  | "ENFJ"
  | "ENFP"
  | "ISTJ"
  | "ISFJ"
  | "ESTJ"
  | "ESFJ"
  | "ISTP"
  | "ISFP"
  | "ESTP"
  | "ESFP";

interface OptionType {
  value: MBTI;
  label: string;
}

interface BudgetOption {
  value: string;
  label: string;
}

//
// ——— Option Data ———
//
const mbtiOptions: OptionType[] = [
  { value: "INTJ", label: "INTJ" },
  { value: "INTP", label: "INTP" },
  { value: "ENTJ", label: "ENTJ" },
  { value: "ENTP", label: "ENTP" },
  { value: "INFJ", label: "INFJ" },
  { value: "INFP", label: "INFP" },
  { value: "ENFJ", label: "ENFJ" },
  { value: "ENFP", label: "ENFP" },
  { value: "ISTJ", label: "ISTJ" },
  { value: "ISFJ", label: "ISFJ" },
  { value: "ESTJ", label: "ESTJ" },
  { value: "ESFJ", label: "ESFJ" },
  { value: "ISTP", label: "ISTP" },
  { value: "ISFP", label: "ISFP" },
  { value: "ESTP", label: "ESTP" },
  { value: "ESFP", label: "ESFP" },
];

const budgetOptionsSelect: BudgetOption[] = [
  "500 USD",
  "1000 USD",
  "1500 USD",
  "2000 USD",
  "2500+ USD",
].map((b) => ({ value: b, label: b }));

//
// ——— App Component ———
//
export default function App() {
  const [themeInput, setThemeInput] = useState<string>("Movie");
  const [locationInput, setLocationInput] = useState<string>("Los Angeles, CA");
  const [datesInput, setDatesInput] = useState<string>("6 days");
  const [mbti, setMbti] = useState<MBTI>("INFJ");
  const [budget, setBudget] = useState<string>("1500 USD");
  const [fieldInput, setFieldInput] = useState<string>("");
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const [mapPanelWidth, setMapPanelWidth] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    const savedState = localStorage.getItem("showWelcome");
    return savedState ? JSON.parse(savedState) : true;
  });
  const [highlightedPlace, setHighlightedPlace] = useState<string | undefined>(
    undefined
  );
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const sidebarDraggingRef = useRef(false);
  const mapPanelDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // initialize mapPanelWidth
  useEffect(() => {
    if (containerRef.current) {
      const cw = containerRef.current.clientWidth;
      setMapPanelWidth(cw - 400 - 16);
    }
  }, [collapsed]);

  // dragging logic
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (sidebarDraggingRef.current && !collapsed) {
        setSidebarWidth((prev) =>
          Math.max(175, Math.min(prev + e.movementX, 300))
        );
      }
      if (mapPanelDraggingRef.current) {
        setMapPanelWidth((prev) => {
          const next = prev + e.movementX;
          const cw = containerRef.current?.clientWidth || 0;
          const maxW = cw - 400 - 16;
          return Math.max(300, Math.min(next, maxW));
        });
      }
    };
    const onMouseUp = () => {
      sidebarDraggingRef.current = false;
      mapPanelDraggingRef.current = false;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [collapsed]);

  const handleSidebarMouseDown = () => {
    sidebarDraggingRef.current = true;
  };
  const handleMapPanelMouseDown = () => {
    mapPanelDraggingRef.current = true;
  };

  const handleMbtiChange = (opt: SingleValue<OptionType>) => {
    if (opt) setMbti(opt.value);
  };
  const handleBudgetChange = (opt: SingleValue<BudgetOption>) => {
    if (opt) setBudget(opt.value);
  };

  const handleSend = () => {
    const payload = {
      theme: themeInput,
      location: locationInput,
      dates: datesInput,
      field: fieldInput,
      mbti,
      budget,
    };
    // fetch("/api/trip", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // })
    //   .then((res) => res.json())
    //   .then((data) => console.log("Response:", data))
    //   .catch((err) => console.error(err));
    console.log("Payload to send:", payload);
  };

  // Save welcome state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("showWelcome", JSON.stringify(showWelcome));
  }, [showWelcome]);

  // Handler for "New Chat" button in sidebar
  const handleNewChat = () => {
    setShowWelcome(true);
  };

  // Handler for Share button
  const handleShareClick = () => {
    setShareModalOpen(true);
  };
  type ItineraryDay = (typeof placeholderItinerary)[number];
  const handleExportCalendar = () => {
    const tripStartDate = new Date();

    // 创建 ICS 事件数组
    const events: EventAttributes[] = placeholderItinerary.flatMap(
      (day: ItineraryDay, idx: number) => {
        const dayDate = new Date(tripStartDate);
        dayDate.setDate(tripStartDate.getDate() + idx);

        // 返回固定 5 元组 [year, month, day, hour, minute]
        const toYMDHM = (
          timeStr: string
        ): [number, number, number, number, number] => {
          const [hm, suffix] = timeStr.split(" ");
          let [h, m] = hm.split(":").map(Number);
          if (suffix === "PM" && h < 12) h += 12;
          if (suffix === "AM" && h === 12) h = 0;
          return [
            dayDate.getFullYear(),
            dayDate.getMonth() + 1,
            dayDate.getDate(),
            h,
            m,
          ];
        };

        // "吃饭" 事件
        const foodStart = toYMDHM(day.food.time);
        const foodEvent: EventAttributes = {
          title: `🍴 ${day.food.place}`,
          start: foodStart,
          duration: { hours: 1 },
          description: `Cost: ${day.food.cost}`,
          location: day.food.place,
        };

        // 景点活动事件
        const activityEvents = day.activities.map((act) => {
          // 提取前两部分生成 start 元组
          const timePart = `${act.time.split(" ")[0]} ${
            act.time.split(" ")[1]
          }`;
          const [year, month, date, startH, startM] = toYMDHM(timePart);
          const hoursMatch = act.time.match(/\((\d+)h\)/);
          const durHours = hoursMatch ? Number(hoursMatch[1]) : 1;
          return {
            title: `🎬 ${act.place}`,
            start: [year, month, date, startH, startM],
            duration: { hours: durHours },
            description: `Cost: ${act.cost}`,
            location: act.place,
          } as EventAttributes;
        });

        return [foodEvent, ...activityEvents];
      }
    );

    // 生成 .ics 并触发下载
    createEvents(events, (error, value) => {
      if (error) {
        console.error(error);
        return;
      }
      const blob = new Blob([value!], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "trip-itinerary.ics";
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="flex h-screen relative">
      {/* Sidebar - Always visible regardless of welcome page */}
      {!collapsed && (
        <Sidebar
          width={sidebarWidth}
          onToggle={() => setCollapsed(true)}
          onNewChat={handleNewChat}
        />
      )}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="absolute top-4 left-4 p-2 bg-white border border-gray-200 rounded z-50"
        >
          ☰
        </button>
      )}
      {!collapsed && (
        <div
          onMouseDown={handleSidebarMouseDown}
          className="cursor-ew-resize bg-transparent"
          style={{ width: "4px" }}
        />
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

      {/* Main Content - Either welcome page or main app */}
      <div
        className="flex-1 flex flex-col font-sans bg-white"
        ref={containerRef}
      >
        {showWelcome ? (
          <div className="flex-1 flex justify-center">
            <WelcomePage onStart={() => setShowWelcome(false)} />
          </div>
        ) : (
          <>
            {/* Top Buttons with Divider */}
            <div className="flex flex-col">
              <div className="flex justify-end p-3 gap-2">
                <button
                  onClick={handleShareClick}
                  className="font-georgia px-4 py-2 border border-gray-300 rounded-full flex items-center gap-2 text-gray-500 hover:bg-gray-100 transition"
                >
                  {/* @ts-ignore */}
                  <FiShare2 size={16} />
                  <span>Share</span>
                </button>

                <button
                  onClick={handleExportCalendar}
                  className="font-georgia px-4 py-2 border border-gray-300 rounded-full flex items-center gap-2 text-gray-500 hover:bg-gray-100 transition"
                >
                  {/* @ts-ignore */}
                  <FiCalendar size={16} />
                  <span>Add to Calendar</span>
                </button>
              </div>
              <div className="border-b border-gray-200 mx-4 mb-1"></div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 flex gap-4">
              {/* Left Panel */}
              <div
                className="flex flex-col"
                style={{ flex: mapPanelWidth ? `0 0 ${mapPanelWidth}px` : "1" }}
              >
                <ChatHeader
                  theme={themeInput}
                  location={locationInput}
                  dates={datesInput}
                  onThemeChange={setThemeInput}
                  onLocationChange={setLocationInput}
                  onDatesChange={setDatesInput}
                />
                <div className="panel rounded-custom overflow-hidden flex-1 mt-1">
                  <MapView highlightedPlace={highlightedPlace} />
                </div>
              </div>

              {/* Map Resize Divider */}
              <div
                onMouseDown={handleMapPanelMouseDown}
                className="cursor-ew-resize relative"
                style={{ width: "2px" }}
              >
                <div className="absolute top-0 bottom-0 left-1 w-1 hover:bg-gray-300 hover:w-2 transition-all h-full rounded" />
              </div>

              {/* Right Panel */}
              <div className="flex flex-col gap-4 flex-1">
                {/* Itinerary */}
                <Itinerary onPlaceHover={setHighlightedPlace} />

                {/* Input Section */}
                <div className="panel rounded-custom">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter your Interests and Dislikes..."
                      value={fieldInput}
                      onChange={(e) => setFieldInput(e.target.value)}
                      className="w-full p-4 pr-10 border border-gray-200 rounded-lg text-sm font-georgia "
                    />
                    <button
                      onClick={handleSend}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {/* paper-plane arrow SVG */}
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22 2L11 13" />
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between space-x-4">
                    {/* MBTI Select */}
                    <div className="rounded-full border border-gray-300 flex items-center px-3 shadow-sm hover:border-gray-400 transition-colors">
                      <span className="text-xs text-gray-600 font-medium font-georgia ">
                        MBTI:
                      </span>
                      <Select<OptionType, false>
                        options={mbtiOptions}
                        value={
                          mbtiOptions.find((o) => o.value === mbti) || null
                        }
                        onChange={handleMbtiChange}
                        isSearchable={false}
                        menuPlacement="auto" // try "top" if you always want it above
                        menuPortalTarget={document.body}
                        styles={{
                          control: (base) => ({
                            ...base,
                            backgroundColor: "transparent",
                            border: "none",
                            boxShadow: "none",
                            minHeight: "auto",
                            fontSize: "0.65rem", // even smaller
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: "#ef4444", // only selected = red
                          }),
                          option: (base, state) => ({
                            ...base,
                            color: "black", // dropdown items = black
                            backgroundColor: state.isFocused
                              ? "#f3f4f6"
                              : "white",
                            cursor: "pointer",
                            fontSize: "0.65rem",
                          }),
                          dropdownIndicator: (base) => ({
                            ...base,
                            color: "black",
                            padding: 2,
                          }),
                          indicatorSeparator: () => ({ display: "none" }),
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999, // make sure it floats above everything
                          }),
                        }}
                        className="w-auto text-xs font-georgia "
                      />
                    </div>

                    {/* Budget Select */}
                    <div className="rounded-full border border-gray-300 flex items-center px-3 shadow-sm hover:border-gray-400 transition-colors">
                      <span className="text-xs text-gray-600 font-medium font-georgia ">
                        Budget:
                      </span>
                      <Select<BudgetOption, false>
                        options={budgetOptionsSelect}
                        value={
                          budgetOptionsSelect.find((o) => o.value === budget) ||
                          null
                        }
                        onChange={handleBudgetChange}
                        isSearchable={false}
                        menuPlacement="auto" // try "top" if you always want it above
                        menuPortalTarget={document.body}
                        styles={{
                          control: (base) => ({
                            ...base,
                            backgroundColor: "transparent",
                            border: "none",
                            boxShadow: "none",
                            minHeight: "auto",
                            fontSize: "0.65rem",
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: "#ef4444",
                          }),
                          option: (base, state) => ({
                            ...base,
                            color: "black",
                            backgroundColor: state.isFocused
                              ? "#f3f4f6"
                              : "white",
                            cursor: "pointer",
                            fontSize: "0.65rem",
                          }),
                          dropdownIndicator: (base) => ({
                            ...base,
                            color: "black",
                            padding: 2,
                          }),
                          indicatorSeparator: () => ({ display: "none" }),
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999, // make sure it floats above everything
                          }),
                        }}
                        className="w-auto text-xs font-georgia "
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-400 py-1">
              © Tripsonality Team, 2025
            </div>
          </>
        )}
      </div>
    </div>
  );
}
