import React, { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";

interface DateRangePickerProps {
  value: { start: Date; end: Date };
  onChange: (range: { start: Date; end: Date }) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: value.start,
      endDate: value.end,
      key: "selection",
    },
  ]);

  const handleSelect = (ranges: any) => {
    setRange([ranges.selection]);
    onChange({
      start: ranges.selection.startDate,
      end: ranges.selection.endDate,
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <CalendarIcon className="h-4 w-4" />
        <span>
          {format(value.start, "MMM d, yyyy")} -{" "}
          {format(value.end, "MMM d, yyyy")}
        </span>
      </button>

      {showPicker && (
        <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <DateRange
            editableDateInputs={true}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            ranges={range}
            maxDate={new Date()}
          />
          <div className="flex justify-end p-2 border-t">
            <button
              onClick={() => setShowPicker(false)}
              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
