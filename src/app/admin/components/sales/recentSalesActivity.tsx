import React from "react";
import { SalesActivity } from "@/lib/types/sales.type";

const RecentActivity: React.FC<{ activities: SalesActivity[] }> = ({
  activities,
}) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
    <div className="space-y-4">
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  </div>
);

const ActivityItem: React.FC<{ activity: SalesActivity }> = ({ activity }) => {
  const getIcon = () => {
    switch (activity.type) {
      case "sale":
        return "💰";
      case "lead":
        return "📞";
      case "follow-up":
        return "🔄";
      case "test-drive":
        return "🚗";
      default:
        return "⚪";
    }
  };

  return (
    <div className="flex items-start space-x-3">
      <div className="text-xl">{getIcon()}</div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="font-medium">{activity.title}</h4>
          <span className="text-sm text-gray-500">{activity.time}</span>
        </div>
        <p className="text-gray-600 text-sm">{activity.description}</p>
        {activity.amount && (
          <p className="text-sm font-medium text-green-600">
            ${activity.amount.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
