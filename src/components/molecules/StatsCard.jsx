import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatsCard = ({ title, value, change, icon, trend }) => {
  const trendColor = trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500";
  const trendIcon = trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus";

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-3 rounded-lg text-white">
            <ApperIcon name={icon} className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {value}
            </p>
          </div>
        </div>
        {change && (
          <div className={`flex items-center space-x-1 ${trendColor}`}>
            <ApperIcon name={trendIcon} className="h-4 w-4" />
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatsCard;