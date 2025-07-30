import React from "react";
import { CheckCircle, Mail, Phone, Calendar, Clock } from "lucide-react";

interface Activity {
  id: number;
  type: string;
  description: string;
  time: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "sale":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "lead":
        return <Mail className="h-5 w-5 text-blue-500" />;
      case "test-drive":
        return <Calendar className="h-5 w-5 text-purple-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-2 px-4 p-2">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {activity.description}
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>{activity.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
